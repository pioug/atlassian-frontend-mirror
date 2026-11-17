/**
 * Writes `catalogs/<slug>/catalog.json` for every entry in `CATALOG_DEFINITIONS`.
 *
 * Run from `platform/`:
 *   yarn workspace @atlaskit/a2ui-catalog codegen:catalog-json
 *
 * The drift test in `src/catalog-json/__tests__/` fails when these files are
 * out of date with the Zod schemas.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';

import { format, resolveConfig } from 'prettier';

import { buildCatalogJson } from '../src/catalog-json/build-catalog-json';
import { CATALOG_DEFINITIONS } from '../src/catalog-json/catalog-definitions';
import { getCatalogJsonPath } from '../src/catalog-json/get-catalog-json-path';

const packageRoot = resolve(__dirname, '..');
const catalogsDir = join(packageRoot, 'catalogs');

const main = async (): Promise<void> => {
	const expectedSlugs = new Set(CATALOG_DEFINITIONS.map((definition) => definition.slug));

	mkdirSync(catalogsDir, { recursive: true });
	// Remove directories for catalogs that no longer exist.
	readdirSync(catalogsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && !expectedSlugs.has(entry.name))
		.forEach((entry) => rmSync(join(catalogsDir, entry.name), { recursive: true }));

	for (const definition of CATALOG_DEFINITIONS) {
		const filePath = join(packageRoot, getCatalogJsonPath(definition));
		const prettierConfig = (await resolveConfig(filePath)) ?? {};
		const contents = await format(JSON.stringify(buildCatalogJson(definition)), {
			...prettierConfig,
			filepath: filePath,
		});
		mkdirSync(dirname(filePath), { recursive: true });
		writeFileSync(filePath, contents);
		// eslint-disable-next-line no-console
		console.log(`Wrote ${getCatalogJsonPath(definition)} (${definition.catalogId})`);
	}
};

main().catch((error: unknown) => {
	// eslint-disable-next-line no-console
	console.error(error);
	process.exit(1);
});
