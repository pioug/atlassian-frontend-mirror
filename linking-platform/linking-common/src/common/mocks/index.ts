/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// This is an entrypoint, any exports are considered part of the public API
// Avoid exporting functions that directly depend on fetch-mock so it can remain as a devDependency

/** @deprecated Use @atlaskit/link-test-helpers/mocks/available-sites-result */
/**
 * @deprecated Use `import { mockedAvailableSitesResult } from '@atlaskit/linking-common/available-sites-result'` instead.
 */
export { mockedAvailableSitesResult } from './available-sites-result';

/** @deprecated Use @atlaskit/link-test-helpers/mocks/accessible-products-result */
/**
 * @deprecated Use `import { mockedAccessibleProductsResult } from '@atlaskit/linking-common/accessible-products-result'` instead.
 */
export { mockedAccessibleProductsResult } from './accessible-products-result';
