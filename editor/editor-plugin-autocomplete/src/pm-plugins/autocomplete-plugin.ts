import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AutocompletePlugin } from '../autocompletePluginType';

import { isAutocompleteDebugEnabled } from './debug-mode';
import { createGhostTextDecorationSet } from './ghost-text-decoration';
import {
	createLocalSlowLaneClient,
	type LocalSlowLaneClient,
	type LocalSlowLaneLoadError,
	type LocalSlowLaneLoadSuccess,
} from './local-slow-lane-client';
import { createSlowLaneClient, setDefaultSlowLaneClient, isWordBoundary } from './slow-lane-client';
import {
	predict,
	loadDefaultVocabulary,
	loadVectorsAsync,
	incrementSessionFreq,
	ingestDocumentPage,
} from './text-predictor';

export const autocompletePluginKey: PluginKey = new PluginKey('autocomplete');

const DEBOUNCE_MS = 150;
const NETWORK_SLOW_LANE_DEBOUNCE_MS = 300;
const LOCAL_SLOW_LANE_DEBOUNCE_MS = 100;
const CONTEXT_REFRESH_THROTTLE_MS = 1000;
// Caps the dedup Set so long editing sessions don't retain every distinct
// version of the (potentially hundreds-of-KB) page content for the plugin's
// lifetime. Eviction is FIFO; a re-ingest of an evicted text is harmless.
const MAX_INGESTED_CONTEXT_TEXTS = 50;
// Caps how many times the word-boundary path will retry getContext() while the
// parent comment is still missing. Combined with the 1s throttle this gives a
// ~5s window to cover a still-loading comment thread, then stops permanently so
// non-comment editors (where parentCommentContent never arrives) don't refetch
// on every word boundary for the plugin's lifetime.
const MAX_CONTEXT_REFRESH_ATTEMPTS = 5;

// eslint-disable-next-line require-unicode-regexp
const TRAILING_NON_BOUNDARY_TOKEN_REGEX = /([^\s.,;:!?]*)$/;
// eslint-disable-next-line require-unicode-regexp
const WORD_BOUNDARY_CHARS_REGEX = /[\s.,;:!?]/;

const hasDestroy = (
	client: ReturnType<typeof createSlowLaneClient> | LocalSlowLaneClient,
): client is LocalSlowLaneClient => 'destroy' in client && typeof client.destroy === 'function';

export interface AutocompletePluginState {
	/** The decoration set containing the ghost text widget */
	decorationSet: DecorationSet;
	/** The document position where the ghost text should appear */
	ghostPosition: number;
	/** The predicted ghost text to display */
	ghostText: string;
}

const createInitialState = (): AutocompletePluginState => ({
	ghostText: '',
	ghostPosition: -1,
	decorationSet: DecorationSet.empty,
});

/**
 * Extract text content before the cursor from the current document.
 * Returns the last ~200 characters for context.
 */
const getTextBeforeCursor = (state: EditorState): string => {
	const { $from } = state.selection;
	const maxChars = 200;

	const blockNode = $from.parent;
	const offsetInBlock = $from.parentOffset;
	const blockText = blockNode.textContent.slice(0, offsetInBlock);

	if (blockText.length >= maxChars) {
		return blockText.slice(-maxChars);
	}

	let fullText = blockText;

	// Walk backwards through previous blocks until we have enough context.
	let depth = $from.depth - 1;

	while (fullText.length < maxChars && depth >= 0) {
		const parentNode = $from.node(depth);
		const indexInParent = $from.index(depth);

		for (let i = indexInParent - 1; i >= 0 && fullText.length < maxChars; i--) {
			const sibling = parentNode.child(i);
			const siblingText = sibling.textContent;
			fullText = siblingText + '\n' + fullText;
		}
		depth--;
	}

	return fullText.slice(-maxChars);
};

/**
 * Set the autocomplete state via a transaction metadata.
 */
const setAutocompleteMeta = (
	tr: Transaction,
	meta: Partial<AutocompletePluginState>,
): Transaction => {
	return tr.setMeta(autocompletePluginKey, meta);
};

/**
 * Apply a ghost text suggestion to the editor state.
 */
let lastShownGhostText = '';

const showGhostText = (view: EditorView, text: string, position: number): void => {
	try {
		const { state, dispatch } = view;
		const decorationSet = createGhostTextDecorationSet(state, position, text);
		const tr = setAutocompleteMeta(state.tr, {
			ghostText: text,
			ghostPosition: position,
			decorationSet,
		});
		dispatch(tr);
	} catch (error) {
		logException(error as Error, { location: 'editor-plugin-autocomplete/showGhostText' });
	}
};

/**
 * Clear the current ghost text from the editor.
 */
const clearGhostText = (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
	const pluginState = autocompletePluginKey.getState(state) as AutocompletePluginState | undefined;
	if (!pluginState || !pluginState.ghostText) {
		return false;
	}

	if (dispatch) {
		try {
			const tr = setAutocompleteMeta(state.tr, {
				ghostText: '',
				ghostPosition: -1,
				decorationSet: DecorationSet.empty,
			});
			dispatch(tr);
		} catch (error) {
			logException(error as Error, { location: 'editor-plugin-autocomplete/clearGhostText' });
			return false;
		}
	}
	return true;
};

/**
 * Accept the current ghost text suggestion and insert it into the document.
 */
const acceptGhostText = (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
	const pluginState = autocompletePluginKey.getState(state) as AutocompletePluginState | undefined;
	if (!pluginState || !pluginState.ghostText) {
		return false;
	}

	if (dispatch) {
		try {
			const { ghostText, ghostPosition } = pluginState;
			let tr = state.tr.insertText(ghostText, ghostPosition);
			tr = setAutocompleteMeta(tr, {
				ghostText: '',
				ghostPosition: -1,
				decorationSet: DecorationSet.empty,
			});
			dispatch(tr);
		} catch (error) {
			logException(error as Error, { location: 'editor-plugin-autocomplete/acceptGhostText' });
			return false;
		}
	}
	return true;
};

/**
 * Context provided to the autocomplete plugin on first editor focus.
 * Text fields are selectively ingested to boost word-frequency scoring for
 * predictions, giving words already present in the document/thread an L1
 * priority boost.
 */
export interface AutocompleteContext {
	/** Full page content as a string (e.g. markdown). */
	fullPageContent?: string;
	/** The currently selected text on the page, if any. */
	pageSelectionContent?: string;
	/** Content of the parent comment when the editor is in reply or edit mode. */
	parentCommentContent?: string;
	/** Contents of sibling comments when the editor is in reply or edit mode. */
	siblingCommentsContents?: string[];
}

export interface AutocompletePluginOptions {
	/**
	 * Async function called once on first editor focus to retrieve context for
	 * word-frequency boosting. Called lazily so the preset can remain synchronous.
	 */
	getContext?: () => Promise<AutocompleteContext | undefined>;
	/**
	 * Async function that resolves to a URL for the word vectors binary file.
	 * When provided, this takes precedence over the bundled asset URL.
	 * Use this to serve vectors from a CDN or media service in production.
	 */
	getVectorsBinaryUrl?: () => Promise<string>;
	/**
	 * User locale used to determine whether autocomplete should run.
	 * Defaults to browser locale when omitted.
	 */
	locale?: string;
	/**
	 * Subscription for hosts with live external context (e.g. Rovo chat). The plugin
	 * re-fetches via getContext() on each notification and unsubscribes on destroy.
	 * Only meaningful alongside `getContext`; without it each notification is a no-op.
	 */
	subscribeToContextUpdates?: (onContextUpdated: () => void) => () => void;
	/**
	 * When true, uses on-device inference via WebGPU (MLC WebLLM) instead of
	 * the network-based slow-lane backend. Defaults to false (network client).
	 */
	useLocalModel?: boolean;
}

/**
 * Build the text payload for the slow-lane request by prepending any available
 * comment context ahead of the live document text. This gives the backend
 * model richer context about the thread the user is writing in.
 */
const buildSlowLaneText = (docText: string, context?: AutocompleteContext): string => {
	const lines: string[] = [];

	if (context?.parentCommentContent) {
		lines.push(`comment: ${context.parentCommentContent}`);
	}

	context?.siblingCommentsContents?.forEach((sibling, index) => {
		lines.push(`reply ${index + 1}: ${sibling}`);
	});

	const nextReplyNumber = (context?.siblingCommentsContents?.length ?? 0) + 1;
	lines.push(`reply ${nextReplyNumber}: ${docText}`);

	return lines.join('\n');
};

const createMidWordCharacterRegex = (): RegExp | null => {
	try {
		// string-built regex avoids TS1501 under the package's ES5 build target
		// Ignored via go/ees019
		// eslint-disable-next-line e18e/prefer-static-regex
		return new RegExp('[\\p{L}\\p{N}_]', 'u');
	} catch {
		return null;
	}
};

const midWordCharacterRegex = createMidWordCharacterRegex();

const isAsciiWordCharacter = (char: string): boolean => {
	if (char === '_') {
		return true;
	}

	const charCode = char.charCodeAt(0);
	return (
		(charCode >= 48 && charCode <= 57) ||
		(charCode >= 65 && charCode <= 90) ||
		(charCode >= 97 && charCode <= 122)
	);
};

const isMidWordCharacter = (char: string): boolean => {
	if (midWordCharacterRegex) {
		return midWordCharacterRegex.test(char);
	}

	if (isAsciiWordCharacter(char)) {
		return true;
	}

	return char.toLocaleLowerCase() !== char.toLocaleUpperCase();
};

const getLeadingTextCharacter = (text?: string): string | undefined => {
	const firstCodePoint = text?.codePointAt(0);

	if (firstCodePoint === undefined) {
		return undefined;
	}

	return String.fromCodePoint(firstCodePoint);
};

const getTypedLengthForPrediction = (textBefore: string): number => {
	if (isWordBoundary(textBefore)) {
		return 0;
	}

	const trailingToken = textBefore.match(TRAILING_NON_BOUNDARY_TOKEN_REGEX)?.[1] ?? '';
	return trailingToken.length;
};

const isEnglishLocale = (locale?: string): boolean => {
	if (!locale) {
		return false;
	}

	return locale.toLowerCase().startsWith('en');
};

export const createAutocompletePlugin = (
	options?: AutocompletePluginOptions,
	api?: ExtractInjectionAPI<AutocompletePlugin>,
): SafePlugin<AutocompletePluginState> => {
	const locale =
		options?.locale ?? (typeof navigator !== 'undefined' ? navigator.language : undefined);
	const isAutocompleteEnabled = isEnglishLocale(locale);

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let hasIngestedPage = false;
	let resolvedContext: AutocompleteContext | undefined;
	/**
	 * Kept in sync with the live EditorView so the async getContext() promise
	 * can re-trigger a slow-lane update the moment context arrives, even if the
	 * user has already typed several words before the promise resolved.
	 */
	let currentView: EditorView | null = null;
	let unsubscribeFromContextUpdates: (() => void) | undefined;
	/**
	 * Set after accepting a suggestion so the next doc-change update
	 * skips scheduling a new prediction for the just-inserted text.
	 * Scoped to the factory so multiple editor instances don't share state.
	 */
	let justAccepted = false;

	/**
	 * Stores the text-before-cursor snapshot at the moment the user dismissed
	 * a suggestion via Escape. While the context remains identical, we suppress
	 * re-showing the same suggestion. Resets to null as soon as the text changes.
	 */
	let dismissedContext: string | null = null;
	let lastSuggestionTypedLength = 0;
	let lastSuggestionLength = 0;

	/**
	 * cold  → no slow-lane vector received yet; frequency-only trie scoring
	 * server → server slow-lane API returned the context vector
	 * localLlm → on-device WebGPU/MLC model returned the context vector
	 */
	const getCompletionSource = (): 'cold' | 'server' | 'localLlm' => {
		if (!slowLaneClient.getContextVector()) {
			return 'cold';
		}
		return options?.useLocalModel ? 'localLlm' : 'server';
	};

	const fireSuggestionDismissedAnalytics = (reason: 'escape' | 'blur'): void => {
		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.SUGGESTION_DISMISSED,
			actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
			eventType: EVENT_TYPE.TRACK,
			attributes: { completionSource: getCompletionSource(), reason },
		});
	};

	const fireLocalModelLoadedAnalytics = (info: LocalSlowLaneLoadSuccess): void => {
		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.LOCAL_MODEL_LOADED,
			actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				modelId: info.modelId,
				embeddingModelId: info.embeddingModelId,
				loadDurationMs: info.loadDurationMs,
				gpuVendor: info.capabilities.vendor,
				gpuArchitecture: info.capabilities.architecture,
			},
		});
	};

	const fireLocalModelLoadFailedAnalytics = (error: LocalSlowLaneLoadError): void => {
		const { capabilities } = error;
		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.LOCAL_MODEL_LOAD_FAILED,
			actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				reason: error.reason,
				message: error.message,
				modelId: error.modelId,
				embeddingModelId: error.embeddingModelId,
				webgpuAvailable: capabilities.available,
				adapterAvailable: capabilities.adapterAvailable,
				shaderF16Supported: capabilities.shaderF16Supported,
				maxBufferSizeMB: capabilities.maxBufferSizeMB,
				maxStorageBufferBindingSizeMB: capabilities.maxStorageBufferBindingSizeMB,
				gpuVendor: capabilities.vendor,
				gpuArchitecture: capabilities.architecture,
			},
		});
	};

	const fireSuggestionInsertedAnalytics = (ghostText: string): void => {
		const typedLength = lastSuggestionTypedLength;
		const suggestionLength = lastSuggestionLength || typedLength + ghostText.length;
		const kssDelta = suggestionLength - typedLength;

		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.SUGGESTION_INSERTED,
			actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				completionSource: getCompletionSource(),
				suggestionLength,
				typedLength,
				kssDelta,
			},
		});
	};

	const slowLaneClient = options?.useLocalModel
		? createLocalSlowLaneClient({
				debounceMs: LOCAL_SLOW_LANE_DEBOUNCE_MS,
				onLoadSuccess: fireLocalModelLoadedAnalytics,
				onLoadError: fireLocalModelLoadFailedAnalytics,
			})
		: createSlowLaneClient({
				baseUrl: '',
				debounceMs: NETWORK_SLOW_LANE_DEBOUNCE_MS,
			});
	setDefaultSlowLaneClient(slowLaneClient);

	let contextRequestInFlight = false;
	let lastContextRefreshAt = 0;
	// Bounds the word-boundary retry loop so it terminates even when the editor is
	// not in a comment thread (parentCommentContent never resolves).
	let wordBoundaryRefreshAttempts = 0;
	// Set when the plugin is torn down so in-flight getContext() resolutions don't
	// mutate the global text-predictor state after destruction.
	let destroyed = false;
	const ingestedContextTexts = new Set<string>();

	const logContextResolved = (source: string, context?: AutocompleteContext): void => {
		if (!isAutocompleteDebugEnabled()) {
			return;
		}

		// eslint-disable-next-line no-console
		console.log(
			'%c[Autocomplete] %cgetContext resolved',
			'color: #00b8d9; font-weight: bold;',
			'color: inherit;',
			{
				source,
				hasParentComment: !!context?.parentCommentContent,
				parentCommentPreview: context?.parentCommentContent?.slice(0, 80),
				siblingCount: context?.siblingCommentsContents?.length ?? 0,
				hasFullPage: !!context?.fullPageContent,
			},
		);
	};

	const applyContext = (context: AutocompleteContext): void => {
		// Merge rather than replace: the word-boundary retry may resolve only a
		// late-arriving field (e.g. parentCommentContent) without re-sending
		// fullPageContent, so replacing would drop previously resolved context.
		// Strip undefined values first so a field explicitly set to undefined by
		// getContext doesn't overwrite a previously resolved value.
		const definedContext = Object.fromEntries(
			Object.entries(context).filter(([, value]) => value !== undefined),
		);
		resolvedContext = { ...resolvedContext, ...definedContext };

		const ingestContextText = (text?: string): void => {
			if (!text || ingestedContextTexts.has(text)) {
				return;
			}

			ingestedContextTexts.add(text);
			// Evict oldest entries (Set preserves insertion order) to bound memory.
			while (ingestedContextTexts.size > MAX_INGESTED_CONTEXT_TEXTS) {
				const oldest = ingestedContextTexts.values().next().value;
				if (oldest === undefined) {
					break;
				}
				ingestedContextTexts.delete(oldest);
			}
			ingestDocumentPage(text);
		};

		ingestContextText(context.fullPageContent);
		ingestContextText(context.parentCommentContent);
		for (const siblingCommentContent of context.siblingCommentsContents ?? []) {
			ingestContextText(siblingCommentContent);
		}

		// Context arrived after word boundaries may already have fired. Re-send
		// slow-lane context immediately so the next inference includes the thread.
		if (currentView) {
			slowLaneClient.updateContext(
				buildSlowLaneText(currentView.state.doc.textContent, resolvedContext),
			);
		}
	};

	/**
	 * Returns true when a fetch was actually started, false when it was skipped
	 * (no getContext, a request already in flight, or throttled). Callers that
	 * track a retry budget should only count attempts where this returns true.
	 */
	const refreshContext = ({
		source,
		allowThrottle = true,
	}: {
		allowThrottle?: boolean;
		source: string;
	}): boolean => {
		if (!options?.getContext || contextRequestInFlight) {
			return false;
		}

		const now = Date.now();
		if (allowThrottle && now - lastContextRefreshAt < CONTEXT_REFRESH_THROTTLE_MS) {
			return false;
		}

		contextRequestInFlight = true;
		lastContextRefreshAt = now;

		options
			.getContext()
			.then((context) => {
				// Bail if the plugin was destroyed while the fetch was in flight —
				// applyContext mutates global text-predictor state we must not touch
				// after teardown.
				if (destroyed) {
					return;
				}
				logContextResolved(source, context);
				if (!context) {
					return;
				}

				applyContext(context);
			})
			.catch((error) => {
				logException(error as Error, {
					location: 'editor-plugin-autocomplete/getContext',
				});
			})
			.finally(() => {
				contextRequestInFlight = false;
			});

		return true;
	};

	/**
	 * Schedule a prediction after a short debounce.
	 * Tier 1 predictions are synchronous (<0.1ms) but we still debounce
	 * to avoid unnecessary work on rapid keystrokes.
	 */
	const schedulePrediction = (view: EditorView): void => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			try {
				const { state } = view;
				const { selection } = state;

				if (!selection.empty) {
					return;
				}

				// Suppress suggestions when the cursor is mid-word — only offer
				// completions when the cursor is at the trailing edge of a token.
				// nodeAfter correctly handles inline atoms (mentions, emojis) where
				// parentOffset and textContent indices diverge.
				const nodeAfter = selection.$from.nodeAfter;
				const charAfterCursor = nodeAfter?.isText
					? getLeadingTextCharacter(nodeAfter.text)
					: undefined;
				// Only suppress for Unicode letters, digits, and underscore — hyphens,
				// apostrophes, and similar punctuation are valid left-edge boundaries
				// and should not block suggestions (e.g. cursor before '-' in compound-word).
				if (charAfterCursor && isMidWordCharacter(charAfterCursor)) {
					return;
				}

				const textBefore = getTextBeforeCursor(state);

				// Suppress re-showing the same suggestion the user just dismissed.
				// Once the text context changes (user types or deletes), this clears automatically.
				if (textBefore === dismissedContext) {
					return;
				}
				dismissedContext = null;

				if (textBefore.trim().length < 3) {
					return;
				}

				const prediction = predict(textBefore);

				if (prediction && prediction.length > 0) {
					const typedLength = getTypedLengthForPrediction(textBefore);
					lastSuggestionTypedLength = typedLength;
					lastSuggestionLength = typedLength + prediction.length;

					showGhostText(view, prediction, selection.from);
					if (prediction !== lastShownGhostText) {
						lastShownGhostText = prediction;
						api?.analytics?.actions.fireAnalyticsEvent({
							action: ACTION.SUGGESTION_VIEWED,
							actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
							eventType: EVENT_TYPE.TRACK,
							attributes: { completionSource: getCompletionSource() },
						});
					}
				}
			} catch (error) {
				logException(error as Error, {
					location: 'editor-plugin-autocomplete/schedulePrediction',
				});
			}
		}, DEBOUNCE_MS);
	};

	const maybeUpdateSessionFrequency = (view: EditorView, prevState: EditorState): void => {
		const newText = getTextBeforeCursor(view.state);
		const prevText = getTextBeforeCursor(prevState);

		if (newText.length <= prevText.length) {
			return;
		}

		const lastChar = newText[newText.length - 1];
		if (!WORD_BOUNDARY_CHARS_REGEX.test(lastChar)) {
			return;
		}

		// Only fire if the previous state did not already end on a boundary,
		// so we don't double-count when multiple boundary chars are inserted.
		const prevLastChar = prevText[prevText.length - 1];
		if (prevLastChar && WORD_BOUNDARY_CHARS_REGEX.test(prevLastChar)) {
			return;
		}

		const beforeBoundary = newText.slice(0, -1).trimEnd();
		const lastSpaceIdx = beforeBoundary.lastIndexOf(' ');
		const completedWord = beforeBoundary.slice(lastSpaceIdx + 1).toLowerCase();

		if (completedWord.length >= 2) {
			incrementSessionFreq(completedWord);
		}
	};

	return new SafePlugin({
		key: autocompletePluginKey,

		state: {
			init: (): AutocompletePluginState => createInitialState(),
			apply: (
				tr: ReadonlyTransaction,
				pluginState: AutocompletePluginState,
			): AutocompletePluginState => {
				const meta = tr.getMeta(autocompletePluginKey) as
					| Partial<AutocompletePluginState>
					| undefined;

				if (meta) {
					return { ...pluginState, ...meta };
				}

				// A new prediction is scheduled from view.update.
				if (tr.docChanged) {
					return {
						...pluginState,
						ghostText: '',
						ghostPosition: -1,
						decorationSet: DecorationSet.empty,
					};
				}

				if (tr.selectionSet && pluginState.ghostText) {
					return {
						...pluginState,
						ghostText: '',
						ghostPosition: -1,
						decorationSet: DecorationSet.empty,
					};
				}

				return pluginState;
			},
		},

		props: {
			decorations: (state: EditorState) => {
				const pluginState = autocompletePluginKey.getState(state) as
					| AutocompletePluginState
					| undefined;
				return pluginState?.decorationSet ?? DecorationSet.empty;
			},

			handleKeyDown: keydownHandler({
				Tab: (state: EditorState, dispatch?: (tr: Transaction) => void) => {
					const pluginState = autocompletePluginKey.getState(state) as
						| AutocompletePluginState
						| undefined;
					const ghostText = pluginState?.ghostText ?? '';
					const accepted = acceptGhostText(state, dispatch);
					if (accepted) {
						justAccepted = true;
						lastShownGhostText = '';
						fireSuggestionInsertedAnalytics(ghostText);
					}
					return accepted;
				},
				ArrowRight: (state: EditorState, dispatch?: (tr: Transaction) => void) => {
					const pluginState = autocompletePluginKey.getState(state) as
						| AutocompletePluginState
						| undefined;
					const ghostText = pluginState?.ghostText ?? '';
					const accepted = acceptGhostText(state, dispatch);
					if (accepted) {
						justAccepted = true;
						lastShownGhostText = '';
						fireSuggestionInsertedAnalytics(ghostText);
					}
					return accepted;
				},
				Escape: (state: EditorState, dispatch?: (tr: Transaction) => void) => {
					const didClear = clearGhostText(state, dispatch);
					if (didClear) {
						dismissedContext = getTextBeforeCursor(state);
						fireSuggestionDismissedAnalytics('escape');
					}
					return didClear;
				},
			}),

			handleDOMEvents: {
				blur: (view: EditorView) => {
					if (!isAutocompleteEnabled) {
						return false;
					}

					const pluginState = autocompletePluginKey.getState(view.state) as
						| AutocompletePluginState
						| undefined;
					if (pluginState?.ghostText) {
						clearGhostText(view.state, view.dispatch);
						fireSuggestionDismissedAnalytics('blur');
					}
					return false;
				},
				focus: () => {
					if (!isAutocompleteEnabled) {
						return false;
					}

					loadDefaultVocabulary({ isLocalLLM: options?.useLocalModel ?? false }).catch((error) => {
						logException(error as Error, {
							location: 'editor-plugin-autocomplete/loadDefaultVocabulary',
						});
					});
					loadVectorsAsync({
						getBinaryUrl: options?.getVectorsBinaryUrl,
						isLocalLLM: options?.useLocalModel ?? false,
					}).catch((error) => {
						logException(error as Error, {
							location: 'editor-plugin-autocomplete/loadVectorsAsync',
						});
					});
					if (!hasIngestedPage) {
						hasIngestedPage = true;
						refreshContext({
							source: 'focus',
							allowThrottle: false,
						});
					}
					return false;
				},
			},
		},

		view: (editorView: EditorView) => {
			// Capture up front so a subscription notification before the first PM
			// transaction can still drive slowLaneClient.updateContext (gated on currentView).
			currentView = editorView;

			// Push channel for hosts that keep producing context after mount (e.g. Rovo chat).
			if (isAutocompleteEnabled && options?.subscribeToContextUpdates) {
				unsubscribeFromContextUpdates = options.subscribeToContextUpdates(() => {
					// Bypass throttle for freshness; the in-flight guard prevents overlap.
					refreshContext({ source: 'subscription', allowThrottle: false });
				});
			}

			return {
				update: (view: EditorView, prevState: EditorState) => {
					if (!isAutocompleteEnabled) {
						return;
					}

					currentView = view;
					if (!prevState.doc.eq(view.state.doc)) {
						if (justAccepted) {
							justAccepted = false;

							// Snapshot the post-acceptance text so follow-up transactions hit
							// the dismissedContext guard and abort until the user types again.
							dismissedContext = getTextBeforeCursor(view.state);

							if (debounceTimer) {
								clearTimeout(debounceTimer);
							}
							return;
						}

						maybeUpdateSessionFrequency(view, prevState);

						const textBefore = getTextBeforeCursor(view.state);
						if (isWordBoundary(textBefore)) {
							slowLaneClient.updateContext(
								buildSlowLaneText(view.state.doc.textContent, resolvedContext),
							);

							// Context may not have resolved on first focus (e.g. comment
							// thread still loading). Retry on word boundaries until we have
							// the parent comment, throttled so we don't refetch constantly
							// and capped so non-comment editors stop retrying entirely.
							// Skipped for push-channel hosts (subscribeToContextUpdates): they
							// never grow parentCommentContent, so polling only burns the budget.
							if (
								!options?.subscribeToContextUpdates &&
								!resolvedContext?.parentCommentContent &&
								wordBoundaryRefreshAttempts < MAX_CONTEXT_REFRESH_ATTEMPTS
							) {
								// Only count the attempt when a fetch actually started, so an
								// in-flight or throttled no-op doesn't burn the retry budget.
								if (refreshContext({ source: 'word-boundary' })) {
									wordBoundaryRefreshAttempts++;
								}
							}
						}

						schedulePrediction(view);
					}
				},
				destroy: () => {
					destroyed = true;
					currentView = null;
					unsubscribeFromContextUpdates?.();
					unsubscribeFromContextUpdates = undefined;
					if (debounceTimer) {
						clearTimeout(debounceTimer);
					}
					if (hasDestroy(slowLaneClient)) {
						slowLaneClient.destroy();
					}
					ingestedContextTexts.clear();
					setDefaultSlowLaneClient(null);
				},
			};
		},
	});
};
