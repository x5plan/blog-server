import { AppHttpException } from "@/common/exception/app-http.exception";
import { CE_ErrorCode } from "@/common/exception/code.types";

export class NoSuchUserException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_NoSuchUser, "No such user.");
    }
}

export class WrongPasswordException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_WrongPassword, "Wrong password.");
    }
}
