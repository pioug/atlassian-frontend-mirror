# Does the in-argument `:has()` guard hold? — browser verification of the 282-line claim

**Status:** closed question, answered by measurement in real Chromium 143.0.7499.4. **Verdict:** the
claim **partly holds**. The descendant case — the one flagged as most likely to break it — **is**
handled, because §0.2's guard set already contains the ancestor-form terms `[popover] *`,
`dialog *`, and Chromium confirms they work. But three shapes the classifier treats as
`codemod-able` are **not** fixable in-argument, and one of them is a real population: **rows
carrying a propagating state pseudo (`:hover` / `:focus-within` / `:active`) inside the `:has()`
argument**, where the guard target is a real ancestor of the host, not the host. That is a **hazard
class the plan has not named anywhere** (§4.2 below). A counter-correction runs the other way (21
rows the classifier over-counted as judgement), so the net movement on the headline number is small:

> **505 + 15 + 1 − 21 = 500.** Not 787, and not 520 either — see the ledger in §5.0.

---

## 1. The claim under test

From [`residue-classification.md`](./residue-classification.md), the `:has()` rewrite table:

> | descendant-reaching `A` | append `:not(:where([popover], dialog, [popover] *, dialog *, …))` to
> the rightmost compound of every top-level branch — §0.2 already specifies this descendant form |
> 282 |

The referenced guard-form rule — Step 1 of
[`../unsafe-selectors-plan.md`](../unsafe-selectors-plan.md) — is: _"Descendant rules must also
exclude the subtree: `[popover] *`, `dialog *`."_

Two things follow, and the distinction is the whole result:

- **Narrow guard** = §0.2's base `S` alone —
  `:not(:where([popover], dialog, style, script, template, link, noscript))`.
- **Wide guard** = `S` **plus the subtree terms** —
  `:not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *))`.

The classification's 282-line row claims the **wide** form. A reading of the claim that uses only
the narrow form is a strawman: it fails on every descendant shape (verified below, C4–C8), which is
exactly why §0.2 carries the extra sentence.

---

## 2. Method

`element.matches(selector)` evaluated in Chromium against a **flag-off DOM** (`before`: surface
portalled to `document.body`, outside `E`) and a **flag-on DOM** (`after`: `<div popover>` /
`<dialog>` host inserted in place under `E`), for three selector variants: unguarded,
narrow-guarded, wide-guarded.

A guard **holds** iff `before === after` (invariant to insertion) **and**
`after === before-unguarded` (it preserves the flag-off answer). Reporting only invariance would
score a guard that pins the selector to the wrong constant as a pass.

jsdom was not used: it cannot evaluate `of S` at all and is unreliable for `:has()`.

### Command

```bash
# repo root; the platform Chromium build ships with playwright at the AFM root
cd /Users/areardon/atlassian/afm/master
OPENSSL_CONF=/dev/null node has-guard-fixture.mjs      # rounds 1 (C*) and 2 (D*)
```

Two environment notes for anyone re-running this:

- Chromium must be launched **outside** the Claude Code bash sandbox. `chrome-headless-shell` reads
  AppKit appearance resources under `/System`, which the sandbox deny-lists, and aborts with
  `NSInternalInconsistencyException … required built-in appearance SystemAppearance not found`.
- `OPENSSL_CONF=/dev/null` is needed for the same reason (node tries to read
  `/System/Library/OpenSSL/openssl.cnf`). This also applies to `classify-residue.mjs`.

### Fixture

```js
import { chromium } from '<afm-root>/node_modules/playwright/index.mjs';

const NARROW = ':not(:where([popover], dialog, style, script, template, link, noscript))';
const WIDE =
	':not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *))';

// hosts exactly as @atlaskit/top-layer renders them: popover.tsx:401 / dialog-content.tsx:273,
// with the surface div wrapping children (so for `> X` only the host element itself is a candidate)
const POP = `<div popover id="host"><div class="surface"><span class="foo">f</span><span class="baz">z</span></div></div>`;
const DLG = `<dialog id="host"><div class="surface"><span class="foo">f</span><span class="baz">z</span></div></dialog>`;
// flag-off equivalent: same surface, portalled to document.body, OUTSIDE #e
const PORTAL = `<div id="portal"><div class="surface"><span class="foo">f</span><span class="baz">z</span></div></div>`;

const STYLE = `<style>
  #host, #portal { position: fixed; top: 10px; left: 10px; width: 120px; height: 60px;
                   margin: 0; padding: 0; border: 0; background: #ccc; }
  #e { position: fixed; top: 300px; left: 300px; width: 120px; height: 60px; background: #eee; }
</style>`;

const CASES = [
	// --- direct-child argument: the host element itself is the only candidate ---------------
	{ id: 'C1', sel: (g) => `#e:has(> div${g})`,
	  before: `<div id="e"><span class="t">t</span></div>`,
	  after:  `<div id="e"><span class="t">t</span>${POP}</div>` },
	{ id: 'C2', sel: (g) => `#e:has(> *${g})`,
	  before: `<div id="e">text</div>`, after: `<div id="e">text${POP}</div>` },
	{ id: 'C3', sel: (g) => `#e:has(> [data-testid="tip"]${g})`,
	  before: `<div id="e"><span class="t">t</span></div>`,
	  after:  `<div id="e"><span class="t">t</span><div popover id="host" data-testid="tip"><div class="surface"></div></div></div>` },

	// --- descendant argument: THE CRUX ------------------------------------------------------
	{ id: 'C4', sel: (g) => `#e:has(.foo${g})`,
	  before: `<div id="e"><span class="t">t</span></div>${PORTAL}`,
	  after:  `<div id="e"><span class="t">t</span>${POP}</div>` },
	{ id: 'C5', sel: (g) => `#e:has(.a .foo${g})`,
	  before: `<div id="e"><div class="a"><span class="t">t</span></div></div>${PORTAL}`,
	  after:  `<div id="e"><div class="a"><span class="t">t</span>${POP}</div></div>` },
	{ id: 'C6', sel: (g) => `#e:has(> .a .foo${g})`,   /* same DOM as C5 */ },
	{ id: 'C7', sel: (g) => `#e:has(.foo${g})`,        /* host nested 3 levels deep under #e */
	  before: `<div id="e"><div><div><span class="t">t</span></div></div></div>${PORTAL}`,
	  after:  `<div id="e"><div><div><span class="t">t</span>${POP}</div></div></div>` },
	{ id: 'C8', sel: (g) => `#e:has(.foo${g})`,        /* <dialog> host: DLG instead of POP */ },

	// --- sibling combinator in the argument -------------------------------------------------
	{ id: 'C9',  sel: (g) => `#e:has(+ .foo${g})`,
	  before: `<div id="p"><div id="e"></div><div class="foo"></div></div>`,
	  after:  `<div id="p"><div id="e"></div>${POP}<div class="foo"></div></div>` },
	{ id: 'C10', sel: (g) => `#e:has(~ .foo${g})`,     /* same DOM as C9 */ },
	{ id: 'C11', sel: (g) => `#e:has(~ div${g})`,      /* host itself matches the argument */
	  before: `<div id="p"><div id="e"></div><span class="t"></span></div>`,
	  after:  `<div id="p"><div id="e"></div>${POP}<span class="t"></span></div>` },
	{ id: 'C12', sel: (g) => `#e:has(span + span${g})`,
	  before: `<div id="e"><span class="a"></span><span class="b"></span></div>`,
	  after:  `<div id="e"><span class="a"></span>${POP}<span class="b"></span></div>` },

	// --- positional pseudo inside the argument: the `of S` rewrite one level down -----------
	{ id: 'C13', sel: (g) => g === '' ? `#e:has(> .foo:last-child)`
	                                  : `#e:has(> .foo:nth-last-child(1 of ${g}))`,
	  before: `<div id="e"><span class="t"></span><div class="foo"></div></div>`,
	  after:  `<div id="e"><span class="t"></span><div class="foo"></div>${POP}</div>` },
	{ id: 'C14', sel: (g) => g === '' ? `#e:has(.list > .foo:last-child)`
	                                  : `#e:has(.list > .foo:nth-last-child(1 of ${g}))`,
	  before: `<div id="e"><div class="list"><span class="t"></span><b class="foo"></b></div></div>`,
	  after:  `<div id="e"><div class="list"><span class="t"></span><b class="foo"></b>${POP}</div></div>` },

	// --- :not() / :has() nesting -----------------------------------------------------------
	{ id: 'C15', sel: (g) => `#e:not(:has(.foo${g}))`,        /* same DOM as C4 */ },
	{ id: 'C16', sel: (g) => `#e:has(:not(.bar)${g})`,
	  before: `<div id="e"><span class="bar"></span></div>`,
	  after:  `<div id="e"><span class="bar"></span>${POP}</div>` },
	{ id: 'C17', sel: (g) => `#e:has(.a:not(:has(.b))${g})`,  /* validity probe */
	  before: `<div id="e"><div class="a"></div></div>`,
	  after:  `<div id="e"><div class="a">${POP}</div></div>` },

	// --- comma list: per-branch append is load-bearing --------------------------------------
	{ id: 'C18', sel: (g) => `#e:has(.foo, .other${g})`,      /* guard on LAST branch only */
	  before: `<div id="e"><span class="t"></span></div>${PORTAL}`,
	  after:  `<div id="e"><span class="t"></span>${POP}</div>` },
	{ id: 'C19', sel: (g) => `#e:has(.foo${g}, .other${g})`,  /* guard on EVERY branch */ },

	// --- state pseudos in the argument ------------------------------------------------------
	{ id: 'C20', sel: (g) => `#e:has(:focus-visible${g})`, act: 'focus',
	  before: `<div id="e"><span class="t">t</span></div><div id="portal"><div class="surface"><input id="inp"></div></div>`,
	  after:  `<div id="e"><span class="t">t</span><div popover id="host"><div class="surface"><input id="inp"></div></div></div>` },
	{ id: 'C21', sel: (g) => `#e:has(.a:focus-within${g})`, act: 'focus',
	  before: `<div id="e"><div class="a"><span class="t">t</span></div></div><div id="portal"><div class="surface"><input id="inp"></div></div>`,
	  after:  `<div id="e"><div class="a"><span class="t">t</span><div popover id="host"><div class="surface"><input id="inp"></div></div></div></div>` },
	{ id: 'C22', sel: (g) => `#e:has(.a:focus-within${g})`, act: 'focus-dialog',
	  after:  `<div id="e"><div class="a"><span class="t">t</span><dialog id="host"><div class="surface"><input id="inp"></div></dialog></div></div>` },
	{ id: 'C23', sel: (g) => `#e:has(.a:hover${g})`, act: 'hover',
	  before: `<div id="e"><div class="a"><span class="t">t</span></div></div><div id="portal"><div class="surface">s</div></div>`,
	  after:  `<div id="e"><div class="a"><span class="t">t</span><div popover id="host"><div class="surface">s</div></div></div></div>` },

	// --- is the guard a flag-off no-op? (no host inserted at all) ---------------------------
	{ id: 'C24', sel: (g) => `#e:has(.foo${g})`,
	  before: `<div id="e"><dialog open><span class="foo"></span></dialog></div>`, after: /* identical */ },
	{ id: 'C25', sel: (g) => `#e:has(.foo${g})`,
	  before: `<div id="e"><button class="t">t<span popover="hint"><span class="foo"></span></span></button></div>`,
	  after: /* identical */ },

	// --- round 2 ----------------------------------------------------------------------------
	{ id: 'D1', sel: (g) => `#e:has(span + span${g})`,   /* as C12 but host surface has NO span pair */
	  after: `<div id="e"><span class="a"></span><div popover id="host"><div class="surface"><span class="foo">f</span></div></div><span class="b"></span></div>` },
	{ id: 'D2', sel: (g) => `#e:has(~ .a .foo${g})`,     /* leading ~, host lands INSIDE .a */
	  before: `<div id="p"><div id="e"></div><div class="a"><span class="t"></span></div></div>${PORTAL}`,
	  after:  `<div id="p"><div id="e"></div><div class="a"><span class="t"></span>${POP}</div></div>` },
	{ id: 'D3', sel: (g) => `#e:has(~ .a .foo${g})`,     /* leading ~, host BETWEEN E and .a */
	  before: `<div id="p"><div id="e"></div><div class="a"><span class="foo"></span></div></div>`,
	  after:  `<div id="p"><div id="e"></div>${POP}<div class="a"><span class="foo"></span></div></div>` },
	{ id: 'D4', sel: (g) => `#e:not(:has(~ [data-x]${g}))`,   /* Toolbar.tsx:66 shape */
	  before: `<div id="p"><div id="e"></div><span class="t"></span></div>`,
	  after:  `<div id="p"><div id="e"></div>${POP}<span class="t"></span></div>` },
	{ id: 'D5', sel: (g) => `#e:has(:focus-within${g})`, act: 'focus',  /* host = DIRECT child of E */
	  before: `<div id="e"><span class="t"></span></div><div id="portal"><input id="inp"></div>`,
	  after:  `<div id="e"><span class="t"></span><div popover id="host"><input id="inp"></div></div>` },
	{ id: 'D6', sel: (g) => `#e:has(:focus-within${g})`, act: 'focus',  /* host ONE real div deeper */
	  before: `<div id="e"><div class="mid"><span class="t"></span></div></div><div id="portal"><input id="inp"></div>`,
	  after:  `<div id="e"><div class="mid"><span class="t"></span><div popover id="host"><input id="inp"></div></div></div>` },
	{ id: 'D7', sel: (g) => `#e:has(.a:active${g})`, act: 'press',      /* DOM as C23 */ },
	{ id: 'D8', sel: (g) => `#e:has(.foo${g})`,   /* flag-off ALREADY inline under E (shouldRenderToParent) */
	  before: `<div id="e"><span class="t"></span><div class="surface"><span class="foo">f</span></div></div>`,
	  after:  `<div id="e"><span class="t"></span>${POP}</div>` },
	{ id: 'D9', sel: (g) => `#e:has(span + span${g})`,  /* as C12: host surface DOES contain a span pair */ },
];

// runner
const run = async (page, body, sels, act) => {
	await page.setContent(`<!doctype html><html><body>${STYLE}${body}</body></html>`);
	if (act === 'focus') {
		await page.evaluate(() => {
			const h = document.getElementById('host');
			if (h?.hasAttribute('popover')) h.showPopover();
			document.getElementById('inp')?.focus();
		});
	} else if (act === 'focus-dialog') {
		await page.evaluate(() => {
			document.getElementById('host')?.showModal?.();
			document.getElementById('inp')?.focus();
		});
	} else if (act === 'hover' || act === 'press') {
		await page.evaluate(() => document.getElementById('host')?.showPopover?.());
		await page.mouse.move(60, 35); // inside the #host / #portal box
		if (act === 'press') await page.mouse.down();
	}
	return page.evaluate(
		(sels) => sels.map((s) => { try { return document.querySelector('#e').matches(s); } catch { return 'INVALID'; } }),
		sels,
	);
};

const browser = await chromium.launch();
const page = await browser.newPage();
for (const c of CASES) {
	const sels = ['', NARROW, WIDE].map(c.sel);
	const before = await run(page, c.before, sels, c.act);
	const after = await run(page, c.after, sels, c.act);
	console.log(c.id, { before, after,
		narrowHolds: before[1] === after[1] && after[1] === before[0],
		wideHolds:   before[2] === after[2] && after[2] === before[0] });
}
await browser.close();
```

---

## 3. Truth table — Chromium 143.0.7499.4

`b→a` is `before → after`. `T`/`F` = matches / does not match; `INV` = selector rejected by the
parser. **narrow** / **wide** = does that guard hold (invariant **and** flag-off-preserving)?

| id  | argument shape                                            | unguarded | narrow  | wide    | narrow |    wide    |
| --- | --------------------------------------------------------- | --------- | ------- | ------- | :----: | :--------: |
| C1  | `:has(> div)` — host tag matches                          | F→**T**   | F→F     | F→F     |   ok   |     ok     |
| C2  | `:has(> *)`                                               | F→**T**   | F→F     | F→F     |   ok   |     ok     |
| C3  | `:has(> [data-testid])` — consumer attr on host           | F→**T**   | F→F     | F→F     |   ok   |     ok     |
| C4  | `:has(.foo)` — **descendant**, `.foo` in host subtree     | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C5  | `:has(.a .foo)` — real `.a` is host's ancestor            | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C6  | `:has(> .a .foo)` — child then descendant                 | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C7  | `:has(.foo)` — host nested 3 levels under `E`             | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C8  | `:has(.foo)` — `<dialog>` host                            | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C9  | `:has(+ .foo)` — host inserted between `E` and `.foo`     | T→**F**   | T→F     | T→F     |  FAIL  |  **FAIL**  |
| C10 | `:has(~ .foo)` — host inserted between                    | T→T       | T→T     | T→T     |   ok   |     ok     |
| C11 | `:has(~ div)` — host itself matches                       | F→**T**   | F→F     | F→F     |   ok   |     ok     |
| C12 | `:has(span + span)` — adjacency inside the argument       | T→T\*     | T→T\*   | T→**F** |  ok\*  | **FAIL\*** |
| C13 | `:has(> .foo:last-child)` → `:nth-last-child(1 of S)`     | T→**F**   | T→T     | T→T     |   ok   |     ok     |
| C14 | `:has(.list > .foo:last-child)` → `… of S`                | T→**F**   | T→T     | T→T     |   ok   |     ok     |
| C15 | `:not(:has(.foo))` — guard inside the wrapping `:not()`   | T→**F**   | T→**F** | T→T     |  FAIL  |   **ok**   |
| C16 | `:has(:not(.bar))` — guard appended to `:not()`           | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C17 | `:has(.a:not(:has(.b)))` — nested `:has()`                | INV       | INV     | INV     |   —    |     —      |
| C18 | `:has(.foo, .other)` — guard on **last branch only**      | F→**T**   | F→**T** | F→**T** |  FAIL  |  **FAIL**  |
| C19 | `:has(.foo, .other)` — guard on **every branch**          | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C20 | `:has(:focus-visible)` — focus inside the host            | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| C21 | `:has(.a:focus-within)` — `.a` is a **real ancestor**     | F→**T**   | F→**T** | F→**T** |  FAIL  |  **FAIL**  |
| C22 | `:has(.a:focus-within)` — `<dialog>` `showModal()`        | F→**T**   | F→**T** | F→**T** |  FAIL  |  **FAIL**  |
| C23 | `:has(.a:hover)` — mouse over top-layer host content      | F→**T**   | F→**T** | F→**T** |  FAIL  |  **FAIL**  |
| C24 | `:has(.foo)` — **no host**; `.foo` in consumer `<dialog>` | T→T       | T→T     | **F→F** |   ok   |  **FAIL**  |
| C25 | `:has(.foo)` — **no host**; `.foo` in `popover="hint"`    | T→T       | T→T     | **F→F** |   ok   |  **FAIL**  |
| D1  | `:has(span + span)` — host surface has no span pair       | T→**F**   | T→F     | T→F     |  FAIL  |  **FAIL**  |
| D2  | `:has(~ .a .foo)` — host lands inside `.a`'s subtree      | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| D3  | `:has(~ .a .foo)` — host between `E` and `.a`             | T→T       | T→T     | T→T     |   ok   |     ok     |
| D4  | `:not(:has(~ [data-x]))` — `Toolbar.tsx:66` shape         | T→T       | T→T     | T→T     |   ok   |     ok     |
| D5  | `:has(:focus-within)` — host is a **direct child**        | F→**T**   | F→**T** | F→F     |  FAIL  |   **ok**   |
| D6  | `:has(:focus-within)` — host **one real div deeper**      | F→**T**   | F→**T** | F→**T** |  FAIL  |  **FAIL**  |
| D7  | `:has(.a:active)` — pointer down on host content          | F→**T**   | F→**T** | F→**T** |  FAIL  |  **FAIL**  |
| D8  | `:has(.foo)` — flag-off already rendered inline (no host) | T→T       | T→T     | T→**F** |   ok   |  **FAIL**  |
| D9  | `:has(span + span)` — host surface has a span pair        | T→T\*     | T→T\*   | T→**F** |  ok\*  | **FAIL\*** |

\* **C12/D9 are a fixture artefact worth reading carefully, not a guard bug.** The host's own
surface contains two adjacent `<span>`s, so the popover _coincidentally re-satisfies_ `span + span`
after insertion — the unguarded selector looks invariant (T→T) while the real adjacency it was
written for has already been destroyed. The wide guard removes the coincidence and exposes the true
break (T→F). D1 is the clean read of the same shape: with a single-span surface the unguarded
selector goes **T→F** and no guard restores it. The classifier's verdict for this shape
(`sibling-combinator-in-argument` → judgement) is correct.

### What the table settles

1. **`of S` works inside a `:has()` argument** (C13, C14). The 1-line `nested-positional-takes-of-S`
   row is sound, and the `of S` form does not need to be re-verified at nesting depth.
2. **`:has()` cannot be nested inside a `:has()` argument** (C17 — Chromium rejects the whole
   selector). Any repair form requiring a nested `:has()` is off the table. The wide guard does not
   need one, so this is a constraint on alternatives, not on the claim.
3. **The `:not()` wrapping direction matters both ways** (C15, C16), as the doc's caveat 2 says: the
   guard must be pushed _inside_ a wrapping `:not(:has(A))`, and appended _onto_ a `:not()` that is
   itself the argument's rightmost compound.
4. **Per-branch append is load-bearing** (C18 vs C19). Guarding only the last branch of a comma list
   leaves the selector fully exposed. Also as the doc's caveat 2 says.

---

## 4. The descendant-argument analysis — the crux

**Question posed:** `&:has(.foo)` asks "is there a `.foo` anywhere below". A host inserted below
could carry a `.foo` in its own subtree, and guarding `.foo` with
`:not(:where([popover], dialog, …))` does not help, because `.foo` is not the popover — the popover
is its _ancestor_. Excluding it needs an ancestor-form term such as `[popover] *`.

**That reasoning is exactly right, and it is already what §0.2 specifies.** C4–C8 measure both
halves of it:

- the **narrow** guard fails on every descendant shape: plain descendant (C4), descendant chain with
  a real intermediate ancestor (C5), child-then-descendant (C6), host nested three levels deep (C7),
  and `<dialog>` host (C8). All five stay `F→T`;
- the **wide** guard — the same `:not(:where(…))` with `[popover] *, dialog *` added — holds on all
  five. `[popover] *` correctly excludes a match at **any** depth inside the host, whether or not
  the popover has been shown, and `dialog *` does the same for the `<dialog>` host.

So `descendantCaseHandled = true`: the classifier's rule cites the subtree terms explicitly
(`classify-residue.mjs:689-692`, "§0.2's descendant guard (`[popover] *`, `dialog *`)"), the doc's
rewrite table names them, and §0.2 mandates them. The hypothesised failure mode is real but already
covered — the 282 rows are descendant-argument cases by construction, and the guard they are
promised is the wide one.

### 4.1 The damage mode the taxonomy is missing

§0.1 enumerates exactly two ways a host can change `E:has(A)`:

> (i) the host or something in its subtree satisfies `A` relative to `E`; (ii) the host's presence
> changes whether a **real** element satisfies `A`, i.e. `A` contains a positional pseudo.

There is a **third**: the host's presence changes a **state** pseudo on a real element. `:hover`,
`:focus-within` and `:active` all propagate up the DOM ancestor chain, and a top-layer host is still
a DOM descendant of its insertion point — the top layer changes _painting_, not ancestry. So when
focus or the pointer lands inside the host, every real ancestor between the host and `E` starts
matching.

That is fatal for the in-argument guard for the same reason the narrow guard was fatal for
descendants, one level up: **the element that flips is not the popover and not inside the popover —
it is the popover's real ancestor**, so no `:not(:where(…))` appended to that compound can exclude
it. Verified at C21 (`:focus-within`, popover), C22 (`:focus-within`, `<dialog> showModal()`), C23
(`:hover` via real pointer move), D7 (`:active` via pointer down) — all `F→T` under the wide guard.

Two refinements, both measured:

- **Non-propagating state pseudos are fine.** `:focus-visible` / `:focus` match only the focused
  element, which _is_ inside the host, so the wide guard holds (C20).
- **The break is depth-dependent.** With a bare `:has(:focus-within)` and the host as a _direct
  child_ of `E` there is no real element between them, and the wide guard holds (D5). Add one real
  intermediate `div` and it breaks (D6). Insertion depth is a per-site property, so this is not
  statically decidable — which is the definition of judgement work.

One more stated principle is too strong. `:has()` "can only ever go **false → true**" holds for
descendant arguments but not in general: C9 and D1 go **true → false**, because a sibling combinator
inside the argument depends on adjacency the host destroys. The doc's _bucketing_ of those rows is
right; the justification given for it is not.

### 4.2 Named hazard class: **interaction-only `:has()` flips** (dynamic-pseudo-in-argument)

This class is not in §0.1's two damage modes, not in the residue classification, and not anywhere
else in the plan. It needs a name because it is **invisible to the entire current test strategy**.

**Definition.** A residue row is in this class when a `:has()` argument contains a **propagating**
dynamic pseudo — `:hover`, `:focus-within`, `:active`. These match the element _and its ancestors_.
A top-layer host is still a DOM descendant of its insertion point (the top layer changes painting,
not ancestry), so the moment focus or the pointer lands inside the host, **every real ancestor
between the host and `E` starts matching**, and `E:has(.a:hover)` flips. A popup containing a
focused input is the obvious trigger: the host itself carries `:focus-within`, and so does every
real element above it.

**Why no guard fixes it.** Same reason the narrow guard failed for descendants, one level up: the
element that flips is neither the host nor inside the host — it is the host's _real ancestor_. There
is nothing for `:not(:where([popover], dialog, [popover] *, dialog *))` to exclude. There is also no
`of S`-style form for a state pseudo. Verified: C21, C22, C23, D7 are all `F→T` under the wide
guard.

**Why testing cannot see it.** The flip exists only _during_ interaction — pointer held over the
surface, or focus inside it. This is the same structural blind spot as the open-state-only breakage
in ground truth #1: a static VR snapshot renders the host and photographs it, but never hovers or
focuses inside it, and a unit test asserting emitted CSS strings never evaluates a selector against
a live hover chain at all. Observing this class requires an **interaction-driven** test — a
Playwright `prepare` step that moves the mouse over / focuses into the surface and _then_ asserts,
or `snapshotInformational` with a `prepare` action (see `platform/AGENTS.md` on informational VR).
Neither regular `yarn test:vr` nor `afm test unit` can catch it, so it will not show up as a red
build; it will show up as a user report.

**Population — of the 1,149 residue rows, 19 have a propagating dynamic pseudo inside a `:has()`
argument:**

| bucket after correction                                |   rows | note                                             |
| ------------------------------------------------------ | -----: | ------------------------------------------------ |
| `needs-judgement/propagating-state-pseudo-in-argument` | **17** | the live hazard population                       |
| `deterministically-safe/comment-or-doc`                |      1 | `smart-card/…/withFrameStyleControl.tsx:8` prose |
| `deterministically-safe/generated-build-artifact`      |      1 | minified bundle                                  |

The 17 live rows are the 15 from the 282 (listed in §5.2), plus one previously mis-bucketed as
`root-scoped-has-is-invariant` (see below), plus one already in judgement as `interpolated-argument`
whose reason is now more precisely attributed. A further **27 rows carry a propagating pseudo
outside the `:has()` argument** — on the subject compound, e.g.
`'.extension-container:has([data-native-embed-alignment]):hover'` — of which 21 are `codemod-able`.
Those are outside the seven-signal taxonomy (a bare `:hover` is not a residue pattern) but they have
**exactly the same interaction-only invisibility**, and the host insertion flips them for the same
reason. Union of both: **39 distinct rows**. Anyone building the interaction-driven test set should
target all 39, not just the 17.

Non-propagating pseudos are **not** in this class: `:focus-visible` / `:focus` match only the
focused element, which is inside the host, so the wide guard holds (C20). 52 rows carry those and no
propagating pseudo — 44 of them `codemod-able`. They are safe _provided the guard is applied_.

**One correction falls out of this.** `root-scoped-has-is-invariant` ("`body:has(X)` cannot change —
whether `X` exists somewhere under `<body>` is the same either way") is sound for **existence** and
unsound for **state**. A real element's `:hover` genuinely does change when a host is inserted into
its subtree. One row is affected: `avp/…/spreadsheet-table/spreadsheet-table.tsx:83` —
`'body:has([role="slider"][aria-orientation="horizontal"]:hover) &, …:active) &, …:focus-visible) &'`.
It moves `deterministically-safe → needs-judgement`. The rule should be narrowed to "root-scoped
**and** the argument carries no propagating dynamic pseudo".

### 4.3 Transform requirement: guard **every** comma branch inside a `:has()` argument

Recording C18/C19 as a spec line for whoever writes the autofix, because it is a **codemod bug
shape, not a claim failure** — the claim is fine, an implementation that appends once is not.

`:has()` takes a selector _list_. A relative selector list matches if **any** branch matches, so
guarding only the rightmost branch leaves the selector fully exposed — the unguarded branch still
matches the host subtree and the whole `:has()` still flips.

```css
/* ✗ WRONG — guard on the last branch only; C18 measures F→T, i.e. no protection at all */
.x:has(button, a:not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *)))

/* ✓ RIGHT — guard appended to the rightmost compound of EVERY top-level branch; C19 holds */
.x:has(
  button:not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *)),
  a:not(:where([popover], dialog, style, script, template, link, noscript, [popover] *, dialog *))
)
```

**Spec lines for the transform:**

1. Split the `:has()` argument on **top-level** commas only (commas inside `()` / `[]` are not
   branch separators) and append the guard to the rightmost compound of **each** branch.
2. Push the guard **inside** a wrapping `:not(:has(A))` rather than onto the `:not()` (C15), and
   **onto** a `:not()` that is itself the argument's rightmost compound (C16).
3. Both require a real selector parser — this is the doc's caveat 2, and C18 is the failure it
   predicts. `:has(button,a)` is the minimum regression test.
4. Never emit a nested `:has()` inside a `:has()` argument: Chromium rejects the entire selector
   (C17), so the rule silently stops applying.

**Test case for the autofix suite:** input `'.x:has(button, a)'` → expected output = the ✓ form
above; assert **two** occurrences of the guard string, not one. 13 of the 282 rows have a comma
inside the `:has()` argument, so this is exercised in the real corpus, not just in theory.

### 4.4 The wide guard is not a flag-off no-op

Not a residue-counting issue, but it belongs on the record before 288 sites are rewritten. Adding
`[popover] *, dialog *` reaches into _any_ popover or dialog subtree, including ones that have
nothing to do with the top-layer migration:

- **C24** — `.foo` inside a consumer `<dialog>`: matches today, stops matching after the rewrite,
  with no host inserted and the flag off.
- **C25** — `.foo` inside an ungated `popover="hint"` tooltip. Not hypothetical: §0.2 itself names
  `editor-common/src/vanilla-tooltip/index.ts:64` (`popover = 'hint'` on the trigger) and
  `pragmatic-drag-and-drop`'s honey-pot (`popover="manual"` on `document.body`) as `[popover]`
  elements already present in flag-off DOM.
- **D8** — the surface was **already inline** under `E` in flag-off DOM. This is the
  `shouldRenderToParent` path (real: `packages/design-system/tooltip/src/types.tsx`,
  `packages/design-system/tooltip/src/tooltip.tsx`, `inline-dialog/examples/09-popup.tsx`,
  `drawer/examples/20-drawer-with-fixed-contents.tsx`). Flag-on then wraps that same content in
  `<div popover>`, and the guard now excludes content that legitimately matched before: `T→F`.

The base `S` guard is a defensible no-op-modulo-enumerated-diffs; the subtree terms are not, and
gate 3's expected-diff set has to absorb that. This is a **cost** finding, not a correctness finding
about the residue count.

---

## 5. Corrected numbers

Three corrections, in **both** directions. All were applied to a patched copy of
`classify-residue.mjs` and re-run over the full corpus, so the totals below are measured, not
arithmetic layered on the published ones. The baseline reproduces exactly first
(`1149 / 293 / 344 / 7 / 505`).

### 5.0 Ledger — and why it is not 520

The corrected total is **lower** than 505, which looks wrong if you only see Correction A. The
signed ledger:

```
  505   published needs-judgement
+  15   A.  claim failures: rows of the 282 the guard does NOT fix
             (propagating dynamic pseudo in the :has() argument)   codemod-able  → judgement
+   1   A'. `root-scoped-has-is-invariant` is unsound for state pseudos
             (body:has([role=slider]:hover))                       det-safe      → judgement
−  21   B.  leading-`~` arguments over-counted as judgement
             (`:has(~ X)` needs no adjacency — browser-verified)    judgement    → codemod-able
= 500   corrected needs-judgement
```

`Y = 21`, and it is **not** part of the 282 under test. It is an **independent** finding about a
different bucket — the 49 `needs-judgement/sibling-combinator-in-argument` rows — that fell out of
the same fixture run (D2/D3/D4). The classifier lumps `+` and `~` together; the browser shows `~`
does not break. So the number moves down even though the claim under test lost ground.

**If you want the claim-only number, it is 520** (`505 + 15`). Use 520 to price _"what does
rejecting part of the descendant-guard claim cost"_ in isolation; use **500** as the residue's
actual size, since Correction B is just as measured as Correction A and there is no principled
reason to bank one and not the other. Either way the answer to the sequencing question is unchanged:
it is nowhere near 787.

Bucket totals must still sum to 1,149, and they do: `299 + 343 + 7 + 500`.

### 5.1 What `rowsSurviving = 267` counts

Rows of the 282 for which the guard claim **holds** — i.e. still legitimately `codemod-able`
(`282 − 15 = 267`, 94.7%). It is a measure of the _claim_, not of the residue, and it moves in the
opposite direction to the residue total by construction: every row that stops surviving _adds_ to
judgement. The descendant-guard bucket itself ends up at **288**, larger than 282, because it loses
the 15 and absorbs the 21 from Correction B.

### 5.2 Correction A — `+15` to judgement

New rule `needs-judgement/propagating-state-pseudo-in-argument`: any `:has()` argument containing
`:hover`, `:focus-within` or `:active` (`/:(?:hover|focus-within|active)\b/`), placed immediately
after the existing `UNGUARDABLE_POSITIONAL` gate so it cannot steal comment / root-scoped /
not-a-selector rows. **15 of the 282** fire, in 10 files:

| site                                                                                            | argument(s)                                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `platform/packages/editor/editor-common/src/extensibility/ExtensionNodeWrapper.tsx:33,39,60,66` | `.extension-label:hover`, `.extension-container:hover`, `.extension-edit-toggle-container:hover` |
| `platform/packages/editor/editor-toolbar/src/ui/ToolbarButtonGroup.tsx:20,30`                   | `[data-toolbar-component="button"]:not(…):hover`                                                 |
| `jira/…/calendar-view/src/ui/calendar-renderer/CalendarRenderer.tsx:1742`                       | `.fc-event-main:hover, .fc-event-resizer…:hover`                                                 |
| `jira/…/calendar-renderer/add-icon-button/AddIconButton.tsx:63`                                 | `.fc-event-main:hover, …`                                                                        |
| `wac/…/customer-stat/src/customer-stat.tsx:147`                                                 | `.full-card:hover`                                                                               |
| `wac/…/customer-quote/src/customer-quote.tsx:98,210`                                            | `.full-card:hover`                                                                               |
| `wac/…/card/src/card.tsx:394,399`                                                               | `.full-card:hover`                                                                               |
| `avp/…/spreadsheet-table/spreadsheet-table.tsx:51`                                              | `[role="slider"]…:hover`, `…:active`                                                             |
| `adminhub/…/identity-providers-card/identity-providers-card.tsx:50`                             | `button:hover`                                                                                   |

These are the plausible ones, not exotica: `button:hover`, `.extension-container:hover` and
`[data-toolbar-component="button"]:hover` are exactly the compounds a migrated tooltip or popup gets
inserted underneath.

### 5.3 Correction A′ — `+1` to judgement

`deterministically-safe/root-scoped-has-is-invariant` is sound for existence and unsound for state
(§4.2). The rule now runs **after** the dynamic-pseudo check, moving
`avp/…/spreadsheet-table/spreadsheet-table.tsx:83` out of `deterministically-safe`. That bucket goes
`26 → 25` for this reason and `344 → 343` overall.

Together A and A′ make the live `propagating-state-pseudo-in-argument` bucket **17** rows: 15 from
the 282, 1 from root-scope, and 1 whose reason was previously attributed to `interpolated-argument`
(already judgement, so no total change — `interpolated-argument` goes `49 → 48`).

### 5.4 Correction B — `−21` from judgement

The classifier lumps `+` and `~` into one `sibling-combinator-in-argument` bucket. D3/D4 show that
is too strict: a **leading `~`** requires no adjacency, so a host inserted between `E` and the
sibling leaves the match untouched, and the only exposure is the descendant tail — which the wide
guard fixes (D2). Rule change: strip a leading `~` from a branch when it carries no other top-level
`+`/`~`, then classify the remainder normally. **21 of the 49** move to `codemod-able`, and none of
them is held in judgement by a second residue signal on the same line (checked against all six other
patterns):

- `platform/packages/editor/editor-plugin-block-controls/src/ui/quick-insert-button.tsx` — 10 rows
- `platform/packages/confluence/editor-plugin-malleable-ui/src/ui/components/RemixButtonDecoration.tsx`
  — 10 rows
- `platform/packages/editor/editor-toolbar/src/ui/Toolbar.tsx:66` — 1 row

### 5.5 Corrected table

| bucket                 | published | corrected |  delta |
| ---------------------- | --------: | --------: | -----: |
| codemod-able           |       293 |   **299** |     +6 |
| deterministically-safe |       344 |   **343** |     −1 |
| unreachable            |         7 |     **7** |      0 |
| **needs-judgement**    |   **505** |   **500** | **−5** |
| total                  |     1,149 |     1,149 |      0 |

`:has()` sub-buckets, corrected:

| reason                                                 | published | corrected |
| ------------------------------------------------------ | --------: | --------: |
| `codemod-able/guard-subtree-in-descendant-argument`    |       282 |   **288** |
| `needs-judgement/sibling-combinator-in-argument`       |        49 |    **28** |
| `needs-judgement/propagating-state-pseudo-in-argument` |         — |    **17** |
| `needs-judgement/interpolated-argument`                |        49 |    **48** |
| `deterministically-safe/root-scoped-has-is-invariant`  |        26 |    **25** |
| `:has()` needs-judgement, total                        |       133 |   **128** |

**Of the 282, 267 survive** as validly `codemod-able` (94.7%); 15 return to the residue. The
descendant-guard bucket then _grows_ to 288 because it absorbs the 21 leading-`~` rows.

`judgementRows` is now **500 rows across 289 files** (was 505 across 283). The file count rises
while the row count falls: the 21 rows removed are concentrated in 3 files, the 16 added are spread
over 11.

Re-run (needs `--repo` / `--scope` when the patched copy lives outside the repo):

```bash
OPENSSL_CONF=/dev/null node classify-residue-corrected.mjs \
  --repo <afm-root> --scope <prework>/filter1-scope.json --out /tmp/residue-corrected.json
# → DEDUPED TOTAL 1149: codemod-able 299, deterministically-safe 343, unreachable 7, needs-judgement 500
```

### 5.6 Sensitivities

- **`+15 / +1` is deliberately conservative.** The rule is arg-wide, like the existing
  `UNGUARDABLE_POSITIONAL` gate, so it fires even where no real ancestor can plausibly become the
  host's parent. A per-site pass would likely clear some of the 16 — but that pass _is_ judgement
  work, so counting them in is the right call for a judgement budget.
- **`−21` rests on one unverified premise:** that no adopter _wraps pre-existing DOM_ in a host. The
  in-place adopters render their own content (previously portalled), and anchored hosts are inserted
  beside the trigger — neither wraps a subtree. If some adopter does wrap, `~` breaks the same way
  `+` does and this correction is void, giving **521**.
- **Claim-only figure: 520.** `505 + 15` — Correction A alone, banking neither A′ nor B. See §5.0.
- **Three rows are a self-inconsistency, not a guard failure.** The doc's measurement caveats say
  "Playwright / `querySelector` selector strings are counted **conservatively as judgement**, not
  pruned", yet 3 rows inside the 282 are runtime DOM locators:
  `jira/src/packages/board/page-objects/integration-tests/InlineCreate.page-object.tsx:16`,
  `jira/src/packages/admin-pages/labs/integration-tests/BetaFeatures.page-object.tsx:37`,
  `platform/packages/design-system/modal-dialog/src/__tests__/playwright/accessibility.spec.tsx:39`.
  Applying that caveat consistently gives **503**. (The other 26 test-file rows in the 282 are
  `expect(styles).toContain('…')`-style assertions over emitted CSS — those must be updated in
  lockstep by the codemod, so `codemod-able` is the right owner for them.)
- **Unchanged:** the `:nth-of-type`, `:empty`, `only-child`, `& +` / `& ~` and reachability
  findings. Nothing here touches them.

### Bottom line

The 282-line row is **not** the load-bearing weakness the doc feared. The descendant guard is real,
it is specified correctly in §0.2 (`[popover] *`, `dialog *`), and Chromium confirms it on every
descendant shape tested. `505 → 787` does not happen; the residue's headline number should be **~500
rows in 289 files**.

The count is the least interesting output. Three findings matter more:

1. **A hazard class nobody has named** (§4.2) — interaction-only `:has()` flips via propagating
   dynamic pseudos. 17 live rows, 39 including subject-side, structurally invisible to static VR and
   to unit tests, and it needs interaction-driven tests to observe at all.
2. **The wide guard is not a flag-off no-op** (§4.4) — all 288 rewrites have to land in gate 3's
   expected-diff set, and `shouldRenderToParent` sites can regress with the flag _off_.
3. **Two transform spec lines with test cases** (§4.3) — per-comma-branch append, and `:not()`
   nesting direction. C18 is the bug an implementation that appends once will ship.

Residual uncertainty has moved from "is the guard real" (settled: yes, for descendants) to "does any
adopter wrap existing DOM" (worth ±21).

**Confidence: high** for the mechanism findings — every one is a direct browser measurement,
reproducible with the fixture above; **medium** for the row deltas, for the reasons in §5.6.
