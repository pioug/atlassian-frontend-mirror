import { snapshot } from '@af/visual-regression';

import FocusRingBodyScroll from '../../../examples/108-focus-ring-body-scroll.vr.ap';
import FocusRingViewportScroll from '../../../examples/109-focus-ring-viewport-scroll.vr.ap';

// The top layer and legacy snapshots of each pair must show the same ring around the surface.
const options = {
	drawsOutsideBounds: true,
	featureFlags: { 'platform-dst-top-layer': [true, false] },
} as const;

snapshot(FocusRingBodyScroll, options);
snapshot(FocusRingViewportScroll, options);
