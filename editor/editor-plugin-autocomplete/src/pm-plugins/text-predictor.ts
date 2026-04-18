/**
 * Fast Lane Predictor: Local autocomplete using weighted trie + frequency + semantic scoring.
 *
 * Two prediction modes:
 *   1. Word boundary → bigram-based next-word suggestion (grammar-filtered)
 *   2. Mid-word (≥3 chars) → trie prefix search → scoring pipeline → top result
 *
 * Scoring is delegated to scoring-pipeline.ts which handles:
 *   Stage 1 (semantic + frequency), grammar filter, Stage 2 (optional LM re-ranking).
 *
 * Context vector: average of word vectors from text before cursor (last N words).
 * Falls back to cold mode (freq-only) when vectors not yet loaded.
 *
 * Session personalization (L1): words the user types are incrementally boosted
 * via incrementSessionFreq(), called on word boundaries from the plugin.
 */

// import bigramsData from './data/bigrams.json';
import l3VocabularyData from './data/l3_vocabulary.json';
import vocabularyData from './data/vocabulary_10k.json';
import wordIndexData from './data/word_index_10k.json';
// import { rankCandidates, isGrammarAllowed } from './scoring-pipeline';
import { rankCandidates, STAGE1_WEIGHT, STAGE2_WEIGHT, MIN_STAGE1_SCORE } from './scoring-pipeline';
import type { ScoringCandidate } from './scoring-pipeline';
import { getStoredContextVector, getStoredLmLogits } from './slow-lane-client';

// ─── Constants ───────────────────────────────────────────────────────────────

// eslint-disable-next-line require-unicode-regexp
const PUNCTUATION_BOUNDARY_REGEX = /^[.,;:!?()\[\]{}"'`]+|[.,;:!?()\[\]{}"'`]+$/g;

const MIN_PREFIX_LENGTH = 3;
const MAX_CANDIDATES = 200;
const CONTEXT_WORDS = 10;
const MIN_SCORE_THRESHOLD = 0.2;
const L3_BASELINE_FREQ = 0.001;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Candidate {
	node: TrieNode;
	word: string;
}

export interface WeightedTerm {
	authorFreq: number;
	docFreq: number;
	freq: number;
	word: string;
}

export interface TenantVocabulary {
	terms: WeightedTerm[];
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
}

class WeightedWordTrie {
	private root = new TrieNode();
	/** Highest tenantFreq seen — used to normalize freq scores at query time */
	maxTenantFreq: number = 1;

	insert(word: string, tenantFreq: number, docFreq: number, authorFreq: number): void {
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
		return true;
	}
}

// L1/L2 Trie (Session + Atlassian Domain)
const wordTrie = new WeightedWordTrie();

// L3 Trie (General English Fallback)
const l3Trie = new WeightedWordTrie();

// --- Initialization Function ---
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
	if (debugMode) {
		// eslint-disable-next-line no-console
		console.log(`[text-predictor] L3 General English loaded: ${l3Words.length} words`);
	}
};

// const bigramMap: Map<string, Record<string, number>> = new Map(
// 	Object.entries(bigramsData as Record<string, Record<string, number>>),
// );

let isInitialized = false;

let vectorStore: VectorStore | null = null;

let vectorsLoadStarted = false;

let debugMode = true;

let lastPredictionDebug: {
	contextWords: string[];
	currentWord: string;
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

let hasLoggedSemanticActive = false;

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
	// eslint-disable-next-line require-unicode-regexp, @atlassian/perf-linting/no-expensive-split-replace
	for (const raw of text.toLowerCase().split(/\s+/)) {
		// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace
		const clean = raw.replace(PUNCTUATION_BOUNDARY_REGEX, '');
		if (clean.length >= 2) {
			tokens.push(clean);
		}
	}
	return tokens;
};

const extractPreviousWord = (text: string): string => {
	// 1. Split the text by newlines or punctuation (. ? !)
	// eslint-disable-next-line require-unicode-regexp
	const sentences = text.split(/[\n.?!]+/);

	// 2. Only look at the current sentence/line the user is typing in
	const currentSentence = sentences[sentences.length - 1];

	// 3. Extract the previous word as normal
	// eslint-disable-next-line require-unicode-regexp
	const words = currentSentence.trimEnd().split(/\s+/);
	return words.length >= 2 ? words[words.length - 2] : '';
};

// ─── Debug Helpers ───────────────────────────────────────────────────────────

/** Enable or disable debug logging. Also checks localStorage key `autocomplete-debug`. */
export const setDebugMode = (enabled: boolean): void => {
	debugMode = enabled;
};

/** Check localStorage for autocomplete-debug on first access. */
const ensureDebugModeFromStorage = (): void => {
	if (typeof localStorage !== 'undefined' && localStorage.getItem('autocomplete-debug') === '1') {
		debugMode = true;
	}
};

/**
 * Get predictor status for debugging.
 * vectorsLoaded: true when semantic scoring is active
 * wordCount: number of words in vector store (0 if not loaded)
 */
export const getPredictorStatus = (): {
	isInitialized: boolean;
	vectorsLoaded: boolean;
	vectorsLoadStarted: boolean;
	wordCount: number;
} => {
	ensureDebugModeFromStorage();
	return {
		vectorsLoaded: vectorStore !== null,
		wordCount: vectorStore ? Object.keys(vectorStore.wordIndex).length : 0,
		vectorsLoadStarted,
		isInitialized,
	};
};

/**
 * Get details of the last prediction (for debugging).
 * Returns null if no prediction has run yet or debug was off.
 */
export const getLastPredictionDebug = (): {
	contextWords: string[];
	currentWord: string;
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
	ensureDebugModeFromStorage();
	return lastPredictionDebug;
};

export const initVocabulary = (vocabulary: TenantVocabulary): void => {
	for (const term of vocabulary.terms) {
		wordTrie.insert(term.word, term.freq, term.docFreq, term.authorFreq);
	}
	isInitialized = true;
};

/**
 * Increment L1 session frequency for a single word.
 * Called from the plugin on word boundaries for efficient incremental boosting.
 */
export const incrementSessionFreq = (word: string): void => {
	wordTrie.incrementSessionFreq(word);
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
// NOTE: We ingest full page context here
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

	if (debugMode && validBoostedWords.size > 0) {
		// eslint-disable-next-line no-console
		console.groupCollapsed(
			`%c[L1 Session] %cPrimed ${validBoostedWords.size} valid dictionary words from page`,
			'color: #00b8d9; font-weight: bold;',
			'color: inherit; font-style: italic;',
		);
		// eslint-disable-next-line no-console
		console.dir(Array.from(validBoostedWords).sort());
		// eslint-disable-next-line no-console
		console.groupEnd();
	}
};

export const predict = (textBefore: string): string | null => {
	ensureDebugModeFromStorage();

	if (!isInitialized) {
		loadDefaultVocabulary();
	}

	const t0 = performance.now();

	// ── Step 1: Bigram-based next-word suggestion at word boundary ───────────
	// if (textBefore.length > 0 && /\s$/u.test(textBefore)) {
	// 	const words = textBefore.toLowerCase().trimEnd().split(/\s+/u);
	// 	const prevWord = words[words.length - 1];
	// 	const nextWords = bigramMap.get(prevWord);
	// 	if (nextWords) {
	// 		const sorted = Object.entries(nextWords).sort((a, b) => b[1] - a[1]);
	// 		let bestWord = '';
	// 		for (const [word] of sorted) {
	// 			if (!isGrammarAllowed(prevWord, word)) {
	// 				continue;
	// 			}
	// 			bestWord = word;
	// 			break;
	// 		}
	// 		if (bestWord) {
	// 			if (debugMode) {
	// 				const latencyMs = performance.now() - t0;
	// 				console.log(
	// 					'%c[autocomplete] BIGRAM',
	// 					'color:cyan',
	// 					'| "' + prevWord + '" -> "' + bestWord + '" | ' + latencyMs.toFixed(1) + 'ms',
	// 				);
	// 			}
	// 			return bestWord;
	// 		}
	// 	}
	// 	if (debugMode) {
	// 		console.log(
	// 			'%c[autocomplete] BIGRAM-MISS',
	// 			'color:gray',
	// 			'| no bigram for "' + words[words.length - 1] + '", skipping prefix completion',
	// 		);
	// 	}
	// 	return null;
	// }

	// ── Step 2: Prefix completion (≥3 chars typed) ──────────────────────────
	// eslint-disable-next-line require-unicode-regexp
	if (textBefore.length > 0 && /\s$/.test(textBefore)) {
		return null;
	}

	const trimmed = textBefore.trimEnd();
	const lastSpaceIdx = trimmed.lastIndexOf(' ');
	const currentWord = lastSpaceIdx === -1 ? trimmed : trimmed.slice(lastSpaceIdx + 1);

	if (currentWord.length < MIN_PREFIX_LENGTH) {
		return null;
	}

	// 1. Primary Query: Ask the L2 Domain Trie
	const candidates = wordTrie.getCandidates(currentWord, MAX_CANDIDATES);

	// 2. Fallback Query: Gap-fill with the L3 General English Trie
	if (candidates.length < MAX_CANDIDATES) {
		// Ask L3 for MAX_CANDIDATES to guarantee we have enough buffer
		// to survive the deduplication process.
		const l3Candidates = l3Trie.getCandidates(currentWord, MAX_CANDIDATES);

		const existingWords = new Set(candidates.map((c) => c.word));

		for (const l3c of l3Candidates) {
			if (candidates.length >= MAX_CANDIDATES) break; // Stop exactly at the limit

			if (!existingWords.has(l3c.word)) {
				candidates.push(l3c);
			}
		}
	}

	// If both Tries are completely empty for this prefix
	if (candidates.length === 0) {
		return null;
	}

	const previousWord = extractPreviousWord(trimmed);

	const contextVector = getContextVectorForScoring(trimmed);
	const lmLogits = getStoredLmLogits();

	// Raw LM Output Logger
	if (debugMode && lmLogits && Object.keys(lmLogits).length > 0) {
		const rawLmTop = Object.entries(lmLogits)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([word, score]) => ({
				Word: word,
				Prob: Number(score.toFixed(5)),
			}));
		// eslint-disable-next-line no-console
		console.log('%c[Raw LM Prediction]🧠', 'color: #e83e8c; font-weight: bold;', rawLmTop);
	}

	const mode: 'cold' | 'warm' = contextVector ? 'warm' : 'cold';

	if (debugMode && contextVector && !hasLoggedSemanticActive) {
		hasLoggedSemanticActive = true;
	}

	// Build ScoringCandidate array from TrieNodes
	const scoringCandidates: ScoringCandidate[] = candidates.map(({ word, node }) => ({
		word,
		tenantFreq: node.tenantFreq,
		docFreq: node.docFreq,
		authorFreq: node.authorFreq,
		sessionFreq: node.sessionFreq,
	}));

	// Filter the LM payload to only words matching the current prefix so that
	// lmMax in rankCandidates reflects prefix-relevant signal, not the global distribution.
	const prefix = currentWord.toLowerCase();
	const prefixLmLogits = lmLogits
		? Object.fromEntries(Object.entries(lmLogits).filter(([word]) => word.startsWith(prefix)))
		: null;
	const {
		candidates: ranked,
		grammarMeta,
		pipelineDebug,
	} = rankCandidates(
		scoringCandidates,
		contextVector,
		(w: string) => getWordVector(w),
		prefixLmLogits,
		wordTrie.maxTenantFreq,
		previousWord,
	);

	const best = ranked[0];
	const suggestion =
		best && best.finalScore >= MIN_SCORE_THRESHOLD ? best.word.slice(currentWord.length) : null;

	if (debugMode) {
		const latencyMs = performance.now() - t0;
		const tokens = tokenize(trimmed);
		const contextWords = tokens.slice(-CONTEXT_WORDS);
		const belowThreshold = best && best.finalScore < MIN_SCORE_THRESHOLD;

		const suggestionLabel = belowThreshold
			? '🚫 (below threshold)'
			: suggestion && suggestion.length > 0
				? `✨ "${suggestion}"`
				: '🚫 (no match)';

		lastPredictionDebug = {
			textBefore: trimmed,
			currentWord,
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

		// ── Mode label: COLD / WARM(local) / WARM(BE) ───────────────────────
		const slowLaneVec = getStoredContextVector();
		const isUsingSlowLaneVector =
			slowLaneVec !== null && vectorStore !== null && slowLaneVec.length === vectorStore.dim;
		const modeLabel = !contextVector ? 'COLD' : isUsingSlowLaneVector ? 'WARM(BE)' : 'WARM(local)';
		const modeColor =
			modeLabel === 'WARM(BE)'
				? 'color: #ff9800; font-weight: bold;'
				: modeLabel === 'WARM(local)'
					? 'color: #4caf50; font-weight: bold;'
					: 'color: #9e9e9e; font-weight: bold;';

		// 1. Collapsible group header
		// eslint-disable-next-line no-console
		console.groupCollapsed(
			`%c[Autocomplete] %c${modeLabel} %c| "${currentWord}" ➔ ${suggestionLabel} | ⏱ ${latencyMs.toFixed(1)}ms`,
			'color: #00b8d9; font-weight: bold;',
			modeColor,
			'color: inherit; font-weight: normal;',
		);

		// 2. Context window (what local vector averaging sees)
		// eslint-disable-next-line no-console
		console.log(
			'%cContext Window:',
			'color: #888; font-style: italic;',
			contextWords.length ? contextWords.join(' ') : '(none)',
		);

		// 3. Slow-lane status
		const vectorStatus = isUsingSlowLaneVector
			? `✅ BE semantic vector (dim=${slowLaneVec?.length})`
			: vectorStore
				? '⚠️ Local vector average (slow-lane not yet returned)'
				: '❌ No vectors (cold)';
		const logitsStatus =
			lmLogits && Object.keys(lmLogits).length > 0
				? `✅ LM logits active (${Object.keys(lmLogits).length} tokens)`
				: '⏳ No LM logits (slow-lane pending or failed)';
		// eslint-disable-next-line no-console
		console.log(
			'%cSlow Lane:',
			'color: #888; font-style: italic;',
			vectorStatus,
			'|',
			logitsStatus,
		);

		// 4. Scoring formula active this prediction
		const formulaLabel =
			lmLogits && Object.keys(lmLogits).length > 0
				? `Stage1(×${STAGE1_WEIGHT}) + LM(×${STAGE2_WEIGHT})`
				: 'Stage1 only (no LM logits)';
		// eslint-disable-next-line no-console
		console.log('%cFormula:', 'color: #888; font-style: italic;', formulaLabel);

		// 5. Grammar filter result (collected inside rankCandidates, logged here)
		if (grammarMeta) {
			// eslint-disable-next-line no-console
			console.log(
				`%c[Grammar] "${grammarMeta.prevWord}" [${grammarMeta.prevTags.join('|')}] → ${grammarMeta.before} candidates → ${grammarMeta.after} after filter`,
				'color: #4caf50; font-weight: bold;',
			);
			if (grammarMeta.dropped.length > 0) {
				// eslint-disable-next-line no-console
				console.log(
					`%c🚫 Dropped: ${grammarMeta.dropped.join(', ')}`,
					'color: #f44336; font-style: italic;',
				);
			}
		}

		// 6. Pipeline funnel
		// eslint-disable-next-line no-console
		console.log(
			`%c[Pipeline Funnel] %c📥 In: ${pipelineDebug.initial} | ❌ Stage 1 (< ${MIN_STAGE1_SCORE}): -${pipelineDebug.stage1Rejected.length} | ❌ Grammar: -${pipelineDebug.grammarRejected.length} | ✅ Final: ${pipelineDebug.final}`,
			'color: #9c27b0; font-weight: bold;',
			'color: inherit;',
		);

		// 7. Candidate table
		if (ranked.length > 0) {
			const lmCoverage = ranked.slice(0, 10).filter((r) => r.lmScore > 0).length;
			// eslint-disable-next-line no-console
			console.log(
				`%cLM coverage: ${lmCoverage}/${Math.min(ranked.length, 10)} candidates had real logit scores`,
				'color: #888; font-style: italic;',
			);

			const tableData = ranked.slice(0, 10).map((r) => {
				let rawLogit: string | number = 'Not in Payload';
				if (prefixLmLogits) {
					const val = prefixLmLogits[r.word.toLowerCase()];
					if (val !== undefined) {
						rawLogit = Number(val.toFixed(5));
					}
				}

				const original = scoringCandidates.find((sc) => sc.word === r.word);
				let source = 'Unknown';
				if (original) {
					if (original.docFreq === 0 && original.tenantFreq === L3_BASELINE_FREQ) {
						source = '🌍 L3 (Generic)';
					} else if (original.sessionFreq > 0 && original.tenantFreq === 0) {
						source = '👤 L1 (Session Only)';
					} else {
						source = '🏢 L2 (Domain)';
					}
				}

				return {
					Candidate: r.word,
					Source: source,
					'Final Score': Number(r.finalScore.toFixed(4)),
					Semantics: Number(r.semanticScore.toFixed(4)),
					Freq: Number(r.freqScore.toFixed(4)),
					'LM Score': Number(r.lmScore.toFixed(4)),
					'Raw Logit': rawLogit,
					'Session Freq': original?.sessionFreq || 0,
				};
			});

			// eslint-disable-next-line no-console
			console.table(tableData);
		} else {
			// eslint-disable-next-line no-console
			console.log('No candidates found.');
		}

		// eslint-disable-next-line no-console
		console.groupEnd();
	}

	return suggestion && suggestion.length > 0 ? suggestion : null;
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

export const loadVectorsAsync = async (options?: {
	getBinaryUrl?: () => Promise<string>;
}): Promise<void> => {
	if (vectorStore || vectorsLoadStarted) {
		return;
	}
	if (!options?.getBinaryUrl) {
		// eslint-disable-next-line no-console
		console.warn(
			'[text-predictor] loadVectorsAsync called without a getBinaryUrl — vectors will not load. Pass getVectorsBinaryUrl via plugin options.',
		);
		return;
	}
	vectorsLoadStarted = true;

	let url: string;
	try {
		url = await options.getBinaryUrl();
	} catch (e) {
		vectorsLoadStarted = false;
		// eslint-disable-next-line no-console
		console.warn('[text-predictor] Failed to resolve vectors URL:', e);
		return;
	}

	try {
		const res = await fetch(url);
		if (!res.ok) {
			vectorsLoadStarted = false;
			// eslint-disable-next-line no-console
			console.warn(`[text-predictor] Failed to load vectors: ${res.status}`);
			return;
		}
		const buffer = await res.arrayBuffer();
		const float32 = new Float32Array(buffer);
		const wordIndex = wordIndexData as Record<string, number>;
		const nWords = Object.keys(wordIndex).length;
		const dim = float32.length / nWords;

		vectorStore = { float32, wordIndex, dim };
		ensureDebugModeFromStorage();
		if (debugMode) {
			// eslint-disable-next-line no-console
			console.log('[text-predictor] Vectors loaded:', {
				wordCount: nWords,
				dim,
				sizeBytes: float32.byteLength,
			});
		}
	} catch (e) {
		vectorsLoadStarted = false;
		// eslint-disable-next-line no-console
		console.warn('[text-predictor] Failed to load vectors:', e);
	}
};

export const initVectors = (store: VectorStore): void => {
	vectorStore = store;
};

export const loadDefaultVocabulary = (): void => {
	// 1. Load the Atlassian Domain (L2)
	const data = vocabularyData as VocabularyJson;
	const terms = Object.entries(data.words).map(([word, stats]) => ({
		word,
		freq: stats.freq,
		docFreq: stats.doc_freq,
		authorFreq: stats.author_freq,
	}));
	initVocabulary({ terms });

	// 2. Load General English (L3)
	const l3Words = l3VocabularyData as string[];
	initL3Vocabulary(l3Words);
};
