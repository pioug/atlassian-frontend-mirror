import {
	codeBlockInBlockquoteADF,
	codeBlockOverflowInBlockquoteADF,
} from '../__fixtures__/code-block-inside-blockquote.adf';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const CodeBlockInBlockquote = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
});

export const CodeBlockOverflowInBlockquote = generateRendererComponent({
	document: codeBlockOverflowInBlockquoteADF(),
	appearance: 'full-width',
});

export const CodeBlockInBlockquoteCopy = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowCopyToClipboard: true,
});

export const CodeBlockInBlockquoteWrap = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowWrapCodeBlock: true,
});

export const CodeBlockInBlockquoteCopyWrap = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});

export const CodeBlockWithReactLooselyLazy = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
