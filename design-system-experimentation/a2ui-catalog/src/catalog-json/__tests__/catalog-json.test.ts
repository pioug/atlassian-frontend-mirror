import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { assertCatalogJsonRefsResolve } from '../assert-catalog-json-refs-resolve';
import { buildCatalogJson } from '../build-catalog-json';
import { CATALOG_DEFINITIONS } from '../catalog-definitions';
import type { CatalogJsonDocument } from '../catalog-json-document';
import { getCatalogJsonPath } from '../get-catalog-json-path';

const packageRoot = resolve(__dirname, '../../..');
const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
const REGENERATE_COMMAND = 'yarn workspace @atlaskit/a2ui-catalog codegen:catalog-json';

const collectRefs = (node: unknown, refs: string[] = []): string[] => {
	if (Array.isArray(node)) {
		node.forEach((child) => collectRefs(child, refs));
	} else if (node !== null && typeof node === 'object') {
		Object.entries(node).forEach(([key, value]) => {
			if (key === '$ref' && typeof value === 'string') {
				refs.push(value);
			} else {
				collectRefs(value, refs);
			}
		});
	}
	return refs;
};

describe('catalog definitions', () => {
	it('have unique catalog IDs and slugs', () => {
		const ids = CATALOG_DEFINITIONS.map((definition) => definition.catalogId);
		const slugs = CATALOG_DEFINITIONS.map((definition) => definition.slug);
		expect(new Set(ids).size).toBe(ids.length);
		expect(new Set(slugs).size).toBe(slugs.length);
		slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9_-]+$/));
	});

	it('have unique component names within each catalog', () => {
		CATALOG_DEFINITIONS.forEach((definition) => {
			const names = definition.components.map((api) => api.name);
			expect(new Set(names).size).toBe(names.length);
		});
	});
});

describe.each(CATALOG_DEFINITIONS.map((definition) => [definition.catalogId, definition] as const))(
	'catalog JSON for %s',
	(_catalogId, definition) => {
		const catalogJson = buildCatalogJson(definition);

		it('lists exactly the catalog components', () => {
			expect(Object.keys(catalogJson.components)).toEqual(
				definition.components.map((api) => api.name),
			);
			expect(catalogJson.catalogId).toBe(definition.catalogId);
		});

		it('wraps each component in the A2UI component envelope', () => {
			Object.entries(catalogJson.components).forEach(([name, schema]) => {
				const [common, own] = schema.allOf as [Record<string, any>, Record<string, any>];
				expect(common).toEqual({ $ref: '#/$defs/ComponentCommon' });
				expect(own.properties.component).toEqual({ const: name });
				expect(own.required).toContain('component');
			});
		});

		it('is self-contained: every $ref is local and resolves', () => {
			const refs = collectRefs(catalogJson);
			expect(refs.length).toBeGreaterThan(0);
			refs.forEach((ref) => expect(ref.startsWith('#/')).toBe(true));
			expect(() => assertCatalogJsonRefsResolve(catalogJson)).not.toThrow();
		});

		it('only bundles common types that are referenced', () => {
			const referenced = new Set(
				collectRefs(catalogJson)
					.filter((ref) => ref.startsWith('#/$defs/'))
					.map((ref) => ref.split('/')[2]),
			);
			expect(Object.keys(catalogJson.$defs).sort()).toEqual([...referenced].sort());
		});

		it('matches the checked-in catalog.json', () => {
			const filePath = join(packageRoot, getCatalogJsonPath(definition));
			expect(existsSync(filePath)).toBe(true);
			const checkedIn = JSON.parse(readFileSync(filePath, 'utf8')) as CatalogJsonDocument;
			// On failure, regenerate with REGENERATE_COMMAND and commit the result.
			expect({ file: getCatalogJsonPath(definition), json: checkedIn }).toEqual({
				file: getCatalogJsonPath(definition),
				json: catalogJson,
			});
		});

		it('exposes the prebuilt JSON at its npm package subpath', () => {
			const subpath = `./${getCatalogJsonPath(definition)}`;
			expect(packageJson.exports[subpath]).toBe(subpath);
			expect(packageJson.files).toContain('catalogs');
		});
	},
);

describe('catalogs directory', () => {
	it(`contains only defined catalogs (regenerate with \`${REGENERATE_COMMAND}\`)`, () => {
		const directories = readdirSync(join(packageRoot, 'catalogs'), { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort();
		expect(directories).toEqual(CATALOG_DEFINITIONS.map((definition) => definition.slug).sort());
	});
});

describe('assertCatalogJsonRefsResolve', () => {
	const baseDocument = (): CatalogJsonDocument => buildCatalogJson(CATALOG_DEFINITIONS[0]!);

	it('rejects a dangling local reference', () => {
		const catalogJson = baseDocument();
		catalogJson.components.Broken = { $ref: '#/components/DoesNotExist' };
		expect(() => assertCatalogJsonRefsResolve(catalogJson)).toThrow(/DoesNotExist/);
	});

	it('rejects an external reference', () => {
		const catalogJson = baseDocument();
		catalogJson.components.Broken = { $ref: 'common_types.json#/$defs/ComponentId' };
		expect(() => assertCatalogJsonRefsResolve(catalogJson)).toThrow(/common_types\.json/);
	});
});
