import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { createGhostTextDecorationSet } from './ghost-text-decoration';
import { createSlowLaneClient, setDefaultSlowLaneClient, isWordBoundary } from './slow-lane-client';
import {
	predict,
	loadDefaultVocabulary,
	loadVectorsAsync,
	incrementSessionFreq,
	ingestDocumentPage,
} from './text-predictor';

const SLOW_LANE_ENDPOINT = '/gateway/api/v1/autocomplete/typeahead-encodings';

export const autocompletePluginKey = new PluginKey('autocomplete');

const DEBOUNCE_MS = 150;

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

	// 1. Get the perfectly flattened text of the current block up to the cursor
	const blockNode = $from.parent;
	const offsetInBlock = $from.parentOffset;
	const blockText = blockNode.textContent.slice(0, offsetInBlock);

	if (blockText.length >= maxChars) {
		return blockText.slice(-maxChars);
	}

	let fullText = blockText;

	// 2. Walk backwards through previous blocks
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
const showGhostText = (view: EditorView, text: string, position: number): void => {
	const { state, dispatch } = view;
	const decorationSet = createGhostTextDecorationSet(state, position, text);
	const tr = setAutocompleteMeta(state.tr, {
		ghostText: text,
		ghostPosition: position,
		decorationSet,
	});
	dispatch(tr);
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
		const tr = setAutocompleteMeta(state.tr, {
			ghostText: '',
			ghostPosition: -1,
			decorationSet: DecorationSet.empty,
		});
		dispatch(tr);
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
		const { ghostText, ghostPosition } = pluginState;
		let tr = state.tr.insertText(ghostText, ghostPosition);
		tr = setAutocompleteMeta(tr, {
			ghostText: '',
			ghostPosition: -1,
			decorationSet: DecorationSet.empty,
		});
		dispatch(tr);
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

export const createAutocompletePlugin = (options?: AutocompletePluginOptions) => {
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let hasIngestedPage = false;
	let resolvedContext: AutocompleteContext | undefined;
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

	const slowLaneClient = createSlowLaneClient({
		baseUrl: '',
		endpoint: SLOW_LANE_ENDPOINT,
	});
	setDefaultSlowLaneClient(slowLaneClient);

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
			const { state } = view;
			const { selection } = state;

			// Only predict for cursor selections (not range selections)
			if (!selection.empty) {
				return;
			}

			const textBefore = getTextBeforeCursor(state);

			// Suppress re-showing the same suggestion the user just dismissed.
			// Once the text context changes (user types or deletes), this clears automatically.
			if (textBefore === dismissedContext) {
				return;
			}
			dismissedContext = null;

			// Don't predict if there's not enough context
			if (textBefore.trim().length < 3) {
				return;
			}

			// Tier 1 prediction is synchronous -- no async needed
			const prediction = predict(textBefore);

			if (prediction && prediction.length > 0) {
				showGhostText(view, prediction, selection.from);
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
		// eslint-disable-next-line require-unicode-regexp
		if (!/[\s.,;:!?]/.test(lastChar)) {
			return;
		}

		// Only fire if the previous state did not already end on a boundary,
		// so we don't double-count when multiple boundary chars are inserted.
		const prevLastChar = prevText[prevText.length - 1];
		// eslint-disable-next-line require-unicode-regexp
		if (prevLastChar && /[\s.,;:!?]/.test(prevLastChar)) {
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

				// If the document changed, clear the ghost text
				// (new prediction will be scheduled from view.update)
				if (tr.docChanged) {
					return {
						...pluginState,
						ghostText: '',
						ghostPosition: -1,
						decorationSet: DecorationSet.empty,
					};
				}

				// If selection changed without doc change, clear ghost text
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
					const accepted = acceptGhostText(state, dispatch);
					if (accepted) justAccepted = true;
					return accepted;
				},
				ArrowRight: (state: EditorState, dispatch?: (tr: Transaction) => void) => {
					const accepted = acceptGhostText(state, dispatch);
					if (accepted) justAccepted = true;
					return accepted;
				},
				Escape: (state: EditorState, dispatch?: (tr: Transaction) => void) => {
					const didClear = clearGhostText(state, dispatch);
					if (didClear) {
						dismissedContext = getTextBeforeCursor(state);
					}
					return didClear;
				},
			}),

			handleDOMEvents: {
				blur: (view: EditorView) => {
					const pluginState = autocompletePluginKey.getState(view.state) as
						| AutocompletePluginState
						| undefined;
					if (pluginState?.ghostText) {
						clearGhostText(view.state, view.dispatch);
					}
					return false;
				},
				focus: () => {
					loadDefaultVocabulary();
					loadVectorsAsync({ getBinaryUrl: options?.getVectorsBinaryUrl }).catch(() => {});
					if (!hasIngestedPage) {
						hasIngestedPage = true;
						if (options?.getContext) {
							options
								.getContext()
								.then((context) => {
									if (!context) {
										return;
									}
									resolvedContext = context;

									if (context.fullPageContent) {
										ingestDocumentPage(context.fullPageContent);
									}
									if (context.parentCommentContent) {
										ingestDocumentPage(context.parentCommentContent);
									}
									context.siblingCommentsContents?.forEach(ingestDocumentPage);
								})
								.catch(() => {});
						}
					}
					return false;
				},
			},
		},

		view: () => ({
			update: (view: EditorView, prevState: EditorState) => {
				if (!prevState.doc.eq(view.state.doc)) {
					if (justAccepted) {
						justAccepted = false;

						// ✨ THE FIX: Memorize the text state right after acceptance.
						// Any follow-up transactions will hit the 'dismissedContext'
						// block and abort until the user actually types a new character!
						dismissedContext = getTextBeforeCursor(view.state);

						// Also clear any pending debounce timers from before the acceptance
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
					}

					schedulePrediction(view);
				}
			},
			destroy: () => {
				if (debounceTimer) {
					clearTimeout(debounceTimer);
				}
				setDefaultSlowLaneClient(null);
			},
		}),
	});
};
