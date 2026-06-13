# Follow-up: implement `useInitialFocus` for `tree` and `grid` roles

## Context

`shouldFocusIntoPopover` (in `src/internal/role-types.tsx`) returns `true` for the following
focus-capturing roles:

- `dialog`
- `alertdialog`
- `menu`
- `listbox`
- `tree`
- `grid`

`useInitialFocus` (in `src/internal/use-initial-focus.tsx`) currently only implements focus movement
for the first four. `tree` and `grid` fall through to a no-op: focus is never moved into the popover
on open.

## Consequence

For a `Popover` with `role="tree"` or `role="grid"`:

- **Initial focus**: not moved into the popover. The trigger keeps focus and the user must Tab into
  the popover content. This violates the WAI-ARIA APG patterns for both roles, which expect focus to
  land on a navigable child (typically the active tree item or grid cell).
- **Focus restoration**: harmless. The nested-popover fallback restoration runs but the snapshotted
  element (the trigger) already has focus, so the restore is a no-op.

The restoration coverage is therefore complete in principle, but the initial-focus gap means
practical use of `role="tree"` / `role="grid"` with `Popover` is currently broken from a keyboard
navigation standpoint.

## Suggested implementation

Add `tree` and `grid` cases to `getInitialFocusTarget` in `use-initial-focus.tsx`:

- **`tree`**: focus the first `[role="treeitem"][aria-selected="true"]`; fall back to the first
  `[role="treeitem"]`. Per the
  [APG Tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/), the active descendant is
  the selected item if one exists.
- **`grid`**: focus the first `[role="gridcell"][tabindex="0"]`; fall back to the first
  `[role="row"] > [role="gridcell"]`. Per the
  [APG Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), the grid uses roving tabindex
  with `tabindex="0"` on the active cell.

## Test coverage to add

When this gap is closed, extend the existing nested-focus-restoration test matrix in
`__tests__/playwright/nested-focus-restoration.spec.tsx` to include `tree` and `grid` in
`FOCUS_CAPTURING_ROLES`. The fixture in `examples/140-testing-nested-focus-restoration.tsx`
currently does not include these roles because `getAriaForTrigger` would need updating too
(`TAriaForTriggerRole` already lists them, so wiring is straightforward).

## Related code

- `src/internal/use-initial-focus.tsx` — where the implementation goes
- `src/internal/role-types.tsx` — `shouldFocusIntoPopover` (already includes tree/grid)
- `src/popover/popover.tsx` — restoration code that depends on `shouldFocusIntoPopover`
- `notes/architecture/focus.md` — role-to-behavior summary table (update the "Initial Focus" cell
  for `tree`/`grid` once implemented)
- `examples/140-testing-nested-focus-restoration.tsx` — fixture to extend
- `__tests__/playwright/nested-focus-restoration.spec.tsx` — test matrix to extend
