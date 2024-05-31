import { panelNodeAdf } from '../__fixtures__/full-width-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const PanelRenderer = generateRendererComponent({
	document: panelNodeAdf,
	appearance: 'full-width',
});
