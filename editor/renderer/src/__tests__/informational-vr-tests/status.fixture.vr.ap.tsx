import type { ComponentType } from 'react';
import { statusInPanelAdf, mixedCaseStatusInPanelAdf } from '../__fixtures__/status.adf';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const StatusInPanelRenderer: ComponentType<any> = generateRendererComponent({
	document: statusInPanelAdf,
	appearance: 'full-page',
	allowCustomPanels: true,
});

export const MixedCaseStatusInPanelRenderer: ComponentType<any> = generateRendererComponent({
	document: mixedCaseStatusInPanelAdf,
	appearance: 'full-page',
	allowCustomPanels: true,
});
