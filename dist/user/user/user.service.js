"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../../models/user.model");
const jwt_1 = require("@nestjs/jwt");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const sequelize_2 = require("sequelize");
const aws_sdk_1 = require("aws-sdk");
let UserService = class UserService {
    constructor(user, jwtService) {
        this.user = user;
        this.jwtService = jwtService;
        this.userPoolId = process.env.AWS_POOL_ID;
        this.identityPoolId = process.env.AWS_COGNITO_INDENTITY_POOL_ID;
        this.bucket = process.env.S3_BUCKET_NAME;
        this.client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region: 'us-east-1',
        });
        this.identityClient = new aws_sdk_1.CognitoIdentity({ region: 'us-east-1' });
    }
    async getUser() {
        return this.user.findAll({ include: 'schoolUsers' });
    }
    async login(email, pass) {
        return this.user.findOne({ where: [{ email: email, password: pass }] });
    }
    async getUserById(id) {
        return this.user.findOne({
            where: [{ id: id }],
            include: ['schoolUsers', 'userTeams']
        });
    }
    async createUser(userData) {
        const isUserExist = await this.user.findOne({
            where: [{ email: userData.email }]
        });
        if (!isUserExist) {
            const cognitoUser = await this.awsCognitoSignUp(userData);
            if (cognitoUser) {
                userData.awsUuid = cognitoUser.UserSub;
                await this.user.create(userData);
                console.log(userData, 'cognitoUser');
                return cognitoUser;
            }
        }
        else {
            const payload = { sub: isUserExist.id, username: isUserExist.email };
            const token = await this.jwtService.signAsync(payload);
            return { access_token: token };
        }
    }
    async createCognitoUser(userData) {
        const phone = userData.phone.replace(/[^\d+]/g, '');
        const input = {
            DesiredDeliveryMediums: [client_cognito_identity_provider_1.DeliveryMediumType.EMAIL],
            MessageAction: client_cognito_identity_provider_1.MessageActionType.SUPPRESS,
            TemporaryPassword: userData.password,
            UserAttributes: [
                {
                    Name: "name",
                    Value: `${userData.firstName} ${userData.lastName}`
                },
                {
                    Name: "given_name",
                    Value: userData.firstName
                },
                {
                    Name: "family_name",
                    Value: userData.lastName
                },
                {
                    Name: "phone_number",
                    Value: phone.trim()
                },
                {
                    Name: "email",
                    Value: userData.email
                },
                {
                    Name: "address",
                    Value: userData.address
                },
                {
                    Name: "gender",
                    Value: "male"
                }
            ],
            ForceAliasCreation: true,
            UserPoolId: this.userPoolId,
            Username: `${userData.firstName}.${userData.lastName}`
        };
        console.log(input);
        try {
            const createCommand = new client_cognito_identity_provider_1.AdminCreateUserCommand(input);
            return await this.client.send(createCommand);
        }
        catch (e) {
            if (e instanceof client_cognito_identity_provider_1.InvalidPasswordException) {
                throw new Error('Password does not meet the required criteria. Please try a stronger password.');
            }
            else {
                throw e;
            }
        }
    }
    async listCognitoUsers() {
        const params = {
            UserPoolId: this.userPoolId,
            Limit: 10,
        };
        try {
            const command = new client_cognito_identity_provider_1.ListUsersCommand(params);
            const response = await this.client.send(command);
            return response.Users;
        }
        catch (error) {
            console.log(error);
        }
    }
    async awsCognitoSignUp(userData) {
        console.log(userData);
        const phone = userData.phone.replace(/[^\d+]/g, '');
        const input = {
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            Username: `${userData.firstName}.${userData.lastName}`,
            Password: userData.password,
            UserAttributes: [
                {
                    Name: "address",
                    Value: userData.address
                },
                {
                    Name: "birthdate",
                    Value: "16-08-1987"
                },
                {
                    Name: "gender",
                    Value: "male"
                },
                {
                    Name: "updated_at",
                    Value: Math.floor(Date.now() / 1000).toString()
                },
                {
                    Name: "phone_number",
                    Value: phone.trim()
                },
                {
                    Name: "email",
                    Value: userData.email
                },
                {
                    Name: "given_name",
                    Value: userData.firstName
                },
                {
                    Name: "family_name",
                    Value: userData.lastName
                },
            ],
        };
        try {
            const signUpCommand = new client_cognito_identity_provider_1.SignUpCommand(input);
            return await this.client.send(signUpCommand);
        }
        catch (e) {
            console.log(e, 'error');
            throw new common_1.BadRequestException(e.message);
        }
    }
    async userConfirmSignup(username, confirmationCode) {
        console.log(confirmationCode, 'confirmationCode', username, 'username');
        const params = {
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            ConfirmationCode: confirmationCode,
            Username: username,
        };
        try {
            const userConfirmCmd = new client_cognito_identity_provider_1.ConfirmSignUpCommand(params);
            return await this.client.send(userConfirmCmd);
        }
        catch (e) {
            throw new common_1.UnauthorizedException((e.message));
        }
    }
    async adminConfirmSignUp() {
        const params = {
            UserPoolId: this.userPoolId,
            Username: 'Kerry.Howard',
            UserAttributes: [
                {
                    Name: 'email_verified',
                    Value: 'true'
                },
            ],
        };
        try {
            const confirmSignUpCommand = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand(params);
            return await this.client.send(confirmSignUpCommand);
        }
        catch (e) {
            console.log(e);
        }
    }
    async cognitoLogin(email, password) {
        const params = {
            AuthFlow: client_cognito_identity_provider_1.AuthFlowType.USER_PASSWORD_AUTH,
            AuthParameters: {
                "PASSWORD": password,
                "USERNAME": email,
            },
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            UserContextData: {
                EncodedData: "AmazonCognitoAdvancedSecurityData_object",
                IpAddress: "192.0.2.1"
            }
        };
        const loginCommand = new client_cognito_identity_provider_1.InitiateAuthCommand(params);
        const response = await this.client.send(loginCommand);
        if (response) {
            if (response.ChallengeName === 'MFA_SETUP') {
                const MFASetupResponse = await this.AssociateSoftwareToken(response.Session, email);
                return {
                    ...response,
                    qr: MFASetupResponse.qr,
                    Session: MFASetupResponse.newSession,
                };
            }
            if (response.AuthenticationResult && response.AuthenticationResult.IdToken) {
                const tempCreds = await this.getTempCredWithIdentityPool(response.AuthenticationResult.IdToken);
                return {
                    ...response,
                    resourceAccessCreds: tempCreds
                };
            }
        }
    }
    async AssociateSoftwareToken(session, email) {
        const params = {
            Session: session
        };
        const testCommand = new client_cognito_identity_provider_1.AssociateSoftwareTokenCommand(params);
        const response = await this.client.send(testCommand);
        if (response && response.SecretCode) {
            return { qr: await this.generateQRCode(response.SecretCode, email), newSession: response.Session };
        }
    }
    async verifySoftwareToken(data) {
        const params = {
            UserCode: data.MFACode,
            Session: data.session
        };
        const testCommand = new client_cognito_identity_provider_1.VerifySoftwareTokenCommand(params);
        const resp = await this.client.send(testCommand);
        if (resp) {
            return await this.respondToAuthChallenge({
                username: data.username,
                MFACode: data.MFACode,
                session: resp.Session
            }, client_cognito_identity_provider_1.ChallengeNameType.MFA_SETUP);
        }
    }
    async generateQRCode(secretCode, accountName) {
        const issuer = 'vercel-demo-app';
        return `otpauth://totp/${encodeURIComponent(accountName)}?secret=${secretCode}&issuer=${encodeURIComponent(issuer)}`;
    }
    async respondToAuthChallenge(data, challengeName = null) {
        const params = {
            ChallengeName: challengeName || client_cognito_identity_provider_1.ChallengeNameType.SOFTWARE_TOKEN_MFA,
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            ChallengeResponses: {
                USERNAME: data.username,
                SOFTWARE_TOKEN_MFA_CODE: data.MFACode,
            },
            Session: data.session,
            UserContextData: {
                EncodedData: "AmazonCognitoAdvancedSecurityData_object",
                IpAddress: "192.0.2.1"
            }
        };
        const cmd = new client_cognito_identity_provider_1.RespondToAuthChallengeCommand(params);
        const response = await this.client.send(cmd);
        const tempCreds = await this.getTempCredWithIdentityPool(response.AuthenticationResult.IdToken);
        return { ...response, resourceAccessCreds: tempCreds };
    }
    async deleteCognitoUser(ids) {
        const users = await this.user.findAll({
            where: {
                awsUuid: { [sequelize_2.Op.in]: ids }
            }
        });
        if (!users.length)
            throw new common_1.NotFoundException('User Not Found!');
        users.map(async (user) => {
            const params = {
                UserPoolId: this.userPoolId,
                Username: `${user.firstName}.${user.lastName}`
            };
            try {
                return await this.user.destroy({ where: { id: user.id } });
            }
            catch (e) {
                throw new common_1.BadRequestException(e.message);
            }
        });
    }
    async getCognitoUser() {
        const params = {
            UserPoolId: this.userPoolId,
            Username: 'STRING_VALUE'
        };
        try {
            const getUserCmd = new client_cognito_identity_provider_1.AdminGetUserCommand(params);
            return await this.client.send(getUserCmd);
        }
        catch (e) {
            throw new common_1.NotFoundException(e.message);
        }
    }
    async getTempCredWithIdentityPool(token) {
        const params = {
            IdentityPoolId: process.env.AWS_COGNITO_INDENTITY_POOL_ID,
            Logins: {
                [`cognito-idp.us-east-1.amazonaws.com/${process.env.AWS_POOL_ID}`]: token
            },
        };
        console.log(params, 'paramsparams');
        try {
            const { IdentityId } = await this.identityClient.getId({
                IdentityPoolId: params.IdentityPoolId,
                Logins: params.Logins,
            }).promise();
            const credentialsResponse = await this.identityClient.getCredentialsForIdentity({
                IdentityId,
                Logins: params.Logins,
            }).promise();
            console.log('Temporary Credentials:', credentialsResponse);
            return credentialsResponse;
        }
        catch (e) {
            console.log('Error: ', e.message);
        }
    }
    async getS3Files(tempCredentials) {
        try {
            const credentials = await new aws_sdk_1.Credentials({
                accessKeyId: String(tempCredentials.AccessKeyId),
                secretAccessKey: String(tempCredentials.SecretKey),
                sessionToken: String(tempCredentials.SessionToken),
            });
            const s3 = new aws_sdk_1.S3({
                region: 'us-west-2',
                credentials: credentials,
            });
            const objects = await s3.listObjectsV2({
                Bucket: this.bucket,
            }).promise();
            if (objects.Contents) {
                objects.Contents = await Promise.all(objects.Contents.map(async (item) => {
                    const signedUrl = await s3.getSignedUrlPromise('getObject', {
                        Bucket: this.bucket,
                        Key: item.Key,
                        Expires: 3600,
                    });
                    return { ...item, preSignedUrl: signedUrl };
                }));
            }
            return objects;
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map