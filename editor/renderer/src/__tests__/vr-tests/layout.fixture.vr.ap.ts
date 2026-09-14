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
import * as layout3ColWithWidth from '../__fixtures__/layout-3-columns-with-breakout-width.adf.json';
import * as layout4ColWithWidth from '../__fixtures__/layout-4-columns-with-breakout-width.adf.json';
import * as layout5ColWithWidth from '../__fixtures__/layout-5-columns-with-breakout-width.adf.json';
import * as layout5ColWithWidthAndLayout5ColWithWide from '../__fixtures__/layout-5-columns-with-breakout-width-and-layout-5-columns-with-wide.adf.json';

import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const OverflowLayoutRenderer: ComponentType<any> = generateRendererComponent({
	document: overflowLayout,
	appearance: 'full-page',
	extensionHandlers,
});

export const Layout3ColWithDifferentTextRenderer: ComponentType<any> = generateRendererComponent({
	document: Layout3ColWithDifferentText,
	appearance: 'full-width',
});

export const Layout3ColWithMentionRenderer: ComponentType<any> = generateRendererComponent({
	document: Layout3ColWithMention,
	appearance: 'full-width',
});

export const LayoutWithBlockNodesRenderer: ComponentType<any> = generateRendererComponent({
	document: LayoutWithBlockNodes,
	appearance: 'full-width',
});

export const LayoutWithDifferentTextRenderer: ComponentType<any> = generateRendererComponent({
	document: LayoutWithDifferentText,
	appearance: 'full-width',
});

export const LayoutWithMediaRenderer: ComponentType<any> = generateRendererComponent({
	document: LayoutWithMedia,
	appearance: 'full-width',
});

export const LayoutWithTextAndCodeblockRenderer: ComponentType<any> = generateRendererComponent({
	document: LayoutWithTextAndCodeblock,
	appearance: 'full-width',
});

export const Layout2ColRenderer: ComponentType<any> = generateRendererComponent({
	document: layout2Col,
	appearance: 'full-width',
});

export const LayoutWithDefaultBreakoutMarkRenderer: ComponentType<any> = generateRendererComponent({
	document: layoutWithDefaultBreakoutMark,
	appearance: 'full-width',
});

export const Layout3ColRenderer: ComponentType<any> = generateRendererComponent({
	document: layout3Col,
	appearance: 'full-width',
});

export const LayoutLeftSidebarRenderer: ComponentType<any> = generateRendererComponent({
	document: layoutLeftSidebar,
	appearance: 'full-width',
});

export const LayoutRightSidebarRenderer: ComponentType<any> = generateRendererComponent({
	document: layoutRightSidebar,
	appearance: 'full-width',
});

export const Layout3ColWithSidebarsRenderer: ComponentType<any> = generateRendererComponent({
	document: layout3ColWithSidebars,
	appearance: 'full-width',
});

export const Layout3ColWithWidthRenderer: ComponentType<any> = generateRendererComponent({
	document: layout3ColWithWidth,
	appearance: 'full-page',
});

export const Layout4ColWithWidthRenderer: ComponentType<any> = generateRendererComponent({
	document: layout4ColWithWidth,
	appearance: 'full-page',
});

export const Layout5ColWithWidthRenderer: ComponentType<any> = generateRendererComponent({
	document: layout5ColWithWidth,
	appearance: 'full-page',
});

export const Layout5ColWithWidthInFullWidthRenderer: ComponentType<any> = generateRendererComponent(
	{
		document: layout5ColWithWidthAndLayout5ColWithWide,
		appearance: 'full-width',
	},
);

export const Layout5ColWithWidthAndLayout5ColWithWideRenderer: ComponentType<any> =
	generateRendererComponent({
		document: layout5ColWithWidthAndLayout5ColWithWide,
		appearance: 'full-page',
	});
