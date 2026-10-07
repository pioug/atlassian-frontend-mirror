import { snapshot } from '@af/visual-regression';

import {
	VrDialogHostSpecificityBaseline,
	VrDialogHostSpecificityChildDialog,
	VrDialogHostSpecificityChildUniversal,
	VrDialogHostSpecificityDisplay,
	VrDialogHostSpecificityHighSpecificity,
	VrDialogHostSpecificityLimitId,
	VrDialogHostSpecificityLimitImportant,
	VrDialogHostSpecificityLimitXcss,
	VrDialogHostSpecificityPositionedBaseline,
	VrDialogHostSpecificityPositionedHostile,
} from '../../examples/89-vr-dialog-host-specificity.vr.ap';

// Dialog host boost (`dialogStyles.root` in dialog-content.tsx): each hostile snapshot must match its baseline.
const opts = { drawsOutsideBounds: true } as const;

snapshot(VrDialogHostSpecificityBaseline, opts);
snapshot(VrDialogHostSpecificityChildUniversal, opts);
snapshot(VrDialogHostSpecificityChildDialog, opts);
snapshot(VrDialogHostSpecificityHighSpecificity, opts);
snapshot(VrDialogHostSpecificityDisplay, opts);

snapshot(VrDialogHostSpecificityPositionedBaseline, opts);
snapshot(VrDialogHostSpecificityPositionedHostile, opts);

// Limits: expected to look broken.
snapshot(VrDialogHostSpecificityLimitId, opts);
snapshot(VrDialogHostSpecificityLimitImportant, opts);
snapshot(VrDialogHostSpecificityLimitXcss, opts);
