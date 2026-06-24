import { snapshot } from '@af/visual-regression';

import AdvancedBehaviors from '../../../examples/02-advanced-behaviors';
import {
	MaxSizeBottomExample,
	MaxSizeLeftExample,
	MaxSizeRightExample,
	MaxSizeTopExample,
} from '../../../examples/03-max-size';
import FlagFitViewportRight from '../../../examples/06-flag-fit-viewport-right';

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
