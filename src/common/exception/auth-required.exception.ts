import { HttpStatus } from "@nestjs/common";

import { AppHttpException } from "./app-http.exception";
import { CE_ErrorCode } from "./code.types";

export class AuthRequiredException extends AppHttpException {
    constructor(msg?: string) {
        super(CE_ErrorCode.AuthRequired, msg ?? "Login requirement.", HttpStatus.UNAUTHORIZED);
    }
}
