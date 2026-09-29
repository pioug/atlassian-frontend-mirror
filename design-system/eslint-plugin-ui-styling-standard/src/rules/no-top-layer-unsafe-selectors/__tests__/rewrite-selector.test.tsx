/* eslint-disable no-template-curly-in-string -- `${…}` is the subject under test here: an
   interpolated selector is one of the forms the transform must refuse rather than rewrite, so
   these strings have to carry the placeholder literally. */
import { rewriteSelector } from '../rewrite-selector';

/**
 * Guard strings are written out **literally** in every expectation below, never interpolated
 * from a constant. A ratcheting rule matches raw source text, so an expectation built from the
 * same constant the transform uses would pass no matter what the transform emitted.
 */

describe('the eight canonical guard forms', () => {
	it('X:not(:where(partial)) -> X:not(:where(L_wide)) when X is unanchored', () => {
		/**
		 * The decision doc's table row 1 shows the narrow form, but an unanchored compound can
		 * match inside a surface anywhere in the document, so the wide form is the sufficient one.
		 * Measured by the Chromium oracle's `e2-wide-guard-attribute` pair, and it is what
		 * production already ships at 8 sites.
		 *
		 * A *fresh* guard is never written on an unanchored compound at global scope, because
		 * with nothing above it the rule reached the portalled surface before the flag (see the
		 * reach block below). The form still decides which list a partial guard is merged up to.
		 */
		const result = rewriteSelector('[data-foo]:not(:where([popover], dialog))');

		expect(result.after).toBe('[data-foo]:not(:where([popover], dialog, [popover] *, dialog *))');
		expect(result.population).toBe('guardable');
		expect(result.guardCount).toBe(1);
		expect(result.damageModes).toEqual(['popover-receives']);
	});

	it('keeps the narrow form for an unanchored compound whose subtree terms are inert', () => {
		/* A class never names a host, so the subtree terms add nothing. */
		expect(rewriteSelector('.foo:not(:where(dialog))').after).toBe(
			'.foo:not(:where([popover], dialog))',
		);
	});

	it('uses the narrow form after a child combinator', () => {
		expect(rewriteSelector('& > div').after).toBe('& > div:not(:where([popover], dialog))');
	});

	it('& > * -> & > *:not(:where(L))', () => {
		const result = rewriteSelector('& > *');

		expect(result.after).toBe('& > *:not(:where([popover], dialog))');
		expect(result.guardCount).toBe(1);
	});

	it('& > div -> & > div:not(:where(L))', () => {
		const result = rewriteSelector('& > div');

		expect(result.after).toBe('& > div:not(:where([popover], dialog))');
		expect(result.guardCount).toBe(1);
	});

	/**
	 * The remaining five rows of the table are the `of S` family, and they are **withdrawn**:
	 * planned, specificity-checked, and then refused at the transform's output gate, because
	 * Compiled's extract mode drops the CSS for any selector carrying an `of` argument. They are
	 * covered by their own block below.
	 */
	it.each([
		'& > *:first-child',
		'& > *:last-child',
		'& > :not(:first-child)',
		'& > :not(:last-child)',
		'& > *:only-child',
	])('%s is reported without a fix, because its form needs an `of` clause', (selector) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});

	it('keeps the universal on a guarded compound, and emits nothing for a positional one', () => {
		expect(rewriteSelector('& > *').after).toContain('*:not(');
		expect(rewriteSelector('& > *:first-child').after).toBeNull();
	});

	it('refuses an explicit tag carrying a positional pseudo, rather than guarding it', () => {
		/* `div:first-child` has a `popover-receives` exposure as well, but the compound cannot be
		 * closed without the `of` clause, so the whole selector is refused rather than half-fixed. */
		const result = rewriteSelector('& > div:first-child');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});
});

describe('the `of S` family is withdrawn — Compiled `extract: true` drops the rule', () => {
	/**
	 * Every positional form needs an `of S` clause, and Compiled's extract mode emits no CSS for a
	 * selector carrying one. The measurement is in the `WITHDRAWN_POSITIONAL_FORMS` docblock. The
	 * debt is still reported in full; only the fix is withdrawn.
	 */
	const positional = [
		'& > *:first-child',
		'& > *:last-child',
		'& > :not(:first-child)',
		'& > :not(:last-child)',
		'& > *:only-child',
		'& > div:first-child',
		'& > *:nth-child(2)',
		'& > *:nth-last-child(2)',
		'&:first-child',
		'.list > li:first-child',
		'.x:has(> *:only-child)',
		'.x:has(> *:first-child)',
		'.x:has(.item:only-child)',
	];

	it.each(positional)('%s is residue, not a rewrite', (selector) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
		expect(result.damageModes).toEqual([]);
	});

	it.each(positional)('%s reports the extract-mode defect as its reason', (selector) => {
		const reason = rewriteSelector(selector).reason ?? '';

		expect(reason).toMatch(/extract/);
		expect(reason).toMatch(/withdrawn/);
	});

	it('emits no `of` clause for any input in the corpus', () => {
		/* The invariant, stated over output text rather than over the planner: whatever route a
		 * rewrite takes, nothing carrying an `of` argument may be written to a file. */
		for (const selector of positional) {
			expect(rewriteSelector(selector).after).toBeNull();
		}
	});

	it('names the withdrawn form in the reason, so it is not lost', () => {
		expect(rewriteSelector('& > *:first-child').reason).toContain(':nth-child(1 of S)');
		expect(rewriteSelector('& > *:last-child').reason).toContain(':nth-last-child(1 of S)');
		expect(rewriteSelector('& > :not(:first-child)').reason).toContain(':nth-child(n+2 of S)');
		expect(rewriteSelector('& > :not(:last-child)').reason).toContain(':nth-last-child(n+2 of S)');
		expect(rewriteSelector('& > *:nth-child(2)').reason).toContain(':nth-child(2 of S)');
	});

	it('refuses the whole selector rather than guarding the compounds that could be guarded', () => {
		/**
		 * `& > div > *:first-child` has a genuine `popover-receives` exposure on the `div` and an
		 * unfixable `real-element-loses` one on the positional compound. A guard on the `div`
		 * alone would read as a fix on a rule that stays broken, which is the transform's
		 * standing reason for refusing whole rather than partially rewriting.
		 */
		const result = rewriteSelector('& > div > *:first-child');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
	});

	describe('pseudo-class names are matched case-insensitively', () => {
		/**
		 * CSS pseudo-class names are ASCII case-insensitive, so `:NTH-CHILD` is the same selector
		 * as `:nth-child`. A name-keyed decision that skipped the uppercase spelling would fall
		 * through to the plain `:not(:where(L))` guard and emit a *false* fix on a
		 * `real-element-loses` site — worse than no fix, because it reads as handled.
		 */
		it.each([
			'& > *:NTH-CHILD(1 of .foo)',
			'& > *:NTH-LAST-CHILD(n+2 of li)',
			'& > *:FIRST-CHILD',
			'& > *:LAST-CHILD',
			'& > *:ONLY-CHILD',
			'& > *:not(:FIRST-CHILD)',
			'& > *:nth-child(1 OF .foo)',
			'& > div:FIRST-OF-TYPE',
			'& > div:EMPTY',
			'& > div:HOVER',
			'.x:HAS(div:hover)',
			'.x:has(+ div):HAS(span)',
		])('refuses %s', (selector) => {
			const result = rewriteSelector(selector);

			expect(result.population).toBe('residue');
			expect(result.after).toBeNull();
			expect(result.guardCount).toBe(0);
		});

		it('refuses the same selectors as their lowercase spelling', () => {
			for (const [upper, lower] of [
				['& > div:FIRST-OF-TYPE', '& > div:first-of-type'],
				['& > div:EMPTY', '& > div:empty'],
				['& > div:HOVER', '& > div:hover'],
				['.x:HAS(div:hover)', '.x:has(div:hover)'],
			]) {
				expect(rewriteSelector(upper).population).toBe(rewriteSelector(lower).population);
			}
		});

		it('guards a `:HAS()` argument as it would `:has()`', () => {
			expect(rewriteSelector('.x:HAS(button)').after).toBe(
				'.x:HAS(button:not(:where([popover], dialog, [popover] *, dialog *)))',
			);
		});

		it('inserts the guard before an uppercase legacy pseudo-element', () => {
			expect(rewriteSelector('& > div:AFTER').after).toBe(
				'& > div:not(:where([popover], dialog)):AFTER',
			);
		});

		it('still guards a non-positional compound spelled in uppercase', () => {
			expect(rewriteSelector('& > DIV').after).toBe('& > DIV:not(:where([popover], dialog))');
		});
	});

	describe('the `of` keyword is found without a space after it', () => {
		it('refuses `of:not(…)` as a selector that already carries an `of` clause', () => {
			const result = rewriteSelector('& > *:nth-child(2 of:not(:where([popover], dialog)))');

			expect(result.population).toBe('residue');
			expect(result.reason).toMatch(/already carries an `of` argument/);
		});

		it('refuses `of.foo` too', () => {
			expect(rewriteSelector('& > *:nth-child(2 of.foo)').population).toBe('residue');
		});
	});

	describe('a selector that already carries an `of` clause', () => {
		/**
		 * These sites are already emitting no CSS in every extract build, so they are reported
		 * for triage rather than merged up to the canonical seven terms or called safe. A merge
		 * would leave them exactly as dead as they were while reading in review as a fix.
		 */
		const carrying = [
			'& > :nth-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript)))',
			'& > :nth-child(1 of :not(:where([popover], dialog)))',
			'& > :nth-last-child(1 of :not(:where([popover], dialog)))',
			'& > div:nth-child(1 of .foo)',
			'& > *:nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))',
		];

		it.each(carrying)('%s is residue, not merged and not excluded', (selector) => {
			const result = rewriteSelector(selector);

			expect(result.population).toBe('residue');
			expect(result.after).toBeNull();
			expect(result.reason).toMatch(/already carries an `of` argument/);
			expect(result.reason).toMatch(/extract/);
		});

		it('is refused at depth, inside a :has() argument', () => {
			expect(
				rewriteSelector(
					'.x:has(> :nth-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript))))',
				).population,
			).toBe('residue');
		});
	});
});

describe('trap 1 — X:not(S) is a double negative', () => {
	it('appends :not(:where(L)) and never :not(:not(…))', () => {
		const after = rewriteSelector('& > div')!.after!;

		expect(after).not.toContain(':not(:not(');
		/* Exactly one negation, wrapping exactly one :where(). */
		expect(after.match(/:not\(/g)).toHaveLength(1);
		expect(after.match(/:where\(/g)).toHaveLength(1);
	});

	it('never wraps the guard in a second negation on re-run', () => {
		const once = rewriteSelector('& > div').after!;
		const twice = rewriteSelector(once);

		expect(twice.after).toBeNull();
		expect(twice.guardCount).toBe(0);
		expect(once).not.toContain(':not(:not(');
	});

	it('a hand-written double negative is refused rather than deepened', () => {
		const result = rewriteSelector('& > div:not(:not(:where([popover], dialog)))');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.reason).toMatch(/double negative/);
		expect(result.reason).toMatch(/only.*hosts/);
	});
});

describe('trap 2 — every compound a host could satisfy needs a guard', () => {
	it("'& > div > div' needs exactly 2 guards", () => {
		const result = rewriteSelector('& > div > div');

		expect(result.guardCount).toBe(2);
		expect(result.after).toBe(
			'& > div:not(:where([popover], dialog)) > div:not(:where([popover], dialog))',
		);
	});

	it("'& > div > span' needs exactly 1 guard", () => {
		const result = rewriteSelector('& > div > span');

		expect(result.guardCount).toBe(1);
		expect(result.after).toBe('& > div:not(:where([popover], dialog)) > span');
	});

	it('guarding only the rightmost compound would leave the rule matching through the host', () => {
		/* The regression this trap describes: the guard is inert on the surface wrapper. */
		const after = rewriteSelector('& > div > div').after!;
		const [left, right] = after.split(' > ').slice(1);

		expect(left).toContain(':not(:where([popover]');
		expect(right).toContain(':not(:where([popover]');
	});

	it('does not guard a compound with a class, an id, or the nesting selector', () => {
		expect(rewriteSelector('& > .foo').population).toBe('excluded');
		expect(rewriteSelector('& > #foo').population).toBe('excluded');
		expect(rewriteSelector('&').population).toBe('excluded');
	});

	it('guards an attribute-only compound', () => {
		expect(rewriteSelector('& > [data-slot]').after).toBe(
			'& > [data-slot]:not(:where([popover], dialog))',
		);
	});

	it('leaves a compound that names a host alone, rather than making it match nothing', () => {
		/**
		 * `& > dialog`, `& > [popover]`, `& style` target a surface or a non-rendered element on
		 * purpose. For a host, every guard form excludes exactly what the compound selects. For a
		 * non-rendered tag, a guard would protect nothing.
		 */
		for (const selector of ['& > dialog', '& > [popover]', '& style', '& dialog']) {
			const result = rewriteSelector(selector);
			expect(result.after).toBeNull();
			expect(result.guardCount).toBe(0);
			expect(result.reason).toMatch(/names a top layer host/);
		}
	});

	it('treats a pseudo only a host can satisfy as naming the host', () => {
		/* `:popover-open`, `:modal` and `::backdrop` are true only of a top layer element. */
		for (const selector of [
			'& > :popover-open',
			'& > *:modal',
			'& div::backdrop',
			'& > *:POPOVER-OPEN',
		]) {
			const result = rewriteSelector(selector);
			expect(result.after).toBeNull();
			expect(result.guardCount).toBe(0);
			expect(result.reason).toMatch(/names a top layer host/);
		}
	});

	it('does not guard a non-host tag in child position', () => {
		expect(rewriteSelector('& > section').population).toBe('excluded');
	});

	it('inserts the guard before a pseudo-element, not after it', () => {
		expect(rewriteSelector('& > div::before').after).toBe(
			'& > div:not(:where([popover], dialog))::before',
		);
	});
});

describe('trap 3 — :has() needs a guard on every top-level comma branch', () => {
	it("'.x:has(button, a)' needs exactly 2 guards", () => {
		const result = rewriteSelector('.x:has(button, a)');

		expect(result.guardCount).toBe(2);
		expect(result.after).toBe(
			'.x:has(button:not(:where([popover], dialog, [popover] *, dialog *)), a:not(:where([popover], dialog, [popover] *, dialog *)))',
		);
	});

	it('uses the wide form inside :has(), because the match is a host descendant', () => {
		expect(rewriteSelector('.x:has(button)').after).toContain('[popover] *, dialog *');
	});

	it('does not split commas nested inside :where(), :is() or :not()', () => {
		const result = rewriteSelector('.x:has(:where(a, b), c)');

		expect(result.guardCount).toBe(2);
		expect(result.after).toBe(
			'.x:has(:where(a, b):not(:where([popover], dialog, [popover] *, dialog *)), c:not(:where([popover], dialog, [popover] *, dialog *)))',
		);
	});

	it('guards the host-capable compound of a :has() branch, not its rightmost one', () => {
		/**
		 * `div > span` inside the argument: the `div` is a descendant of the subject and a host
		 * could be it, so it takes the wide list. No host is a `span`, so a guard there would be
		 * inert, and the argument would still match popup content through the unguarded `div`.
		 */
		const result = rewriteSelector('.x:has(div > span)');

		expect(result.guardCount).toBe(1);
		expect(result.after).toBe(
			'.x:has(div:not(:where([popover], dialog, [popover] *, dialog *)) > span)',
		);
	});

	it('uses the NARROW form after `>` inside a :has() argument', () => {
		/**
		 * The subtree terms mean "not inside ANY surface", not "not inside the host's subtree". A
		 * compound after `>` can only match a direct child of the previous one, so the host can
		 * only BE the matched element, and narrow closes that. Wide would additionally stop the
		 * rule matching a real child of a subject that itself sits inside a surface, which is a
		 * match that should hold. Measured in Chromium over three fixtures: wide is never better
		 * and strictly worse once.
		 */
		expect(rewriteSelector('.x:has(> div)').after).toBe(
			'.x:has(> div:not(:where([popover], dialog)))',
		);
	});

	it('plans every compound of a :has() argument as a top-level compound', () => {
		/**
		 * `& > div > span` guards the `div` and leaves the `span` alone. The same selector inside
		 * a `:has()` argument must come out the same way, or `<div class=x><div popover><span>`
		 * still satisfies `.x:has(> div > span)` through the unguarded host.
		 */
		const narrow = ':not(:where([popover], dialog))';
		const wide = ':not(:where([popover], dialog, [popover] *, dialog *))';

		/**
		 * The `&` spellings run at nested scope, as the rule reads them. The `.x` spellings run at
		 * global scope, as the `.css` sweep reads them, so that `.x` itself is not read as `& .x`.
		 */
		const cases: [string, string, number, 'nested' | 'global'][] = [
			['&:has(> div > span)', `&:has(> div${narrow} > span)`, 1, 'nested'],
			['.x:has(> div > span)', `.x:has(> div${narrow} > span)`, 1, 'global'],
			['&:has(> div > div)', `&:has(> div${narrow} > div${narrow})`, 2, 'nested'],
			['&:has(div span)', `&:has(div${wide} span${wide})`, 2, 'nested'],
			['.x:has(> div span)', `.x:has(> div${narrow} span${wide})`, 2, 'global'],
		];

		for (const [before, after, guardCount, scope] of cases) {
			const result = rewriteSelector(before, undefined, { scope });

			expect(result.after).toBe(after);
			expect(result.guardCount).toBe(guardCount);

			const again = rewriteSelector(after, undefined, { scope });
			expect(again.after).toBeNull();
			expect(again.population).toBe('excluded');
		}
	});

	it('leaves a :has() argument alone when no host can be any compound of it', () => {
		const result = rewriteSelector('&:has(> span)', undefined, { scope: 'nested' });

		expect(result.after).toBeNull();
		expect(result.population).toBe('excluded');
		expect(result.guardCount).toBe(0);
	});

	it('leaves a :has() argument that names a host alone', () => {
		expect(rewriteSelector('.x:has(> dialog)').after).toBeNull();
		expect(rewriteSelector('.x:has([popover])').after).toBeNull();
	});

	it('leaves a :has() argument alone when any compound of it names a host, not only the last', () => {
		/**
		 * `:has(dialog button)` matches only buttons inside a dialog. A wide guard on `button`
		 * excludes `dialog *`, which is every element the argument can match, so the `:has()`
		 * would become unsatisfiable and the rule would silently stop applying.
		 */
		for (const selector of [
			'.x:has(dialog button)',
			'.x:has([popover] button)',
			'.x:has(dialog > button)',
		]) {
			const result = rewriteSelector(selector);

			expect(result.after).toBeNull();
			expect(result.guardCount).toBe(0);
			expect(result.reason).toMatch(/names a top layer host/);
		}
	});

	it('keeps the NARROW form when merging a partial guard inside an anchored :has() argument', () => {
		/**
		 * The merge must use the argument's own position. Upgrading an anchored argument to the
		 * wide list would exclude `dialog *`, which is exactly the subject's real child when the
		 * subject is itself rendered inside a Modal.
		 */
		expect(rewriteSelector('.x:has(> div:not(:where(dialog)))').after).toBe(
			'.x:has(> div:not(:where([popover], dialog)))',
		);
		expect(rewriteSelector('.x:has(div:not(:where([popover], dialog)))').after).toBe(
			'.x:has(div:not(:where([popover], dialog, [popover] *, dialog *)))',
		);
	});

	it('counts a compound guard and its :has() branch guards separately', () => {
		const result = rewriteSelector('& > div:has(button, a)');

		expect(result.guardCount).toBe(3);
	});
});

describe('positional pseudos inside a :has() argument', () => {
	/**
	 * The `of S` rewrite was Chromium-verified at depth 2, child- and descendant-scoped:
	 * specificity-neutral, matching correct, no nested `:has()` introduced. That is still true of
	 * the CSS, and it is not the reason these are refused — the `of` clause does not survive
	 * Compiled's extract mode, at any depth. This is the position that had 13 rows parked in the
	 * judgement bucket; they are back in the judgement bucket.
	 */
	const inArgument = [
		'.x:has(> *:only-child)',
		'.x:has(> *:first-child)',
		'.x:has(> *:last-child)',
		'.x:has(.item:only-child)',
	];

	it.each(inArgument)('%s is refused, not rewritten one level down', (selector) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});

	it('adds no guard to the rest of the argument either', () => {
		/**
		 * `.x:has(.item:only-child)` has a legitimate wide-guard exposure on the `.item` compound
		 * as well. It is withheld with the rest: a `:has()` branch guarded but still positionally
		 * broken reads as fixed.
		 */
		expect(rewriteSelector('.x:has(.item:only-child)').after).toBeNull();
		expect(rewriteSelector('.x:has(.item:only-child)').guardCount).toBe(0);
	});

	it('still guards a :has() argument with no positional pseudo in it', () => {
		/* The withdrawal is scoped to the `of` clause, not to `:has()`. */
		expect(rewriteSelector('.x:has(.item)').after).toBe(
			'.x:has(.item:not(:where([popover], dialog, [popover] *, dialog *)))',
		);
	});

	it('records the specificity it would have preserved', () => {
		for (const selector of inArgument) {
			const result = rewriteSelector(selector);
			expect(result.specificityAfter).toEqual(result.specificityBefore);
		}
	});

	it('still refuses a positional pseudo inside :is(), :where() or :not()', () => {
		expect(rewriteSelector('.x:is(*:only-child)').population).toBe('residue');
		expect(rewriteSelector('.x:where(*:only-child)').population).toBe('residue');
	});
});

describe('a bare universal at global scope — where guarding is actively harmful', () => {
	/**
	 * Two real AFM rules share identical selector text and need opposite treatment. With a bare
	 * universal selector, `box-sizing: inherit` is a reset and MUST NOT be guarded, while
	 * `cursor: col-resize; user-select: none` is an override and MUST be guarded.
	 *
	 * Guarding the reset excludes the host from it, leaving it the only element in the document
	 * with a different box model — a layout bug introduced by the fix, with nothing to compensate,
	 * because the host surface reset covers text-layout properties and not the box model.
	 */
	const bare = ['*', '*::before', '*::after'];

	it.each(bare)('%s is residue when the declarations are unknown', (selector) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
		expect(result.reason).toMatch(/bare universal selector at global scope/);
		expect(result.reason).toMatch(/box-sizing: inherit/);
	});

	it('refuses the whole list for the common `*, *::before, *::after` spelling', () => {
		const result = rewriteSelector('*, *::before, *::after');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});

	it('refuses the whole list when only one branch is a bare global universal', () => {
		expect(rewriteSelector('*, .foo > div').population).toBe('residue');
	});

	it('is not the property-effect filter', () => {
		/* That filter is about declarations inert on a `position: fixed` host. Here the
		 * declaration is live on the host and wanted there. */
		expect(rewriteSelector('*', { zIndex: 1 }).population).toBe('residue');
	});

	describe('a scoped universal is unaffected and guards normally', () => {
		it.each([
			['& > *', 1],
			['.foo > *', 1],
			['& *', 1],
			['> *', 1],
		])('%s still guards', (selector, guards) => {
			const result = rewriteSelector(selector);

			expect(result.population).toBe('guardable');
			expect(result.guardCount).toBe(guards);
		});

		it('a scoped universal carrying a positional pseudo is reported for the `of` clause, not for being a reset', () => {
			/* `& > *:first-child` is not a reset and never was. It is refused for the extract-mode
			 * defect, so it stays *reported* — it must not fall into the reset carve-out. */
			const result = rewriteSelector('& > *:first-child');

			expect(result.population).toBe('residue');
			expect(result.reason).toMatch(/extract/);
		});

		it('a bare universal with a positional pseudo is not "bare", and is reported as positional', () => {
			/* Positional rather than a reset, so the bare-global-universal branch must not claim
			 * it — the reason has to be the `of` clause, not the reset judgement call. */
			const result = rewriteSelector('*:first-child');

			expect(result.population).toBe('residue');
			expect(result.reason).toMatch(/extract/);
			expect(result.reason).not.toMatch(/reset/);
		});
	});

	describe('with declarations, the reset direction resolves automatically', () => {
		it('excludes a box-sizing reset rather than guarding it', () => {
			const result = rewriteSelector('*', { boxSizing: 'inherit' });

			expect(result.population).toBe('excluded');
			expect(result.after).toBeNull();
			expect(result.reason).toMatch(/reset-shaped/);
			expect(result.reason).toMatch(/box-sizing/);
		});

		it('accepts raw CSS declaration text, as the enumeration schema stores it', () => {
			expect(rewriteSelector('*', 'box-sizing: inherit;').population).toBe('excluded');
			expect(rewriteSelector('*', 'margin: 0; box-sizing: border-box;').population).toBe(
				'excluded',
			);
		});

		it('treats any cascade keyword as a reset signal', () => {
			for (const value of ['inherit', 'initial', 'unset', 'revert']) {
				expect(rewriteSelector('*', { color: value }).population).toBe('excluded');
			}
		});

		it('leaves a genuine override as residue rather than guarding it on a guess', () => {
			/**
			 * The override direction is deliberately NOT automated. Wrongly calling an override a
			 * reset only leaves a `popover-receives` exposure on a bare `*` rule, which is cheap.
			 * Wrongly calling a reset an override *introduces* a layout bug, which is not.
			 */
			const result = rewriteSelector('*', { cursor: 'col-resize', userSelect: 'none' });

			expect(result.population).toBe('residue');
			expect(result.after).toBeNull();
		});

		it('ignores nested selectors when reading declarations', () => {
			expect(rewriteSelector('*', { boxSizing: 'inherit' }).population).toBe('excluded');
		});

		it('declarations change nothing for a scoped universal', () => {
			expect(rewriteSelector('& > *', { boxSizing: 'inherit' }).population).toBe('guardable');
		});

		it('declarations change nothing for any other selector', () => {
			expect(rewriteSelector('& > div', { boxSizing: 'inherit' }).after).toBe(
				'& > div:not(:where([popover], dialog))',
			);
		});
	});

	describe('the same reset is excluded globally and guarded when scoped', () => {
		/**
		 * This pair exists to answer the question `isBareGlobalUniversal` provokes: why is the class
		 * not wider, given that guarding a *scoped* reset also excludes the host from a reset?
		 *
		 * Because the discriminator is **reach**, not the property. The test is: did the selector
		 * reach the portalled host before the flag?
		 *
		 * - global `*` matches everything everywhere, including surface content sitting in a portal
		 *   at `body` level, so the host **already received** this declaration pre-flag. Guarding
		 *   removes something it had. That is a behaviour change, and the layout bug.
		 * - scoped `& > *` did **not** match the host pre-flag, because the host was portalled away
		 *   and was not a child of `&`. Post-flag it does. That is the `popover-receives` damage,
		 *   and guarding restores the pre-flag rendering.
		 *
		 * Same declaration, opposite dispositions. Note that no browser measurement could have
		 * settled this: a browser can say what `box-sizing` does, but not what the DOM looked like
		 * before the flag.
		 */
		const reset = { boxSizing: 'inherit' } as const;

		it('global scope: excluded, because the guard would remove what the host had pre-flag', () => {
			const result = rewriteSelector('*', reset);

			expect(result.population).toBe('excluded');
			expect(result.after).toBeNull();
		});

		it('consumer scope: guarded, because the guard restores the pre-flag rendering', () => {
			const result = rewriteSelector('& > *', reset);

			expect(result.population).toBe('guardable');
			expect(result.after).toBe('& > *:not(:where([popover], dialog))');
		});

		it('holds for every scoped spelling of the same reset', () => {
			for (const selector of ['& > *', '& *', '.foo > *', '> *']) {
				expect(rewriteSelector(selector, reset).population).toBe('guardable');
			}
		});
	});
});

describe('the reach principle at global scope — a rule that already reached the portal is left alone', () => {
	/**
	 * A guard is safe when it restores pre-flag behaviour and harmful when it removes something
	 * the surface had pre-flag. A global rule with nothing but the document itself above the
	 * guarded compound — `div`, `body div`, `* + *` — matched the surface's content in its portal
	 * at `body` level, so guarding it takes styling away from that content. A rule below a
	 * consumer-owned ancestor did not reach the portal, so the host inside that ancestor is a new
	 * match and the guard restores.
	 */
	const reached = ['div', 'body div', 'html body div', ':root div', '* + *', '* div', 'body > div'];

	it.each(reached)(
		'%s is excluded, because the guard would remove what the surface had',
		(selector) => {
			const result = rewriteSelector(selector);

			expect(result.population).toBe('excluded');
			expect(result.after).toBeNull();
			expect(result.guardCount).toBe(0);
			expect(result.reason).toMatch(/already reached/);
			expect(result.reason).toMatch(/left alone/);
		},
	);

	it('treats a qualified document element as document-level too', () => {
		for (const selector of ['html[data-color-mode="dark"] div', 'body.no-scroll div']) {
			expect(rewriteSelector(selector).population).toBe('excluded');
		}
	});

	const stillGuarded: [string, string][] = [
		['.sidebar div', '.sidebar div:not(:where([popover], dialog, [popover] *, dialog *))'],
		['.x > div', '.x > div:not(:where([popover], dialog))'],
		['#app div', '#app div:not(:where([popover], dialog, [popover] *, dialog *))'],
		[
			'body .sidebar div',
			'body .sidebar div:not(:where([popover], dialog, [popover] *, dialog *))',
		],
	];

	it.each(stillGuarded)(
		'%s is still guarded, because the host below the consumer ancestor is a new match',
		(selector, after) => {
			const result = rewriteSelector(selector);

			expect(result.population).toBe('guardable');
			expect(result.after).toBe(after);
		},
	);

	it('an attribute ancestor is not document-level, so the compound below it is guarded', () => {
		/* The rule cannot know whether `[data-theme]` sits on `html` or on the consumer's wrapper. */
		expect(rewriteSelector('[data-theme] div').after).toBe(
			'[data-theme] div:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('a branch opening with a combinator is nested authoring, not a global rule', () => {
		/* `> *` is `& > *` with the parent implied, whatever scope the caller named. */
		expect(rewriteSelector('> *').after).toBe('> *:not(:where([popover], dialog))');
		expect(rewriteSelector('> * + *').guardCount).toBe(2);
	});

	it('does not touch nested scope, where every branch carries `&`', () => {
		const nested = { scope: 'nested' } as const;

		expect(rewriteSelector('div', undefined, nested).after).toBe(
			'div:not(:where([popover], dialog, [popover] *, dialog *))',
		);
		expect(rewriteSelector('& div', undefined, nested).guardCount).toBe(1);
	});

	it('still merges a pre-existing partial guard on a reached compound', () => {
		/* The author decided to guard it; the transform completes the list rather than arguing. */
		expect(rewriteSelector('div:not(:where([popover], dialog))').after).toBe(
			'div:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('leaves a bare universal to its own carve-out', () => {
		/* `*` is decided by the reset judgement before the reach principle is consulted. */
		expect(rewriteSelector('*').population).toBe('residue');
		expect(rewriteSelector('*', { boxSizing: 'inherit' }).population).toBe('excluded');
	});

	it('is not a general sibling verdict', () => {
		/* `* ~ *` is excluded for reach, not reported as a safe general sibling. */
		const result = rewriteSelector('* ~ *');

		expect(result.population).toBe('excluded');
		expect(result.reason).toMatch(/already reached/);
	});
});

describe('a bare div ancestor at global scope is handed to a human', () => {
	/**
	 * The portal container and every surface wrapper were divs, so `div span` at global scope may
	 * have reached the surface's content before the flag, or the div may be the author's own
	 * wrapper. The transform does not guess: it returns `excluded` with `reviewCause` and writes
	 * nothing, and the codemod leaves a comment at the site.
	 */
	const review = [
		'div span',
		'body > div span',
		'div > div span',
		'html div span',
		'body div > div',
	];

	it.each(review)('%s is excluded for review, with nothing written', (selector) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('excluded');
		expect(result.reviewCause).toBe('div-ancestor');
		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
		expect(result.reason).toMatch(/bare div ancestor/);
		expect(result.reason).toMatch(/review by hand/);
	});

	const stillGuarded: [string, string][] = [
		['div.x span', 'div.x span:not(:where([popover], dialog, [popover] *, dialog *))'],
		[
			'div[data-foo] span',
			'div[data-foo] span:not(:where([popover], dialog, [popover] *, dialog *))',
		],
		[
			'.sidebar div span',
			'.sidebar div:not(:where([popover], dialog, [popover] *, dialog *)) span:not(:where([popover], dialog, [popover] *, dialog *))',
		],
		['div:hover span', 'div:hover span:not(:where([popover], dialog, [popover] *, dialog *))'],
	];

	it.each(stillGuarded)(
		"%s is still guarded, because a qualified or classed ancestor is the consumer's own",
		(selector, after) => {
			const result = rewriteSelector(selector);

			expect(result.population).toBe('guardable');
			expect(result.reviewCause).toBeUndefined();
			expect(result.after).toBe(after);
		},
	);

	it('does not change the reach verdict for the div itself', () => {
		for (const selector of ['div', 'body div', 'html body div']) {
			const result = rewriteSelector(selector);

			expect(result.population).toBe('excluded');
			expect(result.reviewCause).toBeUndefined();
			expect(result.reason).toMatch(/already reached/);
		}
	});

	it('withholds every guard in the selector, not only the reviewed compound', () => {
		/* A guard on `.x` next to a review comment on `span` would read as fixed. */
		const result = rewriteSelector('div span .x > div');

		expect(result.population).toBe('excluded');
		expect(result.reviewCause).toBe('div-ancestor');
		expect(result.after).toBeNull();
	});

	it('still merges a pre-existing partial guard on the reviewed compound', () => {
		/* The author already decided; the transform completes the list rather than asking again. */
		const result = rewriteSelector('div span:not(:where([popover], dialog))');

		expect(result.population).toBe('guardable');
		expect(result.reviewCause).toBeUndefined();
		expect(result.after).toBe('div span:not(:where([popover], dialog, [popover] *, dialog *))');
	});

	it('does not touch nested scope, where the div is below `&`', () => {
		const result = rewriteSelector('div span', undefined, { scope: 'nested' });

		expect(result.population).toBe('guardable');
		expect(result.reviewCause).toBeUndefined();
		expect(result.after).toBe(
			'div:not(:where([popover], dialog, [popover] *, dialog *)) span:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('is not raised by a branch that opens with a combinator', () => {
		/* `> div span` is the nested spelling of `& > div span`. */
		expect(rewriteSelector('> div span').reviewCause).toBeUndefined();
		expect(rewriteSelector('> div span').population).toBe('guardable');
	});
});

describe('the `&` compound is never guarded, in any position', () => {
	/**
	 * `&` is the enclosing rule's own subject, and the host is created *inside* `&`, never *as*
	 * `&`. So `&` can never be the host, and a guard on it can only ever subtract legitimate
	 * matches.
	 *
	 * Measured: `html:not([data-color-mode=dark]) &` guarded on the `&` matches outside a surface
	 * and matches NOTHING inside a popover or a dialog — so a theme rule stops applying to every
	 * component rendered inside any surface, and components render inside surfaces constantly.
	 *
	 * This is the mirror image of the host-naming case: there a compound *names* a host and the
	 * guard destroys it, here a compound provably *cannot be* a host and the guard destroys it.
	 * Both are guarding something that is not the enemy, and both look like diligence.
	 */
	const trailingNesting = [
		'html:not([data-color-mode=dark]) &',
		'a &',
		'a:hover &',
		'.msie-11 &',
		'[data-focus-visible="true"] &',
		'.BaseTable__header-cell:last-child:hover &',
	];

	it.each(trailingNesting)('%s does not guard the & compound', (selector) => {
		/* `?? ''` so the assertion runs whether or not a rewrite was emitted. */
		const after = rewriteSelector(selector).after ?? '';

		expect(after).not.toMatch(/(^|[\s,>+~])&:not\(:where\(\[popover\]/);
	});

	it('never guards & in descendant position, where guards are otherwise unconditional', () => {
		const result = rewriteSelector('html &');

		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
	});

	it('never guards & in child or first position either', () => {
		expect(rewriteSelector('&').guardCount).toBe(0);
		expect(rewriteSelector('.foo > &').guardCount).toBe(0);
		expect(rewriteSelector('&.selected').guardCount).toBe(0);
	});

	it('reports a positional pseudo on &, and still never guards the & itself', () => {
		/**
		 * Re-basing sibling counting on `&` is correct — it is the `:not(:where(L))` guard that is
		 * wrong there. The re-basing form is withdrawn for the extract-mode defect, so this is
		 * reported without a fix; what must not happen is the compound falling through to the
		 * guard instead.
		 */
		const result = rewriteSelector('&:first-child');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.reason).toMatch(/extract/);
	});

	it('still guards the other compounds of a selector containing a trailing &', () => {
		/**
		 * `div` can be a host; `&` cannot. Only the former is guarded. A branch carrying `&` is
		 * nested authoring by definition, so it is read under `nested` scope: at `global` scope
		 * the bare `div` would be left alone as already reaching the portal (see the reach block).
		 */
		expect(rewriteSelector('div &', undefined, { scope: 'nested' }).after).toBe(
			'div:not(:where([popover], dialog, [popover] *, dialog *)) &',
		);
	});
});

describe('the of-type family has no guard form anywhere', () => {
	/**
	 * The family is type-scoped by definition — it counts siblings by tag name and takes no `of S`
	 * argument — so a guard cannot fix the counting and only changes behaviour inside surfaces for
	 * nothing.
	 *
	 * Matched against the full pseudo-class name, never by substring: four of the five do not
	 * contain the text `nth-of-type`, and `:first-of-type` alone is 926 occurrences in the
	 * monorepo, so a substring test would silently miss almost the whole family.
	 */
	const family = [
		':first-of-type',
		':last-of-type',
		':only-of-type',
		':nth-of-type(2)',
		':nth-last-of-type(2)',
	];

	it.each(family)('& > div%s is residue', (pseudo) => {
		const result = rewriteSelector(`& > div${pseudo}`);

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.reason).toMatch(/of-type family/);
	});

	it.each(family)(
		'is refused in descendant position too, where guards are unconditional',
		(pseudo) => {
			expect(rewriteSelector(`& table th${pseudo}`).population).toBe('residue');
		},
	);

	it('is refused whatever the tag, including tags no host can share', () => {
		/* This used to be treated as safe, which meant descendant position guarded it anyway. */
		expect(rewriteSelector('& > span:nth-of-type(2)').population).toBe('residue');
		expect(rewriteSelector('& span:first-of-type').population).toBe('residue');
	});

	it('refuses the whole list rather than leaving it partially guarded', () => {
		const result = rewriteSelector('td:first-child, td:first-of-type, th:first-child');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});

	it('is refused at any nesting depth', () => {
		expect(rewriteSelector('.x:has(div:first-of-type)').population).toBe('residue');
		expect(rewriteSelector('& > :not(div:nth-of-type(2))').population).toBe('residue');
	});
});

describe(':empty has no guard form anywhere', () => {
	it('refuses a compound carrying both :only-child and :empty inside a :has()', () => {
		/* The positional rewrite must not be taken when `:empty` sits in the same compound. */
		const result = rewriteSelector('& > div:has(> div:only-child:empty)');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.reason).toMatch(/:empty/);
	});

	it.each([
		'& > div:has(> div > div:only-child:empty)',
		'&:has([data-testid="x"]:empty)',
		'&:not(:has([data-x="resolution"]:not(:empty)))',
		'& > :not([data-element="title"]:empty) + :not([data-element="subtitle"]:empty)',
		'&:has([data-checklist-root]:not(:empty))',
		'& > div:empty',
	])('%s is residue', (selector) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});
});

describe('trap 4 — the withheld :only-child form must not be the (0,2,0) one', () => {
	/**
	 * `:nth-child(1 of S):nth-last-child(1 of S)` is (0,2,0) against `:only-child`'s (0,1,0), and
	 * so is `:nth-child(1 of S):not(:nth-last-child(n+2 of S))`, because `:not()` inherits its
	 * argument's weight. Only the `:where()`-wrapped form is neutral.
	 *
	 * Nothing is emitted for `:only-child` while the `of` clause is withdrawn, so the form is
	 * asserted through the refusal reason — which names it. That keeps the trap under test, and
	 * keeps the form recoverable from the report rather than only from a code comment.
	 */
	it('names the :where()-wrapped form, not the naive one', () => {
		const reason = rewriteSelector('& > *:only-child').reason!;

		expect(reason).toContain(':nth-child(1 of S):not(:where(:nth-last-child(n+2 of S)))');
		expect(reason).not.toContain(':nth-child(1 of S):nth-last-child(1 of S)');
	});

	it('records (0,1,0) unchanged, as the form it withheld would have preserved', () => {
		const result = rewriteSelector('& > *:only-child');

		expect(result.specificityBefore).toEqual([0, 1, 0]);
		expect(result.specificityAfter).toEqual([0, 1, 0]);
	});
});

describe('trap 5 — :not() nesting direction', () => {
	it('pushes the guard inside a wrapping :not(:has(A)) rather than onto the :not()', () => {
		const result = rewriteSelector('.x:not(:has(button))');

		expect(result.after).toBe(
			'.x:not(:has(button:not(:where([popover], dialog, [popover] *, dialog *))))',
		);
		expect(result.guardCount).toBe(1);
	});

	it('puts the guard onto a :not() that is the :has() argument’s rightmost compound', () => {
		const result = rewriteSelector('.x:has(:not(.y))');

		expect(result.after).toBe(
			'.x:has(:not(.y):not(:where([popover], dialog, [popover] *, dialog *)))',
		);
		expect(result.guardCount).toBe(1);
	});

	it('uses the wide form in both directions', () => {
		expect(rewriteSelector('.x:not(:has(button))').after).toContain('[popover] *, dialog *');
		expect(rewriteSelector('.x:has(:not(.y))').after).toContain('[popover] *, dialog *');
	});

	it('reaches a :has() nested inside :is() and :where()', () => {
		expect(rewriteSelector('.x:is(:has(button))').after).toContain(
			'button:not(:where([popover], dialog, [popover] *, dialog *',
		);
		expect(rewriteSelector('.x:where(:has(button))').after).toContain(
			'button:not(:where([popover], dialog, [popover] *, dialog *',
		);
	});

	it('is specificity-neutral through the negation', () => {
		const result = rewriteSelector('.x:not(:has(button))');

		expect(result.specificityBefore).toEqual([0, 1, 1]);
		expect(result.specificityAfter).toEqual([0, 1, 1]);
	});
});

describe('trap 6 — never emit a nested :has()', () => {
	it('refuses a :has() inside a :has() argument, which Chromium rejects outright', () => {
		const result = rewriteSelector('.x:has(div:has(button))');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.reason).toContain('Chromium');
	});

	it('never produces a nested :has() from any guard form', () => {
		const inputs = [
			'.x:has(button, a)',
			'.x:not(:has(button))',
			'.x:has(> div)',
			'& > div:has(button)',
			'& div',
		];

		for (const input of inputs) {
			const after = rewriteSelector(input).after;
			if (after === null) {
				continue;
			}
			expect(after).not.toMatch(/:has\([^)]*:has\(/);
		}
	});
});

describe('specificity is neutral for every emitted rewrite', () => {
	const cases: [string, [number, number, number]][] = [
		['div', [0, 0, 1]],
		['& > *', [0, 0, 0]],
		['& > div', [0, 0, 1]],
		['& > *:first-child', [0, 1, 0]],
		['& > *:last-child', [0, 1, 0]],
		['& > :not(:first-child)', [0, 1, 0]],
		['& > :not(:last-child)', [0, 1, 0]],
		['& > *:only-child', [0, 1, 0]],
		['& > div:first-child', [0, 1, 1]],
		['& > div > div', [0, 0, 2]],
		['& > div > span', [0, 0, 2]],
		['.x:has(button, a)', [0, 1, 1]],
		['.x:has(:where(a, b), c)', [0, 1, 1]],
		['.x:not(:has(button))', [0, 1, 1]],
		['.x:has(:not(.y))', [0, 2, 0]],
		['& > [data-slot]', [0, 1, 0]],
		['& > div::before', [0, 0, 2]],
		['& div', [0, 0, 1]],
		['& > *:nth-child(2)', [0, 1, 0]],
		['& ~ div', [0, 0, 1]],
		['& + div', [0, 0, 1]],
		['> :not([data-layout-slot])', [0, 1, 0]],
	];

	it.each(cases)('%s is (%s) before and after', (selector, expected) => {
		const result = rewriteSelector(selector);

		expect(result.specificityBefore).toEqual(expected);
		expect(result.specificityAfter).toEqual(expected);
	});

	it('refuses rather than emitting a rewrite that would change specificity', () => {
		/* The structural check is the backstop; nothing in the table trips it today, so this
		 * asserts the invariant holds across every emitted rewrite instead. */
		for (const [selector] of cases) {
			const result = rewriteSelector(selector);
			expect(result.specificityAfter).toEqual(result.specificityBefore);
		}
	});
});

describe('idempotency', () => {
	const inputs = [
		'.wrapper div',
		'& > *',
		'& > div',
		'& > div > div',
		'& > div > span',
		'.x:has(button, a)',
		'.x:has(:where(a, b), c)',
		'.x:not(:has(button))',
		'.x:has(:not(.y))',
		'& > [data-slot]',
		'& > div::before',
		'& div',
		'& > div:has(button, a)',
		'& ~ div',
		'& > *:not(:where(dialog))',
		'> :not([data-layout-slot])',
		'& .item',
		'[data-x] div',
	];

	/**
	 * The `of S` family has no output to feed back in, so its idempotency claim is the weaker
	 * but still necessary one: the same input gives the same refusal every time, and a second
	 * call never starts rewriting.
	 */
	const refused = [
		'& > *:first-child',
		'& > *:last-child',
		'& > :not(:first-child)',
		'& > :not(:last-child)',
		'& > *:only-child',
		'& > *:nth-child(2)',
		'.x:has(> *:only-child)',
		'.x:has(.item:only-child)',
		'.x:has(> *:first-child)',
		'& > :nth-child(1 of :not(:where([popover], dialog)))',
	];

	it.each(refused)('is refused identically on every pass for %s', (input) => {
		const first = rewriteSelector(input);
		const second = rewriteSelector(input);

		expect(first.population).toBe('residue');
		expect(first.after).toBeNull();
		expect(second).toEqual(first);
	});

	it.each(inputs)('running the transform on its own output is a no-op for %s', (input) => {
		const first = rewriteSelector(input);
		expect(first.after).not.toBeNull();

		const second = rewriteSelector(first.after!);

		expect(second.after).toBeNull();
		expect(second.guardCount).toBe(0);
		expect(second.population).not.toBe('residue');
	});

	it('a third pass is also a no-op', () => {
		const first = rewriteSelector('& > div > div').after!;
		const second = rewriteSelector(first);
		expect(second.after).toBeNull();
		expect(rewriteSelector(first).after).toBeNull();
	});

	/**
	 * Text stability is not the invariant that matters. A second pass can leave the string alone
	 * on the *third* pass while still having changed what the selector matches on the second —
	 * which is exactly what a stray wide guard on an `of S`-constrained `:has()` argument does.
	 *
	 * The authoritative semantic check is the Chromium oracle (`gate1-matches-oracle.mjs` plus
	 * G4 in `gate3-totality.mjs`), which compares real `matches()` results across passes. These
	 * assertions pin the structural signature of that failure so it cannot come back silently.
	 */
	describe('semantic stability, not just text stability', () => {
		it('adds no guard whatsoever on a second pass', () => {
			for (const input of inputs) {
				const once = rewriteSelector(input).after!;
				const twice = rewriteSelector(once);

				expect(twice.guardCount).toBe(0);
				expect(twice.after).toBeNull();
			}
		});

		it('never writes an `of S` argument and a wide guard into the same :has() branch', () => {
			/**
			 * Both together was the signature of a dropped match. Nothing carrying an `of`
			 * argument is emitted at all now, so the assertion is over every output the corpus
			 * produces rather than over the two `:has()` inputs that used to show it.
			 */
			for (const input of [...inputs, ...refused]) {
				const once = rewriteSelector(input).after;
				if (once === null) {
					continue;
				}
				expect(once.includes(' of ')).toBe(false);
			}
		});

		it('does not grow the guard count across three passes', () => {
			for (const input of inputs) {
				const once = rewriteSelector(input);
				const twice = rewriteSelector(once.after!);
				const thrice = rewriteSelector(twice.after ?? once.after!);

				expect(twice.guardCount).toBe(0);
				expect(thrice.guardCount).toBe(0);
			}
		});
	});
});

describe('guard counts', () => {
	const counts: [string, number][] = [
		['.x:has(button, a)', 2],
		['& > div > div', 2],
		['& > div > span', 1],
		['& > *', 1],
		['& > div:has(button, a)', 3],
		['& > div > div > div', 3],
		['& > div > span > div', 2],
		['& > div, & > span', 1],
		['& > div, & > div', 2],
	];

	it.each(counts)('%s has %i guard(s)', (selector, expected) => {
		expect(rewriteSelector(selector).guardCount).toBe(expected);
	});

	it('a presence check would pass where a count check fails', () => {
		/* Both of these contain a guard; only the count distinguishes the trap. */
		expect(rewriteSelector('& > div > div').after).toContain(':not(:where([popover]');
		expect(rewriteSelector('& > div > span').after).toContain(':not(:where([popover]');
		expect(rewriteSelector('& > div > div').guardCount).not.toBe(
			rewriteSelector('& > div > span').guardCount,
		);
	});
});

describe('descendant combinators use the wide form', () => {
	it('excludes the whole subtree, because the host may be any intermediate ancestor', () => {
		expect(rewriteSelector('& div').after).toBe(
			'& div:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('guards a descendant compound even when no host could be that element', () => {
		expect(rewriteSelector('& span').guardCount).toBe(1);
		expect(rewriteSelector('& span').after).toContain('[popover] *, dialog *');
	});

	it('mixes narrow and wide forms in one selector', () => {
		expect(rewriteSelector('& > div span').after).toBe(
			'& > div:not(:where([popover], dialog)) span:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('guards a class or an id in descendant position', () => {
		/**
		 * Descendant position is the *most* reachable position, not the least: the host's whole
		 * subtree sits there. `& .item` reaches an `.item` rendered inside the surface just as
		 * `& div` reaches a `div`, so a class rules nothing out. Measured by the oracle's
		 * `x-generic-descendant-wide` pair.
		 */
		expect(rewriteSelector('& .item').after).toBe(
			'& .item:not(:where([popover], dialog, [popover] *, dialog *))',
		);
		expect(rewriteSelector('& #body').guardCount).toBe(1);
		expect(rewriteSelector('.foo .bar > span').guardCount).toBe(1);
	});

	it('guards a tag-and-attribute descendant compound, as shipped code does', () => {
		expect(rewriteSelector('& div[role="presentation"]').after).toBe(
			'& div[role="presentation"]:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});
});

describe('residue — patterns with no guard form are refused, never half-fixed', () => {
	const refusals: [string, RegExp][] = [
		['& > *:nth-of-type(2)', /of-type/],
		['& > *:first-of-type', /of-type/],
		['& > *:last-of-type', /of-type/],
		['& > *:only-of-type', /of-type/],
		['& > *:nth-last-of-type(2)', /of-type/],
		['& > div:empty', /:empty/],
		['& + span', /adjacent sibling/],
		['.x:has(+ div)', /sibling combinator/],
		['.x:has(div + span)', /sibling combinator/],
		['.x:has(~ div)', /sibling combinator/],
		['.x:has(:hover)', /:hover/],
		['.x:has(div:hover)', /:hover/],
		['.x:has(:focus-within)', /:focus-within/],
		['.x:has(:active)', /:active/],
		['& > div:hover', /:hover/],
		['& > div:focus-within', /:focus-within/],
		['& > div:active', /:active/],
		['.x:has(&)', /self-referential/],
		['.x:has(> &)', /self-referential/],
		['.x:has(div:has(span))', /Chromium/],
		['& > *:not(:only-child)', /no guard form/],
		['& > *:not(:nth-child(2))', /no guard form/],
		['& > :not(:where(*:only-child))', /nested inside/],
		['& > div:nth-child(1 of .foo)', /`of` argument/],
	];

	it.each(refusals)('%s is residue', (selector, reasonPattern) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
		expect(result.damageModes).toEqual([]);
		expect(result.reason).toBeDefined();
		expect(result.reason).toMatch(reasonPattern);
	});

	it('refuses the whole selector list when any branch has no guard form', () => {
		const result = rewriteSelector('& > div, & > *:nth-of-type(2)');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});

	it('refuses *-of-type whatever the tag, since the family has no guard form', () => {
		/**
		 * This once returned `excluded` on the reasoning that a host `<div>` cannot shift
		 * `span`-of-type counting. True, but the gate was load-bearing in the wrong direction: in
		 * descendant position guards are unconditional, so of-type selectors were guarded anyway.
		 */
		expect(rewriteSelector('& > span:nth-of-type(2)').population).toBe('residue');
	});

	it('every residue result carries a reason', () => {
		for (const [selector] of refusals) {
			expect(rewriteSelector(selector).reason).toBeTruthy();
		}
	});

	it('does not prescribe the withdrawn `of S` form as the available fix', () => {
		/* A developer following a `rewrite to :nth-child(n+2 of S)` hint would ship a rule that
		 * emits no CSS in every extract build. */
		for (const selector of ['& > *:not(:only-child)', '& > *:not(:nth-child(2))']) {
			const reason = rewriteSelector(selector).reason ?? '';
			expect(reason).not.toMatch(/rewrite to/);
			expect(reason).toMatch(/withdrawn/);
		}
	});
});

describe('sibling combinators split by damage mode', () => {
	it('guards the right-hand compound when a host could match it', () => {
		const result = rewriteSelector('& > div + div');

		expect(result.population).toBe('guardable');
		expect(result.after).toBe(
			'& > div:not(:where([popover], dialog)) + div:not(:where([popover], dialog))',
		);
		expect(result.damageModes).toEqual(['popover-receives']);
	});

	it('reports the residual real-element-loses exposure a guard cannot close', () => {
		expect(rewriteSelector('& > div + div').reason).toMatch(/between/);
	});

	it('guards the right-hand compound of > * + *', () => {
		expect(rewriteSelector('> * + *').after).toBe(
			'> *:not(:where([popover], dialog)) + *:not(:where([popover], dialog))',
		);
	});

	it('refuses + when no host can match the right-hand compound', () => {
		const result = rewriteSelector('& + span');

		expect(result.population).toBe('residue');
		expect(result.reason).toMatch(/between/);
	});

	it('treats a general sibling with a non-host right-hand compound as already safe', () => {
		const result = rewriteSelector('& ~ span');

		expect(result.population).toBe('guardable');
		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
		expect(result.reason).toMatch(/insensitive to insertion/);
	});

	it('still guards a general sibling whose right-hand compound a host could match', () => {
		expect(rewriteSelector('& ~ div').after).toBe('& ~ div:not(:where([popover], dialog))');
	});
});

describe('pre-existing guards are merged, never replaced or duplicated', () => {
	it('merges the missing term into :not(:where(dialog))', () => {
		const result = rewriteSelector('& > *:not(:where(dialog))');

		expect(result.after).toBe('& > *:not(:where([popover], dialog))');
		expect(result.guardCount).toBe(1);
	});

	it('adds no second guard when merging', () => {
		const after = rewriteSelector('& > *:not(:where(dialog))').after!;

		expect(after.match(/:not\(/g)).toHaveLength(1);
	});

	it('merges up to the wide list in descendant position', () => {
		expect(rewriteSelector('& div:not(:where([popover], dialog))').after).toBe(
			'& div:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('merges inside a :has() argument without appending a second guard', () => {
		const result = rewriteSelector('.x:has(button:not(:where([popover], dialog)))');

		expect(result.after).toBe(
			'.x:has(button:not(:where([popover], dialog, [popover] *, dialog *)))',
		);
		expect(result.guardCount).toBe(1);
	});

	describe('one canonical textual form', () => {
		/**
		 * The landed audit PRs used both `& > *:not(:where(…))` and `& > :not(:where(…))` across 11
		 * rows. Semantically identical, but the ratchet matches raw source text, so both inputs must
		 * converge on one output. The explicit `*` wins — it is what the guard-form table and the
		 * oracle's `child-universal` pair both use.
		 */
		it('converges both variants on the explicit-universal form', () => {
			const canonical = '& > *:not(:where([popover], dialog))';

			expect(rewriteSelector('& > *:not(:where(dialog))').after).toBe(canonical);
			expect(rewriteSelector('& > :not(:where(dialog))').after).toBe(canonical);
		});

		it('does not synthesise a universal where the compound has other content', () => {
			expect(rewriteSelector('> :not([data-layout-slot])').after).toBe(
				'> :not([data-layout-slot]):not(:where([popover], dialog))',
			);
			expect(rewriteSelector('.foo:not(:where(dialog))').after).toBe(
				'.foo:not(:where([popover], dialog))',
			);
		});

		it('has no canonical form to converge on for a positional compound, because none is emitted', () => {
			/* The table keeps the positional forms free of a universal — `& > :nth-child(1 of S)`,
			 * not `& > *:nth-child(1 of S)`. Nothing is emitted for them while the `of` clause is
			 * withdrawn, so both spellings of the input are refused alike. */
			expect(rewriteSelector('& > *:first-child').after).toBeNull();
			expect(rewriteSelector('& > :first-child').after).toBeNull();
		});
	});

	it('is a no-op once the list is canonical', () => {
		const canonical = '& > *:not(:where([popover], dialog))';

		expect(rewriteSelector(canonical).after).toBeNull();
	});

	it('leaves a complete guard as written, whatever its order and with or without a `*`', () => {
		expect(rewriteSelector('& > :not(:where([popover], dialog))').after).toBeNull();
		expect(rewriteSelector('& > *:not(:where(dialog, [popover]))').after).toBeNull();
	});

	it('leaves a guard that still lists the non-rendered tags alone in child position', () => {
		expect(
			rewriteSelector(
				'& > div:not(:where([popover], dialog, style, script, template, link, noscript))',
			).after,
		).toBeNull();
	});

	it('merges the wide terms into a guard that still lists the non-rendered tags, keeping them', () => {
		expect(
			rewriteSelector(
				'& div:not(:where([popover], dialog, style, script, template, link, noscript))',
			).after,
		).toBe(
			'& div:not(:where([popover], dialog, [popover] *, dialog *, style, script, template, link, noscript))',
		);
	});

	it('preserves a term the author added that is not part of the canonical list, after the canonical terms', () => {
		expect(rewriteSelector('& > *:not(:where(dialog, .keep))').after).toBe(
			'& > *:not(:where([popover], dialog, .keep))',
		);
	});

	describe('merging is a fixed point', () => {
		/**
		 * ESLint runs `--fix` up to ten passes, so a merge whose output the next pass does not
		 * recognise as a complete guard lands a second guard in source. The next pass must see
		 * any superset of the required terms, in any order, as already guarded.
		 */
		const nonCanonical = [
			/* The transform's own narrow guard, sitting in descendant position. */
			'& div:not(:where([popover], dialog))',
			/* Hand-written, reversed order. */
			'& > *:not(:where(dialog, [popover]))',
			/* An author term in the middle. */
			'& > div:not(:where([popover], dialog, .foo))',
			/* A wide guard on a child position, which needs only the narrow terms. */
			'& > div:not(:where([popover], dialog, [popover] *, dialog *))',
			/* Inside an anchored :has() argument. */
			'.x:has(> div:not(:where(dialog, [popover], .foo)))',
			/* Partial guards, which merge on the first pass. */
			'& > *:not(:where(.foo, dialog))',
			'.x:has(> div:not(:where(dialog, .foo)))',
			/* A guard that still lists the non-rendered tags, in descendant position. */
			'& div:not(:where([popover], dialog, style, script, template, link, noscript))',
		];

		it.each(nonCanonical)('a second pass over %s adds nothing', (input) => {
			const first = rewriteSelector(input);
			const once = first.after ?? input;
			const second = rewriteSelector(once);

			expect(second.after).toBeNull();
			expect(second.guardCount).toBe(0);
			expect(once.match(/:not\(:where\(/g)).toHaveLength(1);
		});

		it('writes the canonical order when it merges, with author terms last', () => {
			expect(rewriteSelector('& > *:not(:where(.foo, dialog))').after).toBe(
				'& > *:not(:where([popover], dialog, .foo))',
			);
			expect(rewriteSelector('& div:not(:where([popover], dialog))').after).toBe(
				'& div:not(:where([popover], dialog, [popover] *, dialog *))',
			);
		});

		it('leaves a wide guard alone on a position that needs only the narrow terms', () => {
			const result = rewriteSelector(
				'& > div:not(:where([popover], dialog, [popover] *, dialog *))',
			);

			expect(result.after).toBeNull();
			expect(result.guardCount).toBe(0);
		});
	});

	it('leaves a :not(:where(…)) that is not a guard alone', () => {
		expect(rewriteSelector('& > *:not(:where(.foo))').after).toBe(
			'& > *:not(:where(.foo)):not(:where([popover], dialog))',
		);
	});

	it('does not try to merge terms into the :only-child form’s own :not(:where(:nth-last-child(…))) tail', () => {
		/**
		 * The landed form carries a `:not(:where(…))` whose content is a positional pseudo, not an
		 * element exclusion list. The merge must not reach into it and append the seven terms.
		 * Feeding the form back in now refuses on the `of` clause first, so the assertion is that
		 * it refuses rather than emits — the corrupted output would have been an emission.
		 */
		const landed =
			'& > :nth-child(1 of :not(:where([popover], dialog, style, script, template, link, noscript))):not(:where(:nth-last-child(n+2 of :not(:where([popover], dialog, style, script, template, link, noscript)))))';
		const result = rewriteSelector(landed);

		expect(result.after).toBeNull();
		expect(result.population).toBe('residue');
	});

	describe('families that must be refused rather than merged', () => {
		it('refuses a host-term :not() with no :where() around it', () => {
			const result = rewriteSelector('& > div:not([popover])');

			expect(result.population).toBe('residue');
			expect(result.reason).toMatch(/no `:where\(\)`/);
		});

		it('refuses the editor’s list, which mixes rendered elements into the exclusion', () => {
			const result = rewriteSelector(
				'& > *:not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)',
			);

			expect(result.population).toBe('residue');
			expect(result.reason).toMatch(/hand edit/);
		});

		it('refuses an of-argument that is not the guard, which is the editor’s other shape', () => {
			const result = rewriteSelector(
				'& > *:nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))',
			);

			expect(result.population).toBe('residue');
			expect(result.reason).toMatch(/`of` argument/);
		});

		it('refuses the site whose test asserts its exact output', () => {
			/* A test asserts `toContain('> div:not([popover]){')`, so a rewrite here breaks that
			 * test from a direction snapshot handling does not expect. */
			const result = rewriteSelector('> div:not([popover])');

			expect(result.population).toBe('residue');
			expect(result.reason).toMatch(/no `:where\(\)`/);
		});
	});
});

describe('navigation-system page-layout root.tsx — the confirmed hand edit', () => {
	/**
	 * `platform/packages/design-system/navigation-system/src/ui/page-layout/root.tsx`
	 *
	 * Line 74 (flag on) and line 63 (flag off) must behave identically. Line 63 is (0,1,0) and
	 * is the neutral target; line 74 is (0,2,1) and so cannot be brought to it by any
	 * specificity-neutral transform. The transform refuses line 74 and it is hand edited to
	 * `> :not([data-layout-slot]):not(:where(dialog, [popover]))`. Line 63 is a plain guardable
	 * rewrite.
	 */
	const lineSeventyFour = '> :not([data-layout-slot]):not(dialog):not([popover])';
	const lineSixtyThree = '> :not([data-layout-slot])';

	it('line 74 is (0,2,1) and is refused, because the neutral target is (0,1,0)', () => {
		const result = rewriteSelector(lineSeventyFour);

		expect(result.specificityBefore).toEqual([0, 2, 1]);
		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
		expect(result.reason).toMatch(/no `:where\(\)`|hand edit/);
	});

	it('the hand-edit target matches the flag-off twin at (0,1,0)', () => {
		const handEdited = '> :not([data-layout-slot]):not(:where(dialog, [popover]))';

		expect(rewriteSelector(lineSixtyThree).specificityBefore).toEqual([0, 1, 0]);
		expect(rewriteSelector(handEdited).specificityBefore).toEqual([0, 1, 0]);
	});

	it('line 63 is rewritten by the transform', () => {
		const result = rewriteSelector(lineSixtyThree);

		expect(result.population).toBe('guardable');
		expect(result.after).toBe('> :not([data-layout-slot]):not(:where([popover], dialog))');
		expect(result.guardCount).toBe(1);
		expect(result.specificityBefore).toEqual([0, 1, 0]);
		expect(result.specificityAfter).toEqual([0, 1, 0]);
	});
});

describe('skipped — dynamic and undecidable selectors', () => {
	const skips: [string, RegExp][] = [
		['& > ${Foo}', /interpolation/],
		['& > div${suffix}', /interpolation/],
		[':has(${SEL})', /`:has\(\)` argument contains a template-literal interpolation/],
		['& > #{$foo}', /interpolation/],
		['& > div:has(button', /unterminated/],
		['& > [data-foo="a"', /unterminated/],
		['   ', /empty/],
	];

	it.each(skips)('%s is skipped', (selector, reasonPattern) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('skipped');
		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
		expect(result.reason).toMatch(reasonPattern);
	});

	it('never guesses at a dynamic selector', () => {
		for (const [selector] of skips) {
			expect(rewriteSelector(selector).after).toBeNull();
		}
	});

	it('does not treat a quoted bracket as unbalanced', () => {
		expect(rewriteSelector('& > [data-foo="]"]').population).not.toBe('skipped');
	});

	describe('says why it skipped, so a caller can word its report', () => {
		it.each(['& > ${Foo}', '& > div${suffix}', ':has(${SEL})', '& > #{$foo}'])(
			'%s is dynamic: the text is not statically known',
			(selector) => {
				expect(rewriteSelector(selector).skipCause).toBe('dynamic');
			},
		);

		it.each(['& > div:has(button', '& > [data-foo="a"', '   ', '& > div['])(
			'%s is malformed: the text is known but is not a selector',
			(selector) => {
				const result = rewriteSelector(selector);

				expect(result.population).toBe('skipped');
				expect(result.skipCause).toBe('malformed');
			},
		);

		it('is absent from every other population', () => {
			for (const selector of ['& > div', '& > span', '& > div:empty', '*']) {
				expect(rewriteSelector(selector).skipCause).toBeUndefined();
			}
		});
	});
});

describe('excluded — nothing to do', () => {
	const exclusions = ['& > .foo', '&', '& > span', '& > span > span', '& > #id > span'];

	it.each(exclusions)('%s is excluded with a reason', (selector) => {
		const result = rewriteSelector(selector);

		expect(result.population).toBe('excluded');
		expect(result.after).toBeNull();
		expect(result.reason).toBeTruthy();
	});

	it('a propagating pseudo on its own is reported but not queued for triage', () => {
		const result = rewriteSelector('&:hover');

		expect(result.population).toBe('excluded');
		expect(result.reason).toMatch(/:hover/);
	});
});

describe('plain CSS selectors, not just nested authoring', () => {
	it('rewrites a plain descendant selector', () => {
		expect(rewriteSelector('.wrapper div').after).toBe(
			'.wrapper div:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('reports a plain positional selector without a fix, as it does in a style object', () => {
		/**
		 * A `.css` file is not compiled by `@compiled/react`, so its `of S` rewrite would extract
		 * fine — but the transform has one behaviour for every caller, and the codemod that sweeps
		 * `.css` files is the same one that sweeps the style objects. If that ever needs splitting,
		 * it needs to be an explicit opt-in rather than two divergent copies of the rewrite.
		 */
		const result = rewriteSelector('.list > li:first-child');

		expect(result.population).toBe('residue');
		expect(result.after).toBeNull();
	});

	it('handles a selector list', () => {
		const result = rewriteSelector('.a > div, .b > div');

		expect(result.guardCount).toBe(2);
		expect(result.after).toBe(
			'.a > div:not(:where([popover], dialog)), .b > div:not(:where([popover], dialog))',
		);
	});

	it('normalises combinator whitespace', () => {
		expect(rewriteSelector('&>div').after).toBe('& > div:not(:where([popover], dialog))');
	});
});

describe('the result contract', () => {
	it('always echoes the input as before', () => {
		expect(rewriteSelector('  & > div  ').before).toBe('  & > div  ');
	});

	it('sets after only for a guardable rewrite', () => {
		expect(rewriteSelector('& > div').after).not.toBeNull();
		expect(rewriteSelector('& > span').after).toBeNull();
		expect(rewriteSelector('& > div:empty').after).toBeNull();
		expect(rewriteSelector('& > ${x}').after).toBeNull();
	});

	it('reports both damage modes when both apply and a rewrite is emitted', () => {
		/**
		 * `& > div > *:first-child` used to be the two-mode case, and it is now refused whole for
		 * the `of` clause — a refusal carries no damage modes, because nothing was written. The
		 * `popover-receives` / `real-element-loses` split survives on the adjacent-sibling forms,
		 * which need no `of` clause.
		 */
		const result = rewriteSelector('& > div + div');

		expect(result.damageModes).toEqual(['popover-receives']);
		expect(result.guardCount).toBe(2);
		expect(result.reason).toMatch(/between/);

		const refused = rewriteSelector('& > div > *:first-child');

		expect(refused.damageModes).toEqual([]);
		expect(refused.guardCount).toBe(0);
	});

	it('gives every non-guardable population a reason', () => {
		for (const selector of ['& > span', '& > div:empty', '& > ${x}']) {
			expect(rewriteSelector(selector).reason).toBeTruthy();
		}
	});

	it('is pure — the same input gives the same result', () => {
		expect(rewriteSelector('& > div > div')).toEqual(rewriteSelector('& > div > div'));
	});

	it('never reports `real-element-loses`, because no rewrite that closes it is emitted', () => {
		for (const selector of ['& > div + div', '& > *', '& div', '.x:has(button)']) {
			expect(rewriteSelector(selector).damageModes).not.toContain('real-element-loses');
		}
	});
});

describe('nested scope — a branch with no `&` is scoped to the component', () => {
	/**
	 * Inside a style object or a `css` template the authoring API prepends `&` to a branch that
	 * has none: a branch opening with a pseudo attaches to the parent (`:hover` is `&:hover`),
	 * anything else is a descendant (`span` is `& span`). Verified against `@compiled/css`, which
	 * emits `._x:hover` and `._x *` for `:hover` and `*`. So the `&`-less spelling must reach
	 * exactly the verdict its `&` spelling reaches, with the author's spelling preserved.
	 */
	const nested = { scope: 'nested' } as const;

	const pairs: [string, string][] = [
		[':hover', '&:hover'],
		[':active', '&:active'],
		[':focus-visible', '&:focus-visible'],
		[':disabled', '&:disabled'],
		['::before', '&::before'],
		['*', '& *'],
		['span', '& span'],
		['div', '& div'],
		['.item', '& .item'],
		['> *', '& > *'],
		['> div', '& > div'],
		['div > span', '& div > span'],
		[':first-child', '&:first-child'],
		['*:first-child', '& *:first-child'],
		['.x:has(button, a)', '& .x:has(button, a)'],
	];

	it.each(pairs)('%s reaches the same verdict as %s', (bare, explicit) => {
		const fromBare = rewriteSelector(bare, undefined, nested);
		const fromExplicit = rewriteSelector(explicit, undefined, nested);

		expect(fromBare.population).toBe(fromExplicit.population);
		expect(fromBare.guardCount).toBe(fromExplicit.guardCount);
		expect(fromBare.damageModes).toEqual(fromExplicit.damageModes);
		expect(fromBare.reason).toBe(fromExplicit.reason);
	});

	it('preserves the `&`-less spelling in the output', () => {
		expect(rewriteSelector('span', undefined, nested).after).toBe(
			'span:not(:where([popover], dialog, [popover] *, dialog *))',
		);
		expect(rewriteSelector('> *', undefined, nested).after).toBe(
			'> *:not(:where([popover], dialog))',
		);
		expect(rewriteSelector('*', undefined, nested).after).toBe(
			'*:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('does not guard a pseudo-only branch, which is the `&` compound', () => {
		for (const selector of [':focus-visible', '::before', ':disabled', ':hover', ':active']) {
			const result = rewriteSelector(selector, undefined, nested);

			expect(result.after).toBeNull();
			expect(result.guardCount).toBe(0);
			expect(result.population).toBe('excluded');
		}
	});

	it('does not treat a nested universal as a global reset', () => {
		/* `& *` did not reach a portalled host pre-flag, so guarding it restores the pre-flag rendering. */
		const result = rewriteSelector('*', { boxSizing: 'inherit' }, nested);

		expect(result.population).toBe('guardable');
		expect(result.after).not.toBeNull();
		expect(result.reason).toBeUndefined();
	});

	it('scopes each branch of a list independently', () => {
		expect(rewriteSelector('& > div, span', undefined, nested).after).toBe(
			'& > div:not(:where([popover], dialog)), span:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('leaves a branch with an explicit `&` anywhere in it untouched', () => {
		expect(rewriteSelector('html &', undefined, nested).after).toBeNull();
		expect(rewriteSelector('.x:has(&)', undefined, nested).reason).toMatch(/self-referential/);
	});

	it('is idempotent under nested scope too', () => {
		for (const selector of ['*', 'span', '> *', 'div > span', '.x:has(button, a)']) {
			const once = rewriteSelector(selector, undefined, nested).after;
			expect(once).not.toBeNull();
			const twice = rewriteSelector(once ?? '', undefined, nested);
			expect(twice.after).toBeNull();
			expect(twice.guardCount).toBe(0);
		}
	});

	it('is the global reading by default', () => {
		expect(rewriteSelector('*').population).toBe('residue');
		expect(rewriteSelector('span').population).toBe('excluded');
		expect(rewriteSelector('*', undefined, { scope: 'global' }).population).toBe('residue');
	});
});

describe('an `&` inside `:is()` or `:where()` is read as the `&` it spells', () => {
	const nested = { scope: 'nested' } as const;

	it.each([':is(&) > div', ':where(&) > div', ':is(&, .x) > div'])(
		'%s guards only the div, as & > div does',
		(selector) => {
			const result = rewriteSelector(selector, undefined, nested);

			expect(result.guardCount).toBe(1);
			expect(result.after).toBe(
				`${selector.slice(0, -' > div'.length)} > div:not(:where([popover], dialog))`,
			);
		},
	);

	it('leaves :is(& > span) alone, as & > span is', () => {
		const result = rewriteSelector(':is(& > span)', undefined, nested);

		expect(result.after).toBeNull();
		expect(result.population).toBe('excluded');
	});

	it('guards :is(& > div) with the narrow form, as & > div is', () => {
		expect(rewriteSelector(':is(& > div)', undefined, nested).after).toBe(
			':is(& > div):not(:where([popover], dialog))',
		);
	});

	it('guards :is(& span) with the wide form, as & span is', () => {
		expect(rewriteSelector(':is(& span)', undefined, nested).after).toBe(
			':is(& span):not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('still guards :not(&), which matches every element except the author’s own', () => {
		const after = rewriteSelector(':not(&) > div', undefined, nested).after ?? '';

		expect(after).toMatch(/^:not\(&\):not\(:where\(\[popover\]/);
	});

	it('is idempotent', () => {
		for (const selector of [':is(&) > div', ':is(& > div)', ':is(& span)']) {
			const once = rewriteSelector(selector, undefined, nested).after;
			expect(once).not.toBeNull();
			expect(rewriteSelector(once ?? '', undefined, nested).after).toBeNull();
		}
	});
});

describe('an existing guard is recognised whatever its letter case', () => {
	it('adds nothing to a complete guard spelled in uppercase, even with the old longer list', () => {
		const result = rewriteSelector(
			'& > DIV:not(:where([POPOVER], DIALOG, STYLE, SCRIPT, TEMPLATE, LINK, NOSCRIPT))',
		);

		expect(result.after).toBeNull();
		expect(result.guardCount).toBe(0);
	});

	it('merges a partial uppercase guard up to the canonical terms without duplicating them', () => {
		expect(rewriteSelector('& > div:not(:where([POPOVER]))').after).toBe(
			'& > div:not(:where([popover], dialog))',
		);
	});
});

describe('html and body are never guarded', () => {
	const nested = { scope: 'nested' } as const;

	it('guards only the div of body div', () => {
		expect(rewriteSelector('body div', undefined, nested).after).toBe(
			'body div:not(:where([popover], dialog, [popover] *, dialog *))',
		);
	});

	it('guards only the div of html > body > div', () => {
		expect(rewriteSelector('html > body > div', undefined, nested).after).toBe(
			'html > body > div:not(:where([popover], dialog))',
		);
	});
});
