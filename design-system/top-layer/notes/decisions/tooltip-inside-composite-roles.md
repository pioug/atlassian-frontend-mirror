# Tooltip inside composite roles is an accepted transient violation

> Why an open top-layer tooltip inside `role="menu"` or `role="tablist"` trips axe's
> `aria-required-children`, what was considered, and why nothing changes in `@atlaskit/tooltip`.

## Status

**Decision recorded 2026-09-21.** No portal, no change to tooltip. The violation is accepted as
transient and exempted per test file. Revisit triggers are listed below.

## Context

On the top-layer path (`platform-dst-top-layer-tooltip`), `Tooltip` renders the trigger and the
`Popover` host as siblings (`tooltip.tsx`, the `Fragment` around `{trigger}` and
`<TopLayerTooltipPopup />`). When the trigger is an item inside a composite container, the open
tooltip host is a DOM child of that container:

```html
<div role="menu">
	<button role="menuitem">Rename</button>
	<div popover="hint" role="tooltip">
		<!-- Popover host -->
		<div>
			<!-- TooltipPrimitive wrapper -->
			<div role="presentation">Rename this item</div>
		</div>
	</div>
	<button role="menuitem">Delete</button>
</div>
```

The a11y tree follows the DOM, so the tooltip is an accessibility child of the menu while open. axe
4.11.1 reports
`[Critical] aria-required-children … Element has children which are not allowed: [role=tooltip]` on
the `role="menu"` node (editor floating-toolbar `DropdownMenu`) and on the `role="tablist"` node
(rovo-link-picker `TabStrip`). Legacy never hit this because it portalled the bubble to
`document.body`.

A closed popover is `display: none` and excluded from the tree, so the violation exists only while a
tooltip is open.

## Evidence

Distinguish four layers: spec, browser, tool, and library convention.

### Spec

- **WAI-ARIA 1.2 §5.2.6 Required Owned Elements**
  ([w3.org/TR/wai-aria-1.2/#mustContain](https://www.w3.org/TR/wai-aria-1.2/#mustContain)): "Any
  element that will be owned by the element with this role… When multiple roles are specified as
  required owned elements for a role, at least one instance of one required owned element is
  expected." The only MUST in the section concerns `aria-busy`. `menu`/`menubar` list
  `group → menuitem/menuitemradio/menuitemcheckbox`, `menuitem`, `menuitemcheckbox`,
  `menuitemradio`; `tablist` lists `tab`. §9.2: "User agents are not responsible for logical
  validation, such as… Elements that do not correctly observe required child / parent role
  relationships."
- **WAI-ARIA 1.3 Editor's Draft §5.2.6 Allowed Accessibility Child Roles**
  ([w3c.github.io/aria/#mustContain](https://w3c.github.io/aria/#mustContain)): "If the list is not
  empty, authors MUST only add accessibility children with allowed roles." §7.3 defines
  accessibility children as DOM children plus "All DOM descendants of the element with only elements
  of role generic or none intervening", and excludes "All DOM elements that have no corresponding
  accessible object because they have been excluded from the accessibility tree." So a hidden
  tooltip is not a child; a visible `role="tooltip"` is.
- **HTML**: the popover section
  ([html.spec.whatwg.org/multipage/popover.html](https://html.spec.whatwg.org/multipage/popover.html))
  says only "When using popover on elements without accessibility semantics, for instance the div
  element, authors should use the appropriate ARIA attributes." Showing a popover never relocates it
  in the accessibility tree. `interestfor` is not in the standard
  ([whatwg/html#11006](https://github.com/whatwg/html/issues/11006), open).
- **HTML-AAM**
  ([w3c.github.io/html-aam/#att-popovertarget](https://w3c.github.io/html-aam/#att-popovertarget)):
  for `popovertarget`, "User Agents MUST expose an aria-details relation with the associated popover
  element except… The associated popover element is the next immediate accessibility sibling to the
  invoking element". For `popover`: "If specified on an element with an implicit role of generic,
  then the element's role instead maps to group." Relations are added; nothing is moved.
- **Open UI interest invokers explainer**, Accessibility section
  ([open-ui.org/components/interest-invokers.explainer](https://open-ui.org/components/interest-invokers.explainer/)):
  for a plain hint, "the browser will simply expose the the contents of a plain hint on the interest
  invoker element. The actual popover element and its descendants can be invisible/ignored in the AX
  tree". Rich hints get a minimum role of `tooltip` plus `aria-expanded`/`aria-details`. No spec,
  explainer or demo places a hint inside `menu` or `tablist`.
- **ARIA WG issues** that touch the same conflict, none resolved:
  [w3c/aria#1440](https://github.com/w3c/aria/issues/1440) (secondary actions inside composites,
  open since 2021), [#1425](https://github.com/w3c/aria/issues/1425) (APG nested submenu as a
  `menuitem` sibling violates owned elements, open),
  [#2836](https://github.com/w3c/aria/issues/2836) (text nodes in `menu` "may announce… '1 of 2'",
  asserted without data, open), [#2137](https://github.com/w3c/aria/issues/2137) (2026-04-11: "for
  any scenario where there is no spec requirement, things is left to the UA… Validation tools can
  flag that for the author"), [#2715](https://github.com/w3c/aria/issues/2715) (HTML-AAM mappings
  for `popover=hint`, open, no comments).

### Browser

Chromium and Gecko compute "x of y" for menu items and tabs from same-role siblings only, so an open
`role="tooltip"` sibling does not change counts or positions. VoiceOver is closed source and
unverified. No screen-reader evidence of harm was found either way.

### Tool

axe-core 4.11.1 `aria-required-children` → `getOwnedRoles`: skips nodes that fail
`isVisibleToScreenReaders` (`aria-hidden`, `inert`, `display`/`visibility`/`hidden` ancestors);
descends through nodes with no role, no global ARIA attribute and no focusability; flags any other
element. `role="none"`/`presentation` on an intermediate node is looked through, so it does not
help. axe has no popover awareness. Upstream:
[dequelabs/axe-core#3850](https://github.com/dequelabs/axe-core/issues/3850) (closed 2023-03-22,
confirms `aria-hidden` children are skipped),
[#4837](https://github.com/dequelabs/axe-core/issues/4837) (`popovertarget`/`aria-expanded`, open).

### Library convention

| Library                    | DOM                                   | Popover  | Mitigation                                                                       |
| -------------------------- | ------------------------------------- | -------- | -------------------------------------------------------------------------------- |
| Primer React TooltipV2     | inline sibling                        | `auto`   | `aria-hidden` on the bubble always; trigger `aria-describedby`/`aria-labelledby` |
| Primer ViewComponents      | inline, "place it immediately after…" | `manual` | label type: `aria-hidden` + `aria-labelledby`                                    |
| Web Awesome                | inline, `for=`                        | `manual` | no role; `aria-labelledby`                                                       |
| Spectrum Web Components    | inside trigger                        | `manual` | no role; `aria-describedby`                                                      |
| Shoelace                   | inline, shadow DOM                    | none     | `role="tooltip"`; source comment admits the rule violation                       |
| Angular Material           | portal                                | `manual` | `aria-hidden` on the bubble; hidden describer on `body`                          |
| Radix, React Aria, Base UI | portal                                | none     | `role="tooltip"` + `aria-describedby`; never inside the composite                |

Portal libraries never meet the problem. The inline native-popover peers avoid it by keeping the
bubble out of the tree and carrying meaning on the trigger.

### Repo prior art

- [`goals/accessibility-criteria.md`](../goals/accessibility-criteria.md) Requirement 1: no portal
  rendering to the end of `<body>`; `@atlaskit/portal` removed at 1.0.
- [`goals/project-goals.md`](../goals/project-goals.md): "no portals" is the point of top-layer.
- [`migrations/legacy-layering-interlacing-hazards.md`](../migrations/legacy-layering-interlacing-hazards.md):
  portals land in the base layer and are occluded or `inert` under top-layer surfaces; "absence of a
  portal… is the single strongest signal that a layer is safe".
- [`decisions/anchor-name-lifetime.md`](./anchor-name-lifetime.md): cross-component teardown is
  already hard; a portalled host would add another owner.
- `tooltip.tsx` already renders a `<span hidden id>` copy of the content and sets `aria-describedby`
  on the trigger, so the description reaches assistive technology independently of the bubble.
- [`tooltip-gate-on-in-tests-report.md`](../tooltip-gate-on-in-tests-report.md) cluster 4(b) records
  the failing suites and asked for this note.

## Options considered

| Option                                               | Why not                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portal escape hatch for triggers inside composites   | Breaks Requirement 1 and re-enters the interlacing hazards above. Anchoring by `anchor-name` would survive a portal, but the host would sit in the base layer, `inert` under a modal `<dialog>`, and lose hint nesting.                                                                                                                                                                                                                                  |
| `aria-hidden` on the bubble, always                  | The most correct end state (Open UI plain-hint model; Primer, Angular). Cost is the test contract: Testing Library and Playwright skip `aria-hidden` nodes, so every `ByRole('tooltip')` needs `{ hidden: true }` / `{ includeHidden: true }`. Counts at the time of writing: platform 227 files / 613 occurrences / 13 Playwright specs; jira 382 / 817 / 8; confluence 117 / 244 / 0; plus other products and external consumers. Deferred, see below. |
| `aria-hidden` only when inside a composite           | Tooltip semantics would depend on where the trigger lives; tests inside composites still need `hidden: true`; a heuristic to maintain.                                                                                                                                                                                                                                                                                                                   |
| Testing Library `configure({ defaultHidden: true })` | Zeroes the codemod but makes every role query in the monorepo match inaccessible nodes, so tests stop catching elements wrongly hidden from assistive technology.                                                                                                                                                                                                                                                                                        |
| Render the bubble inside the item                    | A `<div popover>` inside a `<button>` is invalid HTML; `menuitem` does not flatten its children; `tab` does in spec but browsers do not honour it reliably ([w3c/aria#2509](https://github.com/w3c/aria/issues/2509)).                                                                                                                                                                                                                                   |

## Decision

Keep the current shape: inline sibling host, `role="tooltip"` on the host, description on the
trigger via `aria-describedby`. Accept the `aria-required-children` report as a transient violation
and exempt it per test file.

Why:

- ARIA 1.2, the current Recommendation, has no author MUST here.
- Engines skip the tooltip for counts and positions; no evidence of user harm.
- The node exists only during a hover.
- The native hint model is unstandardised. When `interestfor` and the HTML-AAM hint mappings land,
  browsers will hide native hints themselves and testing tools will adapt. Paying for a
  monorepo-wide test codemod now buys an outcome the platform may deliver later.

If this is revisited, the preferred end state is `aria-hidden` on the bubble with the description
carried on the trigger. That also retires the possible double announcement recorded as item 17 in
[`accessibility-audit-report.md`](./accessibility-audit-report.md).

## Revisit triggers

Reopen this decision when any of these happens:

- `interestfor` lands in the HTML standard and HTML-AAM publishes mappings for `popover=hint`.
- WAI-ARIA 1.3 reaches Recommendation with the "authors MUST" wording intact.
- axe-core gains popover awareness or changes `aria-required-children` for this case.
- Screen reader testing shows the open tooltip changing item counts, positions or announcements.
- `@atlaskit/dropdown-menu` moves `role="menu"` off its Popover host, which changes how often this
  is hit.

## Guidance for consumers

If a test hovers or focuses a tooltip whose trigger sits inside `role="menu"`, `menubar`, `tablist`,
`listbox`, `radiogroup`, `tree`, `grid` or `row`, the shared auto-a11y check will report
`aria-required-children`. Exempt that single rule for that test file in the product's
`a11y-exemptions-accounting.json` (`exemptionType: "a11y-violation"`, criteria `id` exact
`aria-required-children`), with an `exemptionReason` that links to this note. Do not skip the whole
check with `skipAutoA11y`, and do not disable other rules.

Exempted on this branch:

- `packages/editor/editor-plugin-floating-toolbar-tests/src/__tests__/jest/ui/DropdownMenu.test.tsx`
- `packages/linking-platform/rovo-link-picker/tests/ui/TabStrip.test.tsx`
- `packages/linking-platform/rovo-link-picker/tests/ui/RovoLinkPicker.analytics.test.tsx` (found in
  CI later; its tab-switch tests leave a tab tooltip open for some runs, so it fails intermittently)

## Proposal to the accessibility team

Per-file exemptions do not scale to every consumer that puts a tooltip on a menu item or tab. The
shared auto-a11y setup in `@atlassian/a11y-jest-testing` could filter an `aria-required-children`
violation when its only offending children are open `[popover]` elements that contain
`role="tooltip"`, treating them the way the upcoming native hint model will. That keeps the rule
active for every real case and removes the need for consumers to know about this note. The filter
would be removed when the revisit triggers fire.

## Follow-up

`@atlaskit/dropdown-menu`'s top-layer path puts `role="menu"` on its Popover host
(`dropdown-menu-top-layer.tsx`). Every `<Tooltip><DropdownItem /></Tooltip>` therefore hits this,
and it also means the menu's accessibility children include whatever else the host renders. Moving
the role onto the menu group inside the host is worth a separate look regardless of this decision.
