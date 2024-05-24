// check undefined and NaN. null and "" are excused
export function isEmptyValues(...values: unknown[]) {
    return values.reduce((pre, cur) => pre && (cur === undefined || (typeof cur === "number" && isNaN(cur))), true);
}

// check undefined and NaN. null and "" are excused
export function hasEmptyValue(...values: unknown[]) {
    return values.reduce((pre, cur) => pre || cur === undefined || (typeof cur === "number" && isNaN(cur)), false);
}

export function hasAllOfKeys<T extends object>(obj: T, ...keys: (keyof T)[]) {
    return keys.reduce((pre, cur) => pre && obj.hasOwnProperty(cur), true);
}

export function hasOneOfKeys<T extends object>(obj: T, ...keys: (keyof T)[]) {
    return keys.reduce((pre, cur) => pre || obj.hasOwnProperty(cur), false);
}
