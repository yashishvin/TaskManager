import { PublicClientApplication } from "@azure/msal-browser";

const MSAL_CONFIG = {
    auth: {
        clientId: "eebd07a2-842b-4ec4-8c5f-a6edceb0d746",
        authority: "https://login.microsoftonline.com/Terracloud2.onmicrosoft.com",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};

const LOGIN_REQUEST = {
    scopes: ["openid", "offline_access", "email", "User.Read", "Group.ReadWrite.All","Group.Read.All","GroupMember.ReadWrite.All", "Directory.Read.All","profile"]
};

const TOKEN_REQUEST = {
    scopes: ["User.ReadWrite.All","Group.ReadWrite.All",'Directory.Read.All']
};

const GRAPH_CONFIG = {
    graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users"
};

const PUBLIC_CLIENT_APPLICATION = new PublicClientApplication(MSAL_CONFIG);
async function initializeMsal() {
    await PUBLIC_CLIENT_APPLICATION.initialize();
}
initializeMsal();

export {
    MSAL_CONFIG,
    LOGIN_REQUEST,
    TOKEN_REQUEST,
    GRAPH_CONFIG,
    PUBLIC_CLIENT_APPLICATION
};