/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { DEFAULT_CONFIG } from '../constants';
import { PublicApiClient } from './PublicApiClient';

// eslint-disable-next-line import/no-anonymous-default-export
const _default_1: PublicApiClient = new PublicApiClient(DEFAULT_CONFIG.publicApiRoot);

export default _default_1;

/**
 * @deprecated Use `import { PublicApiClient } from '@atlaskit/teams-client/public-api-client'` instead.
 */
export { PublicApiClient } from './PublicApiClient';
