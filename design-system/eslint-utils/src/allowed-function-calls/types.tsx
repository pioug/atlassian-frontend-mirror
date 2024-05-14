/**
 * Each key is a package name, each value is an array of allowed imports from that package.
 */
export type AllowList = Partial<Record<string, string[]>>;
