import { Device, snapshot } from '@af/visual-regression';
import {
	flagsForVrTests,
	flagsForVrTestsWithReducedPadding,
} from '@atlaskit/editor-test-helpers/advanced-layouts-flags';

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
} from './layout.fixture.vr.ap';

snapshot(OverflowLayoutRenderer);
snapshot(Layout2ColRenderer);
snapshot(LayoutWithDefaultBreakoutMarkRenderer);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Layout3ColRenderer);
snapshot(LayoutLeftSidebarRenderer);
snapshot(LayoutRightSidebarRenderer);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Layout3ColWithSidebarsRenderer);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Layout3ColWithMentionRenderer);
snapshot(LayoutWithBlockNodesRenderer);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(LayoutWithDifferentTextRenderer);
snapshot(LayoutWithMediaRenderer);
snapshot(LayoutWithTextAndCodeblockRenderer);
// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Layout3ColWithDifferentTextRenderer);

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Layout3ColWithWidthRenderer, {
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

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Layout5ColWithWidthRenderer, {
	...flagsForVrTests,
});

snapshot(Layout5ColWithWidthAndLayout5ColWithWideRenderer, {
	...flagsForVrTests,
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Layout5ColWithWidthInFullWidthRenderer, {
	...flagsForVrTests,
});
