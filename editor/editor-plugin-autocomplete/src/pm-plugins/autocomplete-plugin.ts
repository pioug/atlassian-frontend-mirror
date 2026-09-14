import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { CompletionSource } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AutocompletePlugin } from '../autocompletePluginType';

import {
	CTC_STYLES,
	ctcTag,
	isAutocompleteDebugEnabled,
	isAutocompleteDebugVerbose,
} from './debug-mode';
import { createGhostTextDecorationSet } from './ghost-text-decoration';
// Type-only, so the harvester chunk is still reached exclusively through the
// dynamic import in `ensureInlineCodeHarvester`.
import type { HarvestMatch } from './inline-code-harvester';
import {
	createLocalSlowLaneClient,
	type LocalSlowLaneClient,
	type LocalSlowLaneLoadError,
	type LocalSlowLaneLoadSuccess,
} from './local-slow-lane-client';
import { loadGrammarDataAsync } from './scoring-pipeline';
import {
	clearDefaultSlowLaneClient,
	createSlowLaneClient,
	getDefaultSlowLaneClientStatus,
	isWordBoundary,
	setDefaultSlowLaneClient,
	type SlowLaneClientKind,
} from './slow-lane-client';
import {
	predict,
	type CtcAbstainReason,
	type PredictionResult,
	loadDefaultVocabulary,
	loadVectorsAsync,
	incrementSessionFreq,
	ingestDocumentPage,
	getLastPredictionDebug,
	getLastPredictionOutcome,
	isSurfaceInAcceptCooldown,
	noteSuggestionAccepted,
	resetSessionBoosts,
} from './text-predictor';

export const autocompletePluginKey: PluginKey = new PluginKey('autocomplete');

const PREDICTION_COALESCE_MS = 0;
const GHOST_DECISION_BUDGET_MS = 100;
const NETWORK_SLOW_LANE_DEBOUNCE_MS = 300;
const LOCAL_SLOW_LANE_DEBOUNCE_MS = 100;
const CONTEXT_REFRESH_THROTTLE_MS = 1000;
// Caps the dedup Set so long editing sessions don't retain every distinct
// version of the (potentially hundreds-of-KB) page content for the plugin's
// lifetime. Eviction is FIFO; a re-ingest of an evicted text is harmless.
const MAX_INGESTED_CONTEXT_TEXTS = 50;
// Re-prime callback of every mounted editor. The harvested set and the L1
// boosts are shared by all of them, and more than one is mounted routinely — a
// comment box alongside its replies, or a comment box alongside the chat input.
// Membership doubles as the mount count, so a teardown only clears the shared
// stores once the last editor has gone.
//
// Decision: one pot, shared across hosts. Terms harvested in a comment box can
// be offered in the chat input and the other way round. Both are content from
// the page the reader is looking at, so the mixing is between things they can
// already see; partitioning the boosts would mean a per-host overlay on every
// trie node, which the scoring path reads on every keystroke.
const mountedEditors = new Set<() => void>();
// The scope that shared learning belongs to, as last reported by a host that
// scopes its context. Held here rather than per editor because the data it
// guards is shared and some hosts replace one editor with another across a
// navigation: an instance-local key would read as unset on exactly the change it
// exists to catch, while the previous scope's terms carried on in these globals.
// Undefined until a scoping host says otherwise. An editor that sends no key
// still shares the pot being emptied, so it is re-primed from the context it
// already holds rather than left with learning it can no longer see.
let contextScopeKey: string | undefined;
type InlineCodeHarvesterModule = typeof import('./inline-code-harvester');
// Set by whichever editor first finished importing the harvester chunk. The
// reset paths go through this rather than their own copy, because the editor
// that has to clear the set is not always one that imported it — the set is one
// per module, and nothing can be in it unless some editor got this far.
let loadedInlineCodeHarvester: InlineCodeHarvesterModule | null = null;
// Caps how many times the word-boundary path will retry getContext() while the
// parent comment is still missing. Combined with the 1s throttle this gives a
// ~5s window to cover a still-loading comment thread, then stops permanently so
// non-comment editors (where parentCommentContent never arrives) don't refetch
// on every word boundary for the plugin's lifetime.
const MAX_CONTEXT_REFRESH_ATTEMPTS = 5;
const INLINE_LEAF_TEXT = ' ';
let slowLaneClientInstanceSequence = 0;

// eslint-disable-next-line require-unicode-regexp
const WORD_BOUNDARY_CHARS_REGEX = /[\s.,;:!?]/;
const TRAILING_SURFACE_PREFIX_REGEX = /[\p{L}\p{N}_'-]+$/u;

type AsyncPredictionSignal = {
	contextKey?: string;
	familyKey?: string;
	kind: 'boundary' | 'semantic' | 'surface';
	latencyMs?: number;
};

type PredictionDecision = {
	asyncSignals: number;
	deadlineAt: number;
	evaluations: number;
	position: number;
	revision: number;
	startedAt: number;
	textBefore: string;
};

const hasDestroy = (
	client: ReturnType<typeof createSlowLaneClient> | LocalSlowLaneClient,
): client is LocalSlowLaneClient => 'destroy' in client && typeof client.destroy === 'function';

export interface CommittedSuggestion {
	/** Wall-clock latency from the triggering editor update to the committed ghost. */
	decisionLatencyMs: number;
	/** Evidence tier that authorized this suggestion for display. */
	evidenceTier: PredictionResult['evidenceTier'];
	/** Ghost tail actually rendered and inserted. */
	ghostText: string;
	/**
	 * Mean per-token log-probability of the verified prefix, carried so an
	 * acceptance can be attributed to the evidence that authorized the display
	 * rather than to whatever the scorer holds by the time Tab arrives.
	 */
	meanTokenLogProbability: number;
	/**
	 * Whether a longer candidate in the same pool extended this surface, which
	 * hands it that pool's mass undivided under the chain rule and puts it near
	 * the top of the posterior range for a structural reason.
	 */
	poolHeldExtension: boolean;
	/** ProseMirror position at which the ghost is anchored. */
	position: number;
	/** Share of its shortlist's mass the model put on this surface. */
	posterior: number;
	/** Final confidence-v2 ranking score. */
	rankScore: number;
	/**
	 * Characters of already-typed prefix the insertion overwrites, for surfaces
	 * that carry their own casing.
	 *
	 * The scored path appends its tail and leaves what the user typed alone,
	 * which is right for prose. A harvested identifier is matched
	 * case-insensitively but is only correct in the casing it was written in, so
	 * accepting `ml-s` against `ML-Studio` has to replace rather than append.
	 * Absent on every other path.
	 */
	replacesTypedPrefixLength?: number;
	/** Monotonic editor decision revision that owns this suggestion. */
	revision: number;
	/** How many scored candidates this surface's normaliser divided between. */
	shortlistSize: number;
	/** Full candidate surface, used by analytics and cooldown. */
	surface: string;
	/** Whether the surface is a single word, a bigram, or a phrase. */
	termType: PredictionResult['termType'];
	/** Difference between the selected rank score and its closest eligible rival. */
	winnerMargin: number;
}

export interface AutocompletePluginState {
	/** The decoration set containing the ghost text widget */
	decorationSet: DecorationSet;
	/** The document position where the ghost text should appear */
	ghostPosition: number;
	/** The predicted ghost text to display */
	ghostText: string;
	/** Single authoritative snapshot for rendering, insertion, analytics, and cooldown. */
	suggestion: CommittedSuggestion | null;
}

const createInitialState = (): AutocompletePluginState => ({
	ghostText: '',
	ghostPosition: -1,
	decorationSet: DecorationSet.empty,
	suggestion: null,
});

const clearGhostState = (pluginState: AutocompletePluginState): AutocompletePluginState => ({
	...pluginState,
	ghostText: '',
	ghostPosition: -1,
	decorationSet: DecorationSet.empty,
	suggestion: null,
});

/**
 * Keep a displayed ghost alive when the user types the character it already
 * predicted.
 *
 * Clearing on every document change throws away a suggestion the keystroke just
 * confirmed, and the replacement decision has to re-earn it from an empty state
 * inside the budget — which it often misses, so the ghost blinks out mid-word.
 * It is worse for multi-word surfaces: typing the space in `machine learning`
 * empties the current word, and the display gate refuses to show anything again
 * until three characters of `learning` exist.
 *
 * A confirming keystroke is not new information about the prediction, so the
 * ghost simply advances by one character and the still-running decision is free
 * to replace it with something better. Anything else — a different character,
 * a paste, a deletion, an edit elsewhere — clears as before.
 */
const advanceGhostThroughTypedCharacter = (
	tr: ReadonlyTransaction,
	pluginState: AutocompletePluginState,
): AutocompletePluginState | null => {
	const { ghostPosition, ghostText, suggestion } = pluginState;
	if (ghostText.length < 2 || ghostPosition < 0 || !suggestion) {
		// A one-character tail leaves nothing to show after advancing.
		return null;
	}

	// Exactly one character longer, with the cursor sitting just past the ghost
	// anchor: together these identify a single insertion made at the anchor
	// rather than a paste or an edit elsewhere in the document.
	if (tr.doc.content.size - tr.before.content.size !== 1) {
		return null;
	}
	if (!tr.selection.empty || tr.selection.from !== ghostPosition + 1) {
		return null;
	}
	if (tr.doc.textBetween(ghostPosition, ghostPosition + 1) !== ghostText[0]) {
		return null;
	}

	const remaining = ghostText.slice(1);
	const nextPosition = ghostPosition + 1;
	return {
		...pluginState,
		ghostText: remaining,
		ghostPosition: nextPosition,
		decorationSet: createGhostTextDecorationSet(tr.doc, nextPosition, remaining),
		// `surface` stays the full candidate so cooldown and analytics still
		// describe the suggestion that was originally committed. The replaced
		// prefix grows with the keystroke: it is the run the insertion overwrites,
		// and the user has just typed one more character of it.
		suggestion: {
			...suggestion,
			ghostText: remaining,
			position: nextPosition,
			...(suggestion.replacesTypedPrefixLength === undefined
				? {}
				: { replacesTypedPrefixLength: suggestion.replacesTypedPrefixLength + 1 }),
		},
	};
};

/**
 * Extract text content before the cursor from the current document.
 * Returns the last ~200 characters for context.
 */
const getTextBeforeCursor = (state: EditorState): string => {
	const { $from } = state.selection;
	const maxChars = 200;

	const blockNode = $from.parent;
	const offsetInBlock = $from.parentOffset;
	// PM offsets count inline leaf nodes; textContent indices do not.
	const blockText = blockNode.textBetween(0, offsetInBlock, undefined, INLINE_LEAF_TEXT);

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
			const siblingText = sibling.textBetween(0, sibling.content.size, '\n', INLINE_LEAF_TEXT);
			fullText = siblingText + '\n' + fullText;
		}
		depth--;
	}

	return fullText.slice(-maxChars);
};

const getTrailingSurfaceToken = (text: string): string =>
	text.trimEnd().match(TRAILING_SURFACE_PREFIX_REGEX)?.[0] ?? '';

const getTrailingSurfacePrefixLength = (text: string): number =>
	getTrailingSurfaceToken(text).length;

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

const showGhostText = (
	view: EditorView,
	prediction: PredictionResult,
	position: number,
	revision: number,
	decisionStartedAt: number,
	replacesTypedPrefixLength?: number,
): CommittedSuggestion | null => {
	try {
		const { state, dispatch } = view;
		const suggestion: CommittedSuggestion = {
			...(replacesTypedPrefixLength === undefined ? {} : { replacesTypedPrefixLength }),
			decisionLatencyMs: performance.now() - decisionStartedAt,
			evidenceTier: prediction.evidenceTier,
			ghostText: prediction.text,
			meanTokenLogProbability: prediction.meanTokenLogProbability,
			poolHeldExtension: prediction.poolHeldExtension,
			position,
			posterior: prediction.posterior,
			rankScore: prediction.rankScore,
			revision,
			shortlistSize: prediction.shortlistSize,
			surface: prediction.surface,
			termType: prediction.termType,
			winnerMargin: prediction.winnerMargin,
		};
		const decorationSet = createGhostTextDecorationSet(state.doc, position, prediction.text);
		const tr = setAutocompleteMeta(state.tr, {
			ghostText: prediction.text,
			ghostPosition: position,
			decorationSet,
			suggestion,
		});
		dispatch(tr);
		return suggestion;
	} catch (error) {
		logException(error as Error, { location: 'editor-plugin-autocomplete/showGhostText' });
		return null;
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
				suggestion: null,
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
const acceptGhostText = (
	state: EditorState,
	dispatch?: (tr: Transaction) => void,
): CommittedSuggestion | null => {
	const pluginState = autocompletePluginKey.getState(state) as AutocompletePluginState | undefined;
	if (!pluginState?.suggestion || !pluginState.ghostText) {
		return null;
	}

	if (dispatch) {
		try {
			const { ghostText, ghostPosition, suggestion } = pluginState;
			// Replacing back over the typed prefix rewrites it in the surface's own
			// casing; every other path appends and leaves the prefix untouched.
			const replaceFrom = Math.max(
				0,
				ghostPosition - Math.min(suggestion.replacesTypedPrefixLength ?? 0, ghostPosition),
			);
			let tr = state.tr;
			if (replaceFrom === ghostPosition) {
				tr = tr.insertText(ghostText, ghostPosition);
			} else {
				tr = tr.insertText(suggestion.surface, replaceFrom, ghostPosition);
				// Only the harvested path replaces, and what authorized it was the
				// surface being marked as code somewhere in the session. Inserting it
				// as plain text loses that, so the identifier the user accepted reads
				// as prose while the same identifier they typed by hand does not.
				const codeMark = state.schema.marks.code;
				if (codeMark) {
					tr = tr.addMark(replaceFrom, replaceFrom + suggestion.surface.length, codeMark.create());
					// The backtick input rule never ran, so nothing else will close this
					// mark. Without dropping it from the stored set the next character
					// the user types continues the code span.
					tr = tr.removeStoredMark(codeMark);
				}
			}
			tr = setAutocompleteMeta(tr, {
				ghostText: '',
				ghostPosition: -1,
				decorationSet: DecorationSet.empty,
				suggestion: null,
			});
			dispatch(tr);
			return suggestion;
		} catch (error) {
			logException(error as Error, { location: 'editor-plugin-autocomplete/acceptGhostText' });
			return null;
		}
	}
	return pluginState.suggestion;
};

const acceptGhostTextWithAnalytics = (
	state: EditorState,
	dispatch: ((tr: Transaction) => void) | undefined,
	onAccepted: (suggestion: CommittedSuggestion) => void,
): boolean => {
	const acceptedSuggestion = acceptGhostText(state, dispatch);
	if (acceptedSuggestion) {
		// Start the post-accept cooldown so the just-accepted unit isn't immediately
		// re-offered (QI-2 echo, e.g. `end to end` → `end to end to end`).
		noteSuggestionAccepted(acceptedSuggestion.surface);
		onAccepted(acceptedSuggestion);
	}
	return acceptedSuggestion !== null;
};

/**
 * Context provided to the autocomplete plugin on first editor focus.
 * Text fields are selectively ingested to boost word-frequency scoring for
 * predictions, giving words already present in the document/thread an L1
 * priority boost.
 */
export interface AutocompleteContext {
	/**
	 * Identifies what this context belongs to, for hosts whose editor outlives
	 * the thing it is writing about — a chat input that stays mounted across
	 * conversations and pages, say.
	 *
	 * When it changes, everything learned for the previous scope is dropped:
	 * both the L1 boosts and the harvested inline-code set are claims about what
	 * is being discussed, and neither transfers. The context reported alongside
	 * the new key is then ingested as if it were the first, so anything still
	 * current — an ongoing transcript, for instance — is primed again.
	 *
	 * Omit it and nothing resets; the editor learns for its own lifetime, which
	 * is right for a host mounted per comment or per page.
	 */
	contextScopeKey?: string;
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
	 * Opt in to suggesting inline-code identifiers seen in this session
	 * (`ml-studio` and friends), which no vocabulary holds and the scored path
	 * therefore cannot reach.
	 *
	 * Off by default and passed only by hosts whose own experiment enrolment
	 * covers it, so a surface that shares this plugin under a different gate is
	 * unaffected until it opts in too. The harvester is a separate chunk and is
	 * not requested at all while this is false.
	 */
	harvestInlineCode?: boolean;
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
	 * Product/editor surface where autocomplete runs (e.g. "comment", "chat").
	 * Added to analytics and UFO metadata for cross-surface reporting.
	 */
	surface?: string;
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

/**
 * The one verdict a harvested surface may speak on.
 *
 * `no-candidate` is the only abstention that means no vocabulary reaches the
 * prefix at all. Every other one — a margin the model cannot clear, a rival
 * still being read — describes known words in contention, where a session
 * surface with no score behind it would be overruling the ranker rather than
 * filling a gap it left.
 */
const HARVEST_ELIGIBLE_ABSTAIN_REASON: CtcAbstainReason = 'no-candidate';

/**
 * Whether the scored path has finished with this exact prefix and found nothing.
 *
 * The 100ms deadline expiring is not the same answer: it means the ranker was
 * still working, and displaying then would race a suggestion that is about to
 * arrive. So the harvest path reads the recorded verdict rather than the clock.
 */
const scoredPathFinishedEmpty = (textBefore: string): boolean => {
	const outcome = getLastPredictionOutcome();
	return (
		outcome !== null &&
		outcome.textBefore === textBefore &&
		!outcome.awaitingAsyncEvidence &&
		outcome.abstainReason === HARVEST_ELIGIBLE_ABSTAIN_REASON
	);
};

/**
 * Whether the surface is already sitting immediately before the typed prefix.
 *
 * Completing `ml-s` to `ml-studio` right after `ml-studio` produces the echo the
 * scored path's repetition guard exists to stop, and this path does not go
 * through arbitration to inherit it.
 */
const repeatsPrecedingText = (match: HarvestMatch, textBefore: string): boolean => {
	const trimmed = textBefore.trimEnd();
	const preceding = trimmed.slice(0, trimmed.length - match.typedPrefixLength).trimEnd();
	return preceding.toLowerCase().endsWith(match.surface.toLowerCase());
};

/**
 * Dress a harvested match as a prediction so it commits through the same path as
 * a scored one.
 *
 * The scoring fields are zeroed rather than invented: there is no posterior, no
 * margin and no shortlist behind this surface, and `session-harvest` on the
 * evidence tier is what says so wherever the snapshot is read.
 */
const buildHarvestPrediction = (match: HarvestMatch): PredictionResult => ({
	evidenceDepth: { totalChars: 0, totalTokens: 0, verifiedChars: 0, verifiedTokens: 0 },
	evidenceTier: 'session-harvest',
	meanTokenLogProbability: 0,
	poolHeldExtension: false,
	posterior: 0,
	rankScore: 0,
	shortlistSize: 0,
	surface: match.surface,
	termType: 'word',
	text: match.ghostText,
	winnerMargin: 0,
});

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
	const surface = options?.surface ?? 'editor';
	const locale =
		options?.locale ?? (typeof navigator !== 'undefined' ? navigator.language : undefined);
	const isAutocompleteEnabled = isEnglishLocale(locale);
	const isInlineCodeHarvestEnabled = isAutocompleteEnabled && options?.harvestInlineCode === true;

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let decisionDeadlineTimer: ReturnType<typeof setTimeout> | null = null;
	let hasIngestedPage = false;
	let resolvedContext: AutocompleteContext | undefined;
	/**
	 * Kept in sync with the live EditorView so the async getContext() promise
	 * can re-trigger a slow-lane update the moment context arrives, even if the
	 * user has already typed several words before the promise resolved.
	 */
	let currentView: EditorView | null = null;
	let unsubscribeFromContextUpdates: (() => void) | undefined;
	// "Prime, don't ask-and-read": semantic, Tier-A, and Tier-B results land
	// asynchronously, often with no following keystroke. Re-run prediction when
	// they arrive so the caches are consumed immediately.
	let reschedulePredictionOnSlowLaneResult: ((signal: AsyncPredictionSignal) => void) | null = null;
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
	let decisionRevision = 0;
	let activeDecision: PredictionDecision | undefined;

	/**
	 * cold  → no slow-lane vector received yet; frequency-only trie scoring
	 * server → server slow-lane API returned the context vector
	 * localLlm → on-device WebGPU/MLC model returned the context vector
	 */
	const getCompletionSource = (): CompletionSource => {
		if (!slowLaneClient.getContextVector()) {
			return 'cold';
		}
		return options?.useLocalModel ? 'localLlm' : 'server';
	};

	/**
	 * Which path produced a given suggestion.
	 *
	 * A harvested surface is reported as `harvest` rather than by the slow-lane
	 * state it happened to be shown under, so its views and acceptances stay
	 * separable from the scored path's and cannot quietly move the headline
	 * acceptance rate.
	 */
	const completionSourceFor = (suggestion: CommittedSuggestion | null): CompletionSource =>
		suggestion?.evidenceTier === 'session-harvest' ? 'harvest' : getCompletionSource();

	const fireSuggestionDismissedAnalytics = (
		reason: 'escape' | 'blur' | 'click',
		suggestion: CommittedSuggestion | null,
	): void => {
		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.SUGGESTION_DISMISSED,
			actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
			eventType: EVENT_TYPE.TRACK,
			attributes: { completionSource: completionSourceFor(suggestion), reason, surface },
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
				surface,
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
				surface,
			},
		});
	};

	const fireSuggestionInsertedAnalytics = (suggestion: CommittedSuggestion): void => {
		const typedLength = Math.max(0, suggestion.surface.length - suggestion.ghostText.length);
		const suggestionLength = suggestion.surface.length;
		const kssDelta = suggestionLength - typedLength;

		api?.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.SUGGESTION_INSERTED,
			actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				completionSource: completionSourceFor(suggestion),
				suggestionLength,
				typedLength,
				kssDelta,
				surface,
			},
		});
	};

	const slowLaneClient = options?.useLocalModel
		? createLocalSlowLaneClient({
				debounceMs: LOCAL_SLOW_LANE_DEBOUNCE_MS,
				onLoadSuccess: fireLocalModelLoadedAnalytics,
				onLoadError: fireLocalModelLoadFailedAnalytics,
				// Re-run prediction for each independently scheduled model result.
				onUpdate: () => reschedulePredictionOnSlowLaneResult?.({ kind: 'semantic' }),
				onBoundaryLmUpdate: ({ contextKey, familyKey, latencyMs }) =>
					reschedulePredictionOnSlowLaneResult?.({
						contextKey,
						familyKey,
						kind: 'boundary',
						latencyMs,
					}),
				onSurfaceScoreUpdate: ({ contextKey, familyKey, latencyMs }) =>
					reschedulePredictionOnSlowLaneResult?.({
						contextKey,
						familyKey,
						kind: 'surface',
						latencyMs,
					}),
				surface,
			})
		: createSlowLaneClient({
				baseUrl: '',
				debounceMs: NETWORK_SLOW_LANE_DEBOUNCE_MS,
				// Re-run prediction when the BE semantic vector / LM logits land so
				// warm-mode unigram ranking applies without waiting for a keystroke.
				onUpdate: () => reschedulePredictionOnSlowLaneResult?.({ kind: 'semantic' }),
				surface,
			});
	const slowLaneClientKind: SlowLaneClientKind = options?.useLocalModel ? 'localLlm' : 'server';
	const slowLaneClientId = `${surface}:${slowLaneClientKind}:${++slowLaneClientInstanceSequence}`;
	setDefaultSlowLaneClient(slowLaneClient, {
		clientId: slowLaneClientId,
		kind: slowLaneClientKind,
	});
	const registeredSlowLaneStatus = getDefaultSlowLaneClientStatus();
	ctcTag(
		'init',
		`slow lane registered · id=${slowLaneClientId} · selected=${slowLaneClientKind} · canonical=${registeredSlowLaneStatus.canonicalScoringSupported ? 'yes' : 'no'} · ready=${registeredSlowLaneStatus.localModelReady ?? 'n/a'}`,
		slowLaneClientKind === 'localLlm' ? CTC_STYLES.good : CTC_STYLES.warn,
	);

	let contextRequestInFlight = false;
	// A read the host asked for while another was open, kept so it can be made
	// once that one settles. One slot, not a queue: a burst of notifications only
	// ever means "read again", and the last of them describes the current state.
	let queuedContextRefreshSource: string | undefined;
	let lastContextRefreshAt = 0;
	// Bounds the word-boundary retry loop so it terminates even when the editor is
	// not in a comment thread (parentCommentContent never resolves).
	let wordBoundaryRefreshAttempts = 0;
	// Set when the plugin is torn down so in-flight getContext() resolutions don't
	// mutate the global text-predictor state after destruction.
	let destroyed = false;
	// L1 ingestion cannot run before the vocabulary has loaded: `incrementSessionFreq`
	// only touches trie nodes that already exist, so an empty trie silently rejects
	// every word. Text that arrives first — which a page usually does, since the
	// chat resolves it on focus in the same tick as the load starts — is held here
	// and applied once the load has settled.
	const pendingSessionContextTexts = new Set<string>();
	const sessionIngestedContextTexts = new Set<string>();
	let isVocabularyReady = false;
	let vocabularyLoadPromise: Promise<void> | undefined;

	// Context text waiting on the harvester chunk, the vocabulary, or both. The
	// harvester drops surfaces the vocabulary already holds, so intake before the
	// load has settled would admit ordinary words no one needs completed.
	const pendingHarvestTexts = new Set<string>();
	// Separate from `sessionIngestedContextTexts` because the two consumers settle
	// at different times: reply occurrences accumulate, so text fed twice would
	// count twice.
	const harvestedContextTexts = new Set<string>();
	let inlineCodeHarvester: InlineCodeHarvesterModule | null = null;
	let inlineCodeHarvesterPromise: Promise<InlineCodeHarvesterModule | null> | undefined;

	const addBoundedContextText = (texts: Set<string>, text: string): void => {
		texts.add(text);
		// Evict oldest entries (Set preserves insertion order) to bound memory.
		while (texts.size > MAX_INGESTED_CONTEXT_TEXTS) {
			const oldest = texts.values().next().value;
			if (oldest === undefined) {
				break;
			}
			texts.delete(oldest);
		}
	};

	const flushPendingSessionContext = (): void => {
		if (!isVocabularyReady || destroyed) {
			return;
		}
		for (const text of pendingSessionContextTexts) {
			if (!sessionIngestedContextTexts.has(text)) {
				ingestDocumentPage(text);
				addBoundedContextText(sessionIngestedContextTexts, text);
			}
			pendingSessionContextTexts.delete(text);
		}
	};

	const flushPendingHarvestTexts = (): void => {
		const harvester = inlineCodeHarvester;
		if (!harvester || !isVocabularyReady || destroyed || pendingHarvestTexts.size === 0) {
			return;
		}
		for (const text of pendingHarvestTexts) {
			if (!harvestedContextTexts.has(text)) {
				harvester.harvestInlineCodeFromText(text);
				addBoundedContextText(harvestedContextTexts, text);
			}
			pendingHarvestTexts.delete(text);
		}
		harvester.logInlineCodeHarvest('context');
	};

	/**
	 * Load the harvester chunk, once, and only for a host that asked for it.
	 *
	 * Kept off the critical path in the same way the vocabulary and vector loads
	 * are: nothing is requested until the editor is focused, so a session that
	 * never types in the chat pays nothing for the feature.
	 */
	const ensureInlineCodeHarvester = (): Promise<InlineCodeHarvesterModule | null> => {
		if (!isInlineCodeHarvestEnabled || destroyed) {
			return Promise.resolve(null);
		}
		inlineCodeHarvesterPromise ??= import(
			/* webpackChunkName: "@atlaskit-internal_editor-plugin-autocomplete-inline-code-harvester" */
			'./inline-code-harvester'
		)
			.then((module) => {
				if (destroyed) {
					return null;
				}
				inlineCodeHarvester = module;
				loadedInlineCodeHarvester = module;
				flushPendingHarvestTexts();
				return module;
			})
			.catch((error) => {
				// Clear the promise so a later focus can retry; the queued text is
				// still held and is fed by whichever attempt succeeds.
				inlineCodeHarvesterPromise = undefined;
				logException(error as Error, {
					location: 'editor-plugin-autocomplete/loadInlineCodeHarvester',
				});
				return null;
			});
		return inlineCodeHarvesterPromise;
	};

	/**
	 * Re-read the document's code-marked spans.
	 *
	 * The backtick input rule consumes both delimiters on the closing tick, so a
	 * finished span in the live document is only findable through its mark — and
	 * only by walking, since a mark carries no notification.
	 */
	const harvestDocument = (doc: PMNode, trigger: string): void => {
		if (!isInlineCodeHarvestEnabled || destroyed) {
			return;
		}
		const harvester = inlineCodeHarvester;
		if (!harvester) {
			void ensureInlineCodeHarvester();
			return;
		}
		if (!isVocabularyReady) {
			return;
		}
		harvester.harvestInlineCodeFromDoc(doc);
		harvester.logInlineCodeHarvest(trigger);
	};

	const ensureVocabularyReady = (): Promise<void> => {
		if (isVocabularyReady) {
			flushPendingSessionContext();
			flushPendingHarvestTexts();
			return Promise.resolve();
		}
		vocabularyLoadPromise ??= loadDefaultVocabulary({
			isLocalLLM: options?.useLocalModel ?? false,
			surface,
		})
			.then(() => {
				if (destroyed) {
					return;
				}
				isVocabularyReady = true;
				flushPendingSessionContext();
				flushPendingHarvestTexts();
			})
			.catch((error) => {
				// Do not consume the pending text on failure. A later focus retries the
				// load and can still apply the original context exactly once.
				vocabularyLoadPromise = undefined;
				logException(error as Error, {
					location: 'editor-plugin-autocomplete/loadDefaultVocabulary',
				});
			});
		return vocabularyLoadPromise;
	};

	const logContextResolved = (source: string, context?: AutocompleteContext): void => {
		if (!isAutocompleteDebugEnabled()) {
			return;
		}

		// eslint-disable-next-line no-console
		console.log('%c[CTC:signal]%c getContext resolved', CTC_STYLES.brand, CTC_STYLES.body, {
			source,
			scope: context?.contextScopeKey,
			hasParentComment: !!context?.parentCommentContent,
			parentCommentPreview: context?.parentCommentContent?.slice(0, 80),
			siblingCount: context?.siblingCommentsContents?.length ?? 0,
			hasFullPage: !!context?.fullPageContent,
		});
	};

	const ingestContextText = (text?: string): void => {
		if (!text) {
			return;
		}

		if (!sessionIngestedContextTexts.has(text)) {
			addBoundedContextText(pendingSessionContextTexts, text);
		}
		// Queued unconditionally rather than only once the chunk is present:
		// context usually resolves in the same tick the load starts, and text
		// dropped for arriving early is a reply that can never be harvested.
		if (isInlineCodeHarvestEnabled && !harvestedContextTexts.has(text)) {
			addBoundedContextText(pendingHarvestTexts, text);
		}
	};

	const ingestResolvedContext = (): void => {
		ingestContextText(resolvedContext?.fullPageContent);
		ingestContextText(resolvedContext?.parentCommentContent);
		for (const siblingCommentContent of resolvedContext?.siblingCommentsContents ?? []) {
			ingestContextText(siblingCommentContent);
		}
		flushPendingSessionContext();
		flushPendingHarvestTexts();
	};

	/**
	 * Put back what this editor had contributed to the pot another editor just
	 * emptied.
	 *
	 * The scope that ended belongs to the host that reported it, not to everyone
	 * sharing these globals. Without this an editor alongside it — a comment box
	 * under a chat panel that switched conversation — is left with none of its
	 * learning and no way back to it: the dedupe sets below are per editor, so
	 * its own page reads as already ingested and is skipped from then on.
	 *
	 * Nothing is re-fetched. The context this editor resolved is still held, and
	 * what it describes has not changed just because another host moved on.
	 *
	 * Only for an editor that reported no scope. One that did is party to the
	 * same scope system and the scope just dropped may well be its own: a
	 * Confluence page transition mounts the incoming editor before tearing down
	 * the outgoing one, and the outgoing one is still holding the page that was
	 * left. Putting that back is exactly what the eviction was for.
	 */
	const reprimeSessionLearning = (): void => {
		if (destroyed || resolvedContext?.contextScopeKey !== undefined) {
			return;
		}
		pendingSessionContextTexts.clear();
		sessionIngestedContextTexts.clear();
		pendingHarvestTexts.clear();
		harvestedContextTexts.clear();
		ingestResolvedContext();
		if (currentView) {
			harvestDocument(currentView.state.doc, 'reprime');
		}
	};

	/**
	 * Drop everything learned for the scope that just ended.
	 *
	 * Both stores are claims about what is being discussed, and neither survives
	 * the discussion changing: L1 boosts would keep a page's words ranked above
	 * the next page's, and the harvested set holds one conversation's content.
	 * The dedupe sets go too, so the context that arrives next is treated as
	 * unseen and re-primes both — which is what makes this safe to do on a page
	 * change, since the transcript is re-ingested along with the new page.
	 *
	 * The stores are shared, so every other mounted editor is put back in the
	 * same tick from context it already holds. Only the scope that ended is
	 * actually dropped.
	 */
	const resetSessionScopedLearning = (reason: string): void => {
		resetSessionBoosts();
		loadedInlineCodeHarvester?.resetInlineCodeHarvest();
		resolvedContext = undefined;
		pendingSessionContextTexts.clear();
		sessionIngestedContextTexts.clear();
		pendingHarvestTexts.clear();
		harvestedContextTexts.clear();
		ctcTag('init', `session-scoped learning reset · ${reason}`, CTC_STYLES.dim);
		for (const reprimeOther of mountedEditors) {
			if (reprimeOther !== reprimeSessionLearning) {
				reprimeOther();
			}
		}
	};

	const applyContext = (context: AutocompleteContext): void => {
		// A host that scopes its context tells us which scope each read belongs to.
		// A read with no recorded key to compare against only records: that is the
		// first since the last editor went away, so there is nothing left to throw
		// away and resetting would drop the priming focus just started. A read from
		// a newly mounted editor is not that case — the key outlives the editor
		// precisely so a host that remounts across a navigation still evicts.
		if (context.contextScopeKey !== undefined && context.contextScopeKey !== contextScopeKey) {
			if (contextScopeKey !== undefined) {
				resetSessionScopedLearning(`scope ${contextScopeKey} → ${context.contextScopeKey}`);
			}
			contextScopeKey = context.contextScopeKey;
		}

		// Merge rather than replace: the word-boundary retry may resolve only a
		// late-arriving field (e.g. parentCommentContent) without re-sending
		// fullPageContent, so replacing would drop previously resolved context.
		// Strip undefined values first so a field explicitly set to undefined by
		// getContext doesn't overwrite a previously resolved value.
		const definedContext = Object.fromEntries(
			Object.entries(context).filter(([, value]) => value !== undefined),
		);
		resolvedContext = { ...resolvedContext, ...definedContext };

		ingestResolvedContext();

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
		if (!options?.getContext) {
			return false;
		}

		if (contextRequestInFlight) {
			// Only the reads that bypass the throttle are worth keeping: those are
			// the ones the host asked for by name, and a scope change travels among
			// them with no second channel to arrive on, so losing one would strand
			// the eviction until something else happened to move. A word-boundary
			// poll is a retry loop for context that has not landed yet, and the read
			// already open will bring it.
			if (!allowThrottle) {
				queuedContextRefreshSource = source;
			}
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
				const queuedSource = queuedContextRefreshSource;
				queuedContextRefreshSource = undefined;
				if (queuedSource !== undefined && !destroyed) {
					refreshContext({ source: queuedSource, allowThrottle: false });
				}
			});

		return true;
	};

	const clearDecisionTimers = (): void => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		if (decisionDeadlineTimer) {
			clearTimeout(decisionDeadlineTimer);
			decisionDeadlineTimer = null;
		}
	};

	const cancelActiveDecision = (): void => {
		clearDecisionTimers();
		activeDecision = undefined;
	};

	const isDecisionSnapshotCurrent = (view: EditorView, decision: PredictionDecision): boolean => {
		const { state } = view;
		return (
			state.selection.empty &&
			state.selection.from === decision.position &&
			getTextBeforeCursor(state) === decision.textBefore
		);
	};

	const isDecisionCurrent = (view: EditorView, decision: PredictionDecision): boolean =>
		activeDecision?.revision === decision.revision && isDecisionSnapshotCurrent(view, decision);

	const expireActiveDecision = (decision: PredictionDecision): void => {
		if (activeDecision?.revision !== decision.revision) {
			return;
		}

		cancelActiveDecision();
	};

	/**
	 * Offer a harvested inline-code surface on a prefix the scored path left
	 * empty. Returns whether one was committed.
	 */
	const commitHarvestedSuggestion = (view: EditorView, decision: PredictionDecision): boolean => {
		const harvester = inlineCodeHarvester;
		if (!harvester || !isInlineCodeHarvestEnabled) {
			return false;
		}
		if (!scoredPathFinishedEmpty(decision.textBefore)) {
			return false;
		}

		const typedPrefix = getTrailingSurfaceToken(decision.textBefore);
		const match = harvester.findHarvestedCompletion(typedPrefix);
		if (!match) {
			return false;
		}
		if (
			isSurfaceInAcceptCooldown(match.surface) ||
			repeatsPrecedingText(match, decision.textBefore)
		) {
			return false;
		}

		const suggestion = showGhostText(
			view,
			buildHarvestPrediction(match),
			decision.position,
			decision.revision,
			decision.startedAt,
			match.typedPrefixLength,
		);
		if (!suggestion) {
			return false;
		}

		cancelActiveDecision();
		ctcTag(
			'harvest',
			`offered "${match.surface}" for "${typedPrefix}" · ${match.collapsedBy} · ${match.replyOccurrences} reply / ${match.documentSpans} doc sightings${
				match.rivalSurfaces.length > 0 ? ` · over ${match.rivalSurfaces.join(', ')}` : ''
			}`,
			CTC_STYLES.lm,
		);
		if (suggestion.ghostText !== lastShownGhostText) {
			lastShownGhostText = suggestion.ghostText;
			api?.analytics?.actions.fireAnalyticsEvent({
				action: ACTION.SUGGESTION_VIEWED,
				actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
				eventType: EVENT_TYPE.TRACK,
				attributes: { completionSource: completionSourceFor(suggestion), surface },
			});
		}
		return true;
	};

	const evaluateActiveDecision = (view: EditorView, revision: number): void => {
		const decision = activeDecision;
		if (!decision || decision.revision !== revision || !isDecisionCurrent(view, decision)) {
			return;
		}

		if (performance.now() > decision.deadlineAt) {
			expireActiveDecision(decision);
			return;
		}
		decision.evaluations++;

		try {
			const { state } = view;
			const { selection } = state;

			// Suppress suggestions when the cursor is mid-word — only offer
			// completions when the cursor is at the trailing edge of a token.
			const nodeAfter = selection.$from.nodeAfter;
			const charAfterCursor = nodeAfter?.isText
				? getLeadingTextCharacter(nodeAfter.text)
				: undefined;
			if (charAfterCursor && isMidWordCharacter(charAfterCursor)) {
				cancelActiveDecision();
				return;
			}

			if (decision.textBefore === dismissedContext) {
				cancelActiveDecision();
				return;
			}
			dismissedContext = null;

			// Two characters are enough to prefetch the canonical shortlist. The
			// predictor itself withholds display until the three-character gate.
			if (decision.textBefore.trim().length < 2) {
				cancelActiveDecision();
				return;
			}

			const prediction = predict(decision.textBefore);
			if (!prediction || prediction.text.length === 0) {
				// Only where the scored path has finished and come away with nothing
				// does a harvested surface get to answer; otherwise remain in
				// `collecting` until an async signal arrives or the hard deadline
				// expires. We never display a provisional fallback.
				commitHarvestedSuggestion(view, decision);
				return;
			}

			const readyAtMs = performance.now() - decision.startedAt;
			if (readyAtMs > GHOST_DECISION_BUDGET_MS) {
				cancelActiveDecision();
				if (isAutocompleteDebugEnabled()) {
					// eslint-disable-next-line no-console
					console.log(
						'%c[CTC:budget]%c fully gated after render deadline (render suppressed)',
						CTC_STYLES.section,
						CTC_STYLES.body,
						{
							revision: decision.revision,
							readyAtMs,
							surface: prediction.surface,
						},
					);
				}
				return;
			}

			const suggestion = showGhostText(
				view,
				prediction,
				decision.position,
				decision.revision,
				decision.startedAt,
			);
			if (!suggestion) {
				cancelActiveDecision();
				return;
			}

			cancelActiveDecision();
			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log(
					'%c[CTC:decision]%c committed immutable ghost',
					CTC_STYLES.brand,
					CTC_STYLES.body,
					{
						revision: suggestion.revision,
						surface: suggestion.surface,
						ghostText: suggestion.ghostText,
						evidenceTier: suggestion.evidenceTier,
						rankScore: suggestion.rankScore,
						winnerMargin: suggestion.winnerMargin,
						decisionLatencyMs: suggestion.decisionLatencyMs,
						budgetMs: GHOST_DECISION_BUDGET_MS,
						typedPrefixLength: getTrailingSurfacePrefixLength(decision.textBefore),
						evaluations: decision.evaluations,
						asyncSignals: decision.asyncSignals,
						readyWithinBudget: suggestion.decisionLatencyMs <= GHOST_DECISION_BUDGET_MS,
					},
				);
			}
			if (suggestion.ghostText !== lastShownGhostText) {
				lastShownGhostText = suggestion.ghostText;
				api?.analytics?.actions.fireAnalyticsEvent({
					action: ACTION.SUGGESTION_VIEWED,
					actionSubject: ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
					eventType: EVENT_TYPE.TRACK,
					attributes: { completionSource: completionSourceFor(suggestion), surface },
				});
			}
		} catch (error) {
			cancelActiveDecision();
			logException(error as Error, {
				location: 'editor-plugin-autocomplete/evaluateActiveDecision',
			});
		}
	};

	const beginPredictionDecision = (view: EditorView): void => {
		cancelActiveDecision();
		const { state } = view;
		if (!state.selection.empty) {
			return;
		}

		const startedAt = performance.now();
		const textBefore = getTextBeforeCursor(state);
		const revision = ++decisionRevision;
		activeDecision = {
			asyncSignals: 0,
			deadlineAt: startedAt + GHOST_DECISION_BUDGET_MS,
			evaluations: 0,
			position: state.selection.from,
			revision,
			startedAt,
			textBefore,
		};
		if (isAutocompleteDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.log('%c[CTC:decision]%c collecting', CTC_STYLES.brand, CTC_STYLES.body, {
				revision,
				budgetMs: GHOST_DECISION_BUDGET_MS,
				coalesceMs: PREDICTION_COALESCE_MS,
				typedPrefixLength: getTrailingSurfacePrefixLength(activeDecision.textBefore),
				textBefore: activeDecision.textBefore.slice(-80),
			});
		}

		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			evaluateActiveDecision(view, revision);
		}, PREDICTION_COALESCE_MS);
		decisionDeadlineTimer = setTimeout(() => {
			decisionDeadlineTimer = null;
			if (activeDecision?.revision === revision) {
				const expiredDecision = activeDecision;
				if (isAutocompleteDebugEnabled()) {
					const elapsedMs = performance.now() - expiredDecision.startedAt;
					const predictionDebug = getLastPredictionDebug();
					const matchingPredictionDebug =
						predictionDebug?.textBefore === expiredDecision.textBefore ? predictionDebug : null;
					const abstentionPrefix = '— abstain: ';
					const predictorDecision = matchingPredictionDebug?.decision;
					const predictorReason = predictorDecision?.startsWith(abstentionPrefix)
						? predictorDecision.slice(abstentionPrefix.length)
						: predictorDecision;
					const decisionMessage =
						predictorReason && !matchingPredictionDebug?.awaitingAsyncEvidence
							? `abstain: ${predictorReason}`
							: `abstain: ${GHOST_DECISION_BUDGET_MS}ms decision budget expired${predictorReason ? ` · ${predictorReason}` : ''}`;
					// eslint-disable-next-line no-console
					console.log(`%c[CTC:decision]%c ${decisionMessage}`, CTC_STYLES.brand, CTC_STYLES.body, {
						revision,
						budgetMs: GHOST_DECISION_BUDGET_MS,
						elapsedMs,
						typedPrefixLength: getTrailingSurfacePrefixLength(expiredDecision.textBefore),
						evaluations: expiredDecision.evaluations,
						asyncSignals: expiredDecision.asyncSignals,
						textBefore: expiredDecision.textBefore.slice(-80),
						predictorDecision: predictorReason ?? null,
					});
				}
				expireActiveDecision(expiredDecision);
			}
		}, GHOST_DECISION_BUDGET_MS);
	};

	// Async semantic/canonical results may complete the active decision, but they
	// never create a new decision or replace an already committed ghost.
	reschedulePredictionOnSlowLaneResult = (signal) => {
		if (destroyed || !currentView) {
			return;
		}
		if (!activeDecision) {
			return;
		}
		const revision = activeDecision.revision;
		const elapsedMs = performance.now() - activeDecision.startedAt;
		const remainingMs = activeDecision.deadlineAt - performance.now();
		if (remainingMs < 0) {
			const expiredDecision = activeDecision;
			expireActiveDecision(expiredDecision);
			return;
		}

		activeDecision.asyncSignals++;
		if (isAutocompleteDebugVerbose()) {
			// eslint-disable-next-line no-console
			console.log(
				'%c[CTC:readiness]%c async evidence signal',
				CTC_STYLES.section,
				CTC_STYLES.body,
				{
					...signal,
					revision,
					elapsedMs,
					remainingMs: Math.max(0, remainingMs),
					typedPrefixLength: getTrailingSurfacePrefixLength(activeDecision.textBefore),
					withinBudget: remainingMs >= 0,
				},
			);
		}
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			if (currentView) {
				evaluateActiveDecision(currentView, revision);
			}
		}, 0);
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

				// A new prediction is scheduled from view.update either way; the
				// surviving ghost only covers the gap until it commits.
				if (tr.docChanged) {
					return advanceGhostThroughTypedCharacter(tr, pluginState) ?? clearGhostState(pluginState);
				}

				if (tr.selectionSet && pluginState.ghostText) {
					return clearGhostState(pluginState);
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
					return acceptGhostTextWithAnalytics(state, dispatch, (suggestion) => {
						justAccepted = true;
						lastShownGhostText = '';
						cancelActiveDecision();
						fireSuggestionInsertedAnalytics(suggestion);
					});
				},
				ArrowRight: (state: EditorState, dispatch?: (tr: Transaction) => void) => {
					return acceptGhostTextWithAnalytics(state, dispatch, (suggestion) => {
						justAccepted = true;
						lastShownGhostText = '';
						cancelActiveDecision();
						fireSuggestionInsertedAnalytics(suggestion);
					});
				},
				Escape: (state: EditorState, dispatch?: (tr: Transaction) => void) => {
					const dismissed = (
						autocompletePluginKey.getState(state) as AutocompletePluginState | undefined
					)?.suggestion;
					const didClear = clearGhostText(state, dispatch);
					if (didClear) {
						cancelActiveDecision();
						dismissedContext = getTextBeforeCursor(state);
						fireSuggestionDismissedAnalytics('escape', dismissed ?? null);
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
						cancelActiveDecision();
						fireSuggestionDismissedAnalytics('blur', pluginState.suggestion);
					}
					return false;
				},
				mousedown: (view: EditorView, event: MouseEvent) => {
					if (!isAutocompleteEnabled || !(event.target instanceof Element)) {
						return false;
					}

					if (!event.target.closest('[data-autocomplete-ghost="true"]')) {
						const dismissed = (
							autocompletePluginKey.getState(view.state) as AutocompletePluginState | undefined
						)?.suggestion;
						const didClear = clearGhostText(view.state, view.dispatch);
						if (didClear) {
							cancelActiveDecision();
							dismissedContext = getTextBeforeCursor(view.state);
							lastShownGhostText = '';
							fireSuggestionDismissedAnalytics('click', dismissed ?? null);
						}
						return false;
					}

					event.preventDefault();

					const accepted = acceptGhostTextWithAnalytics(view.state, view.dispatch, (suggestion) => {
						justAccepted = true;
						lastShownGhostText = '';
						cancelActiveDecision();
						fireSuggestionInsertedAnalytics(suggestion);
					});

					if (accepted) {
						view.focus();
					}

					return accepted;
				},
				focus: (view: EditorView) => {
					if (!isAutocompleteEnabled) {
						return false;
					}

					void ensureVocabularyReady();
					// First point at which the session is known to be using the input,
					// which is where the rest of the artifacts are requested too.
					void ensureInlineCodeHarvester()
						.then(() => harvestDocument(view.state.doc, 'focus'))
						.catch((error) => {
							logException(error as Error, {
								location: 'editor-plugin-autocomplete/harvestDocument',
							});
						});
					loadVectorsAsync({
						isLocalLLM: options?.useLocalModel ?? false,
						surface,
					}).catch((error) => {
						logException(error as Error, {
							location: 'editor-plugin-autocomplete/loadVectorsAsync',
						});
					});
					loadGrammarDataAsync({
						isLocalLLM: options?.useLocalModel ?? false,
						surface,
					}).catch((error) => {
						logException(error as Error, {
							location: 'editor-plugin-autocomplete/loadGrammarDataAsync',
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
			mountedEditors.add(reprimeSessionLearning);

			// Push channel for hosts that keep producing context after mount (e.g. Rovo chat).
			if (isAutocompleteEnabled && options?.subscribeToContextUpdates) {
				unsubscribeFromContextUpdates = options.subscribeToContextUpdates(() => {
					// Bypass throttle for freshness; a read still open defers this one
					// rather than overlapping it.
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

							cancelActiveDecision();
							return;
						}

						maybeUpdateSessionFrequency(view, prevState);

						const textBefore = getTextBeforeCursor(view.state);
						if (isWordBoundary(textBefore)) {
							slowLaneClient.updateContext(
								buildSlowLaneText(view.state.doc.textContent, resolvedContext),
							);

							// The backtick input rule has fired by the time a span is
							// finished, so a word boundary is the earliest point the mark
							// exists to be found.
							harvestDocument(view.state.doc, 'word-boundary');

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

						beginPredictionDecision(view);
					} else if (!prevState.selection.eq(view.state.selection)) {
						cancelActiveDecision();
					}
				},
				destroy: () => {
					destroyed = true;
					currentView = null;
					unsubscribeFromContextUpdates?.();
					unsubscribeFromContextUpdates = undefined;
					cancelActiveDecision();
					const releasedDefaultClient = clearDefaultSlowLaneClient(slowLaneClient);
					ctcTag(
						'init',
						`slow lane teardown · id=${slowLaneClientId} · default=${releasedDefaultClient ? 'released' : 'retained newer owner'}`,
						releasedDefaultClient ? CTC_STYLES.dim : CTC_STYLES.warn,
					);
					if (hasDestroy(slowLaneClient)) {
						slowLaneClient.destroy();
					}
					queuedContextRefreshSource = undefined;
					pendingSessionContextTexts.clear();
					sessionIngestedContextTexts.clear();
					pendingHarvestTexts.clear();
					harvestedContextTexts.clear();
					// The harvested set holds one conversation's user and assistant
					// content, and the L1 boosts describe what that conversation was
					// about. Both live at module scope, so they have to be emptied here
					// or they leak into whichever editor mounts next — but only once no
					// editor is left to be using them. The scope key goes with them, and
					// only with them: clearing it while another editor is still mounted
					// would leave that editor's next read looking like a first one, with
					// nothing to compare against and everything still loaded.
					mountedEditors.delete(reprimeSessionLearning);
					if (mountedEditors.size === 0) {
						loadedInlineCodeHarvester?.resetInlineCodeHarvest();
						// Only for a host that scopes its context, which is the one asking
						// for its learning to end with the conversation. A host that sends
						// no scope has boosts belonging to the page it is on, and that page
						// outlives an editor being unmounted — a Confluence comment box is
						// closed far more often than the page under it changes.
						if (contextScopeKey !== undefined) {
							resetSessionBoosts();
							contextScopeKey = undefined;
						}
					}
					inlineCodeHarvester = null;
					inlineCodeHarvesterPromise = undefined;
				},
			};
		},
	});
};
