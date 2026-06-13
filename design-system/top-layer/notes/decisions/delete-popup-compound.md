# Delete the `Popup` compound; ship primitives only

> **Status: Executed** (this PR removes the `Popup` compound from `@atlaskit/top-layer`; all 7
> adapter packages migrated onto `Popover` + `useAnchorPosition` (+ `PopoverSurface`)).

> Remove the `Popup` compound from `@atlaskit/top-layer`. Replace with `Popover`, `PopoverSurface`,
> and the existing `useAnchorPosition` / `useWidthFromAnchor` hooks.

## Status

- Proposed: 2026-06-01
- Executed (Phases 0 to 3): 2026-06-01
- Follow-up backfill: 2026-06-02
- Scope: gated behind `platform-dst-top-layer`. No in-the-wild deprecation.

## Execution log

### Phase 0: Popover gains nested-focus fallback, `PopoverSurface` lands

- `Popover` accepts optional `triggerRef: RefObject<HTMLElement | null>`. When supplied, focus is
  restored to the trigger on close if focus is still inside the closing popover (the browser only
  restores focus for the outermost `popover="auto"`). Fallback gated by `shouldFocusIntoPopover`.
- Re-exports `TPlacementOptions` from `popover/index.tsx` and `./popover`.
- New `PopoverSurface` primitive at `src/popover-surface/popover-surface.tsx` with a
  `./popover-surface` entry point. `PopupSurface` and `./popup-surface` deleted in Phase 2 with no
  temporary re-export (all consumers migrated in the same change).
- Internal `TPlacementOptions` imports re-pointed onto `internal/resolve-placement`.

### Phase 1: seven adapters migrated to primitives

- `@atlaskit/popup` (`popup-top-layer.tsx`): rewritten on `Popover`, `useAnchorPosition`,
  `useWidthFromAnchor`, `PopoverSurface`. FUDGE `aria-haspopup` cast deleted. Passes `triggerRef`
  for nested-focus.
- `@atlaskit/popup` (`compositional/popup-content-top-layer.tsx`): `PopupSurface` to
  `PopoverSurface`. Threads `triggerRef` and `id`.
- `@atlaskit/dropdown-menu`: `Popup.TriggerFunction` and FUDGE cast deleted. Trigger is
  consumer-owned. Aria props computed locally.
- `@atlaskit/inline-dialog`: `applyAriaAttributesToTrigger` helper deleted. `TriggerWrapper` writes
  aria via a single `useEffect`.
- `@atlaskit/avatar-group`: consumer renders the trigger directly. FUDGE cast deleted.
  ArrowDown-to-open preserved via a `display: contents` span.
- `@atlaskit/datetime-picker` (`menu-top-layer.tsx`, `fixed-layer-menu-top-layer.tsx`): pure
  `Popover` plus `useAnchorPosition` (`manual` mode). Uses `PopoverSurface`.
- `@atlaskit/select` (`popup-select-top-layer.tsx`): consumer renders the trigger directly. Uses
  `PopoverSurface`.

### Phase 2: compound and dead artefacts deleted

- Deleted `packages/design-system/top-layer/src/popup/` (11 files).
- Deleted `src/entry-points/popup.tsx` and `popup-surface.tsx`.
- Removed `./popup` and `./popup-surface` from `package.json` `exports`. Added `./popover-surface`.
- Deleted compound-only unit tests (`popup-aria-expanded.test.tsx`, `popover.tsx`,
  `react-19.test.tsx`). Pruned compound describe blocks from `popover-animation-callbacks.test.tsx`.
- Deleted 45 compound-using examples. Pruned `examples/config.jsonc`. Deleted 16 broken Playwright
  specs, VR tests, snapshots, and `unit/ssr.tsx` that referenced deleted examples.

### Changesets

Under `packages/design-system/.changeset/`:

- `@atlaskit/top-layer`: **major** (entry-point removals).
- `@atlaskit/popup`, `dropdown-menu`, `inline-dialog`, `avatar-group`, `datetime-picker`, `select`:
  **patch** (no public API change; only the gated `*-top-layer.tsx` paths were touched).

### Validation status

| Package           | `afm ts check` | `afm test unit`        | `yarn test:integration`        |
| ----------------- | -------------- | ---------------------- | ------------------------------ |
| `top-layer`       | ✅             | ✅ 16 suites, 290 pass | ✅ 206 pass (43.4s)            |
| `popup`           | ✅             | ✅ 141 pass            | ✅ 53 pass, 5 skipped          |
| `dropdown-menu`   | ✅             | ✅ 126 pass            | ✅ 43 pass, 1 flaky            |
| `inline-dialog`   | ✅             | ✅ 18 pass             | ✅ 38 pass, 1 skipped          |
| `avatar-group`    | ✅             | ✅ 59 pass, 1 skipped  | ✅ 31 pass                     |
| `datetime-picker` | ✅             | ✅ 235 pass, 2 skipped | ✅ 113 pass, 2 skipped         |
| `select`          | ✅             | ✅ 127 pass, 3 skipped | ✅ (testId fixed in `f41bf03`) |

`afm lint` is blocked by an unrelated monorepo-wide ESLint plugin failure in
`packages/search/search-common/src/services/eslint/utils/index.ts:48`. Not introduced by this
change.

### Test-side fixes during validation

- `popup-top-layer.tsx` and `dropdown-menu-top-layer.tsx`: kept legacy `aria-haspopup="menu"` for
  `role="menu"` triggers via narrow cast at the construction site.
- `popup-top-layer-adapter.test.tsx`: rewrote `keeps aria-expanded true during exit animation` to
  assert the new contract (synchronous flip with `isOpen`). Consumers can re-implement the old
  animation-aware behaviour locally via `onEnterFinish` / `onExitFinish` if needed.

### Phase 3: docs

- `packages/design-system/top-layer/README.md` rewritten to the `Popover` plus `useAnchorPosition`
  plus `PopoverSurface` story.
- `notes/architecture/overview.md` consolidated to a single `Popover` section. Renamed
  `PopupSurface` to `PopoverSurface`. Updated the "when to use what" matrix, architecture sketch,
  and entry-points table.

### Follow-up backfill (2026-06-02)

- `@atlaskit/select` `PopupSelect` backfill: new unit test, audit-fixtures example, browser specs
  under `__tests__/playwright/ff-testing/platform-dst-top-layer/`, and VR snapshots for both FF
  states.
- Pre-existing select integration failure resolved (commit `f41bf03`).
- Compound-using examples rewritten to `Popover` (commit `505818c`), superseding the earlier
  "deleted" state.
- AGENTS.md sweep on migrated source (commit fixes em-dashes, contractions, non-null assertion,
  inline comments, let reassignment).
- `getPopoverAriaHasPopup` removed; `getAriaForTrigger` narrowed. See
  `notes/decisions/anchor-api-design.md`.

### Not done

- Other notes files (`notes/migrations/*`, `notes/goals/*`) may still reference `Popup` /
  `PopupSurface`. They are historical records.
- `package-declarations/@atlaskit__top-layer/declaration.d.ts` still exports the deleted `popup`
  modules. Regenerated by CI after merge.
- Compound VR tests were deleted, not rewritten. Surviving VR coverage is the non-compound parts
  plus the new `PopupSelect` snapshots.

## Context

`Popup` was a compound with five parts:

- `Popup` (root): owns context (`popoverId`, `popoverRef`, `triggerRef`, `placement`, `onClose`,
  `mode`, `testId`, `popupState`, `ariaHasPopup`).
- `Popup.Trigger`: cloneElement-based trigger.
- `Popup.TriggerFunction`: render-prop trigger exposing
  `{ ref, isOpen, popoverId, toggle, ariaAttributes }`.
- `Popup.Content`: composes `Popover`, `useAnchorPosition`, `useWidthFromAnchor`. Reads context
  defaults. Adds animation-aware `popupState` sync. Adds nested-popover focus restoration.
- `Popup.Surface`: presentational `<div>` with overlay tokens.

Seven adapters consume the compound, all behind `platform-dst-top-layer`: `popup` (root +
compositional), `dropdown-menu`, `inline-dialog`, `avatar-group`, `datetime-picker` (menu +
fixed-layer-menu), `select` (popup-select).

Three other consumers use `Popover` directly: `tooltip`, `flag`, `spotlight`.

## Problem

Every adapter overrides, narrows, or ignores what the compound emits.

| Override / friction                                              | Adapters          |
| ---------------------------------------------------------------- | ----------------- |
| Re-types `ariaAttributes['aria-haspopup']` with a `FUDGE` cast   | 7 of 7            |
| Re-derives `aria-controls` (gates on `isOpen`)                   | 4 of 7            |
| Overrides `aria-expanded` (wants raw `isOpen`, not `popupState`) | 3 of 7            |
| Ignores `toggle`; wires own trigger click                        | 3 of 7            |
| Bespoke helper to spread `ariaAttributes` (`inline-dialog`)      | 1                 |
| `display: contents` span for focus tracking (`avatar-group`)     | 1                 |
| Imports `Popover` directly, bypassing `Popup.Content`            | 1 (compositional) |
| Imports `PopupSurface` directly                                  | 1 (compositional) |
| Uses `Popup.Trigger` (cloneElement variant)                      | **0 of 7**        |

Every consumer that adopts the compound's trigger half then spends 10 to 20 lines unwinding what the
compound forced on them. The only non-overridden affordances are:

1. `useId`-generated `popoverId` (~3 lines).
2. Shared `popoverRef` so trigger click can find the popover (~5 lines, if the consumer uses
   `toggle`, which three do not).
3. Co-locating `placement` / `onClose` / `testId` on the root (~4 props).
4. `popupState` animation machine for animation-aware `aria-expanded` (3 of 7 actively disable it).

That is the entire ROI. Every consumer pays the override tax above.

## What `Popup.Content` adds over `Popover`

| Pure composition           | Unique behaviour                                                                |
| -------------------------- | ------------------------------------------------------------------------------- |
| Wraps `Popover`            | Reads `triggerRef` / `placement` / `onClose` / `testId` from context (glue)     |
| Calls `useAnchorPosition`  | Calls `ctx.setPopupState` to keep `aria-expanded` true through exit (glue)      |
| Calls `useWidthFromAnchor` | Calls `ctx.setAriaHasPopup` so trigger reads it from context (glue)             |
|                            | Nested-popover focus restoration fallback                                       |
|                            | `mergeRefs([popoverRef, ref])` so trigger click hits the same node (glue)       |
|                            | Wraps `Popover` `onEnterFinish` / `onExitFinish` to call `setPopupState` (glue) |

Five of the six unique pieces exist only to feed the compound's trigger. The sixth, nested-popover
focus restoration, is a real browser-spec gap that belongs in the `Popover` primitive itself, not in
a compound wrapper. The three direct-`Popover` consumers (tooltip, flag, spotlight) do not get this
fix today, which is a latent a11y bug.

## Why a second public component does not earn its keep

`AnchoredPopover` would be six lines:

```tsx
function AnchoredPopover({ triggerRef, placement, widthFromAnchor, ...rest }) {
	const popoverRef = useRef(null);
	useAnchorPosition({ anchorRef: triggerRef, popoverRef, placement });
	useWidthFromAnchor({ mode: widthFromAnchor, popoverRef, anchorRef: triggerRef });
	return <Popover ref={popoverRef} {...rest} />;
}
```

Publishing a second component for six lines of composition of two already-public hooks reintroduces
the "two ways to do almost the same thing" tax. The bar for a second component is non-trivial owned
behaviour. The only candidate (nested-focus restoration) belongs in `Popover`.

## Why not silent prop sugar on `Popover`

Adding `triggerRef` / `placement` / `widthFromAnchor` as optional props that internally call the
hooks re-creates the compound's failure mode: behaviour fires on prop presence, collides with
consumer `useAnchorPosition` calls, and hides the four-line composition from the reader. Anchoring,
placement, and width are decisions, not defaults.

## Decision

Delete the `Popup` compound. Ship `Popover` (with always-on nested-focus restoration) plus
`PopoverSurface` plus the existing public hooks.

### Survivors

- `Popover` from `@atlaskit/top-layer/popover`. Now includes nested-focus restoration.
- `PopoverSurface` from `@atlaskit/top-layer/popover-surface` (renamed from `PopupSurface`).
- `useAnchorPosition`, `useWidthFromAnchor`, `slideAndFade`, `fromLegacyPlacement`,
  `createPopoverCloseEvent`: unchanged.

### Removed

- `Popup` (root, provider, context).
- `Popup.Trigger`, `Popup.TriggerFunction`, `Popup.Content`.
- `useMaybePopupContext`, `TPopupContext`, `PopupProvider`.
- `@atlaskit/top-layer/popup` entry point.

### Consumer shape going forward

```tsx
import { useRef } from 'react';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { slideAndFade } from '@atlaskit/top-layer/animations';

function MyPopup({ isOpen, onClose }) {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end', align: 'start' },
	});

	return (
		<>
			<button
				ref={triggerRef}
				onClick={() => popoverRef.current?.togglePopover()}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId })}
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				role="dialog"
				label="Settings"
				animate={slideAndFade()}
				onClose={onClose}
			>
				<PopoverSurface>{/* content */}</PopoverSurface>
			</Popover>
		</>
	);
}
```

## What replaces the compound and why

The `Popup` compound bundled three concerns (id generation, trigger ARIA, anchored positioning)
behind a context. Replacing it with `Popover` alone would push that work onto every consumer, so two
small helpers ship alongside the primitive:

- `usePopoverId()` returns a stable id sanitised for CSS selectors. Use for the `Popover` `id`,
  `aria-controls`, and `popovertarget`. Thin wrapper around `useId` that adds a `popover-` prefix
  for debuggability. Distinct from the `useAnchor*` family, which deals with CSS anchor positioning
  (`anchor-name`, `position-anchor`, `anchor-size()`) rather than HTML ids.
- `getAriaForTrigger({ role, isOpen, popoverId })` is a pure function that returns `aria-haspopup`
  (derived from `role`), `aria-expanded`, and `aria-controls`. `aria-controls` is always returned so
  the trigger-to-popover relationship stays stable; `aria-expanded` carries the current visibility
  state. This eliminates the most common wiring mistakes (forgetting `aria-expanded`, getting
  `aria-haspopup` wrong for the role, mismatching `aria-controls` to the popover id). Tooltip-family
  roles are excluded at the type level; those triggers use `aria-describedby` instead.

Both are independent and composable. Consumers who only need an id call `usePopoverId()`. Consumers
who need full trigger wiring call both. `getPopoverAriaHasPopup` was shipped briefly then removed
once `getAriaForTrigger` subsumed it.

The `Popover` `id` prop was kept as-is (not renamed to `popoverId`). Renaming would be a breaking
change and is semantically wrong for manual-mode popovers that have no trigger. Revisit if
`TPopoverProps` ever gets discriminated on mode.

A consolidated trigger-pairing hook that returns id, refs, and ARIA together was considered and
deferred. Ship the primitives first, revisit if the "call both" pattern proves to be the common
case.

## Consequences

### Wins

- All `FUDGE(top-layer-api)` `aria-haspopup` casts: deleted.
- `applyAriaAttributesToTrigger` (inline-dialog): deleted.
- `display: contents` trigger wrapper (avatar-group): deleted.
- `handleTargetClick` (popup-select) is the only path.
- `popupState` animation machine: deleted.
- One public story: `<Popover>` plus `useAnchorPosition` (optional) plus `<PopoverSurface>`
  (optional). No namespace, no compound.
- Nested-focus a11y fix lands for the four direct-`Popover` consumers as a side effect.

### Costs

- Seven adapters change at once. All in this monorepo, all behind one FF.
- Greenfield consumers writing a button-opens-menu from scratch now write ~10 lines of trigger
  boilerplate instead of `<Popup.Trigger>`. Zero such consumers exist today.
- `Popover` docs grow by a "wire your own trigger" recipe.
- `useAnchorPosition` and `useWidthFromAnchor` become first-class public hooks in docs.

### Risks

- A consumer relying on animation-aware `aria-expanded` (`popupState`) loses that behaviour. None of
  the seven adapters use it (three disable it). Fix is a local `useState` plus `onEnterFinish` /
  `onExitFinish`.
- Adapters change in lockstep behind the FF. The compound deletion itself is the only no-rollback
  step, sequenced after all adapters have shipped.

## Alternatives considered

### Alt. A: keep the compound, fix the leaks

Widen `aria-haspopup` types, gate `aria-controls` on `isOpen`, expose `onClick` composition, add
focus-tracking escape hatch.

Rejected: the "compound owns the trigger lifecycle" assumption keeps biting consumers with
non-trivial triggers. The overrides are symptoms, not causes.

### Alt. B: keep `Popup` root + `Popup.Content`, delete the two triggers

Trigger wiring becomes consumer-owned. Remaining context is a "skip four props" sugar.

Rejected: `Popup.Content` already accepts every context value as an optional prop. Not worth a
context indirection.

### Alt. C: two-tier API (`Popover` + `PopoverContent` or `AnchoredPopover`)

Keeps a low-level vs anchored distinction.

Rejected: `AnchoredPopover` is six lines of hook composition. Publishing a second component for that
repeats the compound's mistake.

### Alt. D: silent sugar (optional `triggerRef` / `placement` props on `Popover`)

Saves four lines per adapter.

Rejected: re-introduces magic. Behaviour fires on prop presence and hides composition from the
reader.

## Migration plan summary

- **Phase 0:** Land nested-focus restoration in `Popover` and the `PopoverSurface` rename (additive,
  temporary `PopupSurface` re-export).
- **Phase 1:** Migrate the seven adapters in parallel, one PR per adapter, each behind the existing
  FF.
- **Phase 2:** Delete `top-layer/src/popup/`, the `@atlaskit/top-layer/popup` entry point, the
  temporary `popup-surface` re-export, and compound-only examples. Single PR after Phase 1.
- **Phase 3:** Update `atlassian.design` docs and Storybook recipes.

## References

- Source: `packages/design-system/top-layer/src/popup/` (deleted).
- Source: `packages/design-system/top-layer/src/popover/` (survivor).
- Adapter inventory (the seven consumers): `popup`, `popup/compositional`, `dropdown-menu`,
  `inline-dialog`, `avatar-group`, `datetime-picker` (menu + fixed-layer-menu), `select`.
- Direct-`Popover` consumers (latent nested-focus a11y bug): `tooltip`, `flag`, `spotlight`.
- Related notes:
  - `notes/migrations/popup-migration.md`: original compound migration.
  - `notes/decisions/migration-roadmap.md`: wider rollout plan.
  - `notes/architecture/focus-restoration.md`: to be updated for the always-on nested-focus fix.
