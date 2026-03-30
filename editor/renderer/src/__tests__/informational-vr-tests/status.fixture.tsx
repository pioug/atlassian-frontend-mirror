import { statusInPanelAdf, mixedCaseStatusInPanelAdf } from '../__fixtures__/status.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const StatusInPanelRenderer = generateRendererComponent({
	document: statusInPanelAdf,
	appearance: 'full-page',
	allowCustomPanels: true,
});

export const MixedCaseStatusInPanelRenderer = generateRendererComponent({
	document: mixedCaseStatusInPanelAdf,
	appearance: 'full-page',
	allowCustomPanels: true,
});
