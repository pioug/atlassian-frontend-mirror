/**
 * Local Slow Lane Client: On-device inference via @mlc-ai/web-llm.
 *
 * Drop-in replacement for the network-based slow-lane-client. Instead of calling
 * a backend API, this client runs two models in the browser via WebGPU, in a
 * single MLCEngine, to reproduce the BE encoder's outputs on-device:
 *
 *   - Causal LM (SmolLM2-135M-Instruct): context-keyed one-step boundary primes
 *     provide canonical first-token logits. A persistent token-prefix scheduler
 *     expands shared paths and exact-scores only plausible finalists.
 *   - Semantic embedder (Snowflake Arctic Embed S): produces the real 384-d
 *     `semantic_vector`. Inputs are wrapped as passages (see `wrapForArctic`) so
 *     the runtime vector lands in the same space as the precomputed word bin.
 *
 * ── Why main thread (no Web Worker)? ─────────────────────────────────────
 * The models are small enough (~640 MB combined VRAM) that WebGPU inference on
 * the main thread is viable:
 *
 *   - WebGPU GPU compute is inherently async (doesn't block the main thread)
 *   - CPU overhead for named-token reads and cache bookkeeping is small
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
 * Same base shape as createSlowLaneClient, plus on-device canonical-surface
 * scoring. Semantic updates remain word-boundary timed; causal work is requested
 * independently for exact pre-surface contexts.
 */

import type { AppConfig, InitProgressReport, MLCEngine } from '@mlc-ai/web-llm';

import { abortExp, EXPERIENCE_NAME, failExp, startExp, succeedExp } from '../analytics/ufo';

import { fetchAutocompleteArtifactJson } from './artifact-loader';
import { ARTIFACT_NAME } from './artifacts-manifest';
import {
	CanonicalLogitProcessor,
	CanonicalSurfaceTokenTrie,
	logSoftmaxAt,
	logSumExp,
	type BoundaryLmState,
	type BoundaryPrimeRequest,
	type ProgressiveSurfaceEvidence,
	type SurfaceScore,
	type SurfaceScoreRequest,
	type TokenPrefixExpansion,
} from './canonical-lm-scoring';
import { CTC_STYLES, isAutocompleteDebugEnabled, isAutocompleteDebugVerbose } from './debug-mode';
import { MIN_WINNER_MARGIN, STAGE1_WEIGHT, STAGE2_WEIGHT } from './scoring-pipeline';
import { isWordBoundary } from './slow-lane-client';

type WebLlmModelRecord = NonNullable<AppConfig['model_list']>[number];
type EmbeddingApiResponse = { data?: Array<{ embedding?: unknown }> };
/** Which of the two causal-LM call shapes a measurement or log line describes. */
type CausalInferenceKind = 'boundary' | 'prefix';

interface CausalInferenceAggregate {
	e2eLatencyMs: number;
	failedRequests: number;
	firstStartedAt: number;
	promptTokens: number;
	promptUsageSamples: number;
	requestedCompletionTokens: number;
	requests: number;
	sampledOutputTokens: number;
	timeToFirstTokenMs: number;
	wallClockMs: number;
	webLlmDecodeSteps: number;
	webLlmUsageSamples: number;
}

interface CausalInferenceMeasurement {
	contextKey: string;
	decodeTokensPerSecond: number | null;
	e2eLatencyMs: number | null;
	familyKey: string;
	kind: CausalInferenceKind;
	outcome: 'completed' | 'failed';
	prefillTokensPerSecond: number | null;
	promptTokens: number | null;
	promptWords: number;
	requestedCompletionTokens: number;
	sampledOutputTokens: number | null;
	timePerDecodeTokenMs: number | null;
	timeToFirstTokenMs: number | null;
	wallClockMs: number;
	warmState: 'cold-first-call' | 'warm';
	webLlmDecodeSteps: number | null;
}

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
	/** Callback fired when a context-keyed Tier-A raw-logit vector is available. */
	onBoundaryLmUpdate?: (opts: { contextKey: string; familyKey: string; latencyMs: number }) => void;
	/** Callback fired when the engine fails to load/start. */
	onLoadError?: (error: LocalSlowLaneLoadError) => void;
	/** Callback fired when the engine successfully loads and is ready. */
	onLoadSuccess?: (info: LocalSlowLaneLoadSuccess) => void;
	/** Callback fired with status messages (model loading progress, etc.). */
	onStatus?: (message: string) => void;
	/** Callback fired when grouped progress or exact surface scores become available. */
	onSurfaceScoreUpdate?: (opts: {
		contextKey: string;
		count: number;
		familyKey: string;
		latencyMs: number;
	}) => void;
	/** Callback fired when inference returns new results. */
	onUpdate?: (opts: { hasLmLogits: boolean; hasVector: boolean; textLength: number }) => void;
	/** Product/editor surface where autocomplete runs. */
	surface?: string;
}

// Same return type as createSlowLaneClient for drop-in compatibility
export interface LocalSlowLaneClient {
	/** Clean up resources. */
	destroy: () => void;
	getBoundaryLmState: (contextKey: string) => BoundaryLmState | null;
	getCanonicalSurfaceCount: () => number;
	getCanonicalSurfaceTokenIds: (surface: string) => number[] | null;
	getContextInput: () => string | null;
	getContextVector: () => Float32Array | null;
	getLmLogits: () => Record<string, number> | null;
	getProgressiveSurfaceEvidence: (
		contextKey: string,
		surface: string,
	) => ProgressiveSurfaceEvidence | null;
	getSurfaceScore: (contextKey: string, surface: string) => SurfaceScore | null;
	/** Whether the model is loaded and ready for inference. */
	isReady: () => boolean;
	isWordBoundary: (text: string) => boolean;
	primeBoundaryLm: (input: BoundaryPrimeRequest) => void;
	requestProgressiveSurfaceScores: (input: SurfaceScoreRequest) => void;
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
// eslint-disable-next-line require-unicode-regexp
const OOM_REGEX = /\boom\b/;

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

export const LOCAL_INFERENCE = {
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

export const CANONICAL_SCORING = {
	/**
	 * How many contexts keep their prefilled state before the oldest is dropped.
	 *
	 * Sizes every context-keyed cache together on purpose: an expansion needs
	 * both the boundary logits and the candidate list to still be resident, so
	 * bounding them separately would evict half of a context and strand the
	 * other half.
	 *
	 * The context of a keystroke is the text *before* the word being typed,
	 * which does not change while that word is typed, so one word should cost
	 * one prefill and then hit. Measured hit rate was 45% over the first 84s of
	 * a session and 24% over the following four minutes, well short of that, and
	 * prompt prefills per decision rose 0.80 → 1.25 across the same split while
	 * cost per prefill stayed flat. Contexts were being dropped while still live.
	 *
	 * A boundary entry holds a `Float32Array` over the 49,152-token vocabulary,
	 * so each one is ~192KB and this bound is the dominant term in the scorer's
	 * footprint: ~24MB resident here, against ~6MB at the 32 this replaced. That
	 * cost is what kept the bound low, not a hit rate anyone had measured.
	 */
	BOUNDARY_CACHE_MAX: 128,
	EXACT_MAX_TARGET_TOKENS: 8,
	PREFIX_CACHE_MAX: 256,
	/**
	 * How many candidates compete for expansion in one context.
	 *
	 * Each distinct token prefix among them is a separate branch, and a branch
	 * the engine is not already standing on costs a prompt prefill before its
	 * first decode. A wide field therefore spreads a decision's round trips
	 * across candidates and finishes none of them inside the budget.
	 */
	PROGRESSIVE_CANDIDATES_MAX: 8,
	/**
	 * Ceiling on distinct token prefixes explored per context.
	 *
	 * Raising this to 8 to give long surfaces more room did the opposite: model
	 * calls per decision went 2.35 → 4.32, the warm-KV extend share fell 40% →
	 * 31% as the extra branches displaced the live path, the prefix queue backed
	 * up to 29 deep, and acceptances per thousand decisions fell 9.3 → 6.7. No
	 * phrase was shown either way, so breadth was never the binding constraint.
	 *
	 * What blocked them then was normalisation against a short word's per-token
	 * mean, which has since been replaced by a posterior over sequence
	 * log-likelihoods. That removes the bias towards short surfaces but does not
	 * by itself make phrases reachable: a longer surface is strictly less likely
	 * than a shorter one, so a phrase sharing a shortlist with a unigram still
	 * holds little of its mass. Whether the remaining gap is the threshold or the
	 * comparison is still open.
	 */
	PROGRESSIVE_EXPANSIONS_PER_CONTEXT_MAX: 4,
	PROGRESSIVE_INPUT_MAX: 400,
	SURFACE_CACHE_MAX: 128,
	TIER_A_PRIMES_MAX: 3,
} as const;
/**
 * How much optimistic score we give up to stay on the warm KV path.
 *
 * Expanding a prefix the cache already holds costs one decode step, while
 * branching to any other prefix costs a full prompt prefill first. Measured,
 * that is about 30ms against about 66ms, so continuing the live path is worth
 * roughly half a round trip and the margin has to be wide enough to reflect
 * that. At the previous 0.05 almost any ranking difference was enough to
 * abandon the sequence, and 70% of expansions ended up re-prefilling.
 */
const PROGRESSIVE_WARM_PATH_MARGIN = 0.25;

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

/**
 * Full canonical leading-space token sequence for every served surface. The
 * producer keeps the existing `phrase-continuation-tokens.json` wire name while
 * expanding its key set to the complete word/bigram/phrase union.
 */
let surfaceTokenIds: Map<string, number[]> = new Map();
let surfaceTokenTrie = new CanonicalSurfaceTokenTrie();

/** De-dupes concurrent loads and lets repeated calls await the same payload. */
let surfaceTokenIdsPromise: Promise<void> | undefined;

const isPhraseContinuationTokens = (payload: unknown): payload is Record<string, number[]> => {
	if (payload == null || typeof payload !== 'object') {
		return false;
	}
	return Object.values(payload as Record<string, unknown>).every(
		(value) =>
			Array.isArray(value) && value.every((entry) => typeof entry === 'number' && entry >= 0),
	);
};

/** Lazily load the producer's full-union canonical surface token map. */
const loadCanonicalSurfaceTokens = (): Promise<void> => {
	if (!surfaceTokenIdsPromise) {
		surfaceTokenIdsPromise = (async () => {
			const continuationTokensData = await fetchAutocompleteArtifactJson<Record<string, number[]>>(
				ARTIFACT_NAME.PHRASE_CONTINUATION_TOKENS,
				{
					summarize: (payload) => `${Object.keys(payload).length} surfaces`,
					validate: isPhraseContinuationTokens,
				},
			).catch(() => null);

			surfaceTokenIds = new Map(
				Object.entries(continuationTokensData ?? {}).map(([surface, tokenIds]) => [
					surface.toLowerCase(),
					tokenIds,
				]),
			);
			surfaceTokenTrie = new CanonicalSurfaceTokenTrie(surfaceTokenIds.entries());

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[CTC:model] %c${surfaceTokenIds.size > 0 ? '✅ canonical surface tokens loaded:' : '⚠️ canonical surface tokens unavailable — LM evidence will remain absent:'}`,
					'color: #9c27b0; font-weight: bold;',
					surfaceTokenIds.size > 0
						? 'color: #4caf50; font-weight: bold;'
						: 'color: #ff9800; font-weight: bold;',
					{ surfaces: surfaceTokenIds.size },
				);
			}
		})().catch((e) => {
			// Don't cache a rejected promise — a transient import failure would
			// otherwise prevent the local model from ever initialising again this
			// session. Reset so the next init attempt retries.
			surfaceTokenIdsPromise = undefined;
			throw e;
		});
	}
	return surfaceTokenIdsPromise;
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
 * // Candidate scoring independently calls
 * // primeBoundaryLm/requestProgressiveSurfaceScores.
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
		onBoundaryLmUpdate,
		onSurfaceScoreUpdate,
		onStatus,
		onLoadError,
		onLoadSuccess,
		modelId = LOCAL_MLC_CAUSAL_MODEL_ID,
		customModelConfig,
		surface,
	} = config;

	// ── State ──────────────────────────────────────────────────────────────
	let storedContextInput: string | null = null;
	let storedContextVector: Float32Array | null = null;
	let storedLmLogits: Record<string, number> | null = null;
	const boundaryCache = new Map<string, BoundaryLmState>();
	const prefixExpansionCache = new Map<string, TokenPrefixExpansion>();
	const surfaceScoreCache = new Map<string, SurfaceScore>();
	let causalInFlight = false;
	let inFlightBoundaryContextKey: string | null = null;
	let latestCausalFamilyKey = '';
	let causalRequestsThisFamily = 0;
	let causalGeneratedTokensThisFamily = 0;
	let tierAPrimeCacheHitsThisFamily = 0;
	let tierAPrimeCacheMissesThisFamily = 0;
	let causalInferenceOrdinal = 0;
	const causalInferenceByContext = new Map<string, CausalInferenceAggregate>();
	const causalInferenceByFamily = new Map<string, CausalInferenceAggregate>();
	const exactEvidenceCountByContext = new Map<string, number>();
	const pendingBoundaryPrimes = new Map<string, BoundaryPrimeRequest>();
	interface PrefixExpansionRequest {
		contextKey: string;
		familyKey: string;
		prompt: string;
		surfaces: string[];
		tokenPrefix: number[];
	}
	const pendingPrefixExpansions = new Map<string, PrefixExpansionRequest>();
	const inFlightPrefixExpansions = new Set<string>();
	// The engine holds exactly one linear KV sequence. WebLLM lets us extend it
	// (`forwardTokensAndSample`) or drop it (a text completion always resets
	// first), but never fork or rewind it. Tracking what is currently
	// materialised is what makes decoding continuous: expanding a token prefix
	// that extends `kvPath` costs a single decode step, while any other prefix
	// costs a fresh prompt prefill.
	let kvContextKey: string | null = null;
	let kvPath: number[] = [];

	const isPrefixOf = (prefix: number[], path: number[]): boolean =>
		prefix.length <= path.length && prefix.every((token, index) => token === path[index]);
	/**
	 * Whether running this expansion would extend the sequence the engine is
	 * already holding rather than discarding it for a fresh prompt prefill.
	 *
	 * `planProgressiveExpansion` also prefers a warm group, but it decides when
	 * the work is queued and the queue is drained later. A boundary prime or
	 * another context's expansion running in between moves the path out from
	 * under that choice, so the preference has to be re-checked at the moment
	 * something is picked up.
	 */
	const extendsLiveKvPath = (request: PrefixExpansionRequest): boolean =>
		kvContextKey === request.contextKey && isPrefixOf(kvPath, request.tokenPrefix);
	const progressiveRequests = new Map<string, SurfaceScoreRequest>();
	const progressivePrefixesByContext = new Map<string, Set<string>>();
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
	const causalLogitProcessor = new CanonicalLogitProcessor();

	const unloadEngine = (engineToUnload: MLCEngine): void => {
		engineToUnload.unload().catch((error: unknown) => {
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					'%c[CTC:model] %cFailed to unload engine',
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
				`%c[CTC:model] %c🔄 ${message}`,
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
				const info =
					(adapter as MinimalGpuAdapter).info ??
					(await (adapter as MinimalGpuAdapter).requestAdapterInfo?.());
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
			OOM_REGEX.test(lower) ||
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
				`[CTC:model] Engine initialisation failed (${reason}): ${debugDetail ?? message}`,
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
					`%c[CTC:model] %c🚀 Initialising MLC engine with models: ${modelId} (LM) + ${LOCAL_MLC_EMBEDDING_MODEL_ID} (embedder)`,
					'color: #9c27b0; font-weight: bold;',
					'color: inherit;',
				);
			}
			onStatus?.(`Initialising models: ${modelId} + ${LOCAL_MLC_EMBEDDING_MODEL_ID}…`);

			// Fetch the web-llm runtime and canonical token artifact in parallel;
			// both are dynamically imported so they stay out of the main editor chunk.
			const [{ MLCEngine: MLCEngineCtor, prebuiltAppConfig }] = await Promise.all([
				import(
					/* webpackChunkName: "@atlaskit-internal_editor-plugin-autocomplete-mlc-web-llm" */ '@mlc-ai/web-llm'
				),
				loadCanonicalSurfaceTokens(),
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
				logitProcessorRegistry: new Map([[modelId, causalLogitProcessor]]),
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
					'%c[CTC:model] %c✅ Both models loaded and ready',
					'color: #9c27b0; font-weight: bold;',
					'color: #4caf50;',
				);
				// One-time identity summary so you can confirm which models are active
				// without digging through the init-progress scroll.
				// eslint-disable-next-line no-console
				console.log(
					'%c[CTC:model] %c🧠 Causal LM    →',
					'color: #9c27b0; font-weight: bold;',
					'color: #2196f3; font-weight: bold;',
					modelId,
				);
				// eslint-disable-next-line no-console
				console.log(
					'%c[CTC:model] %c🔢 Embedder     →',
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

	/** Run the boundary-timed Arctic semantic inference independently of the LM. */
	const runInference = async (text: string, requestId: number): Promise<void> => {
		if (!engine || destroyed) {
			return;
		}

		const experienceId = String(requestId);

		const semanticText = truncateToLastNWords(text, LOCAL_INFERENCE.MAX_CONTEXT_WORDS);
		const arcticInput = wrapForArctic(semanticText);

		if (isAutocompleteDebugVerbose()) {
			// eslint-disable-next-line no-console
			console.log(
				`%c[CTC:model] %c🔢 Arctic input (${arcticInput.length} chars, ${splitOnWhitespace(semanticText).length} words): "${arcticInput.length > 100 ? `${arcticInput.slice(0, 100)}…` : arcticInput}"`,
				'color: #9c27b0; font-weight: bold;',
				'color: #009688;',
			);
		}

		try {
			// Reuse the network slow-lane-fetch UFO experience (tagged isLocalLLM:true,
			// matching LOAD_VECTORS/LOAD_VOCABULARY) so on-device inference
			// latency/success-rate feeds the same FE Reliability SLO. Started inside
			// the try — post engine-init (parity with the network fetch, which
			// excludes the one-time model load) and so the catch below always
			// terminates the experience, even on a synchronous throw.
			startExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, experienceId, {
				textLength: text.length,
				isLocalLLM: true,
				...(surface ? { surface } : {}),
			});

			const tStart = performance.now();
			const embeddingResponse = await engine.embeddings.create({
				model: LOCAL_MLC_EMBEDDING_MODEL_ID,
				input: arcticInput,
			});
			const tEmbDone = performance.now();

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[CTC:model] %c⏱ Embedder: ${(tEmbDone - tStart).toFixed(0)}ms`,
					'color: #9c27b0; font-weight: bold;',
					'color: #ff9800;',
				);
			}

			// Discard stale results
			if (requestId < latestRequestId || destroyed) {
				abortExp(
					EXPERIENCE_NAME.SLOW_LANE_FETCH,
					experienceId,
					destroyed ? 'destroyed' : 'superseded',
					{ isLocalLLM: true, ...(surface ? { surface } : {}) },
				);
				return;
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
			storedContextInput = storedContextVector ? semanticText : null;

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.groupCollapsed(
					`%c[CTC:model] %c📥 Inference result (request #${requestId})`,
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
				console.log('🧠 causal LM: independently primed by exact candidate contexts');
				// eslint-disable-next-line no-console
				console.groupEnd();
			}

			succeedExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, experienceId, {
				textLength: text.length,
				hasVector: storedContextVector !== null,
				hasLmLogits: false,
				isLocalLLM: true,
				...(surface ? { surface } : {}),
			});

			onUpdate?.({
				textLength: text.length,
				hasVector: storedContextVector !== null,
				hasLmLogits: false,
			});
		} catch (err) {
			// Discard errors for stale requests or after teardown
			if (requestId < latestRequestId || destroyed) {
				abortExp(
					EXPERIENCE_NAME.SLOW_LANE_FETCH,
					experienceId,
					destroyed ? 'destroyed' : 'superseded',
					{ isLocalLLM: true, ...(surface ? { surface } : {}) },
				);
				return;
			}

			storedContextInput = null;
			storedContextVector = null;
			storedLmLogits = null;
			failExp(EXPERIENCE_NAME.SLOW_LANE_FETCH, experienceId, {
				errorType: 'inference',
				isLocalLLM: true,
				...(surface ? { surface } : {}),
			});
			onUpdate?.({ textLength: text.length, hasVector: false, hasLmLogits: false });

			const errorMsg = err instanceof Error ? err.message : String(err);
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[CTC:model] %c❌ Inference error (request #${requestId}): ${errorMsg}`,
					'color: #9c27b0; font-weight: bold;',
					'color: #f44336;',
				);
			}
		}
	};

	// ── Canonical causal scorer ─────────────────────────────────────────────

	const surfaceCacheKey = (
		contextKey: string,
		surface: string,
		tokenIds = surfaceTokenIds.get(surface.toLowerCase()) ?? [],
	): string => `${contextKey}\u0000${surface.toLowerCase()}\u0000${tokenIds.join(',')}`;

	// Declared as functions rather than generic arrows: this file carries a `webpackChunkName`
	// comment, which opts it into a build-time parse that reads `<T>(` as a JSX tag.
	function getLru<T>(cache: Map<string, T>, key: string): T | null {
		const value = cache.get(key);
		if (value === undefined) {
			return null;
		}
		cache.delete(key);
		cache.set(key, value);
		return value;
	}

	function setLru<T>(cache: Map<string, T>, key: string, value: T, maxSize: number): void {
		cache.delete(key);
		cache.set(key, value);
		while (cache.size > maxSize) {
			const oldest = cache.keys().next().value;
			if (oldest === undefined) {
				break;
			}
			cache.delete(oldest);
		}
	}

	const prefixCacheKey = (contextKey: string, tokenPrefix: number[]): string =>
		`${contextKey}\u0000${tokenPrefix.join(',')}`;

	const logProgressiveState = (
		state:
			| 'cached'
			| 'completed'
			| 'deduplicated'
			| 'expanded'
			| 'failed'
			| 'queued'
			| 'stale'
			| 'started',
		detail: string,
	): void => {
		if (!isAutocompleteDebugEnabled()) {
			return;
		}
		// eslint-disable-next-line no-console
		console.log(
			`%c[CTC:model] %c🔀 grouped ${state} · ${detail}`,
			'color: #9c27b0; font-weight: bold;',
			state === 'failed'
				? 'color: #f44336;'
				: state === 'completed' || state === 'cached'
					? 'color: #4caf50;'
					: 'color: #2196f3;',
		);
	};

	const createCausalInferenceAggregate = (startedAt: number): CausalInferenceAggregate => ({
		e2eLatencyMs: 0,
		failedRequests: 0,
		firstStartedAt: startedAt,
		promptTokens: 0,
		promptUsageSamples: 0,
		requestedCompletionTokens: 0,
		requests: 0,
		sampledOutputTokens: 0,
		timeToFirstTokenMs: 0,
		wallClockMs: 0,
		webLlmDecodeSteps: 0,
		webLlmUsageSamples: 0,
	});

	const updateCausalInferenceAggregate = (
		cache: Map<string, CausalInferenceAggregate>,
		key: string,
		measurement: CausalInferenceMeasurement,
	): CausalInferenceAggregate => {
		const aggregate =
			getLru(cache, key) ??
			createCausalInferenceAggregate(performance.now() - measurement.wallClockMs);
		aggregate.requests++;
		aggregate.requestedCompletionTokens += measurement.requestedCompletionTokens;
		aggregate.wallClockMs += measurement.wallClockMs;
		if (measurement.outcome === 'failed') {
			aggregate.failedRequests++;
		}
		if (measurement.promptTokens !== null) {
			aggregate.promptTokens += measurement.promptTokens;
			aggregate.promptUsageSamples++;
		}
		if (measurement.sampledOutputTokens !== null && measurement.webLlmDecodeSteps !== null) {
			aggregate.sampledOutputTokens += measurement.sampledOutputTokens;
			aggregate.webLlmDecodeSteps += measurement.webLlmDecodeSteps;
			aggregate.webLlmUsageSamples++;
		}
		if (measurement.timeToFirstTokenMs !== null) {
			aggregate.timeToFirstTokenMs += measurement.timeToFirstTokenMs;
		}
		if (measurement.e2eLatencyMs !== null) {
			aggregate.e2eLatencyMs += measurement.e2eLatencyMs;
		}
		setLru(cache, key, aggregate, CANONICAL_SCORING.BOUNDARY_CACHE_MAX);
		return aggregate;
	};

	const causalAggregateForLog = (aggregate: CausalInferenceAggregate) => ({
		calls: aggregate.requests,
		elapsedMs: Number((performance.now() - aggregate.firstStartedAt).toFixed(1)),
		failedCalls: aggregate.failedRequests,
		inferenceWallMs: Number(aggregate.wallClockMs.toFixed(1)),
		promptTokens: aggregate.promptUsageSamples > 0 ? aggregate.promptTokens : 'unreported',
		requestedOutputTokens: aggregate.requestedCompletionTokens,
		sampledOutputTokens:
			aggregate.webLlmUsageSamples > 0 ? aggregate.sampledOutputTokens : 'unreported',
		timeToFirstTokenMs:
			aggregate.timeToFirstTokenMs > 0
				? Number(aggregate.timeToFirstTokenMs.toFixed(1))
				: 'unreported',
		webLlmE2eMs:
			aggregate.e2eLatencyMs > 0 ? Number(aggregate.e2eLatencyMs.toFixed(1)) : 'unreported',
		webLlmDecodeSteps:
			aggregate.webLlmUsageSamples > 0 ? aggregate.webLlmDecodeSteps : 'unreported',
	});

	const recordCausalInference = (measurement: CausalInferenceMeasurement): void => {
		if (!isAutocompleteDebugEnabled()) {
			return;
		}
		const familyAggregate = updateCausalInferenceAggregate(
			causalInferenceByFamily,
			measurement.familyKey,
			measurement,
		);
		const contextAggregate = updateCausalInferenceAggregate(
			causalInferenceByContext,
			measurement.contextKey,
			measurement,
		);
		// One line plus two nested objects per LM call is heavy enough to distort
		// the latencies it reports, so keep the per-call breakdown behind verbose.
		if (!isAutocompleteDebugVerbose()) {
			return;
		}
		// eslint-disable-next-line no-console
		console.log(
			`%c[CTC:model-cost]%c ${measurement.kind} ${measurement.outcome} · ${measurement.wallClockMs.toFixed(1)}ms · prompt ${measurement.promptTokens ?? '?'} tok/${measurement.promptWords} words · output ${measurement.sampledOutputTokens ?? '?'} sampled/${measurement.requestedCompletionTokens} requested · decode ${measurement.webLlmDecodeSteps ?? '?'} step${measurement.webLlmDecodeSteps === 1 ? '' : 's'} · TTFT ${measurement.timeToFirstTokenMs?.toFixed(1) ?? '?'}ms · ${measurement.warmState}`,
			CTC_STYLES.section,
			CTC_STYLES.body,
			{
				request: {
					contextKey: measurement.contextKey,
					familyKey: measurement.familyKey,
					kind: measurement.kind,
					outcome: measurement.outcome,
					warmState: measurement.warmState,
				},
				actual: {
					decodeTokensPerSecond: measurement.decodeTokensPerSecond,
					e2eLatencyMs: measurement.e2eLatencyMs,
					prefillTokensPerSecond: measurement.prefillTokensPerSecond,
					promptTokens: measurement.promptTokens,
					promptWords: measurement.promptWords,
					sampledOutputTokens: measurement.sampledOutputTokens,
					timePerDecodeTokenMs: measurement.timePerDecodeTokenMs,
					timeToFirstTokenMs: measurement.timeToFirstTokenMs,
					wallClockMs: measurement.wallClockMs,
					webLlmDecodeSteps: measurement.webLlmDecodeSteps,
				},
				context: causalAggregateForLog(contextAggregate),
				family: causalAggregateForLog(familyAggregate),
			},
		);
	};

	/**
	 * Pull the captured distribution out of the processor, timing the handover.
	 *
	 * Every call yields one array the width of the vocabulary. If that width is
	 * large and the handover is slow, thousands of calls per session turn into
	 * allocation churn that shows up as latency without any model work behind it.
	 */
	const captureLogits = (): Float32Array | null => causalLogitProcessor.getCapturedLogits();

	const createMeasuredCausalCompletion = async (
		activeEngine: MLCEngine,
		input: {
			contextKey: string;
			familyKey: string;
			kind: CausalInferenceKind;
			prompt: string;
			requestedCompletionTokens: number;
		},
	): Promise<{ latencyMs: number }> => {
		const prompt = truncateToLastNWords(input.prompt, LOCAL_INFERENCE.MAX_CONTEXT_TOKENS);
		const promptWords = splitOnWhitespace(prompt).length;
		const startedAt = performance.now();
		const warmState = ++causalInferenceOrdinal === 1 ? 'cold-first-call' : 'warm';
		try {
			const completion = await activeEngine.completions.create({
				model: modelId,
				prompt,
				max_tokens: input.requestedCompletionTokens,
				temperature: 0,
				logprobs: false,
				ignore_eos: true,
			});
			const latencyMs = performance.now() - startedAt;
			const usage = completion.usage;
			const webLlmDecodeSteps = usage?.completion_tokens ?? null;
			// WebLLM samples the first output token during prefill, but its
			// completion_tokens usage counter increments only in decodeStep().
			// Add that prefill-sampled token back without exceeding max_tokens.
			const sampledOutputTokens =
				webLlmDecodeSteps === null
					? null
					: Math.min(input.requestedCompletionTokens, webLlmDecodeSteps + 1);
			recordCausalInference({
				contextKey: input.contextKey,
				decodeTokensPerSecond: usage?.extra?.decode_tokens_per_s ?? null,
				e2eLatencyMs:
					usage?.extra?.e2e_latency_s !== undefined ? usage.extra.e2e_latency_s * 1000 : null,
				familyKey: input.familyKey,
				kind: input.kind,
				outcome: 'completed',
				prefillTokensPerSecond: usage?.extra?.prefill_tokens_per_s ?? null,
				promptTokens: usage?.prompt_tokens ?? null,
				promptWords,
				requestedCompletionTokens: input.requestedCompletionTokens,
				sampledOutputTokens,
				timePerDecodeTokenMs:
					usage?.extra?.time_per_output_token_s !== undefined
						? usage.extra.time_per_output_token_s * 1000
						: null,
				timeToFirstTokenMs:
					usage?.extra?.time_to_first_token_s !== undefined
						? usage.extra.time_to_first_token_s * 1000
						: null,
				wallClockMs: latencyMs,
				warmState,
				webLlmDecodeSteps,
			});
			return { latencyMs };
		} catch (error) {
			const latencyMs = performance.now() - startedAt;
			recordCausalInference({
				contextKey: input.contextKey,
				decodeTokensPerSecond: null,
				e2eLatencyMs: null,
				familyKey: input.familyKey,
				kind: input.kind,
				outcome: 'failed',
				prefillTokensPerSecond: null,
				promptTokens: null,
				promptWords,
				requestedCompletionTokens: input.requestedCompletionTokens,
				sampledOutputTokens: null,
				timePerDecodeTokenMs: null,
				timeToFirstTokenMs: null,
				wallClockMs: latencyMs,
				warmState,
				webLlmDecodeSteps: null,
			});
			throw error;
		}
	};

	const logExactEvidenceReadiness = (
		contextKey: string,
		familyKey: string,
		exactSurfaceCount: number,
		source: CausalInferenceKind,
	): void => {
		if (!isAutocompleteDebugEnabled()) {
			return;
		}
		const previousCount = exactEvidenceCountByContext.get(contextKey) ?? 0;
		if (exactSurfaceCount <= previousCount) {
			return;
		}
		setLru(
			exactEvidenceCountByContext,
			contextKey,
			exactSurfaceCount,
			CANONICAL_SCORING.BOUNDARY_CACHE_MAX,
		);
		const contextAggregate = getLru(causalInferenceByContext, contextKey);
		const familyAggregate = getLru(causalInferenceByFamily, familyKey);
		// eslint-disable-next-line no-console
		console.log(
			`%c[CTC:readiness]%c exact evidence · ${exactSurfaceCount} surface${exactSurfaceCount === 1 ? '' : 's'} · source=${source} · ctx=${contextKey.slice(0, 64)}`,
			CTC_STYLES.good,
			CTC_STYLES.body,
			{
				context: contextAggregate ? causalAggregateForLog(contextAggregate) : null,
				contextKey,
				exactSurfaceCount,
				family: familyAggregate ? causalAggregateForLog(familyAggregate) : null,
				familyKey,
				source,
			},
		);
	};

	const getProgressiveEvidence = (
		contextKey: string,
		candidateSurface: string,
		tokenIds = surfaceTokenTrie.getTokenIds(candidateSurface) ?? [],
	): ProgressiveSurfaceEvidence | null => {
		if (tokenIds.length === 0) {
			return null;
		}
		const exactKey = surfaceCacheKey(contextKey, candidateSurface, tokenIds);
		const exact = getLru(surfaceScoreCache, exactKey);
		if (exact) {
			return {
				meanTokenLogProbabilityUpperBound: exact.meanTokenLogProbability,
				scoredTokenCount: exact.tokenCount,
				totalLogProbability: exact.totalLogProbability,
				totalTokenCount: exact.tokenCount,
			};
		}
		const boundary = getLru(boundaryCache, contextKey);
		const firstToken = tokenIds[0];
		if (!boundary || firstToken === undefined) {
			return null;
		}
		let totalLogProbability = logSoftmaxAt(boundary.rawLogits, firstToken);
		if (!Number.isFinite(totalLogProbability)) {
			return null;
		}
		let scoredTokenCount = 1;
		while (scoredTokenCount < tokenIds.length) {
			const prefix = tokenIds.slice(0, scoredTokenCount);
			const expansion = getLru(prefixExpansionCache, prefixCacheKey(contextKey, prefix));
			if (!expansion) {
				break;
			}
			const nextTokenLogProbability = logSoftmaxAt(
				expansion.rawNextTokenLogits,
				tokenIds[scoredTokenCount],
			);
			if (!Number.isFinite(nextTokenLogProbability)) {
				break;
			}
			totalLogProbability = expansion.totalLogProbability + nextTokenLogProbability;
			scoredTokenCount++;
		}

		if (scoredTokenCount === tokenIds.length) {
			const exactScore: SurfaceScore = {
				contextKey,
				surface: candidateSurface,
				totalLogProbability,
				meanTokenLogProbability: totalLogProbability / tokenIds.length,
				tokenCount: tokenIds.length,
			};
			setLru(surfaceScoreCache, exactKey, exactScore, CANONICAL_SCORING.SURFACE_CACHE_MAX);
		}

		return {
			// Every unscored future token has log probability <= 0. Dividing the
			// scored total by the final token count is therefore a safe optimistic
			// bound on the eventual mean.
			meanTokenLogProbabilityUpperBound: totalLogProbability / tokenIds.length,
			scoredTokenCount,
			totalLogProbability,
			totalTokenCount: tokenIds.length,
		};
	};

	const planProgressiveExpansion = (contextKey: string): void => {
		const request = progressiveRequests.get(contextKey);
		if (!request || destroyed || !boundaryCache.has(contextKey)) {
			return;
		}
		const eligible = request.candidates
			.filter(
				(candidate) =>
					candidate.tokenIds.length > 0 &&
					candidate.tokenIds.length <= CANONICAL_SCORING.EXACT_MAX_TARGET_TOKENS,
			)
			.map((candidate) => ({
				...candidate,
				evidence: getProgressiveEvidence(contextKey, candidate.surface, candidate.tokenIds),
			}))
			.filter(
				(candidate): candidate is typeof candidate & { evidence: ProgressiveSurfaceEvidence } =>
					candidate.evidence !== null,
			);

		// Score candidates the way arbitration will: a posterior over sequence
		// log-likelihoods, blended with the corpus prior at the shipped weights.
		//
		// Sharing the rule is the point. Ranking on `exp(per-token mean)` instead
		// answers a different question — it favours short surfaces, because
		// dividing by fewer tokens flatters them — so this scheduler used to stop
		// reading on a margin the decision layer did not recognise, and then
		// abstain for want of the very tokens it declined to read. Nothing about
		// that was visible from either side.
		//
		// The normaliser spans every eligible candidate rather than only the
		// scheduled ones. That can only make each posterior smaller and each margin
		// narrower, so the error is always towards reading another token instead of
		// stopping early — the safe direction ahead of a precision-first gate.
		const normalizer = logSumExp(
			eligible.map((candidate) => candidate.evidence.totalLogProbability),
		);
		const confidenceScore = (candidate: (typeof eligible)[number]): number =>
			STAGE1_WEIGHT * (candidate.rankHint ?? 0) +
			STAGE2_WEIGHT *
				(Number.isFinite(normalizer)
					? Math.exp(candidate.evidence.totalLogProbability - normalizer)
					: 0);

		const candidates = eligible
			.sort((a, b) => confidenceScore(b) - confidenceScore(a))
			.slice(0, CANONICAL_SCORING.PROGRESSIVE_CANDIDATES_MAX);
		const unresolved = candidates.filter(
			(candidate) => candidate.evidence.scoredTokenCount < candidate.tokenIds.length,
		);
		if (unresolved.length === 0) {
			logProgressiveState(
				'completed',
				`ctx=${contextKey.slice(0, 48)} · exact=${candidates.length}/${candidates.length}`,
			);
			return;
		}
		const bestExactScore = Math.max(
			...candidates
				.filter((candidate) => candidate.evidence.scoredTokenCount === candidate.tokenIds.length)
				.map(confidenceScore),
			-Infinity,
		);
		const bestUnresolvedScore = Math.max(...unresolved.map(confidenceScore), -Infinity);
		if (bestExactScore - bestUnresolvedScore >= MIN_WINNER_MARGIN) {
			logProgressiveState(
				'completed',
				`safe bound · ctx=${contextKey.slice(0, 40)} · margin=${(bestExactScore - bestUnresolvedScore).toFixed(2)} · unresolved=${unresolved.length}`,
			);
			return;
		}

		const groups = surfaceTokenTrie.groupByScoredPrefix(
			unresolved.map((candidate) => ({
				surface: candidate.surface,
				tokenIds: candidate.tokenIds,
				scoredTokenCount: candidate.evidence.scoredTokenCount,
			})),
		);
		const bySurface = new Map(candidates.map((candidate) => [candidate.surface, candidate]));
		const rankedGroups = groups
			.map((group) => {
				const members = group.surfaces
					.map((candidateSurface) => bySurface.get(candidateSurface))
					.filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));
				const optimisticScore = Math.max(...members.map(confidenceScore));
				return { ...group, optimisticScore };
			})
			.sort((a, b) => b.optimisticScore - a.optimisticScore);
		const bestGroup = rankedGroups[0];
		if (!bestGroup) {
			return;
		}
		const warmGroup =
			kvContextKey === contextKey
				? rankedGroups.find((group) => isPrefixOf(kvPath, group.tokenPrefix))
				: undefined;
		const nextGroup =
			warmGroup &&
			warmGroup.optimisticScore >= bestGroup.optimisticScore - PROGRESSIVE_WARM_PATH_MARGIN
				? warmGroup
				: bestGroup;

		const contextPrefixes = progressivePrefixesByContext.get(contextKey) ?? new Set<string>();
		progressivePrefixesByContext.set(contextKey, contextPrefixes);
		const key = prefixCacheKey(contextKey, nextGroup.tokenPrefix);
		if (getLru(prefixExpansionCache, key)) {
			logProgressiveState(
				'cached',
				`ctx=${contextKey.slice(0, 40)} · prefix=[${nextGroup.tokenPrefix.join(',')}]`,
			);
			planProgressiveExpansion(contextKey);
			return;
		}
		if (pendingPrefixExpansions.has(key) || inFlightPrefixExpansions.has(key)) {
			logProgressiveState(
				'deduplicated',
				`ctx=${contextKey.slice(0, 40)} · prefix=[${nextGroup.tokenPrefix.join(',')}]`,
			);
			return;
		}
		if (contextPrefixes.size >= CANONICAL_SCORING.PROGRESSIVE_EXPANSIONS_PER_CONTEXT_MAX) {
			logProgressiveState(
				'completed',
				`ctx=${contextKey.slice(0, 48)} · expansion cap=${contextPrefixes.size} · unresolved=${unresolved.length}`,
			);
			return;
		}

		contextPrefixes.add(key);
		pendingPrefixExpansions.set(key, {
			contextKey,
			familyKey: request.familyKey,
			prompt: request.prompt,
			tokenPrefix: nextGroup.tokenPrefix,
			surfaces: nextGroup.surfaces,
		});
		logProgressiveState(
			'queued',
			`ctx=${contextKey.slice(0, 40)} · prefix=[${nextGroup.tokenPrefix.join(',')}] · surfaces=${nextGroup.surfaces.length}`,
		);
		drainCausalQueue();
	};

	/**
	 * Prefill `prompt` and cache the boundary distribution that follows it.
	 *
	 * A text completion resets the KV cache before prefilling, so asking for a
	 * single token leaves the cache holding exactly the prompt. That is the
	 * anchor every later decode step extends.
	 */
	const prefillBoundary = async (
		activeEngine: MLCEngine,
		request: { contextKey: string; familyKey: string; prompt: string },
	): Promise<{ latencyMs: number; rawLogits: Float32Array } | null> => {
		kvContextKey = null;
		kvPath = [];
		causalRequestsThisFamily++;
		causalGeneratedTokensThisFamily++;
		causalLogitProcessor.startCapture();
		const { latencyMs } = await createMeasuredCausalCompletion(activeEngine, {
			contextKey: request.contextKey,
			familyKey: request.familyKey,
			kind: 'boundary',
			prompt: request.prompt,
			requestedCompletionTokens: 1,
		});
		const rawLogits = captureLogits();
		if (!rawLogits) {
			return null;
		}
		setLru(
			boundaryCache,
			request.contextKey,
			{ contextKey: request.contextKey, prompt: request.prompt, rawLogits },
			CANONICAL_SCORING.BOUNDARY_CACHE_MAX,
		);
		kvContextKey = request.contextKey;
		kvPath = [];
		return { latencyMs, rawLogits };
	};

	/**
	 * Append one token to the KV cache and return the distribution that follows.
	 *
	 * This deliberately bypasses the completion API: a completion would reset the
	 * cache and re-prefill the whole prompt, whereas this forwards a single token
	 * on top of the work already done.
	 */
	const decodeOneToken = async (
		activeEngine: MLCEngine,
		token: number,
	): Promise<Float32Array | null> => {
		causalLogitProcessor.startCapture();
		try {
			// The engine also holds the embedder, so it refuses to forward unless
			// the caller says which model to forward through.
			await activeEngine.forwardTokensAndSample([token], false, modelId);
		} catch (error) {
			kvContextKey = null;
			kvPath = [];
			throw error;
		}
		causalRequestsThisFamily++;
		causalGeneratedTokensThisFamily++;
		return captureLogits();
	};

	const runBoundaryPrime = async (request: BoundaryPrimeRequest): Promise<void> => {
		if (!engine || destroyed) {
			return;
		}
		const primed = await prefillBoundary(engine, request);
		if (!primed) {
			return;
		}
		const { latencyMs, rawLogits } = primed;
		planProgressiveExpansion(request.contextKey);
		const progressiveRequest = progressiveRequests.get(request.contextKey);
		const exactSurfaceCount =
			progressiveRequest?.candidates.filter((candidate) => {
				const evidence = getProgressiveEvidence(
					request.contextKey,
					candidate.surface,
					candidate.tokenIds,
				);
				return evidence !== null && evidence.scoredTokenCount === evidence.totalTokenCount;
			}).length ?? 0;
		logExactEvidenceReadiness(
			request.contextKey,
			progressiveRequest?.familyKey ?? request.familyKey,
			exactSurfaceCount,
			'boundary',
		);

		if (isAutocompleteDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.log(
				`%c[CTC:model] %c🧠 Tier A prime #${request.priority + 1} · ctx=${request.contextKey.slice(0, 48)} · ${rawLogits.length} logits · ${latencyMs.toFixed(0)}ms · family req:${causalRequestsThisFamily} tok:${causalGeneratedTokensThisFamily} A hit/miss:${tierAPrimeCacheHitsThisFamily}/${tierAPrimeCacheMissesThisFamily}`,
				'color: #9c27b0; font-weight: bold;',
				'color: #2196f3;',
			);
		}
		const callbackFamilyKey =
			progressiveRequests.get(request.contextKey)?.familyKey ?? request.familyKey;
		if (callbackFamilyKey === latestCausalFamilyKey && !destroyed) {
			onBoundaryLmUpdate?.({
				contextKey: request.contextKey,
				familyKey: callbackFamilyKey,
				latencyMs,
			});
		}
	};

	const runPrefixExpansion = async (request: PrefixExpansionRequest): Promise<void> => {
		if (!engine || destroyed) {
			return;
		}
		const activeEngine = engine;
		const startedAt = performance.now();
		logProgressiveState(
			'started',
			`ctx=${request.contextKey.slice(0, 40)} · prefix=[${request.tokenPrefix.join(',')}] · surfaces=${request.surfaces.length}`,
		);

		// Resume from whatever the KV cache already holds for this context, and
		// fall back to a prompt prefill only when the requested prefix branches
		// away from it.
		let logitsAtPath: Float32Array | null = null;
		let totalAtPath = 0;
		const pathIsLive = extendsLiveKvPath(request);
		if (pathIsLive) {
			if (kvPath.length === 0) {
				logitsAtPath = getLru(boundaryCache, request.contextKey)?.rawLogits ?? null;
			} else {
				const resume = getLru(prefixExpansionCache, prefixCacheKey(request.contextKey, kvPath));
				logitsAtPath = resume?.rawNextTokenLogits ?? null;
				totalAtPath = resume?.totalLogProbability ?? 0;
			}
		}

		if (!logitsAtPath) {
			const primed = await prefillBoundary(activeEngine, request);
			if (!primed) {
				logProgressiveState(
					'failed',
					`ctx=${request.contextKey.slice(0, 40)} · prefix=[${request.tokenPrefix.join(',')}] · missing boundary logits`,
				);
				return;
			}
			logitsAtPath = primed.rawLogits;
			totalAtPath = 0;
		}

		// Walking the path caches every depth along it, not just the requested
		// one, so a later expansion that shares this prefix costs nothing.
		const contextPrefixes =
			progressivePrefixesByContext.get(request.contextKey) ?? new Set<string>();
		progressivePrefixesByContext.set(request.contextKey, contextPrefixes);
		for (let index = kvPath.length; index < request.tokenPrefix.length; index++) {
			const token = request.tokenPrefix[index];
			if (token === undefined) {
				break;
			}
			const stepLogProbability = logSoftmaxAt(logitsAtPath, token);
			if (!Number.isFinite(stepLogProbability)) {
				logProgressiveState(
					'failed',
					`ctx=${request.contextKey.slice(0, 40)} · prefix=[${request.tokenPrefix.join(',')}] · token ${token} unscoreable`,
				);
				return;
			}
			// eslint-disable-next-line no-await-in-loop
			const nextLogits = await decodeOneToken(activeEngine, token);
			if (!nextLogits || destroyed) {
				kvContextKey = null;
				kvPath = [];
				logProgressiveState(
					'failed',
					`ctx=${request.contextKey.slice(0, 40)} · prefix=[${request.tokenPrefix.join(',')}] · missing logits`,
				);
				return;
			}
			kvContextKey = request.contextKey;
			kvPath = [...kvPath, token];
			totalAtPath += stepLogProbability;
			logitsAtPath = nextLogits;
			const stepKey = prefixCacheKey(request.contextKey, kvPath);
			const expansion: TokenPrefixExpansion = {
				contextKey: request.contextKey,
				tokenPrefix: [...kvPath],
				totalLogProbability: totalAtPath,
				rawNextTokenLogits: nextLogits,
			};
			setLru(prefixExpansionCache, stepKey, expansion, CANONICAL_SCORING.PREFIX_CACHE_MAX);
			contextPrefixes.add(stepKey);
		}
		const latencyMs = performance.now() - startedAt;

		const progressiveRequest = progressiveRequests.get(request.contextKey);
		let newlyExact = 0;
		let exactSurfaceCount = 0;
		if (progressiveRequest) {
			for (const candidate of progressiveRequest.candidates) {
				const exactKey = surfaceCacheKey(request.contextKey, candidate.surface, candidate.tokenIds);
				const wasExact = surfaceScoreCache.has(exactKey);
				const evidence = getProgressiveEvidence(
					request.contextKey,
					candidate.surface,
					candidate.tokenIds,
				);
				if (
					!wasExact &&
					evidence !== null &&
					evidence.scoredTokenCount === evidence.totalTokenCount &&
					surfaceScoreCache.has(exactKey)
				) {
					newlyExact++;
				}
				if (evidence !== null && evidence.scoredTokenCount === evidence.totalTokenCount) {
					exactSurfaceCount++;
				}
			}
		}
		logExactEvidenceReadiness(
			request.contextKey,
			progressiveRequest?.familyKey ?? request.familyKey,
			exactSurfaceCount,
			'prefix',
		);
		logProgressiveState(
			'expanded',
			`ctx=${request.contextKey.slice(0, 40)} · prefix=[${request.tokenPrefix.join(',')}] · exact+${newlyExact} · ${latencyMs.toFixed(0)}ms`,
		);
		planProgressiveExpansion(request.contextKey);

		const callbackFamilyKey =
			progressiveRequests.get(request.contextKey)?.familyKey ?? request.familyKey;
		if (callbackFamilyKey === latestCausalFamilyKey && !destroyed) {
			onSurfaceScoreUpdate?.({
				contextKey: request.contextKey,
				count: newlyExact,
				familyKey: callbackFamilyKey,
				latencyMs,
			});
		} else {
			logProgressiveState(
				'stale',
				`cached only · ctx=${request.contextKey.slice(0, 40)} · family=${request.familyKey.slice(0, 32)}`,
			);
		}
	};

	/**
	 * Whether any live decision would still take this request's result.
	 *
	 * Ranking on the family a request was created under, as this used to, misses
	 * in both directions. Work queued a keystroke ago for a context still under
	 * the cursor sorts as stale even though the callbacks resolve delivery
	 * through `progressiveRequests` and would hand it over. Work for a context
	 * nothing asks about any more sorts as runnable even though the same
	 * resolution drops it on arrival — and that one is expensive, because an
	 * abandoned context is never the one the KV cache holds, so running it pays
	 * a prompt prefill and leaves the live context evicted, charging the next
	 * live request a second prefill. Two prefills for a discarded result.
	 *
	 * Either signal alone is enough to keep the work, which matters because a
	 * boundary prime is queued before its context's surfaces are requested: at
	 * that moment the stored family is still the previous decision's, and only
	 * the request's own family says it is current.
	 *
	 * Agreeing with the layer being fed is the correction the expansion planner
	 * already carries for arbitration's scoring rule — a scheduler deciding on
	 * its own rule stops on margins the consumer does not recognise.
	 */
	const stillWanted = (request: { contextKey: string; familyKey: string }): boolean =>
		request.familyKey === latestCausalFamilyKey ||
		progressiveRequests.get(request.contextKey)?.familyKey === latestCausalFamilyKey;

	const drainCausalQueue = (): void => {
		if (causalInFlight || destroyed) {
			return;
		}
		// Drop abandoned work rather than leaving it to be picked up whenever the
		// live family happens to have nothing queued. Its cached side effects are
		// speculative — they only pay off if the user deletes back into exactly
		// this context and prefix — and the prefill pair above is certain.
		for (const [key, request] of pendingPrefixExpansions) {
			if (!stillWanted(request)) {
				pendingPrefixExpansions.delete(key);
			}
		}
		for (const [contextKey, request] of pendingBoundaryPrimes) {
			if (!stillWanted(request)) {
				pendingBoundaryPrimes.delete(contextKey);
			}
		}
		const sortedPrimes = Array.from(pendingBoundaryPrimes.values()).sort(
			(a, b) => a.priority - b.priority,
		);
		// Everything left is wanted, so relevance no longer needs a sort key.
		// Take whichever request continues the live sequence: that expansion costs
		// one decode step where any other costs a full prompt prefill, and nothing
		// is skipped, only reordered.
		//
		// Staying inside the live context when nothing continues it was tried and
		// reverted. It moved re-primes from `reprime-context` to `reprime-branch`
		// and left the total flat, because both pay for a prompt prefill: a
		// context whose remaining prefixes diverge at the first token re-primes as
		// a branch instead of as a context. Ordering cannot recover that; only
		// queueing fewer divergent branches can, which is what the prune above
		// does.
		const sortedPrefixes = Array.from(pendingPrefixExpansions.values()).sort(
			(a, b) => Number(extendsLiveKvPath(b)) - Number(extendsLiveKvPath(a)),
		);
		const nextPrefix = sortedPrefixes[0];
		const nextPrime = nextPrefix ? undefined : sortedPrimes[0];
		if (!nextPrefix && !nextPrime) {
			return;
		}

		causalInFlight = true;
		let prefixKey: string | null = null;
		if (nextPrefix) {
			prefixKey = prefixCacheKey(nextPrefix.contextKey, nextPrefix.tokenPrefix);
			pendingPrefixExpansions.delete(prefixKey);
			inFlightPrefixExpansions.add(prefixKey);
		} else if (nextPrime) {
			pendingBoundaryPrimes.delete(nextPrime.contextKey);
			inFlightBoundaryContextKey = nextPrime.contextKey;
		}

		void ensureEngineInitialized()
			.then(() =>
				nextPrefix
					? runPrefixExpansion(nextPrefix)
					: nextPrime
						? runBoundaryPrime(nextPrime)
						: undefined,
			)
			.catch((error: unknown) => {
				if (nextPrefix) {
					logProgressiveState(
						'failed',
						`ctx=${nextPrefix.contextKey.slice(0, 40)} · prefix=[${nextPrefix.tokenPrefix.join(',')}] · ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				if (isAutocompleteDebugEnabled()) {
					// eslint-disable-next-line no-console
					console.log(
						`%c[CTC:model] %c❌ canonical causal request failed: ${error instanceof Error ? error.message : String(error)}`,
						'color: #9c27b0; font-weight: bold;',
						'color: #f44336;',
					);
				}
			})
			.finally(() => {
				if (prefixKey) {
					inFlightPrefixExpansions.delete(prefixKey);
				}
				if (nextPrime) {
					inFlightBoundaryContextKey = null;
				}
				causalInFlight = false;
				drainCausalQueue();
			});
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
				`%c[CTC:model] %c📤 Context update (request #${requestId}) | ${text.length} chars`,
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

	const setLatestCausalFamily = (familyKey: string): void => {
		if (familyKey === latestCausalFamilyKey) {
			return;
		}
		latestCausalFamilyKey = familyKey;
		causalRequestsThisFamily = 0;
		causalGeneratedTokensThisFamily = 0;
		tierAPrimeCacheHitsThisFamily = 0;
		tierAPrimeCacheMissesThisFamily = 0;
	};

	const primeBoundaryLm = (input: BoundaryPrimeRequest): void => {
		if (destroyed) {
			return;
		}
		setLatestCausalFamily(input.familyKey);
		if (getLru(boundaryCache, input.contextKey)) {
			tierAPrimeCacheHitsThisFamily++;
			if (isAutocompleteDebugVerbose()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[CTC:model] %c⚡ Tier A cache hit · ctx=${input.contextKey.slice(0, 48)}`,
					'color: #9c27b0; font-weight: bold;',
					'color: #2196f3;',
				);
			}
			return;
		}
		if (
			pendingBoundaryPrimes.has(input.contextKey) ||
			inFlightBoundaryContextKey === input.contextKey
		) {
			logProgressiveState('deduplicated', `boundary · ctx=${input.contextKey.slice(0, 48)}`);
			return;
		}
		if (pendingBoundaryPrimes.size >= CANONICAL_SCORING.TIER_A_PRIMES_MAX) {
			const stalePending = Array.from(pendingBoundaryPrimes.entries()).find(
				([, request]) => request.familyKey !== latestCausalFamilyKey,
			);
			if (stalePending) {
				pendingBoundaryPrimes.delete(stalePending[0]);
				logProgressiveState(
					'stale',
					`dropped unstarted boundary · ctx=${stalePending[0].slice(0, 48)}`,
				);
			}
		}
		if (pendingBoundaryPrimes.size < CANONICAL_SCORING.TIER_A_PRIMES_MAX) {
			tierAPrimeCacheMissesThisFamily++;
			pendingBoundaryPrimes.set(input.contextKey, input);
		}
		drainCausalQueue();
	};

	const requestProgressiveSurfaceScores = (input: SurfaceScoreRequest): void => {
		if (destroyed) {
			return;
		}
		setLatestCausalFamily(input.familyKey);
		const candidates = input.candidates
			.filter(
				(candidate) =>
					candidate.tokenIds.length > 0 &&
					candidate.tokenIds.length <= CANONICAL_SCORING.EXACT_MAX_TARGET_TOKENS,
			)
			.slice(0, CANONICAL_SCORING.PROGRESSIVE_INPUT_MAX);
		if (candidates.length === 0) {
			return;
		}
		const previous = progressiveRequests.get(input.contextKey);
		const candidateSignature = candidates
			.map((candidate) => `${candidate.surface}:${candidate.tokenIds.join(',')}`)
			.join('\u0001');
		const previousSignature = previous?.candidates
			.map((candidate) => `${candidate.surface}:${candidate.tokenIds.join(',')}`)
			.join('\u0001');
		setLru(
			progressiveRequests,
			input.contextKey,
			{ ...input, candidates },
			CANONICAL_SCORING.BOUNDARY_CACHE_MAX,
		);
		for (const cachedContextKey of progressivePrefixesByContext.keys()) {
			if (!progressiveRequests.has(cachedContextKey)) {
				progressivePrefixesByContext.delete(cachedContextKey);
			}
		}
		const cachedProgressCount = candidates.filter((candidate) => {
			const evidence = getProgressiveEvidence(
				input.contextKey,
				candidate.surface,
				candidate.tokenIds,
			);
			return (
				evidence !== null &&
				(evidence.scoredTokenCount > 1 || evidence.scoredTokenCount === evidence.totalTokenCount)
			);
		}).length;
		if (cachedProgressCount > 0) {
			logProgressiveState(
				'cached',
				`ctx=${input.contextKey.slice(0, 40)} · surfaces=${cachedProgressCount}/${candidates.length}`,
			);
		}
		if (candidateSignature === previousSignature) {
			logProgressiveState(
				'deduplicated',
				`candidate set · ctx=${input.contextKey.slice(0, 40)} · surfaces=${candidates.length}`,
			);
		} else {
			logProgressiveState(
				'queued',
				`candidate set · ctx=${input.contextKey.slice(0, 40)} · surfaces=${candidates.length}`,
			);
		}
		planProgressiveExpansion(input.contextKey);
	};

	// ── Public API (same shape as createSlowLaneClient) ────────────────────
	return {
		updateContext: updateContextDebounced,
		getBoundaryLmState: (contextKey) => getLru(boundaryCache, contextKey),
		getCanonicalSurfaceTokenIds: (candidateSurface) =>
			surfaceTokenTrie.getTokenIds(candidateSurface),
		getCanonicalSurfaceCount: () => surfaceTokenIds.size,
		getContextInput: () => storedContextInput,
		getContextVector: () => storedContextVector,
		getLmLogits: () => storedLmLogits,
		getProgressiveSurfaceEvidence: (contextKey, candidateSurface) =>
			getProgressiveEvidence(contextKey, candidateSurface),
		getSurfaceScore: (contextKey, candidateSurface) =>
			getLru(surfaceScoreCache, surfaceCacheKey(contextKey, candidateSurface)),
		setContextVector: (vector) => {
			storedContextInput = null;
			storedContextVector = vector;
		},
		setLmLogits: (logits) => {
			storedLmLogits = logits;
		},
		primeBoundaryLm,
		requestProgressiveSurfaceScores,
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
			storedContextInput = null;
			storedContextVector = null;
			storedLmLogits = null;
			causalInFlight = false;
			inFlightBoundaryContextKey = null;
			kvContextKey = null;
			kvPath = [];
			latestCausalFamilyKey = '';
			pendingBoundaryPrimes.clear();
			pendingPrefixExpansions.clear();
			inFlightPrefixExpansions.clear();
			progressiveRequests.clear();
			progressivePrefixesByContext.clear();
			boundaryCache.clear();
			causalInferenceByContext.clear();
			causalInferenceByFamily.clear();
			exactEvidenceCountByContext.clear();
			prefixExpansionCache.clear();
			surfaceScoreCache.clear();
			causalLogitProcessor.resetState();
		},
	};
};
