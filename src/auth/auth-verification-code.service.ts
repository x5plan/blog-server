import { forwardRef, Inject, Injectable } from "@nestjs/common";
import type { Redis } from "ioredis";

import { EmailVerificationCodeRateLimitedException } from "@/auth/auth.exception";
import { format } from "@/common/utils/format";
import { RedisService } from "@/redis/redis.service";

const RATE_LIMIT = 60;
const CODE_VALID_TIME = 60 * 15;

const REDIS_KEY_CODE_RATE_LIMIT = "verification-code-rate-limit:%s:%s"; // type:email
const REDIS_KEY_CODE = "verification-code:%s:%s:%s"; // type:email:code

export enum CE_VerificationCodeType {
    Register,
    ChangeEmail,
    ResetPassword,
}

@Injectable()
export class AuthVerificationCodeService {
    private readonly redis: Redis;

    constructor(
        @Inject(forwardRef(() => RedisService))
        private readonly redisService: RedisService,
    ) {
        this.redis = this.redisService.getClient();
    }

    private generateCode(): string {
        const code = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");
        return code;
    }

    public async generateAsync(type: CE_VerificationCodeType, email: string): Promise<string> {
        const rateLimitKey = format(REDIS_KEY_CODE_RATE_LIMIT, type, email);

        const result = await this.redis.set(rateLimitKey, "1", "EX", RATE_LIMIT, "NX");

        // If rate limit key already exists it will fail
        if (result !== "OK") throw new EmailVerificationCodeRateLimitedException();

        const code = this.generateCode();
        const codeKey = format(REDIS_KEY_CODE, type, email, code);

        await this.redis.set(codeKey, "1", "EX", CODE_VALID_TIME);

        return code;
    }

    public async verifyAsync(type: CE_VerificationCodeType, email: string, code: string): Promise<boolean> {
        return !!(await this.redis.get(format(REDIS_KEY_CODE, type, email, code)));
    }

    public async revokeAsync(type: CE_VerificationCodeType, email: string, code: string): Promise<void> {
        await this.redis.del(format(REDIS_KEY_CODE, type, email, code));
    }
}
