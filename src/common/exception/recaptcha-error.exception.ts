import { AppHttpException } from "./app-http.exception";
import { CE_ErrorCode } from "./code.types";

export class RecaptchaErrorException extends AppHttpException {
    constructor() {
        super(CE_ErrorCode.RecaptchaError, "Recaptcha Error", 400);
    }
}
