/**
 * Scoring Pipeline: Stage 1 (Semantic + Frequency), Grammar Filter, Stage 2 (LM Re-ranking).
 *
 * Operates synchronously on pre-loaded data. Each stage gracefully degrades
 * when its required data isn't available (cold → warm → full warm).
 *
 * The grammar/POS payloads are fetched from the CDN by loadGrammarDataAsync, so
 * the grammar filter is a pass-through until that resolves.
 */

import { EXPERIENCE_NAME, failExp, startExp, succeedExp } from '../analytics/ufo';

import { ARTIFACT_NAME, fetchArtifactJson } from './artifacts-manifest';
import type { CanonicalLmEvidence } from './canonical-lm-scoring';
import { isAutocompleteDebugEnabled } from './debug-mode';

// ─── Types ──────────────────────────────────────────────────

/**
 * A completion term is `(term, termType)`. `word` is the v1 default; `bigram`
 * (2 tokens) and `phrase` (3 tokens) are multi-word units mined by the producer.
 */
export type TermType = 'word' | 'bigram' | 'phrase';

export interface ScoringCandidate {
	/** NPMI-style association strength (bigram/phrase only). */
	association?: number | null;
	authorFreq: number;
	docFreq: number;
	/** Last-token POS of a multi-word term (bigram/phrase only). */
	headPos?: string | null;
	/** Per-token POS sequence of a multi-word term (bigram/phrase only). */
	posSeq?: string[] | null;
	sessionFreq: number;
	tenantFreq: number;
	/** Defaults to `'word'` when omitted (back-compat with word-only callers). */
	termType?: TermType;
	word: string;
}

export interface ScoredCandidate {
	finalScore: number;
	freqScore: number;
	lmEvidence: CanonicalLmEvidence | null;
	lmScore: number;
	semanticScore: number;
	stage1Score: number;
	termType: TermType;
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

type PosTagsRecord = Record<string, string[]>;

// ─── Scoring Constants ──────────────────────────────────────

const ALPHA = 0.5;
const BETA = 0.5;
const NEUTRAL_SCORE = 0.5;
// Multiplicative Stage-1 boost applied to a multi-word term proportional to its
// (clamped [0,1]) NPMI association, so a strongly-collocated phrase outranks a
// coincidental word sequence of comparable freq/semantics. Tunable.
const ASSOCIATION_BOOST = 0.5;
export const STAGE1_WEIGHT = 0.35;
export const STAGE2_WEIGHT = 0.65;
export const MIN_STAGE1_SCORE = 0.35;
/**
 * How far the leading candidate must sit above the runner-up on the blended
 * score before a ghost is committed.
 *
 * Lives beside the weights it is measured in, because it is only meaningful on
 * that scale — and because both the arbitration that applies it and the
 * scheduler that decides when reading more tokens can no longer change the
 * outcome have to use the same number. When those two drifted apart, the
 * scheduler stopped early on a margin the arbitration did not recognise and the
 * abstention that followed was invisible from either side.
 */
export const MIN_WINNER_MARGIN = 0.08;
const L1_SESSION_CAP = 1.2;
// Minimum prefix-payload max LM probability before Stage 2 activates.
// Below this threshold the LM signal is too weak to suppress Stage 1 — finalScore
// falls back to stage1Score directly. Prevents weak prefixes (e.g. "ins" → "instances"
// at 0.00024) from triggering re-ranking.
const LM_GATE_THRESHOLD = 0.0005;

// ─── Grammar Data (fetched once from the CDN) ────────────────

let posTags: Map<string, string[]> = new Map();

/**
 * GHOST POS DICTIONARY
 * A mapping of common structural English words that were stripped from the main
 * domain vocabulary. This allows the grammar filter to understand context
 * without suggesting these words to the user.
 */
let ghostPosTags: Record<string, string[]> = {};

let grammarDataPromise: Promise<void> | undefined;

/**
 * Precomputed map from each POS tag to the set of allowed next POS tags, so
 * applyGrammarFilter never re-iterates the transition rules per call.
 */
let precomputedAllowedByPos: Map<string, Set<string>> = new Map();

const isPosTagsRecord = (payload: unknown): payload is PosTagsRecord => {
	if (payload == null || typeof payload !== 'object') {
		return false;
	}
	return Object.values(payload as Record<string, unknown>).every(
		(value) => Array.isArray(value) && value.every((entry) => typeof entry === 'string'),
	);
};

const isGrammarTransitions = (payload: unknown): payload is GrammarTransitions => {
	if (payload == null || typeof payload !== 'object') {
		return false;
	}
	const transitions = (payload as { transitions?: unknown }).transitions;
	if (transitions == null || typeof transitions !== 'object') {
		return false;
	}
	return Object.values(transitions as Record<string, unknown>).every((value) => {
		const allowed = (value as { allowed?: unknown })?.allowed;
		return Array.isArray(allowed) && allowed.every((entry) => typeof entry === 'string');
	});
};

const setGrammarData = (data: {
	ghostPosTags: Record<string, string[]>;
	grammarTransitions: GrammarTransitions;
	posTags: Record<string, string[]>;
}): void => {
	posTags = new Map(Object.entries(data.posTags));
	ghostPosTags = data.ghostPosTags;
	precomputedAllowedByPos = new Map(
		Object.entries(data.grammarTransitions.transitions ?? {}).map(([pos, rule]) => [
			pos,
			new Set(rule.allowed),
		]),
	);
};

export const isGrammarDataLoaded = (): boolean => precomputedAllowedByPos.size > 0;

/**
 * Fetch the POS tag and grammar transition payloads from the CDN.
 *
 * Safe to call repeatedly: the in-flight promise is shared, and a failure is not
 * cached so a later call can retry.
 */
export const loadGrammarDataAsync = (options?: {
	isLocalLLM?: boolean;
	surface?: string;
}): Promise<void> => {
	if (grammarDataPromise) {
		return grammarDataPromise;
	}

	const isLocalLLM = options?.isLocalLLM ?? false;
	const surface = options?.surface;

	grammarDataPromise = (async () => {
		startExp(EXPERIENCE_NAME.LOAD_GRAMMAR, 'singleton', {
			isLocalLLM,
			...(surface ? { surface } : {}),
		});

		try {
			const [posTagsData, ghostPosTagsData, grammarTransitionsData] = await Promise.all([
				fetchArtifactJson<unknown>(ARTIFACT_NAME.POS_TAGS),
				fetchArtifactJson<unknown>(ARTIFACT_NAME.GHOST_POS_TAGS),
				fetchArtifactJson<unknown>(ARTIFACT_NAME.GRAMMAR_TRANSITIONS),
			]);

			// A missing wrapper and a malformed ruleset are reported separately: the
			// first points at the publishing step, the second at the payload itself.
			if ((grammarTransitionsData as { transitions?: unknown })?.transitions == null) {
				throw new Error(
					`[scoring-pipeline] ${ARTIFACT_NAME.GRAMMAR_TRANSITIONS} is missing its \`transitions\` wrapper`,
				);
			}
			if (!isGrammarTransitions(grammarTransitionsData)) {
				throw new Error(
					`[scoring-pipeline] ${ARTIFACT_NAME.GRAMMAR_TRANSITIONS} payload shape was invalid`,
				);
			}
			if (!isPosTagsRecord(posTagsData)) {
				throw new Error(`[scoring-pipeline] ${ARTIFACT_NAME.POS_TAGS} payload shape was invalid`);
			}
			if (!isPosTagsRecord(ghostPosTagsData)) {
				throw new Error(
					`[scoring-pipeline] ${ARTIFACT_NAME.GHOST_POS_TAGS} payload shape was invalid`,
				);
			}

			setGrammarData({
				posTags: posTagsData,
				ghostPosTags: ghostPosTagsData,
				grammarTransitions: grammarTransitionsData,
			});

			succeedExp(EXPERIENCE_NAME.LOAD_GRAMMAR, 'singleton', {
				isLocalLLM,
				posTagCount: posTags.size,
				transitionCount: precomputedAllowedByPos.size,
				...(surface ? { surface } : {}),
			});

			if (isAutocompleteDebugEnabled()) {
				// eslint-disable-next-line no-console
				console.log('[scoring-pipeline] Grammar data loaded:', {
					posTagCount: posTags.size,
					ghostPosTagCount: Object.keys(ghostPosTags).length,
					transitionCount: precomputedAllowedByPos.size,
				});
			}
		} catch (e) {
			failExp(EXPERIENCE_NAME.LOAD_GRAMMAR, 'singleton', {
				isLocalLLM,
				errorType: 'network',
				...(surface ? { surface } : {}),
			});
			// Allow a later call to retry the load rather than caching the failure.
			grammarDataPromise = undefined;
			throw e;
		}
	})();

	return grammarDataPromise;
};

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
	// Pass everything through until loadGrammarDataAsync resolves — filtering on a
	// partially loaded ruleset would drop valid candidates.
	if (!previousWord || !isGrammarDataLoaded()) {
		return { filtered: candidates, grammarMeta: null };
	}

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
		// The producer validates a multi-word term's *internal* grammar offline
		// (boundary-clean, noun-headed, AUP-passed — spec §9), but nothing judges
		// the transition into it. Exempting multi-word terms therefore let a noun
		// this filter had just rejected re-enter wrapped in a bigram — "be" [AUX]
		// dropped "quality" and then displayed "quality assurance". Only the term's
		// first word takes part in the transition, so gate every term on that.
		const surface = entry.candidate.word;
		const firstSpace = surface.indexOf(' ');
		const transitionWord = firstSpace === -1 ? surface : surface.slice(0, firstSpace);
		const candidateTags = posTags.get(transitionWord.toLowerCase());

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

	// Grammar is authoritative.
	return {
		filtered: filtered,
		grammarMeta: {
			prevWord: lowerPrev,
			prevTags,
			before: candidates.length,
			after: filtered.length,
			dropped: dropped,
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

export interface PipelineDebug {
	final: number;
	grammarRejected: string[];
	initial: number;
	stage1Rejected: string[];
}

export interface RankCandidatesResult {
	candidates: ScoredCandidate[];
	grammarMeta: GrammarFilterMeta | null;
	pipelineDebug: PipelineDebug;
}

/**
 * Apply Stage 1, grammar, and nullable context-local LM evidence to candidates.
 */
export function rankCandidates(
	candidates: ScoringCandidate[],
	contextVector: Float32Array | null,
	getWordVector: (word: string) => Float32Array | null,
	lmLogits: Record<string, number> | null,
	maxFreqByType: Record<TermType, number>,
	previousWord: string,
	getCanonicalLmEvidence?: (surface: string) => CanonicalLmEvidence | null,
): RankCandidatesResult {
	// Stage 1
	const stage1Results = candidates.map((candidate) => {
		const termType = candidate.termType ?? 'word';
		// Normalize freq within the candidate's own term-type population so a
		// phrase (whose absolute counts are far below top unigrams) isn't crushed
		// by the unigram max.
		const maxFreq = maxFreqByType[termType] || 1;
		const { semanticScore, freqScore, stage1Score } = scoreStage1(
			candidate,
			contextVector,
			getWordVector,
			maxFreq,
		);
		// Multi-word units get an NPMI association boost (Stage-1 only).
		let adjustedStage1 = stage1Score;
		if (termType !== 'word' && typeof candidate.association === 'number') {
			const assoc = Math.max(0, Math.min(1, candidate.association));
			adjustedStage1 = stage1Score * (1 + ASSOCIATION_BOOST * assoc);
		}
		return { candidate, semanticScore, freqScore, stage1Score: adjustedStage1 };
	});
	const stage1Survivors: typeof stage1Results = [];
	const stage1Rejected: string[] = [];
	for (const entry of stage1Results) {
		if (entry.stage1Score >= MIN_STAGE1_SCORE) {
			stage1Survivors.push(entry);
		} else {
			stage1Rejected.push(entry.candidate.word);
		}
	}

	// Grammar Filter
	const { filtered, grammarMeta } = applyGrammarFilter(stage1Survivors, previousWord);

	// Stage 2 + final assembly
	let lmMax = 0;
	if (lmLogits) {
		const values = Object.values(lmLogits);
		if (values.length > 0) lmMax = Math.max(...values);
	}
	const canonicalEvidenceBySurface = new Map<string, CanonicalLmEvidence>();
	const maxLmRankingValueByTierAndContext = new Map<string, number>();
	for (const entry of filtered) {
		const evidence = getCanonicalLmEvidence?.(entry.candidate.word) ?? null;
		if (!evidence) {
			continue;
		}
		canonicalEvidenceBySurface.set(entry.candidate.word, evidence);
		const rankingValue =
			evidence.source === 'canonical-full-surface'
				? evidence.meanTokenLogProbability
				: evidence.rawLogit;
		if (rankingValue !== undefined && Number.isFinite(rankingValue)) {
			const key = `${evidence.source}\u0000${evidence.contextKey}`;
			const current = maxLmRankingValueByTierAndContext.get(key) ?? -Infinity;
			if (rankingValue > current) {
				maxLmRankingValueByTierAndContext.set(key, rankingValue);
			}
		}
	}

	const scored: ScoredCandidate[] = filtered.map((entry) => {
		const termType = entry.candidate.termType ?? 'word';
		const isMultiWord = termType !== 'word';
		let lmScore = 0;
		let finalScore = entry.stage1Score;
		let lmEvidence = canonicalEvidenceBySurface.get(entry.candidate.word) ?? null;
		if (lmEvidence) {
			const rankingValue =
				lmEvidence.source === 'canonical-full-surface'
					? lmEvidence.meanTokenLogProbability
					: lmEvidence.rawLogit;
			const maxRankingValue = maxLmRankingValueByTierAndContext.get(
				`${lmEvidence.source}\u0000${lmEvidence.contextKey}`,
			);
			if (rankingValue !== undefined && maxRankingValue !== undefined) {
				lmEvidence = {
					...lmEvidence,
					score: Math.exp(rankingValue - maxRankingValue),
				};
			}
		}
		if (lmEvidence) {
			lmScore = lmEvidence.score;
			finalScore = STAGE1_WEIGHT * entry.stage1Score + STAGE2_WEIGHT * lmScore;
		} else if (!isMultiWord && lmLogits && lmMax >= LM_GATE_THRESHOLD) {
			// Backward-compatible network slow-lane path.
			const rawLm = getLmScore(entry.candidate.word, lmLogits);

			if (rawLm !== 0) {
				const logitDiff = Math.log(rawLm) - Math.log(lmMax);
				lmScore = Math.exp(logitDiff);
				lmEvidence = {
					contextKey: 'network',
					score: lmScore,
					separatorKind: 'whitespace',
					source: 'network-logit',
					totalSurfaceCharCount: entry.candidate.word.length,
					// The legacy BE word map does not report canonical token depth.
					totalTokenCount: 0,
					verifiedCharCount: 0,
					verifiedTokenCount: 0,
				};
				finalScore = STAGE1_WEIGHT * entry.stage1Score + STAGE2_WEIGHT * lmScore;
			}
		}

		return {
			word: entry.candidate.word,
			freqScore: entry.freqScore,
			semanticScore: entry.semanticScore,
			lmScore,
			lmEvidence,
			finalScore,
			stage1Score: entry.stage1Score,
			termType,
		};
	});

	scored.sort((a, b) => {
		if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
		return a.word.length - b.word.length;
	});

	return {
		candidates: scored,
		grammarMeta,
		pipelineDebug: {
			initial: candidates.length,
			stage1Rejected,
			grammarRejected: grammarMeta?.dropped ?? [],
			final: scored.length,
		},
	};
}
