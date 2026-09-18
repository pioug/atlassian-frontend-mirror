import type { ComponentType } from 'react';

import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';
import {
	codeBlockInBlockquoteADF,
	codeBlockOverflowInBlockquoteADF,
} from '../__fixtures__/code-block-inside-blockquote.adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const CodeBlockInBlockquote: ComponentType<any> = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
});

export const CodeBlockOverflowInBlockquote: ComponentType<any> = generateRendererComponent({
	document: codeBlockOverflowInBlockquoteADF(),
	appearance: 'full-width',
});

export const CodeBlockInBlockquoteCopy: ComponentType<any> = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowCopyToClipboard: true,
});

export const CodeBlockInBlockquoteWrap: ComponentType<any> = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowWrapCodeBlock: true,
});

export const CodeBlockInBlockquoteCopyWrap: ComponentType<any> = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});

export const CodeBlockWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
