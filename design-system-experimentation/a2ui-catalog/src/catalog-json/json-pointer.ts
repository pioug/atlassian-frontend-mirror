import type { JsonValue } from './json-utils';

/** Escapes a JSON Pointer reference token (RFC 6901). */
const escapeToken = (token: string): string => token.replace(/~/g, '~0').replace(/\//g, '~1');

const unescapeToken = (token: string): string => token.replace(/~1/g, '/').replace(/~0/g, '~');

/** Resolves a local JSON Pointer reference (`#/a/b`) against `root`. */
const resolveLocalRef = (root: JsonValue, ref: string): JsonValue | undefined =>
	ref
		.slice(2)
		.split('/')
		.map(unescapeToken)
		.reduce<JsonValue | undefined>((node, token) => {
			if (Array.isArray(node)) {
				return node[Number(token)];
			}
			return node !== null && typeof node === 'object' ? node[token] : undefined;
		}, root);

/** JSON Pointer (RFC 6901) helpers for catalog `$ref` handling. */
export const jsonPointer: {
	escapeToken: (token: string) => string;
	resolveLocalRef: (root: JsonValue, ref: string) => JsonValue | undefined;
	unescapeToken: (token: string) => string;
} = { escapeToken, resolveLocalRef, unescapeToken };
