/**
 * Builds a standalone A2UI catalog JSON document from a `CatalogDefinition`.
 *
 * Component schemas come from `@a2ui/web_core`'s own Zod → JSON Schema
 * conversion (`getClientCapabilities({ includeInlineCatalogs: true })`), the
 * same path a renderer uses to send inline catalogs to an agent. That output is
 * designed to be embedded in a message, not published on its own, so this
 * module post-processes it into a self-contained document:
 *
 * - `common_types.json#/$defs/X` references are rewritten to a bundled
 *   `#/$defs/X`, generated from web_core's `CommonSchemas`.
 * - Internal references emitted by `zod-to-json-schema` (`#/properties/...`)
 *   are relative to each component's own schema; they are rebased onto the
 *   component's location in the document.
 * - Every local reference is checked to resolve, and any other external
 *   reference fails the build.
 *
 * Functions are not included: the catalogs' local functions are implemented
 * in the renderer without convertible Zod schemas.
 */
import { Catalog, CommonSchemas, MessageProcessor, type ComponentApi } from '@a2ui/web_core/v0_9';
import type { ZodTypeAny } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { assertCatalogJsonRefsResolve } from './assert-catalog-json-refs-resolve';
import type { CatalogDefinition } from './catalog-definitions';
import type { CatalogJsonDocument } from './catalog-json-document';
import { jsonPointer } from './json-pointer';
import { type JsonObject, type JsonValue, walkJsonObjects } from './json-utils';

const JSON_SCHEMA_DIALECT = 'https://json-schema.org/draft/2019-09/schema';
const ZOD_TO_JSON_SCHEMA_TARGET = 'jsonSchema2019-09';
const COMMON_TYPES_PREFIX = 'common_types.json#';
const DEFS_PREFIX = '#/$defs/';
const REF_TAG = 'REF:';

const CATALOG_JSON_COMMENT =
	'Generated from @atlaskit/a2ui-catalog by `yarn workspace @atlaskit/a2ui-catalog codegen:catalog-json`. Do not edit by hand.';

/**
 * Rewrites every `$ref` under `node`. `localBase` is the JSON Pointer that
 * `#`-relative references emitted for this sub-schema should be rebased onto.
 */
const rewriteRefs = (node: JsonValue, localBase: string, context: string): void => {
	walkJsonObjects(node, (object) => {
		const ref = object.$ref;
		if (typeof ref !== 'string') {
			return;
		}
		if (ref.startsWith(COMMON_TYPES_PREFIX)) {
			object.$ref = `#${ref.slice(COMMON_TYPES_PREFIX.length)}`;
		} else if (ref === '#' || ref.startsWith('#/')) {
			object.$ref = `${localBase}${ref.slice(1)}`;
		} else {
			throw new Error(`Unsupported external $ref "${ref}" in ${context}.`);
		}
	});
};

/**
 * Mirrors web_core's `REF:` handling for schemas converted outside the
 * MessageProcessor: a node whose description is `REF:<ref>|<description>`
 * becomes `{ $ref, description }`. The root node is never replaced, so a
 * common type's own `REF:` tag becomes its description instead.
 */
const applyRefTags = (root: JsonObject): void => {
	const description = root.description;
	if (typeof description === 'string' && description.startsWith(REF_TAG)) {
		const [, text] = description.slice(REF_TAG.length).split('|');
		if (text) {
			root.description = text;
		} else {
			delete root.description;
		}
	}
	const visit = (node: JsonValue): void => {
		if (Array.isArray(node)) {
			node.forEach(visit);
			return;
		}
		if (node === null || typeof node !== 'object') {
			return;
		}
		if (typeof node.description === 'string' && node.description.startsWith(REF_TAG)) {
			const [ref = '', text] = node.description.slice(REF_TAG.length).split('|');
			Object.keys(node).forEach((key) => delete node[key]);
			node.$ref = ref;
			if (text) {
				node.description = text;
			}
			return;
		}
		Object.values(node).forEach(visit);
	};
	Object.entries(root).forEach(([key, child]) => {
		if (key !== 'description') {
			visit(child);
		}
	});
};

const convertCommonType = (name: string, schema: ZodTypeAny): JsonObject => {
	const json = zodToJsonSchema(schema, { target: ZOD_TO_JSON_SCHEMA_TARGET }) as JsonObject;
	delete json.$schema;
	applyRefTags(json);
	rewriteRefs(json, `${DEFS_PREFIX}${jsonPointer.escapeToken(name)}`, `common type "${name}"`);
	return json;
};

/**
 * The envelope every catalog component extends. web_core references it as
 * `common_types.json#/$defs/ComponentCommon` but does not export a schema for
 * it, so it is declared here from the v0.9 component base fields.
 */
const COMPONENT_COMMON: JsonObject = {
	type: 'object',
	description: 'Properties shared by every A2UI component.',
	properties: {
		id: { $ref: `${DEFS_PREFIX}ComponentId` },
		accessibility: { $ref: `${DEFS_PREFIX}AccessibilityAttributes` },
	},
	required: ['id'],
};

const buildAllCommonDefs = (): Record<string, JsonObject> => {
	const defs: Record<string, JsonObject> = { ComponentCommon: COMPONENT_COMMON };
	Object.entries(CommonSchemas as Record<string, ZodTypeAny>).forEach(([name, schema]) => {
		defs[name] = convertCommonType(name, schema);
	});
	return defs;
};

/** Collects the `$defs` names referenced (transitively) from `roots`. */
const collectReferencedDefs = (
	roots: JsonValue[],
	allDefs: Record<string, JsonObject>,
): string[] => {
	const found = new Set<string>();
	const pending: JsonValue[] = [...roots];
	while (pending.length) {
		walkJsonObjects(pending.pop()!, (object) => {
			const ref = object.$ref;
			if (typeof ref !== 'string' || !ref.startsWith(DEFS_PREFIX)) {
				return;
			}
			const name = jsonPointer.unescapeToken(ref.slice(DEFS_PREFIX.length).split('/')[0]!);
			if (!found.has(name)) {
				if (!allDefs[name]) {
					throw new Error(`Reference "${ref}" has no matching common type definition.`);
				}
				found.add(name);
				pending.push(allDefs[name]);
			}
		});
	}
	return [...found].sort();
};

const convertComponents = (
	catalogId: string,
	components: ReadonlyArray<ComponentApi>,
): Record<string, JsonObject> => {
	const processor = new MessageProcessor([new Catalog(catalogId, [...components])]);
	const [inline] =
		processor.getClientCapabilities({ includeInlineCatalogs: true })['v0.9'].inlineCatalogs ?? [];
	// Deep clone so post-processing never mutates web_core-owned objects.
	const converted = JSON.parse(JSON.stringify(inline?.components ?? {})) as Record<
		string,
		JsonObject
	>;
	Object.entries(converted).forEach(([name, schema]) => {
		// web_core wraps each component as `allOf: [ComponentCommon, <component schema>]`,
		// spreading the component's own properties into the second entry.
		rewriteRefs(
			schema,
			`#/components/${jsonPointer.escapeToken(name)}/allOf/1`,
			`component "${name}" of ${catalogId}`,
		);
	});
	return converted;
};

/** Builds the publishable catalog JSON document for `definition`. */
export const buildCatalogJson = (definition: CatalogDefinition): CatalogJsonDocument => {
	const components = convertComponents(definition.catalogId, definition.components);
	const allDefs = buildAllCommonDefs();
	const $defs: Record<string, JsonObject> = {};
	collectReferencedDefs(Object.values(components), allDefs).forEach((name) => {
		// collectReferencedDefs validates that every referenced definition exists.
		$defs[name] = allDefs[name]!;
	});

	const catalogJson: CatalogJsonDocument = {
		$schema: JSON_SCHEMA_DIALECT,
		$comment: CATALOG_JSON_COMMENT,
		title: definition.title,
		description: definition.description,
		catalogId: definition.catalogId,
		instructions: definition.instructions,
		components,
		$defs,
	};
	assertCatalogJsonRefsResolve(catalogJson);
	return catalogJson;
};
