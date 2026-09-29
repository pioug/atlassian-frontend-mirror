import selectorParser, {
	type Combinator,
	type Node,
	type Pseudo,
	type Selector,
} from 'postcss-selector-parser';

/**
 * # Top layer selector safety transform
 *
 * A pure function over selector text. The `no-top-layer-unsafe-selectors` ESLint rule drives it
 * for its autofix. It is kept separate from the rule so that a bulk sweep over the sources an
 * ESLint rule cannot see (`.css` files, `injectGlobal` bodies) can run the same code rather than
 * a second copy of the rewrite.
 *
 * ## Why
 *
 * Design System layering surfaces (popup, tooltip, modal, drawer…) are moving out of React
 * portals and into the browser top layer behind the `platform-dst-top-layer` gate. The host
 * — a `<div popover>` or a `<dialog>` — becomes a real node in the consumer's DOM. Consumer
 * CSS that could never reach a portalled surface now matches it, and positional selectors
 * that counted only real children now count the host.
 *
 * The canonical guard forms, the specificity reasoning, and the list of patterns for which
 * no guard form exists live in the decision doc:
 *
 * `platform/packages/design-system/top-layer/notes/decisions/top-layer-unsafe-selectors.md`
 *
 * ## Why a guard is the right fix at all
 *
 * The governing principle, and the cleanest statement of when this transform helps rather than
 * harms:
 *
 * > A guard is safe when it **restores pre-flag behaviour**, and harmful when it **removes
 * > something the host had pre-flag**. Global-scope selectors reached the portalled host;
 * > consumer-scoped selectors did not.
 *
 * Pre-flag the host was portalled to `body`, so a consumer-scoped rule such as `& > div` never
 * matched it. Post-flag it does — that is the damage, and guarding restores what the consumer
 * used to render. A global rule such as `* { box-sizing: inherit }`, by contrast, matched the
 * portalled host all along; guarding it would take away something the host already had, which
 * is a behaviour change rather than a fix.
 *
 * The discriminator is **reach**, not property semantics — which is why no browser measurement
 * can settle it. A browser can say what `box-sizing` does; it cannot say what the DOM looked
 * like before the flag.
 *
 * Operationally, at `global` scope a compound with nothing but the document itself above it
 * (`html`, `body`, `:root`, `*`, or no ancestor at all) is left alone: `div`, `body div` and
 * `* + *` all reached the portalled surface's content already. A compound below a consumer's
 * own ancestor (`.sidebar div`, `.x > div`) is guarded as usual, because the host inside that
 * ancestor is a new match. See {@link isDocumentLevelCompound}.
 *
 * One ancestor is ambiguous: a bare `div`. The portal container and every surface wrapper were
 * divs, so `div span` at global scope may well have reached the surface's content already, yet
 * the author may equally have meant their own wrapper. The transform does not guess. A compound
 * whose ancestors are all document-level or bare `div`, with at least one bare `div`, is returned
 * as `excluded` with `reviewCause: 'div-ancestor'`, which a bulk caller can surface as a comment
 * at the site for a human to decide. See {@link isBareDivCompound}.
 *
 * ## Contract
 *
 * `rewriteSelector(selector)` is pure, total and idempotent. It accepts both nested
 * authoring selectors (containing `&`) and plain CSS selectors, so a `.css`-file sweep can
 * reuse it. It never returns a partial rewrite: a selector is either fully rewritten, or
 * provably already safe, or refused with a reason.
 *
 * A selector with no `&` reads differently depending on where it is written. Inside a style
 * object or a `css` template the authoring API scopes it to the component's own element, so
 * `:hover` means `&:hover` and `span` means `& span`. In a plain stylesheet it reaches the
 * whole document. The caller says which with {@link RewriteOptions.scope}; the ESLint rule
 * always passes `nested`.
 *
 * One family is **reported but not fixed**: any rewrite that would need an `of S` clause, which
 * is every positional pseudo-class. Compiled's extract mode drops the CSS for such a selector
 * outright, so the guard deletes styling instead of protecting it. See
 * {@link WITHDRAWN_POSITIONAL_FORMS} for the measurement. The planner refuses the family in
 * {@link planPositionals}, and a selector that already carries an `of` clause is refused
 * before planning starts.
 *
 * Every rewrite is specificity-neutral. That is enforced structurally, not merely tested:
 * the transform recomputes (a,b,c) branch-by-branch on its own output and downgrades the
 * result to `residue` if it does not match the input. It also re-checks its own output for a
 * nested `:has()`, which Chromium rejects outright.
 *
 * ## A note on the literal guard strings below
 *
 * The guard text is emitted *literally* into the rewritten selector at every site — never
 * interpolated from a constant in the generated code. A ratcheting rule matches raw source
 * text, so a guard interpolated from a constant in consumer code would make the ratchet's
 * count assertions vacuous. The constants here are internal to this module; what lands in
 * consumer source is always the full literal list.
 */

/* -------------------------------------------------------------------------------------- */
/* Guard forms — authoritative, from the decision doc                                       */
/* -------------------------------------------------------------------------------------- */

/**
 * The narrow guard, `:not(:where(L))`. Appended where the matching element could *be* the
 * host: child-combinator compounds, sibling-combinator right-hand compounds, and the
 * leftmost compound of a selector.
 *
 * `[popover]` and `dialog` cover both routes into the top layer — `popover` for
 * popover-based surfaces, and `dialog` for modal and drawer, which use `showModal()` and set
 * no `popover` attribute.
 *
 * `style`, `script`, `template`, `link` and `noscript` are left out on purpose. They are
 * `display: none`, so a style that reaches them has no visible effect unless it sets
 * `display`, and that hazard predates the top layer. They only matter to positional
 * selectors, which have no guard form (see `S`).
 *
 * Specificity: `:where()` is weightless and `:not()` inherits the specificity of its
 * argument, so this contributes (0,0,0).
 */
const NARROW_GUARD = ':not(:where([popover], dialog))';

/**
 * The wide guard, `:not(:where(L_wide))`. Appended where the matching element could be the
 * host *or anything inside its subtree*: `:has()` arguments, and descendant-combinator
 * compounds where the host may be any intermediate ancestor.
 *
 * Specificity: (0,0,0), for the same reason as the narrow guard.
 */
const WIDE_GUARD = ':not(:where([popover], dialog, [popover] *, dialog *))';

/**
 * `S` — the weightless "is a real, non-host element" test used as the `of S` argument to
 * `:nth-child()` / `:nth-last-child()`, where it re-bases sibling counting onto real
 * elements only.
 *
 * Unlike `L`, `S` lists the non-rendered elements too, because SSR and dev-loop style
 * injection add them as siblings and they shift the count exactly as a host does.
 *
 * `of S` must stay **narrow**. An `of` argument containing `[popover] *` would filter real
 * descendants out of the sibling count, which is the opposite of the intent.
 */
const S = ':not(:where([popover], dialog, style, script, template, link, noscript))';

/**
 * `X:first-child` → `X:nth-child(1 of S)`
 */
const NTH_FIRST =
	':nth-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript)))';

/**
 * `X:last-child` → `X:nth-last-child(1 of S)`
 */
const NTH_LAST =
	':nth-last-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript)))';

/**
 * `X:not(:first-child)` → `X:nth-child(n+2 of S)`
 */
const NTH_NOT_FIRST =
	':nth-child(n+2 of :not(:where([popover], dialog, style, script, template, link, noscript)))';

/**
 * `X:not(:last-child)` → `X:nth-last-child(n+2 of S)`
 */
const NTH_NOT_LAST =
	':nth-last-child(n+2 of :not(:where([popover], dialog, style, script, template, link, noscript)))';

/**
 * `X:only-child` → `X:nth-child(1 of S):not(:where(:nth-last-child(n+2 of S)))`
 *
 * The naive form — `:nth-child(1 of S):nth-last-child(1 of S)` — is (0,2,0) against
 * `:only-child`'s (0,1,0). So is `:nth-child(1 of S):not(:nth-last-child(n+2 of S))`, because
 * `:not()` inherits its argument's weight. Wrapping the negation in `:where()` makes it
 * weightless and brings the pair back to (0,1,0).
 */
const NTH_ONLY =
	':nth-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript))):not(:where(:nth-last-child(n+2 of :not(:where([popover], dialog, style, script, template, link, noscript)))))';

/**
 * # The `of S` family is WITHDRAWN — reported, never emitted
 *
 * Every form above stays in this file, and stays literal, because each is correct CSS and each
 * is verified against real Chromium by the harness. None of them is emitted today, because the
 * **build** loses them.
 *
 * `@compiled/react` in `extract: true` mode — platform's `.compiledcssrc`, which every
 * Atlaspack build uses, including `gemini-vr` — writes the atomic class names for a rule whose
 * selector contains `:nth-child(An+B of S)` or `:nth-last-child(An+B of S)` onto the element
 * and **omits the CSS rules themselves**. No warning, no build error: the class is on the
 * element and there is no rule behind it, so the declarations are silently gone.
 *
 * Measured on `@atlaskit/breadcrumbs` by a VR run:
 *
 * | Selector                                        | Rules in page | Matching `::after` rules | `content` |
 * | ----------------------------------------------- | ------------- | ------------------------ | --------- |
 * | `&:not(:last-child)::after` (control)           | 325           | 7                        | `"/"`     |
 * | `&:nth-last-child(n+2 of S)::after` (guard)     | 318           | **0**                    | `none`    |
 *
 * 325 − 318 is exactly the seven dropped atomic rules, and every `/` separator disappeared from
 * the page. The trigger is the `of <selector-list>` clause itself, not the guard: `of li` fails
 * identically, and a plain `:nth-last-child(n+2)` survives. Ruled out everywhere else — the
 * selector survives `@compiled/babel-plugin` in non-extract mode, `@compiled/css`'s `sort()`,
 * lightningcss 1.32 at every browser target and with `cssModules` either way, cssnano,
 * postcss-minify-selectors and postcss-selector-parser, and Chromium 143 matches it correctly
 * against the real class list and the real DOM. Only the extract pipeline loses it.
 *
 * So for the positional family the guard does not merely fail to help — **it deletes working
 * styling**. That is the one outcome worse than leaving the site unguarded, and it is why the
 * fix is withheld rather than offered:
 *
 * - a selector that *would* need an `of` clause is refused as `residue` by
 *   {@link planPositionals}, so the ESLint rule reports it under `no-guard-form` and offers no
 *   autofix, and any bulk caller sharing this module inherits the refusal rather than being free
 *   to mass-apply the rewrite;
 * - a selector that *already carries* an `of` clause is refused for the same reason rather than
 *   merged or extended, before planning starts in {@link rewriteSelector}. Its CSS is already
 *   being dropped in every extract build, so calling it `excluded` ("nothing to do") would
 *   assert a safety it does not have.
 *
 * {@link rewriteSelector} also checks its emitted text for an `of` clause as a backstop. Nothing
 * emits one today, so that check firing is a bug in the transform, not a withdrawal.
 *
 * The other ~75% of the debt is unaffected: `> *`, `> div`, `:has()` and the descendant forms
 * emit a plain `:not(:where(…))` with no `of` clause, and those extract normally.
 */
const WITHDRAWN_POSITIONAL_FORMS: ReadonlyMap<string, string> = new Map([
	[':first-child', NTH_FIRST],
	[':last-child', NTH_LAST],
	[':only-child', NTH_ONLY],
	[':not(:first-child)', NTH_NOT_FIRST],
	[':not(:last-child)', NTH_NOT_LAST],
]);

/**
 * The term list of the narrow guard, in canonical order. Used when merging.
 */
const NARROW_TERMS: readonly string[] = ['[popover]', 'dialog'];

/**
 * The term list of the wide guard, in canonical order. Used when merging.
 */
const WIDE_TERMS: readonly string[] = ['[popover]', 'dialog', '[popover] *', 'dialog *'];

/* -------------------------------------------------------------------------------------- */
/* Public types                                                                            */
/* -------------------------------------------------------------------------------------- */

export type Population =
	/**
	 * No human judgement is required. Either a guard form exists and has been applied
	 * (`after` is set), or the selector is provably already safe (`after` is `null`, with a
	 * `reason` saying why nothing was needed).
	 */
	| 'guardable'
	/**
	 * No guard form exists for this selector. Needs human triage. `after` is `null`.
	 */
	| 'residue'
	/**
	 * Out of reach of any host — nothing to do, nothing to triage. `after` is `null`. The one
	 * exception carries a `reviewCause`: the transform could not decide the reach question from
	 * the selector alone and a human must. Nothing is written for it either way.
	 */
	| 'excluded'
	/**
	 * Statically undecidable: a dynamically-constructed selector, an unterminated argument, or
	 * text the parser rejects. `after` is `null`.
	 */
	| 'skipped';

export type DamageMode =
	/**
	 * A declaration lands on the host, or on something inside it, that was never meant to
	 * receive it — or a real element starts matching because the host is inside it. Fixed by a
	 * `:not()` guard.
	 */
	| 'popover-receives'
	/**
	 * The host takes a positional slot, so a *real* element stops matching. Only `of S` fixes
	 * this; a `:not()` guard cannot. Never reported while the `of S` family is withdrawn,
	 * because no rewrite that would close it is emitted.
	 */
	| 'real-element-loses';

/**
 * CSS specificity as `[ids, classes, types]`.
 */
export type Specificity = [number, number, number];

/**
 * The rule body belonging to the selector, when the caller has it.
 *
 * Accepts either raw CSS declaration text — the shape the enumeration schema stores in its
 * `declarations` column — or a style object with camelCase or kebab-case keys.
 */
export type Declarations = string | Record<string, string | number | null | undefined>;

/**
 * Where a selector is written, which decides how a branch with no `&` is read.
 */
export type SelectorScope =
	/**
	 * A style object, a `css` / `styled` template, or a `css` prop. The authoring API scopes a
	 * branch with no `&` to the component's own element: a branch starting with a pseudo is
	 * `&:pseudo`, and any other branch is `& branch`. Such a branch is rewritten exactly as its
	 * `&` spelling would be, and the `&`-less spelling is preserved in the output.
	 */
	| 'nested'
	/**
	 * A plain stylesheet. A branch with no `&` reaches the whole document.
	 */
	| 'global';

export type RewriteOptions = {
	/**
	 * Defaults to `global`, which is the reading a `.css`-file sweep needs. The ESLint rule
	 * passes `nested` for everything it visits.
	 */
	scope?: SelectorScope;
};

/**
 * Why a selector was skipped rather than decided.
 */
export type SkipCause =
	/**
	 * The text is not statically known: it carries a template-literal or preprocessor
	 * interpolation.
	 */
	| 'dynamic'
	/**
	 * The text is known but is not a selector the parser accepts: unbalanced brackets, an empty
	 * string, or a parse failure. Most likely an authoring mistake.
	 */
	| 'malformed';

/**
 * Why an `excluded` selector still needs a human decision.
 */
export type ReviewCause =
	/**
	 * At global scope, a guarded compound sits below a bare `div` ancestor. The portal container
	 * and every surface wrapper were divs, so the rule may already have reached the surface's
	 * content before the flag, or the div may be the author's own wrapper. Only the author knows.
	 */
	'div-ancestor';

export type RewriteResult = {
	/**
	 * The selector exactly as it was passed in.
	 */
	before: string;
	/**
	 * The rewritten selector, or `null` when there is nothing to write. Non-null only when
	 * `population === 'guardable'` *and* `guardCount > 0`.
	 *
	 * Whitespace around combinators and list separators is normalised, so `after` may differ
	 * from `before` in formatting as well as in the guards added.
	 */
	after: string | null;
	population: Population;
	/**
	 * Empty unless a rewrite was emitted. Order is stable and deduplicated.
	 */
	damageModes: DamageMode[];
	/**
	 * The number of guards written. Each guarded compound of the main selector counts once —
	 * even when its guard expands to two pseudo-classes, as `:only-child` does — and each
	 * guarded top-level comma branch of a `:has()` counts once.
	 *
	 * These counts are asserted downstream by the verification scripts:
	 * - `'.x:has(button, a)'` → 2
	 * - `'& > div > div'`     → 2
	 * - `'& > div > span'`    → 1
	 */
	guardCount: number;
	/**
	 * Mandatory for `residue`, `excluded` and `skipped`, and for a `guardable` result with no
	 * `after`. Also present on a `guardable` result that carries a residual exposure a guard
	 * cannot close — read it, it is not decoration.
	 */
	reason?: string;
	/**
	 * Present only when `population === 'skipped'`. Says whether the selector was skipped
	 * because its text is not known (`dynamic`) or because its text does not parse
	 * (`malformed`), so a caller can word its report accordingly.
	 */
	skipCause?: SkipCause;
	/**
	 * Present only when `population === 'excluded'` and the exclusion is a deferral rather than
	 * a verdict: the transform would have written a guard but the reach question cannot be
	 * settled from the selector alone. A caller that writes files should mark the site for a
	 * human instead of filing it as out of reach.
	 */
	reviewCause?: ReviewCause;
	/**
	 * Max (a,b,c) across the top-level comma branches of `before`.
	 */
	specificityBefore: Specificity;
	/**
	 * Max (a,b,c) across the top-level comma branches of `after`, or of `before` when there is
	 * no `after`. Always equal to `specificityBefore` — a rewrite that would change
	 * specificity is refused as `residue` rather than emitted.
	 */
	specificityAfter: Specificity;
};

/* -------------------------------------------------------------------------------------- */
/* Refusal sets                                                                            */
/* -------------------------------------------------------------------------------------- */

/**
 * `*-of-type` counts siblings by tag name and accepts no `of S` argument, so its counting
 * cannot be re-based onto real elements. Note that the pre-existing ratcheting rule advises
 * authors to migrate *towards* these; that advice is wrong for top layer.
 */
const OF_TYPE_PSEUDOS: ReadonlySet<string> = new Set([
	':first-of-type',
	':last-of-type',
	':only-of-type',
	':nth-of-type',
	':nth-last-of-type',
]);

/**
 * These match an element *and its ancestors*, so the flip exists only while the pointer or
 * focus is inside the surface and there is no guard form at any depth. Inside `:has()` the
 * subject itself satisfies the argument; on a subject compound the element inherits the state
 * from a surface nested inside it.
 */
const ANCESTOR_PROPAGATING_PSEUDOS: ReadonlySet<string> = new Set([
	':hover',
	':active',
	':focus-within',
]);

/**
 * Positional pseudo-classes that count siblings, and so can be re-based with `of S`.
 */
const POSITIONAL_PSEUDOS: ReadonlySet<string> = new Set([
	':first-child',
	':last-child',
	':only-child',
	':nth-child',
	':nth-last-child',
]);

const LEGACY_PSEUDO_ELEMENTS: ReadonlySet<string> = new Set([
	':before',
	':after',
	':first-line',
	':first-letter',
]);

/**
 * Element types a top layer host can have. The host is either a `<div popover>` or a
 * `<dialog>`; nothing else.
 */
const HOST_TAGS: ReadonlySet<string> = new Set(['div', 'dialog']);

/**
 * Tag names that appear as terms of `L` or `S`. Used to recognise a pre-existing guard, so a
 * hand-written guard that lists `style` and the rest is still merged into, not doubled.
 */
const GUARD_TERM_TAGS: ReadonlySet<string> = new Set([
	'dialog',
	'style',
	'script',
	'template',
	'link',
	'noscript',
]);

/**
 * Pseudo-classes and pseudo-elements that only a top layer host can satisfy. A compound
 * carrying one names a host as surely as `dialog` or `[popover]` does, so it is never guarded:
 * every guard form would exclude exactly what the compound selects.
 */
const HOST_PSEUDOS: ReadonlySet<string> = new Set([':popover-open', ':modal', '::backdrop']);

/**
 * The comparison key for a guard term. Tag and attribute names are ASCII case-insensitive in
 * HTML, so `[POPOVER]` and `DIALOG` are the terms `[popover]` and `dialog`, and a guard spelled
 * in uppercase must be recognised rather than have the lowercase terms merged in beside it.
 */
const normalise = (text: string): string => text.replace(/\s+/g, '').toLowerCase();
const NARROW_TERM_KEYS: ReadonlySet<string> = new Set(NARROW_TERMS.map(normalise));
const WIDE_TERM_KEYS: ReadonlySet<string> = new Set(WIDE_TERMS.map(normalise));

/* -------------------------------------------------------------------------------------- */
/* Public API                                                                              */
/* -------------------------------------------------------------------------------------- */

/**
 * Rewrite a selector so a top layer host can neither receive its declarations nor displace
 * the real elements it targets.
 *
 * Pure and idempotent: feeding `after` back in yields `guardCount: 0` and `after: null`.
 *
 * @param selector A single selector or a comma-separated selector list. May contain the
 * nesting selector `&`.
 * @param declarations The rule body, if the caller has it. Used for exactly one decision — see
 * {@link findResetSignal}. Omitting it never produces a *wrong* answer, only a lossier one.
 * @param options See {@link RewriteOptions}.
 */
export function rewriteSelector(
	selector: string,
	declarations?: Declarations,
	options?: RewriteOptions,
): RewriteResult {
	const skip = getSkipReason(selector);
	if (skip) {
		return skipped(selector, skip.reason, skip.cause);
	}

	let parsed: Selector[];
	try {
		parsed = parse(selector);
	} catch {
		return skipped(
			selector,
			'The selector could not be parsed, so it cannot be rewritten safely. This is most likely an authoring mistake.',
			'malformed',
		);
	}

	if (parsed.length === 0) {
		return excluded(selector, [0, 0, 0], 'The selector is empty.');
	}

	/**
	 * In a nested context a branch with no `&` is scoped to the component's own element. It is
	 * rewritten under its explicit `&` spelling, so it reaches the same verdict, and the prefix is
	 * stripped again on the way out so the author's spelling is preserved.
	 */
	const scope = options?.scope ?? 'global';
	const scoped = applyScope(parsed, scope);
	if (scoped === null) {
		return skipped(
			selector,
			'The selector could not be re-parsed under its nesting scope, so it cannot be rewritten safely.',
			'malformed',
		);
	}
	const { branches, prefixes } = scoped;

	const specificityBranchesBefore = branches.map(specificityOfSelector);
	const specificityBefore = maxSpecificity(specificityBranchesBefore);

	/**
	 * A bare universal at global scope. **The one class where guarding is actively harmful rather
	 * than merely useless**, so it is decided before anything else.
	 *
	 * `* { box-sizing: inherit }` is a reset. Guarding it excludes the host from the reset and
	 * makes it the only element in the document with a different box model — a layout bug
	 * introduced by the fix, with nothing to compensate, because the host surface reset covers
	 * text-layout properties and not the box model.
	 *
	 * `* { cursor: col-resize }` is an override with identical selector text, and it does need the
	 * guard. The selector cannot tell them apart, so this is a judgement call about the rule body.
	 *
	 * Note this is *not* the property-effect filter. That filter is about declarations that are
	 * inert on a `position: fixed` host (`flex`, `order`, `z-index`, …). Here the declaration is
	 * live on the host and *wanted* there.
	 */
	if (branches.some(isBareGlobalUniversal)) {
		const reset = findResetSignal(declarations);
		if (reset) {
			return excluded(
				selector,
				specificityBefore,
				`A bare universal selector at global scope carrying '${reset}', which is reset-shaped rather than an override. Guarding it would exclude the top layer host from the reset and leave it the only element in the document with different inherited defaults — a layout bug introduced by the fix. Left alone deliberately.`,
			);
		}
		return residue(
			selector,
			specificityBefore,
			"A bare universal selector at global scope. Whether this needs the guard depends on the rule body, which the selector cannot reveal: `* { box-sizing: inherit }` is a reset and guarding it would exclude the host from the reset — a layout bug introduced by the fix — while `* { cursor: col-resize }` is an override and does need it. Decide from the declarations. A *scoped* universal ('& > *', '.foo > *') is unaffected and is rewritten normally.",
		);
	}

	/**
	 * **Input gate for the `of S` withdrawal** — see {@link WITHDRAWN_POSITIONAL_FORMS}.
	 *
	 * A selector that already carries an `of` argument is emitting no CSS at all in an extract
	 * build, whichever list it carries and whoever wrote it. Refusing it here reports it for
	 * triage instead of merging its terms up to the canonical seven — a merge would leave the
	 * site exactly as dead as it was, while reading in review as a fix.
	 *
	 * This covers both a partial guard in the `of` list and an unrelated `of` list; neither is
	 * merged.
	 */
	for (const branch of branches) {
		const existing = findOfClause(branch);
		if (existing) {
			return residue(selector, specificityBefore, ofClausePresentReason(existing));
		}
	}

	const plan = createPlan();
	for (const branch of branches) {
		planBranch(branch, plan, scope);
	}

	/**
	 * A hard refusal stands whether or not anything else in the selector is guardable.
	 * Refusing the whole selector — rather than rewriting the parts that do have a guard form
	 * — is deliberate. A partially rewritten selector reads as fixed and is not, which is the
	 * worst outcome available here.
	 */
	if (plan.hardRefusals.length > 0) {
		return residue(selector, specificityBefore, plan.hardRefusals[0]);
	}

	/**
	 * A compound the transform declined to decide hands the whole selector to a human. Guards
	 * that would have been written on its other compounds are withheld too: a partially
	 * rewritten selector next to a review comment would read as fixed.
	 */
	if (plan.reviews.length > 0) {
		return review(selector, specificityBefore, plan.reviews[0]);
	}

	if (plan.guardCount === 0) {
		/**
		 * Nothing needed writing. A soft refusal only matters when a guard would otherwise have
		 * been written next to it, because that is the case where the result would read as
		 * fixed. On its own it is reported but not queued for triage.
		 */
		const why =
			plan.softRefusals[0] ??
			plan.reachSuppressions[0] ??
			(plan.sawGeneralSibling
				? 'The general sibling combinator is insensitive to insertion — a host inserted between siblings removes no real match — and no compound this selector matches can be a host. Already safe.'
				: 'No top layer host can be, contain, or displace any element this selector matches.');

		if (
			plan.sawGeneralSibling &&
			plan.softRefusals.length === 0 &&
			plan.reachSuppressions.length === 0
		) {
			return {
				before: selector,
				after: null,
				population: 'guardable',
				damageModes: [],
				guardCount: 0,
				reason: why,
				specificityBefore,
				specificityAfter: specificityBefore,
			};
		}

		return excluded(selector, specificityBefore, why);
	}

	if (plan.softRefusals.length > 0) {
		return residue(selector, specificityBefore, plan.softRefusals[0]);
	}

	const emitted = branches.map((branch, index) =>
		stripScopePrefix(emitSelector(branch, plan), prefixes[index]),
	);
	if (emitted.some((branch) => branch === null)) {
		return residue(
			selector,
			specificityBefore,
			'The rewritten selector lost its implicit nesting prefix, so it was not emitted. This is a bug in the transform — please report it.',
		);
	}
	const after = emitted.join(', ');

	/**
	 * A bracket-level sanity check on the emitted text before anything downstream writes it to
	 * a file. `postcss-selector-parser` is lenient, so this catches a class of malformed output
	 * that would otherwise round-trip.
	 */
	if (!isBalanced(after)) {
		return residue(
			selector,
			specificityBefore,
			'The rewritten selector does not have balanced brackets, so it was not emitted. This is a bug in the transform — please report it.',
		);
	}

	/**
	 * Chromium rejects an entire selector containing a `:has()` inside a `:has()` argument,
	 * which silently stops the rule applying at all. Nothing in the guard forms contains a
	 * `:has()`, but verify rather than assume — this failure mode looks like a fix and
	 * disables the rule.
	 */
	let afterBranches: Selector[];
	try {
		afterBranches = parse(after);
	} catch {
		return residue(
			selector,
			specificityBefore,
			'The rewritten selector could not be re-parsed, so it could not be verified.',
		);
	}

	/**
	 * Backstop for the `of S` withdrawal — see {@link WITHDRAWN_POSITIONAL_FORMS}. The planner
	 * refuses every positional pseudo in {@link planPositionals}, so nothing reaching this point
	 * should carry an `of` clause. Checked on the emitted text so a future emit site cannot
	 * slip one past the planner.
	 */
	for (const branch of afterBranches) {
		if (findOfClause(branch)) {
			return residue(
				selector,
				specificityBefore,
				`The rewrite would emit an \`of\` clause, which is withdrawn. ${EXTRACT_DEFECT} This is a bug in the transform — please report it.`,
			);
		}
	}

	for (const branch of afterBranches) {
		if (hasNestedHas(branch)) {
			return residue(
				selector,
				specificityBefore,
				'The rewrite would produce a `:has()` nested inside a `:has()` argument, which Chromium rejects outright — the whole rule would silently stop applying.',
			);
		}
	}

	/**
	 * Structural specificity check. `:where()` being weightless, `:not()` inheriting its
	 * argument's weight, and `of S` contributing only the pseudo-class are all load-bearing —
	 * so verify, branch by branch, on the emitted text.
	 */
	const specificityBranchesAfter = afterBranches.map(specificityOfSelector);

	if (specificityBranchesAfter.length !== specificityBranchesBefore.length) {
		return residue(
			selector,
			specificityBefore,
			'The rewrite changed the number of selectors in the list, so it could not be verified.',
		);
	}

	for (let index = 0; index < specificityBranchesBefore.length; index++) {
		const from = specificityBranchesBefore[index];
		const to = specificityBranchesAfter[index];
		if (!sameSpecificity(from, to)) {
			return residue(
				selector,
				specificityBefore,
				`The rewrite would change specificity from (${from.join(',')}) to (${to.join(
					',',
				)}) for '${branches[index]
					.toString()
					.trim()}'. Every guard form must be specificity-neutral.`,
			);
		}
	}

	const damageModes: DamageMode[] = [];
	if (plan.receives) {
		damageModes.push('popover-receives');
	}

	const result: RewriteResult = {
		before: selector,
		after,
		population: 'guardable',
		damageModes,
		guardCount: plan.guardCount,
		specificityBefore,
		specificityAfter: maxSpecificity(specificityBranchesAfter),
	};

	if (plan.residualNotes.length > 0) {
		result.reason = plan.residualNotes[0];
	}

	return result;
}

/* -------------------------------------------------------------------------------------- */
/* Result constructors                                                                     */
/* -------------------------------------------------------------------------------------- */

function skipped(before: string, reason: string, cause: SkipCause): RewriteResult {
	return {
		before,
		after: null,
		population: 'skipped',
		damageModes: [],
		guardCount: 0,
		reason,
		skipCause: cause,
		specificityBefore: [0, 0, 0],
		specificityAfter: [0, 0, 0],
	};
}

function residue(before: string, specificity: Specificity, reason: string): RewriteResult {
	return {
		before,
		after: null,
		population: 'residue',
		damageModes: [],
		guardCount: 0,
		reason,
		specificityBefore: specificity,
		specificityAfter: specificity,
	};
}

function excluded(before: string, specificity: Specificity, reason: string): RewriteResult {
	return {
		before,
		after: null,
		population: 'excluded',
		damageModes: [],
		guardCount: 0,
		reason,
		specificityBefore: specificity,
		specificityAfter: specificity,
	};
}

function review(before: string, specificity: Specificity, reason: string): RewriteResult {
	return {
		...excluded(before, specificity, reason),
		reviewCause: 'div-ancestor',
	};
}

/* -------------------------------------------------------------------------------------- */
/* Nesting scope                                                                           */
/* -------------------------------------------------------------------------------------- */

type ScopedBranches = {
	branches: Selector[];
	/**
	 * Per branch, the implicit `&` prefix that was added for planning, or `null` when the author
	 * wrote one. Stripped from the emitted text again.
	 */
	prefixes: (string | null)[];
};

/**
 * Under `nested` scope, spell out the `&` the authoring API implies for every branch that has
 * none, then re-parse. Under `global` scope the branches are returned untouched.
 *
 * The prefix is text rather than a synthetic AST node so the branch takes exactly the code path
 * its explicit `&` spelling takes; nothing downstream needs to know the `&` was implied.
 */
function applyScope(branches: Selector[], scope: SelectorScope): ScopedBranches | null {
	if (scope === 'global') {
		return { branches, prefixes: branches.map(() => null) };
	}

	const prefixes = branches.map(implicitNestingPrefix);
	if (prefixes.every((prefix) => prefix === null)) {
		return { branches, prefixes };
	}

	const text = branches
		.map((branch, index) => `${prefixes[index] ?? ''}${branch.toString().trim()}`)
		.join(', ');

	try {
		const reparsed = parse(text);
		if (reparsed.length !== branches.length) {
			return null;
		}
		return { branches: reparsed, prefixes };
	} catch {
		return null;
	}
}

/**
 * The `&` a nested authoring API prepends to a branch with no `&` of its own. A branch that
 * opens with a pseudo attaches to the parent compound (`:hover` is `&:hover`); anything else is
 * a descendant (`span` is `& span`, `> *` is `& > *`).
 */
function implicitNestingPrefix(branch: Selector): string | null {
	let hasNesting = false;
	branch.walk((node) => {
		if (node.type === 'nesting') {
			hasNesting = true;
		}
	});
	if (hasNesting) {
		return null;
	}

	const first = nonEmptyNodes(branch)[0];
	if (!first) {
		return null;
	}
	if (first.type === 'pseudo') {
		return '&';
	}
	return '& ';
}

/**
 * Remove the prefix {@link applyScope} added. The `&` compound is never guarded or replaced, so
 * the emitted branch always opens with it; `null` if it does not, which is a transform bug.
 */
function stripScopePrefix(emitted: string, prefix: string | null): string | null {
	if (prefix === null) {
		return emitted;
	}
	if (!emitted.startsWith(prefix)) {
		return null;
	}
	return emitted.slice(prefix.length);
}

/* -------------------------------------------------------------------------------------- */
/* The `of S` withdrawal — see WITHDRAWN_POSITIONAL_FORMS                                   */
/* -------------------------------------------------------------------------------------- */

/**
 * The defect, stated once for the refusal reasons, so a developer reading the squiggle learns
 * why the fix is missing rather than only that it is. The measurement behind it lives in the
 * {@link WITHDRAWN_POSITIONAL_FORMS} docblock.
 */
const EXTRACT_DEFECT =
	'`@compiled/react` in `extract: true` mode, which every Atlaspack build uses, emits the atomic class names for a rule whose selector carries an `of` argument but omits the CSS rules themselves. There is no warning and no build error, so the declarations are silently lost.';

/**
 * Lowercased pseudo-class name. CSS pseudo-class names are ASCII case-insensitive, so every
 * decision keyed on a name must normalise first: `:NTH-CHILD(1 of .foo)` is the same selector
 * as `:nth-child(1 of .foo)` and must reach the same verdict.
 */
function pseudoName(node: { value?: string | null }): string {
	return (node.value ?? '').toLowerCase();
}

/**
 * Find a `:nth-child()` / `:nth-last-child()` carrying an `of` argument, at any depth —
 * including inside a `:has()`, `:is()`, `:where()` or `:not()` argument.
 */
function findOfClause(branch: Selector): Pseudo | null {
	const found: Pseudo[] = [];

	branch.walkPseudos((pseudo) => {
		const name = pseudoName(pseudo);
		if (name !== ':nth-child' && name !== ':nth-last-child') {
			return;
		}
		if (findOfKeyword(nthArgumentText(pseudo)) === -1) {
			return;
		}
		found.push(pseudo);
	});

	return found[0] ?? null;
}

/**
 * The guard form that would have been emitted for a positional pseudo-class, spelled with `S`
 * rather than the seven terms so the report stays readable. `null` when this pseudo is not one
 * of the positional family.
 */
function withdrawnFormFor(pseudo: Pseudo): string | null {
	const name = pseudoName(pseudo);

	if (name === ':nth-child' || name === ':nth-last-child') {
		return `${name}(${nthArgumentText(pseudo).trim()} of S)`;
	}

	if (name === ':not') {
		const sole = solePseudoInside(pseudo);
		const form = sole ? WITHDRAWN_POSITIONAL_FORMS.get(`:not(${pseudoName(sole)})`) : undefined;
		return form ? abbreviate(form) : null;
	}

	const form = WITHDRAWN_POSITIONAL_FORMS.get(name);
	return form ? abbreviate(form) : null;
}

/**
 * Collapse the seven-term list back to `S`. The literal is what gets *written*; `S` is what
 * gets *read*.
 */
function abbreviate(form: string): string {
	return form.split(S).join('S');
}

/**
 * Why a rewrite that needs an `of` clause is withheld. Names the pseudo-class and the form that
 * would have been emitted for it, so the report is specific about what was withdrawn.
 */
function ofClauseWithheldReason(pseudo: Pseudo): string {
	const form = withdrawnFormFor(pseudo);
	const name = pseudoName(pseudo) === ':not' ? pseudo.toString().trim() : pseudo.value;
	const subject = form
		? `'${name}' can only be re-based onto real elements as \`${form}\``
		: `'${name}' can only be re-based onto real elements with an \`of S\` clause`;

	return `${subject}, and that form is currently withdrawn. ${EXTRACT_DEFECT} Applying the guard here would therefore delete this rule's styling rather than protect it — the one outcome worse than leaving the selector unguarded — so it is reported without a fix. Close the site another way: give the elements you actually mean a class or a \`data-\` attribute and select them directly. \`S = :not(:where([popover], dialog, style, script, template, link, noscript))\`.`;
}

/**
 * Why a selector that *already* carries an `of` clause is refused rather than merged into the
 * canonical list, or reported as already safe.
 */
function ofClausePresentReason(pseudo: Pseudo): string {
	return `'${pseudo.value}' already carries an \`of\` argument, and any \`of\` argument is currently unsafe to ship. ${EXTRACT_DEFECT} This rule is therefore already dead in every extract build, whatever the \`of\` list contains — so the list is neither merged up to the canonical seven terms nor reported as safe. Revert it to a plain selector and close the site another way, or leave it for the owning team; two unrelated \`of\` lists could not have been combined into one specificity-neutral term anyway.`;
}

/* -------------------------------------------------------------------------------------- */
/* Skip detection — skip, never guess                                                       */
/* -------------------------------------------------------------------------------------- */

/**
 * Statically detect a selector whose text is not fully known, or which is not a complete
 * selector at all. Guessing at these is strictly worse than reporting them, because a guard
 * inserted at the wrong end of an interpolation silently changes what the rule matches.
 */
function getSkipReason(selector: string): { cause: SkipCause; reason: string } | null {
	if (selector.trim() === '') {
		return { cause: 'malformed', reason: 'The selector is empty.' };
	}

	if (/:has\([^)]*\$\{/.test(selector)) {
		return {
			cause: 'dynamic',
			reason:
				'The `:has()` argument contains a template-literal interpolation, so the branch structure inside it is not statically known. Skipped rather than guessed at.',
		};
	}
	if (selector.includes('${')) {
		return {
			cause: 'dynamic',
			reason:
				'The selector contains a template-literal interpolation, so its full text is not statically known. Skipped rather than guessed at.',
		};
	}
	if (selector.includes('#{')) {
		return {
			cause: 'dynamic',
			reason:
				'The selector contains a preprocessor interpolation, so its full text is not statically known. Skipped rather than guessed at.',
		};
	}

	if (!isBalanced(selector)) {
		return {
			cause: 'malformed',
			reason:
				'The selector has an unterminated argument — its brackets or parentheses do not balance, so it spans more than the text given and cannot be parsed in isolation.',
		};
	}

	return null;
}

function isBalanced(selector: string): boolean {
	let parens = 0;
	let brackets = 0;
	let quote: string | null = null;

	for (let index = 0; index < selector.length; index++) {
		const character = selector[index];

		if (quote) {
			if (character === '\\') {
				index++;
			} else if (character === quote) {
				quote = null;
			}
			continue;
		}

		switch (character) {
			case '"':
			case "'":
				quote = character;
				break;
			case '(':
				parens++;
				break;
			case ')':
				parens--;
				break;
			case '[':
				brackets++;
				break;
			case ']':
				brackets--;
				break;
			default:
				break;
		}

		if (parens < 0 || brackets < 0) {
			return false;
		}
	}

	return parens === 0 && brackets === 0 && quote === null;
}

/* -------------------------------------------------------------------------------------- */
/* Parsing and compounds                                                                   */
/* -------------------------------------------------------------------------------------- */

function parse(selector: string): Selector[] {
	const root = selectorParser().astSync(selector);
	return root.nodes.filter((branch) => nonEmptyNodes(branch).length > 0);
}

function nonEmptyNodes(container: Selector): Node[] {
	return container.nodes.filter((node) => !(node.type === 'string' && node.value.trim() === ''));
}

type CompoundPosition =
	/**
	 * Leftmost compound of a selector — no combinator before it.
	 */
	| 'first'
	/**
	 * After `>`.
	 */
	| 'child'
	/**
	 * After a descendant combinator.
	 */
	| 'descendant'
	/**
	 * After `+`.
	 */
	| 'adjacent'
	/**
	 * After `~`.
	 */
	| 'general';

type Compound = {
	nodes: Node[];
	combinatorBefore: Combinator | null;
	position: CompoundPosition;
	/**
	 * True for the rightmost compound of the selector — the element the rule styles.
	 */
	isSubject: boolean;
};

function positionOf(combinator: Combinator | null): CompoundPosition {
	if (combinator === null) {
		return 'first';
	}
	switch (combinator.value.trim()) {
		case '':
			return 'descendant';
		case '>':
			return 'child';
		case '+':
			return 'adjacent';
		case '~':
			return 'general';
		default:
			return 'descendant';
	}
}

function splitCompounds(branch: Selector): Compound[] {
	const raw: { nodes: Node[]; combinatorBefore: Combinator | null }[] = [];
	let current: { nodes: Node[]; combinatorBefore: Combinator | null } = {
		nodes: [],
		combinatorBefore: null,
	};

	for (const node of branch.nodes) {
		if (node.type === 'combinator') {
			raw.push(current);
			current = { nodes: [], combinatorBefore: node };
		} else {
			current.nodes.push(node);
		}
	}
	raw.push(current);

	const kept = raw.filter((compound) => compound.nodes.length > 0);

	return kept.map((compound, index) => ({
		nodes: compound.nodes,
		combinatorBefore: compound.combinatorBefore,
		position: positionOf(compound.combinatorBefore),
		isSubject: index === kept.length - 1,
	}));
}

/* -------------------------------------------------------------------------------------- */
/* Trap 2 — the host-satisfiability predicate                                               */
/* -------------------------------------------------------------------------------------- */

/**
 * **This is the single predicate behind trap 2.** `& > div > div` needs two guards because
 * both compounds satisfy it; `& > div > span` needs exactly one because `span` does not. The
 * rule "guard every compound this returns true for, not just the rightmost" lives here and
 * nowhere else, so it can be swapped wholesale if the Chromium verification of trap 2 comes
 * back negative.
 *
 * Could a top layer host *be* the element this compound matches?
 *
 * A host is a `<div popover>` or a `<dialog>` rendered by Design System. So:
 * - an explicit tag other than `div` / `dialog` proves it cannot — no host is a `<span>`;
 * - a class or an id proves it cannot, because those are the consumer's own hooks and are not
 *   on the host. A consumer who deliberately puts their own class on a surface — via
 *   `className` / `xcss` — has targeted it on purpose, which the decision doc treats as the
 *   consumer's call rather than something to guard;
 * - the nesting selector `&` proves it cannot, because `&` is the author's own element — and so
 *   does an `:is()` / `:where()` that resolves the same way, see {@link nestedMatchVerdict};
 * - everything else — `*`, attribute-only, pseudo-only — could, so it is guarded.
 */
function couldHostMatch(nodes: Node[]): boolean {
	for (const node of nodes) {
		switch (node.type) {
			case 'nesting':
			case 'class':
			case 'id':
				return false;
			default:
				break;
		}
	}

	if (nestedMatchVerdictOf(nodes) === 'none') {
		return false;
	}

	const tag = tagOf(nodes);
	return tag === null || HOST_TAGS.has(tag);
}

/**
 * Pseudo-classes that match an element when any one of their arguments does, so the element is
 * whatever the arguments' subjects are. `:not()` is deliberately absent: `:not(&)` matches every
 * element *except* the author's own, which is the opposite of ownership, so a `:not()` carrying
 * `&` is read like any other pseudo-only compound and guarded.
 */
const MATCHES_ANY_PSEUDOS: ReadonlySet<string> = new Set([
	':is',
	':where',
	':matches',
	':-webkit-any',
	':-moz-any',
]);

/**
 * What a compound's `:is(…&…)` / `:where(…&…)` argument says about the element it matches.
 *
 * `:is(&) > div` is `& > div` spelled differently, and `:is(& > span)` is `& > span`. Without
 * this the `&` sits one level down, where {@link couldHostMatch} cannot see it, and the compound
 * is guarded as if it were a bare pseudo: the author's own element picks up a wide guard and the
 * rule stops applying inside every surface.
 *
 * - `none` — no argument's subject can be a host or sit inside somebody else's surface: every
 *   argument is a lone `&`, class or id compound, or `& > X` where no host can be `X`;
 * - `narrow` — some argument is `& > X` where a host can be `X`, as `& > div` is;
 * - `wide` — some argument is `& X`, whose `X` is always guarded, as in descendant position;
 * - `null` — no such argument, or one shaped otherwise, which keeps the ordinary reading.
 */
type NestedMatchVerdict = 'none' | 'narrow' | 'wide' | null;

function nestedMatchVerdictOf(nodes: Node[]): NestedMatchVerdict {
	let verdict: NestedMatchVerdict = null;
	for (const node of nodes) {
		const next = nestedMatchVerdict(node);
		if (next !== null && (verdict === null || rankOf(next) > rankOf(verdict))) {
			verdict = next;
		}
	}
	return verdict;
}

function nestedMatchVerdict(node: Node): NestedMatchVerdict {
	if (node.type !== 'pseudo' || !MATCHES_ANY_PSEUDOS.has(pseudoName(node))) {
		return null;
	}

	let hasNesting = false;
	node.walk((inner) => {
		if (inner.type === 'nesting') {
			hasNesting = true;
		}
	});
	if (!hasNesting) {
		return null;
	}

	let verdict: NestedMatchVerdict = 'none';
	for (const argument of node.nodes) {
		const next = argumentVerdict(argument);
		if (next === null) {
			return null;
		}
		if (rankOf(next) > rankOf(verdict)) {
			verdict = next;
		}
	}
	return verdict;
}

function argumentVerdict(argument: Selector): NestedMatchVerdict {
	const compounds = splitCompounds(argument);

	if (compounds.length === 1) {
		return couldMatchForeignElement(compounds[0].nodes) ? null : 'none';
	}

	const [owner, subject] = compounds;
	const ownerIsNesting = owner.nodes.some((node) => node.type === 'nesting');
	if (compounds.length !== 2 || !ownerIsNesting) {
		return null;
	}

	switch (subject.position) {
		case 'child':
			return couldHostMatch(subject.nodes) ? 'narrow' : 'none';
		case 'descendant':
			return 'wide';
		default:
			return null;
	}
}

function rankOf(verdict: 'none' | 'narrow' | 'wide'): number {
	return verdict === 'none' ? 0 : verdict === 'narrow' ? 1 : 2;
}

/**
 * There used to be a `couldHostShareType` predicate here, gating the of-type refusal on whether a
 * host could carry the compound's tag — so `& > span:nth-of-type(2)` was treated as safe.
 *
 * It is gone deliberately. The of-type family has no guard form at all, and the gate meant that in
 * descendant position, where guards are unconditional, of-type selectors were being guarded anyway:
 * 18 measured pairs across 8 selectors. The family is now refused outright by
 * {@link planWholeBranchRefusals}, whatever its tag.
 */

/**
 * Could this compound match an element that is not the author's own — that is, Design System
 * internals, or content belonging to somebody else?
 *
 * This is the **ownership question**, and it is the real discriminator between the two guard
 * forms. A class or an id answers "no": those only ever match elements the author wrote, so if
 * such an element is inside a surface it is inside *the author's own* surface content.
 * `[popover] *` and `dialog *` would then remove a style the author put there on purpose.
 *
 * `*`, a bare tag, and an attribute-only compound answer "yes": each can match a DS-internal
 * element rendered inside somebody else's surface.
 */
function couldMatchForeignElement(nodes: Node[]): boolean {
	for (const node of nodes) {
		switch (node.type) {
			case 'nesting':
			case 'class':
			case 'id':
				return false;
			default:
				break;
		}
	}
	const nested = nestedMatchVerdictOf(nodes);
	return nested === null || nested === 'wide';
}

/**
 * Narrow or wide, for one compound. **The single place this choice is made.**
 *
 * The subtree terms `[popover] <universal>` and `dialog <universal>` do not mean "not the host's
 * subtree". They mean **"not inside ANY surface"** — so a wide guard disables its own rule for
 * any subject that legitimately lives inside a popover, dialog or drawer. Consumer content
 * inside a surface is the common case, not an edge case, which is why wide is NOT the safe
 * default.
 *
 * The governing rule, from the decision doc:
 *
 * > Wide when the matched element could be inside someone *else's* surface. Narrow when it
 * > could be inside the subject's *own* surface. Where both are possible, the site is residue.
 *
 * Operationally that turns on whether a surface can sit **strictly between** the previous
 * compound and this one:
 *
 * - **descendant** — the gap is unbounded, so a surface can sit inside the previous compound
 *   and above this one. That surface is somebody else's, and its internals match here. Wide.
 * - **child, adjacent, general** — there is no gap. The only exposure is "this element *is*
 *   the host", which narrow already closes. Wide would buy nothing and would additionally
 *   break the case where the whole selector is rendered inside a surface — then the previous
 *   compound's own real child *is* `[popover] *`. Narrow, always. This is what
 *   `.x:has(> div)` measured.
 * - **first** — there is no previous compound, so the gap question does not arise and the
 *   ownership question is asked directly, via {@link couldMatchForeignElement}. At global
 *   scope a first compound is never given a *fresh* guard, because with nothing above it the
 *   rule reached the portalled surface before the flag (see {@link isDocumentLevelCompound});
 *   the form still decides which list a pre-existing partial guard is merged up to.
 */
function guardFormFor(compound: Compound): 'narrow' | 'wide' {
	switch (compound.position) {
		case 'descendant':
			return 'wide';
		case 'first':
			return couldMatchForeignElement(compound.nodes) ? 'wide' : 'narrow';
		default:
			return 'narrow';
	}
}

/**
 * Is this branch a bare universal selector at global scope — `*`, `*::before`, `*::after`?
 *
 * "Bare" means the compound is nothing but the universal selector, optionally with a
 * pseudo-element. "Global scope" means there is no ancestor constraint at all, so the rule reaches
 * every element in the document including a top layer host.
 *
 * Deliberately narrow, so it cannot over-fire:
 * - `& > *`, `.foo > *`, `& *`, `& > *:first-child` all have an ancestor constraint and are
 *   rewritten normally;
 * - `*:first-child` is not bare — the pseudo-class makes it a positional rule, not a reset — and is
 *   rewritten normally;
 * - `> *` is the nested spelling of `& > *`, so it is scoped too.
 *
 * ## Why this is not wider — the question every reader asks
 *
 * A *scoped* reset looks like it shares the mechanism: guarding `& > div { box-sizing: inherit }`
 * also excludes the host from a reset. It does not, and the reason is **reach**, not the property:
 *
 * - global `* { box-sizing: inherit }` matched the host **before** the flag too, because `*`
 *   reaches surface content sitting in a portal at `body` level. Guarding it *removes* something
 *   the host already had — a behaviour change, and the layout bug;
 * - scoped `& > * { box-sizing: inherit }` did **not** match the host pre-flag, because the host
 *   was portalled away and was not a child of `&`. Post-flag it does. That is exactly the
 *   `popover-receives` damage, and guarding *restores* the pre-flag rendering.
 *
 * Same declaration, opposite dispositions. This is also why no browser measurement can settle it:
 * a browser can say what `box-sizing` does, but not what the DOM looked like before the flag.
 */
function isBareGlobalUniversal(branch: Selector): boolean {
	const compounds = splitCompounds(branch);
	if (compounds.length !== 1) {
		return false;
	}

	const [compound] = compounds;
	if (compound.position !== 'first') {
		return false;
	}

	let sawUniversal = false;
	for (const node of compound.nodes) {
		if (node.type === 'universal') {
			sawUniversal = true;
			continue;
		}
		if (isPseudoElement(node)) {
			continue;
		}
		return false;
	}

	return sawUniversal;
}

/**
 * Declarations that mark a rule as a **reset** rather than an override, meaning a guard would take
 * the declaration away from the host and break it.
 *
 * Deliberately minimal — only signals that are unambiguous on their face:
 * - `box-sizing`, the canonical global reset and the measured case;
 * - any of the cascade keywords, whose whole purpose is to normalise inherited values.
 *
 * The asymmetry here is the point, and it is why this is safe to act on automatically. Wrongly
 * calling an override a reset leaves a `popover-receives` exposure on a bare `*` rule, which is
 * cheap. Wrongly calling a reset an override *introduces* a layout bug, which is not. So this
 * function only ever moves a row **out** of the guarded set, and a row it does not recognise stays
 * `residue` for a human rather than being guarded on a guess.
 */
function findResetSignal(declarations: Declarations | undefined): string | null {
	if (!declarations) {
		return null;
	}

	const pairs: [string, string][] =
		typeof declarations === 'string'
			? parseDeclarationText(declarations)
			: Object.entries(declarations).map(([property, value]) => [property, String(value ?? '')]);

	for (const [rawProperty, rawValue] of pairs) {
		const property = kebabCase(rawProperty).toLowerCase();
		const value = rawValue.trim().toLowerCase();

		if (property === 'box-sizing') {
			return `${property}: ${value}`;
		}
		if (CASCADE_KEYWORDS.has(value)) {
			return `${property}: ${value}`;
		}
	}

	return null;
}

const CASCADE_KEYWORDS: ReadonlySet<string> = new Set([
	'inherit',
	'initial',
	'unset',
	'revert',
	'revert-layer',
]);

function parseDeclarationText(text: string): [string, string][] {
	const pairs: [string, string][] = [];

	for (const part of text.split(';')) {
		const colon = part.indexOf(':');
		if (colon === -1) {
			continue;
		}
		const property = part.slice(0, colon).trim();
		const value = part.slice(colon + 1).trim();
		if (property !== '') {
			pairs.push([property, value]);
		}
	}

	return pairs;
}

function kebabCase(property: string): string {
	return property.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}

/**
 * Does this compound name a top layer host or a non-rendered tag outright, such as `dialog`?
 *
 * Then the author is targeting that element deliberately. For a host, **both** guard forms
 * would make the rule match nothing at all, because the guard's own term list excludes exactly
 * what the compound selects. A non-rendered tag is `display: none`, so a guard would protect
 * nothing. Either way the compound is left alone.
 */
function compoundNamesHost(nodes: Node[]): boolean {
	return nodes.some(isGuardTermNode);
}

function tagOf(nodes: Node[]): string | null {
	for (const node of nodes) {
		if (node.type === 'tag') {
			return node.value.toLowerCase();
		}
	}
	return null;
}

function isPseudoElement(node: Node): boolean {
	if (node.type !== 'pseudo') {
		return false;
	}
	return node.value.startsWith('::') || LEGACY_PSEUDO_ELEMENTS.has(pseudoName(node));
}

/**
 * Guards must be inserted before any pseudo-element — `div:not(…)::before`, never after.
 */
function guardInsertIndex(nodes: Node[]): number {
	const index = nodes.findIndex(isPseudoElement);
	return index === -1 ? nodes.length : index;
}

/* -------------------------------------------------------------------------------------- */
/* Plan                                                                                    */
/* -------------------------------------------------------------------------------------- */

type Plan = {
	/**
	 * Replace this node's emitted text entirely.
	 */
	replace: Map<Node, string>;
	/**
	 * Insert this text immediately after the node.
	 */
	appendAfter: Map<Node, string>;
	/**
	 * Insert this text immediately before the node.
	 */
	prependBefore: Map<Node, string>;
	/**
	 * Union of the keys above — used to decide whether a subtree must be re-emitted.
	 */
	touched: Set<Node>;
	guardCount: number;
	receives: boolean;
	/**
	 * Refusals that stand regardless of what else is guardable.
	 */
	hardRefusals: string[];
	/**
	 * Refusals that only matter when a guard would otherwise be written alongside them.
	 */
	softRefusals: string[];
	/**
	 * Exposures a guard cannot close, reported on an otherwise successful rewrite.
	 */
	residualNotes: string[];
	/**
	 * Guards withheld because the compound already reached the portalled surface before the
	 * flag, so the guard would remove rather than restore. See {@link isDocumentLevelCompound}.
	 */
	reachSuppressions: string[];
	/**
	 * Guards withheld because the reach question could not be settled from the selector: the
	 * compound sits below a bare `div` ancestor at global scope. A human decides. See
	 * {@link isBareDivCompound}.
	 */
	reviews: string[];
	sawGeneralSibling: boolean;
};

function createPlan(): Plan {
	return {
		replace: new Map(),
		appendAfter: new Map(),
		prependBefore: new Map(),
		touched: new Set(),
		guardCount: 0,
		receives: false,
		hardRefusals: [],
		softRefusals: [],
		residualNotes: [],
		reachSuppressions: [],
		reviews: [],
		sawGeneralSibling: false,
	};
}

function setReplace(plan: Plan, node: Node, text: string): void {
	plan.replace.set(node, text);
	plan.touched.add(node);
}

function setAppendAfter(plan: Plan, node: Node, text: string): void {
	plan.appendAfter.set(node, (plan.appendAfter.get(node) ?? '') + text);
	plan.touched.add(node);
}

function setPrependBefore(plan: Plan, node: Node, text: string): void {
	plan.prependBefore.set(node, text + (plan.prependBefore.get(node) ?? ''));
	plan.touched.add(node);
}

/* -------------------------------------------------------------------------------------- */
/* Planning                                                                                */
/* -------------------------------------------------------------------------------------- */

function planBranch(branch: Selector, plan: Plan, scope: SelectorScope): void {
	/**
	 * Refusals that hold **wherever** the pseudo appears, at any nesting depth, before anything
	 * is planned. These families have no guard form at all, so no part of a selector containing
	 * one may be rewritten — a guard elsewhere in it would be a partial fix on a rule that stays
	 * broken, and in a selector list it would leave the list partially guarded.
	 */
	planWholeBranchRefusals(branch, plan);

	/**
	 * `:has()` next, wherever it appears. It may be nested inside `:not()` / `:is()` /
	 * `:where()`, and in that case the guard is pushed *inside* the `:has()` argument rather
	 * than onto the wrapping `:not()` — trap 5.
	 */
	planHasArguments(branch, plan);

	const compounds = splitCompounds(branch);

	/**
	 * A branch that opens with a combinator (`> *`, `> :not([data-layout-slot])`) is the nested
	 * spelling of `& > …` whatever scope the caller named: the parent it hangs off is implied,
	 * and that parent is the consumer's own element, so nothing in the branch is document-level.
	 */
	const opensWithCombinator = compounds[0]?.combinatorBefore !== null;

	compounds.forEach((compound, index) => {
		const ancestors = compounds.slice(0, index);
		const isGlobalRule = scope === 'global' && !opensWithCombinator;

		/**
		 * At global scope, a compound with nothing but the document itself above it reached the
		 * portalled surface before the flag. Under `nested` scope every branch carries `&`, which
		 * is never document-level, so the question does not arise.
		 */
		const reachedPreFlag = isGlobalRule && ancestors.every(isDocumentLevelCompound);

		/**
		 * A bare `div` among otherwise document-level ancestors is the one case the transform
		 * cannot settle. Any other consumer-owned ancestor (`.sidebar`, `div.x`, `[data-foo]`)
		 * decides the question the usual way, so the review outcome needs every ancestor to be
		 * document-level or a bare `div`.
		 */
		const behindBareDivAncestor =
			isGlobalRule &&
			!reachedPreFlag &&
			ancestors.every(
				(ancestor) => isDocumentLevelCompound(ancestor) || isBareDivCompound(ancestor),
			);

		planCompound(compound, plan, { reachedPreFlag, behindBareDivAncestor });
	});
}

/**
 * Is this compound exactly the tag `div`, with no class, id, attribute or pseudo qualifier?
 *
 * Pre-flag, a surface portalled to `body` sat inside `@atlaskit/portal`'s container div, and
 * every surface wrapper is a div too, so a bare `div` ancestor was satisfied on the way down to
 * the surface's content. A qualified div (`div.x`, `div[data-foo]`) names the consumer's own
 * element and is not ambiguous.
 */
function isBareDivCompound(compound: Compound): boolean {
	const { nodes } = compound;
	return nodes.length === 1 && nodes[0].type === 'tag' && nodes[0].value.toLowerCase() === 'div';
}

function bareDivAncestorReason(nodes: Node[]): string {
	const compound = nodes.map((node) => node.toString().trim()).join('');
	return `'${compound}' is at global scope below a bare div ancestor. The portal container and every surface wrapper were divs, so this rule may already have reached the surface's content when it was portalled to body, and a guard here could remove styling the surface had before the flag rather than restore any. Nothing is written; review by hand. Guard it if the div stands for your own wrapper, leave it if it stands for any div, and anchor the selector to your own element (a class, an id, or \`&\` in a style object) if you mean only your own content.`;
}

/**
 * Is this compound satisfied by the document itself, rather than by anything the consumer
 * rendered — `html`, `body`, `:root`, each with any qualifiers, or a lone `*`?
 *
 * These are the ancestors every element has, including a surface portalled to `body`. A chain
 * of them above a compound constrains nothing, so the rule reached the portalled surface's
 * content before the flag and a guard would take away what that content already had. A
 * consumer-owned ancestor (`.sidebar`, `#app`, `&`) or any other tag did **not** contain the
 * portal, so below one of those the host is a new match and the guard restores.
 */
function isDocumentLevelCompound(compound: Compound): boolean {
	const { nodes } = compound;
	if (isDocumentRootCompound(nodes)) {
		return true;
	}
	return nodes.length === 1 && nodes[0].type === 'universal';
}

/**
 * `html`, `body` or `:root`, with any qualifiers — an element of the document itself, which is
 * never a host and never inside one.
 */
function isDocumentRootCompound(nodes: Node[]): boolean {
	const tag = tagOf(nodes);
	if (tag === 'html' || tag === 'body') {
		return true;
	}
	return nodes.some((node) => node.type === 'pseudo' && pseudoName(node) === ':root');
}

function reachedPreFlagReason(nodes: Node[]): string {
	const compound = nodes.map((node) => node.toString().trim()).join('');
	return `'${compound}' is at global scope with nothing but the document itself above it (html, body, :root or *), so this rule already reached the surface's content when it was portalled to body. Guarding it would remove styling the surface had before the flag rather than restore any, so it is left alone. Anchor the selector to your own element (a class, an id, or \`&\` in a style object) if you mean only your own content.`;
}

/**
 * The two families with no guard form at any depth.
 *
 * Both are matched against the **full** pseudo-class name via a set, never by substring. Four of
 * the five of-type pseudos do not contain the text `nth-of-type`, and `:first-of-type` alone is 926
 * occurrences in the monorepo, so a substring test would silently miss almost the whole family.
 */
function planWholeBranchRefusals(branch: Selector, plan: Plan): void {
	branch.walkPseudos((pseudo) => {
		if (OF_TYPE_PSEUDOS.has(pseudoName(pseudo))) {
			/**
			 * The of-type family is type-scoped by definition: it counts siblings by tag name and
			 * accepts no `of S` selector argument, so its counting cannot be re-based onto real
			 * elements. A guard anywhere in such a selector cannot fix the counting and changes
			 * behaviour inside surfaces for nothing.
			 */
			plan.hardRefusals.push(
				`'${pseudo.value}' has no guard form: the of-type family counts siblings by tag name and accepts no \`of S\` selector argument, so its counting cannot be re-based onto real elements. Nothing in this selector is rewritten, because a guard elsewhere in it could not fix the counting.`,
			);
			return;
		}

		if (pseudoName(pseudo) === ':empty') {
			/**
			 * `:empty` is true of an element with no children *of any kind* and takes no selector
			 * argument, so a host rendered inside the element cannot be excluded from it. A compound
			 * carrying both `:empty` and a positional pseudo must refuse rather than take the
			 * positional rewrite — `& > div:has(> div:only-child:empty)` is the measured case.
			 */
			plan.hardRefusals.push(
				"':empty' has no guard form: it is true of an element with no children of any kind and takes no selector argument, so a host rendered inside the element cannot be excluded from it. Nothing in this selector is rewritten, including any positional pseudo compounded with it.",
			);
		}
	});
}

function planCompound(
	compound: Compound,
	plan: Plan,
	options: { reachedPreFlag: boolean; behindBareDivAncestor: boolean },
): void {
	const { nodes, position, isSubject } = compound;

	if (position === 'general') {
		plan.sawGeneralSibling = true;
	}

	/* --- Refusals local to this compound ------------------------------------------------ */

	for (const node of nodes) {
		if (node.type !== 'pseudo') {
			continue;
		}

		if (isSubject && ANCESTOR_PROPAGATING_PSEUDOS.has(pseudoName(node))) {
			plan.softRefusals.push(
				`'${node.value}' on the subject compound has no guard form: it matches an element *and its ancestors*, so a surface rendered inside this element hands it the state while the pointer or focus is in the surface. No guard expresses "not originating inside a top layer surface", at any depth.`,
			);
		}
	}

	const merges = planPreExistingGuards(compound, plan);

	/* --- Sibling combinators ------------------------------------------------------------ */

	/**
	 * The two damage modes split cleanly on a sibling combinator:
	 *
	 * - if a host could match the right-hand compound, the damage is that the host receives
	 *   the declaration — `popover-receives` — and the guard goes on that compound. This is
	 *   what shipped code does for `* + *` and `div + div`;
	 * - if it could not, the only remaining damage is a host inserted *between* A and B,
	 *   which breaks `A + B` and which no guard restores. That is `real-element-loses` and it
	 *   is refused.
	 *
	 * `~` has no `real-element-loses` mode at all: it matches every following sibling, so an
	 * inserted host removes no real match.
	 */
	if (position === 'adjacent' && !couldHostMatch(nodes)) {
		plan.hardRefusals.push(
			'The adjacent sibling combinator has no guard form here: no host can match the right-hand compound, so the only exposure left is a host inserted *between* the two siblings, which breaks the adjacency and which no guard restores.',
		);
		return;
	}

	if (position === 'adjacent' && couldHostMatch(nodes)) {
		plan.residualNotes.push(
			'The guard closes `popover-receives` on this adjacent sibling combinator, but a host inserted *between* the two siblings still breaks the adjacency for real elements. No guard form restores that; review the site.',
		);
	}

	/* --- Positional pseudo-classes ------------------------------------------------------ */

	/**
	 * A positional pseudo refuses the whole selector while the `of S` family is withdrawn, so
	 * there is nothing left to plan for this compound.
	 */
	if (planPositionals(compound, plan)) {
		return;
	}

	/* --- Compound guard ---------------------------------------------------------------- */

	/* A merged or pre-existing guard already satisfies this compound — never add a second. */
	const formName = guardFormFor(compound);
	const alreadyGuarded = merges > 0 || isCompoundGuarded(nodes, formName);
	const form = formName === 'wide' ? WIDE_GUARD : NARROW_GUARD;

	let guard: string | null = null;

	if (alreadyGuarded) {
		guard = null;
	} else if (
		nodes.some((node) => node.type === 'nesting') ||
		nestedMatchVerdictOf(nodes) === 'none'
	) {
		/**
		 * **Never guard the `&` compound, in any position.** `&` is the enclosing rule's own
		 * subject, and the host is created *inside* `&`, never *as* `&`. So `&` can never be the
		 * host, and a guard on it can only ever subtract legitimate matches.
		 *
		 * Measured: `html:not([data-color-mode=dark]) &` rewritten with a guard on `&` matches
		 * outside a surface and matches **nothing** inside a popover or a dialog — so a theme rule
		 * stops applying to every component rendered inside any surface.
		 *
		 * This is the mirror image of the host-naming case below. There a compound *names* a host
		 * and the guard destroys it; here a compound provably *cannot be* a host and the guard
		 * destroys it. Both are guarding something that is not the enemy, and both look like
		 * diligence.
		 *
		 * `:is(&)` and `:is(& > span)` resolve to the same verdict, see {@link nestedMatchVerdict}.
		 */
		guard = null;
	} else if (isDocumentRootCompound(nodes)) {
		/**
		 * `html`, `body` and `:root` are the document's own elements. No surface can contain them
		 * and no host can be one, so a guard on them excludes nothing and is only noise.
		 */
		guard = null;
	} else if (compoundNamesHost(nodes)) {
		/**
		 * `& dialog`, `& > [popover]`, `& style`: the author is targeting a surface or a
		 * non-rendered element on purpose. For a host, every guard form excludes exactly what the
		 * compound selects, so guarding would leave a rule that matches nothing. For a
		 * non-rendered tag, a guard would protect nothing.
		 */
		plan.softRefusals.push(
			`'${nodes
				.map((node) => node.toString().trim())
				.join(
					'',
				)}' names a top layer host or a non-rendered tag directly, so it targets that element deliberately. A guard would either exclude exactly what it selects or protect nothing, so it is left alone.`,
		);
	} else if (options.reachedPreFlag) {
		/**
		 * The reach principle from the module docblock, applied. `div`, `body div` and `* + *` at
		 * global scope all matched the surface's content in its portal before the flag, so the
		 * guard that would otherwise be written here would remove something the surface had.
		 * Recorded only where a guard would have been written, so the reason is never attached
		 * to a compound that needed nothing.
		 */
		if (position === 'descendant' || couldHostMatch(nodes)) {
			plan.reachSuppressions.push(reachedPreFlagReason(nodes));
		}
	} else if (options.behindBareDivAncestor) {
		/**
		 * The ambiguous ancestor from the module docblock. Recorded only where a guard would have
		 * been written, exactly as the reach suppression above, so a compound that needed nothing
		 * never asks for a review.
		 */
		if (position === 'descendant' || couldHostMatch(nodes)) {
			plan.reviews.push(bareDivAncestorReason(nodes));
		}
	} else if (position === 'descendant') {
		/**
		 * Always guarded: a surface can sit anywhere in the unbounded gap above this compound, and
		 * its internals match here. That is somebody else's surface, so the wide form applies.
		 */
		guard = form;
	} else if (couldHostMatch(nodes)) {
		/**
		 * Everywhere else, guard when a host could *be* this element.
		 */
		guard = form;
	}

	if (guard) {
		const at = guardInsertIndex(nodes);
		if (at === 0) {
			setPrependBefore(plan, nodes[0], guard);
		} else {
			setAppendAfter(plan, nodes[at - 1], guard);
		}
		plan.receives = true;
		plan.guardCount += 1;
	}
}

/**
 * Handle a guard that is already present.
 *
 * Earlier hand fixes carry partial or longer guards, such as `:not(:where(dialog))` or one that
 * also lists `style` and the rest. Missing terms are **merged into** that list, never replaced,
 * and never joined by a second guard. Extra terms are kept.
 * Merging keeps idempotency across the boundary: once the list is canonical, running again
 * changes nothing.
 *
 * A host-term `:not()` with no `:where()` around it is refused instead of merged, because it
 * carries real weight and unifying it would change the rule's specificity — this covers the
 * editor's `:not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)`, which is the same
 * shape and additionally lists genuinely rendered elements.
 *
 * A partial guard inside an `of` argument is not handled here. Any selector carrying an `of`
 * argument is refused by `rewriteSelector` before planning starts, because Compiled's extract
 * mode drops such a rule outright (see {@link WITHDRAWN_POSITIONAL_FORMS}).
 *
 * The merged list is written in canonical order: the required terms as `L` lists them, then
 * any extra terms the author added. {@link isCompoundGuarded} recognises the result as complete
 * on the next pass. A list that already has every required term is left as written, in any
 * order and with or without a `*`: the two spellings match the same elements, and the ratchet
 * counts only positional pseudo-classes, so rewriting them would be churn.
 */
function planPreExistingGuards(compound: Compound, plan: Plan): number {
	const wide = guardFormFor(compound) === 'wide';
	let merges = 0;

	for (const node of compound.nodes) {
		if (node.type !== 'pseudo') {
			continue;
		}

		if (pseudoName(node) !== ':not') {
			continue;
		}

		/**
		 * Classify from the `:not()`'s *direct* content only. Looking deeper would misread any
		 * `:not()` that merely contains a guard somewhere inside it — including
		 * `:not(:has(button:not(:where(L))))` and the `:not(:where(:nth-last-child(n+2 of S)))`
		 * tail of the `:only-child` form, both of which this transform emits itself.
		 */
		const direct = node.nodes;

		/**
		 * Trap 1. `S` is itself a `:not()`, so `X:not(S)` is a double negative that matches
		 * only* hosts. Appending a guard to it would make it match nothing at all.
		 */
		const soleNot = soleNotInside(node);
		if (soleNot && mentionsGuardTerm(soleNot)) {
			plan.hardRefusals.push(
				`'${node
					.toString()
					.trim()}' is a double negative: the guard \`S\` is itself a \`:not()\`, so this matches *only* top layer hosts and nothing else. Appending another guard would make it match nothing. The intended form appends \`:not(:where(L))\` directly.`,
			);
			continue;
		}

		const where = soleWhereInside(node);

		if (!where) {
			/**
			 * Not wrapped in `:where()`. Only a refusal if it is actually an element exclusion
			 * list that mentions a guard term — otherwise it is an ordinary `:not()`.
			 */
			if (direct.every(isSimpleTerm) && direct.some(termIsGuardTerm)) {
				plan.hardRefusals.push(
					`'${node
						.toString()
						.trim()}' is an existing top layer guard with no \`:where()\` around it, so it carries real specificity. Unifying it would change the rule's weight, and in the editor's case would also drop genuinely rendered elements from the exclusion list. This needs a hand edit and routing to the owning team.`,
				);
			}
			continue;
		}

		const terms = where.nodes;

		/**
		 * Every term must be a simple selector, and at least one must be a guard term.
		 * A `:where()` holding a functional pseudo is not an element exclusion list, and a
		 * `:where()` of unrelated selectors is not a top layer guard to merge into.
		 */
		if (!terms.every(isSimpleTerm) || !terms.some(termIsGuardTerm)) {
			continue;
		}

		const existing = terms.map((term) => term.toString().trim()).filter(Boolean);
		const existingKeys = new Set(existing.map(normalise));
		const required = wide ? WIDE_TERMS : NARROW_TERMS;
		const requiredKeys = wide ? WIDE_TERM_KEYS : NARROW_TERM_KEYS;
		const missing = required.filter((term) => !existingKeys.has(normalise(term)));

		if (missing.length === 0) {
			continue;
		}

		/**
		 * Canonical order: the required terms as `L` lists them, then any term the author added
		 * that is not part of the list. A canonical term the author already had (in any order,
		 * or as a wide term on a narrow position) is kept but re-ordered.
		 */
		const extras = existing.filter((term) => !requiredKeys.has(normalise(term)));
		const merged = [...required, ...extras];

		setReplace(plan, node, `:not(:where(${merged.join(', ')}))`);

		/**
		 * When a merge rewrites the guard, **add an explicit `*`** if the guard is all the
		 * compound has. `& > *:not(:where(…))` and `& > :not(:where(…))` are semantically
		 * identical. `*` is the form the guard-form table and the `child-universal` pair use.
		 */
		if (compound.nodes.length === 1) {
			setPrependBefore(plan, node, '*');
		}

		merges += 1;
		plan.guardCount += 1;
		plan.receives = true;
	}

	return merges;
}

/**
 * A term of a guard's `:where()` list: simple selectors only, no functional pseudos.
 */
function isSimpleTerm(term: Selector): boolean {
	return !term.nodes.some((node) => node.type === 'pseudo');
}

/**
 * Guard every top-level comma branch of every `:has()`, at any depth.
 *
 * `:has()` matches if *any* branch matches, so a guard on one branch leaves the others open.
 * The parser has already split on top-level commas, so nested commas inside `:where()` /
 * `:is()` / `:not()` cannot be split by accident.
 *
 * Within a branch, every compound is planned by {@link planCompound}, exactly as a top-level
 * compound is. The branch's leftmost compound is a descendant of the subject, so it takes the
 * wide list whatever its tag: `.x:has(button, a)` gets two guards even though no host is a
 * `<button>`, because the button can be inside a surface that is inside `.x`. A compound after
 * `>` takes the narrow list only if a host could be that element: `:has(> div > span)` guards
 * the `div` and leaves the `span` alone.
 */
function planHasArguments(branch: Selector, plan: Plan): void {
	branch.walkPseudos((pseudo) => {
		if (pseudoName(pseudo) !== ':has') {
			return;
		}

		/**
		 * Chromium rejects the entire selector when a `:has()` appears inside a `:has()`
		 * argument, so the rule has already stopped applying. Never emit one, and never
		 * pretend to fix one.
		 */
		if (hasAncestorPseudo(pseudo, ':has')) {
			plan.hardRefusals.push(
				'A `:has()` nested inside another `:has()` argument is rejected outright by Chromium, so the whole rule already does not apply. This cannot be guarded — it has to be restructured by hand.',
			);
			return;
		}

		let selfReferential = false;
		pseudo.walk((inner) => {
			if (inner.type === 'nesting') {
				selfReferential = true;
			}
		});
		if (selfReferential) {
			plan.hardRefusals.push(
				'A self-referential `:has()` — `:has(&)` or `:has(> &)` — has no guard form: the argument resolves to the subject itself, so there is no descendant compound to place a guard on.',
			);
			return;
		}

		/**
		 * `:has(+ X)` and `:has(X + Y)` are adjacency inside the argument, with no selector
		 * argument to re-base it onto real elements. `:has(~ X)` reaches the subject's siblings
		 * rather than its descendants, so neither the wide form nor the narrow one is the right
		 * guard there. Both are refused.
		 */
		let sibling: string | null = null;
		pseudo.each((argument) => {
			for (const inner of argument.nodes) {
				if (inner.type !== 'combinator') {
					continue;
				}
				const value = inner.value.trim();
				if (!sibling && (value === '+' || value === '~')) {
					sibling = value;
				}
			}
		});
		if (sibling) {
			plan.hardRefusals.push(
				`\`:has()\` with a sibling combinator ('${sibling}') has no guard form: adjacency inside the argument takes no selector argument to re-base onto real elements, and the argument reaches the subject's siblings rather than its descendants, so neither guard form applies.`,
			);
			return;
		}

		let propagating: string | null = null;
		pseudo.walkPseudos((inner) => {
			if (!propagating && ANCESTOR_PROPAGATING_PSEUDOS.has(pseudoName(inner))) {
				propagating = inner.value;
			}
		});
		if (propagating) {
			plan.hardRefusals.push(
				`\`:has()\` containing '${propagating}' has no guard form: '${propagating}' matches an element *and its ancestors*, so the subject itself satisfies the argument whenever the pointer or focus is inside the surface. No guard on the argument can help, at any depth.`,
			);
			return;
		}

		for (const argument of pseudo.nodes) {
			const compounds = splitCompounds(argument);
			if (compounds.length === 0) {
				continue;
			}

			/**
			 * A positional pseudo inside the argument refuses the whole selector while the `of S`
			 * family is withdrawn, at any depth, so there is nothing left to plan for this branch.
			 */
			if (compounds.some((compound) => planPositionals(compound, plan))) {
				continue;
			}

			/**
			 * Every compound of the argument is checked, not only the last. `:has(dialog button)`
			 * matches only buttons inside a dialog, so a wide guard on `button` would exclude
			 * every element the argument can match and leave the `:has()` unsatisfiable.
			 */
			if (compounds.some((compound) => compoundNamesHost(compound.nodes))) {
				plan.softRefusals.push(
					'A `:has()` argument that names a top layer host or a non-rendered tag directly targets that element deliberately. A guard would either exclude exactly what it selects or protect nothing, so it is left alone.',
				);
				continue;
			}

			/**
			 * Every compound of the argument is planned exactly as a top-level compound is, by the
			 * same code. `:has(> div > span)` therefore guards the host-capable `div` and skips
			 * the `span`, as `& > div > span` does; a guard on the `span` alone would be inert,
			 * because no host is a span, and the argument would still match popup content through
			 * the unguarded `div`.
			 *
			 * The argument's leftmost compound carries no combinator of its own, but it is a
			 * descendant of the subject: `:has(button)` is "a button anywhere inside", so it is
			 * planned in descendant position and takes the wide list. A leading combinator is kept
			 * as written, so `:has(> div)` is a child and takes the narrow list.
			 */
			for (const compound of compounds) {
				const position = compound.position === 'first' ? 'descendant' : compound.position;
				planCompound({ ...compound, position }, plan, {
					reachedPreFlag: false,
					behindBareDivAncestor: false,
				});
			}
		}
	});
}

/**
 * Refuse every positional pseudo-class on this compound. Returns true if one was found.
 *
 * Each of these has a verified guard form in the decision doc's table, and every one of those
 * forms needs an `of S` clause, which is **withdrawn**: Compiled's extract mode drops the rule
 * outright, so the guard would delete styling rather than protect it — see
 * {@link WITHDRAWN_POSITIONAL_FORMS}. The refusal reason names the form that was withheld, so
 * it can be restored from the report once Compiled is fixed.
 *
 * A positional pseudo nested inside `:is()`, `:where()` or `:not()` has no form even in the
 * table: sibling counting there is relative to a different subject. Inside `:has()` the
 * argument's compounds are handed back to this function by `planHasArguments`, so that case is
 * refused with the same reason as a top-level compound.
 */
function planPositionals(compound: Compound, plan: Plan): boolean {
	let found = false;

	for (const node of compound.nodes) {
		if (node.type !== 'pseudo') {
			continue;
		}

		const name = pseudoName(node);

		if (POSITIONAL_PSEUDOS.has(name)) {
			plan.hardRefusals.push(ofClauseWithheldReason(node));
			found = true;
			continue;
		}

		if (name === ':not') {
			const sole = solePseudoInside(node);
			const soleName = sole ? pseudoName(sole) : null;
			if (soleName === ':first-child' || soleName === ':last-child') {
				plan.hardRefusals.push(ofClauseWithheldReason(node));
				found = true;
				continue;
			}
			if (sole && soleName !== null && POSITIONAL_PSEUDOS.has(soleName)) {
				plan.hardRefusals.push(
					`\`:not(${sole.value}…)\` has no guard form. Only \`:not(:first-child)\` and \`:not(:last-child)\` can be expressed as a single specificity-neutral term, and even those are withdrawn while Compiled's extract mode drops any selector carrying an \`of\` clause. Close the site by giving the elements you mean a class or a \`data-\` attribute and selecting them directly.`,
				);
				found = true;
				continue;
			}
			/* Any other `:not()` falls through to the nested check below. */
		}

		if (name === ':has') {
			continue;
		}

		node.walkPseudos((inner) => {
			if (!POSITIONAL_PSEUDOS.has(pseudoName(inner)) || hasAncestorPseudo(inner, ':has')) {
				return;
			}
			plan.hardRefusals.push(
				`The positional pseudo '${inner.value}' is nested inside '${node.value}()', where sibling counting is relative to a different subject. The decision doc's \`of S\` forms do not apply, so this needs triage.`,
			);
			found = true;
		});
	}

	return found;
}

/* -------------------------------------------------------------------------------------- */
/* Emission                                                                                */
/* -------------------------------------------------------------------------------------- */

function emitSelector(branch: Selector, plan: Plan): string {
	const parts: string[] = [];

	for (const node of branch.nodes) {
		if (node.type === 'combinator') {
			const value = node.value.trim();
			parts.push(value === '' ? ' ' : ` ${value} `);
			continue;
		}

		const before = plan.prependBefore.get(node);
		if (before) {
			parts.push(before);
		}

		parts.push(emitNode(node, plan));

		const after = plan.appendAfter.get(node);
		if (after) {
			parts.push(after);
		}
	}

	return parts.join('').trim();
}

function emitNode(node: Node, plan: Plan): string {
	const replacement = plan.replace.get(node);
	if (replacement !== undefined) {
		return replacement;
	}

	/**
	 * Only re-emit a functional pseudo from its parsed parts when something inside it changed.
	 * Anything untouched is passed through verbatim, which keeps micro-syntaxes such as
	 * `:nth-child(2n+1)` byte-exact.
	 */
	if (node.type === 'pseudo' && node.nodes.length > 0 && subtreeTouched(node, plan)) {
		const inner = node.nodes.map((argument) => emitSelector(argument, plan)).join(', ');
		return `${node.value}(${inner})`;
	}

	return node.toString().trim();
}

function subtreeTouched(node: Node, plan: Plan): boolean {
	let found = false;
	if (node.type !== 'pseudo') {
		return false;
	}
	node.walk((inner) => {
		if (plan.touched.has(inner)) {
			found = true;
		}
	});
	return found;
}

/* -------------------------------------------------------------------------------------- */
/* Guard recognition                                                                       */
/* -------------------------------------------------------------------------------------- */

/**
 * Already carries a guard that covers this compound: a `:not(:where(…))` whose term list is a
 * superset of the terms the compound's position needs, in any order and with any extra terms
 * the author added. Byte-exact matching is not enough here, because the merge in
 * {@link planPreExistingGuards} preserves author terms, and a guard the transform itself wrote
 * must be recognised as complete on the next pass.
 */
function isCompoundGuarded(nodes: Node[], form: 'narrow' | 'wide'): boolean {
	const required = form === 'wide' ? WIDE_TERM_KEYS : NARROW_TERM_KEYS;

	return nodes.some((node) => {
		const terms = guardTermKeysOf(node);
		if (terms === null) {
			return false;
		}
		for (const key of required) {
			if (!terms.has(key)) {
				return false;
			}
		}
		return true;
	});
}

/**
 * The normalised term keys of a `:not(:where(<simple terms>))` that mentions at least one term
 * of `L`, or `null` when the node is not such a guard.
 */
function guardTermKeysOf(node: Node): Set<string> | null {
	if (node.type !== 'pseudo' || pseudoName(node) !== ':not') {
		return null;
	}
	const where = soleWhereInside(node);
	if (!where) {
		return null;
	}
	const terms = where.nodes;
	if (!terms.every(isSimpleTerm) || !terms.some(termIsGuardTerm)) {
		return null;
	}
	return new Set(terms.map((term) => normalise(term.toString())));
}

/**
 * Does this pseudo mention any term of `L` anywhere inside it?
 */
function mentionsGuardTerm(pseudo: Pseudo): boolean {
	let found = false;
	pseudo.walk((node) => {
		if (isGuardTermNode(node)) {
			found = true;
		}
	});
	return found;
}

/**
 * Is this one term of an exclusion list a term of `L` or `S`, such as `dialog` or `style`?
 */
function termIsGuardTerm(term: Selector): boolean {
	return term.nodes.some(isGuardTermNode);
}

/**
 * Does this node name a top layer host, or an element `L` lists, outright?
 */
function isGuardTermNode(node: Node): boolean {
	if (node.type === 'attribute') {
		return node.attribute.toLowerCase() === 'popover';
	}
	if (node.type === 'tag') {
		return GUARD_TERM_TAGS.has(node.value.toLowerCase());
	}
	if (node.type === 'pseudo') {
		return HOST_PSEUDOS.has(pseudoName(node));
	}
	return false;
}

/**
 * The single `:where()` inside `:not(…)` when that is all it contains, otherwise `null`.
 */
function soleWhereInside(pseudo: Pseudo): Pseudo | null {
	const only = solePseudoInside(pseudo);
	return only && pseudoName(only) === ':where' ? only : null;
}

/**
 * The single `:not()` inside `:not(…)` when that is all it contains, otherwise `null`.
 */
function soleNotInside(pseudo: Pseudo): Pseudo | null {
	const only = solePseudoInside(pseudo);
	return only && pseudoName(only) === ':not' ? only : null;
}

/**
 * The single pseudo inside `:not(…)` when that is all it contains, otherwise `null`.
 */
function solePseudoInside(pseudo: Pseudo): Pseudo | null {
	if (pseudo.nodes.length !== 1) {
		return null;
	}
	const inner = nonEmptyNodes(pseudo.nodes[0]);
	if (inner.length !== 1) {
		return null;
	}
	const only = inner[0];
	return only.type === 'pseudo' ? only : null;
}

/* -------------------------------------------------------------------------------------- */
/* Specificity                                                                             */
/* -------------------------------------------------------------------------------------- */

/**
 * Compute (a,b,c) for one selector.
 *
 * - an id is (1,0,0); a class, attribute or pseudo-class is (0,1,0); a type or pseudo-element
 *   is (0,0,1); the universal selector is (0,0,0);
 * - `:where()` is always (0,0,0), whatever it contains;
 * - `:not()`, `:is()` and `:has()` take the specificity of their most specific argument and
 *   add nothing of their own;
 * - `:nth-child()` / `:nth-last-child()` count as one pseudo-class *plus* the specificity of
 *   the most specific selector in an `of S` argument. With `S` weightless that is (0,1,0),
 *   which is what makes the positional rewrites neutral;
 * - the nesting selector `&` is treated as (0,0,0). It is never modified by this transform,
 *   so whatever its real value is, it is the same before and after.
 */
function specificityOfSelector(branch: Selector): Specificity {
	let a = 0;
	let b = 0;
	let c = 0;

	for (const node of branch.nodes) {
		const [na, nb, nc] = specificityOfNode(node);
		a += na;
		b += nb;
		c += nc;
	}

	return [a, b, c];
}

function specificityOfNode(node: Node): Specificity {
	switch (node.type) {
		case 'id':
			return [1, 0, 0];
		case 'class':
		case 'attribute':
			return [0, 1, 0];
		case 'tag':
			return [0, 0, 1];
		case 'pseudo':
			return specificityOfPseudo(node);
		default:
			return [0, 0, 0];
	}
}

function specificityOfPseudo(pseudo: Pseudo): Specificity {
	if (isPseudoElement(pseudo)) {
		return [0, 0, 1];
	}

	switch (pseudoName(pseudo)) {
		case ':where':
			return [0, 0, 0];
		case ':not':
		case ':is':
		case ':has':
		case ':matches':
		case ':-moz-any':
		case ':-webkit-any':
			return maxSpecificity(pseudo.nodes.map(specificityOfSelector));
		case ':nth-child':
		case ':nth-last-child': {
			const inner = nthArgumentText(pseudo);
			const ofIndex = findOfKeyword(inner);
			if (ofIndex === -1) {
				return [0, 1, 0];
			}
			let argument: Specificity = [0, 0, 0];
			try {
				argument = maxSpecificity(parse(inner.slice(ofIndex + 2)).map(specificityOfSelector));
			} catch {
				argument = [0, 0, 0];
			}
			return [argument[0], argument[1] + 1, argument[2]];
		}
		default:
			return [0, 1, 0];
	}
}

function maxSpecificity(list: Specificity[]): Specificity {
	let best: Specificity = [0, 0, 0];
	for (const candidate of list) {
		if (compareSpecificity(candidate, best) > 0) {
			best = candidate;
		}
	}
	return best;
}

function compareSpecificity(left: Specificity, right: Specificity): number {
	for (let index = 0; index < 3; index++) {
		if (left[index] !== right[index]) {
			return left[index] - right[index];
		}
	}
	return 0;
}

function sameSpecificity(left: Specificity, right: Specificity): boolean {
	return compareSpecificity(left, right) === 0;
}

/* -------------------------------------------------------------------------------------- */
/* Small AST helpers                                                                       */
/* -------------------------------------------------------------------------------------- */

/**
 * The raw text between the parentheses of a functional pseudo.
 */
function nthArgumentText(pseudo: Pseudo): string {
	const text = pseudo.toString().trim();
	const open = text.indexOf('(');
	if (open === -1 || !text.endsWith(')')) {
		return '';
	}
	return text.slice(open + 1, -1);
}

/**
 * Index of the `of` keyword in an `An+B [of S]` argument, or -1. The `An+B` part can only
 * contain digits, `n`, `+`, `-` and whitespace, so the first `of` word is the separator. The
 * selector list may follow it with no whitespace at all, as in `2 of:not(…)`, so only the
 * boundary after the word is required, not a space.
 */
function findOfKeyword(inner: string): number {
	const match = /(^|\s)of\b/i.exec(inner);
	if (!match) {
		return -1;
	}
	return match.index + match[1].length;
}

function hasAncestorPseudo(node: Node, value: string): boolean {
	let current: Node | undefined = node.parent as Node | undefined;
	while (current) {
		if (current.type === 'pseudo' && pseudoName(current) === value) {
			return true;
		}
		current = current.parent as Node | undefined;
	}
	return false;
}

function hasNestedHas(branch: Selector): boolean {
	let found = false;
	branch.walkPseudos((pseudo) => {
		if (pseudoName(pseudo) === ':has' && hasAncestorPseudo(pseudo, ':has')) {
			found = true;
		}
	});
	return found;
}
