import * as hardBreakParagraphADF from '../__fixtures__/hardBreak.paragraph.adf.json';
import * as hardBreakListADF from '../__fixtures__/hardBreak.list.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const HardBreakParagraphRenderer: ComponentType<any> = generateRendererComponent({
	document: hardBreakParagraphADF,
	appearance: 'full-width',
});

export const HardBreakListRenderer: ComponentType<any> = generateRendererComponent({
	document: hardBreakListADF,
	appearance: 'full-width',
});
