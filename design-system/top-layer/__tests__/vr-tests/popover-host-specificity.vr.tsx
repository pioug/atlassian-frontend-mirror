import { snapshot } from '@af/visual-regression';

import {
	VrHostSpecificityBaseline,
	VrHostSpecificityChildAttribute,
	VrHostSpecificityChildDiv,
	VrHostSpecificityChildUniversal,
	VrHostSpecificityClosedHostile,
	VrHostSpecificityFlexBaseline,
	VrHostSpecificityFlexHostile,
	VrHostSpecificityHighSpecificity,
	VrHostSpecificityInlineEndBaseline,
	VrHostSpecificityInlineEndHostile,
	VrHostSpecificityInlineWritesBaseline,
	VrHostSpecificityInlineWritesHostile,
	VrHostSpecificityJsFallbackBaseline,
	VrHostSpecificityJsFallbackHostile,
	VrHostSpecificityLimitDescendant,
	VrHostSpecificityLimitId,
	VrHostSpecificityLimitImportant,
	VrHostSpecificityUnpositionedBaseline,
	VrHostSpecificityUnpositionedHostile,
} from '../../examples/89-vr-popover-host-specificity.vr.ap';

// Popover host boost (`styles.root` in popover.tsx): each hostile snapshot must match its baseline.
const opts = { drawsOutsideBounds: true } as const;

snapshot(VrHostSpecificityBaseline, opts);
snapshot(VrHostSpecificityChildDiv, opts);
snapshot(VrHostSpecificityChildUniversal, opts);
snapshot(VrHostSpecificityChildAttribute, opts);
snapshot(VrHostSpecificityHighSpecificity, opts);

snapshot(VrHostSpecificityFlexBaseline, opts);
snapshot(VrHostSpecificityFlexHostile, opts);

snapshot(VrHostSpecificityInlineEndBaseline, opts);
snapshot(VrHostSpecificityInlineEndHostile, opts);

snapshot(VrHostSpecificityInlineWritesBaseline, opts);
snapshot(VrHostSpecificityInlineWritesHostile, opts);

snapshot(VrHostSpecificityJsFallbackBaseline, opts);
snapshot(VrHostSpecificityJsFallbackHostile, opts);

snapshot(VrHostSpecificityUnpositionedBaseline, opts);
snapshot(VrHostSpecificityUnpositionedHostile, opts);

snapshot(VrHostSpecificityClosedHostile, opts);

// Limits: expected to look broken.
snapshot(VrHostSpecificityLimitId, opts);
snapshot(VrHostSpecificityLimitImportant, opts);
snapshot(VrHostSpecificityLimitDescendant, opts);
