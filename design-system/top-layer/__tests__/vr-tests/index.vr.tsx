import { snapshot } from '@af/visual-regression';

import PopupPositions from '../../examples/02-popover-positions';
import NestedPopups from '../../examples/03-nested-popovers';
import BasicDialog from '../../examples/04-basic-dialog';
import PopupSurfaceVariants from '../../examples/08-popover-surface-variants';

const opts = { drawsOutsideBounds: true } as const;

snapshot(PopupPositions, opts);
snapshot(NestedPopups, opts);
snapshot(BasicDialog, opts);
snapshot(PopupSurfaceVariants, opts);
