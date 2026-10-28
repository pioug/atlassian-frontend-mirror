/**
 * The entry point of the exposure delivery subsystem.
 *
 * The client imports this module on demand, so everything reachable from it — mapping, OTLP
 * encoding, batching, retry, and `localStorage` persistence — stays out of the bundle a product
 * loads before its first paint. Nothing on the client's read path may import it statically. Not part
 * of the public API.
 */
export { createExposureEnvironment } from './environment';
export { createExposureLogger } from './logger';
export { mapExposureRecord } from './mapper';
