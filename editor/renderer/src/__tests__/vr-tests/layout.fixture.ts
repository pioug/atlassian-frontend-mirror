import { overflowLayout } from '../__fixtures__/overflow.adf';
import * as layoutWithDefaultBreakoutMark from '../__fixtures__/layout-default-breakout.adf.json';
import * as layout2Col from '../__fixtures__/layout-2-columns.adf.json';
import * as layout3Col from '../__fixtures__/layout-3-columns.adf.json';
import * as layoutLeftSidebar from '../__fixtures__/layout-left-sidebar.adf.json';
import * as layoutRightSidebar from '../__fixtures__/layout-right-sidebar.adf.json';
import * as layout3ColWithSidebars from '../__fixtures__/layout-3-columns-with-sidebars.adf.json';
import * as Layout3ColWithDifferentText from '../__fixtures__/layout-3-columns-with-different-text.adf.json';
import * as Layout3ColWithMention from '../__fixtures__/layout-3-columns-with-mention.adf.json';
import * as LayoutWithBlockNodes from '../__fixtures__/layout-with-block-nodes.adf.json';
import * as LayoutWithDifferentText from '../__fixtures__/layout-with-different-text.adf.json';
import * as LayoutWithMedia from '../__fixtures__/layout-with-media.adf.json';
import * as LayoutWithTextAndCodeblock from '../__fixtures__/layout-with-text-and-codeblock.adf.json';
import * as layout4Col from '../__fixtures__/layout-4-columns.adf.json';
import * as layout5Col from '../__fixtures__/layout-5-columns.adf.json';

import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const OverflowLayoutRenderer = generateRendererComponent({
	document: overflowLayout,
	appearance: 'full-page',
	extensionHandlers,
});

export const Layout3ColWithDifferentTextRenderer = generateRendererComponent({
	document: Layout3ColWithDifferentText,
	appearance: 'full-width',
});

export const Layout3ColWithMentionRenderer = generateRendererComponent({
	document: Layout3ColWithMention,
	appearance: 'full-width',
});

export const LayoutWithBlockNodesRenderer = generateRendererComponent({
	document: LayoutWithBlockNodes,
	appearance: 'full-width',
});

export const LayoutWithDifferentTextRenderer = generateRendererComponent({
	document: LayoutWithDifferentText,
	appearance: 'full-width',
});

export const LayoutWithMediaRenderer = generateRendererComponent({
	document: LayoutWithMedia,
	appearance: 'full-width',
});

export const LayoutWithTextAndCodeblockRenderer = generateRendererComponent({
	document: LayoutWithTextAndCodeblock,
	appearance: 'full-width',
});

export const Layout2ColRenderer = generateRendererComponent({
	document: layout2Col,
	appearance: 'full-width',
});

export const LayoutWithDefaultBreakoutMarkRenderer = generateRendererComponent({
	document: layoutWithDefaultBreakoutMark,
	appearance: 'full-width',
});

export const Layout3ColRenderer = generateRendererComponent({
	document: layout3Col,
	appearance: 'full-width',
});

export const LayoutLeftSidebarRenderer = generateRendererComponent({
	document: layoutLeftSidebar,
	appearance: 'full-width',
});

export const LayoutRightSidebarRenderer = generateRendererComponent({
	document: layoutRightSidebar,
	appearance: 'full-width',
});

export const Layout3ColWithSidebarsRenderer = generateRendererComponent({
	document: layout3ColWithSidebars,
	appearance: 'full-width',
});

export const Layout4ColRenderer = generateRendererComponent({
	document: layout4Col,
	appearance: 'full-width',
});

export const Layout5ColRenderer = generateRendererComponent({
	document: layout5Col,
	appearance: 'full-width',
});
