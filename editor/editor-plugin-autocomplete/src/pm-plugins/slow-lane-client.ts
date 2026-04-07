/**
 * Slow Lane Client: Backend context encoding for autocomplete.
 *
 * Fires a BE request on word boundaries to encode document context.
 * Expects the typeahead-encodings API format:
 *   Request:  { text, session_id }
 *   Response: { semantic_vector: number[], lm_logits: Record<string, number> }
 */

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
}

export const createSlowLaneClient = (
	config: SlowLaneClientConfig,
): {
	getContextVector: () => Float32Array | null;
	getLmLogits: () => Record<string, number> | null;
	isWordBoundary: (text: string) => boolean;
	setContextVector: (vector: Float32Array | null) => void;
	setLmLogits: (logits: Record<string, number> | null) => void;
	updateContext: (text: string) => void;
} => {
	const {
		baseUrl,
		sessionId: configSessionId,
		productKey = 'confluence',
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
	let storedContextVector: Float32Array | null = null;
	let storedLmLogits: Record<string, number> | null = null;

	const doUpdateContext = async (text: string): Promise<void> => {
		if (!text || text.trim().length === 0) {
			return;
		}

		// eslint-disable-next-line require-unicode-regexp
		const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`;
		const payload: TypeaheadEncodingsRequest = {
			text,
			session_id: sessionId,
		};

		// Log the exact payload being sent so the comment/reply structure is visible
		// eslint-disable-next-line no-console
		console.groupCollapsed(
			`%c[SlowLane] %c📤 Sending context | ${text.length} chars`,
			'color: #9c27b0; font-weight: bold;',
			'color: inherit;',
		);
		text.split('\n').forEach((line, i, arr) => {
			// eslint-disable-next-line no-console
			console.log(`  ${i === arr.length - 1 ? '▶' : ' '} ${line}`);
		});
		// eslint-disable-next-line no-console
		console.groupEnd();

		try {
			const res = await fetchFn(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				storedContextVector = null;
				storedLmLogits = null;
				// eslint-disable-next-line no-console
				console.log(
					`%c[SlowLane] %c❌ Request failed (${res.status})`,
					'color: #9c27b0; font-weight: bold;',
					'color: #f44336;',
				);
				return;
			}

			const data = (await res.json()) as TypeaheadEncodingsResponse;

			if (data.semantic_vector && Array.isArray(data.semantic_vector)) {
				storedContextVector = new Float32Array(data.semantic_vector);
			} else {
				storedContextVector = null;
			}

			if (data.lm_logits && typeof data.lm_logits === 'object') {
				storedLmLogits = data.lm_logits;
			} else {
				storedLmLogits = null;
			}

			// Log what came back so it can be correlated with the next prediction group
			// eslint-disable-next-line no-console
			console.groupCollapsed(
				`%c[SlowLane] %c📥 Response received`,
				'color: #9c27b0; font-weight: bold;',
				'color: inherit;',
			);
			// eslint-disable-next-line no-console
			console.log(
				storedContextVector
					? `✅ semantic_vector: ${storedContextVector.length} dims`
					: '❌ No semantic_vector',
			);
			// eslint-disable-next-line no-console
			console.log(
				storedLmLogits
					? `✅ lm_logits: ${Object.keys(storedLmLogits).length} tokens`
					: '❌ No lm_logits',
			);
			// eslint-disable-next-line no-console
			console.groupEnd();

			onUpdate?.({
				textLength: text.length,
				hasVector: storedContextVector !== null,
				hasLmLogits: storedLmLogits !== null,
			});
			// eslint-disable-next-line no-unused-vars
		} catch (e) {
			storedContextVector = null;
			storedLmLogits = null;
			// eslint-disable-next-line no-console
			console.log(
				'%c[SlowLane] %c❌ Network error — context cleared',
				'color: #9c27b0; font-weight: bold;',
				'color: #f44336;',
			);
		}
	};

	const updateContextDebounced = (text: string): void => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		lastRequestedText = text;
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			doUpdateContext(lastRequestedText);
		}, debounceMs);
	};

	return {
		updateContext: updateContextDebounced,
		getContextVector: () => storedContextVector,
		getLmLogits: () => storedLmLogits,
		setContextVector: (vector) => {
			storedContextVector = vector;
		},
		setLmLogits: (logits) => {
			storedLmLogits = logits;
		},
		isWordBoundary,
	};
};

let defaultSlowLaneClient: ReturnType<typeof createSlowLaneClient> | null = null;

export const setDefaultSlowLaneClient = (
	client: ReturnType<typeof createSlowLaneClient> | null,
): void => {
	defaultSlowLaneClient = client;
};

export const getStoredContextVector = (): Float32Array | null =>
	defaultSlowLaneClient?.getContextVector() ?? null;

export const getStoredLmLogits = (): Record<string, number> | null =>
	defaultSlowLaneClient?.getLmLogits() ?? null;
