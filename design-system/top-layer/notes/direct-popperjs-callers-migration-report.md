# Direct Popper.js Callers Migration Report

## Goal

AFM consumers must stop owning direct dependencies on `popper.js`, `@popperjs/core`, and
`react-popper`. `@atlaskit/popper` becomes the single dependency and API boundary.

This consolidation is independent of the top-layer rollout. A consumer can use the component API,
the exact `react-popper` compatibility API, or the imperative compatibility API. The correct target
is the one that preserves the consumer contract with the least behavior change.

## Version baseline

| Consumer dependency          | Resolved version | Destination dependency                 |          Resolved version |
| ---------------------------- | ---------------: | -------------------------------------- | ------------------------: |
| Platform and AVP `popper.js` |           1.16.1 | `@atlaskit/popper` -> `@popperjs/core` |                    2.11.8 |
| Jira `popper.js`             |           1.15.0 | `@atlaskit/popper` -> `@popperjs/core` |                    2.11.8 |
| AFM `react-popper`           |            2.3.0 | `@atlaskit/popper/react-popper`        | same 2.3.0 implementation |

The Popper v1 consumers require a semantic adapter. The Popper v2 and `react-popper` consumers can
use exact re-exports, which avoids an unnecessary behavioral rewrite.

## Implemented wrapper surface

| Entry point                          | API                                                              | Intended use                                            |
| ------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------- |
| `@atlaskit/popper/popper`            | ADS `Popper` and Popper v2 types                                 | React consumers that can use the ADS component contract |
| `@atlaskit/popper/react-popper`      | `Manager`, `Reference`, raw `Popper`, `usePopper`, related types | Exact migration of existing `react-popper` consumers    |
| `@atlaskit/popper/unsafe-imperative` | `createPopper`, `Instance`, `State`                              | Non-React imperative consumers                          |

The standard ADS component API is unchanged. Editor and AVP preserve their legacy creation timing
with consumer-owned, one-shot `afterWrite` modifiers. Keeping those lifecycle adapters local avoids
adding a shared API for behavior required by only two migrations.

## Consumer inventory and decision

### Type-only consumers

Placement, virtual element, modifier, and state types move to `@atlaskit/popper/popper`. Type-only
changes do not need a runtime feature gate.

Affected areas include Tooltip, User Picker, Media UI, Editor helpers, and Jira packages. The root
Popper barrel remains conservative; compatibility types are exposed from the explicit `/popper`
entry point.

### Select PopupSelect

PopupSelect exposes raw `PopperProps` to its consumers. Translating those props into the ADS
component API would reinterpret strategies, modifiers, and `onFirstUpdate`.

Decision: preserve the exact API through `@atlaskit/popper/react-popper`. The runtime selection is
behind `platform-dst-popper-consolidation`:

- flag off: direct `react-popper` fallback
- flag on: the same implementation exported through `@atlaskit/popper`
- cleanup: remove the fallback import and direct dependencies

This is dependency consolidation with intentionally zero positioning deviation.

### Rovo extension

The definitions popup and selection highlight surface use `usePopper`, including a virtual reference
inside an extension overlay.

Decision: use the exact hook from `@atlaskit/popper/react-popper`. Both callsites select the wrapper
or legacy import behind the consolidation flag. The extension overlay and shadow DOM behavior are
unchanged.

### Editor VanillaTooltip

VanillaTooltip is intentionally non-React and requires `createPopper`, `setOptions`, `update`, and
`destroy`.

Decision: use `@atlaskit/popper/unsafe-imperative`. The flag selects the wrapper re-export or the
legacy direct import. Both paths call the same Popper v2 implementation.

### Editor Layer

Editor owns this internal component. Its Popper v1 contract is more specific than the ADS defaults:

- `strategy: 'absolute'`
- flip disabled
- prevent-overflow disabled
- hide disabled
- offset string translated to the v2 tuple
- `onPositioned` fires once after the initial applied position

Decision: replace the implementation with the Editor-owned `PopperInterop` function when the flag is
on. `PopperInterop` explicitly preserves those semantics and owns a one-shot `afterWrite` modifier
that calls the existing `onPositioned` prop after React Popper commits its styles. The legacy class
remains only as the flag-off fallback until cleanup.

### Jira investigation chart tooltip

The chart created a Popper v1 instance for each tooltip target.

Decision: render the tooltip through ADS Popper with the virtual reference, `placement="auto"`, and
`strategy="absolute"`. No viewport-size modifier is added because the v1 caller did not request one.
The Popper v1 path remains behind the flag-off branch.

The Jira vendor parcel now imports `@atlaskit/popper/react-popper` for the same bundling side effect
instead of owning a direct `react-popper` dependency.

### AVP ChartioOverlay and SelectMenu

Both consumers use Popper v1 with absolute positioning. Their flag-on branches use ADS Popper with
`strategy="absolute"` and explicit zero offsets where v1 defaulted to no gap.

ChartioOverlay translates its supported Popper v1 modifier object into Popper v2 options:

| Popper v1 input                                      | Popper v2 output                                          |
| ---------------------------------------------------- | --------------------------------------------------------- |
| `boundariesElement: 'viewport'`                      | `rootBoundary: 'viewport'`                                |
| `boundariesElement: 'scrollParent'`                  | `boundary: 'clippingParents'`                             |
| element boundary                                     | `boundary: element`                                       |
| `flip.behavior` placement array                      | `fallbackPlacements`                                      |
| `flip.behavior: 'clockwise'` or `'counterclockwise'` | ordered `fallbackPlacements` from the requested placement |
| `flipVariations` or `flipVariationsByContent`        | `flipVariations`                                          |
| `keepTogether.enabled`                               | `preventOverflow.options.tether`                          |
| v1 four-side overflow priority                       | `mainAxis: true`, `altAxis: true`                         |
| `computeStyle`                                       | `computeStyles`                                           |
| `applyStyle`                                         | `applyStyles`                                             |
| offset string, number, or tuple                      | wrapper offset tuple                                      |

`shouldFitViewport` is not used as an overflow proxy. It adds max-size behavior that Popper v1 did
not provide and was particularly wrong when callers disabled overflow and flip.

The legacy off-screen CSS remains safe on the flag-on path because the Popper render-prop supplies
inline `position`, `top`, `left`, and transform values. No top-layer-specific class override is
needed.

## Rollout risks and mitigations

| Risk                                       | Mitigation                                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Popper v1 and v2 defaults differ           | Explicit strategy, offset, flip, overflow, and hide settings at each v1 adapter          |
| Callback-driven update loop                | Consumer-owned one-shot modifier with latest-callback ref                                |
| Select public modifier behavior changes    | Exact raw `react-popper` compatibility re-export                                         |
| Browser extension overlay behavior changes | Exact `usePopper` compatibility re-export                                                |
| A direct import returns later              | AFM-wide diff ratchet for JS, JSX, TS, TSX, MJS, CJS, MTS, and CTS, including test mocks |
| A flag-on path is never exercised          | Dedicated forced-flag unit, browser, and visual smoke coverage per interactive consumer  |

## Remaining direct imports during rollout

The feature-gated fallback imports are deliberate. They are frozen by the ratchet and must be
deleted after the flag is proven and enabled:

- Editor Layer and VanillaTooltip
- Jira investigation chart
- AVP ChartioOverlay and SelectMenu
- Select PopupSelect
- Rovo extension popup surfaces

The final cleanup removes those imports and the matching direct package dependencies. The only
remaining direct Popper dependencies in AFM should then be the implementation dependencies owned by
`@atlaskit/popper` itself.
