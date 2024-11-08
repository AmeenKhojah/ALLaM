import * as admin from "firebase-admin";
admin.initializeApp();

export {
    loginWithGoogle,
    hello
} from "./auth";

export {
    ChatFunction,
} from "./chat";

export {
    GetToken,
    sendPrompt
} from "./allam";



