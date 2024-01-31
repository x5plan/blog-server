import { HttpStatus } from "@nestjs/common";
import type { ValidationError } from "class-validator";

import { AppHttpException } from "./app-http.exception";
import { CE_ErrorCode } from "./code.types";

export class ValidationErrorException extends AppHttpException {
    constructor(validationErrors: ValidationError[]) {
        super(CE_ErrorCode.ValidationError, "Validation Error", HttpStatus.BAD_REQUEST, validationErrors);
    }
}
