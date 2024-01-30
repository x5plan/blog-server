import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import type { Response } from "express";

import { AppHttpException } from "@/common/exception/app-http.exception";
import { CE_ErrorCode } from "@/common/exception/code.types";

import { isProduction } from "./common/utils/env";

@Catch()
export class ErrorFilter implements ExceptionFilter {
    public catch(error: Error, host: ArgumentsHost) {
        const contextType = host.getType();
        if (contextType === "http") {
            const response = host.switchToHttp().getResponse<Response>();

            let appError: AppHttpException;

            if (error instanceof AppHttpException) {
                appError = error;
            } else if (error instanceof HttpException) {
                const body = error.getResponse();
                appError = new AppHttpException(
                    CE_ErrorCode.Unknown,
                    typeof body === "string" && !isProduction() ? body : undefined,
                    error.getStatus(),
                    typeof body === "object" && !isProduction() ? body : undefined,
                );
            } else {
                appError = new AppHttpException(
                    CE_ErrorCode.Unknown,
                    String(error),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    isProduction() ? undefined : error?.stack,
                );
            }

            response.status(appError.getStatus()).send(appError.getResponse());
        }
    }
}
