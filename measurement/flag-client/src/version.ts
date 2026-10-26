/** Package identity used for telemetry. Not part of the public API. */

/**
 * The npm package name, injected at build time from `package.json`; also the exposure
 * Instrumentation Scope name.
 */
export const PACKAGE_NAME: string = process.env._PACKAGE_NAME_ as string;

/** The npm package version, injected at build time from `package.json`. */
export const PACKAGE_VERSION: string = process.env._PACKAGE_VERSION_ as string;
