/**
 * @param value a value to check
 * @returns true if the value is undefined, null, or NaN
 * @description Check if the value is undefined, null, or NaN. "", 0, false, and [] are not considered as empty.
 */
function isEmptyValue(value: unknown): boolean {
    return value === undefined || value === null || (typeof value === "number" && isNaN(value));
}

/**
 *
 * @param values values to check, separated by comma
 * @returns true if all values are undefined, null, or NaN
 * @description Check if all values are undefined, null, or NaN. "", 0, false, and [] are not considered as empty.
 */
export function isEmptyValues(...values: unknown[]) {
    return values.every((value) => isEmptyValue(value));
}

/**
 * @param values values to check, separated by comma
 * @returns true if any value is undefined, null, or NaN
 * @description Check if any value is undefined, null, or NaN. "", 0, false, and [] are not considered as empty.
 */
export function hasEmptyValue(...values: unknown[]) {
    return values.some((value) => isEmptyValue(value));
}

/**
 * @param obj An object to check
 * @param keys Keys to check
 * @returns true if the object has all of the keys
 * @description Check if the object has all of the keys
 */
export function hasAllOfKeys<T extends object>(obj: T, ...keys: (keyof T)[]) {
    return keys.every((key) => obj.hasOwnProperty(key));
}

/**
 * @param obj An object to check
 * @param keys Keys to check
 * @returns true if the object has any of the keys
 * @description Check if the object has any of the keys
 */
export function hasOneOfKeys<T extends object>(obj: T, ...keys: (keyof T)[]) {
    return keys.some((key) => obj.hasOwnProperty(key));
}
