# Ground truth #3 — host insertion position (in-place / no-trigger adopters)

Closed question, one answer per package: **with the relevant `platform-dst-top-layer*` feature gate
ON, where in the DOM does the top-layer host element land relative to the component's trigger, or —
where there is no trigger — relative to the component's own position?** The host is either the
`<div popover>` rendered by `@atlaskit/top-layer`'s `Popover`
(`platform/packages/design-system/top-layer/src/popover/popover.tsx:401`) or the `<dialog>` rendered
by its `Dialog` (`platform/packages/design-system/top-layer/src/dialog/dialog-content.tsx:273`,
shown via `showModal()` at `dialog-content.tsx:196`, with **no** `popover` attribute) — the two need
different guard forms. Gate names: `@atlaskit/spotlight` is behind
**`platform-dst-top-layer-spotlight`**; `@atlaskit/avatar-group`, `@atlaskit/flag`,
`@atlaskit/modal-dialog` and `@atlaskit/drawer` are all behind the single shared
**`platform-dst-top-layer`** gate. `canTakeSlot1` answers whether the host can become the _first_
DOM child of a **consumer-authored** container, which is what decides whether bare `:first-child` /
`:nth-child(1)` rules in adopter code are safe. `still portals?` records whether the gated path
still renders through `@atlaskit/portal` (four of the five stop portalling under the gate, which is
precisely why the host reaches consumer containers at all).

| Adopter                  | position      | canTakeSlot1 | hostKind       | still portals? | evidence (`file:line`)                                                                       | notes                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ------------- | ------------ | -------------- | -------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@atlaskit/tooltip` ✅   | after-trigger | false        | `div[popover]` | no             | `platform/packages/design-system/tooltip/src/tooltip.tsx:588`                                | Verified reference/calibration row — trailing sibling of the trigger in the consumer's container, so it cannot take slot 1.                                                                                                                                                                                     |
| `@atlaskit/spotlight`    | in-place      | true         | `div[popover]` | no             | `platform/packages/design-system/spotlight/src/ui/popover-content/top-layer.tsx:136`         | `PopoverProvider` emits no DOM (`popover-provider/top-layer.tsx:25`) and `PopoverTarget` is a separate `<div>` (`popover-target/top-layer.tsx:31`), so the consumer's JSX order — not the package — decides whether the host precedes the target.                                                               |
| `@atlaskit/avatar-group` | wrapped       | false        | `div[popover]` | no             | `platform/packages/design-system/avatar-group/src/components/avatar-group-top-layer.tsx:159` | Fragment is `[trigger, Popover]` (so after-trigger locally) but avatar-group always wraps it in its own `<li>` inside its own `<ul>` (`stack.tsx:69`/`stack.tsx:54`, `grid.tsx:63`/`grid.tsx:55`), so the host never reaches a consumer's `& > *`.                                                              |
| `@atlaskit/flag`         | in-place      | true         | `div[popover]` | no             | `platform/packages/design-system/flag/src/flag-group.tsx:382`                                | Highest-risk row: `FlagGroup` returns `<Popover mode="manual" isOpen={true}>` unconditionally in its own position (the legacy `<Portal>` at `flag-group.tsx:388` is gate-off only), so the host is mounted for the group's entire lifetime — even with zero flags — defeating the "open-state only" mitigation. |
| `@atlaskit/modal-dialog` | in-place      | true         | `dialog`       | no             | `platform/packages/design-system/modal-dialog/src/internal/components/modal-wrapper.tsx:408` | Gate dispatch at `modal-wrapper.tsx:643`–`650`; the top-layer branch drops `Portal` entirely (legacy `Portal` at `modal-wrapper.tsx:577` is gate-off only) and `ModalTransition` adds no DOM (`modal-transition.tsx:18`), so the `<dialog>` lands wherever the consumer renders `<Modal>`.                      |
| `@atlaskit/drawer`       | in-place      | true         | `dialog`       | no             | `platform/packages/design-system/drawer/src/drawer-panel/drawer-top-layer.tsx:259`           | Gate dispatch at `drawer/src/drawer.tsx:150`–`152`; the top-layer branch drops the legacy `Portal` (`drawer.tsx:136`) and renders `<Dialog>` with no wrapper, so the `<dialog>` lands wherever the consumer renders `<Drawer>`.                                                                                 |

## Consequences for the risk matrix (§0.5)

- **Three of the five (`flag`, `modal-dialog`, `drawer`) are true in-place adopters with no wrapper
  and no portal under the gate.** They land directly in consumer-authored containers and can occupy
  slot 1, so the 🟢 "`:first-child` is safe" row of the risk matrix does **not** apply to them.
- **`spotlight` is nominally anchored but structurally in-place**: nothing in the package guarantees
  the host follows the target, because the two are sibling components the consumer positions. Treat
  it as in-place (`canTakeSlot1: true`) even though the documented/example ordering puts the target
  first.
- **`avatar-group` is the only one of the five that is fully insulated** — its host is two levels
  inside avatar-group's own `<ul>`/`<li>`, so no consumer `& > *`-style selector can reach it.
- **Two host kinds are in play.** `flag`, `spotlight` and `avatar-group` produce `div[popover]`;
  `modal-dialog` and `drawer` produce a bare `<dialog>` with **no** `popover` attribute. Any guard
  written as `:not([popover])` will silently fail to exclude the `modal-dialog` / `drawer` hosts —
  guards must cover `dialog` (or a shared marker attribute) as well.
- **`flag` breaks the "host is only in the DOM while open" assumption** (ground truth #1): its
  `isOpen` is hard-coded `true`, so the host is present whenever `FlagGroup` is rendered.
