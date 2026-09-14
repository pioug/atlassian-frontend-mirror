/**
 * Fast Lane Predictor: Local autocomplete using weighted trie + frequency + semantic scoring.
 *
 * Two prediction modes:
 *   1. Word boundary → bigram-based next-word suggestion (grammar-filtered)
 *   2. Mid-word (≥1 char) → grouped prefetch; ≥3 chars + exact evidence → ghost result
 *
 * Scoring is delegated to scoring-pipeline.ts which handles:
 *   Stage 1 (semantic + frequency), grammar filter, Stage 2 (optional LM re-ranking).
 *
 * Context vector: average of word vectors from text before cursor (last N words).
 * Falls back to cold mode (freq-only) when vectors not yet loaded.
 *
 * Session personalization (L1): words the user types are incrementally boosted
 * via incrementSessionFreq(), called on word boundaries from the plugin, and
 * words in ingested context text via ingestDocumentPage(). What the session has
 * boosted is visible at any time from the console: `__atlCtcDebug__.session()`,
 * or `__atlCtcDebug__.session('poll')` for one family — see inspectSessionBoosts.
 */

import { EXPERIENCE_NAME, failExp, startExp, succeedExp } from '../analytics/ufo';

import { fetchAutocompleteArtifactBinary, fetchAutocompleteArtifactJson } from './artifact-loader';
import { ARTIFACT_NAME, type ArtifactName } from './artifacts-manifest';
import {
	createCanonicalContextPositionCache,
	deriveCanonicalCandidateContext,
	deriveWhitespaceBoundaryContext,
	logSoftmaxAt,
	logSumExp,
	selectBoundaryPrimeRequests,
	type CanonicalCandidateContext,
	type CanonicalLmEvidence,
} from './canonical-lm-scoring';
import {
	CTC_STYLES,
	ctcSection,
	ctcTag,
	isAutocompleteDebugEnabled,
	isAutocompleteDebugVerbose,
	registerCtcSessionInspector,
} from './debug-mode';
import {
	loadGrammarDataAsync,
	rankCandidates,
	STAGE1_WEIGHT,
	STAGE2_WEIGHT,
	MIN_STAGE1_SCORE,
	MIN_WINNER_MARGIN,
} from './scoring-pipeline';
import type { ScoringCandidate, ScoredCandidate, TermType } from './scoring-pipeline';
import {
	getBoundaryLmState,
	getCanonicalSurfaceCount,
	getCanonicalSurfaceTokenIds,
	getDefaultSlowLaneClientStatus,
	getProgressiveSurfaceEvidence,
	getStoredContextInput,
	getStoredContextVector,
	getStoredLmLogits,
	getSurfaceScore,
	isCanonicalSurfaceScoringSupported,
	primeBoundaryLm,
	requestProgressiveSurfaceScores,
} from './slow-lane-client';

// ─── Constants ───────────────────────────────────────────────────────────────

// eslint-disable-next-line require-unicode-regexp
const PUNCTUATION_BOUNDARY_REGEX = /^[.,;:!?()\[\]{}"'`]+|[.,;:!?()\[\]{}"'`]+$/g;
// eslint-disable-next-line require-unicode-regexp
const WHITESPACE_SPLIT_REGEX = /\s+/;
// eslint-disable-next-line require-unicode-regexp
const SENTENCE_BOUNDARY_REGEX = /[\n.?!]+/;
// eslint-disable-next-line require-unicode-regexp
const TRAILING_WHITESPACE_REGEX = /\s$/;
const TRAILING_SURFACE_TOKEN_REGEX = /[\p{L}\p{N}_'-]+$/u;
const SURFACE_TOKEN_REGEX = /[\p{L}\p{N}_'-]+/gu;
const ONLY_WHITESPACE_REGEX = /^\s+$/u;

const UNIGRAM_PREFETCH_MIN_PREFIX_LENGTH = 1;
const MULTIWORD_PREFETCH_MIN_PREFIX_LENGTH = 1;
const DISPLAY_MIN_PREFIX_LENGTH = 3;
const MAX_CANDIDATES = 200;
const CONTEXT_WORDS = 10;
const L3_BASELINE_FREQ = 0.001;
// Max tokens in a completion term (bigram=2, phrase=3). Mirrors the producer's
// `phrase_max_words` default so the FE window never exceeds what was mined.
const PHRASE_MAX_WORDS = 3;
// Per-window cap on phrase-trie subtree collection (keeps the hot path bounded).
const MAX_PHRASE_CANDIDATES = 50;
/**
 * Share of its context shortlist's probability mass the model must put on a
 * surface before that surface may be shown.
 *
 * Candidates competing at the same boundary are normalised into a posterior
 * over that shortlist, so this reads directly as "the model is at least this
 * sure". Measuring distance from the best candidate instead cannot express
 * being unsure: the leader scores full marks whether it won by a nose or a
 * mile, which pushes the entire question of how contested a context is onto
 * `MIN_WINNER_MARGIN` — and there the blended score's only remaining spread is
 * the corpus prior, the weakest ranking signal we have.
 *
 * Each extra token raises the bar. A wrong multi-word ghost costs the reader
 * more to notice and undo than a wrong single word, and it is offered from the
 * same keystroke, so precision has to be bought per token of commitment.
 */
const MIN_LM_POSTERIOR: Record<TermType, number> = {
	word: 0.5,
	bigram: 0.6,
	phrase: 0.7,
};
/**
 * How many scored candidates a context must hold before its leader may show.
 *
 * A posterior is a share of a shortlist, so a shortlist of one hands its only
 * member 1.0 whatever the model thinks of it — `logSumExp` of a single value
 * returns that value. Such a ghost sits in the top bucket without having beaten
 * anything, and it is the gate's blind spot rather than a case the gate ruled
 * on: 1 in 14 of them were accepted against 34% for word ghosts overall, and
 * every phrase shown through this hole was rejected.
 *
 * Counted over pool membership rather than over the normaliser, because those
 * two deliberately differ. Where a pool holds a surface and its own extension
 * the chain rule leaves one term in the denominator, and the resulting 1.0 is
 * earned — whichever the user meant, the shorter form is a correct ghost.
 *
 * Waived where the context never held a second candidate at all. The 1-in-14
 * acceptance above was measured over a population dominated by pools that read
 * as one because rivals had not come back, and it is that absence of evidence
 * the floor is for. A vocabulary offering a single continuation of a long
 * distinctive prefix is the opposite situation, and it is also where a ghost
 * saves the most keystrokes, so refusing it spends the most to learn the least.
 */
const MIN_SCORED_POOL_SIZE = 2;
/**
 * Mean per-token log-probability a surface must hold, in nats, independently of
 * anything it was competing against.
 *
 * Every other display test is relative: a posterior is a share of a shortlist,
 * and a winner margin is a distance from a rival. So a surface reaches the
 * screen by being the best of what happened to be in its pool, and nothing ever
 * asks whether the model finds it plausible at all. That gap was tolerable while
 * little was being read, and stopped being tolerable once the scheduler started
 * reading roughly twice as much per decision: shown-per-decision went from 3.2%
 * to 7.4% with no threshold moved, and acceptance of what showed fell from 32%
 * to 24.5%. More reading does not weaken a relative test — it hands it far more
 * pools to be the winner of, and the marginal winner is worse than the average.
 *
 * Set at the point where a uniform distribution over the model's vocabulary
 * sits: 49,152 tokens, so `ln(1/49152)` is about -10.8 nats. Below it the model
 * assigns the surface less mass than a token drawn at random, which is the only
 * statement about a surface that needs no reference to what it competed with.
 *
 * It was first tried at -8, chosen from the bucket where acceptance was measured
 * to fall away, and that reasoning does not survive more data. Acceptance against
 * this quantity turned out to be a smooth slope — about 19% below -8, 26% from -8
 * to -6, then flat near 35% above - with no discontinuity to place a threshold
 * at. A floor on a smooth slope is a coverage dial rather than a test: -8 removed
 * a band converting at 26% and cost 3.7 points of show rate, for an acceptance
 * movement no sample of this size can resolve. Anchoring to uniform instead makes
 * the value an argument about what is indefensible rather than a point picked off
 * a histogram, which is what stops it from being retuned every batch.
 *
 * Applied to the mean over the verified prefix, the same quantity
 * `ghostsByMeanLogProb` buckets, and deliberately not to
 * `meanTokenLogProbabilityUpperBound`. The bound is the right instrument for
 * keeping a candidate in the race, where dropping something that could still
 * clear the bar would be an error, but it is systematically higher than the
 * quantity acceptance is measured against. Judging a surface on the prefix that
 * was actually read is also what every other test here does.
 *
 * One value across all three shapes. Splitting it per shape needs an acceptance
 * curve per shape, and 19 bigrams and 1 phrase across five sessions cannot
 * support one.
 */
const MIN_MEAN_TOKEN_LOG_PROBABILITY = -10.8;
// Tab replaces the whole remaining suffix, so an N-character completion saves
// N-1 keystrokes: at one character it saves nothing at all and at two it saves
// one, which does not repay noticing the ghost and reaching for Tab. Offering
// them anyway spends the acceptance-rate denominator on completions nobody
// wants and teaches the user to stop reading ghosts. `DISPLAY_MIN_PREFIX_LENGTH`
// is the same guard on the side the user has already typed.
const MIN_SUGGESTION_LENGTH = 3;
/**
 * How many leading tokens of a surface must be scored before it may be shown.
 *
 * Scoring a token costs one model round trip, and a round trip costs about the
 * same no matter how much is in it, so the price of a candidate is its token
 * count. Demanding every token therefore caps what can ever reach the screen at
 * roughly two tokens inside the decision budget — which is why no phrase has
 * ever been displayed. Verifying a fixed prefix makes the cost of a candidate
 * independent of its length.
 */
const REQUIRED_VERIFIED_TOKENS = 2;
/**
 * Extra winner margin demanded of a surface judged on a verified prefix rather
 * than on every one of its tokens, to buy back the precision given up by
 * leaving the tail unread.
 */
const PARTIAL_EVIDENCE_MARGIN_PREMIUM = 0.08;
const ARBITRATION_MODE = 'confidence-v2';
const DEBUG_TEXT_TAIL_CHARS = 120;

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Which constraint stopped an evaluation from putting a ghost on screen.
 *
 * Each one implies different work: `below-posterior-gate` is a threshold to
 * calibrate, `winner-margin` is two candidates the model cannot separate,
 * `cold-competitor` and `unresolved-rival` are scheduling, and `no-candidate`
 * is vocabulary coverage.
 */
export type CtcAbstainReason =
	| 'below-posterior-gate'
	| 'cold-competitor'
	| 'empty-completion'
	| 'implausible-surface'
	| 'lone-candidate'
	| 'missing-artifact'
	| 'no-candidate'
	| 'no-evidence'
	| 'no-surface-token'
	| 'not-initialized'
	| 'prefetch'
	| 'short-completion'
	| 'unresolved-rival'
	| 'winner-margin';

/**
 * What the scored path concluded, recorded on every evaluation whether or not
 * debug is on.
 *
 * This exists for the inline-code harvester, which may only offer a harvested
 * surface once the scored path has finished and come away empty. The reason is
 * the load-bearing part: `no-candidate` means no vocabulary reaches this prefix
 * at all, while `winner-margin` means two known words the model cannot yet
 * separate — the first is a gap worth filling and the second is a prefix
 * ambiguous enough that filling it would be a guess.
 */
export interface PredictionOutcome {
	abstainReason: CtcAbstainReason | null;
	/** True while a pending async signal could still change the verdict. */
	awaitingAsyncEvidence: boolean;
	/** How many vocabulary candidates were scored for this prefix. */
	scoredCandidateCount: number;
	/** The exact string passed to `predict`, so a caller can confirm identity. */
	textBefore: string;
}

interface Candidate {
	node: TrieNode;
	word: string;
}

/**
 * A candidate paired with the length of the already-typed prefix it completes.
 * For a single word this is the current partial token length; for a phrase it
 * is the length of the matched multi-word window (previous words + partial),
 * so the ghost tail is `word.slice(matchedPrefixLen)`.
 */
interface MatchedCandidate {
	matchedPrefixLen: number;
	node: TrieNode;
	surfaceStart: number;
	word: string;
}

interface CanonicalMatchedCandidate extends MatchedCandidate, CanonicalCandidateContext {}

export interface WeightedTerm {
	authorFreq: number;
	docFreq: number;
	freq: number;
	word: string;
}

export interface TenantVocabulary {
	terms: WeightedTerm[];
}

/** Optional per-term metadata carried by bigram/phrase completion terms. */
interface TermMeta {
	association?: number | null;
	headPos?: string | null;
	posSeq?: string[] | null;
	termType?: TermType;
}

interface VectorStore {
	dim: number;
	float32: Float32Array;
	wordIndex: Record<string, number>;
}

class TrieNode {
	children: Map<string, TrieNode> = new Map();
	word: string | null = null;
	tenantFreq: number = 0;
	docFreq: number = 0;
	authorFreq: number = 0;
	sessionFreq: number = 0;
	// Term-type + phrase metadata. Plain words keep `termType='word'` and null
	// metadata; bigram/phrase nodes carry the producer-shipped POS + association.
	termType: TermType = 'word';
	posSeq: string[] | null = null;
	headPos: string | null = null;
	association: number | null = null;
}

class WeightedWordTrie {
	private root = new TrieNode();
	/**
	 * Every node a session boost has been written to.
	 *
	 * Kept because dropping the boosts is no longer a rare event — it happens
	 * each time the reader changes page or conversation — and walking a vocabulary
	 * of tens of thousands of words to find the few hundred that were touched
	 * costs about 10ms of main thread every time. The two writers below are the
	 * only way a `sessionFreq` moves, so keeping this in step costs one Set
	 * insertion on a path that is already descending the trie.
	 */
	private boostedNodes = new Set<TrieNode>();
	/** Highest tenantFreq seen — used to normalize freq scores at query time */
	maxTenantFreq: number = 1;

	insert(
		word: string,
		tenantFreq: number,
		docFreq: number,
		authorFreq: number,
		meta?: TermMeta,
	): void {
		let node = this.root;
		for (const char of word.toLowerCase()) {
			let next = node.children.get(char);
			if (!next) {
				next = new TrieNode();
				node.children.set(char, next);
			}
			node = next;
		}
		node.word = word;
		node.tenantFreq = tenantFreq;
		node.docFreq = docFreq;
		node.authorFreq = authorFreq;
		node.termType = meta?.termType ?? 'word';
		node.posSeq = meta?.posSeq ?? null;
		node.headPos = meta?.headPos ?? null;
		node.association = meta?.association ?? null;
		if (tenantFreq > this.maxTenantFreq) {
			this.maxTenantFreq = tenantFreq;
		}
	}

	/**
	 * Return all words matching this prefix, up to maxResults.
	 * O(prefix_length + results) — traverses to the prefix node then collects subtree.
	 */
	getCandidates(prefix: string, maxResults: number = MAX_CANDIDATES): Candidate[] {
		let node = this.root;
		for (const char of prefix.toLowerCase()) {
			const next = node.children.get(char);
			if (!next) {
				return [];
			}
			node = next;
		}

		const candidates: Candidate[] = [];
		const stack: TrieNode[] = [node];

		while (stack.length > 0 && candidates.length < maxResults) {
			const current = stack.pop();
			if (!current) {
				continue;
			}

			// Only add candidates that are longer than the prefix
			if (current.word && current.word.length > prefix.length) {
				candidates.push({ word: current.word, node: current });
			}
			for (const child of current.children.values()) {
				stack.push(child);
			}
		}

		return candidates;
	}

	private findNode(word: string): TrieNode | null {
		let node = this.root;
		for (const char of word.toLowerCase()) {
			const next = node.children.get(char);
			if (!next) {
				return null;
			}
			node = next;
		}
		return node.word !== null ? node : null;
	}

	/** Whether this exact surface is stored as a terminal word. */
	hasWord(word: string): boolean {
		return this.findNode(word) !== null;
	}

	/**
	 * Set the session frequency for a word.
	 * Returns true if the word exists in the trie.
	 */
	updateSessionFreq(word: string, count: number): boolean {
		const node = this.findNode(word);
		if (!node) {
			return false;
		}
		node.sessionFreq = count;
		this.boostedNodes.add(node);
		return true;
	}

	/**
	 * Increment the session frequency for a word by 1.
	 * Returns true if the word exists in the trie.
	 */
	incrementSessionFreq(word: string): boolean {
		const node = this.findNode(word);
		if (!node) {
			return false;
		}
		node.sessionFreq += 1;
		this.boostedNodes.add(node);
		return true;
	}

	/**
	 * Zero every session boost, in the number of words boosted rather than the
	 * number of words known.
	 */
	clearSessionBoosts(): void {
		for (const node of this.boostedNodes) {
			node.sessionFreq = 0;
		}
		this.boostedNodes.clear();
	}

	/**
	 * Every word carrying a session boost, optionally limited to one prefix's
	 * subtree. Unlike `getCandidates` a word equal to the prefix is included,
	 * since the question here is what the session holds rather than what could
	 * still be typed.
	 *
	 * Walks the trie rather than reading `boostedNodes`, since a prefix answer is
	 * a subtree question and this only runs when a human asks it.
	 */
	collectSessionBoosted(prefix: string = ''): Candidate[] {
		let node = this.root;
		for (const char of prefix.toLowerCase()) {
			const next = node.children.get(char);
			if (!next) {
				return [];
			}
			node = next;
		}

		const boosted: Candidate[] = [];
		const stack: TrieNode[] = [node];

		while (stack.length > 0) {
			const current = stack.pop();
			if (!current) {
				continue;
			}
			if (current.word !== null && current.sessionFreq > 0) {
				boosted.push({ word: current.word, node: current });
			}
			for (const child of current.children.values()) {
				stack.push(child);
			}
		}

		return boosted;
	}
}

// L1/L2 Trie (Session + Atlassian Domain)
const wordTrie = new WeightedWordTrie();

// L3 Trie (General English Fallback)
const l3Trie = new WeightedWordTrie();

/**
 * L2 phrase/bigram trie. Kept SEPARATE from `wordTrie` so single-word
 * completion + L3 gap-fill stay untouched; multi-word units are only surfaced
 * by the (12b) multiword prefix-window matcher. Keys are the full normalized
 * surface string (spaces included), e.g. `"return on investment"`, so a lookup
 * is a plain char-trie walk over the whole phrase.
 */
const phraseTrie = new WeightedWordTrie();

/**
 * Loads the General English vocabulary.
 * expects a simple array of strings: ["about", "above", "actually", ...]
 */
export const initL3Vocabulary = (l3Words: string[]): void => {
	for (const word of l3Words) {
		// Insert with a tiny baseline frequency so it mathematically
		// loses to any domain word in Stage 1, but still scores above 0.
		l3Trie.insert(word, L3_BASELINE_FREQ, 0, 0);
	}
	recallGeneration++;
	ctcTag('init', `L3 general English loaded: ${l3Words.length} words`);
};

// const bigramMap: Map<string, Record<string, number>> = new Map(
// 	Object.entries(bigramsData as Record<string, Record<string, number>>),
// );

let isInitialized = false;

let vectorStore: VectorStore | null = null;

let vectorsLoadStarted = false;

// Phrase/bigram artifacts load independently of the word vocabulary so a
// missing/late `bigrams.json`/`phrases.json` never breaks word completion.
let phrasesLoadStarted = false;
let phrasesLoaded = false;
let phraseTermCount = 0;
// Per-type frequency maxima, tracked separately because bigrams and phrases
// share one trie but have very different absolute frequency ranges (bigrams are
// far more frequent than 3-word phrases). Normalizing each type by its OWN max
// stops phrase freq scores from being crushed against the top bigram's count.
let maxBigramFreq = 1;
let maxPhraseFreq = 1;

let lastPredictionDebug: {
	awaitingAsyncEvidence: boolean;
	contextWords: string[];
	currentWord: string;
	decision: string;
	mode: 'cold' | 'warm';
	suggestion: string | null;
	textBefore: string;
	topCandidates: Array<{
		finalScore: number;
		freqScore: number;
		lmScore: number;
		semanticScore: number;
		word: string;
	}>;
} | null = null;

let lastPredictionOutcome: PredictionOutcome | null = null;

const recordPredictionOutcome = (outcome: PredictionOutcome): void => {
	lastPredictionOutcome = outcome;
};

/** The verdict from the most recent `predict` call. Always populated. */
export const getLastPredictionOutcome = (): PredictionOutcome | null => lastPredictionOutcome;

// ── Stabilization (QI-2): post-accept cooldown + whole-surface repetition ────
// Two guards that stop the accept→echo (`end to end` → `end to end to end`) and
// generally keep a just-accepted unit from being re-offered:
//  • repetition: never surface a candidate whose full surface already equals the
//    run of tokens immediately before the cursor (handled inline in predict()).
//  • cooldown: after an accept, briefly suppress re-offering that same unit. The
//    cooldown lifts only once BOTH the keystroke budget and the time window have
//    elapsed (either one still counting keeps it active).
const COOLDOWN_KEYSTROKES = 5;
const COOLDOWN_MS = 2000;

// Active post-accept cooldown, or null when none.
let acceptCooldown: { predictionsSince: number; surface: string; ts: number } | null = null;

/**
 * Start a short cooldown for the exact surface the editor inserted. The caller
 * passes the committed snapshot's surface so background re-ranking can never
 * move cooldown bookkeeping away from what the user actually accepted.
 */
export const noteSuggestionAccepted = (surface: string): void => {
	const normalizedSurface = surface.trim().toLowerCase();
	if (normalizedSurface) {
		acceptCooldown = {
			predictionsSince: 0,
			surface: normalizedSurface,
			ts: performance.now(),
		};
	}
};

/**
 * Whether `surface` is the one the user just accepted and is still inside its
 * cooldown window.
 *
 * Read-only, unlike the advance inside `predict`: the cooldown is measured in
 * predictions, and a caller asking whether it is active must not consume one of
 * them. Exported for the harvest path, which displays without going through
 * arbitration and so would otherwise re-offer what was just accepted.
 */
export const isSurfaceInAcceptCooldown = (surface: string): boolean => {
	if (!acceptCooldown || acceptCooldown.surface !== surface.trim().toLowerCase()) {
		return false;
	}
	return (
		acceptCooldown.predictionsSince <= COOLDOWN_KEYSTROKES ||
		performance.now() - acceptCooldown.ts < COOLDOWN_MS
	);
};

/** Get vector for a word from the store. */
const getWordVector = (word: string): Float32Array | null => {
	if (!vectorStore) {
		return null;
	}
	const idx = vectorStore.wordIndex[word.toLowerCase()];
	if (idx === undefined) {
		return null;
	}
	const start = idx * vectorStore.dim;
	return vectorStore.float32.subarray(start, start + vectorStore.dim);
};

/**
 * Compute context vector by averaging vectors of last N words in text.
 * Falls back to null (cold mode) if no words have vectors.
 */
const computeContextVectorLocal = (textBefore: string): Float32Array | null => {
	if (!vectorStore) {
		return null;
	}
	const tokens = tokenize(textBefore);
	const words = tokens.slice(-CONTEXT_WORDS);
	const vectors: Float32Array[] = [];
	for (const word of words) {
		const v = getWordVector(word);
		if (v) {
			vectors.push(v);
		}
	}
	if (vectors.length === 0) {
		return null;
	}

	const dim = vectorStore.dim;
	const avg = new Float32Array(dim);
	for (const v of vectors) {
		for (let i = 0; i < dim; i++) {
			avg[i] += v[i];
		}
	}
	for (let i = 0; i < dim; i++) {
		avg[i] /= vectors.length;
	}
	return avg;
};

/**
 * Get context vector for scoring. Prefers Slow Lane (BE) context when available
 * and dimension matches; otherwise falls back to local averaging.
 */
const getContextVectorForScoring = (textBefore: string): Float32Array | null => {
	const slowLaneVector = getStoredContextVector();
	if (slowLaneVector && vectorStore && slowLaneVector.length === vectorStore.dim) {
		return slowLaneVector;
	}
	return computeContextVectorLocal(textBefore);
};

const tokenize = (text: string): string[] => {
	const tokens: string[] = [];
	// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace
	for (const raw of text.toLowerCase().split(WHITESPACE_SPLIT_REGEX)) {
		// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace
		const clean = raw.replace(PUNCTUATION_BOUNDARY_REGEX, '');
		if (clean.length >= 2) {
			tokens.push(clean);
		}
	}
	return tokens;
};

const extractPreviousWord = (text: string): string => {
	// Only consider the current sentence/line the user is typing in.
	const sentences = text.split(SENTENCE_BOUNDARY_REGEX);
	const currentSentence = sentences[sentences.length - 1];

	const words = currentSentence.trimEnd().split(WHITESPACE_SPLIT_REGEX);
	return words.length >= 2 ? words[words.length - 2] : '';
};

/**
 * Collect phrase/bigram completion candidates for the multi-word window ending
 * at the current partial token.
 *
 * Builds windows of the last `2..PHRASE_MAX_WORDS` tokens of the current
 * sentence (widest first) and prefix-searches the phrase trie for each, so
 * `quarterly pla` matches `quarterly planning meeting`. Windows never cross a
 * sentence boundary (mirrors `extractPreviousWord`). Each result records the
 * matched window length so the caller can compute the ghost tail.
 *
 * :params:
 *   trimmed: Text before the cursor, trailing whitespace already removed
 * :returns:
 *   Matched phrase candidates (deduped, widest-window match wins per term)
 */
const getPhraseCandidates = (trimmed: string): MatchedCandidate[] => {
	// Records every prefix window we probe and its match count so the (verbose)
	// debug line makes it obvious whether the phrase path found nothing because the
	// trie is empty, or because no phrase begins with the typed window.
	const windowsTried: Array<{ matches: number; window: string }> = [];
	const logPhrasePath = (skipReason?: string): void => {
		if (!isAutocompleteDebugVerbose()) {
			return;
		}
		const detail = skipReason
			? skipReason
			: `windows: ${windowsTried.map((w) => `"${w.window}"→${w.matches}`).join(', ') || '(none)'}`;
		ctcTag(
			'phrase',
			`loaded=${phraseTermCount} (${phrasesLoaded ? 'ready' : 'not loaded'}) · ${detail}`,
			CTC_STYLES.section,
		);
	};

	if (phraseTermCount === 0) {
		logPhrasePath('phrase trie empty — bigrams.json/phrases.json not loaded (or 0 terms)');
		return [];
	}

	const tokenMatches = Array.from(trimmed.matchAll(SURFACE_TOKEN_REGEX));
	const lastMatch = tokenMatches[tokenMatches.length - 1];
	const lastStart = lastMatch?.index;
	if (!lastMatch || lastStart === undefined || lastStart + lastMatch[0].length !== trimmed.length) {
		logPhrasePath('no tokens in current sentence');
		return [];
	}

	const trailingTokens: Array<{ start: number; value: string }> = [
		{ start: lastStart, value: lastMatch[0] },
	];
	for (let i = tokenMatches.length - 2; i >= 0; i--) {
		const current = trailingTokens[0];
		const match = tokenMatches[i];
		const start = match.index;
		if (start === undefined) {
			break;
		}
		const end = start + match[0].length;
		const gap = trimmed.slice(end, current.start);
		if (!ONLY_WHITESPACE_REGEX.test(gap)) {
			break;
		}
		trailingTokens.unshift({ start, value: match[0] });
		if (trailingTokens.length >= PHRASE_MAX_WORDS) {
			break;
		}
	}

	const partial = trailingTokens[trailingTokens.length - 1].value;
	const results: MatchedCandidate[] = [];
	const seen = new Set<string>();
	const maxPrev = trailingTokens.length - 1;

	// Widest window first so the most specific (longest-context) match wins the
	// dedup for a given phrase term. `prev` is the number of *preceding* complete
	// words included ahead of the current partial:
	//   prev ≥ 1 → "continue a phrase I've started" (e.g. "root c" → root cause).
	//              Preceding-word context is strong, so a short partial is fine.
	//   prev = 0 → "the partial is a phrase's FIRST word" (e.g. "root" → root
	//              cause). No preceding context, so require the partial to be a
	//              one character so grouped LM work can begin early. UI remains
	//              gated at DISPLAY_MIN_PREFIX_LENGTH.
	for (let prev = maxPrev; prev >= 0; prev--) {
		if (prev === 0 && partial.length < MULTIWORD_PREFETCH_MIN_PREFIX_LENGTH) {
			continue;
		}
		const windowTokens = trailingTokens.slice(-(prev + 1));
		const windowPrefix = windowTokens
			.map((token) => token.value)
			.join(' ')
			.toLowerCase();
		const windowLen = windowPrefix.length;
		const matches = phraseTrie.getCandidates(windowPrefix, MAX_PHRASE_CANDIDATES);
		windowsTried.push({ window: windowPrefix, matches: matches.length });
		for (const match of matches) {
			if (seen.has(match.word)) {
				continue;
			}
			seen.add(match.word);
			results.push({
				node: match.node,
				word: match.word,
				matchedPrefixLen: windowLen,
				surfaceStart: windowTokens[0].start,
			});
		}
	}

	logPhrasePath();
	return results;
};

// ─── Debug Helpers ───────────────────────────────────────────────────────────

/**
 * Get predictor status for debugging.
 * vectorsLoaded: true when semantic scoring is active
 * wordCount: number of words in vector store (0 if not loaded)
 */
export const getPredictorStatus = (): {
	canonicalScoringSupported: boolean;
	canonicalSurfaceCount: number | null;
	clientId: string | null;
	clientKind: 'localLlm' | 'server' | null;
	isInitialized: boolean;
	localModelReady: boolean | null;
	maxFreqByType: { bigram: number; phrase: number; word: number };
	phraseCount: number;
	phrasesLoaded: boolean;
	slowLaneRegistered: boolean;
	vectorsLoaded: boolean;
	vectorsLoadStarted: boolean;
	wordCount: number;
} => {
	const slowLaneStatus = getDefaultSlowLaneClientStatus();
	return {
		canonicalScoringSupported: slowLaneStatus.canonicalScoringSupported,
		canonicalSurfaceCount: slowLaneStatus.canonicalSurfaceCount,
		clientId: slowLaneStatus.clientId,
		clientKind: slowLaneStatus.clientKind,
		localModelReady: slowLaneStatus.localModelReady,
		slowLaneRegistered: slowLaneStatus.registered,
		vectorsLoaded: vectorStore !== null,
		wordCount: vectorStore ? Object.keys(vectorStore.wordIndex).length : 0,
		vectorsLoadStarted,
		isInitialized,
		phrasesLoaded,
		phraseCount: phraseTermCount,
		maxFreqByType: {
			word: wordTrie.maxTenantFreq,
			bigram: maxBigramFreq,
			phrase: maxPhraseFreq,
		},
	};
};

/**
 * Get details of the last prediction (for debugging).
 * Returns null if no prediction has run yet or debug was off.
 */
export const getLastPredictionDebug = (): {
	awaitingAsyncEvidence: boolean;
	contextWords: string[];
	currentWord: string;
	decision: string;
	mode: 'cold' | 'warm';
	suggestion: string | null;
	textBefore: string;
	topCandidates: Array<{
		finalScore: number;
		freqScore: number;
		lmScore: number;
		semanticScore: number;
		word: string;
	}>;
} | null => {
	return lastPredictionDebug;
};

export const initVocabulary = (vocabulary: TenantVocabulary): void => {
	for (const term of vocabulary.terms) {
		wordTrie.insert(term.word, term.freq, term.docFreq, term.authorFreq);
	}
	isInitialized = true;
	recallGeneration++;
};

/**
 * Insert a producer-shipped bigram/phrase artifact into the phrase trie.
 *
 * :params:
 *   artifact: Normalized `{term: {freq, doc_freq, author_freq, pos_seq, head_pos, association}}` map
 *   termType: Whether these terms are `bigram` (2 tokens) or `phrase` (3 tokens)
 * :returns:
 *   The number of terms inserted
 */
export const initPhrases = (artifact: PhraseArtifactJson, termType: TermType): number => {
	let count = 0;
	for (const [term, stats] of Object.entries(artifact)) {
		phraseTrie.insert(term, stats.freq, stats.doc_freq, stats.author_freq, {
			termType,
			posSeq: stats.pos_seq ?? null,
			headPos: stats.head_pos ?? null,
			association: stats.association ?? null,
		});
		// Track each type's own frequency ceiling for per-type normalization.
		if (termType === 'bigram') {
			if (stats.freq > maxBigramFreq) {
				maxBigramFreq = stats.freq;
			}
		} else if (stats.freq > maxPhraseFreq) {
			maxPhraseFreq = stats.freq;
		}
		count++;
	}
	phraseTermCount += count;
	recallGeneration++;
	return count;
};

/**
 * Increment L1 session frequency for a single word.
 * Called from the plugin on word boundaries for efficient incremental boosting.
 */
export const incrementSessionFreq = (word: string): void => {
	wordTrie.incrementSessionFreq(word);
};

/**
 * Drop every L1 boost this session has accumulated.
 *
 * The vocabulary itself is left alone: only `sessionFreq` is cleared, so the
 * tenant and generic frequencies a boost was sitting on top of survive. Called
 * when the plugin decides the session it was learning for has ended — a new
 * conversation, or a different page — since a boost is a claim about what is
 * being discussed and that claim does not carry over.
 */
export const resetSessionBoosts = (): void => {
	wordTrie.clearSessionBoosts();
	// Anything memoized against the old boosts is now describing a session that
	// no longer exists.
	recallGeneration++;
};

/**
 * Which vocabulary already holds this surface, if any.
 *
 * Used by the inline-code harvester to drop terms the scored path can already
 * serve, so that harvesting stays limited to words with no route to a
 * suggestion today.
 */
export const lookupVocabularySource = (word: string): 'l2' | 'l3' | null => {
	if (wordTrie.hasWord(word)) {
		return 'l2';
	}
	return l3Trie.hasWord(word) ? 'l3' : null;
};

/**
 * Prime session frequencies from a document page string.
 *
 * Iterates through every token in `pageContent` and increments its session
 * frequency so that words already present on the page receive an L1 boost
 * before the user starts typing.
 *
 * Pass `undefined` (or omit the argument) to skip priming — useful when the
 * calling context does not yet have a page value available.
 */
export const ingestDocumentPage = (pageContent: string | undefined): void => {
	if (!pageContent) {
		return;
	}

	const words = tokenize(pageContent);
	const validBoostedWords = new Set<string>();

	for (const word of words) {
		const didBoost = wordTrie.incrementSessionFreq(word);
		if (didBoost) {
			validBoostedWords.add(word);
		}
	}

	if (isAutocompleteDebugEnabled() && validBoostedWords.size > 0) {
		ctcTag(
			'init',
			`L1 session primed ${validBoostedWords.size} words from page · __atlCtcDebug__.session() to inspect`,
			CTC_STYLES.brand,
		);
		if (isAutocompleteDebugVerbose()) {
			// eslint-disable-next-line no-console
			console.dir(Array.from(validBoostedWords).sort());
		}
	}
};

/**
 * How many boosted words `inspectSessionBoosts` lists.
 *
 * A page ingest can boost thousands, and a list that long is not read. The
 * strongest boosts are the ones that change an ordering, and `boosted` still
 * reports the full size, so the cap loses nothing but volume.
 */
const MAX_LISTED_SESSION_WORDS = 100;

interface SessionWordSnapshot {
	/** Times this session has seen it: words typed plus words in ingested text. */
	sessionFreq: number;
	/** No corpus frequency behind it, so L1 is the whole of its standing. */
	sessionOnly: boolean;
	surface: string;
	/** Corpus frequency shipped with the vocabulary, for scale against the boost. */
	tenantFreq: number;
}

export interface SessionSnapshot {
	/** How many words hold a boost, whether or not they are listed below. */
	boosted: number;
	/** Ceiling on `words`; beyond it the weakest boosts are left out of the listing. */
	limit: number;
	/** The prefix asked about, when one was passed. */
	prefix?: string;
	/** Strongest boost first, then alphabetically. */
	words: SessionWordSnapshot[];
}

/**
 * Read the session's L1 boosts, optionally narrowed to a prefix.
 *
 * Installed as `__atlCtcDebug__.session()`, with `__atlCtcDebug__.session('poll')`
 * to ask about one family. Returned rather than logged, so the console renders it
 * as an inspectable object and a caller can assert on it.
 *
 * Only words the vocabulary already holds can carry a boost, because both writers
 * go through `incrementSessionFreq` and it only finds existing nodes. An ingested
 * word absent from the vocabulary is therefore missing from here and always will
 * be — that gap is what the inline-code harvester covers, and those surfaces show
 * up under `__atlCtcDebug__.harvest()` instead.
 */
export const inspectSessionBoosts = (prefix?: string): SessionSnapshot => {
	const boosted = wordTrie.collectSessionBoosted(prefix ?? '');
	return {
		boosted: boosted.length,
		limit: MAX_LISTED_SESSION_WORDS,
		...(prefix === undefined ? {} : { prefix }),
		words: boosted
			.sort(
				(a, b) =>
					b.node.sessionFreq - a.node.sessionFreq ||
					a.word.localeCompare(b.word, 'en', { numeric: true, sensitivity: 'base' }),
			)
			.slice(0, MAX_LISTED_SESSION_WORDS)
			.map(({ node, word }) => ({
				sessionFreq: node.sessionFreq,
				sessionOnly: node.tenantFreq === 0,
				surface: word,
				tenantFreq: node.tenantFreq,
			})),
	};
};

// At module scope so the console answers before the first keystroke, which is
// when someone reaching for it usually asks.
registerCtcSessionInspector(inspectSessionBoosts);

/**
 * Result of a prediction: the ghost tail to insert plus an immutable record of
 * the evidence that authorized the UI commitment.
 */
export interface PredictionResult {
	/** Canonical evidence depth for the selected full surface. */
	evidenceDepth: {
		totalChars: number;
		totalTokens: number;
		verifiedChars: number;
		verifiedTokens: number;
	};
	/**
	 * Evidence tier that authorized display. Tier A is never display-eligible.
	 *
	 * `session-harvest` never passes through this module: an inline-code surface
	 * harvested from the session has no frequencies, vector or canonical token
	 * ids, so it is authorized by being marked as code on a prefix the scored
	 * path left unclaimed rather than by model evidence.
	 */
	evidenceTier: 'canonical-full-surface' | 'network-logit' | 'session-harvest';
	/**
	 * Mean per-token log-probability of the verified prefix.
	 *
	 * Carried alongside the posterior because the two answer different
	 * questions and a plausibility floor is placed on this one. A surface alone
	 * in its normaliser holds the whole pool whatever the model thinks of it,
	 * so its posterior cannot say whether it was worth showing and this can.
	 */
	meanTokenLogProbability: number;
	/**
	 * Whether a longer candidate in the same pool extends the selected surface.
	 *
	 * The chain rule leaves such a surface holding its pool's mass undivided, so
	 * its posterior is high for a structural reason rather than a modelled one —
	 * whichever continuation was meant, the prefix was right. Carried so the top
	 * posterior bucket can be split on it, since a lifted nested leader and a
	 * genuinely preferred surface are otherwise the same number.
	 */
	poolHeldExtension: boolean;
	/** Share of its shortlist's mass the model put on the selected surface. */
	posterior: number;
	/** Final Stage-1 + LM ranking score. */
	rankScore: number;
	/** How many scored candidates the selected surface's normaliser divided between. */
	shortlistSize: number;
	/** Full surface of the selected candidate (identity for keep-vs-swap checks). */
	surface: string;
	/** Whether the selected surface is a single word, a bigram, or a phrase. */
	termType: TermType;
	/** Ghost tail actually shown/inserted (surface minus the already-typed prefix). */
	text: string;
	/** Final-score lead over the strongest evidence-backed runner-up. */
	winnerMargin: number;
}

// ─── Recall memo ─────────────────────────────────────────────────────────────

/** Trie recall plus the canonical context derived for each matched term. */
interface CanonicalRecall {
	canonicalMatched: CanonicalMatchedCandidate[];
	prefixLenByWord: Map<string, number>;
}

interface RecallMemo extends CanonicalRecall {
	generation: number;
	surfaceCount: number;
	trimmed: string;
}

/**
 * Bumped whenever an artifact load changes what the tries can return, which is
 * the only way the candidate *set* for a given prefix can change.
 *
 * Session-frequency boosts are deliberately not counted: they mutate trie nodes
 * in place, and the memo holds those nodes by reference, so a boost is already
 * visible through a cached entry.
 */
let recallGeneration = 0;

let recallMemo: RecallMemo | null = null;

const computeCanonicalRecall = (
	trimmed: string,
	currentWord: string,
	currentWordStart: number,
): CanonicalRecall => {
	// Start recall at one character so grouped causal work can overlap later
	// keystrokes. Nothing is displayed until three characters.
	const wordCandidates: Candidate[] =
		currentWord.length >= UNIGRAM_PREFETCH_MIN_PREFIX_LENGTH
			? wordTrie.getCandidates(currentWord, MAX_CANDIDATES)
			: [];

	// Gap-fill from the L3 general-English trie, requesting a full buffer so
	// enough survive de-duplication against the L2 results.
	if (
		currentWord.length >= UNIGRAM_PREFETCH_MIN_PREFIX_LENGTH &&
		wordCandidates.length < MAX_CANDIDATES
	) {
		const l3Candidates = l3Trie.getCandidates(currentWord, MAX_CANDIDATES);

		const existingWords = new Set(wordCandidates.map((c) => c.word));

		for (const l3c of l3Candidates) {
			if (wordCandidates.length >= MAX_CANDIDATES) break;

			if (!existingWords.has(l3c.word)) {
				wordCandidates.push(l3c);
			}
		}
	}

	// Multi-word completion terms (bigrams/phrases) matched on the trailing
	// window ending at the current partial token. Runs even when the unigram path
	// was skipped for a short partial, so first-word/early phrase matches surface.
	const phraseCandidates = getPhraseCandidates(trimmed);

	// Unify: a word completes the current partial token; a phrase completes its
	// matched multi-word window. Track the prefix length per term so the ghost
	// tail is sliced correctly regardless of term type.
	const matched: MatchedCandidate[] = [
		...wordCandidates.map(({ word, node }) => ({
			word,
			node,
			matchedPrefixLen: currentWord.length,
			surfaceStart: currentWordStart,
		})),
		...phraseCandidates,
	];

	const positionCache = createCanonicalContextPositionCache();
	const canonicalMatched: CanonicalMatchedCandidate[] = matched.map((candidate) => ({
		...candidate,
		...deriveCanonicalCandidateContext(
			trimmed,
			candidate.matchedPrefixLen,
			candidate.word,
			getCanonicalSurfaceTokenIds,
			candidate.surfaceStart,
			positionCache,
		),
	}));

	const prefixLenByWord = new Map<string, number>();
	for (const m of canonicalMatched) {
		if (!prefixLenByWord.has(m.word)) {
			prefixLenByWord.set(m.word, m.matchedPrefixLen);
		}
	}

	return { canonicalMatched, prefixLenByWord };
};

/**
 * Recall and canonical derivation for `trimmed`, reusing the previous result
 * when nothing they depend on has changed.
 *
 * `predict()` runs several times for one keystroke — once when the decision
 * opens and again for each async evidence signal that lands inside the budget —
 * and only the evidence differs between those runs. Without this, every run
 * re-walks the tries and re-derives a canonical context per candidate.
 */
const getCanonicalRecall = (
	trimmed: string,
	currentWord: string,
	currentWordStart: number,
): CanonicalRecall => {
	const surfaceCount = getCanonicalSurfaceCount();
	if (
		recallMemo !== null &&
		recallMemo.trimmed === trimmed &&
		recallMemo.generation === recallGeneration &&
		recallMemo.surfaceCount === surfaceCount
	) {
		return recallMemo;
	}

	const recall = computeCanonicalRecall(trimmed, currentWord, currentWordStart);
	recallMemo = { ...recall, generation: recallGeneration, surfaceCount, trimmed };
	return recall;
};

export const predict = (textBefore: string): PredictionResult | null => {
	if (!isInitialized) {
		// Vocabulary artifacts load asynchronously over the autocomplete gateway.
		// Kick off the load and skip this keystroke; the plugin also primes it on
		// focus, so the tries are usually ready before the user types.
		void loadDefaultVocabulary({ source: 'predict' }).catch(() => {});
		// Awaiting, not empty-handed: with no vocabulary loaded the harvester's own
		// intake filter has not been applied to anything either.
		recordPredictionOutcome({
			abstainReason: 'not-initialized',
			awaitingAsyncEvidence: true,
			scoredCandidateCount: 0,
			textBefore,
		});
		return null;
	}

	const t0 = performance.now();

	// Advance the post-accept cooldown once per prediction. It stays active until
	// BOTH the keystroke budget and the time window have elapsed; while active it
	// suppresses re-offering the just-accepted surface (see arbitration below).
	let cooledSurface: string | null = null;
	if (acceptCooldown) {
		acceptCooldown.predictionsSince += 1;
		const stillByKeys = acceptCooldown.predictionsSince <= COOLDOWN_KEYSTROKES;
		const stillByTime = performance.now() - acceptCooldown.ts < COOLDOWN_MS;
		if (stillByKeys || stillByTime) {
			cooledSurface = acceptCooldown.surface;
		} else {
			acceptCooldown = null;
		}
	}

	// ── Boundary/early-prefix prefetch; display remains gated at ≥3 ─────────
	if (textBefore.length > 0 && TRAILING_WHITESPACE_REGEX.test(textBefore)) {
		const boundaryContext = deriveWhitespaceBoundaryContext(textBefore);
		if (boundaryContext) {
			primeBoundaryLm({
				...boundaryContext,
				familyKey: boundaryContext.contextKey,
				priority: 0,
			});
		}
		recordPredictionOutcome({
			abstainReason: 'prefetch',
			awaitingAsyncEvidence: true,
			scoredCandidateCount: 0,
			textBefore,
		});
		return null;
	}

	const trimmed = textBefore.trimEnd();
	const trailingSurfaceToken = trimmed.match(TRAILING_SURFACE_TOKEN_REGEX)?.[0] ?? '';
	if (trailingSurfaceToken.length === 0) {
		recordPredictionOutcome({
			abstainReason: 'no-surface-token',
			awaitingAsyncEvidence: false,
			scoredCandidateCount: 0,
			textBefore,
		});
		return null;
	}
	const currentWord = trailingSurfaceToken;
	const currentWordStart = trimmed.length - currentWord.length;

	const { canonicalMatched, prefixLenByWord } = getCanonicalRecall(
		trimmed,
		currentWord,
		currentWordStart,
	);

	// If every trie was empty for this prefix
	if (canonicalMatched.length === 0) {
		// Terminal, and the only verdict that says the vocabulary has no claim on
		// this prefix at all — which is what makes it the harvester's cue.
		recordPredictionOutcome({
			abstainReason: 'no-candidate',
			awaitingAsyncEvidence: false,
			scoredCandidateCount: 0,
			textBefore,
		});
		if (isAutocompleteDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.log(
				`%c[CTC]%c — abstain: no matches for "${currentWord}"`,
				CTC_STYLES.brand,
				CTC_STYLES.body,
			);
		}
		return null;
	}

	const previousWord = extractPreviousWord(trimmed);

	const contextVector = getContextVectorForScoring(trimmed);
	const lmLogits = getStoredLmLogits();

	const mode: 'cold' | 'warm' = contextVector ? 'warm' : 'cold';

	// Build ScoringCandidate array from matched terms (words + phrases)
	const scoringCandidates: ScoringCandidate[] = canonicalMatched.map(({ word, node }) => ({
		word,
		tenantFreq: node.tenantFreq,
		docFreq: node.docFreq,
		authorFreq: node.authorFreq,
		sessionFreq: node.sessionFreq,
		termType: node.termType,
		posSeq: node.posSeq,
		headPos: node.headPos,
		association: node.association,
	}));

	// Filter the LM payload to only words matching the current prefix so that
	// lmMax in rankCandidates reflects prefix-relevant signal, not the global distribution.
	const prefix = currentWord.toLowerCase();
	const currentWordSeparator = canonicalMatched.find(
		(candidate) => candidate.node.termType === 'word',
	)?.separatorKind;
	const prefixLmLogits =
		lmLogits && currentWordSeparator === 'whitespace'
			? Object.fromEntries(Object.entries(lmLogits).filter(([word]) => word.startsWith(prefix)))
			: null;

	const canonicalScoringSupported = isCanonicalSurfaceScoringSupported();
	const eligibleContextKeys = Array.from(
		new Set(
			canonicalMatched
				.filter((candidate) => candidate.canonicalTokenIds !== null)
				.map((candidate) => candidate.contextKey),
		),
	).sort();
	const familyKey = eligibleContextKeys.join('\u0001');
	const primeRequests = selectBoundaryPrimeRequests(familyKey, canonicalMatched, PHRASE_MAX_WORDS);
	for (const request of primeRequests) {
		primeBoundaryLm(request);
	}

	const runtimeBySurface = new Map(
		canonicalMatched.map((candidate) => [candidate.word, candidate]),
	);
	const canonicalEvidence = new Map<string, CanonicalLmEvidence>();
	const firstTokenGroups = new Map<string, CanonicalMatchedCandidate[]>();
	for (const candidate of canonicalMatched) {
		if (candidate.canonicalTokenIds === null) {
			continue;
		}
		// This accessor also materializes an exact cache entry when all tokens
		// have already been covered by shared-prefix work.
		getProgressiveSurfaceEvidence(candidate.contextKey, candidate.word);
		const exact = getSurfaceScore(candidate.contextKey, candidate.word);
		if (exact) {
			canonicalEvidence.set(candidate.word, {
				contextKey: candidate.contextKey,
				meanTokenLogProbability: exact.meanTokenLogProbability,
				score: 0,
				separatorKind: 'whitespace',
				source: 'canonical-full-surface',
				totalLogProbability: exact.totalLogProbability,
				totalSurfaceCharCount: candidate.word.length,
				totalTokenCount: exact.tokenCount,
				verifiedCharCount: candidate.word.length,
				verifiedTokenCount: exact.tokenCount,
			});
			continue;
		}
		const group = firstTokenGroups.get(candidate.contextKey) ?? [];
		group.push(candidate);
		firstTokenGroups.set(candidate.contextKey, group);
	}

	for (const [contextKey, group] of firstTokenGroups) {
		const boundary = getBoundaryLmState(contextKey);
		if (!boundary) {
			continue;
		}
		let maxLogit = -Infinity;
		for (const candidate of group) {
			const tokenId = candidate.canonicalTokenIds?.[0];
			const rawLogit = tokenId === undefined ? undefined : boundary.rawLogits[tokenId];
			if (rawLogit !== undefined && Number.isFinite(rawLogit) && rawLogit > maxLogit) {
				maxLogit = rawLogit;
			}
		}
		if (!Number.isFinite(maxLogit)) {
			continue;
		}
		for (const candidate of group) {
			const tokenId = candidate.canonicalTokenIds?.[0];
			const rawLogit = tokenId === undefined ? undefined : boundary.rawLogits[tokenId];
			if (rawLogit === undefined || !Number.isFinite(rawLogit)) {
				continue;
			}
			const tokenCount = candidate.canonicalTokenIds?.length ?? 0;
			if (tokenId !== undefined && tokenCount === 1) {
				const totalLogProbability = logSoftmaxAt(boundary.rawLogits, tokenId);
				if (!Number.isFinite(totalLogProbability)) {
					continue;
				}
				canonicalEvidence.set(candidate.word, {
					contextKey,
					meanTokenLogProbability: totalLogProbability,
					score: 0,
					separatorKind: 'whitespace',
					source: 'canonical-full-surface',
					totalLogProbability,
					totalSurfaceCharCount: candidate.word.length,
					totalTokenCount: 1,
					verifiedCharCount: candidate.word.length,
					verifiedTokenCount: 1,
				});
				continue;
			}
			canonicalEvidence.set(candidate.word, {
				contextKey,
				rawLogit,
				score: 0,
				separatorKind: 'whitespace',
				source: 'canonical-first-token',
				totalSurfaceCharCount: candidate.word.length,
				totalTokenCount: tokenCount,
				verifiedCharCount: 0,
				verifiedTokenCount: 1,
			});
		}
	}

	const {
		candidates: ranked,
		grammarMeta,
		pipelineDebug,
	} = rankCandidates(
		scoringCandidates,
		contextVector,
		(w: string) => getWordVector(w),
		prefixLmLogits,
		{
			word: wordTrie.maxTenantFreq,
			bigram: maxBigramFreq,
			phrase: maxPhraseFreq,
		},
		previousWord,
		(surface) => canonicalEvidence.get(surface) ?? null,
	);

	const progressiveEligible = ranked.filter((candidate) => {
		const runtime = runtimeBySurface.get(candidate.word);
		return runtime?.canonicalTokenIds !== null && runtime?.canonicalTokenIds !== undefined;
	});
	if (canonicalScoringSupported && progressiveEligible.length > 0) {
		const byContext = new Map<
			string,
			Array<{ rankHint: number; runtime: CanonicalMatchedCandidate }>
		>();
		for (const candidate of progressiveEligible) {
			const runtime = runtimeBySurface.get(candidate.word);
			if (!runtime || runtime.canonicalTokenIds === null) {
				continue;
			}
			const group = byContext.get(runtime.contextKey) ?? [];
			group.push({ runtime, rankHint: candidate.stage1Score });
			byContext.set(runtime.contextKey, group);
		}
		for (const [contextKey, group] of byContext) {
			requestProgressiveSurfaceScores({
				familyKey,
				contextKey,
				prompt: group[0].runtime.contextBeforeSurface,
				candidates: group.map(({ runtime, rankHint }) => ({
					surface: runtime.word,
					tokenIds: runtime.canonicalTokenIds ?? [],
					rankHint,
				})),
			});
		}
	}

	// The one/two-character passes exist only to hide model latency. They may
	// prime and expand token groups above, but cannot commit UI.
	const displayPrefixReady = currentWord.length >= DISPLAY_MIN_PREFIX_LENGTH;

	// ── Arbitration: full-surface evidence → plausibility → winner margin ──
	const canonicalLmSupported = canonicalScoringSupported;
	const hasExactEvidence = (candidate: ScoredCandidate): boolean =>
		candidate.lmEvidence?.source === 'canonical-full-surface' &&
		candidate.lmEvidence.meanTokenLogProbability !== undefined &&
		Number.isFinite(candidate.lmEvidence.meanTokenLogProbability);

	/**
	 * The evidence this candidate is judged on: the summed log-probability of
	 * the tokens that have been read, their per-token mean, and whether they
	 * cover the whole surface.
	 *
	 * `total` is the quantity the posterior is built from — it is a sequence
	 * log-likelihood, so it is comparable across surfaces of different lengths
	 * in a way the mean is not. `mean` is retained for reporting and for the
	 * oracle arms, which compare aggregation rules against each other.
	 *
	 * Every token read costs a round trip, so a surface longer than
	 * `REQUIRED_VERIFIED_TOKENS` is judged on its leading tokens and its tail is
	 * left unread. Callers compensate with a wider winner margin rather than
	 * treating the two kinds of evidence as equivalent.
	 *
	 * This is the depth-unaware read, and it is what the pool below is built
	 * from. Arbitration goes through `judgedEvidenceFor`, which adds the one
	 * requirement that can only be stated once the pool is known: a surface
	 * cannot be judged against members it has not yet been read level with.
	 */
	const readJudgedEvidence = (
		candidate: ScoredCandidate,
	): { complete: boolean; mean: number; total: number } | null => {
		const evidence = candidate.lmEvidence;
		const exactMean = evidence?.meanTokenLogProbability;
		if (hasExactEvidence(candidate) && evidence && exactMean !== undefined) {
			const total = evidence.totalLogProbability ?? exactMean * evidence.totalTokenCount;
			return Number.isFinite(total) ? { complete: true, mean: exactMean, total } : null;
		}
		const runtime = runtimeBySurface.get(candidate.word);
		if (!runtime || runtime.canonicalTokenIds === null) {
			return null;
		}
		const progressive = getProgressiveSurfaceEvidence(runtime.contextKey, candidate.word);
		if (!progressive || progressive.scoredTokenCount < REQUIRED_VERIFIED_TOKENS) {
			return null;
		}
		const total = progressive.totalLogProbability;
		const mean = total / progressive.scoredTokenCount;
		return Number.isFinite(mean) && Number.isFinite(total)
			? { complete: false, mean, total }
			: null;
	};

	// Normalise each context's shortlist into a posterior. `total` is a sequence
	// log-likelihood, so `exp(total - logSumExp(totals))` is the share of the
	// shortlist's probability mass the model puts on that surface.
	//
	// Unknown future token log-probabilities cannot exceed zero, so a partially
	// read candidate's total is an upper bound on its eventual total, and its
	// posterior an upper bound on its eventual posterior. That is what lets the
	// plausibility floor and the display gate be the same threshold — one
	// applied to the bound, one to the verified value — instead of two numbers
	// that have to be kept consistent by hand.
	//
	// Candidates with no evidence at all are left out of the sum rather than
	// defaulted. Any default would have to stand in for a log-probability, and a
	// value low enough not to distort the normaliser is indistinguishable from
	// omitting the candidate.
	const optimisticTotalByWord = new Map<string, number>();
	const contextTotals = new Map<string, number[]>();
	const contextSurfaces = new Map<string, string[]>();
	// Counted before the total is looked up, so this is every candidate the
	// context could have scored rather than every candidate it did. The gap
	// between the two is what separates a context holding one match from a
	// context whose rivals have not come back yet.
	const contextRequestedCount = new Map<string, number>();
	const bestTotalByContext = new Map<string, number>();
	const bestCandidateByContext = new Map<string, ScoredCandidate>();
	for (const candidate of ranked) {
		const runtime = runtimeBySurface.get(candidate.word);
		if (!runtime || runtime.canonicalTokenIds === null) {
			continue;
		}
		contextRequestedCount.set(
			runtime.contextKey,
			(contextRequestedCount.get(runtime.contextKey) ?? 0) + 1,
		);
		const judged = readJudgedEvidence(candidate);
		const progressive = getProgressiveSurfaceEvidence(runtime.contextKey, candidate.word);
		// Once a candidate has been read far enough to judge, its verified total
		// replaces the bound.
		const optimisticTotal = judged?.total ?? progressive?.totalLogProbability;
		if (optimisticTotal === undefined || !Number.isFinite(optimisticTotal)) {
			continue;
		}
		optimisticTotalByWord.set(candidate.word, optimisticTotal);
		const totals = contextTotals.get(runtime.contextKey);
		const surfaces = contextSurfaces.get(runtime.contextKey);
		if (totals && surfaces) {
			totals.push(optimisticTotal);
			surfaces.push(candidate.word);
		} else {
			contextTotals.set(runtime.contextKey, [optimisticTotal]);
			contextSurfaces.set(runtime.contextKey, [candidate.word]);
		}
		const best = bestTotalByContext.get(runtime.contextKey);
		if (best === undefined || optimisticTotal > best) {
			bestTotalByContext.set(runtime.contextKey, optimisticTotal);
			bestCandidateByContext.set(runtime.contextKey, candidate);
		}
	}

	/**
	 * Whether a shorter member of the same pool is this surface's word-boundary
	 * prefix — `happy path` where `happy` is also present.
	 *
	 * Only a multi-word surface can extend another, and a pool is a set, so this
	 * costs one lookup per space rather than a comparison against every member.
	 */
	const extendsAPoolMember = (surface: string, pool: ReadonlySet<string>): boolean => {
		for (let space = surface.indexOf(' '); space !== -1; space = surface.indexOf(' ', space + 1)) {
			if (pool.has(surface.slice(0, space))) {
				return true;
			}
		}
		return false;
	};

	// A sequence total only falls as more of the sequence is read, so a partial
	// sum over `k` tokens sits above the same surface's total over `m > k`. An
	// extension read less far than the member it continues therefore carries a
	// total above that member's — and because the chain rule narrows the
	// denominator to the pool's minimal members, `exp(total - normaliser)` comes
	// out above 1 for a surface whose own continuation has not been looked at.
	// It needs a three-token first word to happen, which 2.6% of served bigrams
	// have, and it inflates both the posterior the gate reads and the
	// `confidenceScore` every other candidate's margin is measured against.
	//
	// A surface's canonical tokenization begins with the tokenization of its own
	// leading words — the producer encodes `" " + surface` in one call and the
	// ByteLevel pre-tokenizer splits on word boundaries, so no merge crosses a
	// space — which is what makes both corrections below exact rather than
	// approximate.
	//
	// The total is capped at what it continues: `P(happy path)` cannot exceed
	// `P(happy)`. Shortest-first, so a three-word phrase is capped against a
	// two-word prefix that has already been capped itself.
	//
	// And the surface is held unjudgeable until it has been read level with what
	// it continues, because the cap alone would leave it looking exactly as
	// certain as its prefix while saying nothing about its own tail.
	const underReadExtensions = new Set<string>();
	for (const [contextKey, surfaces] of contextSurfaces) {
		const pool = new Set(surfaces);
		for (const surface of [...surfaces].sort((a, b) => a.length - b.length)) {
			const own = optimisticTotalByWord.get(surface);
			if (own === undefined) {
				continue;
			}
			let cap = Infinity;
			let continuedDepth = 0;
			for (
				let space = surface.indexOf(' ');
				space !== -1;
				space = surface.indexOf(' ', space + 1)
			) {
				const prefix = surface.slice(0, space);
				if (!pool.has(prefix)) {
					continue;
				}
				const prefixTotal = optimisticTotalByWord.get(prefix);
				if (prefixTotal !== undefined && prefixTotal < cap) {
					cap = prefixTotal;
				}
				const prefixDepth = runtimeBySurface.get(prefix)?.canonicalTokenIds?.length ?? 0;
				if (prefixDepth > continuedDepth) {
					continuedDepth = prefixDepth;
				}
			}
			if (own > cap) {
				optimisticTotalByWord.set(surface, cap);
			}
			const scoredDepth = getProgressiveSurfaceEvidence(contextKey, surface)?.scoredTokenCount ?? 0;
			const surfaceDepth = runtimeBySurface.get(surface)?.canonicalTokenIds?.length ?? 0;
			if (scoredDepth < continuedDepth && scoredDepth < surfaceDepth) {
				underReadExtensions.add(surface);
			}
		}
	}

	/**
	 * The evidence arbitration judges a candidate on.
	 *
	 * Wraps the depth-unaware read with the pool-relative requirement: a surface
	 * that continues another pool member is not judgeable until it has been read
	 * level with it, so the two totals being compared are taken at comparable
	 * depths.
	 */
	const judgedEvidenceFor = (
		candidate: ScoredCandidate,
	): { complete: boolean; mean: number; total: number } | null =>
		underReadExtensions.has(candidate.word) ? null : readJudgedEvidence(candidate);
	const hasJudgeableEvidence = (candidate: ScoredCandidate): boolean =>
		judgedEvidenceFor(candidate) !== null;

	// Normalise over the pool's minimal members only, and score everyone —
	// extensions included — against that.
	//
	// A sequence total is its prefix's total plus a log-probability that cannot
	// be positive, so summing a surface and its own extension double-counts:
	// `exp(total)` for `happy` already contains every continuation of `happy`,
	// `happy path` among them. Dividing one pool's mass between the two capped
	// the shorter form at half however certain it was, and the longer form below
	// that — both under gates neither could then clear, for a reason that was
	// arithmetic rather than evidence.
	//
	// Excluding extensions from the denominator is the chain rule: the minimal
	// members partition the mass, and an extension's share of that same
	// denominator is `P(prefix) * P(continuation | prefix)`, which is exactly
	// what a multi-word suggestion should be held to. Extensions stay in
	// `contextTotals`, so how contested a context is still counts every scored
	// candidate.
	const logSumExpByContext = new Map<string, number>();
	for (const [contextKey, surfaces] of contextSurfaces) {
		const pool = new Set(surfaces);
		const minimalTotals: number[] = [];
		for (const surface of surfaces) {
			const total = optimisticTotalByWord.get(surface);
			if (total !== undefined && !extendsAPoolMember(surface, pool)) {
				minimalTotals.push(total);
			}
		}
		// An extension is strictly longer than what it extends, so the shortest
		// member of any non-empty pool is always minimal and this is never empty.
		logSumExpByContext.set(contextKey, logSumExp(minimalTotals));
	}

	/**
	 * A candidate's share of its context shortlist's probability mass.
	 *
	 * Pass an optimistic (partially read) total for an upper bound on the
	 * eventual posterior, or a verified total for the posterior itself.
	 */
	const posteriorFor = (candidate: ScoredCandidate, total: number | undefined): number => {
		const runtime = runtimeBySurface.get(candidate.word);
		const normalizer = runtime ? logSumExpByContext.get(runtime.contextKey) : undefined;
		if (total === undefined || normalizer === undefined || !Number.isFinite(normalizer)) {
			return 0;
		}
		return Math.exp(total - normalizer);
	};
	const optimisticPosterior = (candidate: ScoredCandidate): number =>
		posteriorFor(candidate, optimisticTotalByWord.get(candidate.word));
	const judgedPosterior = (candidate: ScoredCandidate): number =>
		posteriorFor(candidate, judgedEvidenceFor(candidate)?.total);

	// A candidate stays in the race for as long as its optimistic posterior
	// could still clear the gate it will be held to. The bound only falls as
	// more tokens are read, so nothing dropped here could have gone on to win.
	const couldClearGate = (candidate: ScoredCandidate): boolean =>
		optimisticPosterior(candidate) >= MIN_LM_POSTERIOR[candidate.termType];
	const passesLmFloor = (candidate: ScoredCandidate): boolean =>
		judgedEvidenceFor(candidate) !== null && couldClearGate(candidate);
	const hasRequiredEvidence = (
		candidate: ScoredCandidate,
	): candidate is ScoredCandidate & {
		lmEvidence: CanonicalLmEvidence;
	} => {
		if (canonicalLmSupported) {
			return passesLmFloor(candidate);
		}
		return candidate.termType === 'word' && candidate.lmEvidence?.source === 'network-logit';
	};

	// ── Stabilization guards (QI-2) ──────────────────────────────────────────
	// Whole-surface repetition: drop a candidate whose full surface already equals
	// the run of tokens immediately before the cursor — accepting it would
	// duplicate what was just typed (`end to end` → `end to end to end`).
	const beforeTokens = tokenize(trimmed);
	const duplicatesPreceding = (c: ScoredCandidate): boolean => {
		const surfaceTokens = tokenize(c.word);
		const n = surfaceTokens.length;
		if (n === 0 || beforeTokens.length < n) {
			return false;
		}
		for (let i = 0; i < n; i++) {
			if (beforeTokens[beforeTokens.length - n + i] !== surfaceTokens[i]) {
				return false;
			}
		}
		return true;
	};
	// Post-accept cooldown: don't re-offer the surface the user just accepted while
	// its cooldown is still active (see cooldown advance near t0).
	const isCooledDown = (c: ScoredCandidate): boolean =>
		cooledSurface !== null && c.word.toLowerCase() === cooledSurface;

	const isStabilized = (candidate: ScoredCandidate): boolean =>
		!duplicatesPreceding(candidate) && !isCooledDown(candidate);
	// A candidate the user has all but finished typing is not worth a ghost, and
	// a candidate we would never show is not worth waiting for either.
	const suggestionLengthFor = (candidate: ScoredCandidate): number =>
		candidate.word.length - (prefixLenByWord.get(candidate.word) ?? currentWord.length);
	const isWorthShowing = (candidate: ScoredCandidate): boolean =>
		suggestionLengthFor(candidate) >= MIN_SUGGESTION_LENGTH;
	const evidenceBacked = ranked.filter(
		(candidate) => hasRequiredEvidence(candidate) && isStabilized(candidate),
	);

	const confidenceScore = (candidate: ScoredCandidate): number => {
		if (!canonicalLmSupported) {
			return candidate.finalScore;
		}
		const runtime = runtimeBySurface.get(candidate.word);
		if (runtime?.canonicalTokenIds === null || !optimisticTotalByWord.has(candidate.word)) {
			return candidate.stage1Score;
		}
		return STAGE1_WEIGHT * candidate.stage1Score + STAGE2_WEIGHT * optimisticPosterior(candidate);
	};
	const exactConfidenceScore = (candidate: ScoredCandidate): number => {
		if (!canonicalLmSupported || judgedEvidenceFor(candidate) === null) {
			return candidate.finalScore;
		}
		return STAGE1_WEIGHT * candidate.stage1Score + STAGE2_WEIGHT * judgedPosterior(candidate);
	};

	/**
	 * How many candidates in this one's context were scored at all.
	 *
	 * Read off pool membership, which counts every candidate that contributed a
	 * total, rather than off the normaliser, which the chain rule narrows to the
	 * pool's minimal members.
	 */
	const scoredPoolSize = (candidate: ScoredCandidate): number => {
		const contextKey = runtimeBySurface.get(candidate.word)?.contextKey;
		return contextKey === undefined ? 0 : (contextTotals.get(contextKey)?.length ?? 0);
	};

	/**
	 * How many candidates the context held before any of them were scored.
	 *
	 * A pool of one means two opposite things. Either the vocabulary offered a
	 * single continuation of what was typed, which is the least contested case
	 * there is; or rivals were offered and have not been read yet, which is the
	 * least informed. Only the second deserves refusing, and the two are
	 * distinguishable exactly here.
	 */
	const requestedPoolSize = (candidate: ScoredCandidate): number => {
		const contextKey = runtimeBySurface.get(candidate.word)?.contextKey;
		return contextKey === undefined ? 0 : (contextRequestedCount.get(contextKey) ?? 0);
	};

	// A suppressed short completion still counts as competition below, so losing
	// to one abstains rather than promoting the runner-up in its place.
	const gateCleared = evidenceBacked
		.filter(isWorthShowing)
		.map((candidate) => ({
			candidate,
			posterior: judgedPosterior(candidate),
			score: exactConfidenceScore(candidate),
		}))
		// The gate is the model's own confidence in the surface; the blended score
		// only orders what has already cleared it, so a strong corpus prior can no
		// longer carry a surface the model is unsure of onto the screen.
		.filter(({ candidate, posterior }) => posterior >= MIN_LM_POSTERIOR[candidate.termType]);
	/**
	 * Whether the model finds the surface plausible on its own terms.
	 *
	 * The gate above asks which candidate won its pool; this asks whether
	 * winning it meant anything. The two come apart exactly where a pool is
	 * thin — a shortlist of one hands its only member 1.0 by construction — and
	 * a relative test can never see through that however it is tuned.
	 *
	 * Waived without canonical scoring, where there is no judged mean to test
	 * and the network-logit path would otherwise refuse everything.
	 */
	const isPlausibleSurface = (candidate: ScoredCandidate): boolean => {
		if (!canonicalLmSupported) {
			return true;
		}
		const mean = judgedEvidenceFor(candidate)?.mean;
		return mean !== undefined && mean >= MIN_MEAN_TOKEN_LOG_PROBABILITY;
	};
	// Kept as its own stage rather than folded into the gate so the three
	// populations stay separable in the abstain cascade: cleared its pool and was
	// implausible, was plausible and had nothing to clear the pool against, or
	// cleared both. A candidate refused here stays in `ranked` and so still
	// counts as competition below — promoting the runner-up in place of an
	// implausible leader would show something worse, not something better.
	const plausible = gateCleared.filter(({ candidate }) => isPlausibleSurface(candidate));
	// Applied after the gate rather than folded into it, so the two populations
	// stay separable: a surface refused here cleared its threshold and was
	// refused for having had nothing to clear it against.
	const eligible = plausible
		.filter(
			({ candidate }) =>
				!canonicalLmSupported ||
				scoredPoolSize(candidate) >= MIN_SCORED_POOL_SIZE ||
				requestedPoolSize(candidate) <= 1,
		)
		.sort((a, b) => b.score - a.score);
	const selected = eligible[0]?.candidate;
	const selectedDisplayScore = eligible[0]?.score ?? 0;
	const selectedEvidence = selected && hasRequiredEvidence(selected) ? selected.lmEvidence : null;
	/**
	 * Whether `longer` is `shorter` continued past a word boundary, in the same
	 * normaliser.
	 *
	 * Shared by the two places that have to agree on what an extension is: the
	 * chain rule, which stops dividing a pool's mass between a sequence and its
	 * own prefix, and the winner margin below, which stops treating one as the
	 * other's rival. They were the same category error and are now the same test.
	 */
	const extendsInSamePool = (shorter: ScoredCandidate, longer: ScoredCandidate): boolean => {
		if (longer.word === shorter.word || !optimisticTotalByWord.has(longer.word)) {
			return false;
		}
		const pool = runtimeBySurface.get(shorter.word)?.contextKey;
		if (pool === undefined || runtimeBySurface.get(longer.word)?.contextKey !== pool) {
			return false;
		}
		return (
			longer.word.length > shorter.word.length &&
			longer.word.startsWith(shorter.word) &&
			longer.word[shorter.word.length] === ' '
		);
	};
	// A candidate that extends the selection is not competing with it. Whichever
	// continuation the user meant, the shorter surface is a correct ghost — it is
	// the prefix of both — so the margin has nothing to arbitrate and charging the
	// selection for its own extension abstains on a case that could not be wrong.
	// The chain rule already removed this from the denominator; leaving it in the
	// margin meant a nested leader cleared its gate and then lost to the candidate
	// that had just been freed from dividing its mass. It penalised bigrams and
	// phrases specifically, because a nested pool is where they mostly appear.
	const runnerUpScore = selected
		? Math.max(
				...ranked
					.filter(
						(candidate) =>
							candidate.word !== selected.word &&
							isStabilized(candidate) &&
							!extendsInSamePool(selected, candidate),
					)
					.map(confidenceScore),
				0,
			)
		: 0;
	const winnerMargin = selected ? selectedDisplayScore - runnerUpScore : 0;
	const hasMissingArtifactCompetitor =
		canonicalLmSupported &&
		ranked.some((candidate) => {
			const runtime = runtimeBySurface.get(candidate.word);
			return runtime?.separatorKind === 'whitespace' && runtime.canonicalTokenIds === null;
		});
	// A candidate with canonical tokens but no evidence at all cannot join the
	// posterior: it has no likelihood to contribute, and any stand-in value would
	// distort the normaliser for every other candidate in its context. Absent
	// evidence is not evidence of absence though — the context's boundary may
	// simply not be primed yet — so it holds the ghost back instead of being
	// silently ignored. In a primed context every candidate has at least
	// first-token evidence, so this only fires while a context is still cold.
	const hasUnscoredCompetitor =
		canonicalLmSupported &&
		ranked.some((candidate) => {
			const runtime = runtimeBySurface.get(candidate.word);
			return (
				candidate.word !== selected?.word &&
				runtime?.canonicalTokenIds !== null &&
				runtime?.canonicalTokenIds !== undefined &&
				!optimisticTotalByWord.has(candidate.word) &&
				isStabilized(candidate) &&
				isWorthShowing(candidate)
			);
		});
	// A rival only holds the ghost back while it is still too unread to judge.
	// Under full-surface evidence that meant any long surface blocked everything
	// until every one of its tokens had been paid for, which abstained far more
	// often than it ever changed the winner. A rival now becomes judgeable after
	// `REQUIRED_VERIFIED_TOKENS`, so this settles within the budget.
	const hasUnresolvedPotential =
		canonicalLmSupported &&
		ranked.some((candidate) => {
			const runtime = runtimeBySurface.get(candidate.word);
			return (
				candidate.word !== selected?.word &&
				runtime?.canonicalTokenIds !== null &&
				runtime?.canonicalTokenIds !== undefined &&
				!hasJudgeableEvidence(candidate) &&
				couldClearGate(candidate) &&
				isStabilized(candidate) &&
				isWorthShowing(candidate)
			);
		});
	const requiredWinnerMargin =
		MIN_WINNER_MARGIN +
		(selected && judgedEvidenceFor(selected)?.complete === false
			? PARTIAL_EVIDENCE_MARGIN_PREMIUM
			: 0);
	// Everything the display decision needs except the veto itself. Splitting it
	// out is what lets the veto be priced: the value here at the moment the veto
	// fires is exactly the ghost the veto cost us.
	const clearsMarginBeforeColdVeto =
		selected !== undefined && !hasMissingArtifactCompetitor && winnerMargin >= requiredWinnerMargin;
	const clearsWinnerMargin = clearsMarginBeforeColdVeto && !hasUnscoredCompetitor;

	const suggestion =
		displayPrefixReady && selected && clearsWinnerMargin
			? selected.word.slice(prefixLenByWord.get(selected.word) ?? currentWord.length)
			: null;

	// Which constraint bound. Computed on every evaluation rather than only under
	// debug, because it is counted for the session as well as printed, and
	// deriving the debug header from it keeps the two from disagreeing.
	const resolveAbstainReason = (): CtcAbstainReason | null => {
		if (suggestion !== null && suggestion.length > 0) {
			return null;
		}
		if (!displayPrefixReady) {
			return 'prefetch';
		}
		if (ranked.length === 0) {
			return 'no-candidate';
		}
		if (hasMissingArtifactCompetitor) {
			return 'missing-artifact';
		}
		if (hasUnscoredCompetitor) {
			return 'cold-competitor';
		}
		if (hasUnresolvedPotential && !clearsWinnerMargin) {
			return 'unresolved-rival';
		}
		if (eligible.length > 0) {
			return selected && !clearsWinnerMargin ? 'winner-margin' : 'empty-completion';
		}
		if (plausible.length > 0) {
			// Cleared its gate, was plausible on its own terms, and was refused for
			// the shortlist it cleared that gate against holding nobody else.
			return 'lone-candidate';
		}
		if (gateCleared.length > 0) {
			// Held the largest share of its shortlist and still was not a surface
			// the model found plausible — which is only possible because a share is
			// relative and this is not.
			return 'implausible-surface';
		}
		if (
			evidenceBacked.length > 0 &&
			evidenceBacked.every((candidate) => !isWorthShowing(candidate))
		) {
			return 'short-completion';
		}
		// The floor and the gate are one threshold, applied to the bound and to
		// the verified value, so a candidate short of it is dropped before
		// `evidenceBacked` is built. Asking whether anything was judgeable
		// separates a gate that rejected read candidates from a context where
		// nothing was read at all — the first is a threshold to calibrate, the
		// second is scheduling.
		return ranked.some(hasJudgeableEvidence) ? 'below-posterior-gate' : 'no-evidence';
	};
	const abstainReason: CtcAbstainReason | null = resolveAbstainReason();
	recordPredictionOutcome({
		abstainReason,
		awaitingAsyncEvidence: hasUnresolvedPotential && !clearsWinnerMargin,
		scoredCandidateCount: ranked.length,
		textBefore,
	});

	// The leader is the best-supported candidate, not the selected one: an
	// evaluation that showed nothing is exactly the one whose posterior needs
	// recording, and it has no selection to report.
	const posteriorLeader = ranked.reduce<{
		candidate: ScoredCandidate;
		posterior: number;
	} | null>((best, candidate) => {
		const posterior = optimisticPosterior(candidate);
		return posterior > 0 && (best === null || posterior > best.posterior)
			? { candidate, posterior }
			: best;
	}, null);
	/**
	 * The longer surface in the leader's normaliser that extends the given
	 * candidate, if the pool holds one.
	 *
	 * `logSumExp` divides one pool's mass between a sequence and its own prefix,
	 * and the longer total is the shorter one plus a log-probability that cannot
	 * be positive — so the longer form holds at most half, or at most a third
	 * where both shorter forms are present. Both sit under the gate it is held
	 * to, so it cannot display however certain its continuation is.
	 *
	 * Asked from the shorter form because that is the one that leads: the
	 * extending candidate is strictly lower in the same pool and so can never be
	 * the leader.
	 */
	const poolExtensionOf = (shorter: ScoredCandidate): ScoredCandidate | undefined =>
		ranked.find((candidate) => extendsInSamePool(shorter, candidate));

	if (isAutocompleteDebugEnabled()) {
		const verbose = isAutocompleteDebugVerbose();
		const latencyMs = performance.now() - t0;
		const tokens = tokenize(trimmed);
		const contextWords = tokens.slice(-CONTEXT_WORDS);

		// Decision drives the (collapsed) group header. Abstains carry the reason
		// the session counters recorded, plus the numbers behind it, so it is clear
		// *why* nothing showed without expanding the group.
		const abstainDetail: Record<CtcAbstainReason, string> = {
			'below-posterior-gate': `posterior below ${
				MIN_LM_POSTERIOR[(posteriorLeader?.candidate ?? ranked[0]).termType]
			} (best ${(posteriorLeader?.posterior ?? 0).toFixed(2)})`,
			'cold-competitor': 'competitor has no LM evidence yet',
			'empty-completion': 'empty completion',
			'implausible-surface': `mean per-token log-probability below ${MIN_MEAN_TOKEN_LOG_PROBABILITY} (best ${gateCleared
				.map(({ candidate }) => judgedEvidenceFor(candidate)?.mean ?? -Infinity)
				.reduce((best, mean) => Math.max(best, mean), -Infinity)
				.toFixed(2)})`,
			'lone-candidate': `cleared its gate against fewer than ${MIN_SCORED_POOL_SIZE} scored candidates, rivals unread`,
			'missing-artifact': 'canonical artifact coverage missing',
			'no-candidate': 'nothing cleared scoring',
			'no-evidence': 'full-surface evidence absent',
			// Recorded at the two exits above this block, so they never print here.
			'no-surface-token': 'no trailing surface token',
			'not-initialized': 'vocabulary not loaded',
			prefetch: `prefetch: ${currentWord.length}/${DISPLAY_MIN_PREFIX_LENGTH} chars`,
			'short-completion': `completion shorter than ${MIN_SUGGESTION_LENGTH} chars`,
			'unresolved-rival': 'expanding plausible token-prefix groups',
			'winner-margin': `winner margin ${winnerMargin.toFixed(2)} < ${requiredWinnerMargin.toFixed(2)}`,
		};
		const decision =
			abstainReason === null
				? `✨ "${suggestion ?? ''}"`
				: abstainReason === 'prefetch'
					? `⏳ ${abstainDetail.prefetch}`
					: `— abstain: ${abstainDetail[abstainReason]}`;

		lastPredictionDebug = {
			awaitingAsyncEvidence: hasUnresolvedPotential && !clearsWinnerMargin,
			textBefore: trimmed,
			currentWord,
			decision,
			mode,
			contextWords,
			topCandidates: ranked.slice(0, 5).map((r) => ({
				word: r.word,
				finalScore: r.finalScore,
				semanticScore: r.semanticScore,
				freqScore: r.freqScore,
				lmScore: r.lmScore,
			})),
			suggestion: suggestion && suggestion.length > 0 ? suggestion : null,
		};

		// Mode describes the semantic-vector source without implying that a
		// network backend ran; the snapshot may come from the local MLC embedder.
		const slowLaneVec = getStoredContextVector();
		const isUsingSlowLaneVector =
			slowLaneVec !== null && vectorStore !== null && slowLaneVec.length === vectorStore.dim;
		const modeLabel = !contextVector
			? 'COLD'
			: isUsingSlowLaneVector
				? 'WARM(semantic)'
				: 'WARM(local-avg)';
		const modeColor =
			modeLabel === 'WARM(semantic)'
				? CTC_STYLES.good
				: modeLabel === 'WARM(local-avg)'
					? CTC_STYLES.warn
					: CTC_STYLES.cold;

		// Group header: [CTC:<mode>] <decision> · <mode> · <type> · <latency>
		// arbitrationMode ('v1') tags the line so this deploy's logs diff cleanly
		// against the baseline deploy's.
		// eslint-disable-next-line no-console
		console.groupCollapsed(
			`%c[CTC:${ARBITRATION_MODE}]%c ${decision} %c· ${modeLabel}${selected ? ` · ${selected.termType}` : ''} · ⏱ ${latencyMs.toFixed(1)}ms`,
			CTC_STYLES.brand,
			CTC_STYLES.body,
			modeColor,
		);

		const semanticInput = getStoredContextInput();
		const causalPrompts = primeRequests.map((request, index) => {
			const tail = request.prompt.slice(-DEBUG_TEXT_TAIL_CHARS);
			return `#${index + 1}:${JSON.stringify(tail)}`;
		});

		// Keep the exact model inputs separate from normalized lookup tokens.
		ctcSection(
			'INPUT',
			`raw: ${JSON.stringify(trimmed.slice(-DEBUG_TEXT_TAIL_CHARS))} · prev: ${previousWord ? JSON.stringify(previousWord) : '—'}`,
		);
		ctcSection(
			'LOOKUP',
			`normalized(last ${CONTEXT_WORDS}): ${contextWords.length ? JSON.stringify(contextWords.join(' ')) : '(none)'}`,
		);
		ctcSection(
			'SEMANTIC',
			`snapshot: ${semanticInput ? JSON.stringify(semanticInput.slice(-DEBUG_TEXT_TAIL_CHARS)) : '(unavailable)'}`,
		);
		ctcSection(
			'CAUSAL',
			`prompt${causalPrompts.length === 1 ? '' : 's'}: ${causalPrompts.join(' · ') || '(not ready)'}`,
		);

		// SIGNALS — semantic state plus context-keyed canonical LM coverage.
		const logitCount = lmLogits ? Object.keys(lmLogits).length : 0;
		const semanticStatus = isUsingSlowLaneVector
			? `semantic ✅ snapshot(${slowLaneVec?.length}d)`
			: vectorStore
				? 'semantic ⚠️ local-avg'
				: 'semantic ❌ cold';
		const tierACount = ranked.filter(
			(candidate) => candidate.lmEvidence?.source === 'canonical-first-token',
		).length;
		const exactCount = ranked.filter(
			(candidate) => candidate.lmEvidence?.source === 'canonical-full-surface',
		).length;
		const boundaryReady = primeRequests.filter(
			(request) => getBoundaryLmState(request.contextKey) !== null,
		).length;
		const artifactEligible = canonicalMatched.filter(
			(candidate) => candidate.canonicalTokenIds !== null,
		).length;
		const documentStartFallbacks = canonicalMatched.filter(
			(candidate) => candidate.separatorKind === 'document-start',
		).length;
		const punctuationFallbacks = canonicalMatched.filter(
			(candidate) => candidate.separatorKind === 'non-space',
		).length;
		const logitsStatus =
			tierACount + exactCount > 0
				? `canonical ✅ first-token:${tierACount} exact:${exactCount}`
				: logitCount > 0
					? `network logits ✅ ${logitCount}`
					: 'canonical ⏳/absent';
		const formula =
			tierACount + exactCount + logitCount > 0
				? `Stage1×${STAGE1_WEIGHT}+LM×${STAGE2_WEIGHT}`
				: 'Stage1-only';
		ctcSection('SIGNALS', `${semanticStatus} · ${logitsStatus} · ${formula}`);
		ctcSection(
			'CANONICAL',
			`eligible ${artifactEligible}/${canonicalMatched.length} · separator fallback doc:${documentStartFallbacks} punct:${punctuationFallbacks} · contexts ${boundaryReady}/${primeRequests.length} ready (≤${PHRASE_MAX_WORDS}) · family=${familyKey.slice(0, 72) || 'none'}`,
		);
		if (verbose && logitCount > 0 && lmLogits) {
			const rawLmTop = Object.entries(lmLogits)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([word, score]) => `${word}:${score.toFixed(3)}`)
				.join(', ');
			ctcSection('  rawLM', `🧠 ${rawLmTop}`);
		}

		// GENERATE — how many candidates matched, split by term type
		const genByType: Record<TermType, number> = { word: 0, bigram: 0, phrase: 0 };
		for (const m of canonicalMatched) {
			genByType[m.node.termType] += 1;
		}
		ctcSection(
			'GENERATE',
			`matched ${canonicalMatched.length} → word:${genByType.word} bigram:${genByType.bigram} phrase:${genByType.phrase}${canonicalLmSupported ? ' · display needs exact surface evidence' : ''}`,
		);

		// SCORE — Stage-1 + grammar funnel and canonical evidence depth.
		const lmCoverage = ranked.slice(0, 10).filter((r) => r.lmScore > 0).length;
		ctcSection(
			'SCORE',
			`in ${pipelineDebug.initial} → stage1(<${MIN_STAGE1_SCORE}) −${pipelineDebug.stage1Rejected.length} → grammar −${pipelineDebug.grammarRejected.length} → final ${pipelineDebug.final} · LM cov ${lmCoverage}/${Math.min(ranked.length, 10)} · first-token ${tierACount} · exact ${exactCount}`,
		);
		if (grammarMeta) {
			ctcSection(
				'  grammar',
				`"${grammarMeta.prevWord}" [${grammarMeta.prevTags.join('|')}] ${grammarMeta.before}→${grammarMeta.after}${verbose && grammarMeta.dropped.length > 0 ? ` · dropped: ${grammarMeta.dropped.join(', ')}` : ''}`,
			);
		}

		const gateReasonFor = (candidate: ScoredCandidate): string => {
			const runtime = runtimeBySurface.get(candidate.word);
			if (runtime?.separatorKind !== 'whitespace') {
				return `separator:${runtime?.separatorKind ?? 'unknown'}`;
			}
			if (runtime.canonicalTokenIds === null) {
				return 'missing-artifact';
			}
			if (!hasJudgeableEvidence(candidate)) {
				return `awaiting-tokens:${REQUIRED_VERIFIED_TOKENS}`;
			}
			if (!passesLmFloor(candidate)) {
				return `bound:${optimisticPosterior(candidate).toFixed(2)}<${MIN_LM_POSTERIOR[candidate.termType]}`;
			}
			if (duplicatesPreceding(candidate)) {
				return 'repetition';
			}
			if (isCooledDown(candidate)) {
				return 'cooldown';
			}
			if (!isWorthShowing(candidate)) {
				return `suffix:${suggestionLengthFor(candidate)}<${MIN_SUGGESTION_LENGTH}`;
			}
			const floor = MIN_LM_POSTERIOR[candidate.termType];
			const posterior = judgedPosterior(candidate);
			if (posterior < floor) {
				return `posterior:${posterior.toFixed(2)}<${floor}`;
			}
			if (!isPlausibleSurface(candidate)) {
				return `implausible:${(judgedEvidenceFor(candidate)?.mean ?? NaN).toFixed(2)}<${MIN_MEAN_TOKEN_LOG_PROBABILITY}`;
			}
			return 'eligible';
		};
		const gateFunnel = (termType: TermType): string => {
			const typeRanked = ranked.filter((candidate) => candidate.termType === termType);
			const exact = typeRanked.filter(hasJudgeableEvidence);
			const absolute = exact.filter(passesLmFloor);
			const stabilized = absolute.filter(isStabilized);
			const longEnough = stabilized.filter(isWorthShowing);
			const floorPassed = longEnough.filter(
				(candidate) => judgedPosterior(candidate) >= MIN_LM_POSTERIOR[termType],
			);
			const plausiblePassed = floorPassed.filter(isPlausibleSurface);
			return `${termType} m:${genByType[termType]} r:${typeRanked.length} exact:${exact.length} abs:${absolute.length} stable:${stabilized.length} suffix:${longEnough.length} floor:${floorPassed.length} plausible:${plausiblePassed.length} eligible:${eligible.filter(({ candidate }) => candidate.termType === termType).length}`;
		};
		ctcSection(
			'GATES',
			`${gateFunnel('word')}  |  ${gateFunnel('bigram')}  |  ${gateFunnel('phrase')}`,
		);

		// One line per context: how many candidates share the normaliser, and how
		// much of the mass the leader holds. A leader well under its threshold
		// means the context is contested, which is the abstention we want.
		const contextLeaders = Array.from(bestCandidateByContext.entries())
			.slice(0, PHRASE_MAX_WORDS)
			.map(([contextKey, leader]) => {
				const shortlistSize = contextTotals.get(contextKey)?.length ?? 0;
				const evidenceKind = hasExactEvidence(leader) ? 'exact' : 'upper';
				return `${contextKey.slice(0, 32)} → n=${shortlistSize} ${leader.termType}:"${leader.word}" ${evidenceKind} p=${optimisticPosterior(leader).toFixed(3)}/${MIN_LM_POSTERIOR[leader.termType]}`;
			})
			.join(' | ');
		ctcSection(
			'NORMALIZE',
			contextLeaders.length > 0 ? contextLeaders : 'no scored candidate in any context',
		);
		ctcSection(
			'READINESS',
			`prefix ${currentWord.length}/${DISPLAY_MIN_PREFIX_LENGTH} · boundary ${boundaryReady}/${primeRequests.length} · exact word:${ranked.filter((candidate) => candidate.termType === 'word' && hasExactEvidence(candidate)).length} bigram:${ranked.filter((candidate) => candidate.termType === 'bigram' && hasExactEvidence(candidate)).length} phrase:${ranked.filter((candidate) => candidate.termType === 'phrase' && hasExactEvidence(candidate)).length} · ${suggestion ? 'display-ready' : decision}`,
		);

		// ARBITRATE — expose every condition that can authorize or suppress ghost.
		const topOfType = (t: TermType): ScoredCandidate | undefined =>
			ranked.find((c) => c.termType === t);
		const fmtType = (t: TermType): string => {
			const top = topOfType(t);
			if (!top) {
				return `${t}:—`;
			}
			const floor = MIN_LM_POSTERIOR[t];
			const bound = optimisticPosterior(top);
			const evidence = hasRequiredEvidence(top)
				? 'TierB✅'
				: `${top.lmEvidence?.source ?? 'absent'}❌`;
			return `${t}:"${top.word}" p≤${bound.toFixed(3)}${bound >= floor ? '≥' : '<'}${floor} fs≤${confidenceScore(top).toFixed(2)} ${evidence}`;
		};
		ctcSection(
			'ARBITRATE',
			`${selected ? `▸ ${selected.termType} "${selected.word}" fs=${selectedDisplayScore.toFixed(2)} mean=${selectedEvidence?.meanTokenLogProbability?.toFixed(2) ?? 'network'} margin=${winnerMargin.toFixed(2)}${clearsWinnerMargin ? '✅' : '❌'}` : '▸ (none)'} · prefix ${currentWord.length}/${DISPLAY_MIN_PREFIX_LENGTH}${displayPrefixReady ? '✅' : '⏳'} · grouped pending ${hasUnresolvedPotential ? 'yes' : 'no'}  |  ${fmtType('word')}  ${fmtType('bigram')}  ${fmtType('phrase')}`,
		);

		// STABILIZE — post-accept cooldown + whole-surface repetition (QI-2)
		const repetitionBlocked = ranked
			.filter((c) => hasRequiredEvidence(c) && duplicatesPreceding(c))
			.map((c) => c.word);
		const cooldownLabel = cooledSurface
			? `cooldown "${cooledSurface}" (${acceptCooldown?.predictionsSince ?? 0}/${COOLDOWN_KEYSTROKES} keys · ${COOLDOWN_MS}ms)`
			: 'cooldown —';
		ctcSection(
			'STABILIZE',
			`${cooldownLabel} · repetition-blocked: ${repetitionBlocked.length > 0 ? repetitionBlocked.join(', ') : '—'}`,
		);

		// CANDIDATES — full scored table (verbose only)
		if (verbose && ranked.length > 0) {
			const tableData = ranked.slice(0, 10).map((r) => {
				let rawLogit: string | number = 'Not in Payload';
				if (r.lmEvidence?.rawLogit !== undefined) {
					rawLogit = Number(r.lmEvidence.rawLogit.toFixed(5));
				} else if (prefixLmLogits) {
					const val = prefixLmLogits[r.word.toLowerCase()];
					if (val !== undefined) {
						rawLogit = Number(val.toFixed(5));
					}
				}

				const original = scoringCandidates.find((sc) => sc.word === r.word);
				const runtime = runtimeBySurface.get(r.word);
				const progress = runtime ? getProgressiveSurfaceEvidence(runtime.contextKey, r.word) : null;
				const optimisticTotal = optimisticTotalByWord.get(r.word);
				const normalizer = runtime ? logSumExpByContext.get(runtime.contextKey) : undefined;
				const shortlistSize = runtime ? (contextTotals.get(runtime.contextKey)?.length ?? 0) : 0;
				const contextLeader = runtime ? bestCandidateByContext.get(runtime.contextKey) : undefined;
				let source = 'Unknown';
				if (original) {
					if (original.termType === 'bigram') {
						source = '🔗 L2 (Bigram)';
					} else if (original.termType === 'phrase') {
						source = '🧩 L2 (Phrase)';
					} else if (original.docFreq === 0 && original.tenantFreq === L3_BASELINE_FREQ) {
						source = '🌍 L3 (Generic)';
					} else if (original.sessionFreq > 0 && original.tenantFreq === 0) {
						source = '👤 L1 (Session Only)';
					} else {
						source = '🏢 L2 (Domain)';
					}
				}

				const floor = MIN_LM_POSTERIOR[r.termType];
				return {
					Candidate: r.word,
					Source: source,
					Type: r.termType,
					'Final Score': Number(r.finalScore.toFixed(4)),
					'Bounded Score': Number(confidenceScore(r).toFixed(4)),
					'Exact Gate Score': hasExactEvidence(r)
						? Number(exactConfidenceScore(r).toFixed(4))
						: '—',
					Floor: floor,
					'Posterior Floor': optimisticPosterior(r) >= floor ? '✅' : '❌',
					'LM Floor': hasExactEvidence(r) ? (passesLmFloor(r) ? '✅' : '❌') : '⏳',
					'Gate Reason': gateReasonFor(r),
					'Display Eligible':
						hasRequiredEvidence(r) && isStabilized(r) && judgedPosterior(r) >= floor ? '✅' : '❌',
					Semantics: Number(r.semanticScore.toFixed(4)),
					Freq: Number(r.freqScore.toFixed(4)),
					'LM Score': Number(r.lmScore.toFixed(4)),
					'LM Evidence': r.lmEvidence?.source ?? 'absent',
					'Verified Tokens': r.lmEvidence
						? `${r.lmEvidence.verifiedTokenCount}/${r.lmEvidence.totalTokenCount}`
						: '0/0',
					'Progressive Tokens': progress
						? `${progress.scoredTokenCount}/${progress.totalTokenCount}`
						: '0/0',
					'LM Mean Upper':
						progress !== null ? Number(progress.meanTokenLogProbabilityUpperBound.toFixed(5)) : '—',
					'Optimistic Total':
						optimisticTotal !== undefined ? Number(optimisticTotal.toFixed(5)) : '—',
					'Context logSumExp':
						normalizer !== undefined && Number.isFinite(normalizer)
							? Number(normalizer.toFixed(5))
							: '—',
					'Shortlist Size': shortlistSize,
					'Posterior (bound)': Number(optimisticPosterior(r).toFixed(5)),
					'Posterior (judged)': hasJudgeableEvidence(r)
						? Number(judgedPosterior(r).toFixed(5))
						: '—',
					'Context Leader': contextLeader ? `${contextLeader.termType}:${contextLeader.word}` : '—',
					'Verified Chars': r.lmEvidence
						? `${r.lmEvidence.verifiedCharCount}/${r.lmEvidence.totalSurfaceCharCount}`
						: `0/${r.word.length}`,
					Separator: runtime?.separatorKind ?? 'unknown',
					'Canonical Eligibility':
						runtime?.separatorKind !== 'whitespace'
							? 'incompatible-separator'
							: runtime.canonicalTokenIds === null
								? 'missing-artifact'
								: 'eligible',
					'Artifact Tokens': runtime?.canonicalTokenIds?.join(',') ?? 'absent',
					'Context Key': runtime?.contextKey ?? '—',
					'Exact Total':
						r.lmEvidence?.totalLogProbability !== undefined
							? Number(r.lmEvidence.totalLogProbability.toFixed(5))
							: '—',
					'Exact Mean':
						r.lmEvidence?.meanTokenLogProbability !== undefined
							? Number(r.lmEvidence.meanTokenLogProbability.toFixed(5))
							: '—',
					Assoc:
						typeof original?.association === 'number'
							? Number(original.association.toFixed(4))
							: '—',
					'Raw Logit': rawLogit,
					'Session Freq': original?.sessionFreq || 0,
				};
			});

			// eslint-disable-next-line no-console
			console.table(tableData);
		}

		// eslint-disable-next-line no-console
		console.groupEnd();
	}

	const selectedContextKey = selected ? runtimeBySurface.get(selected.word)?.contextKey : undefined;

	return suggestion && suggestion.length > 0 && selected && selectedEvidence
		? {
				text: suggestion,
				surface: selected.word,
				termType: selected.termType,
				posterior: judgedPosterior(selected),
				meanTokenLogProbability: judgedEvidenceFor(selected)?.mean ?? NaN,
				poolHeldExtension: poolExtensionOf(selected) !== undefined,
				shortlistSize:
					selectedContextKey === undefined
						? 1
						: (contextTotals.get(selectedContextKey)?.length ?? 1),
				rankScore: selectedDisplayScore,
				evidenceTier:
					selectedEvidence?.source === 'network-logit' ? 'network-logit' : 'canonical-full-surface',
				evidenceDepth: {
					verifiedTokens: selectedEvidence?.verifiedTokenCount ?? 0,
					totalTokens: selectedEvidence?.totalTokenCount ?? 0,
					verifiedChars: selectedEvidence?.verifiedCharCount ?? 0,
					totalChars: selected.word.length,
				},
				winnerMargin,
			}
		: null;
};

// ─── Data Loading ────────────────────────────────────────────────────────────

interface VocabularyJson {
	words: Record<
		string,
		{
			author_freq: number;
			doc_freq: number;
			freq: number;
		}
	>;
}

const isVocabularyJson = (payload: unknown): payload is VocabularyJson => {
	if (payload == null || typeof payload !== 'object') {
		return false;
	}
	const words = (payload as { words?: unknown }).words;
	return words != null && typeof words === 'object';
};

const isStringArray = (payload: unknown): payload is string[] =>
	Array.isArray(payload) && payload.every((entry) => typeof entry === 'string');

type WordIndexPayload = Record<string, number> | { index: Record<string, number> };

const isWordToOffsetMap = (value: unknown): value is Record<string, number> =>
	value != null &&
	typeof value === 'object' &&
	Object.values(value as Record<string, unknown>).every((entry) => typeof entry === 'number');

const isWordIndexPayload = (payload: unknown): payload is WordIndexPayload => {
	if (payload == null || typeof payload !== 'object') {
		return false;
	}
	const index = (payload as { index?: unknown }).index;
	return index === undefined ? isWordToOffsetMap(payload) : isWordToOffsetMap(index);
};

/**
 * The word index has shipped both bare and wrapped in `{ index: ... }`, so
 * accept either rather than silently building an empty vector store.
 */
const unwrapWordIndex = (payload: WordIndexPayload): Record<string, number> => {
	const wrapped = (payload as { index?: Record<string, number> }).index;
	return wrapped ?? (payload as Record<string, number>);
};

/**
 * Per-term stats shape for `bigrams.json` / `phrases.json`. Field names/types
 * confirmed against the producer (`l2_vocabulary_creation._build_ngram_stat_payload`
 * + `artifact_release._validate_ngram_payload`): `freq`/`doc_freq`/`author_freq`
 * are ints, `pos_seq` a string array, `head_pos` a string or null, `association`
 * a number.
 */
interface PhraseStatsJson {
	association?: number;
	author_freq: number;
	doc_freq: number;
	freq: number;
	head_pos?: string | null;
	pos_seq?: string[];
}

/** Normalized `{term: stats}` map after unwrapping any producer wrapper key. */
type PhraseArtifactJson = Record<string, PhraseStatsJson>;

const isPhraseStats = (value: unknown): value is PhraseStatsJson =>
	value != null &&
	typeof value === 'object' &&
	typeof (value as { freq?: unknown }).freq === 'number';

const isTermStatsMap = (value: unknown): value is PhraseArtifactJson => {
	if (value == null || typeof value !== 'object') {
		return false;
	}
	const values = Object.values(value as Record<string, unknown>);
	return values.length > 0 && values.every(isPhraseStats);
};

/**
 * Normalize a `bigrams.json` / `phrases.json` payload into a flat
 * `{term: stats}` map. Tolerant of the exact wire shape (not yet finalized by
 * the producer): accepts either the flat map from spec §9 or a single wrapper
 * key (`terms`/`bigrams`/`phrases`/`words`). Returns `null` if unrecognized.
 *
 * :params:
 *   payload: Raw JSON parsed from the artifact endpoint
 * :returns:
 *   A `{term: stats}` map, or `null` when the shape is not a term-stats map
 */
const normalizePhraseArtifact = (payload: unknown): PhraseArtifactJson | null => {
	if (payload == null || typeof payload !== 'object') {
		return null;
	}
	if (isTermStatsMap(payload)) {
		return payload;
	}
	const obj = payload as Record<string, unknown>;
	for (const key of ['terms', 'bigrams', 'phrases', 'words']) {
		if (isTermStatsMap(obj[key])) {
			return obj[key] as PhraseArtifactJson;
		}
	}
	return null;
};

export const loadVectorsAsync = async (options?: {
	isLocalLLM?: boolean;
	surface?: string;
}): Promise<void> => {
	if (vectorStore || vectorsLoadStarted) {
		return;
	}
	const isLocalLLM = options?.isLocalLLM ?? false;
	const surface = options?.surface;
	vectorsLoadStarted = true;
	startExp(EXPERIENCE_NAME.LOAD_VECTORS, 'singleton', {
		isLocalLLM,
		...(surface ? { surface } : {}),
	});

	try {
		const buffer = await fetchAutocompleteArtifactBinary(
			ARTIFACT_NAME.WORD_VECTORS,
			'word_vectors_10k',
		);
		const float32 = new Float32Array(buffer);
		const wordIndexPayload = await fetchAutocompleteArtifactJson<WordIndexPayload>(
			ARTIFACT_NAME.WORD_INDEX,
			{
				summarize: (payload) => `${Object.keys(unwrapWordIndex(payload)).length} entries`,
				validate: isWordIndexPayload,
			},
		);
		const wordIndex = unwrapWordIndex(wordIndexPayload);
		const nWords = Object.keys(wordIndex).length;
		if (nWords === 0) {
			ctcTag(
				'init',
				'⚠️ word_index_10k.json was empty — semantic scoring will be a no-op',
				CTC_STYLES.warn,
			);
		}
		const dim = float32.length / nWords;

		vectorStore = { float32, wordIndex, dim };
		succeedExp(EXPERIENCE_NAME.LOAD_VECTORS, 'singleton', {
			isLocalLLM,
			wordCount: nWords,
			dim,
			sizeBytes: float32.byteLength,
			...(surface ? { surface } : {}),
		});
		ctcTag('init', `vectors loaded: ${nWords} words · dim ${dim} · ${float32.byteLength}B`);
	} catch (e) {
		vectorsLoadStarted = false;
		failExp(EXPERIENCE_NAME.LOAD_VECTORS, 'singleton', {
			isLocalLLM,
			errorType: 'network',
			...(surface ? { surface } : {}),
		});
		ctcTag('init', `⚠️ failed to load vectors: ${String(e)}`, CTC_STYLES.bad);
	}
};

export const initVectors = (store: VectorStore): void => {
	vectorStore = store;
};

/**
 * Load the producer's `bigrams.json` + `phrases.json` completion-term artifacts
 * over the TDP-OS gateway and insert them into the phrase trie.
 *
 * Each file is fetched independently (`Promise.allSettled`) so a missing or
 * late-published artifact only skips that term type — word completion and the
 * other term type are unaffected. Phrase VECTORS are not fetched here: per the
 * producer's `extend` decision they are appended into the existing
 * `word-index-10k.json` / `word-vectors-10k.bin`, so `loadVectorsAsync` already
 * covers them.
 *
 * :params:
 *   options.isLocalLLM: Tags the UFO experience so latency/success feeds the same SLO
 * :returns:
 *   A promise that resolves once both fetches have settled
 */
export const loadPhraseArtifacts = async (options?: { isLocalLLM?: boolean }): Promise<void> => {
	if (phrasesLoadStarted) {
		return;
	}
	phrasesLoadStarted = true;
	const isLocalLLM = options?.isLocalLLM ?? false;
	startExp(EXPERIENCE_NAME.LOAD_PHRASES, 'singleton', { isLocalLLM });

	const loadOne = async (
		artifactName: ArtifactName,
		termType: TermType,
		label: string,
	): Promise<number> => {
		const payload = await fetchAutocompleteArtifactJson<unknown>(artifactName, {
			label,
			validate: (p): p is unknown => p != null && typeof p === 'object',
		});
		const normalized = normalizePhraseArtifact(payload);
		if (!normalized) {
			throw new Error(`[text-predictor] ${label} payload was not a recognised term-stats map`);
		}
		return initPhrases(normalized, termType);
	};

	const [bigramsResult, phrasesResult] = await Promise.allSettled([
		loadOne(ARTIFACT_NAME.BIGRAMS, 'bigram', 'bigrams'),
		loadOne(ARTIFACT_NAME.PHRASES, 'phrase', 'phrases'),
	]);

	const bigramCount = bigramsResult.status === 'fulfilled' ? bigramsResult.value : 0;
	const phraseCount = phrasesResult.status === 'fulfilled' ? phrasesResult.value : 0;

	if (bigramsResult.status === 'rejected') {
		ctcTag(
			'init',
			`⚠️ failed to load bigrams.json: ${String(bigramsResult.reason)}`,
			CTC_STYLES.warn,
		);
	}
	if (phrasesResult.status === 'rejected') {
		ctcTag(
			'init',
			`⚠️ failed to load phrases.json: ${String(phrasesResult.reason)}`,
			CTC_STYLES.warn,
		);
	}

	if (bigramsResult.status === 'fulfilled' || phrasesResult.status === 'fulfilled') {
		phrasesLoaded = true;
		succeedExp(EXPERIENCE_NAME.LOAD_PHRASES, 'singleton', {
			isLocalLLM,
			bigramCount,
			phraseCount,
		});
		ctcTag('init', `phrase artifacts loaded: ${bigramCount} bigrams · ${phraseCount} phrases`);
	} else {
		// Both failed — e.g. artifacts not published to the tenant manifest yet.
		// Reset the guard so a later focus/predict can retry once they land.
		phrasesLoadStarted = false;
		failExp(EXPERIENCE_NAME.LOAD_PHRASES, 'singleton', { isLocalLLM, errorType: 'network' });
	}
};

let vocabularyLoadPromise: Promise<void> | undefined;

type VocabularyLoadSource = 'focus' | 'predict';

export const loadDefaultVocabulary = (options?: {
	isLocalLLM?: boolean;
	source?: VocabularyLoadSource;
	surface?: string;
}): Promise<void> => {
	if (isInitialized) {
		return Promise.resolve();
	}
	if (vocabularyLoadPromise) {
		return vocabularyLoadPromise;
	}

	const isLocalLLM = options?.isLocalLLM ?? false;
	const source = options?.source ?? 'predict';
	const surface = options?.surface;
	vocabularyLoadPromise = (async () => {
		startExp(EXPERIENCE_NAME.LOAD_VOCABULARY, 'singleton', {
			isLocalLLM,
			...(surface ? { surface } : {}),
		});

		try {
			ctcTag('init', `loading artifacts (trigger: ${source} · localLLM: ${isLocalLLM})`);
			if (isAutocompleteDebugVerbose()) {
				// eslint-disable-next-line no-console
				console.groupCollapsed(
					'%c[CTC:init]%c artifact manifest',
					CTC_STYLES.brand,
					CTC_STYLES.body,
				);
				// eslint-disable-next-line no-console
				console.log('Eager:', [
					ARTIFACT_NAME.VOCABULARY,
					ARTIFACT_NAME.L3_VOCABULARY,
					ARTIFACT_NAME.POS_TAGS,
					ARTIFACT_NAME.GHOST_POS_TAGS,
					ARTIFACT_NAME.GRAMMAR_TRANSITIONS,
				]);
				// eslint-disable-next-line no-console
				console.log('Conditional:', [
					`${ARTIFACT_NAME.WORD_INDEX} (only when vectors load; phrase/bigram surfaces share this index)`,
					`${ARTIFACT_NAME.BIGRAMS} + ${ARTIFACT_NAME.PHRASES} (completion-term stats; fire-and-forget)`,
					`${ARTIFACT_NAME.PHRASE_CONTINUATION_TOKENS} (local model only; canonical token IDs for the full served union)`,
				]);
				// eslint-disable-next-line no-console
				console.groupEnd();
			}

			const [vocabularyData, l3VocabularyData] = await Promise.all([
				fetchAutocompleteArtifactJson<VocabularyJson>(ARTIFACT_NAME.VOCABULARY, {
					summarize: (payload) => `${Object.keys(payload.words).length} words`,
					validate: isVocabularyJson,
				}),
				fetchAutocompleteArtifactJson<string[]>(ARTIFACT_NAME.L3_VOCABULARY, {
					summarize: (payload) => `${payload.length} words`,
					validate: isStringArray,
				}),
				// Awaited alongside the vocabulary so the grammar filter is settled
				// before the first suggestion can be produced. Without this the
				// predictor initialises on the smaller vocabulary payload and serves
				// candidates the filter would have dropped until the grammar lands.
				// Only settlement is required: a failed load leaves the filter as a
				// pass-through, which is the same degradation as an absent artifact.
				loadGrammarDataAsync({ isLocalLLM, surface }).catch((error) => {
					ctcTag(
						'init',
						`⚠️ grammar data unavailable; filtering skipped: ${String(error)}`,
						CTC_STYLES.warn,
					);
				}),
			]);

			const terms = Object.entries(vocabularyData.words).map(([word, stats]) => ({
				word,
				freq: stats.freq,
				docFreq: stats.doc_freq,
				authorFreq: stats.author_freq,
			}));

			// Load L3 before L2: initVocabulary flips `isInitialized = true`, so it
			// must run last — otherwise a throw in initL3Vocabulary would strand
			// `isInitialized` true and the retry path could never reload L3.
			initL3Vocabulary(l3VocabularyData);
			initVocabulary({ terms });

			// Phrase/bigram artifacts load independently and must never affect the
			// word path — fire-and-forget with its own error handling inside.
			void loadPhraseArtifacts({ isLocalLLM }).catch(() => {});

			succeedExp(EXPERIENCE_NAME.LOAD_VOCABULARY, 'singleton', {
				isLocalLLM,
				l2WordCount: terms.length,
				l3WordCount: l3VocabularyData.length,
				...(surface ? { surface } : {}),
			});
		} catch (e) {
			failExp(EXPERIENCE_NAME.LOAD_VOCABULARY, 'singleton', {
				isLocalLLM,
				errorType: 'parse_error',
				...(surface ? { surface } : {}),
			});
			// Allow a later call to retry the load rather than caching the failure.
			vocabularyLoadPromise = undefined;
			throw e;
		}
	})();

	return vocabularyLoadPromise;
};
