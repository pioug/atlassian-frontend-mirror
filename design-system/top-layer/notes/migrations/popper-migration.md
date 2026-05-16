# Popper Migration

> Migration plan for `@atlaskit/popper` itself. Unlike the other notes in this folder, popper is a
> positioning **primitive**, not an overlay component, so its migration is **deprecation by
> displacement** rather than a feature-flagged code path inside the package.

---

## Status

**Not migrated.** No top-layer code path lives inside `@atlaskit/popper`, and the package still
ships its full Popper.js + react-popper surface. The
[migration roadmap](../decisions/migration-roadmap.md) lists popper under **Infrastructure /
primitives** with the note _"Legacy positioning; replaced by CSS Anchor Positioning (+ JS fallback
in top-layer)"_.

The migration happens in the **consumer** packages (popup, tooltip, etc.). Each consumer's top-layer
branch stops importing `@atlaskit/popper` and uses `@atlaskit/top-layer` primitives instead. Once
every consumer's legacy branch is removed, `@atlaskit/popper` can be deprecated and retired.

---

## Why popper is different from popup, tooltip, etc.

The other migrations in this folder all follow the same shape:

```
ConsumerComponent → fg('platform-dst-top-layer')
                      ? <ConsumerTopLayer />   // imports @atlaskit/top-layer
                      : <Legacy />             // imports @atlaskit/popper
```

`@atlaskit/popper` cannot follow that pattern because:

- It is a **positioning library**, not an overlay. There is no rendered surface to gate.
- Its public API exposes raw `react-popper` primitives (`Manager`, `Reference`) and Popper.js types
  (`Placement`, `Modifier`, `PopperChildrenProps`). A drop-in replacement that keeps the same
  render-prop API is impossible because CSS Anchor Positioning does not produce `style` /
  `attributes` / `placement` callback values.
- The new world replaces the **architecture** (anchor positioning + top layer + light dismiss), not
  just the implementation. Consumers must adopt the new component API (`Popover`, `Popup.Content`,
  `useAnchorPosition`), not a popper-shaped facade.

Therefore the work is consumer-side: rewrite each adopter on its top-layer branch, then remove the
popper dependency.

---

## Current public surface of `@atlaskit/popper`

| Export                                                                                                                                                                              | Source                                          | Notes                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `Popper`                                                                                                                                                                            | `src/popper.tsx`                                | Custom wrapper around `react-popper`'s `Popper` with viewport / max-size mods |
| `Manager`, `Reference`                                                                                                                                                              | re-exported from `react-popper`                 | Used by consumers that hand-roll their own positioning                        |
| `placements`                                                                                                                                                                        | re-exported from `@popperjs/core`               | Array of valid placement strings                                              |
| Types: `PopperProps`, `ManagerProps`, `ReferenceProps`, `PopperArrowProps`, `PopperChildrenProps`, `StrictModifier`, `Modifier`, `Placement`, `CustomPopperProps`, `VirtualElement` | both                                            | Re-exported from `@popperjs/core` and `react-popper`                          |
| `getMaxSizeModifiers`                                                                                                                                                               | `src/max-size.tsx` (internal, used by `Popper`) | Constrains popper to viewport when `shouldFitViewport` is set                 |
| Entry points                                                                                                                                                                        | `./popper`, `./react-popper`                    | Subpath exports for tree-shakeable consumption                                |

---

## Top-layer replacements

| Popper concept                                      | Top-layer equivalent                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `<Popper placement="bottom-start">`                 | `<Popover>` (or `Popup.Content`) + `placement` prop using the placement-map object         |
| Popper.js placement string (`'bottom-start'`)       | `fromLegacyPlacement({ legacy: 'bottom-start' })` from `@atlaskit/top-layer/placement-map` |
| `Manager` / `Reference` (raw react-popper)          | `useAnchorPosition` hook from `@atlaskit/top-layer/use-anchor-position`                    |
| `offset={[along, away]}`                            | `offset` prop on `Popover` / `Popup.Content` (CSS `--anchor-offset`)                       |
| `modifiers` (`flip`, `preventOverflow`, ...)        | CSS `position-try-fallbacks` — handled automatically                                       |
| `boundary` / `rootBoundary`                         | Viewport is the natural boundary in the browser top layer                                  |
| `strategy` (`'absolute'` / `'fixed'`)               | Always rendered in the browser top layer; no consumer choice needed                        |
| `shouldFitViewport` + `getMaxSizeModifiers`         | CSS Anchor Positioning sizing fallbacks (`max-block-size`, `max-inline-size`)              |
| `VirtualElement` (anchoring to a non-DOM rect)      | `useAnchorPosition` accepts a virtual anchor; see `architecture/positioning.md`            |
| `PopperChildrenProps` (`ref`, `style`, `placement`) | No equivalent — the surface is positioned by the browser; consumers no longer wire styles  |
| `Popper`'s render-prop API                          | Compound `<Popup>` / `<Popover>` with `Trigger` + `Content` slots                          |

JS fallback for browsers without CSS Anchor Positioning is implemented inside `@atlaskit/top-layer`
(see `architecture/positioning.md`); consumers do not need to ship their own popper-based fallback.

---

## Consumer inventory (full AFM scan)

`@atlaskit/popper` is currently declared as a dependency in **88 `package.json` files** across AFM
(excluding `node_modules`). Counts below are based on direct presence in `package.json`, not
transitive runtime usage. The lists were generated by:

```bash
grep -rln '"@atlaskit/popper"' <product>/ --include="package.json" | grep -v node_modules
```

### Design system (`platform/packages/design-system/`)

| Package             | Top-layer branch removes popper? | Notes                                                                                                                                                                                             |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popper`            | n/a (the package itself)         | Source of the deprecation                                                                                                                                                                         |
| `popup`             | ✅ Yes (FF-on path)              | See [popup-migration.md](./popup-migration.md). Legacy path still imports popper.                                                                                                                 |
| `tooltip`           | ✅ Yes (FF-on path)              | See [tooltip-migration.md](./tooltip-migration.md). Legacy path still imports popper.                                                                                                             |
| `inline-dialog`     | ✅ Yes (FF-on path)              | See [inline-dialog-migration.md](./inline-dialog-migration.md). Legacy path still imports popper.                                                                                                 |
| `spotlight`         | ✅ Yes (FF-on path)              | See [spotlight-migration.md](./spotlight-migration.md). Legacy path still imports popper.                                                                                                         |
| `datetime-picker`   | ✅ Yes (FF-on path)              | See [datetime-picker-migration.md](./datetime-picker-migration.md). `internal/fixed-layer.tsx` still imports popper for legacy path.                                                              |
| `inline-message`    | ⚠️ Type-only re-export           | `types.tsx` re-exports `Placement as PopupPlacement`. Needs to be re-pointed at `TLegacyPlacement` from `@atlaskit/top-layer/placement-map` (or removed if unused externally).                    |
| `onboarding`        | ❌ Not migrated                  | `spotlight-dialog.tsx` still uses `<Popper>` directly; no top-layer branch exists. Roadmap notes onboarding is **deprecated** in favor of Spotlight. Likely no migration; remove with onboarding. |
| `navigation-system` | ❌ Test-only                     | Only `panel-splitter.test.tsx` mocks `popperModule`. Once consumers stop importing popper, the test mock can be deleted.                                                                          |

### Other platform packages (`platform/packages/`)

| Area             | Package                                                    |
| ---------------- | ---------------------------------------------------------- |
| ai-mate          | `ai-mate/conversation-assistant-blank-object-experience`   |
| confluence       | `confluence/project-pages`                                 |
| dlp              | `dlp/data-classification-level`                            |
| editor           | `editor/editor-plugin-mentions`                            |
| elements         | `elements/reactions`                                       |
| elements         | `elements/share`                                           |
| elements         | `elements/user-picker`                                     |
| growth           | `growth/nudge-tooltip`                                     |
| jira             | `jira/jira-platform-fields`                                |
| jql              | `jql/jql-editor`                                           |
| monorepo-tooling | `monorepo-tooling/renovate-config` (config-only reference) |
| people-and-teams | `people-and-teams/people-teams-ui`                         |
| people-and-teams | `people-and-teams/ptc-common`                              |
| post-office      | `post-office/ipm-choreographer`                            |
| search           | `search/product-search-dialog`                             |

### Jira product (`jira/src/packages/`)

| Area             | Packages                                                                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| board / backlog  | `board`, `software/backlog`, `software/onboarding-nudges`, `software/roadmap-timeline-table-kit`, `software/context-menu`                                                                                                                                                                      |
| business         | `business/jfx`                                                                                                                                                                                                                                                                                 |
| calendar         | `calendar`                                                                                                                                                                                                                                                                                     |
| customer-service | `customer-service/project-settings-features-common`                                                                                                                                                                                                                                            |
| development      | `development/deeplink`                                                                                                                                                                                                                                                                         |
| issue            | `issue/field-assignee`, `issue/field-inline-edit-lite`, `issue/field-status`, `issue/field-validation-popup`, `issue/inline-assignee-picker`, `issue/inline-assignee-picker-relay`                                                                                                             |
| navigation-apps  | `navigation-apps/board-actions`, `navigation-apps/sidebar-nav4-sidebars-content-projects-subspaces`                                                                                                                                                                                            |
| plan             | `plan-create/team-step`, `portfolio-3/plan-increment-common`, `portfolio-3/portfolio`                                                                                                                                                                                                          |
| platform (jira)  | `platform/agent-picker`, `platform/hover-popover`, `platform/profilecard-next`, `platform/ui/filters`, `platform/ui/issue-table/issue-table`, `platform/ui/onboarding/onboarding-quickstart-core`, `platform/ui/popper` (jira's popper wrapper), `platform/ui/share-dialog`, `platform/vendor` |
| polaris          | `polaris/app-ideas`                                                                                                                                                                                                                                                                            |
| servicedesk      | `servicedesk/change-management-object-related-requests-panel`, `servicedesk/customer-service-access`, `servicedesk/incident-management-settings`, `servicedesk/insight-object-schema-filter`, `servicedesk/invite-team-service`, `servicedesk/itsm-features`                                   |
| work-item        | `work-item/work-item-attachments`                                                                                                                                                                                                                                                              |

(Total Jira: 37 packages.)

### Confluence product (`confluence/`)

| Package                                   | Notes                                         |
| ----------------------------------------- | --------------------------------------------- |
| `confluence/package.json` (root)          | App root — declared for hoisting / resolution |
| `next/packages/content-header`            |                                               |
| `next/packages/content-topper`            |                                               |
| `next/packages/data-classification`       |                                               |
| `next/packages/details-panel`             |                                               |
| `next/packages/object-sidebar-components` |                                               |
| `next/packages/onboarding-hover-nudge`    |                                               |
| `next/packages/reactions`                 |                                               |
| `next/packages/third-party-nudge`         |                                               |

### Other AFM products

| Product       | Packages                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adminhub`    | `adminhub` (root), `packages/pages/aviator/common/lozenge`, `packages/pages/brie`, `packages/pages/cloud-migrations/features/remediations`, `packages/pages/jsm-portal-customers`, `packages/pages/usage`      |
| `avp`         | `avp` (root), `packages/common/unsorted`                                                                                                                                                                       |
| `help-center` | `help-center` (root), `packages/common-utils/layout-primitives-util`, `src`                                                                                                                                    |
| `mercury`     | `passionfruit/packages/spf-components/plans-universal-create`, `passionfruit/packages/spf-components/teams`                                                                                                    |
| `post-office` | `integrated-teams/cc-flywheel-engagement/message-templates/confluence-editor-smart-links-draggable-changeboard`, `integrated-teams/jira-keystone/message-templates/jira-nin-grouping-with-hierarchy-spotlight` |
| `store`       | `store` (root)                                                                                                                                                                                                 |
| `volt`        | `volt` (root), `volt/studio`                                                                                                                                                                                   |

`townsquare` and the remaining AFM products (`assets-app`, `bamboo-specs`, `css-xp`, `dev-agents`,
`flask`, `growth-unified-profile`, `guard-detect`, `jsm-lite`, `kitsune`, `pipeline-definitions`,
`rovo-extension`, `team-camp`, `wac`) currently have **no** declared dependency on
`@atlaskit/popper`.

### Summary

| Area                              | Package count |
| --------------------------------- | ------------- |
| `platform/packages/design-system` | 9             |
| `platform/packages` (other)       | 15            |
| `jira/src/packages`               | 37            |
| `confluence`                      | 9             |
| `adminhub`                        | 6             |
| `avp`                             | 2             |
| `help-center`                     | 3             |
| `mercury`                         | 2             |
| `post-office`                     | 2             |
| `store`                           | 1             |
| `volt`                            | 2             |
| **Total**                         | **88**        |

> Note: app/product root `package.json` entries (e.g. `confluence/package.json`,
> `adminhub/package.json`) declare popper at the workspace root for hoisting; they do not
> necessarily import popper directly. The deprecation phases below should still target them so hoist
> declarations are removed once the leaf packages stop using popper.

---

## Direct in-source consumers (where `@atlaskit/popper` is actually imported)

The lists below show **real source-level imports** (`from '@atlaskit/popper'`) across AFM, excluding
`ambient.d.ts` shims, generated VR test files, and tooling fixtures (e.g.
`ads-mcp/.../components.codegen.tsx`, `ai-tooling/scripts/prototyping-config.tsx`,
`adoption-scanner/.../is-ads-module.tsx`,
`vscode-monorepo-explorer-packages/.../jfe-dependencies.ts`). Generated by:

```bash
grep -rln "@atlaskit/popper" <product>/ --include="*.ts" --include="*.tsx"
```

### platform/packages/design-system

| Package             | Files                                                                                                                                                                                                                                                                     | Imports                                                                          | Confidence                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `popper`            | `popper.docs.tsx`, `examples/00-basic-positioning.tsx`, `examples/01-scroll-container.tsx`, `examples/02-advanced-behaviors.tsx`, `examples/03-max-size.tsx`, `examples/constellation/popper-basic-positioning.tsx`, `examples/constellation/popper-scroll-container.tsx` | self (docs/examples)                                                             | n/a                                                                              |
| `popup`             | `src/popper-wrapper.tsx`, `src/popup.tsx`, `src/types.tsx`, `src/compositional/popup.tsx`, `src/compositional/popup-trigger.tsx`, `examples/10-popup.tsx`, `examples/11-asynchronous-popup.tsx`, `examples/constellation/popup-placement/index.tsx`                       | `Popper`, `Manager`, `Reference`, `Placement`, `Modifier`, `PopperChildrenProps` | 🟡 Medium (top-layer branch already exists; legacy branch deletes when FF flips) |
| `tooltip`           | `src/tooltip.tsx`, `src/types.tsx`, `examples/constellation/tooltip-position.tsx`                                                                                                                                                                                         | `Popper`, `Placement`                                                            | 🟡 Medium (top-layer branch exists)                                              |
| `inline-dialog`     | `src/inline-dialog.tsx`, `examples/07-popper-placements.tsx`, `examples/utils/index.tsx`                                                                                                                                                                                  | `Popper`, `Placement`                                                            | 🟡 Medium (top-layer branch exists)                                              |
| `inline-message`    | `src/types.tsx`                                                                                                                                                                                                                                                           | `Placement` re-export only                                                       | 🟢 High (re-point at `TLegacyPlacement`)                                         |
| `datetime-picker`   | `src/internal/fixed-layer.tsx`                                                                                                                                                                                                                                            | `Manager` / `Reference`                                                          | 🟡 Medium (top-layer branch exists)                                              |
| `spotlight`         | `src/ui/popover-content/index.tsx`, `src/ui/popover-provider/index.tsx`, `src/ui/popover-target/index.tsx`                                                                                                                                                                | `Manager`, `Reference`, `Popper`, `Placement`                                    | 🟡 Medium (top-layer branch exists)                                              |
| `onboarding`        | `src/components/spotlight-dialog.tsx`                                                                                                                                                                                                                                     | `Popper`                                                                         | 🟢 High (package is deprecated; remove with onboarding)                          |
| `navigation-system` | `src/ui/page-layout/__tests__/unit/panel-splitter.test.tsx`                                                                                                                                                                                                               | test mock only                                                                   | 🟢 High (delete mock once popup legacy branch is gone)                           |
| `top-layer`         | `src/placement-map/index.tsx`                                                                                                                                                                                                                                             | `Placement` type only (for `TLegacyPlacement` mapping)                           | 🟢 High (already the migration helper)                                           |

### platform/packages (non-design-system)

| Package                                                  | Files                                                                                                                                                                                            | Imports                                               | Confidence                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| `ai-mate/conversation-assistant-blank-object-experience` | `src/ui/conversation-assistant-blank-object-experience/smart-prompts-row/smart-prompt-button/template-preview/index.tsx`, `.../smart-prompt-button/test.tsx`                                     | `Popper`                                              | 🟡 Medium (single overlay; swap to `Popover` + `useAnchorPosition`)         |
| `cmdb/cmdb-aql-builder`                                  | `src/common/types/index.tsx`, `src/common/ui/multi-value/index.tsx`, `src/common/ui/single-value/index.tsx`, `src/ui/basic-aql-builder/attribute-value/index.tsx`                                | `PopperChildrenProps` (type only)                     | 🟢 High (type-only)                                                         |
| `company-hub/company-hub-common`                         | `src/ui/media-components/media-picker/ui/content/index.tsx`, `src/ui/media-components/unsplash/search-bar/index.tsx`, `src/ui/media-components/unsplash/search/index.tsx`                        | `Placement` (type)                                    | 🟢 High (type-only)                                                         |
| `confluence/project-pages`                               | `src/ui/hover-preview/index.tsx`, `src/ui/templates-panel-hover-preview/index.tsx`                                                                                                               | `Popper`                                              | 🟡 Medium                                                                   |
| `dlp/data-classification-level`                          | `src/ui/data-classification-level/types.tsx`, `examples/popup-placement.tsx`                                                                                                                     | `Placement` (type)                                    | 🟢 High (type-only)                                                         |
| `editor/editor-plugin-mentions`                          | `src/ui/PopperWrapper.tsx`                                                                                                                                                                       | `Popper as ReactPopper`, `PopperChildrenProps`        | 🟠 Low (custom wrapper around popper, virtual-anchor mention rendering)     |
| `elements/reactions`                                     | `src/components/Reactions.tsx`, `src/components/ReactionPicker.tsx`, `src/components/ReactionPicker.test.tsx`, `src/components/ReactionSummaryView.tsx`, `src/components/RepositionOnUpdate.tsx` | `Manager`, `Popper`, `Reference` (RepositionOnUpdate) | 🟠 Low (`RepositionOnUpdate` re-positions popper imperatively)              |
| `elements/share`                                         | `src/types/ShareDialogWithTrigger.ts`                                                                                                                                                            | `Placement` (type)                                    | 🟢 High (type-only)                                                         |
| `elements/user-picker`                                   | `src/types.ts`, `src/components/popup.ts`, `examples/19-popup-config.tsx`                                                                                                                        | `Placement` (type)                                    | 🟢 High (type-only)                                                         |
| `growth/nudge-tooltip`                                   | `src/components/nudge-spotlight/NudgeSpotlight.tsx`, `src/components/nudge-spotlight/types.ts`, `src/__tests__/NudgeSpotlight.test.tsx`, `src/examples/docs-examples/position.tsx`               | `Popper`                                              | 🟡 Medium                                                                   |
| `jira/jira-platform-fields`                              | `src/ui/JiraCascadingSelectField.tsx`, `src/ui/ValidationPopup.tsx`                                                                                                                              | `Manager`, `Popper`, `Reference`, `Placement`         | 🟡 Medium                                                                   |
| `jql/jql-editor`                                         | `src/plugins/autocomplete/components/autocomplete-dropdown/index.tsx`                                                                                                                            | `Popper`                                              | 🟡 Medium (autocomplete dropdown anchored to caret — verify virtual-anchor) |
| `navigation/side-nav-items`                              | `src/ui/menu-item/flyout-menu-item/flyout-menu-item-content.tsx`                                                                                                                                 | `Placement` (type, no runtime use detected)           | 🟢 High (type-only)                                                         |
| `people-and-teams/people-teams-ui`                       | `src/common/ui/inline-help-info-icon/main.tsx`                                                                                                                                                   | `Placement` (type)                                    | 🟢 High (type-only)                                                         |
| `people-and-teams/ptc-common`                            | `src/components/ProfileDetailsInlineEdit/types.ts`                                                                                                                                               | `Placement` (type)                                    | 🟢 High (type-only)                                                         |
| `people-and-teams/teams`                                 | `src/ui/team-button/ui/team-button-component/index.tsx`                                                                                                                                          | `Placement` (type)                                    | 🟢 High (type-only)                                                         |
| `post-office/ipm-choreographer`                          | `src/ui/popper/index.tsx`, `src/types/factory.ts`                                                                                                                                                | `Popper as AkPopper`, `CustomPopperProps`             | 🟠 Low (library wrapper exposing popper API)                                |
| `search/product-search-dialog`                           | `src/extensible/products/trello/trello-hover-previews/trello-popper.tsx`                                                                                                                         | `Popper`                                              | 🟡 Medium                                                                   |

### jira/src/packages (37 packages, 56 source files)

| Package                                                            | Files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Imports                                                   | Confidence                                                           |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| `board`                                                            | `src/content/cell/card/interaction-layer/InteractionLayer.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `Modifier` (type)                                         | 🟠 Low (modifier authoring)                                          |
| `business/jfx`                                                     | `src/jfx-editor/ui/suggestions-popup/SuggestionsPopup.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `Popper`                                                  | 🟡 Medium                                                            |
| `calendar`                                                         | `src/ui/calendar-renderer/add-icon-button/AddIconButton.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `customer-service/project-settings-features-common`                | `src/FeatureToggle.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `development/deeplink`                                             | `examples/DeepLinkPopupSkeleton.examples.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | example only                                              | 🟢 High (example file; rewrite or remove)                            |
| `issue/field-assignee`                                             | `src/AssigneeFieldMemo.tsx`, `src/AssigneePickerEditProps.types.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `issue/field-inline-edit-lite`                                     | `src/EditViewPopup.tsx`, `src/useEditViewPopupModifiersContext.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `Manager`, `Reference`, `PopperChildrenProps`, `Modifier` | 🟠 Low (custom modifier context)                                     |
| `issue/field-status`                                               | `src/ActionsMenu.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `Placement`, `PopperChildrenProps` (types)                | 🟢 High (type-only)                                                  |
| `issue/field-validation-popup`                                     | `src/ValidationFieldProps.types.tsx`, `src/ValidationPopper.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `issue/inline-assignee-picker`                                     | `src/AssigneePickerPopup.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `issue/inline-assignee-picker-relay`                               | `src/AssigneePickerPopupRelay.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `navigation-apps/board-actions`                                    | `src/ui/BoardActions.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `navigation-apps/sidebar-nav4-sidebars-content-projects-subspaces` | `src/SubspaceActions.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `plan-create/team-step`                                            | `src/AddTeamPopup.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `platform/agent-picker`                                            | `src/AgentPickerProfileCard.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `Popper`                                                  | 🟡 Medium                                                            |
| `platform/hover-popover`                                           | `src/HoverPopoverWithDelegator.tsx`, `tests/HoverPopoverWithDelegator.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                               | `Popper`                                                  | 🟡 Medium                                                            |
| `platform/profilecard-next`                                        | `src/common/ui/legacy-profile-card/index.tsx`, `src/common/ui/legacy-profile-card/utils.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                  | `Placement` (type)                                        | 🟢 High (type-only; file already named `legacy-profile-card`)        |
| `platform/ui/filters`                                              | `src/ui/filters/assignee/stateless/disabled-popper/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Manager`, `Reference`, `Popper`                          | 🟡 Medium                                                            |
| `platform/ui/issue-table/issue-table`                              | `src/common/ui/row-popup-button/index.tsx`, `src/common/utils/get-inline-edit-modifiers/index.tsx`, `src/ui/issue-table/insert-column-button/InsertColumnButton.tsx`                                                                                                                                                                                                                                                                                                                                                          | `Manager`, `Reference`, `Popper`, `Modifier`              | 🟠 Low (`get-inline-edit-modifiers` authors custom modifiers)        |
| `platform/ui/onboarding/onboarding-quickstart-core`                | `src/common/ui/instrumented-nudge-spotlight-card/constants.tsx`, `.../new-spotlight-card.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Placement as PopperPlacement` (type)                     | 🟢 High (type-only)                                                  |
| `platform/ui/popper`                                               | `src/ui/jira-popper.tsx`, `src/ui/choreographer-popper.tsx` (jira's own wrapper around `@atlaskit/popper`)                                                                                                                                                                                                                                                                                                                                                                                                                    | `Popper`, `CustomPopperProps`                             | 🟠 Low (jira-internal popper library; large refactor)                |
| `platform/ui/share-dialog`                                         | `src/common/types.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `platform/vendor`                                                  | `src/vendor-parcel.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | parcel side-effect import only                            | 🟢 High (vendor bundle; remove when no jira consumer needs popper)   |
| `polaris/app-ideas`                                                | `src/ui/view-content/idea-list/utils/popper-element/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `portfolio-3/plan-increment-common`                                | `src/ui/card-popper/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `portfolio-3/portfolio`                                            | `src/app-simple-plans/view/main/tabs/dependencies/skip-links/view.tsx`, `.../tabs/roadmap/fields/header/advanced-fields-menu/types.tsx`, `.../tabs/roadmap/table/body/inline-create-popper/index.tsx`, `.../inline-create-popper/test.tsx`, `.../timeline/schedule/row/date-tooltips/index.tsx`, `src/app-simple-plans/view/top/title-bar/share-report/components/custom-timeline-range/view.tsx`, `.../update-jira/review-changes-button-wrapper/review-changes-button/index.tsx`, `src/common/view/colour-picker/types.tsx` | `Manager`, `Popper`, `Reference`, `Placement` (mixed)     | 🟡 Medium (large surface — eight files; no custom modifiers spotted) |
| `servicedesk/change-management-object-related-requests-panel`      | `src/ui/onboarding/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `servicedesk/customer-service-access`                              | `src/ui/add-organizations-dialog/index.tsx`, `.../test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `servicedesk/incident-management-settings`                         | `src/common/ui/feature-toggle-v2/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `servicedesk/insight-object-schema-filter`                         | `src/common/types/index.tsx`, `src/common/ui/multi-value/index.tsx`, `src/ui/content/basic/attribute-value/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                         | `PopperChildrenProps` (type)                              | 🟢 High (type-only)                                                  |
| `servicedesk/invite-team-service`                                  | `src/services/store/actions/main.tsx`, `src/services/store/actions/types.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `PopperChildrenProps` (type)                              | 🟢 High (type-only)                                                  |
| `servicedesk/itsm-features`                                        | `src/common/ui/feature-toggle-tile/feature-toggle/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `Manager`, `Reference`                                    | 🟡 Medium                                                            |
| `software/backlog`                                                 | `src/view/card-list/inline-card-create/ai-work-create/placeholder-with-link-picker/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `software/context-menu`                                            | `src/common/types.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `software/onboarding-nudges`                                       | `src/ui/scrum-onboarding-tour/backlog-start-sprint/index.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Placement` (type)                                        | 🟢 High (type-only)                                                  |
| `software/roadmap-timeline-table-kit`                              | `src/ui/edit-dates-modal/test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | test mock                                                 | 🟢 High (test-only)                                                  |
| `software/space-dashboard`                                         | `src/SpaceDashboard.test.tsx` (test only; not in `package.json` deps list above — likely uses hoisted dep)                                                                                                                                                                                                                                                                                                                                                                                                                    | test mock                                                 | 🟢 High (test-only)                                                  |
| `work-item/work-item-attachments`                                  | `src/AddAttachmentsPopup.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Placement` (type)                                        | 🟢 High (type-only)                                                  |

### confluence/

| Package                                   | Files                                                                                                                                                                                                                         | Imports                                       | Confidence          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------- |
| `next/packages/content-header`            | `src/content-title/ContentTitleComponent.tsx`                                                                                                                                                                                 | `Reference`                                   | 🟡 Medium           |
| `next/packages/content-topper`            | `src/UnsplashPopupMenuContent.tsx`                                                                                                                                                                                            | `Placement` (type)                            | 🟢 High (type-only) |
| `next/packages/data-classification`       | `src/ContentTypeClassification/ContentTypeClassification.tsx`, `src/shared/GenericClassificationTagButton.tsx`, `src/utils/getPopupPlacementForTagVariant.ts`, `src/__tests__/shared/GenericClassificationTagButton-test.tsx` | `Placement` (type)                            | 🟢 High (type-only) |
| `next/packages/details-panel`             | `src/components/ContentClassifier.tsx`                                                                                                                                                                                        | `Placement` (type)                            | 🟢 High (type-only) |
| `next/packages/object-sidebar-components` | `src/sidebar-buttons/AudioButton.tsx`                                                                                                                                                                                         | `Manager`, `Reference`, `PopperChildrenProps` | 🟡 Medium           |
| `next/packages/reactions`                 | `src/Reactions.tsx`                                                                                                                                                                                                           | `Placement` (type)                            | 🟢 High (type-only) |
| `next/packages/third-party-nudge`         | `src/ui/nudge-spotlight/index.tsx`                                                                                                                                                                                            | `Popper`                                      | 🟡 Medium           |

### Other AFM products

| Product       | Files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Imports                                                                                                                 | Confidence                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `adminhub`    | `packages/pages/aviator/common/lozenge/src/ui/popup-tooltip.tsx`, `packages/pages/brie/src/ui/common/brie-common-purchase-button-action.tsx`, `packages/pages/brie/src/ui/pages/org-dashboard/components/org-begin-purchase-popup-buttons/org-policy-restore-block-purchase-buttons.tsx`, `packages/pages/cloud-migrations/features/remediations/src/components/remediation-page/remediations-table/components/entity-type-level-select/entity-type-level-select.tsx`, `.../error-message/error-message-popper.tsx`, `.../field-input/field-input.tsx`, `packages/pages/cloud-migrations/features/remediations/src/components/remediation-page/status-panel-with-popper/status-panel-with-popper.tsx`, `.../__tests__/status-panel-with-popper.rtl.tsx`, `packages/pages/jsm-portal-customers/src/ui/jsm-table-row-status-content.tsx`, `packages/pages/usage/src/ui/platform-details-rovo-dev-users-content.tsx` | `Placement` (lozenge, brie), `Popper` (error-message-popper), `Manager`/`Popper`/`Reference` (status-panel-with-popper) | 🟡 Medium (mostly type-only or simple `Popper`; status-panel needs review) |
| `avp`         | `packages/common/unsorted/src/common/ui/forms/overlay_input.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `Popper`                                                                                                                | 🟡 Medium                                                                  |
| `help-center` | `packages/common-utils/layout-primitives-util/src/events/events.tsx`, `src/view/common/settings-wrapper/settings-wrapper.tsx`, `src/view/layout-primitives/add-section-button/add-section-button.tsx`, `src/view/layout-primitives/primitive-name/primitive-name.tsx`, `src/view/layout-primitives/selected-section-settings/selected-section-settings.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `Manager`, `Reference`, `Popper`, `Placement`                                                                           | 🟡 Medium (small surface; no custom modifiers)                             |
| `mercury`     | `passionfruit/packages/spf-components/plans-universal-create/src/create-plan-form/entries/portfolio/menu/PortfolioSearchMenu.tsx`, `passionfruit/packages/spf-components/teams/src/team-search-menu/TeamSearchMenu.tsx`, `src/packages/Goals/AddGoalButton/AddGoalButton.tsx`, `src/packages/StrategicEvents/Proposal/Goals/TableHeader/AddGoalButton.tsx`, `src/packages/StrategicEvents/Proposals/Table/Columns/GoalsColumn/GoalsCellInlineEditView.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Placement` (type)                                                                                                      | 🟢 High (type-only)                                                        |
| `post-office` | `integrated-teams/cc-flywheel-engagement/message-templates/confluence-editor-smart-links-draggable-changeboard/src/placements/in-app/screen-space-flags/render.tsx`, `integrated-teams/confluence-integrations/message-templates/project-pages-revamp-onboarding-spotlight/src/placements/in-app/screen-space-flags/components/revamp-spotlight.tsx`, `integrated-teams/jira-keystone/message-templates/jira-nin-grouping-with-hierarchy-spotlight/src/TestComponent.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                         | `Reference`                                                                                                             | 🟡 Medium (small message-template surfaces)                                |
| `volt`        | `studio/src/apps/devsphere/web/routes/skills/components/playground-onboarding-modal.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `Reference`                                                                                                             | 🟡 Medium                                                                  |
| `store`       | _no direct source imports found (root `package.json` entry only)_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | n/a                                                                                                                     | 🟢 High (drop dep)                                                         |
| `townsquare`  | _no direct source imports found_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | n/a                                                                                                                     | 🟢 High (no work needed)                                                   |

### Direct-import summary

| Area                              | Source files | Packages | 🟢 High | 🟡 Medium | 🟠 Low |
| --------------------------------- | ------------ | -------- | ------- | --------- | ------ |
| `platform/packages/design-system` | ~28          | 10       | 4       | 5         | 0      |
| `platform/packages` (other)       | ~36          | 18       | 9       | 6         | 3      |
| `jira/src/packages`               | 56           | 37       | 21      | 12        | 4      |
| `confluence/next/packages`        | 10           | 7        | 5       | 2         | 0      |
| `adminhub`                        | 10           | 1        | 0       | 1         | 0      |
| `avp`                             | 1            | 1        | 0       | 1         | 0      |
| `help-center`                     | 5            | 1        | 0       | 1         | 0      |
| `mercury`                         | 5            | 1        | 1       | 0         | 0      |
| `post-office`                     | 3            | 1        | 0       | 1         | 0      |
| `volt`                            | 1            | 1        | 0       | 1         | 0      |
| `store`                           | 0            | 1        | 1       | 0         | 0      |
| `townsquare`                      | 0            | 0        | 0       | 0         | 0      |
| **Total**                         | **~155**     | **88**   | **41**  | **30**    | **7**  |

(Confidence counts are at the **product/area level** for the small AFM products that have a single
line in the table; design-system, platform-other, and jira/confluence are counted at the **package**
level. The seven 🟠 Low packages are: `editor/editor-plugin-mentions`, `elements/reactions`,
`post-office/ipm-choreographer`, `jira board`, `jira issue/field-inline-edit-lite`,
`jira platform/ui/issue-table/issue-table`, `jira platform/ui/popper`.)

### What is being imported

Across all consumers, the popper API surface in active use is essentially:

| Symbol                                              | Typical use                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Popper` (default render-prop component)            | Direct positioning of a custom overlay (no wrapping `<Popup>` / `<Tooltip>`)                     |
| `Manager`, `Reference`                              | Hand-rolled positioning (e.g. `popup`, `spotlight`, `datetime-picker`, `editor-plugin-mentions`) |
| `Placement` type                                    | Re-exported as `PopupPlacement` / `Position` from many packages' public types                    |
| `Modifier`, `PopperChildrenProps`, `StrictModifier` | Custom modifier authoring (popup, jira `get-inline-edit-modifiers`)                              |
| `CustomPopperProps`                                 | Library wrappers around popper (post-office `ipm-choreographer`, jira `platform/ui/popper`)      |

When designing the deprecation, the **type re-exports** (`Placement`) and the **`Modifier`
authoring** path will need explicit replacements in `@atlaskit/top-layer` (or a documented rewrite
pattern) before the runtime exports can be removed.

---

## Gap analysis: `@atlaskit/popper` API vs. `@atlaskit/top-layer` today

The tables below compare every public export of `@atlaskit/popper` against what
`@atlaskit/top-layer` ships today (`Popover`, `Popup`, `Dialog`, `useAnchorPosition`,
`placement-map`, `arrow`).

### Components and hooks (runtime values)

| popper export                                | popper signature                                                                                                                                                                                                                                                           | top-layer equivalent                                                                                                                                                                                                                                                                                                | Status today                                                    | Used by                                                                                                                                 | Recommendation                                                                                                                                                                                                                                                 |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Popper`                                     | `<Popper placement offset modifiers strategy referenceElement shouldFitViewport>{({ ref, style, placement, arrowProps }) => ...}</Popper>` — render-prop wrapper around `react-popper` with built-in `flip` / `preventOverflow` / `offset` / optional `maxSize` modifiers. | `Popover` (+ `useAnchorPosition` for the headless case). The render-prop ↔ `popovertarget` model is fundamentally different: top-layer mounts the popover into the browser top layer; consumers do not wire `ref`/`style` themselves.                                                                               | ✅ Covered conceptually, ❌ not API-compatible                  | ~30 callsites use `<Popper>` directly                                                                                                   | **Do not add.** Document the rewrite pattern (`<Popover open><Surface/></Popover>` + `useAnchorPosition`) and migrate callsites. A drop-in render-prop facade would re-introduce the legacy mental model.                                                      |
| `Manager`, `Reference` (from `react-popper`) | Top-level `<Manager>` + `<Reference>{({ ref }) => <Anchor ref={ref}/>}</Reference>` to provide an anchor without rendering a popper                                                                                                                                        | `useAnchorPosition({ anchorRef, popoverRef, placement })` (entry point `@atlaskit/top-layer/use-anchor-position`).                                                                                                                                                                                                  | ✅ Covered                                                      | ~25 callsites use `Manager`/`Reference`                                                                                                 | **Do not add.** Recommend `useAnchorPosition`. The `Reference` render-prop has no top-layer equivalent because the new world uses normal refs/`anchorRef`.                                                                                                     |
| `placements`                                 | Array of every Popper.js placement string (`['top', 'top-start', 'top-end', 'bottom', ...]`)                                                                                                                                                                               | No equivalent constant. `TLegacyPlacement` is a type union; no exported runtime array.                                                                                                                                                                                                                              | ⚠️ Not covered (runtime value missing)                          | Examples / tooling that iterate over placements (Popper docs/examples). Search shows no production callsites use `placements` directly. | **Add a tiny `legacyPlacements` constant** to `@atlaskit/top-layer/placement-map` if any consumer is found. Otherwise leave it out and let consumers inline the array.                                                                                         |
| `getMaxSizeModifiers`                        | Internal helper exposing the `maxSize` / `maxSizeData` Popper.js modifiers; only consumed by popper's own `Popper` component when `shouldFitViewport={true}`.                                                                                                              | `useAnchorPosition` JS fallback already enforces viewport bounds; CSS Anchor Positioning + `position-try-fallbacks` handles it for modern browsers. There is no first-class `shouldFitViewport` knob on `Popover` yet — the equivalent is to set `max-block-size: anchor-size(...)` / `max-inline-size` via `xcss`. | ⚠️ Partial (no first-class API for "fit viewport with padding") | Internal to popper only; not re-exported.                                                                                               | **Add a `shouldFitViewport` (or `maxSize`) prop to `Popover`** that emits the appropriate `max-block-size` / `max-inline-size` declarations + matching JS-fallback math. This is the only behavioural feature that does not have a clean migration path today. |

### Types

| popper export                    | Top-layer equivalent                                                                                          | Status today                         | Used by (callsites that import the symbol)                                                                                                                                                                                                                                        | Recommendation                                                                                                                                                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Placement`                      | `TLegacyPlacement` (union) + `TPlacementOptions` (object) in `placement-map`                                  | ✅ Covered                           | **Heavily used (~30+ packages re-export it as `PopupPlacement` / `Position`).** Examples: `inline-message`, `tooltip`, `inline-dialog`, `dlp/data-classification-level`, `share`, `user-picker`, `nudge-tooltip`, all jira `field-*` packages, confluence `data-classification`.  | **Already added (`TLegacyPlacement`).** Keep it as the migration shim. Once consumers stop re-exporting `Placement`, the union itself can move into a `@deprecated` legacy module.                                                                                                       |
| `PopperChildrenProps`            | None — render-prop arg is gone in the top-layer model                                                         | ❌ Not covered                       | `cmdb/cmdb-aql-builder`, `editor-plugin-mentions`, `jira/issue/field-status`, `jira/servicedesk/insight-object-schema-filter`, `jira/servicedesk/invite-team-service`, `confluence/object-sidebar-components`. Used as the type of a function-as-child in custom popper wrappers. | **Do not add.** Document the rewrite (replace render-prop with `useAnchorPosition` returning normal refs). Type only exists because of the legacy render-prop API.                                                                                                                       |
| `Modifier`, `StrictModifier`     | None — Popper.js modifier authoring has no top-layer equivalent                                               | ❌ Not covered                       | `popup` (internal), `jira/board`, `jira/issue/field-inline-edit-lite`, `jira/platform/ui/issue-table/issue-table` (`get-inline-edit-modifiers`). Used to author custom popper modifiers (e.g. `topLeftBoundary`).                                                                 | **Add an imperative escape hatch on `useAnchorPosition`**: `onPosition({ anchorRect, popoverRect }) => Partial<{ top, left }>` callback so callsites that need bespoke math can run after the CSS / fallback path. Do **not** port the Popper.js modifier pipeline — keep it imperative. |
| `PopperProps`                    | Internal to `react-popper`. No equivalent.                                                                    | ❌ Not covered                       | None directly outside popper itself.                                                                                                                                                                                                                                              | **Do not add.** Drop with popper.                                                                                                                                                                                                                                                        |
| `ManagerProps`, `ReferenceProps` | Internal to `react-popper`. No equivalent.                                                                    | ❌ Not covered                       | None directly outside popper itself.                                                                                                                                                                                                                                              | **Do not add.** Drop with popper.                                                                                                                                                                                                                                                        |
| `PopperArrowProps`               | `@atlaskit/top-layer/arrow` (component-side; no `arrowProps` render-prop arg)                                 | ❌ Not covered (different model)     | None directly outside popper itself.                                                                                                                                                                                                                                              | **Do not add.** The arrow is positioned by `useAnchorPosition` + `<Arrow>`, not handed back as `arrowProps`.                                                                                                                                                                             |
| `VirtualElement`                 | Supported by `useAnchorPosition` (anchor can be any `Element`-like ref); no top-layer-specific type alias yet | ⚠️ Partial (works, but undocumented) | `popper` itself (`CustomPopperProps.referenceElement`); transitively used by `editor-plugin-mentions`, `inline-dialog`, jira `inline-create-popper`, jira `colour-picker` (autocomplete-at-cursor patterns).                                                                      | **Add a `TVirtualAnchor` type and document the pattern.** Also accept a virtual anchor (rect-getter or DOMRect) on `useAnchorPosition` so cursor / range anchors work without manually creating a fake DOM node.                                                                         |
| `CustomPopperProps`              | None — popper's bespoke prop bag                                                                              | ❌ Not covered                       | `post-office/ipm-choreographer/src/types/factory.ts` (re-exports it as part of a public API), `jira/platform/ui/popper`. Library wrappers that surface popper's prop shape to their own consumers.                                                                                | **Do not add.** Library wrappers should be rewritten to expose top-layer's prop shape. If a transitional shim is unavoidable, ship one inside the consuming library, not in `@atlaskit/top-layer`.                                                                                       |

### Recommendation summary

| Action                                                                                                      | Rationale                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Add a `shouldFitViewport` (or `maxSize`) prop to `Popover`**                                           | Only behavioural feature with no clean migration path; popper's `getMaxSizeModifiers` is a real product capability used by `Popper({ shouldFitViewport: true })`.           |
| ✅ **Add an `onPosition` callback to `useAnchorPosition`** (imperative override hook)                       | Unblocks the four 🟠 Low jira packages that author custom Popper.js modifiers; keeps the API surface small (one callback, no modifier pipeline).                            |
| ✅ **Add `TVirtualAnchor` type + document virtual-anchor pattern on `useAnchorPosition`**                   | Required for `editor-plugin-mentions`, autocomplete dropdowns, cursor-anchored tooltips. The capability exists; only docs/types are missing.                                |
| 🟡 **Maybe add a `legacyPlacements` runtime constant** to `placement-map`                                   | Only if the audit finds production callsites using `placements` (currently appears examples-only). Tiny addition; can be added on demand.                                   |
| ❌ **Do not** ship a `<Popper>`-shaped render-prop facade                                                   | Re-introduces the legacy mental model; defeats the point of moving to anchor positioning. Migrate callsites instead.                                                        |
| ❌ **Do not** re-export `Modifier` / `PopperProps` / `ManagerProps` / `ReferenceProps` / `PopperArrowProps` | These types only exist because of `react-popper`. The top-layer model does not have modifiers or render-prop args.                                                          |
| ❌ **Do not** ship `PopperChildrenProps` shim                                                               | The render-prop is the thing being replaced; the type only makes sense in the old world.                                                                                    |
| ❌ **Do not** ship `CustomPopperProps` shim                                                                 | Library wrappers (post-office `ipm-choreographer`, jira `platform/ui/popper`) should be rewritten to surface top-layer's prop shape; shimming here just postpones the work. |

The net new top-layer surface required to retire popper is therefore **three small additions**:
`Popover`'s `shouldFitViewport` prop, `useAnchorPosition`'s `onPosition` callback, and the
`TVirtualAnchor` type with documented virtual-anchor support. Everything else is already there.

---

## Migration approach for `@atlaskit/popper` itself

Migrating popper to top-layer means **replacing each popper usage at the callsite**, not swapping
the popper module's internals. There is no like-for-like top-layer drop-in for the render-prop API,
so the strategy is:

1. **Add the missing primitives in `@atlaskit/top-layer` first.** Today top-layer offers `Popover`,
   `Popup`, `Dialog`, `useAnchorPosition`, and the `placement-map`. Before consumer migrations can
   begin we need:
   - `useAnchorPosition` to be a documented public hook that covers everything `Manager` /
     `Reference` is used for, including **virtual anchors** (cursor / range-based, used by editor
     mentions and tooltip).
   - A documented mapping for each Popper.js modifier we still need (`flip`, `preventOverflow`,
     `offset`, `maxSize`) onto CSS Anchor Positioning (`position-try-fallbacks`, `--anchor-offset`,
     `max-block-size` / `max-inline-size` fallbacks). Most of this exists; the viewport-fit /
     `shouldFitViewport` story should be made first-class (currently only available through
     `Popover` props).
   - A public `TLegacyPlacement` re-export so consumers that re-export `Placement` can keep a stable
     type during the transition window.
2. **Migrate consumers in waves**, starting with the simplest (type-only imports), then `<Popper>`
   component callsites, then `Manager` / `Reference` callsites, and finally the library wrappers and
   modifier-authoring callsites.
3. **Mark `@atlaskit/popper` exports as `@deprecated`** once each export has a documented top-layer
   equivalent. Add a ratchet rule to prevent new imports.
4. **Delete legacy branches inside design-system overlays** (popup / tooltip / inline-dialog /
   spotlight / datetime-picker) once `platform-dst-top-layer` is permanently on. This removes the
   largest single block of popper imports.
5. **Retire `@atlaskit/popper`** once direct consumers reach zero (final `major` empty release).

The hardest open questions:

- **Custom modifiers.** A handful of callsites (jira `get-inline-edit-modifiers`,
  `field-inline-edit-lite`, `field-status` `Modifier` typings, board `InteractionLayer` `Modifier`)
  author Popper.js modifiers directly. CSS Anchor Positioning has no equivalent to arbitrary user
  modifiers; these need to be expressed as `position-try-fallbacks` or as imperative DOM math via a
  `useAnchorPosition` `onPosition` callback. The exact callback surface needs designing.
- **`CustomPopperProps` library wrappers.** `jira/src/packages/platform/ui/popper` and
  `post-office/ipm-choreographer/src/ui/popper` wrap popper to expose a product-specific API. These
  need their own internal migrations and may continue to exist as wrappers around `Popover` /
  `useAnchorPosition`.
- **`@popperjs/core` virtual elements.** Editor plugin mentions, inline-dialog, and a few jira
  callsites pass a custom `referenceElement`. `useAnchorPosition` supports this but the pattern
  needs explicit documentation and tests.

### Confidence rating rubric

The confidence column in the tables below indicates **how safely a callsite can be migrated to
`@atlaskit/top-layer`**, based on which popper symbols it imports and what the surrounding code
does.

| Rating        | Meaning                                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟢 **High**   | Type-only import (`Placement`, `PopperChildrenProps`, `Modifier` as a type). Swap the import for `TLegacyPlacement` (or remove). Mechanical, low risk, no behavioural change.                         |
| 🟡 **Medium** | Uses `<Popper>` component, `Manager`/`Reference`, or imports `Placement` runtime-side. Can be ported to `Popover` / `Popup` / `useAnchorPosition`. Needs per-callsite VR + behavioural review.        |
| 🟠 **Low**    | Authors custom Popper.js modifiers, wraps popper as a library (`CustomPopperProps`), uses `VirtualElement`, or composes popper with bespoke plumbing. Needs new top-layer API or substantial rewrite. |

The per-package confidence shown below is the **worst case across the package's files** (so a
package that mostly imports types but has one `Modifier` author callsite is rated 🟠 Low).

---

## Deprecation plan

This note is **planning only** — no code changes are proposed here.

### Phase 1 — Finish in-DS migrations (current)

- Keep `@atlaskit/popper` as-is.
- Confirm every overlay component listed above ships a top-layer branch that does **not** import
  `@atlaskit/popper`. Popup, tooltip, inline-dialog, spotlight, datetime-picker are done.
- Decide what to do with:
  - `inline-message` `Placement` re-export — re-point at `TLegacyPlacement` or hide behind a new
    top-layer-aware type alias.
  - `onboarding` — confirm deprecation; do not invest in a top-layer branch.
  - `navigation-system` test mock — replace with a top-layer-aware mock once popup's legacy branch
    goes away.

### Phase 2 — Flip the flag, mark popper deprecated

When `platform-dst-top-layer` is permanently on:

- Remove the legacy branch from each consumer (`popup-legacy.tsx` / `Legacy` paths).
- Mark every export in `@atlaskit/popper` with `@deprecated` JSDoc pointing at the matching
  `@atlaskit/top-layer` export.
- Add `@atlaskit/popper` to the deprecation list enforced by
  `@repo/internal/deprecation/no-deprecated-imports`.
- Ship a `minor` changeset that documents the deprecation (do not break consumers yet).

### Phase 3 — Remove popper from internal consumers

- Drop `@atlaskit/popper` from each DS package's `package.json` once its legacy branch is gone.
- Run `afm install --mode update-lockfile` to refresh the lockfile.
- Confirm no internal consumers remain via:

  ```bash
  git grep -l "@atlaskit/popper" packages/
  ```

### Phase 4 — Archive `@atlaskit/popper`

Once internal usage is zero and external consumers have been given a deprecation window:

- Final `major` release: empty re-exports / package removal.
- Update `decisions/migration-roadmap.md` to mark popper as **Retired**.
- Remove the package from `packages/design-system/popper/` (or convert to a thin redirect that
  re-exports the top-layer equivalents for any straggling consumers).

---

## Out of scope / open questions

- **External consumers** (editor, search, jira, confluence, elements, post-office). These are not
  gated by `platform-dst-top-layer` for popper specifically — they will need their own migration
  plan during Phase 2/3.
- **`VirtualElement` users.** Confirm `useAnchorPosition` covers every existing virtual-anchor use
  case (e.g. context menus that anchor to the cursor) before deprecating.
- **`Manager` / `Reference` consumers** that compose popper into bespoke patterns — audit during
  Phase 2 and either offer a hook-based replacement or document the recommended top-layer pattern.
- **Compiled CSS migration** of any top-layer features popper consumers rely on (see
  [decisions/compiled.md](../decisions/compiled.md)).

---

## Related docs

- [decisions/migration-roadmap.md](../decisions/migration-roadmap.md) — popper row in the
  infrastructure table.
- [architecture/positioning.md](../architecture/positioning.md) — how anchor positioning + the JS
  fallback replace Popper.js.
- [architecture/overview.md](../architecture/overview.md) — top-layer entry points and when to use
  which primitive.
- Per-consumer migration notes: [popup](./popup-migration.md), [tooltip](./tooltip-migration.md),
  [inline-dialog](./inline-dialog-migration.md), [spotlight](./spotlight-migration.md),
  [datetime-picker](./datetime-picker-migration.md).
