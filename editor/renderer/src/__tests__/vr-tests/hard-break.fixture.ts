import * as hardBreakParagraphADF from '../__fixtures__/hardBreak.paragraph.adf.json';
import * as hardBreakListADF from '../__fixtures__/hardBreak.list.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents';

export const HardBreakParagraphRenderer = generateRendererComponent({
	document: hardBreakParagraphADF,
	appearance: 'full-width',
});

export const HardBreakListRenderer = generateRendererComponent({
	document: hardBreakListADF,
	appearance: 'full-width',
});
