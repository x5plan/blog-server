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

export class InvalidRegistrationCodeException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_InvalidRegistrationCode, "Invalid registration code.", HttpStatus.FORBIDDEN);
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

export class RegistrationCodeAlreadyUsedException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.Auth_RegistrationCodeAlreadyUsed, "Registration code already used.", HttpStatus.FORBIDDEN);
    }
}

export class RegistrationCodeLimitExceededException extends AppHttpException {
    constructor() {
        super(
            CE_ErrorCode.Auth_RegistrationCodeLimitExceeded,
            "Registration code limit exceeded.",
            HttpStatus.FORBIDDEN,
        );
    }
}
