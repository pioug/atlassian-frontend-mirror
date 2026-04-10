import { DATA_UNIT } from './models/media';

export const RECENTS_COLLECTION = 'recents';
export const FILE_CACHE_MAX_AGE: number = 60 * 60 * 24 * 30; // Retain for 30 days
export const MAX_RESOLUTION = 4096;
export const CHUNK_SIZE: number = 5 * DATA_UNIT.MB;
export const PROCESSING_BATCH_SIZE = 1000;
export const MAX_UPLOAD_FILE_SIZE: number = 2 * DATA_UNIT.TB;
