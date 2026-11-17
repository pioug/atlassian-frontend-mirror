import type { CatalogJsonDocument } from './catalog-json-document';
import { jsonPointer } from './json-pointer';
import { type JsonValue, walkJsonObjects } from './json-utils';

/** Throws if any `$ref` in `catalogJson` is external or does not resolve. */
export const assertCatalogJsonRefsResolve = (catalogJson: CatalogJsonDocument): void => {
	const root = catalogJson as unknown as JsonValue;
	walkJsonObjects(root, (object) => {
		const ref = object.$ref;
		if (typeof ref !== 'string') {
			return;
		}
		if (!ref.startsWith('#/') || jsonPointer.resolveLocalRef(root, ref) === undefined) {
			throw new Error(`Unresolvable $ref "${ref}" in catalog ${catalogJson.catalogId}.`);
		}
	});
};
