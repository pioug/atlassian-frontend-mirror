import { snapshot } from '@af/visual-regression';

import AdvancedBehaviors from '../../../examples/02-advanced-behaviors.vr.ap';
import {
	MaxSizeBottomExample,
	MaxSizeLeftExample,
	MaxSizeRightExample,
	MaxSizeTopExample,
} from '../../../examples/03-max-size.vr.ap';
import FlagFitViewportRight from '../../../examples/06-flag-fit-viewport-right.vr.ap';
import FlagImperativeCreatePopper, {
	ImperativeCallerOwnedPopover,
} from '../../../examples/12-flag-imperative-create-popper.vr.ap';

// Each existing fixture is now captured under both states of the
// platform-dst-top-layer feature gate so any visual regression on the
// FF-on top-layer adapter is caught against the same baselines that
// guard the FF-off legacy path. Visual parity is the contract.
const flagStates = { 'platform-dst-top-layer': [false, true] } as const;

snapshot(AdvancedBehaviors, { featureFlags: flagStates });

snapshot(MaxSizeTopExample, { drawsOutsideBounds: true, featureFlags: flagStates });
snapshot(MaxSizeBottomExample, { drawsOutsideBounds: true, featureFlags: flagStates });
snapshot(MaxSizeLeftExample, { drawsOutsideBounds: true, featureFlags: flagStates });
snapshot(MaxSizeRightExample, { drawsOutsideBounds: true, featureFlags: flagStates });

// `shouldFitViewport` with the explicit width on the popper element itself
// (not on a nested scroll container, as in `03-max-size`). Legacy `react-popper`
// reflowed this element to the viewport cap; the FF-on top-layer adapter must
// match rather than render a scrollbar. Captured under both flag states so the
// parity is the contract.
snapshot(FlagFitViewportRight, { drawsOutsideBounds: true, featureFlags: flagStates });

// Imperative `createPopper` (the `/unsafe-imperative` escape hatch). Unlike the
// fixtures above, visual parity is NOT the contract here: flag-off the Popper.js
// engine positions the element inside its `position: relative; overflow: hidden`
// ancestor and it is clipped, flag-on the adapter promotes it into the top layer
// and it paints in full. The difference between these two baselines IS the
// migration.
snapshot(FlagImperativeCreatePopper, { drawsOutsideBounds: true, featureFlags: flagStates });
// The `VanillaTooltip` shape: the caller already owns `popover="hint"`, so the
// element is in the top layer under both flag states and only the positioning
// engine changes. These two baselines ARE expected to match — that parity is
// what makes the adapter safe for the one existing imperative caller.
snapshot(ImperativeCallerOwnedPopover, { drawsOutsideBounds: true, featureFlags: flagStates });
