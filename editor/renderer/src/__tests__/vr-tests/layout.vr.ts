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
	Layout4ColRenderer,
	Layout5ColRenderer,
	Layout3ColWithWidthRenderer,
	Layout4ColWithWidthRenderer,
	Layout5ColWithWidthRenderer,
	Layout5ColWithWidthAndLayout5ColWithWideRenderer,
	Layout5ColWithWidthInFullWidthRenderer,
} from './layout.fixture';
import { snapshot } from '@af/visual-regression';

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

snapshot(Layout4ColRenderer);
snapshot(Layout5ColRenderer);

snapshot(Layout3ColWithWidthRenderer, {
	featureFlags: {
		advanced_layouts: true,
		platform_editor_advanced_layouts_breakout_resizing: true,
	},
});

snapshot(Layout4ColWithWidthRenderer, {
	featureFlags: {
		advanced_layouts: true,
		platform_editor_advanced_layouts_breakout_resizing: true,
	},
});

snapshot(Layout5ColWithWidthRenderer, {
	featureFlags: {
		advanced_layouts: true,
		platform_editor_advanced_layouts_breakout_resizing: true,
	},
});

snapshot(Layout5ColWithWidthAndLayout5ColWithWideRenderer, {
	featureFlags: {
		advanced_layouts: true,
		platform_editor_advanced_layouts_breakout_resizing: true,
	},
});

snapshot(Layout5ColWithWidthInFullWidthRenderer, {
	featureFlags: {
		advanced_layouts: true,
		platform_editor_advanced_layouts_breakout_resizing: true,
	},
});
