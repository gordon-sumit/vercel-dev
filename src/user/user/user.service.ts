import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UserModel} from "../../models/user.model";
import {JwtService} from "@nestjs/jwt";
import {
    AdminCreateUserCommand,
    AdminGetUserCommand,
    AdminUpdateUserAttributesCommand,
    AssociateSoftwareTokenCommand,
    AuthFlowType,
    ChallengeNameType,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    DeliveryMediumType,
    InitiateAuthCommand,
    InvalidPasswordException,
    ListUsersCommand,
    ListUsersCommandInput,
    MessageActionType,
    RespondToAuthChallengeCommand,
    SignUpCommand,
    VerifySoftwareTokenCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {Op} from "sequelize";
import {CognitoIdentity, Credentials, S3} from "aws-sdk";


@Injectable()
export class UserService {
    private readonly client: CognitoIdentityProviderClient;
    private readonly identityClient: CognitoIdentity;
    private readonly userPoolId = process.env.AWS_POOL_ID;
    private readonly identityPoolId = process.env.AWS_COGNITO_INDENTITY_POOL_ID;
    private readonly bucket = process.env.S3_BUCKET_NAME;

    constructor(@InjectModel(UserModel) private user: typeof UserModel, private jwtService: JwtService) {
        this.client = new CognitoIdentityProviderClient({
            region: 'us-east-1',
        });

        this.identityClient = new CognitoIdentity({region: 'us-east-1'});


    }

    async getUser(): Promise<UserModel[]> {
        return this.user.findAll({include: 'schoolUsers'});
    }

    async login(email, pass): Promise<UserModel> {
        return this.user.findOne({where: [{email: email, password: pass}]})
    }

    async getUserById(id): Promise<UserModel> {
        return this.user.findOne({
            where: [{id: id}],
            include: ['schoolUsers', 'userTeams']
        })
    }

    async createUser(userData): Promise<any> {
        const isUserExist = await this.user.findOne({
            where: [{email: userData.email}]
        });
        if (!isUserExist) {
            const cognitoUser = await this.awsCognitoSignUp(userData);
            if (cognitoUser) {
                userData.awsUuid = cognitoUser.UserSub
                await this.user.create(userData)
                console.log(userData, 'cognitoUser')
                return cognitoUser;
            }
        } else {
            const payload = {sub: isUserExist.id, username: isUserExist.email}
            const token = await this.jwtService.signAsync(payload);
            return {access_token: token}
        }
    }

    async createCognitoUser(userData) {
        const phone = userData.phone.replace(/[^\d+]/g, '');
        const input = {
            DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
            MessageAction: MessageActionType.SUPPRESS,
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
        console.log(input)
        try {
            const createCommand = new AdminCreateUserCommand(input);
            return await this.client.send(createCommand);
        } catch (e) {
            if (e instanceof InvalidPasswordException) {
                throw new Error('Password does not meet the required criteria. Please try a stronger password.');
            } else {
                throw e;
            }
        }
    }

    async listCognitoUsers() {
        const params: ListUsersCommandInput = {
            UserPoolId: this.userPoolId,
            Limit: 10,  // You can adjust the limit of users retrieved
        };

        try {
            const command = new ListUsersCommand(params);
            const response = await this.client.send(command);
            return response.Users;  // Return the list of users
        } catch (error) {
            console.log(error)
        }
    }


    async awsCognitoSignUp(userData) {
        console.log(userData)
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
        }
        try {
            const signUpCommand = new SignUpCommand(input);
            return await this.client.send(signUpCommand);
        } catch (e) {
            console.log(e, 'error');
            throw new BadRequestException(e.message);
        }
    }

    async userConfirmSignup(username, confirmationCode) {
        console.log(confirmationCode, 'confirmationCode', username, 'username')
        const params = {
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            ConfirmationCode: confirmationCode,
            Username: username,
            // SecretHash: 'STRING_VALUE',
        };
        try {
            const userConfirmCmd = new ConfirmSignUpCommand(params);
            return await this.client.send(userConfirmCmd);
        } catch (e) {
            throw new UnauthorizedException((e.message));
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
        }
        // const params = {
        //     Password: '123456', /* required */
        //     UserPoolId: this.userPoolId, /* required */
        //     Username: 'Kerry.Howard', /* required */
        //     Permanent: true
        // };


        // try {
        //     const confirmSignUpCommand = new AdminConfirmSignUpCommand(params);
        //     return await this.client.send(confirmSignUpCommand);
        // }catch (e){
        //     console.log(e)
        // }

        // step1
        // try {
        //     const createPassword = new AdminSetUserPasswordCommand(params);
        //     return await this.client.send(createPassword);
        // }catch (e){
        //     console.log(e)
        // }

        //step2
        try {
            const confirmSignUpCommand = new AdminUpdateUserAttributesCommand(params);
            return await this.client.send(confirmSignUpCommand);
        } catch (e) {
            console.log(e)
        }


    }

    async cognitoLogin(email, password) {
        const params = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
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
        const loginCommand = new InitiateAuthCommand(params);
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
                const tempCreds = await this.getTempCredWithIdentityPool(response.AuthenticationResult.IdToken)
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
        }
        const testCommand = new AssociateSoftwareTokenCommand(params);
        const response = await this.client.send(testCommand);
        if (response && response.SecretCode) {
            return {qr: await this.generateQRCode(response.SecretCode, email), newSession: response.Session}
        }
    }

    async verifySoftwareToken(data) {
        const params = {
            UserCode: data.MFACode, /* required */
            Session: data.session
        }
        const testCommand = new VerifySoftwareTokenCommand(params);
        const resp = await this.client.send(testCommand);
        if (resp) {
            return await this.respondToAuthChallenge(
                {
                    username: data.username,
                    MFACode: data.MFACode,
                    session: resp.Session
                },
                ChallengeNameType.MFA_SETUP)
        }

    }

    async generateQRCode(secretCode: string, accountName: string): Promise<string> {
        const issuer = 'vercel-demo-app';
        return `otpauth://totp/${encodeURIComponent(accountName)}?secret=${secretCode}&issuer=${encodeURIComponent(issuer)}`;
    }

    async respondToAuthChallenge(data, challengeName = null) {
        const params = {
            ChallengeName: challengeName || ChallengeNameType.SOFTWARE_TOKEN_MFA,
            ClientId: process.env.AWS_COGNITO_CLIENT_ID,
            ChallengeResponses: {
                USERNAME: data.username,
                SOFTWARE_TOKEN_MFA_CODE: data.MFACode, // The code from the authenticator app
            },
            Session: data.session,
            UserContextData: {
                EncodedData: "AmazonCognitoAdvancedSecurityData_object",
                IpAddress: "192.0.2.1"
            }
        }
        const cmd = new RespondToAuthChallengeCommand(params);
        const response = await this.client.send(cmd);
        const tempCreds = await this.getTempCredWithIdentityPool(response.AuthenticationResult.IdToken)

        return {...response, resourceAccessCreds: tempCreds};
    }

    async deleteCognitoUser(ids) {

        const users = await this.user.findAll({
            where:
                {
                    awsUuid:
                        {[Op.in]: ids}
                }
        });

        if (!users.length) throw new NotFoundException('User Not Found!')
        users.map(async (user) => {
            const params = {
                UserPoolId: this.userPoolId,
                Username: `${user.firstName}.${user.lastName}`
            };
            try {
                // const deleteCmd = new AdminDeleteUserCommand(params);
                return await this.user.destroy({where: {id: user.id}})
                //return await this.client.send(deleteCmd);
            } catch (e) {
                throw new BadRequestException(e.message)
            }
        });
    }

    async getCognitoUser() {
        const params = {
            UserPoolId: this.userPoolId,
            Username: 'STRING_VALUE'
        };
        try {
            const getUserCmd = new AdminGetUserCommand(params);
            return await this.client.send(getUserCmd);
        } catch (e) {
            throw new NotFoundException(e.message)
        }
    }

    async getTempCredWithIdentityPool(token) {
        const params = {
            IdentityPoolId: process.env.AWS_COGNITO_INDENTITY_POOL_ID,
            Logins: {
                [`cognito-idp.us-east-1.amazonaws.com/${process.env.AWS_POOL_ID}`]: token
            },
        }
        console.log(params, 'paramsparams')
        try {
            const {IdentityId} = await this.identityClient.getId({
                IdentityPoolId: params.IdentityPoolId,
                Logins: params.Logins,
            }).promise();

            const credentialsResponse = await this.identityClient.getCredentialsForIdentity({
                IdentityId,
                Logins: params.Logins,
            }).promise();

            console.log('Temporary Credentials:', credentialsResponse);
            return credentialsResponse;
        } catch (e) {
            console.log('Error: ', e.message)
        }
    }

    async getS3Files(tempCredentials) {
        try {
            const credentials = await new Credentials(
                {
                    accessKeyId: String(tempCredentials.AccessKeyId),
                    secretAccessKey: String(tempCredentials.SecretKey),
                    sessionToken: String(tempCredentials.SessionToken),
                });

            const s3 = new S3({
                region: 'us-west-2',
                credentials: credentials,
            });
            const objects = await s3.listObjectsV2({
                Bucket: this.bucket,
            }).promise();

            if (objects.Contents) {
                // Update objects.Contents with the array including preSignedUrl
                objects.Contents = await Promise.all(
                    objects.Contents.map(async (item) => {
                        const signedUrl = await s3.getSignedUrlPromise('getObject', {
                            Bucket: this.bucket,
                            Key: item.Key,
                            Expires: 3600,
                        });
                        return {...item, preSignedUrl: signedUrl};
                    })
                );
            }
            return objects;
        } catch (e) {
           throw new BadRequestException(e.message)
        }
    }
}
