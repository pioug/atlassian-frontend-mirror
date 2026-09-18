/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { StorageClient } from './StorageClient';

export type { GetStoredItemOptions } from './types';

/**
 * @deprecated Use `import { DEFAULT_STORAGE_ENGINE } from '@atlaskit/frontend-utilities/storage-client/constants'` instead.
 */
export { DEFAULT_STORAGE_ENGINE } from './constants';
export default StorageClient;
/**
 * @deprecated Use `import { StorageClient } from '@atlaskit/frontend-utilities'` instead.
 */
export { StorageClient } from './StorageClient';
