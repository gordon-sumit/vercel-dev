import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { S3 } from "aws-sdk";
export declare class UserController {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    getUser(): Promise<import("../../models/user.model").UserModel[]>;
    getUserById(params: any): any;
    createUser(formData: any): Promise<any>;
    confirmUser({ username, code }: {
        username: any;
        code: any;
    }): Promise<import("@aws-sdk/client-cognito-identity-provider").ConfirmSignUpCommandOutput>;
    login({ email, password }: {
        email: any;
        password: any;
    }): Promise<{
        qr: string;
        Session: string;
        ChallengeName?: import("@aws-sdk/client-cognito-identity-provider").ChallengeNameType;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    } | {
        resourceAccessCreds: import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/cognitoidentity").GetCredentialsForIdentityResponse, import("aws-sdk").AWSError>;
        ChallengeName?: import("@aws-sdk/client-cognito-identity-provider").ChallengeNameType;
        Session?: string;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    }>;
    confirm(): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminUpdateUserAttributesCommandOutput>;
    verifySoftwareToken(data: any): Promise<{
        resourceAccessCreds: import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/cognitoidentity").GetCredentialsForIdentityResponse, import("aws-sdk").AWSError>;
        ChallengeName?: import("@aws-sdk/client-cognito-identity-provider").ChallengeNameType;
        Session?: string;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    }>;
    respondToAuthChallenge(data: any): Promise<{
        resourceAccessCreds: import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/cognitoidentity").GetCredentialsForIdentityResponse, import("aws-sdk").AWSError>;
        ChallengeName?: import("@aws-sdk/client-cognito-identity-provider").ChallengeNameType;
        Session?: string;
        ChallengeParameters?: Record<string, string>;
        AuthenticationResult?: import("@aws-sdk/client-cognito-identity-provider").AuthenticationResultType;
        $metadata: import("@smithy/types").ResponseMetadata;
    }>;
    onDeleteUser(ids: any): Promise<void>;
    getAllMedia(temporaryCredentials: any): Promise<import("aws-sdk/lib/request").PromiseResult<S3.ListObjectsV2Output, import("aws-sdk").AWSError>>;
}
