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

                let msg: string;

                if (typeof body === "string") {
                    msg = body;
                } else if (typeof body === "object" && "message" in body) {
                    msg = body.message as string;
                } else {
                    msg = "Unknown error";
                }

                appError = new AppHttpException(
                    CE_ErrorCode.Unknown,
                    msg,
                    error.getStatus(),
                    typeof body === "object" && !isProduction() ? body : undefined,
                );
            } else {
                appError = new AppHttpException(
                    CE_ErrorCode.ServerError,
                    error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    isProduction() ? undefined : error?.stack,
                );
            }

            response.status(appError.getStatus()).send(appError.getResponse());
        }
    }
}
