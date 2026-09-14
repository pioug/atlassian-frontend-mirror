/**
 * Inline-code harvester — the Class B candidate source.
 *
 * Class A terms (Atlassian, Confluence) already carry tenant frequencies, a word
 * vector and canonical token ids, so they compete inside the scored pool. Class B
 * terms — `ml-studio` and friends — exist only in the session and cannot be
 * suggested at all today: `incrementSessionFreq` only touches trie nodes that
 * already exist, so an unknown session word is silently discarded.
 *
 * Two sources carry the signal. Assistant replies arrive as markdown strings and
 * keep their backticks; the live document has had its backticks consumed by the
 * text-formatting input rule, so its spans are found through the `code` mark
 * instead. Human chat messages arrive as ADF and are flattened to bare text, so
 * they contribute no spans — which is why no author check is needed here.
 *
 * A harvested surface cannot be scored: there is no frequency to rank it, no
 * vector to place it in context and no canonical token ids to price it under the
 * model. Being marked as code is the whole of the evidence, so what stands in for
 * a score is where the surface is allowed to speak — only on a prefix no
 * vocabulary reached, and only once the scored path has finished with it.
 *
 * Sightings are still counted, per source and by different rules, but they do
 * not admit a surface. They order the set under eviction, and they pick between
 * two surfaces that complete the same typed prefix — see `HarvestedTerm` and
 * `findHarvestedCompletion`.
 *
 * What the session is holding is visible at any time from the console:
 * `__atlCtcDebug__.harvest()`, or `__atlCtcDebug__.harvest('ml-s')` to ask what
 * a prefix would be offered — see `inspectInlineCodeHarvest`.
 */

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import {
	CTC_STYLES,
	ctcTag,
	isAutocompleteDebugEnabled,
	isAutocompleteDebugVerbose,
	registerCtcHarvestInspector,
} from './debug-mode';
import { lookupVocabularySource } from './text-predictor';

/** Longer than this is a command or a path, not a term anyone wants completed. */
const MAX_IDENTIFIER_LENGTH = 50;

/**
 * Longer than the predictor's DISPLAY_MIN_PREFIX_LENGTH of 3.
 *
 * The scored path can afford three characters because it has a posterior and a
 * winner margin to answer for the fourth. This path has neither, so it asks the
 * user to commit further before it will guess.
 */
const MIN_TYPED_PREFIX_LENGTH = 4;

/** Mirrors the predictor's MIN_SUGGESTION_LENGTH. */
const MIN_GHOST_LENGTH = 3;

/**
 * Sightings needed before a surface may be offered, counting both sources.
 *
 * One, because asking for two reads the replies this exists for as no evidence
 * at all: a reply answering "what are our service names" names each one exactly
 * once, and ten terms mentioned once each is the normal shape of the answer, not
 * a weak signal. What keeps noise out is not a count — see `isDisplayEligible`.
 */
const MIN_OCCURRENCES = 1;

/**
 * Cap on the harvested set.
 *
 * Not a memory bound — surfaces are capped at 50 characters. It is there so a
 * long session's early terms cannot sit in the set competing with what is being
 * discussed now, and so the display path's scan stays bounded. Provisional:
 * size it off the funnel numbers from a branch deploy rather than this guess.
 */
const MAX_HARVESTED_TERMS = 200;

/**
 * A surface shorter than a qualifying prefix plus a qualifying ghost can never
 * be shown. Recorded rather than filtered, so the funnel shows how much of the
 * harvest is unusable for that reason alone.
 */
const DISPLAYABLE_MIN_LENGTH = MIN_TYPED_PREFIX_LENGTH + MIN_GHOST_LENGTH;

const FENCED_REGION_REGEX = /```[\s\S]*?```/gu;
const INLINE_CODE_SPAN_REGEX = /`([^`\n]+)`/gu;
const WHITESPACE_REGEX = /\s/u;
const STARTS_WITH_LETTER_REGEX = /^\p{L}/u;

interface HarvestedTerm {
	/** Whether the surface is long enough to ever produce a ghost. */
	displayable: boolean;
	/**
	 * Code-marked spans in the live document as of the most recent walk.
	 *
	 * A snapshot, not a running total. The walk re-reads the whole document on
	 * every word boundary, so accumulating here would count keystrokes rather
	 * than mentions — and it would count them faster the longer the surface is.
	 * Replacing the value also means deleting the span withdraws the evidence,
	 * which is the behaviour a snapshot should have.
	 */
	documentSpans: number;
	/** When this surface was last seen in either source; breaks eviction ties. */
	lastSeenAt: number;
	/**
	 * Spans across ingested reply and page text.
	 *
	 * Accumulating is safe here in a way it is not for the document: the plugin
	 * dedupes ingested text before it reaches this module, so each mention is
	 * counted once. Near-duplicate page content re-ingested under a small edit
	 * is the remaining way to over-count, and it inflates by ones.
	 */
	replyOccurrences: number;
	/** Original casing, first occurrence wins — casing is load-bearing in code. */
	surface: string;
}

/** Why this surface was chosen over the others that completed the prefix. */
export type HarvestCollapseRule = 'alphabetical' | 'sightings' | 'sole-match';

export interface HarvestMatch {
	/** Which rule settled the prefix; `sole-match` when there was no rival. */
	collapsedBy: HarvestCollapseRule;
	/** Code-marked spans in the document, as of the last walk. */
	documentSpans: number;
	/** Characters of the surface the user has not typed yet. */
	ghostText: string;
	/** Mentions across ingested reply and page text. */
	replyOccurrences: number;
	/** Surfaces that also completed the prefix and lost, in the losing order. */
	rivalSurfaces: string[];
	/** Full surface in its original casing, which replaces the typed prefix. */
	surface: string;
	/** Length of the typed prefix the surface replaces on accept. */
	typedPrefixLength: number;
}

interface HarvestFunnel {
	accepted: number;
	rejectedInFence: number;
	rejectedKnownL2: number;
	rejectedKnownL3: number;
	rejectedNonAlphaStart: number;
	rejectedTooLong: number;
	rejectedWhitespace: number;
	spansFound: number;
}

const emptyFunnel = (): HarvestFunnel => ({
	accepted: 0,
	rejectedInFence: 0,
	rejectedKnownL2: 0,
	rejectedKnownL3: 0,
	rejectedNonAlphaStart: 0,
	rejectedTooLong: 0,
	rejectedWhitespace: 0,
	spansFound: 0,
});

// Session-scoped, and only correct because the plugin resets it on destroy: the
// map holds user and assistant content, so surviving an unmount would leak one
// conversation's terms into the next.
const harvested = new Map<string, HarvestedTerm>();
// Two funnels because the two sources are read on different schedules. Ingested
// text is seen once, so its funnel accumulates; the document is re-walked on
// every word boundary, so its funnel is replaced to stay a description of the
// document rather than of how long the session has run.
let contextFunnel = emptyFunnel();
let documentFunnel = emptyFunnel();
let evictedTerms = 0;
let lastLoggedSignature = '';

const collectFencedRanges = (text: string): Array<[number, number]> => {
	const ranges: Array<[number, number]> = [];
	for (const match of text.matchAll(FENCED_REGION_REGEX)) {
		if (match.index !== undefined) {
			ranges.push([match.index, match.index + match[0].length]);
		}
	}
	return ranges;
};

const isInsideFence = (ranges: Array<[number, number]>, index: number): boolean =>
	ranges.some(([start, end]) => index >= start && index < end);

/** The cleaned surface if it survives intake, or null. Records the rejection. */
const admitCandidate = (raw: string, funnel: HarvestFunnel): string | null => {
	// Markdown permits one space of padding inside the ticks, so trim before
	// testing for the internal whitespace that separates a term from a command.
	const candidate = raw.trim();
	if (candidate.length === 0 || WHITESPACE_REGEX.test(candidate)) {
		funnel.rejectedWhitespace++;
		return null;
	}
	if (candidate.length > MAX_IDENTIFIER_LENGTH) {
		funnel.rejectedTooLong++;
		return null;
	}
	// Flags (`-d`, `--open-url`) match every other rule and are worthless to
	// complete, so the leading character has to be a letter.
	if (!STARTS_WITH_LETTER_REGEX.test(candidate)) {
		funnel.rejectedNonAlphaStart++;
		return null;
	}
	// A surface the scored path can already serve does not belong here. Harvesting
	// it would put a candidate with no frequencies, no vector and no canonical
	// token ids up against one that has all three.
	const known = lookupVocabularySource(candidate);
	if (known === 'l2') {
		funnel.rejectedKnownL2++;
		return null;
	}
	if (known === 'l3') {
		funnel.rejectedKnownL3++;
		return null;
	}
	return candidate;
};

/** Total mentions behind a surface, across both sources. */
const sightingsOf = (term: HarvestedTerm): number => term.documentSpans + term.replyOccurrences;

/**
 * Order two surfaces that are competing for the same typed prefix, best first.
 *
 * Sightings lead, because the number of times the session named a thing is the
 * only quantity this module has that says anything about which one is being
 * discussed. The alphabetical tie-break is arbitrary and chosen for being
 * arbitrary in a stable way: on a tie there is nothing to prefer, and a rule
 * that always resolves the same way means the same prefix produces the same
 * ghost every time rather than one that follows harvest order.
 *
 * Numeric-aware so `model@v2` sorts before `model@v10` — versioned identifiers
 * are common enough in this set to be worth not reading as strings.
 */
const byCollapseOrder = (a: HarvestedTerm, b: HarvestedTerm): number =>
	sightingsOf(b) - sightingsOf(a) ||
	a.surface.localeCompare(b.surface, 'en', { numeric: true, sensitivity: 'base' });

/**
 * Drop the weakest terms until the set is within its cap.
 *
 * Least evidence first, oldest sighting to break the tie. FIFO is the local
 * precedent (MAX_INGESTED_CONTEXT_TEXTS in the plugin) but it is the wrong
 * policy here: the earliest-harvested term may be the one the conversation is
 * actually about, and the sighting count is the only ranking this module has.
 */
const evictWeakestTerms = (): void => {
	if (harvested.size <= MAX_HARVESTED_TERMS) {
		return;
	}
	const ordered = Array.from(harvested.entries()).sort(
		([, a], [, b]) => sightingsOf(a) - sightingsOf(b) || a.lastSeenAt - b.lastSeenAt,
	);
	for (const [key] of ordered.slice(0, harvested.size - MAX_HARVESTED_TERMS)) {
		harvested.delete(key);
		evictedTerms++;
	}
};

/** Count each admitted surface once per occurrence within a single pass. */
const tallySpans = (surfaces: string[]): Map<string, { count: number; surface: string }> => {
	const counts = new Map<string, { count: number; surface: string }>();
	for (const surface of surfaces) {
		const key = surface.toLowerCase();
		const existing = counts.get(key);
		if (existing) {
			existing.count++;
		} else {
			counts.set(key, { count: 1, surface });
		}
	}
	return counts;
};

/**
 * Harvest single-backtick spans from a markdown-ish string. Fenced regions are
 * skipped: they hold commands and file paths, and their contents are whitespace
 * separated anyway.
 */
export const harvestInlineCodeFromText = (text: string | undefined): void => {
	if (!text) {
		return;
	}
	const fencedRanges = collectFencedRanges(text);
	const admitted: string[] = [];
	for (const match of text.matchAll(INLINE_CODE_SPAN_REGEX)) {
		if (match.index === undefined) {
			continue;
		}
		contextFunnel.spansFound++;
		if (isInsideFence(fencedRanges, match.index)) {
			contextFunnel.rejectedInFence++;
			continue;
		}
		const surface = admitCandidate(match[1], contextFunnel);
		if (surface) {
			admitted.push(surface);
		}
	}

	const now = performance.now();
	for (const [key, { count, surface }] of tallySpans(admitted)) {
		const existing = harvested.get(key);
		if (existing) {
			existing.replyOccurrences += count;
			existing.lastSeenAt = now;
			continue;
		}
		harvested.set(key, {
			displayable: surface.length >= DISPLAYABLE_MIN_LENGTH,
			documentSpans: 0,
			lastSeenAt: now,
			replyOccurrences: count,
			surface,
		});
		contextFunnel.accepted++;
	}
	evictWeakestTerms();
};

/**
 * Harvest code-marked text from the live document. The backtick input rule fires
 * on the closing tick and removes both delimiters, so a finished span is only
 * findable through its mark. Code blocks are skipped for the same reason fenced
 * regions are.
 *
 * The whole document is re-read, and what it finds replaces the previous
 * document counts rather than adding to them.
 */
export const harvestInlineCodeFromDoc = (doc: PMNode): void => {
	documentFunnel = emptyFunnel();
	const admitted: string[] = [];
	doc.descendants((node) => {
		if (node.type.name === 'codeBlock') {
			return false;
		}
		if (node.isText && node.text && node.marks.some((mark) => mark.type.name === 'code')) {
			documentFunnel.spansFound++;
			const surface = admitCandidate(node.text, documentFunnel);
			if (surface) {
				admitted.push(surface);
			}
		}
		return true;
	});

	const spans = tallySpans(admitted);
	// Surfaces the document no longer holds lose their document evidence. They
	// stay in the set on whatever reply evidence they have.
	for (const [key, term] of harvested) {
		if (!spans.has(key)) {
			term.documentSpans = 0;
		}
	}
	const now = performance.now();
	for (const [key, { count, surface }] of spans) {
		const existing = harvested.get(key);
		if (existing) {
			existing.documentSpans = count;
			existing.lastSeenAt = now;
			continue;
		}
		harvested.set(key, {
			displayable: surface.length >= DISPLAYABLE_MIN_LENGTH,
			documentSpans: count,
			lastSeenAt: now,
			replyOccurrences: 0,
			surface,
		});
		documentFunnel.accepted++;
	}
	evictWeakestTerms();
};

/**
 * Whether a surface still has a sighting behind it.
 *
 * Recurrence turned out to be the wrong thing to lean on. What separates a term
 * worth offering from a word in prose is that someone marked it as code — the
 * author with a code mark, or the model with backticks — and that is already
 * true of everything in this set. The rules that keep noise out are elsewhere:
 * the surface must be absent from L2 and L3, unique among harvested terms for
 * the typed prefix, and on a prefix the scored path has no claim to.
 *
 * The case this still rejects is a withdrawn sighting: a document span the
 * author deleted drops back to zero, and a term with no reply mention behind it
 * stops being offered.
 */
const isDisplayEligible = (term: HarvestedTerm): boolean =>
	term.documentSpans + term.replyOccurrences >= MIN_OCCURRENCES;

/**
 * Every harvested surface that could be shown for `typedPrefix`, best first.
 *
 * A surface whose remaining tail is too short to render is not a rival, it is a
 * surface the user has finished typing. Neither is one whose sighting has been
 * withdrawn. Both used to be counted as ambiguity and used to silence the path.
 */
const collectCandidates = (typedPrefix: string): HarvestedTerm[] => {
	const needle = typedPrefix.toLowerCase();
	const candidates: HarvestedTerm[] = [];
	for (const term of harvested.values()) {
		if (!term.surface.toLowerCase().startsWith(needle)) {
			continue;
		}
		if (term.surface.length - typedPrefix.length < MIN_GHOST_LENGTH) {
			continue;
		}
		if (!isDisplayEligible(term)) {
			continue;
		}
		candidates.push(term);
	}
	return candidates.sort(byCollapseOrder);
};

/**
 * The harvested surface to offer for `typedPrefix`, or null.
 *
 * Rivals are collapsed rather than treated as a reason to stay quiet. Silence
 * was the original rule, on the grounds that two session surfaces sharing a
 * prefix have nothing to separate them, and it was wrong for the case this path
 * exists to serve: a reply that answers "what are our services" names ten of
 * them, several share a stem, and abstaining meant the harvester went quiet on
 * exactly the reply it was built for. Being wrong here costs one keystroke —
 * the ghost is ignored and typing continues — and staying silent costs the
 * feature.
 *
 * `collapsedBy` records which rule settled it so a surprising ghost can be
 * explained after the fact rather than guessed at.
 */
export const findHarvestedCompletion = (typedPrefix: string): HarvestMatch | null => {
	if (typedPrefix.length < MIN_TYPED_PREFIX_LENGTH) {
		return null;
	}
	const [winner, runnerUp, ...rest] = collectCandidates(typedPrefix);
	if (!winner) {
		return null;
	}
	return {
		collapsedBy: !runnerUp
			? 'sole-match'
			: sightingsOf(winner) > sightingsOf(runnerUp)
				? 'sightings'
				: 'alphabetical',
		documentSpans: winner.documentSpans,
		ghostText: winner.surface.slice(typedPrefix.length),
		replyOccurrences: winner.replyOccurrences,
		rivalSurfaces: (runnerUp ? [runnerUp, ...rest] : []).map((term) => term.surface),
		surface: winner.surface,
		typedPrefixLength: typedPrefix.length,
	};
};

interface HarvestTermSnapshot {
	/** Code-marked spans in the document as of the last walk. */
	documentSpans: number;
	/** Whether the surface is long enough to ever produce a ghost. */
	longEnough: boolean;
	/** Whether a sighting still stands behind it. */
	offerable: boolean;
	/** Mentions across ingested reply and page text. */
	replyOccurrences: number;
	/** Sum of both sources, which is what collapses rivals. */
	sightings: number;
	surface: string;
}

export interface HarvestSnapshot {
	/** Size the set is held to; beyond it the weakest surfaces are dropped. */
	cap: number;
	/** How many surfaces have been dropped to hold the cap this session. */
	evicted: number;
	/**
	 * Intake accounting per source. The context funnel accumulates over the
	 * session; the live-document funnel describes the most recent walk only.
	 */
	funnels: { context: HarvestFunnel; liveDocument: HarvestFunnel };
	/**
	 * What a typed prefix would be offered, when one was passed.
	 *
	 * The harvester's own answer, not a prediction of what will appear on screen:
	 * the plugin still has to find the scored path finished and empty on that
	 * prefix, and still applies the accept cooldown and the repetition check.
	 */
	match?: HarvestMatch | null;
	/** The whole set in collapse order, so the winner for any prefix is above its rivals. */
	terms: HarvestTermSnapshot[];
}

/**
 * Read the session's harvest, optionally asking what `typedPrefix` would get.
 *
 * Installed as `__atlCtcDebug__.harvest()` and returned rather than logged, so
 * the console renders it as an inspectable object and a caller can assert on it.
 */
export const inspectInlineCodeHarvest = (typedPrefix?: string): HarvestSnapshot => ({
	cap: MAX_HARVESTED_TERMS,
	evicted: evictedTerms,
	funnels: { context: { ...contextFunnel }, liveDocument: { ...documentFunnel } },
	...(typedPrefix === undefined ? {} : { match: findHarvestedCompletion(typedPrefix) }),
	terms: Array.from(harvested.values())
		.sort(byCollapseOrder)
		.map((term) => ({
			documentSpans: term.documentSpans,
			longEnough: term.displayable,
			offerable: isDisplayEligible(term),
			replyOccurrences: term.replyOccurrences,
			sightings: sightingsOf(term),
			surface: term.surface,
		})),
});

// At module scope so the console API answers before the first keystroke, which
// is when someone reaching for it usually asks.
registerCtcHarvestInspector(inspectInlineCodeHarvest);

export const resetInlineCodeHarvest = (): void => {
	harvested.clear();
	contextFunnel = emptyFunnel();
	documentFunnel = emptyFunnel();
	evictedTerms = 0;
	lastLoggedSignature = '';
};

/**
 * Print the funnel when it has moved since the last print.
 *
 * Deliberately reports zero-span and all-rejected passes too. Logging only on a
 * successful harvest makes "the replies held no inline code", "every span was
 * filtered out" and "this never ran" indistinguishable, which are the three
 * things worth telling apart.
 */
export const logInlineCodeHarvest = (trigger: string): void => {
	if (!isAutocompleteDebugEnabled()) {
		return;
	}
	const snapshot = inspectInlineCodeHarvest();
	const offerable = snapshot.terms.filter((term) => term.offerable && term.longEnough);
	const spansFound = contextFunnel.spansFound + documentFunnel.spansFound;
	const signature = `${spansFound}:${snapshot.terms.length}:${offerable.length}`;
	if (signature === lastLoggedSignature) {
		return;
	}
	lastLoggedSignature = signature;

	ctcTag(
		'harvest',
		`${trigger} · ${spansFound} inline spans → ${snapshot.terms.length} kept, ${offerable.length} offerable${
			evictedTerms > 0 ? `, ${evictedTerms} evicted` : ''
		} · __atlCtcDebug__.harvest() to inspect`,
		CTC_STYLES.lm,
	);
	if (isAutocompleteDebugVerbose()) {
		// eslint-disable-next-line no-console
		console.table(snapshot.funnels);
		// eslint-disable-next-line no-console
		console.table(snapshot.terms);
	}
};
