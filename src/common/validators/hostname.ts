import type { IsIpVersion, ValidationOptions } from "class-validator";
import { isFQDN, isIP } from "class-validator";

import { If } from "./if";

type IsFQDNOptions = Parameters<typeof isFQDN>[1];
type IsHostnameOptions = IsFQDNOptions & {
    ipVersion?: IsIpVersion;
};

export function isHostname(value: unknown, options?: IsHostnameOptions): value is string {
    return isIP(value, options?.ipVersion) || isFQDN(value, options);
}

export function IsHostname(options?: IsHostnameOptions, validationOptions?: ValidationOptions) {
    return If((value) => isHostname(value, options), {
        message: ({ property }) => `${property} must be a valid hostname.`,
        ...validationOptions,
    });
}
