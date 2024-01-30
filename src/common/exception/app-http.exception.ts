import { HttpException, HttpStatus } from "@nestjs/common";

import type { CE_ErrorCode } from "./code.types";

export class AppHttpException extends HttpException {
    constructor(
        code: CE_ErrorCode | number,
        msg?: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
        extra?: unknown,
    ) {
        super({ code, msg, extra }, status);
    }
}
