import { DATA_UNIT } from '../models/media';
import { MAX_UPLOAD_FILE_SIZE } from '../constants';

export const fileSizeError = 'fileSizeExceedsLimit';

/**
 * This is a helper to dynamically calculate the chunk size for a given file size.
 *
 * @param fileSize The size of a file to calculate the chunk size for.
 * @returns A number of bytes per chunk or Throws an Error if the file size exceeds 2TB
 *
 * @see {@link https://product-fabric.atlassian.net/wiki/spaces/FIL/pages/3221881143/Rule+of+thumb+for+chunk+sizes#Given-the-following-conditions}
 *
 */

export const calculateChunkSize = (fileSize: number): number => {
	if (fileSize > MAX_UPLOAD_FILE_SIZE) {
		throw new Error(fileSizeError);
	}

	if (fileSize <= 5 * DATA_UNIT.GB) {
		return 5 * DATA_UNIT.MB;
	}

	if (fileSize > 5 * DATA_UNIT.GB && fileSize <= 50 * DATA_UNIT.GB) {
		return 50 * DATA_UNIT.MB;
	}

	if (fileSize > 50 * DATA_UNIT.GB && fileSize <= 0.95 * DATA_UNIT.TB) {
		return 100 * DATA_UNIT.MB;
	}

	return 210 * DATA_UNIT.MB;
};
