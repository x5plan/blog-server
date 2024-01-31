import { GoogleRecaptchaModule, GoogleRecaptchaNetwork } from "@nestlab/google-recaptcha";

import type { IRequestWithSession } from "@/auth/auth.middleware";
import { isProduction } from "@/common/utils/env";
import { ConfigModule } from "@/config/config.module";
import { ConfigService } from "@/config/config.service";

export const recaptchaProviders = [
    GoogleRecaptchaModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            debug: !isProduction(),
            secretKey: configService.config.security.recaptcha.secretKey || "X",
            response: (req: IRequestWithSession) => String(req.headers["x-recaptcha-token"]),
            skipIf: () => !configService.config.security.recaptcha.enabled,
            network: configService.config.security.recaptcha.useRecaptchaNet
                ? GoogleRecaptchaNetwork.Recaptcha
                : GoogleRecaptchaNetwork.Google,
        }),
        inject: [ConfigService],
    }),
];
