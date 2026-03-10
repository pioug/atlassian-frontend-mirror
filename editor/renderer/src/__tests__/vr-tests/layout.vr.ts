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
import { Device, snapshot } from '@af/visual-regression';
import {
	flagsForVrTests,
	flagsForVrTestsWithReducedPadding,
} from '@atlaskit/editor-test-helpers/advanced-layouts-flags';

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

snapshot(Layout3ColWithWidthRenderer, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-page renderer should have 24px side padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(Layout3ColRenderer, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-width renderer should have no side padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
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
