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
