// This is an entrypoint, any exports are considered part of the public API
// Avoid exporting functions that directly depend on fetch-mock so it can remain as a devDependency

/** @deprecated Use @atlaskit/link-test-helpers/mocks/available-sites-result */
export { mockedAvailableSitesResult } from './available-sites-result';

/** @deprecated Use @atlaskit/link-test-helpers/mocks/accessible-products-result */
export { mockedAccessibleProductsResult } from './accessible-products-result';
