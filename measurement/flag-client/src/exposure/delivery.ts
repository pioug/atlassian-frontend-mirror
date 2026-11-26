/**
 * The entry point of the exposure delivery subsystem.
 *
 * Only `delivery-loader.ts` imports this module, so everything reachable from it — mapping, OTLP
 * encoding, batching, retry, and `localStorage` persistence — enters the client through that one
 * edge. The import is static: a dynamic import adds a chunk manifest that reads `import.meta.url`,
 * which breaks bundles loaded as classic scripts, such as Jira's early entry scripts. Not part of
 * the public API.
 */
export { createExposureEnvironment } from './environment';
export { createExposureLogger } from './logger';
export { mapExposureRecord } from './mapper';

export { initializeExposureHash } from './digest';
