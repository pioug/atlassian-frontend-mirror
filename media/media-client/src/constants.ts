import { DATA_UNIT } from './models/media';

export const RECENTS_COLLECTION = 'recents';
export const FILE_CACHE_MAX_AGE = 60 * 60 * 24 * 30; // Retain for 30 days
export const MAX_RESOLUTION = 4096;
export const CHUNK_SIZE = 5 * DATA_UNIT.MB;
export const PROCESSING_BATCH_SIZE = 1000;
export const MAX_UPLOAD_FILE_SIZE = 2 * DATA_UNIT.TB;
