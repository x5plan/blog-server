// check undefined and NaN. null and "" are excused
export function isEmptyValues(...values: unknown[]) {
    return values.reduce((pre, cur) => pre && (cur === undefined || (typeof cur === "number" && isNaN(cur))), true);
}

// check undefined and NaN. null and "" are excused
export function hasEmptyValue(...values: unknown[]) {
    return values.reduce((pre, cur) => pre || cur === undefined || (typeof cur === "number" && isNaN(cur)), false);
}
