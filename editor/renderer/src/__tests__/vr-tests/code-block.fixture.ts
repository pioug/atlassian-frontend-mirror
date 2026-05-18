import type { DocNode } from '@atlaskit/adf-schema';

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

const codeBlockWithLineNumbersHiddenAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'codeBlock',
			attrs: {
				language: 'javascript',
				hideLineNumbers: true,
			},
			content: [
				{
					type: 'text',
					text: '// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);',
				},
			],
		},
	],
};

export const CodeBlockRendererCopyWrap: ComponentType<any> = generateRendererComponent({
	document: codeBlockAdf,
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});

export const CodeBlockRendererLineNumbersHidden: ComponentType<any> = generateRendererComponent({
	document: codeBlockWithLineNumbersHiddenAdf,
	appearance: 'full-width',
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
