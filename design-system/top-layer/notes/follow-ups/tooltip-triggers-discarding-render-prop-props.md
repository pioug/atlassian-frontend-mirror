# Follow-up: tooltip triggers that discard the render-prop props entirely

## Context

`@atlaskit/tooltip`'s render prop hands the consumer everything the trigger needs — the hover/focus
handlers, `aria-describedby`, and a `ref` (`setDirectRef` in `src/tooltip.tsx`, which populates
`targetRef`):

```tsx
children({
	...tooltipTriggerProps, // onMouseOver / onMouseOut / onMouseMove / onMouseDown / onClick / onFocus / onBlur
	'aria-describedby': tooltipIdForHiddenContent,
	ref: setDirectRef,
});
```

A repo-wide sweep of all 855 render-prop `<Tooltip>` usages (see
[tooltip-migration.md](../migrations/tooltip-migration.md)) found two distinct failure modes:

1. **Only the `ref` is dropped** — the trigger spreads the handlers but overwrites or omits the ref.
   The tooltip still shows; it just has no anchor. With `platform-dst-top-layer-tooltip` **off** the
   legacy Popper path masks this via react-popper's `ManagerReferenceNodeContext` fallback (supplied
   by `@atlaskit/popup`'s own `<Manager><Reference>` when the trigger sits inside a popup). With the
   flag **on**, `useAnchorPosition` gets a null `anchorRef`, no `anchor-name` is established, and
   the `popover="hint"` element renders at the top-left of the viewport. **These were all fixed,
   each behind `fg('platform-dst-top-layer-tooltip')`** — the merged ref is only applied in the
   treatment arm, so the control arm keeps resolving its reference element exactly as it does on
   master.

2. **The whole props object is dropped** — the trigger discards the handlers as well, so the tooltip
   has never rendered at all, on either side of the flag. This is not a top-layer positioning bug
   and fixing it is not ref plumbing: it makes a tooltip appear where none has ever appeared.
   **These were deliberately left alone**, and are recorded below.

## Consequence

Nothing regresses when `platform-dst-top-layer-tooltip` is enabled — a tooltip that never renders
cannot be mispositioned. The cost is silent dead code: a `<Tooltip>` wrapper, its `content` (often
translated), and in some cases a `canAppear` predicate, all shipping with no effect. Each site is a
latent surprise for whoever next touches the trigger, because restoring the props is a one-line
change with a visible UI consequence.

Two of these sites were also fixed and then reverted during the sweep, so their history is worth
knowing: `StepNodeRendererXyFlow` and `AnalyticsDropdownItem` both work correctly with the props
restored, but as pointer-only tooltips (in both cases the element receiving the props is not the
focusable one).

## Why gating does not work for this class

The ref-only drops in class 1 are all gated on `platform-dst-top-layer-tooltip`, which is exactly
why they were safe to land: the ref is the _only_ thing that changes, so the control arm is
byte-identical to master and the treatment arm gets an anchor.

That does not carry over here. The ref alone is unobservable in class 2 — without the handlers the
tooltip never opens — so a gated fix does not mean "invisible with the flag off, correct with it
on". It means **no tooltip in the control arm and a new tooltip in the treatment arm**, which is a
tooltip _content_ difference between the two arms of this migration's own rollout. Every tooltip VR
snapshot runs `'platform-dst-top-layer-tooltip': [true, false]` side by side precisely so that a
diff is attributable to the rendering path; a new tooltip in one arm manufactures a diff that reads
as a top-layer regression. It is also a deferral rather than a decision — once the flag is cleaned
up, the true branch becomes unconditional and the tooltip ships anyway, with nobody having decided
it should.

Product code that legitimately reads this flag compensates for the _rendering_ change, not for
whether a tooltip exists — see `jira/src/packages/polaris/component-view-list/src/HeaderTrigger.tsx`
(swaps a container, passes `tag`) and
`jira/src/packages/work-item/work-item-actions-container/src/WorkItemActionsContainer.tsx` (adds a
`:not(:where([popover], dialog))` guard so top-layer siblings are not stretched by a layout
selector).

## The sites — 7 components, 14 call sites

### Design system — one fix covers five consumers

`@atlaskit/badge` (`src/badge.tsx`, and `src/new/badge-new.tsx`) and `@atlaskit/lozenge`
(`src/lozenge.tsx` → `LegacyLozenge` / `src/new/lozenge.tsx` → `NewLozenge`) are `memo`-wrapped
function components with a fixed prop destructure and no rest spread. They therefore drop the
handlers, and — because React is pinned to **18.3.1** by the root `resolutions` — a plain function
component never receives `ref` at all, so adding a rest spread would not be enough on its own.

| Consumer                                                                                                       | Trigger   |
| -------------------------------------------------------------------------------------------------------------- | --------- |
| `studio/packages/agent-studio/src/ui/view-scenario/rovo-scenario-page/tools-field/index.tsx:506`               | `Badge`   |
| `studio/packages/agent-studio/src/ui/view-scenario/rovo-scenario-page/skills-field/index.tsx:383`              | `Badge`   |
| `flask/src/features/telemetry/traces/components/trace/span/span-left.tsx:64`                                   | `Badge`   |
| `jira/src/packages/servicedesk/incident-management-issue-view-status-pages-panel/src/StatusPagesPanel.tsx:280` | `Lozenge` |
| `jira/src/packages/servicedesk/incident-management-issue-view-status-pages-panel/src/StatusPagesPanel.tsx:291` | `Lozenge` |

**Suggested implementation:** add `forwardRef` plus a handler / `aria-describedby` passthrough to
`Badge`, `BadgeNew`, `LegacyLozenge` and `NewLozenge`. That fixes all five consumers at once and
closes the class, rather than leaving five call-site workarounds. The alternative — switching each
call site to the non-render-prop `<Tooltip content={…}><Badge /></Tooltip>` form so Tooltip supplies
its own container via `setImplicitRefFromChildren` — is local but adds a wrapper element inside an
`Inline`, with layout and VR consequences at each site.

### Product code

| Site                                                                                                                                                                                      | Shape                                                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `jira/src/packages/servicedesk/ai-context-resolution-plan-panel/src/StepNodeRendererXyFlow.tsx:220`                                                                                       | Render prop takes no argument at all. `Box` forwards ref and html attributes, so the fix is one line — but the `Box` is not focusable; the ancestor card (`role="button" tabIndex={0}`) is, and it owns the toggle the tooltip describes.                                            |
| `volt/studio/.../DevboxCard/ClassicDevboxCard/ClassicDevboxCardDropdown/AnalyticsDropdownItem.tsx:28`                                                                                     | Plain function component with a fixed destructure. Needs `forwardRef` + `...rest` onto `DropdownItem` (which does forward to `ButtonItem`/`LinkItem`). Surfaces three tooltips: `DeleteDropdownItem`, `ConvertToPermanentDropdownItem`, `SetAsDefaultDropdownItem`.                  |
| `jira/src/packages/portfolio-3/portfolio/src/app-simple-plans/view/main/tabs/roadmap/fields/header/advanced-fields-menu/view.tsx:530`                                                     | The `renderMenuTrigger !== undefined` early return drops `tooltipProps`; the fallback path below it merges correctly. The trigger comes from a consumer-supplied render function whose `MenuTriggerProps` does not include tooltip handlers, so this is an API change in that chain. |
| `jira/src/packages/servicedesk/change-management-common/src/ChangeManagementLozenge.tsx:36`                                                                                               | The `fg('enable-change-window-improvements')` branch never spreads `tooltipProps`; the legacy branch does (onto `LozengeContainer`). Consumers: `change-management-calendar/src/AssetLozenge.tsx:8`, `.../LozengeField.tsx:27`.                                                      |
| `platform/packages/ai-mate/conversation-assistant-message-actions/src/controllers/studio-trigger-solution-build/plan-card/capabilities/automation/footer-actions/index.tsx:78` and `:139` | Unreachable regardless: `canAppear` is only true when the trigger is also `isDisabled`, and `Pressable` renders a native `disabled` `<button>`, which dispatches no mouse events. Needs a wrapper element.                                                                           |

`ChangeManagementLozenge` deserves a note of its own: spreading onto the inner `Box` (the obvious
one-line fix) covers only the label, leaving `iconBefore` / `iconAfter` outside the hover area, and
when `href` is set the focusable `Anchor` is an **ancestor** of the trigger, so keyboard focus never
fires the tooltip. The legacy branch avoided both problems by putting the props on the `<a>`.
Getting this right means restructuring the gate-on branch, since its container is a `Fragment` when
there is no `href`.

## Detection

The class is mechanically detectable and worth a lint rule or a periodic sweep: a `<Tooltip>` render
prop whose parameter is unused, or whose props reach a child that is neither a DOM element, a
`forwardRef` component, a `@compiled`/`@emotion` styled component, nor a `styled-components` v3
component receiving `innerRef`. Two environment facts make the analysis load-bearing and are easy to
get wrong:

- **React is pinned to 18.3.1** (root `package.json` `resolutions`), so `ref` is stripped before a
  plain function component sees it. A `...rest` spread cannot rescue it — the component must be a
  `forwardRef`.
- **`styled-components` is pinned to 3.4.10** by a patch resolution, so v3 styled components are
  class components: `ref` yields the instance and `innerRef` is the DOM escape hatch. Some product
  `package.json` files declare a much newer version (adminhub declares 6.3.12), which is misleading.
  `@compiled/react` `styled` and `@emotion/styled@11` both forward refs correctly.
