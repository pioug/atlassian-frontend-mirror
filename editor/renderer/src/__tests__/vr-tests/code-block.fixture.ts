import * as codeBlockAdf from '../__fixtures__/code-block.adf.json';
import * as codeBlockWithBreakoutAdf from '../__fixtures__/code-block-with-breakout.adf.json';
import * as adfTrailingNewline from '../__fixtures__/code-block-trailing-newline.adf.json';
import { overflowCodeblock, overflowCodeblockWithWrapEnabled } from '../__fixtures__/overflow.adf';

import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents';
import type { ComponentType } from 'react';

export const CodeBlockRendererCopy: ComponentType<any> = generateRendererComponent({
	document: codeBlockAdf,
	appearance: 'full-width',
	allowCopyToClipboard: true,
});

export const CodeBlockRendererWrap: ComponentType<any> = generateRendererComponent({
	document: codeBlockAdf,
	appearance: 'full-width',
	allowWrapCodeBlock: true,
});

export const CodeBlockRendererCopyWrap: ComponentType<any> = generateRendererComponent({
	document: codeBlockAdf,
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});

export const CodeBlockRendererTrailingNewline: ComponentType<any> = generateRendererComponent({
	document: adfTrailingNewline,
	appearance: 'full-width',
	allowCopyToClipboard: true,
});

export const CodeBlockRendererOverflow: ComponentType<any> = generateRendererComponent({
	document: overflowCodeblock,
	appearance: 'full-page',
});

export const CodeBlockRendererWithWrapEnabled: ComponentType<any> = generateRendererComponent({
	document: overflowCodeblockWithWrapEnabled,
	appearance: 'full-page',
	allowWrapCodeBlock: true,
});

export const CodeBlockWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: overflowCodeblock,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});

export const CodeBlockRendererWithBreakout: ComponentType<any> = generateRendererComponent({
	document: codeBlockWithBreakoutAdf,
	appearance: 'full-page',
});

export const CodeBlockRendererWithBreakoutFullWidth: ComponentType<any> = generateRendererComponent(
	{
		document: codeBlockWithBreakoutAdf,
		appearance: 'full-width',
	},
);
