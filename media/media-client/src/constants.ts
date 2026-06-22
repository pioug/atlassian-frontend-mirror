import { DATA_UNIT } from './models/media';

export const RECENTS_COLLECTION = 'recents';
export const FILE_CACHE_MAX_AGE: number = 60 * 60 * 24 * 30; // Retain for 30 days
export const MAX_RESOLUTION = 4096;
export const CHUNK_SIZE: number = 5 * DATA_UNIT.MB;
export const PROCESSING_BATCH_SIZE = 1000;
export const MAX_UPLOAD_FILE_SIZE: number = 2 * DATA_UNIT.TB;

/**
 * Sentinel error name used when a `FileReader`/upload failure cannot be attributed
 * to a concrete `DOMException` (e.g. `reader.error` is `null` or has an empty name).
 *
 * This value ends up as the analytics `errorDetail`/`failReason`, so it is an
 * implicit contract that dashboards/SLO filters key off. It lives here (a public
 * `@atlaskit/media-client/constants` entry point) so both media-client and
 * downstream packages (e.g. media-picker) import a single source of truth rather
 * than re-typing the literal and risking analytics bucket drift.
 */
export const FILE_READER_FALLBACK_ERROR_NAME = 'FileReaderError';
