export function getEnv() {
    return process.env;
}

export function isProduction() {
    return getEnv().NODE_ENV === "production";
}
