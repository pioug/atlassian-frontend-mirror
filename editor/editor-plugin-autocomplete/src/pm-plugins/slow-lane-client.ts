/**
 * Slow Lane Client: Backend context encoding for autocomplete.
 *
 * Fires a BE request on word boundaries to encode document context.
 * Expects the typeahead-encodings API format:
 *   Request:  { text, session_id }
 *   Response: { semantic_vector: number[], lm_logits: Record<string, number> }
 */

import { abortExp, EXPERIENCE_NAME, failExp, startExp, succeedExp } from '../analytics/ufo';
import { buildAutocompleteGatewayUrl } from './artifact-loader';
import type {
	BoundaryLmState,
	BoundaryPrimeRequest,
	ProgressiveSurfaceEvidence,
	SurfaceScore,
	SurfaceScoreRequest,
} from './canonical-lm-scoring';
import { CTC_STYLES, ctcTag } from './debug-mode';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Request payload for typeahead-encodings endpoint. */
export interface TypeaheadEncodingsRequest {
	session_id: string;
	text: string;
}

/** Response from typeahead-encodings endpoint. */
export interface TypeaheadEncodingsResponse {
	lm_logits: Record<string, number>;
	semantic_vector: number[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

// eslint-disable-next-line require-unicode-regexp
const WORD_BOUNDARY_CHARS = /[\s.,;:!?]/;
const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Check if text ends with a word boundary character (space or punctuation).
 */
export const isWordBoundary = (text: string): boolean => {
	if (!text || text.length === 0) {
		return false;
	}
	const lastChar = text[text.length - 1];
	return WORD_BOUNDARY_CHARS.test(lastChar);
};

// ─── Slow Lane Client ────────────────────────────────────────────────────────

export interface SlowLaneClientConfig {
	baseUrl: string;
	debounceMs?: number;
	endpoint?: string;
	fetchFn?: typeof fetch;
	onUpdate?: (opts: { hasLmLogits: boolean; hasVector: boolean; textLength: number }) => void;
	productKey?: string;
	sessionId?: string;
	surface?: string;
}

export interface SlowLaneClient {
	getBoundaryLmState?: (contextKey: string) => BoundaryLmState | null;
	getCanonicalSurfaceCount?: () => number;
	getCanonicalSurfaceTokenIds?: (surface: string) => number[] | null;
	getContextInput?: () => string | null;
	getContextVector: () => Float32Array | null;
	getLmLogits: () => Record<string, number> | null;
	getProgressiveSurfaceEvidence?: (
		contextKey: string,
		surface: string,
	) => ProgressiveSurfaceEvidence | null;
	getSurfaceScore?: (contextKey: string, surface: string) => SurfaceScore | null;
	isReady?: () => boolean;
	isWordBoundary: (text: string) => boolean;
	primeBoundaryLm?: (input: BoundaryPrimeRequest) => void;
	requestProgressiveSurfaceScores?: (input: SurfaceScoreRequest) => void;
	setContextVector: (vector: Float32Array | null) => void;
	setLmLogits: (logits: Record<string, number> | null) => void;
	updateContext: (text: string) => void;
}

export const createSlowLaneClient = (config: SlowLaneClientConfig): SlowLaneClient => {
	const {
		baseUrl,
		sessionId: configSessionId,
		productKey = 'confluence',
		surface,
		endpoint = '/gateway/api/v1/autocomplete/typeahead-encodings',
		debounceMs = DEFAULT_DEBOUNCE_MS,
		fetchFn = fetch,
		onUpdate,
	} = config;

	const sessionId = configSessionId ?? crypto.randomUUID();

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'x-experience-id': 'confluence-smart-typeahead-encodings',
		'x-product': productKey,
	};

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let lastRequestedText = '';
	let storedContextInput: string | null = null;
	let storedContextVector: Float32Array | null = null;
	let storedLmLogits: Record<string, number> | null = null;
	let requestSeq = 0;
	let inflightRequestId: string | null = null;

	const doUpdateContext = async (text: string, requestId: string): Promise<void> => {
		if (!text || text.trim().length === 0) {
			return;
		}

		const url = buildAutocompleteGatewayUrl(endpoint, baseUrl);
		const payload: TypeaheadEncodingsRequest = {
			text,
			session_id: sessionId,
		};

		startExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, requestId, {
			textLength: text.length,
			isLocalLLM: false,
			...(surface ? { surface } : {}),
		});

		ctcTag('signal', `📤 network context sent · ${text.length} chars`, CTC_STYLES.section);

		try {
			const res = await fetchFn(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				storedContextInput = null;
				storedContextVector = null;
				storedLmLogits = null;
				failExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, requestId, {
					status: res.status,
					errorType: 'http_error',
					isLocalLLM: false,
					...(surface ? { surface } : {}),
				});
				ctcTag('signal', `❌ network request failed (${res.status})`, CTC_STYLES.bad);
				return;
			}

			const data = (await res.json()) as TypeaheadEncodingsResponse;

			if (data.semantic_vector && Array.isArray(data.semantic_vector)) {
				storedContextVector = new Float32Array(data.semantic_vector);
				storedContextInput = text;
			} else {
				storedContextVector = null;
				storedContextInput = null;
			}

			if (data.lm_logits && typeof data.lm_logits === 'object') {
				storedLmLogits = data.lm_logits;
			} else {
				storedLmLogits = null;
			}

			ctcTag(
				'signal',
				`📥 network response · ${
					storedContextVector ? `semantic ✅ ${storedContextVector.length}d` : 'semantic ❌'
				} · ${storedLmLogits ? `logits ✅ ${Object.keys(storedLmLogits).length}tok` : 'logits ❌'}`,
				CTC_STYLES.section,
			);

			succeedExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, requestId, {
				textLength: text.length,
				hasVector: storedContextVector !== null,
				hasLmLogits: storedLmLogits !== null,
				isLocalLLM: false,
				...(surface ? { surface } : {}),
			});

			onUpdate?.({
				textLength: text.length,
				hasVector: storedContextVector !== null,
				hasLmLogits: storedLmLogits !== null,
			});
			// eslint-disable-next-line no-unused-vars
		} catch (e) {
			storedContextInput = null;
			storedContextVector = null;
			storedLmLogits = null;
			failExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, requestId, {
				errorType: 'network',
				isLocalLLM: false,
				...(surface ? { surface } : {}),
			});
			ctcTag('signal', '❌ network error — context cleared', CTC_STYLES.bad);
		} finally {
			if (inflightRequestId === requestId) {
				inflightRequestId = null;
			}
		}
	};

	const updateContextDebounced = (text: string): void => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		lastRequestedText = text;
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			if (inflightRequestId !== null) {
				abortExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, inflightRequestId, 'superseded', {
					isLocalLLM: false,
					...(surface ? { surface } : {}),
				});
			}
			const requestId = String(++requestSeq);
			inflightRequestId = requestId;
			doUpdateContext(lastRequestedText, requestId);
		}, debounceMs);
	};

	return {
		updateContext: updateContextDebounced,
		getContextInput: () => storedContextInput,
		getContextVector: () => storedContextVector,
		getLmLogits: () => storedLmLogits,
		setContextVector: (vector) => {
			storedContextInput = null;
			storedContextVector = vector;
		},
		setLmLogits: (logits) => {
			storedLmLogits = logits;
		},
		isWordBoundary,
	};
};

export type SlowLaneClientKind = 'localLlm' | 'server';

export interface SlowLaneClientRegistration {
	clientId: string;
	kind: SlowLaneClientKind;
}

export interface SlowLaneClientStatus {
	canonicalScoringSupported: boolean;
	canonicalSurfaceCount: number | null;
	clientId: string | null;
	clientKind: SlowLaneClientKind | null;
	localModelReady: boolean | null;
	registered: boolean;
}

let defaultSlowLaneClient: SlowLaneClient | null = null;
let defaultSlowLaneClientRegistration: SlowLaneClientRegistration | null = null;

const supportsCanonicalSurfaceScoring = (client: SlowLaneClient | null): boolean =>
	typeof client?.primeBoundaryLm === 'function' &&
	typeof client?.requestProgressiveSurfaceScores === 'function';

export const setDefaultSlowLaneClient = (
	client: SlowLaneClient | null,
	registration?: SlowLaneClientRegistration,
): void => {
	defaultSlowLaneClient = client;
	defaultSlowLaneClientRegistration = client
		? (registration ?? {
				clientId: 'untracked',
				kind: supportsCanonicalSurfaceScoring(client) ? 'localLlm' : 'server',
			})
		: null;
};

/**
 * Clear the shared client only when the caller still owns the registration.
 *
 * Multiple editor instances can briefly overlap during a React/editor remount.
 * An older instance must not disconnect the newer instance when its delayed
 * teardown runs after the newer client has registered.
 */
export const clearDefaultSlowLaneClient = (client: SlowLaneClient): boolean => {
	if (defaultSlowLaneClient !== client) {
		return false;
	}
	defaultSlowLaneClient = null;
	defaultSlowLaneClientRegistration = null;
	return true;
};

export const getDefaultSlowLaneClientStatus = (): SlowLaneClientStatus => {
	const canonicalScoringSupported = supportsCanonicalSurfaceScoring(defaultSlowLaneClient);
	const isLocalClient = defaultSlowLaneClientRegistration?.kind === 'localLlm';
	return {
		registered: defaultSlowLaneClient !== null,
		clientId: defaultSlowLaneClientRegistration?.clientId ?? null,
		clientKind: defaultSlowLaneClientRegistration?.kind ?? null,
		canonicalScoringSupported,
		localModelReady:
			isLocalClient && typeof defaultSlowLaneClient?.isReady === 'function'
				? defaultSlowLaneClient.isReady()
				: null,
		canonicalSurfaceCount:
			canonicalScoringSupported &&
			typeof defaultSlowLaneClient?.getCanonicalSurfaceCount === 'function'
				? defaultSlowLaneClient.getCanonicalSurfaceCount()
				: null,
	};
};

export const getStoredContextVector = (): Float32Array | null =>
	defaultSlowLaneClient?.getContextVector() ?? null;

export const getStoredContextInput = (): string | null =>
	defaultSlowLaneClient?.getContextInput?.() ?? null;

export const getStoredLmLogits = (): Record<string, number> | null =>
	defaultSlowLaneClient?.getLmLogits() ?? null;

export const getBoundaryLmState = (contextKey: string): BoundaryLmState | null =>
	defaultSlowLaneClient?.getBoundaryLmState?.(contextKey) ?? null;

export const getCanonicalSurfaceTokenIds = (surface: string): number[] | null =>
	defaultSlowLaneClient?.getCanonicalSurfaceTokenIds?.(surface) ?? null;

export const getSurfaceScore = (contextKey: string, surface: string): SurfaceScore | null =>
	defaultSlowLaneClient?.getSurfaceScore?.(contextKey, surface) ?? null;

export const getProgressiveSurfaceEvidence = (
	contextKey: string,
	surface: string,
): ProgressiveSurfaceEvidence | null =>
	defaultSlowLaneClient?.getProgressiveSurfaceEvidence?.(contextKey, surface) ?? null;

export const primeBoundaryLm = (input: BoundaryPrimeRequest): void => {
	defaultSlowLaneClient?.primeBoundaryLm?.(input);
};

export const requestProgressiveSurfaceScores = (input: SurfaceScoreRequest): void => {
	defaultSlowLaneClient?.requestProgressiveSurfaceScores?.(input);
};

export const isCanonicalSurfaceScoringSupported = (): boolean =>
	supportsCanonicalSurfaceScoring(defaultSlowLaneClient);

/**
 * How many surfaces the canonical token map currently holds. Goes from zero to
 * its final size once the artifact lands, which is the only point at which
 * `getCanonicalSurfaceTokenIds` starts answering — so callers memoising over
 * that lookup can use this to detect the transition.
 */
export const getCanonicalSurfaceCount = (): number =>
	defaultSlowLaneClient?.getCanonicalSurfaceCount?.() ?? 0;
