import { HttpStatus } from "@nestjs/common";

import { AppHttpException } from "@/common/exception/app-http.exception";
import { CE_ErrorCode } from "@/common/exception/code.types";

export class NoSuchUserException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_NoSuchUser, "No such user.", HttpStatus.NOT_FOUND);
    }
}

export class WrongPasswordException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_WrongPassword, "Wrong password.", HttpStatus.FORBIDDEN);
    }
}

export class DuplicateUsernameException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_DuplicateUsername, "Duplicate username.", HttpStatus.CONFLICT);
    }
}

export class DuplicateEmailException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_DuplicateEmail, "Duplicate email.", HttpStatus.CONFLICT);
    }
}

export class InvalidEmailVerificationCodeException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_InvalidEmailVerificationCode, "Invalid email verification code.", HttpStatus.FORBIDDEN);
    }
}

export class InvalidateRegistrationCodeException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_InvalidateRegistrationCode, "Invalidate registration code.", HttpStatus.FORBIDDEN);
    }
}

export class EmailVerificationCodeRateLimitedException extends AppHttpException {
    constructor() {
        super(
            CE_ErrorCode.Auth_EmailVerificationCodeRateLimited,
            "Email verification code rate limited.",
            HttpStatus.FORBIDDEN,
        );
    }
}
