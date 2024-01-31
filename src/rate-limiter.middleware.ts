import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { Request, Response } from "express";
import type { RateLimiterAbstract } from "rate-limiter-flexible";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { TooManyRequestsException } from "@/common/exception/too-many-requests.exception";
import { ConfigService } from "@/config/config.service";

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
    private readonly enabled: boolean;
    private readonly rateLimiter: RateLimiterAbstract;

    constructor(private readonly configService: ConfigService) {
        this.enabled = this.configService.config.security.rateLimit.enabled;
        if (this.enabled) {
            this.rateLimiter = new RateLimiterMemory({
                points: this.configService.config.security.rateLimit.maxRequests,
                duration: this.configService.config.security.rateLimit.durationSeconds,
            });
        }
    }

    public use(req: Request, res: Response, next: () => void) {
        if (this.enabled) {
            this.rateLimiter
                .consume(req.ip as string)
                .then(() => next())
                .catch(() => {
                    const e = new TooManyRequestsException();
                    res.status(e.getStatus()).send(e.getResponse());
                });
        } else {
            next();
        }
    }
}
