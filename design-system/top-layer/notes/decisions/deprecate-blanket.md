# Deprecate `@atlaskit/blanket`

## Status

**Decided (2026-11-03).** Deprecate now. Remove after the `platform-dst-top-layer` cleanup, when no
imports are left.

## Decision

Mark every export of `@atlaskit/blanket` (`.`, `./blanket`, `./types`) as deprecated:

- `atlassian.website.status` is `deprecated` in `package.json`, so atlassian.design shows the
  deprecated banner. The docs navigation and the components page list Blanket under "Deprecated".
- `@deprecated` JSDoc on `Blanket` and `BlanketProps`.
- `usage.mdx` and `blanket.docs.tsx` give the replacement for each use case.

Do not change runtime behaviour. Do not migrate consumers in the same change.

## Why

- **Blanket does not cover the page with top layer on.** It is a base-layer `position: fixed` div at
  `layers.blanket()` (z-index 500). Tooltips, popups, flags and dialogs are in the top layer, so
  they show above it. Each new use adds a layering hazard (Rule 8 in
  [legacy-layering-interlacing-hazards.md](../migrations/legacy-layering-interlacing-hazards.md)).
- **It blocks only the pointer.** Keyboard and screen reader users can still reach the page under
  it. A modal `<dialog>` makes the page inert.
- **The replacements work with the flag on or off.** `ModalDialog`, `Drawer` and `Popup` exist
  today, so teams can migrate now.
- **The change is low risk.** It changes metadata, docs and JSDoc only, so it needs no feature gate.

## Standalone use cases

Snapshot of `origin/master` on 2026-11-03. Counts are approximate.

| Use case                                                     | Sites | Examples                                                                        | Replacement                                                                                                                        |
| ------------------------------------------------------------ | ----- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Loading screen or Suspense fallback while a lazy modal loads | ~30   | Jira dashboards (11), JSM change calendar, Polaris template applier, Loom       | The target's own shell (`ModalDialog` with a spinner), or a modal `Dialog`                                                         |
| Custom modal, side panel or drawer (tinted, click to close)  | ~17   | help-center search modal, avp sidepanel, insights `RightPanel`, admin-hub       | `ModalDialog`, `Drawer` or `Dialog`                                                                                                |
| Invisible "click outside" catcher (`isTinted={false}`)       | ~9    | Confluence menus (7), `PillPickerMenuShell`, inline edits                       | `Popup` light dismiss. Inline edits: `@atlaskit/inline-edit` or focus-out. Blanket takes the outside click; light dismiss does not |
| Upsell overlay that the user cannot dismiss                  | 4     | Confluence `FreeUpsell` (3), `WatermarkEnterpriseUpsell`                        | An overlay inside the container, or `ModalDialog`                                                                                  |
| Dimming behind a spotlight                                   | 3     | Jira `PagesSpotlightInternal` (punches a hole in the blanket), growth-starburst | None. Spotlight has no blanket by design                                                                                           |

Behaviour change for the "click outside" catcher: a blanket takes the outside click, so the element
under the pointer does not get it. `Popup` closes after the click, so the click also reaches that
element (see [outside-press-closes-every-layer.md](./outside-press-closes-every-layer.md)).

## What is not done, and why

- **No `no-deprecated-imports` entry.** That rule is `error` in the recommended preset, so an entry
  breaks every consumer. `@atlaskit/onboarding` was deprecated the same way, without an entry. This
  also means `ModalDialog` and `Drawer` need no lint opt-outs.
- **No lint rule checks call sites of `@deprecated` APIs** in AFM, so the JSDoc only shows in
  editors. The JSDoc itself gets a `deprecation-ticket-required` warning (not an error), as the
  deprecated `Popup` props do. The Platform ratchet "No importing from deprecated platform entry
  points" blocks only new imports of `@atlaskit/blanket/types` (no file imports it today). It does
  not see the tag on `Blanket`, because the tag is on the declaration, not on `export default`.
- **Spotlight keeps its `@atlaskit/blanket` devDependency** for now. The `customisations` example no
  longer uses Blanket. Removing the devDependency changes the lockfiles, so it goes with the package
  removal.

## Before removal

1. **`ModalDialog` and `Drawer` legacy paths.** `modal-wrapper.tsx` and `drawer/src/blanket.tsx`
   still render Blanket with the flag off. They go with the `platform-dst-top-layer` cleanup.
2. **Product consumers.** About 60 sites. Teams migrate by use case during the rollout.
3. **Forge UI Kit.** `forge-ui/src/components/UIKit/blanket` gives `Blanket` to third-party apps,
   and `forge-react-types` publishes its props. The Forge team deprecates and removes it on their
   schedule.
4. **Spotlight dimming.** Design must agree that `PagesSpotlightInternal` loses its dimmed
   background, or give a top-layer answer.
5. **npm.** The package is public, so removal is a major version.
