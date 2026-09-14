/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type Chunkinator } from './domain';
import { getObservableFromFile } from './getObservableFromFile';

/**
 * @deprecated Use `import { getObservableFromFile } from '@atlaskit/chunkinator/getObservableFromFile'` instead.
 */
export { getObservableFromFile };

export const chunkinator: Chunkinator = (file, options, callbacks) => {
	return getObservableFromFile(file, options, callbacks);
};
