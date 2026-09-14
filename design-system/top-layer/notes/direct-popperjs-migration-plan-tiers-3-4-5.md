# Direct Popper.js Migration Plan for Tiers 3, 4, and 5

## Objective

Remove custom Popper dependency ownership from AFM. All consumers move to an API owned by
`@atlaskit/popper`, with reversible runtime changes under `platform-dst-popper-consolidation`.

Minor visual deviations are acceptable for Popper v1 rewrites. Public API changes, update loops,
incorrect strategy changes, and unexpected overflow behavior are not acceptable.

This plan does not couple consolidation to top-layer behavior. The consolidation flag controls only
the direct dependency migration.

## Migration rules

1. Type-only imports move directly to `@atlaskit/popper/popper` without a runtime gate.
2. Every runtime callsite selects the old and new implementation behind
   `platform-dst-popper-consolidation`.
3. Existing Popper v2 consumers use exact compatibility re-exports when a component rewrite would
   reinterpret their API.
4. Popper v1 consumers use explicit adapters and document each approximation.
5. Each consumer gets a forced-flag smoke test before rollout.
6. Direct fallback imports are removed only after the flag-on test matrix is green and rollout is
   stable.

## Wrapper prerequisites

### Component API

`@atlaskit/popper/popper` provides the existing render-prop component and Popper v2 types. Consumers
that need migration-specific lifecycle compatibility keep it inside their adapter instead of
expanding the shared component API.

### Exact React Popper API

`@atlaskit/popper/react-popper` re-exports:

- `Manager`
- `Reference`
- raw `Popper`
- `usePopper`
- modifier and render-prop types

This entry point is the preferred destination for direct `react-popper` consumers whose contract
already includes raw modifiers, strategies, or hook return values.

### Imperative API

`@atlaskit/popper/unsafe-imperative` re-exports Popper v2 `createPopper` and its instance types. It
is the preferred destination for non-React consumers.

## Tier 3: react-popper consumers

### Select PopupSelect

Use the exact compatibility entry point. Do not translate `popperProps` into ADS `CustomPopperProps`
because PopupSelect accepts arbitrary raw modifiers, strategy, placement, and `onFirstUpdate` from
its consumers.

Implementation:

- keep direct `react-popper` imports as flag-off aliases
- add equivalent aliases from `@atlaskit/popper/react-popper`
- choose `Manager`, `Reference`, and `Popper` from the same implementation for each render
- preserve `@popperjs/core` while the direct fallback remains, because it is a `react-popper` peer
- remove both direct dependencies during flag cleanup

Verification:

- open and close with pointer and keyboard while the consolidation flag is forced on
- assert the menu is visible and anchored near the trigger
- run informational visual regression with the menu open

### Rovo extension Popup and HighlightSurface

Use `usePopper` from the exact compatibility entry point. Select the hook implementation before the
unconditional hook call so hook order remains stable.

Verification:

- unit tests assert flag-on selects the wrapper hook and flag-off selects the fallback
- existing popup interaction tests run with the flag forced on by default
- extension typecheck and full unit suite pass

## Tier 4: imperative Popper v2 consumers

### Editor VanillaTooltip

Use `createPopper` from `@atlaskit/popper/unsafe-imperative` when the flag is on. Preserve the
direct `@popperjs/core` fallback until cleanup.

The migration must preserve:

- `setOptions`
- `update`
- `destroy`
- event-listener modifier toggling
- the existing starting and ending offsets

Because the wrapper entry point re-exports the same implementation, no visual deviation is expected.

## Tier 5: Popper v1 consumers

### Shared defaults

Popper v1 defaults are not the same as the ADS wrapper defaults. Each adapter must choose
explicitly:

- `strategy="absolute"` for all migrated v1 callsites in this scope
- `offset={[0, 0]}` where the v1 caller had no gap
- whether flip, overflow prevention, and hide are enabled
- whether a boundary maps to v2 `boundary` or `rootBoundary`

Do not use `shouldFitViewport` as a synonym for prevent-overflow. It installs max-size modifiers and
can shrink content even when the original caller disabled overflow handling.

### Editor Layer to PopperInterop

The flag-on implementation is named `PopperInterop`. Editor owns `Layer`; no external class identity
contract is retained.

Required parity:

- absolute strategy
- requested placement with flip disabled
- prevent-overflow disabled
- hide disabled
- v1 offset string converted to `[skidding, distance]`
- content stays hidden until Popper supplies its initial position
- old `onPositioned` prop is called by a one-shot local `afterWrite` modifier

React Popper commits calculated styles in its `write` modifier. The local modifier runs in
`afterWrite`, reads the latest callback through a ref, and sets its one-shot guard before invoking
the callback. This preserves the useful timing point without expanding `@atlaskit/popper` or
allowing callback-driven state updates to create a positioning loop.

The browser smoke must open the Editor list menu, verify its location relative to the toolbar
trigger, select an item, and verify the document update.

### Jira investigation chart

Store a Popper virtual reference for the hovered chart element and render the tooltip through ADS
Popper when the flag is on.

Required parity:

- `placement="auto"`
- absolute strategy
- no added viewport max-size behavior
- click-outside and tooltip dismissal remain unchanged

### AVP SelectMenu

Render the existing menu content through ADS Popper when the flag is on.

Required parity:

- absolute strategy
- zero offset
- document body boundary
- both overflow axes enabled to approximate v1 side-priority handling
- tether enabled to preserve v1 keep-together behavior
- existing delayed `update()` workaround remains

### AVP ChartioOverlay

Convert the observed Popper v1 modifier object to explicit v2 modifiers. The adapter supports:

- boundary conversion, including viewport to `rootBoundary`
- flip behavior arrays and clockwise or counterclockwise fallback order
- variation flipping
- keep-together through v2 tethering
- offset string, number, and tuple inputs used by AVP
- arrow element and padding
- `computeStyle` to `computeStyles`
- `applyStyle` to `applyStyles`
- hide enablement

Unknown v1 custom modifier callbacks are not forwarded because v1 and v2 callback signatures are
incompatible. The audit found no production ChartioOverlay caller using a custom callback.

`onCreate` is called by a local one-shot `afterWrite` modifier. Its guard is recreated only when the
Popper key changes for a new target or placement, while the callback is read through a ref. An
inline callback that updates state therefore cannot restart the lifecycle and loop.

## Feature flag sequence

For each consumer:

1. Land the gated implementation with unit smoke coverage.
2. Run browser and visual tests with the consolidation flag forced on.
3. Enable the flag for internal and development cohorts.
4. Monitor errors, update-depth failures, clipped overlays, and placement changes.
5. Expand rollout.
6. Remove the flag-off code and direct dependency after stability is established.

Runtime compatibility swaps are also gated. This is deliberately more conservative than required for
exact re-exports and gives every team the same rollback mechanism.

## Test matrix

| Consumer              | Unit                                      | Browser interaction                       | Visual regression          |
| --------------------- | ----------------------------------------- | ----------------------------------------- | -------------------------- |
| Popper package        | compatibility entry points                | existing Popper coverage                  | existing Popper VR         |
| Editor Layer          | flag selection and update-loop regression | list dropdown interaction and placement   | Editor list dropdown open  |
| Editor VanillaTooltip | constructor path and interaction          | existing Editor coverage                  | existing tooltip coverage  |
| Select PopupSelect    | flag selection                            | open, position, select, close             | open PopupSelect           |
| Jira chart            | flag selection and adapter props          | chart tooltip smoke where fixture permits | chart fixture where stable |
| AVP ChartioOverlay    | modifier translation and callback loop    | representative overlay smoke              | open overlay               |
| AVP SelectMenu        | adapter props and selection               | representative menu smoke                 | open menu                  |
| Rovo extension        | wrapper and fallback hook selection       | existing extension interaction suite      | extension-owned coverage   |

Tests must force `platform-dst-popper-consolidation` on. Tests that only mock the wrapper prove
wiring, not positioning, so browser or visual coverage must use a real Popper implementation.

## Prevention rule

The AFM global ratchet scans all changed JavaScript and TypeScript module extensions:

- JS, JSX, TS, TSX
- MJS, CJS, MTS, CTS

It rejects static imports, side-effect imports, dynamic imports, requires, and Jest or Vitest mocks
that target `popper.js`, `@popperjs/core`, or `react-popper` outside the wrapper and generated or
prebuilt exclusions.

The compatibility entry points are valid destinations and are not separately frozen.

## Cleanup completion criteria

The migration is complete when:

1. the consolidation flag is enabled for all affected products
2. forced-flag unit, browser, and visual tests are green
3. no update-loop or overlay-positioning regression is observed during rollout
4. every flag-off branch is deleted
5. direct Popper dependencies are removed from consumer package manifests
6. repository search finds direct Popper imports only inside `@atlaskit/popper`, generated files,
   and intentional build fixtures
