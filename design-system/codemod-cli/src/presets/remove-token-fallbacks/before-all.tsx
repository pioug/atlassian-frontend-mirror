/* eslint-disable no-console */
import { type RemoveTokenFallbackOptions } from './types';
import { clearFolder } from './utils/clear-folder';

export async function beforeAll(options: RemoveTokenFallbackOptions): Promise<void> {
	if (options.reportFolder) {
		await clearFolder(options.reportFolder);
	}
}
