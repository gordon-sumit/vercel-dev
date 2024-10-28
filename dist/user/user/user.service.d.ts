import { UserModel } from "../../models/user.model";
import { JwtService } from "@nestjs/jwt";
import { ChallengeNameType } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoIdentity, S3 } from "aws-sdk";
export declare class UserService {
    private user;
    private jwtService;
    private readonly client;
    private readonly identityClient;
    private readonly userPoolId;
    private readonly identityPoolId;
    private readonly bucket;
    constructor(user: typeof UserModel, jwtService: JwtService);
    getUser(): Promise<UserModel[]>;
    login(email: any, pass: any): Promise<UserModel>;
    getUserById(id: any): Promise<UserModel>;
    createUser(userData: any): Promise<any>;
    createCognitoUser(userData: any): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminCreateUserCommandOutput>;
    listCognitoUsers(): Promise<import("@aws-sdk/client-cognito-identity-provider").UserType[]>;
    awsCognitoSignUp(userData: any): Promise<import("@aws-sdk/client-cognito-identity-provider").SignUpCommandOutput>;
    userConfirmSignup(username: any, confirmationCode: any): Promise<import("@aws-sdk/client-cognito-identity-provider").ConfirmSignUpCommandOutput>;
    adminConfirmSignUp(): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminUpdateUserAttributesCommandOutput>;
    cognitoLogin(email: any, password: any): Promise<{
        qr: string;
        Session: string;
        ChallengeName?: ChallengeNameType;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    } | {
        resourceAccessCreds: import("aws-sdk/lib/request").PromiseResult<CognitoIdentity.GetCredentialsForIdentityResponse, import("aws-sdk").AWSError>;
        ChallengeName?: ChallengeNameType;
        Session?: string;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    }>;
    AssociateSoftwareToken(session: any, email: any): Promise<{
        qr: string;
        newSession: string;
    }>;
    verifySoftwareToken(data: any): Promise<{
        resourceAccessCreds: import("aws-sdk/lib/request").PromiseResult<CognitoIdentity.GetCredentialsForIdentityResponse, import("aws-sdk").AWSError>;
        ChallengeName?: ChallengeNameType;
        Session?: string;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    }>;
    generateQRCode(secretCode: string, accountName: string): Promise<string>;
    respondToAuthChallenge(data: any, challengeName?: any): Promise<{
        resourceAccessCreds: import("aws-sdk/lib/request").PromiseResult<CognitoIdentity.GetCredentialsForIdentityResponse, import("aws-sdk").AWSError>;
        ChallengeName?: ChallengeNameType;
        Session?: string;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    }>;
    deleteCognitoUser(ids: any): Promise<void>;
    getCognitoUser(): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminGetUserCommandOutput>;
    getTempCredWithIdentityPool(token: any): Promise<import("aws-sdk/lib/request").PromiseResult<CognitoIdentity.GetCredentialsForIdentityResponse, import("aws-sdk").AWSError>>;
    getS3Files(tempCredentials: any): Promise<import("aws-sdk/lib/request").PromiseResult<S3.ListObjectsV2Output, import("aws-sdk").AWSError>>;
}
