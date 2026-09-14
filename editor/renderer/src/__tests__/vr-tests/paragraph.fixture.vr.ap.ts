import type { ComponentType } from 'react';
import { paragraphNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const ParagraphRenderer: ComponentType<any> = generateRendererComponent({
	document: paragraphNodeAdf,
	appearance: 'full-width',
});
