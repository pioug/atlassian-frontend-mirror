import {
	OverflowLayoutRenderer,
	Layout2ColRenderer,
	LayoutWithDefaultBreakoutMarkRenderer,
	Layout3ColRenderer,
	LayoutLeftSidebarRenderer,
	LayoutRightSidebarRenderer,
	Layout3ColWithSidebarsRenderer,
	Layout3ColWithMentionRenderer,
	LayoutWithBlockNodesRenderer,
	LayoutWithDifferentTextRenderer,
	LayoutWithMediaRenderer,
	LayoutWithTextAndCodeblockRenderer,
	Layout3ColWithDifferentTextRenderer,
	Layout3ColWithWidthRenderer,
	Layout4ColWithWidthRenderer,
	Layout5ColWithWidthRenderer,
	Layout5ColWithWidthAndLayout5ColWithWideRenderer,
	Layout5ColWithWidthInFullWidthRenderer,
} from './layout.fixture';
import { snapshot } from '@af/visual-regression';
import { flagsForVrTests } from '@atlaskit/editor-test-helpers/advanced-layouts-flags';

snapshot(OverflowLayoutRenderer);
snapshot(Layout2ColRenderer);
snapshot(LayoutWithDefaultBreakoutMarkRenderer);
snapshot(Layout3ColRenderer);
snapshot(LayoutLeftSidebarRenderer);
snapshot(LayoutRightSidebarRenderer);
snapshot(Layout3ColWithSidebarsRenderer);
snapshot(Layout3ColWithMentionRenderer);
snapshot(LayoutWithBlockNodesRenderer);
snapshot(LayoutWithDifferentTextRenderer);
snapshot(LayoutWithMediaRenderer);
snapshot(LayoutWithTextAndCodeblockRenderer);
snapshot(Layout3ColWithDifferentTextRenderer);

snapshot(Layout3ColWithWidthRenderer, {
	...flagsForVrTests,
});

snapshot(Layout4ColWithWidthRenderer, {
	...flagsForVrTests,
});

snapshot(Layout5ColWithWidthRenderer, {
	...flagsForVrTests,
});

snapshot(Layout5ColWithWidthAndLayout5ColWithWideRenderer, {
	...flagsForVrTests,
});

snapshot(Layout5ColWithWidthInFullWidthRenderer, {
	...flagsForVrTests,
});
