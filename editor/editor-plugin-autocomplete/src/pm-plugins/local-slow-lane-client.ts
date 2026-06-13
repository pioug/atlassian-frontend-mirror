/**
 * Local Slow Lane Client: On-device inference via @mlc-ai/web-llm.
 *
 * Drop-in replacement for the network-based slow-lane-client. Instead of calling
 * a backend API, this client runs two models in the browser via WebGPU, in a
 * single MLCEngine, to reproduce the BE encoder's outputs on-device:
 *
 *   - Causal LM (SmolLM2-135M-Instruct): one decode step per word boundary. A
 *     registered LogitProcessor captures the raw next-token logits, which
 *     `computeBePayload` turns into a whole-word `lm_logits` payload — a faithful
 *     port of the BE `CausalLMEncoder._get_top_k_probs` (masked softmax over the
 *     vocab's first-tokens, prefix expansion, L2 reservation, log-space pooling).
 *   - Semantic embedder (Snowflake Arctic Embed S): produces the real 384-d
 *     `semantic_vector`. Inputs are wrapped as passages (see `wrapForArctic`) so
 *     the runtime vector lands in the same space as the precomputed word bin.
 *
 * ── Why main thread (no Web Worker)? ─────────────────────────────────────
 * The models are small enough (~640 MB combined VRAM) that WebGPU inference on
 * the main thread is viable:
 *
 *   - WebGPU GPU compute is inherently async (doesn't block the main thread)
 *   - CPU overhead (BE-parity post-processing) is a few ms
 *   - Per-inference latency is well within autocomplete expectations
 *     (~250 ms between word boundaries)
 *
 * This avoids all the complexity of Web Workers:
 *   - No CSP workarounds (blob URLs, inline scripts)
 *   - No bundler configuration (worker-plugin, import.meta.url)
 *   - No message passing protocol
 *   - Standard npm import — just works
 *
 * ── Interface ────────────────────────────────────────────────────────────
 * Same shape as createSlowLaneClient so text-predictor.ts needs zero changes.
 * The client exposes getContextVector() and getLmLogits() which are populated
 * asynchronously after each updateContext() call.
 */

import type { MLCEngine, InitProgressReport, AppConfig, LogitProcessor } from '@mlc-ai/web-llm';

import { isAutocompleteDebugEnabled } from './debug-mode';
import { isWordBoundary } from './slow-lane-client';

type WebLlmModelRecord = NonNullable<AppConfig['model_list']>[number];
type EmbeddingApiResponse = { data?: Array<{ embedding?: unknown }> };

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LocalSlowLaneClientConfig {
	/**
	 * Optional custom model registration for models not in web-llm's
	 * built-in list. When provided, the model is appended to the app
	 * config before engine creation.
	 */
	customModelConfig?: {
		/** Context window size override (optional) */
		contextWindowSize?: number;
		/** HuggingFace URL to the model weights (e.g. "https://huggingface.co/HuggingFaceTB/smollm-135M-instruct-add-basics-q0f16-MLC") */
		model: string;
		/** URL to the compiled WASM library for this model architecture */
		modelLib: string;
		/** VRAM required in MB (optional, for resource planning) */
		vramRequiredMB?: number;
	};
	/** Debounce interval in ms before sending context for inference. */
	debounceMs?: number;
	/**
	 * MLC model identifier.
	 * Defaults to the built-in SmolLM2-135M-Instruct-q0f16-MLC.
	 *
	 * To use a custom HuggingFace model, provide both `modelId` and
	 * `customModelConfig` with the model URL and WASM library URL.
	 */
	modelId?: string;
	/** Callback fired when the engine fails to load/start. */
	onLoadError?: (error: LocalSlowLaneLoadError) => void;
	/** Callback fired when the engine successfully loads and is ready. */
	onLoadSuccess?: (info: LocalSlowLaneLoadSuccess) => void;
	/** Callback fired with status messages (model loading progress, etc.). */
	onStatus?: (message: string) => void;
	/** Callback fired when inference returns new results. */
	onUpdate?: (opts: { hasLmLogits: boolean; hasVector: boolean; textLength: number }) => void;
}

// Same return type as createSlowLaneClient for drop-in compatibility
export interface LocalSlowLaneClient {
	/** Clean up resources. */
	destroy: () => void;
	getContextVector: () => Float32Array | null;
	getLmLogits: () => Record<string, number> | null;
	/** Whether the model is loaded and ready for inference. */
	isReady: () => boolean;
	isWordBoundary: (text: string) => boolean;
	setContextVector: (vector: Float32Array | null) => void;
	setLmLogits: (logits: Record<string, number> | null) => void;
	updateContext: (text: string) => void;
}

/**
 * Why the local engine failed to load/start.
 *
 * The first three are user-machine limitations (WebGPU missing, no compatible
 * GPU adapter, GPU lacks the `shader-f16` feature the model needs);
 * `insufficient_memory` is hit when weights don't fit in VRAM. The rest cover
 * delivery/runtime failures unrelated to hardware.
 */
export type LocalSlowLaneLoadErrorReason =
	| 'webgpu_unavailable'
	| 'webgpu_no_adapter'
	| 'missing_shader_f16'
	| 'insufficient_memory'
	| 'model_download_failed'
	| 'module_load_failed'
	| 'init_failed';

/** Snapshot of the machine's WebGPU support, used to explain hardware limits. */
export interface WebGpuCapabilities {
	/** Whether `navigator.gpu.requestAdapter()` returned a usable adapter. */
	adapterAvailable?: boolean;
	/** GPU architecture reported by the adapter (e.g. "metal-3", "rdna2"). */
	architecture?: string;
	/** Whether `navigator.gpu` exists at all. */
	available: boolean;
	/** Largest single GPU buffer the adapter allows, in MB. */
	maxBufferSizeMB?: number;
	/** Largest storage-buffer binding the adapter allows, in MB. */
	maxStorageBufferBindingSizeMB?: number;
	/** Whether the adapter exposes the `shader-f16` feature the model requires. */
	shaderF16Supported?: boolean;
	/** GPU vendor reported by the adapter (e.g. "apple", "intel"). */
	vendor?: string;
}

export interface LocalSlowLaneLoadError {
	/** WebGPU support snapshot — explains hardware limitations behind the failure. */
	capabilities: WebGpuCapabilities;
	/** Semantic embedder loaded alongside the causal LM (loads atomically). */
	embeddingModelId: string;
	/** Canonical, controlled failure description (never raw error text). */
	message: string;
	/** Causal LM identifier that failed to load. */
	modelId: string;
	/** Coarse, privacy-safe failure category. */
	reason: LocalSlowLaneLoadErrorReason;
}

export interface LocalSlowLaneLoadSuccess {
	/** WebGPU support snapshot for the machine that loaded the model. */
	capabilities: WebGpuCapabilities;
	/** Semantic embedder loaded alongside the causal LM (loads atomically). */
	embeddingModelId: string;
	/** Model engine load time in ms (excludes the WebGPU capability probe). */
	loadDurationMs: number;
	/** Causal LM identifier that loaded. */
	modelId: string;
}

// Minimal WebGPU shape: lib.dom types aren't guaranteed in this build target.
interface MinimalGpuAdapterInfo {
	architecture?: string;
	vendor?: string;
}
interface MinimalGpuAdapter {
	features: { has: (feature: string) => boolean };
	info?: MinimalGpuAdapterInfo;
	limits?: { maxBufferSize?: number; maxStorageBufferBindingSize?: number };
	requestAdapterInfo?: () => Promise<MinimalGpuAdapterInfo>;
}
interface MinimalGpu {
	requestAdapter: () => Promise<MinimalGpuAdapter | null>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_DEBOUNCE_MS = 300;

export const LOCAL_MLC_CAUSAL_MODEL_ID = 'SmolLM2-135M-Instruct-q0f16-MLC';

/**
 * MLC ID for the semantic embedder (Snowflake Arctic Embed S, batch=4 variant).
 *
 * The `-b4` suffix selects the prebuilt variant compiled for a max batch size of
 * 4 (≈239 MB VRAM) rather than `-b32` (≈1023 MB VRAM). Autocomplete embeds one
 * context at a time, so `-b4` is the right fit. This model IS in
 * `prebuiltAppConfig.model_list` of web-llm 0.2.82 — no `customModelConfig` needed.
 */
export const LOCAL_MLC_EMBEDDING_MODEL_ID = 'snowflake-arctic-embed-s-q0f32-MLC-b4';

/**
 * Wrap raw context text with BERT special tokens before embedding.
 *
 * web-llm's `EmbeddingPipeline` does NOT auto-prepend `[CLS]` / append `[SEP]`
 * (the official MLC embeddings example wraps manually). The Python
 * `sentence_transformers` side that generated the word-vector bin adds these
 * inside `model.encode()`, so we must mirror it here for the runtime context
 * vector to land in the same region of Arctic's embedding space as the bin.
 *
 * No query prefix is applied: the semantic step is sentence-to-sentence (`s2s`)
 * similarity ("which words are conceptually similar to this context?"), not
 * sentence-to-passage (`s2p`) retrieval. Arctic's query prefix would misframe
 * the relationship. Encode both sides as passages. See implementation.md §4.3.
 */
export const wrapForArctic = (text: string): string => `[CLS] ${text} [SEP]`;

/**
 * BE-parity constants — must match `CausalLMEncoder` defaults in the Python
 * sidecar (`cc-smarts/python-sidecar/src/causal_lm_encoder.py`) and
 * `SlowLaneEngine` (`typeahead_context_encoding.py`) so local payloads behave
 * identically to the server-client setup.
 */
export const BE_PARITY = {
	/** Final payload size cap (BE: `top_k_words`). */
	TOP_K_WORDS: 2000,
	/** L2 (domain) words admitted unconditionally before pooling (BE: `reserved_l2_slots`). */
	RESERVED_L2_SLOTS: 500,
	/** Log-space additive bias favouring L2 over L3 in the pool (BE: `l2_bias`). */
	L2_BIAS: 1.0,
	/** Drop words below this probability from the final payload (BE: `> 0.00001`). */
	MIN_PROB: 0.00001,
	/**
	 * Word-level approximation of the BE causal LM token limit.
	 *
	 * BE: `CausalLMEncoder.max_context_tokens = 100` (BPE tokens, left-truncated).
	 * FE: no tokenizer available, so we approximate with word count. English text
	 * averages ~1.3–1.5 BPE tokens/word, meaning 100 words ≈ 130–150 tokens.
	 * Using 100 words keeps the approximation simple and errs on the side of
	 * sending slightly more context than the BE sees — acceptable for a PoC.
	 */
	MAX_CONTEXT_TOKENS: 100,
	/**
	 * Word-level rolling window for the semantic embedder.
	 *
	 * BE: `SlowLaneEngine.max_context_words = 100` (applied in
	 * `typeahead_context_encoding.py` before calling `SemanticEncoder.encode`).
	 * Truncated identically here so the runtime Arctic vector lands in the same
	 * region of the embedding space as the precomputed word-vector bin.
	 */
	MAX_CONTEXT_WORDS: 100,
} as const;

const splitOnWhitespace = (text: string): string[] => {
	const trimmed = text.trim();
	if (trimmed === '') {
		return [];
	}

	const words: string[] = [];
	let wordStart = -1;

	for (let i = 0; i < trimmed.length; i++) {
		if (trimmed[i].trim() === '') {
			if (wordStart !== -1) {
				words.push(trimmed.slice(wordStart, i));
				wordStart = -1;
			}
			continue;
		}

		if (wordStart === -1) {
			wordStart = i;
		}
	}

	if (wordStart !== -1) {
		words.push(trimmed.slice(wordStart));
	}

	return words;
};

/**
 * Return the last `n` whitespace-separated words of `text`, joined by spaces.
 * Mirrors the BE rolling-window truncation applied before both encoders.
 */
const truncateToLastNWords = (text: string, n: number): string => {
	const words = splitOnWhitespace(text);
	return words.length <= n ? text : words.slice(-n).join(' ');
};

// ─── Logit capture ─────────────────────────────────────────────────────────

/**
 * A LogitProcessor that captures the raw next-token logits and passes them
 * through unmodified.
 *
 * web-llm invokes `processLogits` on the CPU after the model's forward pass and
 * before sampling, handing us the full `Float32Array(vocab_size)` at the current
 * decode position. We copy it off web-llm's shared buffer (which it may reuse
 * across calls) and return the original untouched so sampling is unaffected.
 *
 * This is the raw-logit access the BE-parity algorithm needs (masked softmax +
 * prefix expansion, consumed in a later step). Registered for the causal LM
 * only — the embedder never decodes tokens, so it produces no logits.
 */
class CapturingLogitProcessor implements LogitProcessor {
	captured: Float32Array | null = null;

	processLogits = (logits: Float32Array): Float32Array => {
		// Copy off web-llm's shared buffer — it may reuse `logits` across calls.
		this.captured = new Float32Array(logits);
		return logits;
	};

	processSampledToken = (): void => {
		// No-op — we don't track sampled tokens.
	};

	resetState = (): void => {
		this.captured = null;
	};
}

// ─── BE-parity data + algorithm ──────────────────────────────────────────────

/**
 * Prefix-expansion map: first-token id → words whose space-prefixed SmolLM2
 * encoding starts with that token. Generated offline by
 * `scripts/gen_first_token_to_words.py`, which mirrors the BE's in-memory map
 * (`CausalLMEncoder._ensure_loaded`).
 *
 * Populated lazily by `loadBePayloadData()` from a dynamically-imported JSON so
 * the (large) payload is only fetched when the local client is actually
 * initialised — keeping it out of the editor's main chunk for the vast majority
 * of users (who run with `useLocalModel` off).
 */
let firstTokenToWords: Map<number, string[]> = new Map();

/**
 * L2 (Atlassian-domain) word set, derived from the keys of `vocabulary_10k.json`.
 * Used by `computeBePayload` for tier-aware ranking: any word in the prefix map
 * that is not in this set is treated as L3 (general English), matching the BE.
 * Populated lazily alongside `firstTokenToWords` — see `loadBePayloadData()`.
 */
let l2Words: Set<string> = new Set();

/**
 * Array of token IDs that appear as a first token for at least one vocabulary
 * word. Derived from `firstTokenToWords` when the data loads so `computeBePayload`
 * does not re-allocate this array on every word-boundary call.
 */
let prefixMapTokenIds: number[] = [];

/** De-dupes concurrent loads and lets repeated calls await the same payload. */
let bePayloadDataPromise: Promise<void> | undefined;

/**
 * Unwrap a dynamically imported JSON module to the parsed JSON value, working
 * across the two interop modes AFM's bundler chain emits:
 *
 *   1. **`.default`-wrapped namespace** — classic webpack (and Jest) hang the
 *      JSON value under the `default` export.
 *   2. **Named-exports namespace** — webpack 5 / atlaspack with JSON
 *      named-exports (or native ESM JSON modules) expose each top-level key as
 *      a named export and shadow `default`, so `mod.default` can be `undefined`
 *      (or some unrelated value) even though `mod` itself holds the data.
 *
 * The caller MUST declare the underlying JSON shape via `shape` because, in
 * named-exports mode, a dense array `["a","b"]` and a sparse numeric-keyed
 * object `{"5":"a","12":"b"}` are emitted identically (`{"0":..}` / `{"5":..}`);
 * no runtime heuristic can tell them apart, so only the caller knows which:
 *
 *   - `'object'` — the JSON is a `{...}` (including sparse maps keyed by integer
 *     IDs). The named exports are rebuilt into a plain object so `Object.entries`
 *     yields the real keys, not synthetic array indices.
 *   - `'array'` — the JSON is a `[...]`, reconstructed from the `0..n-1` indices.
 *
 * :param mod: The raw module object returned by `await import('./*.json')`.
 * :param shape: `'object'` if the source JSON is `{...}`, `'array'` if `[...]`.
 * :returns: The parsed JSON value, or `null` if neither interop mode applies.
 */
const unwrapJsonModule = <T>(mod: unknown, shape: 'object' | 'array'): T | null => {
	if (mod == null || typeof mod !== 'object') {
		return null;
	}
	const namespace = mod as Record<string, unknown> & { default?: unknown };

	// Compute the named-export own-keys (strip synthetic markers).
	const ownKeys = Object.keys(namespace).filter((k) => k !== 'default' && k !== '__esModule');

	// PREFER named exports when present — they always reflect the JSON's real
	// top-level keys / indices, regardless of what `default` happens to be.
	// Under JSON named-exports mode `default` is not necessarily the parsed
	// value (e.g. for `{"service": 0, ...}` it can be the number `0`, with the
	// real data in the named exports), so taking `default` first would corrupt it.
	if (ownKeys.length > 0) {
		if (shape === 'array') {
			// JSON arrays are dense; reconstruct from `0..length-1` indices.
			const len = ownKeys.length;
			const arr = new Array(len);
			for (let i = 0; i < len; i++) {
				arr[i] = namespace[String(i)];
			}
			return arr as T;
		}
		// shape === 'object'. Rebuild a plain object from the (stripped) own
		// keys so callers can `Object.entries()` it without iterating over
		// `default` / `__esModule`, and to detach from the module-namespace
		// object (which is sealed/non-extensible on some bundler outputs).
		const obj: Record<string, unknown> = {};
		for (const k of ownKeys) {
			obj[k] = namespace[k];
		}
		return obj as T;
	}

	// Fallback: no named exports — classic webpack JSON-module interop where
	// the whole parsed JSON value is hung under `default`. Trust it.
	if ('default' in namespace && namespace.default != null) {
		return namespace.default as T;
	}

	return null;
};

/**
 * Lazily load and build the BE-parity lookup tables from their JSON payloads.
 * The dynamic imports are split into their own async chunks so neither file is
 * bundled into the editor's main chunk unless local inference is initialised.
 *
 * :returns:
 *   A promise that resolves once `firstTokenToWords`, `l2Words` and
 *   `prefixMapTokenIds` are populated.
 */
const loadBePayloadData = (): Promise<void> => {
	if (!bePayloadDataPromise) {
		bePayloadDataPromise = (async () => {
			const [firstTokenToWordsModule, vocabularyModule] = await Promise.all([
				import(
					/* webpackChunkName: "@atlaskit-internal_editor-plugin-autocomplete-first-token-to-words" */ './data/first_token_to_words.json'
				),
				import(
					/* webpackChunkName: "@atlaskit-internal_editor-plugin-autocomplete-vocabulary-10k" */ './data/vocabulary_10k.json'
				),
			]);

			const firstTokenToWordsData = unwrapJsonModule<Record<string, string[]>>(
				firstTokenToWordsModule,
				'object',
			);
			const vocabularyData = unwrapJsonModule<{ words: Record<string, unknown> }>(
				vocabularyModule,
				'object',
			);

			if (firstTokenToWordsData == null || vocabularyData?.words == null) {
				// Hard-fail with a precise message so the catch() in initEngine logs
				// exactly which import couldn't be unwrapped, rather than the generic
				// V8 "Cannot convert undefined or null to object" we hit before the
				// helper was added.
				throw new Error(
					`[LocalSlowLane] JSON module could not be unwrapped — ` +
						`firstTokenToWordsData=${firstTokenToWordsData == null ? 'null/undefined' : 'defined'}, ` +
						`vocabularyData=${vocabularyData == null ? 'null/undefined' : vocabularyData.words == null ? 'defined but missing .words' : 'defined'}`,
				);
			}

			firstTokenToWords = new Map(
				Object.entries(firstTokenToWordsData).map(([tokenId, words]) => [Number(tokenId), words]),
			);
			l2Words = new Set(Object.keys(vocabularyData.words));
			prefixMapTokenIds = Array.from(firstTokenToWords.keys());

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					'%c[LocalSlowLane] %c✅ BE-parity payload data loaded:',
					'color: #9c27b0; font-weight: bold;',
					'color: #4caf50; font-weight: bold;',
					{
						firstTokenToWordsEntries: firstTokenToWords.size,
						l2WordsCount: l2Words.size,
						prefixMapTokenIdsLength: prefixMapTokenIds.length,
					},
				);
			}
		})().catch((e) => {
			// Don't cache a rejected promise — a transient import failure would
			// otherwise prevent the local model from ever initialising again this
			// session. Reset so the next init attempt retries.
			bePayloadDataPromise = undefined;
			throw e;
		});
	}
	return bePayloadDataPromise;
};

/**
 * Convert a raw next-token logit vector into a whole-word probability payload,
 * faithfully porting the BE `CausalLMEncoder._get_top_k_probs`
 * (`cc-smarts/python-sidecar/src/causal_lm_encoder.py`).
 *
 * Steps: (1) numerically-stable masked softmax over only the token ids present
 * in the prefix-expansion map; (2) spread each token's probability to every
 * whole word sharing that first token, taking the max; (3) reserve the top L2
 * words unconditionally; (4) rank the remainder in a log-space pool with an
 * additive L2 bias; (5) emit raw probabilities for the survivors, lowercased
 * and trimmed at `MIN_PROB`.
 *
 * :params:
 *   rawLogits: Full-vocabulary logits from the LM's single decode step
 *   prefixMap: Map of first-token id to the words starting with that token
 *   domainWords: Set of L2 (domain) words, for tier-aware ranking
 * :returns:
 *   A record of lowercase word to probability — the BE `lm_logits` payload
 */
export const computeBePayload = (
	rawLogits: Float32Array,
	prefixMap: Map<number, string[]>,
	domainWords: Set<string>,
	/**
	 * Pre-derived token-ID array for the softmax mask. Defaults to the
	 * module-level `prefixMapTokenIds` (zero allocation in production). Pass
	 * `Array.from(prefixMap.keys())` in tests that supply a custom prefixMap so
	 * the softmax mask stays consistent with the iteration in Step 2.
	 */
	validTokenIds: number[] = prefixMapTokenIds,
): Record<string, number> => {
	// 1. Numerically-stable masked softmax over validTokenIds only.
	let maxLogit = -Infinity;
	for (const id of validTokenIds) {
		const v = rawLogits[id];
		if (v > maxLogit) {
			maxLogit = v;
		}
	}
	let sumExp = 0;
	const expByToken = new Map<number, number>();
	for (const id of validTokenIds) {
		const e = Math.exp(rawLogits[id] - maxLogit);
		expByToken.set(id, e);
		sumExp += e;
	}

	// 2. Prefix expansion with max aggregation (probabilities sum to 1 over the
	//    masked subset, so divide each token's exp by sumExp on the fly).
	const wordProbs = new Map<string, number>();
	for (const [id, words] of prefixMap) {
		const p = sumExp > 0 ? (expByToken.get(id) ?? 0) / sumExp : 0;
		for (const w of words) {
			const prev = wordProbs.get(w) ?? 0;
			if (p > prev) {
				wordProbs.set(w, p);
			}
		}
	}

	// 3. Split into L2 / L3 and reserve the top L2 slots unconditionally.
	const l2Matches: Array<[string, number]> = [];
	const l3Matches: Array<[string, number]> = [];
	for (const [w, p] of wordProbs) {
		if (domainWords.has(w)) {
			l2Matches.push([w, p]);
		} else {
			l3Matches.push([w, p]);
		}
	}
	l2Matches.sort((a, b) => b[1] - a[1]);
	const reserved = l2Matches.slice(0, BE_PARITY.RESERVED_L2_SLOTS);

	// 4. Pool the leftovers in log space; the L2 bias only affects ranking here.
	// Words in l2Matches are unique and the array is sorted descending, so the
	// non-reserved entries are exactly the tail after the reserved prefix — slice
	// it directly rather than allocating a Set and scanning every entry on this
	// hot path (runs ~every word boundary while typing).
	const pool: Array<[string, number]> = [];
	for (const [w, p] of l2Matches.slice(BE_PARITY.RESERVED_L2_SLOTS)) {
		pool.push([w, Math.log(Math.max(p, 1e-10)) + BE_PARITY.L2_BIAS]);
	}
	for (const [w, p] of l3Matches) {
		pool.push([w, Math.log(Math.max(p, 1e-10))]);
	}
	pool.sort((a, b) => b[1] - a[1]);
	const remainingSlots = Math.max(0, BE_PARITY.TOP_K_WORDS - reserved.length);
	const poolWinners = pool.slice(0, remainingSlots);

	// 5. Assemble payload: store RAW probabilities (the bias was ranking-only),
	// lowercase keys, trimmed at MIN_PROB. Reserved first, then pool winners.
	// Reserved entries are written first; pool-winner writes must NOT clobber a
	// reserved entry whose normalised key collides (two source words can
	// `.trim().toLowerCase()` to the same key — e.g. "Function" vs "function ").
	// Without the existence guard, a low-probability pool winner would silently
	// overwrite the (higher-probability) reserved entry, degrading top-K
	// quality in a way that's invisible from the debug summary.
	const result: Record<string, number> = {};
	const addEntry = (word: string, prob: number, allowOverwrite: boolean): void => {
		if (prob <= BE_PARITY.MIN_PROB) {
			return;
		}
		const key = word.trim().toLowerCase();
		if (!allowOverwrite && key in result) {
			return;
		}
		result[key] = prob;
	};
	for (const [w, p] of reserved) {
		addEntry(w, p, true);
	}
	for (const [w] of poolWinners) {
		addEntry(w, wordProbs.get(w) ?? 0, false);
	}

	if (isAutocompleteDebugEnabled()) {
		const topReserved = reserved
			.slice(0, 5)
			.map(([w, p]) => `${w}:${(p * 100).toFixed(2)}%`)
			.join(', ');
		const topPool = poolWinners
			.slice(0, 5)
			.map(([w]) => `${w}:${((wordProbs.get(w) ?? 0) * 100).toFixed(2)}%`)
			.join(', ');
		// eslint-disable-next-line no-console
		console.log(
			'%c[computeBePayload] %c%d valid tokens → %d words expanded | L2: %d / L3: %d | reserved: %d | pool winners: %d | final: %d words\n  maxLogit(masked): %s | sumExp: %s\n  top reserved L2: %s\n  top pool: %s',
			'color: #9c27b0; font-weight: bold;',
			'color: inherit;',
			validTokenIds.length,
			wordProbs.size,
			l2Matches.length,
			l3Matches.length,
			reserved.length,
			poolWinners.length,
			Object.keys(result).length,
			maxLogit.toFixed(3),
			sumExp.toFixed(1),
			topReserved || '(none)',
			topPool || '(none)',
		);
	}

	return result;
};

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create a local slow-lane client powered by MLC WebLLM.
 *
 * The engine is initialised lazily — model weights are downloaded (and cached
 * in IndexedDB) on first use. Subsequent page loads skip the download.
 *
 * Usage:
 * ```ts
 * const client = createLocalSlowLaneClient({ debounceMs: 300 });
 * // On word boundaries:
 * client.updateContext(docText);
 * // In scoring pipeline:
 * const vec = client.getContextVector();
 * const logits = client.getLmLogits();
 * // On plugin teardown:
 * client.destroy();
 * ```
 */
export const createLocalSlowLaneClient = (
	config: LocalSlowLaneClientConfig = {},
): LocalSlowLaneClient => {
	const {
		debounceMs = DEFAULT_DEBOUNCE_MS,
		onUpdate,
		onStatus,
		onLoadError,
		onLoadSuccess,
		modelId = LOCAL_MLC_CAUSAL_MODEL_ID,
		customModelConfig,
	} = config;

	// ── State ──────────────────────────────────────────────────────────────
	let storedContextVector: Float32Array | null = null;
	let storedLmLogits: Record<string, number> | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let lastRequestedText = '';
	let requestCounter = 0;
	let latestRequestId = -1;
	let inferenceInFlight = false;
	let activeInferenceText: string | null = null;
	// The requestId of the inference currently in flight. Tracked so the
	// in-flight dedup path can restore `latestRequestId` to it — otherwise an
	// intermediate keystroke that bumped `latestRequestId` would cause the
	// in-flight (still-current) result to be discarded as stale.
	let activeInferenceRequestId = -1;
	let pendingInference: { requestId: number; text: string } | null = null;
	let ready = false;
	let destroyed = false;
	let initFailed = false;
	let engine: MLCEngine | null = null;
	let engineInitPromise: Promise<void> | null = null;
	// Captures raw next-token logits from the LM's single decode step. Registered
	// with the engine below; `lmLogitsCapture.captured` is consumed in a later step.
	const lmLogitsCapture = new CapturingLogitProcessor();

	const unloadEngine = (engineToUnload: MLCEngine): void => {
		engineToUnload.unload().catch((error: unknown) => {
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					'%c[LocalSlowLane] %cFailed to unload engine',
					'color: #9c27b0; font-weight: bold;',
					'color: inherit;',
					error,
				);
			}
		});
	};

	// ── Engine initialisation ──────────────────────────────────────────────

	const initProgressCallback = (progress: InitProgressReport): void => {
		const message = `[${(progress.progress * 100).toFixed(0)}%] ${progress.text}`;
		if (isAutocompleteDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.log(
				`%c[LocalSlowLane] %c🔄 ${message}`,
				'color: #9c27b0; font-weight: bold;',
				'color: inherit;',
			);
		}
		onStatus?.(message);
	};

	const bytesToMB = (bytes?: number): number | undefined =>
		typeof bytes === 'number' ? Math.round(bytes / (1024 * 1024)) : undefined;

	/**
	 * Inspect the machine's WebGPU support so a load failure can be attributed
	 * to a concrete hardware/browser limitation rather than a generic error.
	 */
	const probeWebGpuCapabilities = async (): Promise<WebGpuCapabilities> => {
		const gpu = (navigator as Navigator & { gpu?: MinimalGpu }).gpu;
		if (!gpu) {
			return { available: false };
		}
		try {
			const adapter = await gpu.requestAdapter();
			if (!adapter) {
				return { available: true, adapterAvailable: false };
			}
			let vendor: string | undefined;
			let architecture: string | undefined;
			try {
				const info = adapter.info ?? (await adapter.requestAdapterInfo?.());
				vendor = info?.vendor || undefined;
				architecture = info?.architecture || undefined;
			} catch {
				// adapter info is best-effort
			}
			return {
				available: true,
				adapterAvailable: true,
				shaderF16Supported: adapter.features.has('shader-f16'),
				maxBufferSizeMB: bytesToMB(adapter.limits?.maxBufferSize),
				maxStorageBufferBindingSizeMB: bytesToMB(adapter.limits?.maxStorageBufferBindingSize),
				vendor,
				architecture,
			};
		} catch {
			return { available: true, adapterAvailable: false };
		}
	};

	/** Map an MLC/WebLLM engine-creation error message to a coarse reason. */
	const classifyEngineError = (message: string): LocalSlowLaneLoadErrorReason => {
		const lower = message.toLowerCase();
		if (
			lower.includes('loading chunk') ||
			lower.includes('dynamically imported module') ||
			lower.includes('dynamic import')
		) {
			return 'module_load_failed';
		}
		if (
			lower.includes('out of memory') ||
			// eslint-disable-next-line require-unicode-regexp
			/\boom\b/.test(lower) ||
			lower.includes('allocation') ||
			lower.includes('exceeds') ||
			lower.includes('buffer size') ||
			lower.includes('not enough memory')
		) {
			return 'insufficient_memory';
		}
		// Pre-flight already returns missing_shader_f16 when the feature is absent,
		// so only match the exact feature token here — not bare 'shader' (compile
		// errors) or bare 'f16' (present in model ids like q0f16-MLC).
		if (lower.includes('shader-f16') || lower.includes('shader_f16')) {
			return 'missing_shader_f16';
		}
		if (
			lower.includes('fetch') ||
			lower.includes('network') ||
			lower.includes('download') ||
			lower.includes('http') ||
			lower.includes('cache')
		) {
			return 'model_download_failed';
		}
		return 'init_failed';
	};

	// Canonical, controlled failure descriptions. We never emit the raw engine
	// error into analytics — it can embed customer-context URLs/paths (HOT-120175)
	// — so the analytics `message` is always one of these fixed strings.
	const LOAD_FAILURE_MESSAGE: Record<LocalSlowLaneLoadErrorReason, string> = {
		webgpu_unavailable: 'WebGPU is not available in this browser',
		webgpu_no_adapter: 'No compatible WebGPU adapter found',
		missing_shader_f16: 'GPU does not support the shader-f16 feature',
		insufficient_memory: 'Insufficient GPU memory to load the model',
		model_download_failed: 'Failed to download model assets',
		module_load_failed: 'Failed to load the web-llm runtime module',
		init_failed: 'Model engine failed to initialise',
	};

	const handleLoadFailure = (
		reason: LocalSlowLaneLoadErrorReason,
		capabilities: WebGpuCapabilities,
		// Raw engine error — local debug logging only, never sent to analytics.
		debugDetail?: string,
	): void => {
		ready = false;
		const message = LOAD_FAILURE_MESSAGE[reason];
		if (isAutocompleteDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.log(
				`[LocalSlowLane] Engine initialisation failed (${reason}): ${debugDetail ?? message}`,
			);
		}
		onStatus?.(`Engine initialisation failed: ${message}`);
		onLoadError?.({
			reason,
			message,
			modelId,
			embeddingModelId: LOCAL_MLC_EMBEDDING_MODEL_ID,
			capabilities,
		});
		engineInitPromise = null;
		initFailed = true;
	};

	const initEngine = async (): Promise<void> => {
		const capabilities = await probeWebGpuCapabilities();

		// ── Pre-flight: machine limitations short-circuit before the expensive load ──
		if (!capabilities.available) {
			handleLoadFailure('webgpu_unavailable', capabilities);
			return;
		}
		if (capabilities.adapterAvailable === false) {
			handleLoadFailure('webgpu_no_adapter', capabilities);
			return;
		}
		if (capabilities.shaderF16Supported === false) {
			handleLoadFailure('missing_shader_f16', capabilities);
			return;
		}

		const startTime = performance.now();

		try {
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[LocalSlowLane] %c🚀 Initialising MLC engine with models: ${modelId} (LM) + ${LOCAL_MLC_EMBEDDING_MODEL_ID} (embedder)`,
					'color: #9c27b0; font-weight: bold;',
					'color: inherit;',
				);
			}
			onStatus?.(`Initialising models: ${modelId} + ${LOCAL_MLC_EMBEDDING_MODEL_ID}…`);

			// Fetch the web-llm runtime and the BE-parity lookup tables in parallel;
			// both are dynamically imported so they stay out of the main editor chunk.
			const [{ MLCEngine: MLCEngineCtor, prebuiltAppConfig }] = await Promise.all([
				import(
					/* webpackChunkName: "@atlaskit-internal_editor-plugin-autocomplete-mlc-web-llm" */ '@mlc-ai/web-llm'
				),
				loadBePayloadData(),
			]);

			const customModelRecord: WebLlmModelRecord | undefined = customModelConfig
				? {
						model: customModelConfig.model,
						model_id: modelId,
						model_lib: customModelConfig.modelLib,
						low_resource_required: true,
						required_features: ['shader-f16'],
						...(customModelConfig.vramRequiredMB !== undefined
							? {
									vram_required_MB: customModelConfig.vramRequiredMB,
								}
							: {}),
						...(customModelConfig.contextWindowSize !== undefined
							? {
									overrides: {
										context_window_size: customModelConfig.contextWindowSize,
									},
								}
							: {}),
					}
				: undefined;

			const appConfig: AppConfig = {
				model_list: [
					...prebuiltAppConfig.model_list,
					...(customModelRecord ? [customModelRecord] : []),
				],
			};

			// Construct the engine with the logit-capture processor registered for
			// the causal LM only (the embedder never decodes tokens), then load
			// both the LM and the embedder into the same engine (multi-model).
			const newEngine = new MLCEngineCtor({
				appConfig,
				initProgressCallback,
				logitProcessorRegistry: new Map([[modelId, lmLogitsCapture]]),
			});

			await newEngine.reload([modelId, LOCAL_MLC_EMBEDDING_MODEL_ID]);

			if (destroyed) {
				// destroy() was called while we were loading — clean up
				unloadEngine(newEngine);
				return;
			}

			engine = newEngine;
			ready = true;
			const loadDurationMs = Math.round(performance.now() - startTime);

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					'%c[LocalSlowLane] %c✅ Both models loaded and ready',
					'color: #9c27b0; font-weight: bold;',
					'color: #4caf50;',
				);
				// One-time identity summary so you can confirm which models are active
				// without digging through the init-progress scroll.
				// eslint-disable-next-line no-console
				console.log(
					'%c[LocalSlowLane] %c🧠 Causal LM    →',
					'color: #9c27b0; font-weight: bold;',
					'color: #2196f3; font-weight: bold;',
					modelId,
				);
				// eslint-disable-next-line no-console
				console.log(
					'%c[LocalSlowLane] %c🔢 Embedder     →',
					'color: #9c27b0; font-weight: bold;',
					'color: #009688; font-weight: bold;',
					LOCAL_MLC_EMBEDDING_MODEL_ID,
				);
			}
			onStatus?.('Model loaded and ready.');
			onLoadSuccess?.({
				modelId,
				embeddingModelId: LOCAL_MLC_EMBEDDING_MODEL_ID,
				loadDurationMs,
				capabilities,
			});
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : String(err);
			handleLoadFailure(classifyEngineError(errorMsg), capabilities, errorMsg);
		}
	};

	const ensureEngineInitialized = (): Promise<void> => {
		if (initFailed) {
			return Promise.resolve();
		}
		if (!engineInitPromise) {
			engineInitPromise = initEngine();
		}
		return engineInitPromise;
	};

	// ── Inference ──────────────────────────────────────────────────────────

	/**
	 * Run a single forward pass to produce the BE-parity slow-lane outputs.
	 *
	 * Two calls run in parallel on the shared engine:
	 *   - `completions.create({ max_tokens: 1 })` runs the causal LM for exactly
	 *     one decode step. We ignore the generated text; the LogitProcessor
	 *     captures the raw next-token logits during that step, which we turn into
	 *     a whole-word payload via `computeBePayload`.
	 *   - `embeddings.create(...)` runs the Arctic embedder to produce the real
	 *     384-d semantic vector (passage-encoded; see `wrapForArctic`).
	 */
	const runInference = async (text: string, requestId: number): Promise<void> => {
		if (!engine || destroyed) {
			return;
		}

		// Clear the capture buffer so we read only this pass's logits. The engine
		// serialises per-model requests and updateContext is debounced, so the
		// latest request's decode step is the last to populate `captured` before
		// we read it below; stale requests bail on the latestRequestId guard.
		lmLogitsCapture.resetState();

		// Apply BE-parity rolling-window truncation before both encoders.
		// BE semantic: last max_context_words words (typeahead_context_encoding.py:36)
		// BE causal LM: last max_context_tokens BPE tokens (causal_lm_encoder.py:194–198),
		//               approximated here with word count (no tokenizer available on FE).
		const lmText = truncateToLastNWords(text, BE_PARITY.MAX_CONTEXT_TOKENS);
		const semanticText = truncateToLastNWords(text, BE_PARITY.MAX_CONTEXT_WORDS);
		const arcticInput = wrapForArctic(semanticText);
		const captureCompletionTime = <T>(
			promise: Promise<T>,
			onResolved: (resolvedAt: number) => void,
		): Promise<T> =>
			promise.then((value: T) => {
				onResolved(performance.now());
				return value;
			});

		if (isAutocompleteDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.log(
				`%c[LocalSlowLane] %c🔢 Arctic input (${arcticInput.length} chars, ${splitOnWhitespace(semanticText).length} words): "${arcticInput.length > 100 ? `${arcticInput.slice(0, 100)}…` : arcticInput}"`,
				'color: #9c27b0; font-weight: bold;',
				'color: #009688;',
			);
			// eslint-disable-next-line no-console
			console.log(
				`%c[LocalSlowLane] %c🧠 LM input (${lmText.length} chars, ${splitOnWhitespace(lmText).length} words): "${lmText.length > 100 ? `${lmText.slice(0, 100)}…` : lmText}"`,
				'color: #9c27b0; font-weight: bold;',
				'color: #2196f3;',
			);
		}

		try {
			const tStart = performance.now();
			let tLmDone = 0;
			let tEmbDone = 0;

			const [, embeddingResponse] = await Promise.all([
				captureCompletionTime(
					engine.completions.create({
						model: modelId,
						prompt: lmText,
						max_tokens: 1,
						temperature: 0,
						logprobs: false,
					}),
					(resolvedAt) => {
						tLmDone = resolvedAt;
					},
				),
				captureCompletionTime(
					engine.embeddings.create({
						model: LOCAL_MLC_EMBEDDING_MODEL_ID,
						input: arcticInput,
					}),
					(resolvedAt) => {
						tEmbDone = resolvedAt;
					},
				),
			]);

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[LocalSlowLane] %c⏱ LM: ${(tLmDone - tStart).toFixed(0)}ms | Embedder: ${(tEmbDone - tStart).toFixed(0)}ms | Total: ${(Math.max(tLmDone, tEmbDone) - tStart).toFixed(0)}ms`,
					'color: #9c27b0; font-weight: bold;',
					'color: #ff9800;',
				);
			}

			// Discard stale results
			if (requestId < latestRequestId || destroyed) {
				return;
			}

			// ── LM logits: whole-word BE-parity payload ──────────────────
			const rawLogits = lmLogitsCapture.captured;
			if (rawLogits) {
				const payload = computeBePayload(rawLogits, firstTokenToWords, l2Words);
				storedLmLogits = Object.keys(payload).length > 0 ? payload : null;
			} else {
				storedLmLogits = null;
			}

			// ── Semantic vector: real 384-d Arctic embedding ─────────────
			// Guard against base64-encoded responses (encoding_format: 'base64' would
			// yield a string, and new Float32Array(string) silently produces an empty
			// array, corrupting downstream cosine-similarity scoring).
			const embedding = (embeddingResponse as EmbeddingApiResponse).data?.[0]?.embedding;
			storedContextVector =
				Array.isArray(embedding) && embedding.length > 0
					? new Float32Array(embedding as number[])
					: null;

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.groupCollapsed(
					`%c[LocalSlowLane] %c📥 Inference result (request #${requestId})`,
					'color: #9c27b0; font-weight: bold;',
					'color: inherit;',
				);
				if (storedContextVector) {
					let sumSq = 0;
					for (let i = 0; i < storedContextVector.length; i++) {
						sumSq += storedContextVector[i] * storedContextVector[i];
					}
					// eslint-disable-next-line no-console
					console.log(
						`✅ semantic vector: ${storedContextVector.length} dims (L2 norm ${Math.sqrt(sumSq).toFixed(3)})`,
					);
				} else {
					// eslint-disable-next-line no-console
					console.log('❌ No vector');
				}
				// eslint-disable-next-line no-console
				console.log(
					storedLmLogits
						? `✅ lm_logits: ${Object.keys(storedLmLogits).length} words`
						: '❌ No lm_logits',
				);
				if (storedLmLogits) {
					const topTokens = Object.entries(storedLmLogits)
						.sort(([, a], [, b]) => b - a)
						.slice(0, 10);
					// eslint-disable-next-line no-console
					console.log(
						'Top 10 predictions:',
						topTokens.map(([t, p]) => `${t}: ${(p * 100).toFixed(1)}%`).join(', '),
					);
				}
				// eslint-disable-next-line no-console
				console.groupEnd();
			}

			onUpdate?.({
				textLength: text.length,
				hasVector: storedContextVector !== null,
				hasLmLogits: storedLmLogits !== null,
			});
		} catch (err) {
			// Discard errors for stale requests or after teardown
			if (requestId < latestRequestId || destroyed) {
				return;
			}

			storedContextVector = null;
			storedLmLogits = null;
			onUpdate?.({ textLength: text.length, hasVector: false, hasLmLogits: false });

			const errorMsg = err instanceof Error ? err.message : String(err);
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[LocalSlowLane] %c❌ Inference error (request #${requestId}): ${errorMsg}`,
					'color: #9c27b0; font-weight: bold;',
					'color: #f44336;',
				);
			}
		}
	};

	// ── Context update (debounced) ─────────────────────────────────────────

	const startInference = (text: string, requestId: number): void => {
		// Self-contained guard: never start a new inference cycle after teardown,
		// regardless of caller discipline.
		if (destroyed) {
			return;
		}

		inferenceInFlight = true;
		activeInferenceText = text;
		activeInferenceRequestId = requestId;

		void ensureEngineInitialized()
			.then(() => runInference(text, requestId))
			.catch(() => {})
			.finally(() => {
				inferenceInFlight = false;
				activeInferenceText = null;
				activeInferenceRequestId = -1;

				const next = pendingInference;
				pendingInference = null;
				if (next && !destroyed) {
					startInference(next.text, next.requestId);
				}
			});
	};

	const doUpdateContext = (text: string): void => {
		if (destroyed || !text || text.trim().length === 0) {
			return;
		}

		if (inferenceInFlight && text === activeInferenceText) {
			// The latest desired text already matches the in-flight inference, so
			// re-running it would be wasted work. But an intermediate keystroke may
			// have bumped `latestRequestId` past the in-flight request (and then been
			// coalesced away), which would cause runInference to discard the
			// still-current result as stale. Pin `latestRequestId` back to the active
			// request so its result is accepted, and drop any now-superseded pending
			// request.
			latestRequestId = activeInferenceRequestId;
			pendingInference = null;
			return;
		}

		if (inferenceInFlight && pendingInference?.text === text) {
			return;
		}

		const requestId = ++requestCounter;
		latestRequestId = requestId;

		if (isAutocompleteDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.groupCollapsed(
				`%c[LocalSlowLane] %c📤 Context update (request #${requestId}) | ${text.length} chars`,
				'color: #9c27b0; font-weight: bold;',
				'color: inherit;',
			);
			const lines = text.split('\n');
			lines.forEach((line, i) => {
				// eslint-disable-next-line no-console
				console.log(`  ${i === lines.length - 1 ? '▶' : ' '} ${line}`);
			});
			// eslint-disable-next-line no-console
			console.groupEnd();
		}

		if (inferenceInFlight) {
			pendingInference = { text, requestId };
			return;
		}

		startInference(text, requestId);
	};

	const updateContextDebounced = (text: string): void => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		if (inferenceInFlight) {
			pendingInference = null;
			if (text === activeInferenceText) {
				latestRequestId = activeInferenceRequestId;
				lastRequestedText = text;
				return;
			}
		}
		lastRequestedText = text;
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			doUpdateContext(lastRequestedText);
		}, debounceMs);
	};

	// ── Public API (same shape as createSlowLaneClient) ────────────────────
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
		isReady: () => ready,
		destroy: () => {
			destroyed = true;
			ready = false;
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			if (engine) {
				const engineToUnload = engine;
				engine = null;
				unloadEngine(engineToUnload);
			}
			engineInitPromise = null;
			inferenceInFlight = false;
			activeInferenceText = null;
			activeInferenceRequestId = -1;
			pendingInference = null;
			storedContextVector = null;
			storedLmLogits = null;
		},
	};
};
