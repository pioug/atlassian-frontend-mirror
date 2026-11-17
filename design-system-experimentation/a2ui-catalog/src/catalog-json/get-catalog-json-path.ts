import type { CatalogDefinition } from './catalog-definitions';

/** Repository-relative path (from the package root) of a catalog's JSON file. */
export const getCatalogJsonPath = (definition: CatalogDefinition): string =>
	`catalogs/${definition.slug}/catalog.json`;
