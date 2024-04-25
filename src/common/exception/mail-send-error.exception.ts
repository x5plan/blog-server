import { HttpStatus } from "@nestjs/common";

import { AppHttpException } from "./app-http.exception";
import { CE_ErrorCode } from "./code.types";

export class MailSendErrorException extends AppHttpException {
    constructor(msg?: string) {
        super(CE_ErrorCode.MailSendError, msg ?? "Mail send error.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
