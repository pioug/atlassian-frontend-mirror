import * as codeBlockAdf from '../__fixtures__/code-block.adf.json';
import * as adfTrailingNewline from '../__fixtures__/code-block-trailing-newline.adf.json';
import { overflowCodeblock } from '../__fixtures__/overflow.adf';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const CodeBlockRendererCopy = generateRendererComponent({
	document: codeBlockAdf,
	appearance: 'full-width',
	allowCopyToClipboard: true,
});

export const CodeBlockRendererWrap = generateRendererComponent({
	document: codeBlockAdf,
	appearance: 'full-width',
	allowWrapCodeBlock: true,
});

export const CodeBlockRendererCopyWrap = generateRendererComponent({
	document: codeBlockAdf,
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});

export const CodeBlockRendererTrailingNewline = generateRendererComponent({
	document: adfTrailingNewline,
	appearance: 'full-width',
	allowCopyToClipboard: true,
});

export const CodeBlockRendererOverflow = generateRendererComponent({
	document: overflowCodeblock,
	appearance: 'full-page',
});

export const CodeBlockWithReactLooselyLazy = generateRendererComponent({
	document: overflowCodeblock,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
