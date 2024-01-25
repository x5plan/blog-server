import type { OnModuleInit } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

import { ConfigService } from "@/config/config.service";

@Injectable()
export class RedisService implements OnModuleInit {
    private readonly client: Redis;
    private readonly untilReadyPromise: Promise<void>;

    constructor(private readonly configService: ConfigService) {
        this.client = new Redis(this.configService.config.redis, {
            enableReadyCheck: true,
        });

        this.untilReadyPromise = new Promise((resolve, reject) => {
            this.client.once("ready", resolve);
            this.client.once("error", reject);
        });
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public async onModuleInit(): Promise<void> {
        try {
            await this.untilReadyPromise;
        } catch (e) {
            throw new Error(`Could not connect to Redis service: ${e}`);
        }
    }

    public getClient(): Redis {
        return this.client.duplicate();
    }
}
