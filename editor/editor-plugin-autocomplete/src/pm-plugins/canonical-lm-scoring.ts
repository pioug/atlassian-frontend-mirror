import type { LogitProcessor } from '@mlc-ai/web-llm';

export type SeparatorKind = 'whitespace' | 'document-start' | 'non-space';

export type CanonicalLmEvidenceSource =
	| 'canonical-first-token'
	| 'canonical-full-surface'
	| 'network-logit';

export interface BoundaryLmState {
	contextKey: string;
	prompt: string;
	rawLogits: Float32Array;
}

export interface SurfaceScore {
	contextKey: string;
	meanTokenLogProbability: number;
	surface: string;
	tokenCount: number;
	totalLogProbability: number;
}

export interface CanonicalCandidateContext {
	canonicalTokenIds: number[] | null;
	contextBeforeSurface: string;
	contextKey: string;
	separatorKind: SeparatorKind;
	surfaceStart: number;
}

export interface CanonicalBoundaryContext {
	contextKey: string;
	prompt: string;
}

export interface CanonicalLmEvidence {
	contextKey: string;
	logProbability?: number;
	meanTokenLogProbability?: number;
	rawLogit?: number;
	score: number;
	separatorKind: 'whitespace';
	source: CanonicalLmEvidenceSource;
	totalLogProbability?: number;
	totalSurfaceCharCount: number;
	totalTokenCount: number;
	verifiedCharCount: number;
	verifiedTokenCount: number;
}

export interface BoundaryPrimeRequest {
	contextKey: string;
	familyKey: string;
	priority: number;
	prompt: string;
}

export interface SurfaceScoreRequest {
	candidates: Array<{
		rankHint?: number;
		surface: string;
		tokenIds: number[];
	}>;
	contextKey: string;
	familyKey: string;
	prompt: string;
}

export interface ProgressiveSurfaceEvidence {
	meanTokenLogProbabilityUpperBound: number;
	scoredTokenCount: number;
	totalLogProbability: number;
	totalTokenCount: number;
}

export interface TokenPrefixExpansion {
	contextKey: string;
	rawNextTokenLogits: Float32Array;
	tokenPrefix: number[];
	totalLogProbability: number;
}

export interface TokenPrefixGroup {
	surfaces: string[];
	tokenPrefix: number[];
}

interface CanonicalTokenTrieNode {
	children: Map<number, CanonicalTokenTrieNode>;
}

const createTokenTrieNode = (): CanonicalTokenTrieNode => ({
	children: new Map(),
});

/**
 * Token trie for the producer's canonical leading-space token sequences.
 * It lets the scorer expand a shared token prefix once for every surface below
 * that node (`root cause`, `root directory`, ...), rather than guessing two
 * arbitrary full surfaces from a broad one-character string prefix.
 */
export class CanonicalSurfaceTokenTrie {
	private readonly root = createTokenTrieNode();
	private readonly tokenIdsBySurface = new Map<string, number[]>();

	constructor(entries: Iterable<readonly [string, number[]]> = []) {
		for (const [surface, tokenIds] of entries) {
			this.insert(surface, tokenIds);
		}
	}

	insert(surface: string, tokenIds: number[]): void {
		if (tokenIds.length === 0) {
			return;
		}
		const normalizedSurface = surface.toLowerCase();
		this.tokenIdsBySurface.set(normalizedSurface, [...tokenIds]);
		let node = this.root;
		for (const tokenId of tokenIds) {
			let child = node.children.get(tokenId);
			if (!child) {
				child = createTokenTrieNode();
				node.children.set(tokenId, child);
			}
			node = child;
		}
	}

	getTokenIds(surface: string): number[] | null {
		const tokenIds = this.tokenIdsBySurface.get(surface.toLowerCase());
		return tokenIds ? [...tokenIds] : null;
	}

	groupByScoredPrefix(
		candidates: Array<{ scoredTokenCount: number; surface: string; tokenIds: number[] }>,
	): TokenPrefixGroup[] {
		const groups = new Map<string, TokenPrefixGroup>();
		for (const candidate of candidates) {
			if (
				candidate.scoredTokenCount <= 0 ||
				candidate.scoredTokenCount >= candidate.tokenIds.length
			) {
				continue;
			}
			const tokenPrefix = candidate.tokenIds.slice(0, candidate.scoredTokenCount);
			let node: CanonicalTokenTrieNode | undefined = this.root;
			for (const tokenId of tokenPrefix) {
				node = node.children.get(tokenId);
				if (!node) {
					break;
				}
			}
			if (!node) {
				continue;
			}
			const key = tokenPrefix.join(',');
			const group = groups.get(key) ?? { surfaces: [], tokenPrefix };
			group.surfaces.push(candidate.surface);
			groups.set(key, group);
		}
		return Array.from(groups.values());
	}
}

const WHITESPACE_REGEX = /\s/u;

const makeContextKey = (prompt: string, separatorKind: SeparatorKind): string =>
	`${separatorKind}\u0000${prompt}`;

/** The part of a candidate's context that depends only on where its surface starts. */
interface SurfacePositionContext {
	contextBeforeSurface: string;
	contextKey: string;
	separatorKind: SeparatorKind;
	surfaceStart: number;
}

/**
 * Per-pass store for the position-derived half of a candidate's context.
 *
 * Every unigram candidate for a keystroke shares one surface start, and the
 * phrase candidates share a handful more, so without this the same slice,
 * `trimEnd` and context key are rebuilt for each of the couple of hundred
 * candidates. Valid only for a single `textBeforeCursor`.
 */
export type CanonicalContextPositionCache = Map<number, SurfacePositionContext>;

export const createCanonicalContextPositionCache = (): CanonicalContextPositionCache => new Map();

/**
 * Derive the causal prompt and artifact eligibility from the exact, untrimmed
 * pre-cursor text. The shipped artifact contains only tokenizations of
 * `" " + surface`, so it is valid only when the surface is actually preceded
 * by whitespace.
 */
export const deriveCanonicalCandidateContext = (
	textBeforeCursor: string,
	matchedPrefixLen: number,
	surface: string,
	getTokenIds: (surface: string) => number[] | null,
	surfaceStartOverride?: number,
	positionCache?: CanonicalContextPositionCache,
): CanonicalCandidateContext => {
	const derivedSurfaceStart = textBeforeCursor.length - matchedPrefixLen;
	const surfaceStart = Math.max(
		0,
		Math.min(textBeforeCursor.length, surfaceStartOverride ?? derivedSurfaceStart),
	);

	let position = positionCache?.get(surfaceStart);
	if (position === undefined) {
		const precedingChar = surfaceStart > 0 ? textBeforeCursor[surfaceStart - 1] : null;
		const separatorKind: SeparatorKind =
			precedingChar === null
				? 'document-start'
				: WHITESPACE_REGEX.test(precedingChar)
					? 'whitespace'
					: 'non-space';
		const contextBeforeSurface = textBeforeCursor.slice(0, surfaceStart).trimEnd();
		position = {
			contextBeforeSurface,
			contextKey: makeContextKey(contextBeforeSurface, separatorKind),
			separatorKind,
			surfaceStart,
		};
		positionCache?.set(surfaceStart, position);
	}

	return {
		...position,
		canonicalTokenIds: position.separatorKind === 'whitespace' ? getTokenIds(surface) : null,
	};
};

/**
 * Derive the next surface's leading-space context at an actual word boundary.
 * This lets the local LM start its one-token prime on the space keystroke,
 * before the user has typed the first character of the next word.
 */
export const deriveWhitespaceBoundaryContext = (
	textBeforeCursor: string,
): CanonicalBoundaryContext | null => {
	if (textBeforeCursor.length === 0 || !WHITESPACE_REGEX.test(textBeforeCursor.at(-1) ?? '')) {
		return null;
	}
	const prompt = textBeforeCursor.trimEnd();
	if (prompt.length === 0) {
		return null;
	}
	return {
		contextKey: makeContextKey(prompt, 'whitespace'),
		prompt,
	};
};

/**
 * Return one prime per exact context, ordered from the latest surface start
 * (normally the unigram window) to wider phrase windows.
 */
export const selectBoundaryPrimeRequests = (
	familyKey: string,
	candidates: Array<CanonicalCandidateContext>,
	maxPrimes: number,
): BoundaryPrimeRequest[] => {
	const byContext = new Map<string, CanonicalCandidateContext>();
	for (const candidate of candidates) {
		if (candidate.canonicalTokenIds === null) {
			continue;
		}
		const current = byContext.get(candidate.contextKey);
		if (!current || candidate.surfaceStart > current.surfaceStart) {
			byContext.set(candidate.contextKey, candidate);
		}
	}

	return Array.from(byContext.values())
		.sort((a, b) => b.surfaceStart - a.surfaceStart)
		.slice(0, Math.max(0, maxPrimes))
		.map((candidate, priority) => ({
			familyKey,
			contextKey: candidate.contextKey,
			prompt: candidate.contextBeforeSurface,
			priority,
		}));
};

/**
 * `log(sum(exp(values)))`, shifted by the maximum so the sum cannot overflow or
 * underflow to zero for the sequence log-likelihoods this is called with.
 *
 * Returns `-Infinity` for an empty or wholly non-finite input, which makes
 * `exp(value - logSumExp(values))` evaluate to zero rather than `NaN`.
 */
export const logSumExp = (values: readonly number[]): number => {
	let max = -Infinity;
	for (const value of values) {
		if (Number.isFinite(value) && value > max) {
			max = value;
		}
	}
	if (!Number.isFinite(max)) {
		return -Infinity;
	}
	let sumExp = 0;
	for (const value of values) {
		if (Number.isFinite(value)) {
			sumExp += Math.exp(value - max);
		}
	}
	return sumExp > 0 ? max + Math.log(sumExp) : -Infinity;
};

/** The two shift-and-sum terms of a distribution's log-partition. */
interface LogPartitionTerms {
	logSumTerm: number;
	maxLogit: number;
}

/**
 * The log-partition depends only on the buffer, but scoring reads the same
 * buffer once per candidate — so without this the two full-vocabulary passes
 * below run N times per boundary for an answer that cannot change.
 *
 * Keying on the buffer itself is safe because captured logits are never
 * written to again (see `CanonicalLogitProcessor.processLogits`, which copies
 * out of WebLLM's reused buffer), and the weak reference lets a retired
 * boundary's entry go with it.
 */
const logPartitionTermsCache = new WeakMap<Float32Array, LogPartitionTerms | null>();

const getLogPartitionTerms = (logits: Float32Array): LogPartitionTerms | null => {
	const cached = logPartitionTermsCache.get(logits);
	if (cached !== undefined) {
		return cached;
	}

	let maxLogit = -Infinity;
	for (let i = 0; i < logits.length; i++) {
		if (logits[i] > maxLogit) {
			maxLogit = logits[i];
		}
	}

	let terms: LogPartitionTerms | null = null;
	if (Number.isFinite(maxLogit)) {
		let sumExp = 0;
		for (let i = 0; i < logits.length; i++) {
			sumExp += Math.exp(logits[i] - maxLogit);
		}
		if (sumExp > 0) {
			terms = { maxLogit, logSumTerm: Math.log(sumExp) };
		}
	}

	logPartitionTermsCache.set(logits, terms);
	return terms;
};

export const logSoftmaxAt = (logits: Float32Array, target: number): number => {
	if (target < 0 || target >= logits.length) {
		return -Infinity;
	}

	const terms = getLogPartitionTerms(logits);
	if (terms === null) {
		return -Infinity;
	}
	return logits[target] - terms.maxLogit - terms.logSumTerm;
};

/**
 * One processor is registered for the causal model so the scheduler can read
 * the next-token distribution off any forward pass.
 *
 * The scheduler drives decoding token by token — it prefills a prompt, then
 * feeds each continuation token itself — so the processor never has to force
 * the model onto a target path. It only has to hand back the distribution the
 * forward pass produced, which it does without altering the logits.
 */
export class CanonicalLogitProcessor implements LogitProcessor {
	private captured: Float32Array | null = null;

	processLogits = (logits: Float32Array): Float32Array => {
		// WebLLM reuses its logits buffer between forwards, so keep a private copy.
		this.captured = new Float32Array(logits);
		return logits;
	};

	processSampledToken = (): void => {
		// The scheduler chooses the next token; WebLLM's sample is discarded.
	};

	resetState = (): void => {
		// WebLLM resets the processor after the caller has armed a capture and
		// immediately before it prefills a completion prompt, so this only ever
		// clears a stale reading from the previous run.
		this.captured = null;
	};

	startCapture = (): void => {
		this.captured = null;
	};

	/**
	 * The captured distribution, or null when the forward pass never ran.
	 *
	 * `processLogits` already copied it, and every capture allocates afresh, so
	 * the buffer handed out here is never written to again.
	 */
	getCapturedLogits = (): Float32Array | null => this.captured;
}
