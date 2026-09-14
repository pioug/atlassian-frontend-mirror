/**
 * Validation and diagnostics layer over the artifacts manifest.
 *
 * `artifacts-manifest` owns *where* a payload comes from (one manifest request,
 * then a presigned CDN download). This module owns *whether the payload is
 * usable*: every loader declares the shape it expects, so a mis-published
 * artifact fails at the boundary with the artifact's name rather than surfacing
 * later as an empty trie or a silent no-op in scoring.
 */

import { type ArtifactName, fetchArtifactJson, getArtifactUrl } from './artifacts-manifest';
import { ctcTag } from './debug-mode';

const TRAILING_SLASH_REGEX = /\/$/u;
const DEFAULT_BASE_URL = '';
const AUTOCOMPLETE_GATEWAY_BASE = '/gateway/api/v1/autocomplete';

type ArtifactLoaderOptions<T> = {
	label?: string;
	summarize?: (payload: T) => string;
	validate?: (payload: unknown) => payload is T;
};

/**
 * Build a URL for one of the autocomplete gateway's own endpoints (e.g. the
 * network slow lane). Model artifacts do NOT go through here — they are served
 * from the CDN via the manifest.
 */
export const buildAutocompleteGatewayUrl = (
	path: string,
	baseUrl: string = DEFAULT_BASE_URL,
): string => {
	const normalizedBase = baseUrl.replace(TRAILING_SLASH_REGEX, '');
	return `${normalizedBase}${AUTOCOMPLETE_GATEWAY_BASE}${path}`;
};

/**
 * Download a JSON artifact and assert its shape before handing it to a loader.
 *
 * :params:
 *   artifactName: Manifest key for the artifact
 *   options.label: Name used in diagnostics; defaults to the manifest key
 *   options.summarize: Renders a short size/count summary for the debug log
 *   options.validate: Type guard the payload must satisfy
 * :returns:
 *   The parsed, validated payload
 */
export const fetchAutocompleteArtifactJson = async <T>(
	artifactName: ArtifactName,
	options: ArtifactLoaderOptions<T> = {},
): Promise<T> => {
	const label = options.label ?? artifactName;
	// Presigned CDN URLs carry an auth token, so only the artifact name is logged.
	ctcTag('init', `↓ loading ${label}`);

	const payload = await fetchArtifactJson<unknown>(artifactName);
	if (options.validate && !options.validate(payload)) {
		throw new Error(`[autocomplete-artifacts] ${label} payload shape was invalid`);
	}

	const summary = options.summarize?.(payload as T);
	ctcTag('init', `✓ loaded ${label}${summary ? ` (${summary})` : ''}`);

	return payload as T;
};

/**
 * Download a binary artifact (the word-vectors blob) as an ArrayBuffer.
 *
 * :params:
 *   artifactName: Manifest key for the artifact
 *   label: Name used in diagnostics; defaults to the manifest key
 * :returns:
 *   The raw bytes of the artifact
 */
export const fetchAutocompleteArtifactBinary = async (
	artifactName: ArtifactName,
	label: string = artifactName,
): Promise<ArrayBuffer> => {
	ctcTag('init', `↓ loading ${label}`);

	const url = await getArtifactUrl(artifactName);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`[autocomplete-artifacts] Failed to fetch ${label}: ${response.status}`);
	}

	const payload = await response.arrayBuffer();
	ctcTag('init', `✓ loaded ${label} (${payload.byteLength} bytes)`);

	return payload;
};
