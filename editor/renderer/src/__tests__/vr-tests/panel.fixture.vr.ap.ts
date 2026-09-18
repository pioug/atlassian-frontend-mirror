import type { ComponentType } from 'react';

import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';
import { panelNodeAdf, panelNodeNestedInTableAdf } from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const PanelRenderer: ComponentType<any> = generateRendererComponent({
	document: panelNodeAdf,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const PanelRendererWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: panelNodeAdf,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
	allowCustomPanels: true,
});

export const PanelRendererNestedInTable: ComponentType<any> = generateRendererComponent({
	document: panelNodeNestedInTableAdf,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const PanelFullPageRenderer: ComponentType<any> = generateRendererComponent({
	document: panelNodeAdf,
	appearance: 'full-page',
	allowCustomPanels: true,
});
