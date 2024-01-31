import { HttpException, HttpStatus } from "@nestjs/common";

import { isProduction } from "../utils/env";
import type { CE_ErrorCode } from "./code.types";

export class AppHttpException extends HttpException {
    constructor(errCode: CE_ErrorCode, msg?: string, status: HttpStatus = HttpStatus.BAD_REQUEST, extra?: unknown) {
        super({ errCode, msg, extra: isProduction() ? undefined : extra }, status);
    }
}
