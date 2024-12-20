import { statusInPanelAdf } from '../__fixtures__/status.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const StatusInPanelRenderer = generateRendererComponent({
	document: statusInPanelAdf,
	appearance: 'full-page',
	allowCustomPanels: true,
});
