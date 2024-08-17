import * as adfCodeBlockInsideLayout from '../__fixtures__/code-block-inside-layout.adf.json';
import { codeBlockInBlockquoteADF } from '../__fixtures__/code-block-inside-blockquote.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const CodeBlockRendererLayout = generateRendererComponent({
	document: adfCodeBlockInsideLayout,
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});

export const CodeBlockRendererQuote = generateRendererComponent({
	document: codeBlockInBlockquoteADF(),
	appearance: 'full-width',
	allowCopyToClipboard: true,
	allowWrapCodeBlock: true,
});
