import { snapshot } from '@af/visual-regression';

import {
	VrEdgeGapMatchAnchorAtEdge,
	VrEdgeGapMinAnchorAtEdge,
	VrEdgeGapSlides,
	VrEdgeGapTriggerAtEdge,
} from '../../examples/89-vr-popover-viewport-edge-gap.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

// See `notes/decisions/viewport-edge-gap.md`.

// A popover that slides keeps 5px to the viewport edge.
snapshot(VrEdgeGapSlides, { ...opts, description: 'edge-gap-slides' });

// The gap never moves a popover off its trigger.
snapshot(VrEdgeGapTriggerAtEdge, { ...opts, description: 'edge-gap-trigger-at-edge' });
snapshot(VrEdgeGapMatchAnchorAtEdge, { ...opts, description: 'edge-gap-match-anchor-at-edge' });
snapshot(VrEdgeGapMinAnchorAtEdge, { ...opts, description: 'edge-gap-min-anchor-at-edge' });
