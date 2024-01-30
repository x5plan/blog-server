import { HttpStatus } from "@nestjs/common";

import { AppHttpException } from "./app-http.exception";
import { CE_ErrorCode } from "./code.types";

export class PermissionDeniedException extends AppHttpException {
    constructor(msg?: string) {
        super(CE_ErrorCode.PermissionDenied, msg ?? "Permission denied.", HttpStatus.FORBIDDEN);
    }
}
