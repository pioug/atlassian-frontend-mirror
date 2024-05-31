import { blockQuoteNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const BlockQuoteRenderer = generateRendererComponent({
	document: blockQuoteNodeAdf,
	appearance: 'full-width',
});
