import type { ComponentType } from 'react';
import { blockQuoteNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const BlockQuoteRenderer: ComponentType<any> = generateRendererComponent({
	document: blockQuoteNodeAdf,
	appearance: 'full-width',
});
