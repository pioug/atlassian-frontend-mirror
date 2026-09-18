import type { ComponentType } from 'react';

import * as hardBreakListADF from '../__fixtures__/hardBreak.list.adf.json';
import * as hardBreakParagraphADF from '../__fixtures__/hardBreak.paragraph.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const HardBreakParagraphRenderer: ComponentType<any> = generateRendererComponent({
	document: hardBreakParagraphADF,
	appearance: 'full-width',
});

export const HardBreakListRenderer: ComponentType<any> = generateRendererComponent({
	document: hardBreakListADF,
	appearance: 'full-width',
});
