import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch } from "@nestjs/common";
import { GoogleRecaptchaException } from "@nestlab/google-recaptcha";
import type { Response } from "express";

import { RecaptchaErrorException } from "@/common/exception/recaptcha-error.exception";

@Catch(GoogleRecaptchaException)
export class RecaptchaFilter implements ExceptionFilter {
    public catch(exception: GoogleRecaptchaException, host: ArgumentsHost) {
        if (host.getType() === "http") {
            const response = host.switchToHttp().getResponse<Response>();
            const e = new RecaptchaErrorException();
            response.status(e.getStatus()).send(e.getResponse());
        }
    }
}
