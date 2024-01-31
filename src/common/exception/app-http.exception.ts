import { HttpException, HttpStatus } from "@nestjs/common";

import { isProduction } from "../utils/env";
import type { CE_ErrorCode } from "./code.types";

export class AppHttpException extends HttpException {
    constructor(
        code: CE_ErrorCode | number,
        msg?: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
        extra?: unknown,
    ) {
        super({ code, msg, extra: isProduction() ? undefined : extra }, status);
    }
}
