import type { ComponentType } from 'react';

import { codeBlockInBlockquoteADF } from '../__fixtures__/code-block-inside-blockquote.adf';
import * as adfCodeBlockInsideLayout from '../__fixtures__/code-block-inside-layout.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const CodeBlockRendererLayout: ComponentType<any> = generateRendererComponent({
	document: adfCodeBlockInsideLayout,
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});

export const CodeBlockRendererQuote: ComponentType<any> = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});
