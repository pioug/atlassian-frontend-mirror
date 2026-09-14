/**
 * Artifacts Manifest Client: resolves the autocomplete model artifacts hosted on
 * the CDN.
 *
 * `GET /gateway/api/v1/autocomplete/artifacts` returns one presigned CDN URL per
 * artifact for the tenant's active model version:
 *
 *   { activeVersion, artifacts: [{ name, url, contentType, sizeBytes, checksum }] }
 *
 * Every loader in the plugin resolves its payload through here, so no model data
 * is bundled with the package.
 */

import { isAutocompleteDebugEnabled } from './debug-mode';

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Manifest artifact names. These are the manifest's lookup keys and are
 * hyphenated, unlike the underscored filenames the artifacts are generated from.
 */
export const ARTIFACT_NAME = {
	BIGRAMS: 'bigrams.json',
	FIRST_TOKEN_TO_WORDS: 'first-token-to-words.json',
	GHOST_POS_TAGS: 'ghost-pos-tags.json',
	GRAMMAR_TRANSITIONS: 'grammar-transitions-10k.json',
	L3_VOCABULARY: 'l3-vocabulary.json',
	PHRASE_CONTINUATION_TOKENS: 'phrase-continuation-tokens.json',
	PHRASES: 'phrases.json',
	POS_TAGS: 'combined-l2-l3-pos-tags.json',
	VOCABULARY: 'vocabulary-10k.json',
	WORD_INDEX: 'word-index-10k.json',
	WORD_VECTORS: 'word-vectors-10k.bin',
} as const;

export type ArtifactName = (typeof ARTIFACT_NAME)[keyof typeof ARTIFACT_NAME];

/** A single entry in the artifacts manifest. */
export interface AutocompleteArtifact {
	checksum: string;
	contentType: string;
	name: string;
	sizeBytes: number;
	url: string;
}

/** Response body of the artifacts endpoint. */
export interface AutocompleteArtifactsResponse {
	activeVersion: string;
	artifacts: AutocompleteArtifact[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MANIFEST_ENDPOINT = '/gateway/api/v1/autocomplete/artifacts';

/**
 * Presigned artifact URLs expire ~10 minutes after the manifest is issued, so
 * the manifest is re-requested well inside that window instead of being cached
 * for the session and handing out dead URLs to a late loader.
 */
const MANIFEST_TTL_MS = 5 * 60 * 1000;

// ─── Manifest ────────────────────────────────────────────────────────────────

let manifestPromise: Promise<Map<string, AutocompleteArtifact>> | undefined;
let manifestRequestedAt = 0;

/** Test-only: drops the memoised manifest so the next lookup re-requests it. */
export const resetArtifactsManifestCache = (): void => {
	manifestPromise = undefined;
	manifestRequestedAt = 0;
};

const requestManifest = async (): Promise<Map<string, AutocompleteArtifact>> => {
	const res = await fetch(MANIFEST_ENDPOINT, {
		method: 'GET',
		headers: {
			'x-experience-id': 'confluence-smart-typeahead-artifacts',
			'x-product': 'confluence',
		},
	});

	if (!res.ok) {
		throw new Error(`[autocomplete-artifacts] Manifest request failed: ${res.status}`);
	}

	const body = (await res.json()) as AutocompleteArtifactsResponse;

	if (!Array.isArray(body?.artifacts) || body.artifacts.length === 0) {
		throw new Error('[autocomplete-artifacts] Manifest response contained no artifacts');
	}

	if (isAutocompleteDebugEnabled()) {
		// eslint-disable-next-line no-console
		console.log('[autocomplete-artifacts] Manifest loaded:', {
			activeVersion: body.activeVersion,
			names: body.artifacts.map((artifact) => artifact.name),
		});
	}

	return new Map(body.artifacts.map((artifact) => [artifact.name, artifact]));
};

const getManifest = (): Promise<Map<string, AutocompleteArtifact>> => {
	if (manifestPromise && Date.now() - manifestRequestedAt < MANIFEST_TTL_MS) {
		return manifestPromise;
	}

	manifestRequestedAt = Date.now();
	manifestPromise = requestManifest().catch((e) => {
		// Never cache a rejection — a transient failure would otherwise stop every
		// later loader in the session from retrying.
		resetArtifactsManifestCache();
		throw e;
	});

	return manifestPromise;
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Resolve the CDN URL for an artifact.
 *
 * :raises Error: when the manifest cannot be fetched or omits the artifact.
 */
export const getArtifactUrl = async (name: ArtifactName): Promise<string> => {
	const manifest = await getManifest();
	const url = manifest.get(name)?.url;

	if (!url) {
		throw new Error(`[autocomplete-artifacts] Manifest has no URL for "${name}"`);
	}

	return url;
};

/**
 * Download and parse a JSON artifact. The presigned URL carries its own auth
 * token, so the request is sent without Atlassian headers or credentials.
 *
 * :raises Error: when the manifest lookup or the download fails.
 */
export const fetchArtifactJson = async <T>(name: ArtifactName): Promise<T> => {
	const url = await getArtifactUrl(name);
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`[autocomplete-artifacts] Failed to download "${name}": ${res.status}`);
	}

	return (await res.json()) as T;
};
