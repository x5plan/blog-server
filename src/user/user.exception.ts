import { HttpStatus } from "@nestjs/common";

import { AppHttpException } from "@/common/exception/app-http.exception";
import { CE_ErrorCode } from "@/common/exception/code.types";

export class NoSuchUserException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.User_NoSuchUser, "No such user.", HttpStatus.NOT_FOUND);
    }
}

export class DuplicateUsernameException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.User_DuplicateUsername, "Duplicate username.", HttpStatus.BAD_REQUEST);
    }
}
