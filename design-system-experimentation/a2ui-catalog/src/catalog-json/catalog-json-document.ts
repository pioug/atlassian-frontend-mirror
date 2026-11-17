import type { JsonObject } from './json-utils';

/** A standalone, self-contained A2UI catalog JSON Schema document. */
export type CatalogJsonDocument = {
	$comment: string;
	$defs: Record<string, JsonObject>;
	$schema: string;
	catalogId: string;
	components: Record<string, JsonObject>;
	description: string;
	instructions: string;
	title: string;
};
