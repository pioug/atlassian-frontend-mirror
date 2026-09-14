import { snapshot } from '@af/visual-regression';

import Placement from '../../examples/02-placement.vr.ap';
import NestedPopups from '../../examples/03-nested-popovers.vr.ap';
import BasicDialog from '../../examples/04-basic-dialog.vr.ap';
import PopupSurfaceVariants from '../../examples/08-popover-surface-variants.vr.ap';
import AllPlacements from '../../examples/all-placements.vr.ap';

const opts = { drawsOutsideBounds: true } as const;

snapshot(Placement, opts);
snapshot(NestedPopups, opts);
snapshot(BasicDialog, opts);
snapshot(PopupSurfaceVariants, opts);
snapshot(AllPlacements, opts);
