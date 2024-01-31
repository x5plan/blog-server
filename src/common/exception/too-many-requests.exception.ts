import { HttpStatus } from "@nestjs/common";

import { AppHttpException } from "./app-http.exception";
import { CE_ErrorCode } from "./code.types";

export class TooManyRequestsException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.TooManyRequests, "Too many requests", HttpStatus.TOO_MANY_REQUESTS);
    }
}
