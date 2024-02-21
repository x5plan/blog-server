import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { readFileSync } from "fs";
import { load as loadYaml } from "js-yaml";

import type { AppClientConfigDto } from "./client-config.dto";
import { AppConfig } from "./config.schema";

@Injectable()
export class ConfigService {
    public readonly config: AppConfig;

    constructor() {
        const configFilePath = process.env.X5PLAN_BLOG_CONFIG || "./config.yaml";
        const rawConfig = loadYaml(readFileSync(configFilePath, "utf-8"));
        this.config = this.validateConfig(rawConfig);
    }

    private validateConfig(rawConfig: unknown): AppConfig {
        const config = plainToInstance(AppConfig, rawConfig);

        const errors = validateSync(config, {
            validationError: { target: false },
        });

        if (errors && errors.length > 0) {
            throw new Error(`Invalid config: ${JSON.stringify(errors)}`);
        }

        return config;
    }

    public getClientConfig(): AppClientConfigDto {
        return {
            appName: this.config.appName,
            recaptchaEnabled: this.config.security.recaptcha.enabled,
            recaptchaSiteKey: this.config.security.recaptcha.siteKey,
            useRecaptchaNet: this.config.security.recaptcha.useRecaptchaNet,
        };
    }
}
