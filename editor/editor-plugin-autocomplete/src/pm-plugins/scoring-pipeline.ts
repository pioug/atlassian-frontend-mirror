/**
 * Scoring Pipeline: Stage 1 (Semantic + Frequency), Grammar Filter, Stage 2 (LM Re-ranking).
 *
 * Operates synchronously on pre-loaded data. Each stage gracefully degrades
 * when its required data isn't available (cold → warm → full warm).
 */

import posTagsData from './data/combined_l2_l3_pos_tags.json';
import ghostPosTagsData from './data/ghost_pos_tags.json';
import grammarTransitionsData from './data/grammar_transitions_10k.json';

// ─── Types ──────────────────────────────────────────────────

export interface ScoringCandidate {
	authorFreq: number;
	docFreq: number;
	sessionFreq: number;
	tenantFreq: number;
	word: string;
}

export interface ScoredCandidate {
	finalScore: number;
	freqScore: number;
	lmScore: number;
	semanticScore: number;
	word: string;
}

/** Metadata returned by the grammar filter for debug logging in the caller. */
export interface GrammarFilterMeta {
	after: number;
	before: number;
	dropped: string[];
	prevTags: string[];
	prevWord: string;
}

interface PosTransitionRule {
	allowed: string[];
}

interface GrammarTransitions {
	transitions: Record<string, PosTransitionRule>;
}

// ─── Scoring Constants ──────────────────────────────────────

const ALPHA = 0.5;
const BETA = 0.5;
const NEUTRAL_SCORE = 0.5;
const STAGE1_WEIGHT = 0.6;
const STAGE2_WEIGHT = 0.4;
const MIN_STAGE1_SCORE = 0.35;
const L1_SESSION_CAP = 1.2;

// ─── Grammar Data (loaded once on import) ───────────────────

const posTags: Map<string, string[]> = new Map(
	Object.entries(posTagsData as Record<string, string[]>),
);

const grammarTransitions = grammarTransitionsData as GrammarTransitions;

/**
 * Precomputed map from each POS tag to the set of allowed next POS tags.
 * Built once at module load from grammarTransitions so applyGrammarFilter
 * never re-iterates the transition rules per call.
 */
const precomputedAllowedByPos: Map<string, Set<string>> = new Map(
	Object.entries(grammarTransitions.transitions).map(([pos, rule]) => [pos, new Set(rule.allowed)]),
);

// ─── Math ───────────────────────────────────────────────────

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
	let dot = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	const dNormA = Math.sqrt(normA);
	const dNormB = Math.sqrt(normB);
	if (dNormA === 0 || dNormB === 0) {
		return NEUTRAL_SCORE;
	}
	return (1 + dot / (dNormA * dNormB)) / 2;
}

// ─── Stage 1: Semantic + Frequency ──────────────────────────

function scoreStage1(
	candidate: ScoringCandidate,
	contextVector: Float32Array | null,
	getWordVector: (word: string) => Float32Array | null,
	maxTenantFreq: number,
): { freqScore: number; semanticScore: number; stage1Score: number } {
	// 1. Calculate Base Global Score (Normalized Log)
	const maxPossibleLog = Math.log10(maxTenantFreq + 1);

	// Diversity Adjustment
	const diversityRaw =
		(Math.log10(candidate.tenantFreq + 1) * 0.5 +
			Math.log10(candidate.docFreq + 1) * 0.25 +
			Math.log10(candidate.authorFreq + 1) * 0.25) /
		maxPossibleLog;

	const sessionMultiplier =
		candidate.sessionFreq > 0 ? 1 + Math.log10(candidate.sessionFreq + 1) * 2.5 : 1;

	// Apply multiplier; capped at L1_SESSION_CAP (default 1.2) to prevent excessive over-indexing
	const freqScore = Math.min(diversityRaw * sessionMultiplier, L1_SESSION_CAP);

	// 3. Semantic Scoring
	let semanticScore = NEUTRAL_SCORE;
	if (contextVector) {
		const wordVec = getWordVector(candidate.word);
		semanticScore = wordVec ? cosineSimilarity(contextVector, wordVec) : NEUTRAL_SCORE;
	}

	return {
		semanticScore,
		freqScore,
		stage1Score: ALPHA * semanticScore + BETA * freqScore,
	};
}

// ─── Grammar Filter ─────────────────────────────────────────

/**
 * GHOST POS DICTIONARY
 * A hardcoded mapping of common structural English words that were stripped
 * from the main domain vocabulary. This allows the grammar filter to understand
 * context without suggesting these words to the user.
 */
const ghostPosTags: Record<string, string[]> = ghostPosTagsData as Record<string, string[]>;

type FilterEntry = {
	candidate: ScoringCandidate;
	freqScore: number;
	semanticScore: number;
	stage1Score: number;
};

function applyGrammarFilter(
	candidates: FilterEntry[],
	previousWord: string,
): { filtered: FilterEntry[]; grammarMeta: GrammarFilterMeta | null } {
	if (!previousWord) return { filtered: candidates, grammarMeta: null };

	const lowerPrev = previousWord.toLowerCase();
	const prevTags = ghostPosTags[lowerPrev] || posTags.get(lowerPrev);

	if (!prevTags || prevTags.length === 0) {
		return { filtered: candidates, grammarMeta: null };
	}

	let allowedNextTags: Set<string>;
	if (prevTags.length === 1) {
		// Common case: single POS tag — reuse the precomputed Set directly (no allocation)
		allowedNextTags = precomputedAllowedByPos.get(prevTags[0]) ?? new Set();
	} else {
		allowedNextTags = new Set<string>();
		for (const pt of prevTags) {
			const allowed = precomputedAllowedByPos.get(pt);
			if (allowed) allowed.forEach((tag) => allowedNextTags.add(tag));
		}
	}

	const filtered: FilterEntry[] = [];
	const dropped: string[] = [];

	for (const entry of candidates) {
		const candidateTags = posTags.get(entry.candidate.word.toLowerCase());

		// If candidate has no tags (unknown word), let it pass to be safe
		if (!candidateTags || candidateTags.length === 0) {
			filtered.push(entry);
			continue;
		}

		if (candidateTags.some((ct) => allowedNextTags.has(ct))) {
			filtered.push(entry);
		} else {
			dropped.push(entry.candidate.word);
		}
	}

	const finalFiltered = filtered.length > 0 ? filtered : candidates;

	return {
		filtered: finalFiltered,
		grammarMeta: {
			prevWord: lowerPrev,
			prevTags,
			before: candidates.length,
			after: finalFiltered.length,
			dropped: filtered.length > 0 ? dropped : [],
		},
	};
}

// ─── Stage 2: LM Re-ranking ────────────────────────────────
function getLmScore(word: string, lmLogits: Record<string, number> | null): number {
	if (!lmLogits) return 0;

	// Look up the word directly! No more tokens.
	const val = lmLogits[word.toLowerCase()];
	if (typeof val === 'number') {
		return val;
	}
	return 0;
}

// ─── Public API ─────────────────────────────────────────────

export interface RankCandidatesResult {
	candidates: ScoredCandidate[];
	grammarMeta: GrammarFilterMeta | null;
}

export function rankCandidates(
	candidates: ScoringCandidate[],
	contextVector: Float32Array | null,
	getWordVector: (word: string) => Float32Array | null,
	lmLogits: Record<string, number> | null,
	maxTenantFreq: number,
	previousWord: string,
): RankCandidatesResult {
	// Stage 1
	const stage1Results = candidates.map((candidate) => {
		const { semanticScore, freqScore, stage1Score } = scoreStage1(
			candidate,
			contextVector,
			getWordVector,
			maxTenantFreq,
		);
		return { candidate, semanticScore, freqScore, stage1Score };
	});

	const stage1Survivors = stage1Results.filter((entry) => entry.stage1Score >= MIN_STAGE1_SCORE);

	// Grammar Filter
	const { filtered, grammarMeta } = applyGrammarFilter(stage1Survivors, previousWord);

	// Stage 2 + final assembly
	let lmMax = 0;
	if (lmLogits && Object.keys(lmLogits).length > 0) {
		const values = Object.values(lmLogits);
		lmMax = Math.max(...values);
	}

	const scored: ScoredCandidate[] = filtered.map((entry) => {
		let lmScore = 0;
		let finalScore = entry.stage1Score;

		if (lmLogits && Object.keys(lmLogits).length > 0) {
			const rawLm = getLmScore(entry.candidate.word, lmLogits);

			if (rawLm !== 0) {
				// The word was in the top_k! Score it normally.
				const logitDiff = Math.log(rawLm) - Math.log(lmMax);
				lmScore = Math.exp(logitDiff);
			} else {
				lmScore = 0.05;
			}

			finalScore = STAGE1_WEIGHT * entry.stage1Score + STAGE2_WEIGHT * lmScore;
		}

		return {
			word: entry.candidate.word,
			freqScore: entry.freqScore,
			semanticScore: entry.semanticScore,
			lmScore,
			finalScore,
		};
	});

	scored.sort((a, b) => {
		if (b.finalScore !== a.finalScore) {
			return b.finalScore - a.finalScore;
		}
		return a.word.length - b.word.length;
	});

	return { candidates: scored, grammarMeta };
}
