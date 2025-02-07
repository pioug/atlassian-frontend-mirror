import { snapshot } from '@af/visual-regression';

import DrawerMenuExample from '../../../../examples/01-drawer-menu';
import {
	DrawerWidthExtendedExample,
	DrawerWidthFullExample,
	DrawerWidthMediumExample,
	DrawerWidthNarrowExample,
	DrawerWidthWideExample,
} from '../../../../examples/05-drawer-widths';
import DrawerStackingContextExample from '../../../../examples/42-drawer-stacking-contexts';

snapshot(DrawerWidthNarrowExample, { drawsOutsideBounds: true });
snapshot(DrawerWidthMediumExample, { drawsOutsideBounds: true });
snapshot(DrawerWidthWideExample, { drawsOutsideBounds: true });
snapshot(DrawerWidthExtendedExample, { drawsOutsideBounds: true });
snapshot(DrawerWidthFullExample, { drawsOutsideBounds: true });

snapshot(DrawerMenuExample, { drawsOutsideBounds: true });

snapshot(DrawerStackingContextExample, { drawsOutsideBounds: true });
