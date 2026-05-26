// This is an entrypoint, any exports are considered part of the public API
// Avoid exporting functions that directly depend on fetch-mock so it can remain as a devDependency

/**
 * @deprecated To be moved to @atlaskit/link-test-helpers
 */
export { mockedAvailableSitesResult } from './available-sites-result';
export { mockedAccessibleProductsResult } from './accessible-products-result';
