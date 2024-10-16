// This is an entrypoint, any exports are considered part of the public API
// Avoid exporting functions that directly depend on fetch-mock so it can remain as a devDependency
export { mockedAvailableSitesResult } from './available-sites-result';
