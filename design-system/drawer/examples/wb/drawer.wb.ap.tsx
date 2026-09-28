import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicDrawerExample from '../00-basic-drawer';
import DrawerMenuVrExample from '../01-drawer-menu.vr.ap';
import DrawerDefaultVrExample from '../02-drawer-default.vr.ap';
import DrawerWidthsVrExample from '../05-drawer-widths.vr.ap';
import LongContentDrawerExample from '../10-long-content-drawer';
import ScrollExample from '../11-scroll';
import DrawerFocusToRefOnCloseExample from '../12-drawer-focus-to-ref-on-close';
import DrawerWithFixedContentsExample from '../20-drawer-with-fixed-contents';
import ToggleDrawerWidthExample from '../25-toggle-drawer-width';
import StackedDrawersVrExample from '../40-stacked-drawers.vr.ap';
import DrawerWithZIndexExample from '../41-drawer-with-z-index';
import DrawerStackingContextsVrExample from '../42-drawer-stacking-contexts.vr.ap';
import XcssExample from '../45-xcss';
import SurfaceDetectionVrExample from '../94-surface-detection.vr.ap';
import ToggleDrawerEnterFromExample from '../95-toggle-drawer-enter-from';
import SsrInitialOpenExample from '../97-ssr-initial-open';
import TestingInitialFocusMatrixExample from '../98-testing-initial-focus-matrix';
import LoremExample from '../lorem';

export const BasicDrawer: WorkbenchExample<typeof BasicDrawerExample> = wb(BasicDrawerExample);

export const DrawerMenuVr: WorkbenchExample<typeof DrawerMenuVrExample> = wb(DrawerMenuVrExample);
// Named "DrawerDefault" to match the Workbench URL used by existing integration tests.
export const DrawerDefault: WorkbenchExample<typeof DrawerDefaultVrExample> =
	wb(DrawerDefaultVrExample);
export const DrawerWidthsVr: WorkbenchExample<typeof DrawerWidthsVrExample> =
	wb(DrawerWidthsVrExample);
export const LongContentDrawer: WorkbenchExample<typeof LongContentDrawerExample> =
	wb(LongContentDrawerExample);
export const Scroll: WorkbenchExample<typeof ScrollExample> = wb(ScrollExample);
export const DrawerFocusToRefOnClose: WorkbenchExample<typeof DrawerFocusToRefOnCloseExample> = wb(
	DrawerFocusToRefOnCloseExample,
);
export const DrawerWithFixedContents: WorkbenchExample<typeof DrawerWithFixedContentsExample> = wb(
	DrawerWithFixedContentsExample,
);
export const ToggleDrawerWidth: WorkbenchExample<typeof ToggleDrawerWidthExample> =
	wb(ToggleDrawerWidthExample);
// Named "StackedDrawers" to match the Workbench URL used by existing integration tests.
export const StackedDrawers: WorkbenchExample<typeof StackedDrawersVrExample> =
	wb(StackedDrawersVrExample);
export const DrawerWithZIndex: WorkbenchExample<typeof DrawerWithZIndexExample> =
	wb(DrawerWithZIndexExample);
export const DrawerStackingContextsVr: WorkbenchExample<typeof DrawerStackingContextsVrExample> =
	wb(DrawerStackingContextsVrExample);
export const Xcss: WorkbenchExample<typeof XcssExample> = wb(XcssExample);
export const SurfaceDetectionVr: WorkbenchExample<typeof SurfaceDetectionVrExample> =
	wb(SurfaceDetectionVrExample);
export const ToggleDrawerEnterFrom: WorkbenchExample<typeof ToggleDrawerEnterFromExample> = wb(
	ToggleDrawerEnterFromExample,
);
export const SsrInitialOpen: WorkbenchExample<typeof SsrInitialOpenExample> =
	wb(SsrInitialOpenExample);
export const TestingInitialFocusMatrix: WorkbenchExample<typeof TestingInitialFocusMatrixExample> =
	wb(TestingInitialFocusMatrixExample);
export const Lorem: WorkbenchExample<typeof LoremExample> = wb(LoremExample);
