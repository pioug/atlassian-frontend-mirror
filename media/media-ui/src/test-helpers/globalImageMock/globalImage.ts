declare var global: any;

/**
 * The real `global.Image`, captured before `enableMockGlobalImage` replaces it.
 */
export const globalImage: any = global.Image;
