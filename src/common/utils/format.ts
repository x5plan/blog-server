import util from "util";

export function format(format: string, ...param: unknown[]) {
    return util.format(format, ...param);
}
