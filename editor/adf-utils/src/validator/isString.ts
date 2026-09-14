// This is a kludge, might replace with something like _.isString in future
export const isString = (s: unknown): s is string => typeof s === 'string' || s instanceof String;
