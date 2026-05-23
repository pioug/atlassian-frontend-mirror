/**
 * Local Slow Lane Client: On-device inference via @mlc-ai/web-llm.
 *
 * Drop-in replacement for the network-based slow-lane-client.  Instead of
 * calling a backend API, this client uses MLC WebLLM to run a small language
 * model (SmolLM 135M) directly in the browser via WebGPU.
 *
 * ── Why main thread (no Web Worker)? ─────────────────────────────────────
 * SmolLM 135M is small enough (~270 MB weights, 350-400 MB VRAM) that
 * WebGPU inference on the main thread is production-viable:
 *
 *   - WebGPU GPU compute is inherently async (doesn't block the main thread)
 *   - CPU overhead (tokenization + post-processing) is only 5-10 ms
 *   - Single forward pass latency is 50-150 ms — well within autocomplete
 *     expectations (~250 ms between word boundaries)
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

import type { MLCEngine, InitProgressReport, AppConfig } from '@mlc-ai/web-llm';

import { isAutocompleteDebugEnabled } from './debug-mode';
import { isWordBoundary } from './slow-lane-client';

type WebLlmModelRecord = NonNullable<AppConfig['model_list']>[number];

const startsWithAsciiLetter = (value: string): boolean => {
	const firstChar = value.charCodeAt(0);

	return (firstChar >= 65 && firstChar <= 90) || (firstChar >= 97 && firstChar <= 122);
};

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

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_DEBOUNCE_MS = 300;

export const LOCAL_MLC_MODEL_ID = 'SmolLM2-135M-Instruct-q0f16-MLC';

/** HF root for the default weights (includes `tensor-cache.json` for WebLLM 0.2+). */
export const LOCAL_MLC_HF_MODEL_REPO =
	'https://huggingface.co/mlc-ai/SmolLM2-135M-Instruct-q0f16-MLC';

export const LOCAL_MLC_MODEL_LIB_WASM_NAME = 'SmolLM2-135M-Instruct-q0f16-ctx4k_cs1k-webgpu.wasm';

/**
 * Original target repo (add-basics fine-tune). **Not compatible with WebLLM 0.2.x** (no `tensor-cache.json`).
 * @see module doc above
 */
export const HUGGINGFACE_TB_SMOLLM_ADD_BASICS_REPO =
	'https://huggingface.co/HuggingFaceTB/smollm-135M-instruct-add-basics-q0f16-MLC';

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
		modelId = LOCAL_MLC_MODEL_ID,
		customModelConfig,
	} = config;

	// ── State ──────────────────────────────────────────────────────────────
	let storedContextVector: Float32Array | null = null;
	let storedLmLogits: Record<string, number> | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let lastRequestedText = '';
	let requestCounter = 0;
	let latestRequestId = -1;
	let ready = false;
	let destroyed = false;
	let initFailed = false;
	let engine: MLCEngine | null = null;
	let engineInitPromise: Promise<void> | null = null;

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

	const initEngine = async (): Promise<void> => {
		try {
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					`%c[LocalSlowLane] %c🚀 Initialising MLC engine with model: ${modelId}`,
					'color: #9c27b0; font-weight: bold;',
					'color: inherit;',
				);
			}
			onStatus?.(`Initialising model: ${modelId}…`);

			if (!('gpu' in navigator)) {
				throw new Error('WebGPU not supported');
			}

			// eslint-disable-next-line @repo/internal/import/no-unresolved, import/dynamic-import-chunkname -- runtime dependency declared in package.json and lazily loaded for webgpu support
			const { CreateMLCEngine, prebuiltAppConfig } = await import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-autocomplete-mlc-web-llm" */ '@mlc-ai/web-llm'
			);

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

			engine = await CreateMLCEngine(modelId, {
				appConfig,
				initProgressCallback,
			});

			if (destroyed) {
				// destroy() was called while we were loading — clean up
				unloadEngine(engine);
				engine = null;
				return;
			}

			ready = true;

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					'%c[LocalSlowLane] %c✅ MLC engine loaded and ready',
					'color: #9c27b0; font-weight: bold;',
					'color: #4caf50;',
				);
			}
			onStatus?.('Model loaded and ready.');
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : String(err);
			ready = false;
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(`[LocalSlowLane] Engine initialisation failed: ${errorMsg}`);
			}
			onStatus?.(`Engine initialisation failed: ${errorMsg}`);
			engineInitPromise = null;
			initFailed = true;
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
	 * Run a single forward pass to extract next-token logit probabilities.
	 *
	 * We use the chat completions API with `max_tokens: 1` and `logprobs: true`
	 * to get the model's next-token distribution without generating text.
	 * This is the cheapest possible inference call — a single forward pass.
	 */
	const runInference = async (text: string, requestId: number): Promise<void> => {
		if (!engine || destroyed) {
			return;
		}

		try {
			// Use chat completion with logprobs to get next-token distribution
			const response = await engine.chat.completions.create({
				messages: [
					{
						role: 'user',
						content: text,
					},
				],
				max_tokens: 1,
				logprobs: true,
				top_logprobs: 5,
				temperature: 0,
			});

			// Discard stale results
			if (requestId < latestRequestId || destroyed) {
				return;
			}

			// ── Extract LM logits ───────────────────────────────────────
			const lmLogits: Record<string, number> = {};

			const logprobsContent = response.choices?.[0]?.logprobs?.content;
			if (logprobsContent && logprobsContent.length > 0) {
				const tokenLogprobs = logprobsContent[0];

				// Add the top token
				if (tokenLogprobs.token) {
					const token = tokenLogprobs.token.trim().toLowerCase();
					if (token.length > 0 && startsWithAsciiLetter(token)) {
						lmLogits[token] = Math.exp(tokenLogprobs.logprob);
					}
				}

				// Add alternative tokens from top_logprobs
				if (tokenLogprobs.top_logprobs) {
					for (const alt of tokenLogprobs.top_logprobs) {
						const token = alt.token.trim().toLowerCase();
						if (token.length > 0 && startsWithAsciiLetter(token)) {
							lmLogits[token] = Math.exp(alt.logprob);
						}
					}
				}
			}

			storedLmLogits = Object.keys(lmLogits).length > 0 ? lmLogits : null;

			// ── Semantic vector ─────────────────────────────────────────
			// SmolLM is a generative model, not an embedding model, so we
			// don't get a true semantic vector. We generate a lightweight
			// pseudo-embedding from the logit distribution for compatibility
			// with the existing scoring pipeline.
			//
			// For a production implementation, you would use a dedicated
			// embedding model (e.g. via web-llm's embeddings API with an
			// embedding-specific model).
			if (storedLmLogits) {
				const logitValues = Object.values(storedLmLogits);
				storedContextVector = new Float32Array(logitValues);
			} else {
				storedContextVector = null;
			}

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.groupCollapsed(
					`%c[LocalSlowLane] %c📥 Inference result (request #${requestId})`,
					'color: #9c27b0; font-weight: bold;',
					'color: inherit;',
				);
				// eslint-disable-next-line no-console
				console.log(
					storedContextVector
						? `✅ pseudo-vector: ${storedContextVector.length} dims`
						: '❌ No vector',
				);
				// eslint-disable-next-line no-console
				console.log(
					storedLmLogits
						? `✅ lm_logits: ${Object.keys(storedLmLogits).length} tokens`
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
			// Discard errors for stale requests
			if (requestId < latestRequestId) {
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

	const doUpdateContext = (text: string): void => {
		if (destroyed || !text || text.trim().length === 0) {
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

		void ensureEngineInitialized()
			.then(() => runInference(text, requestId))
			.catch(() => {});
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
			storedContextVector = null;
			storedLmLogits = null;
		},
	};
};
