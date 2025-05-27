import { panelNodeAdf, panelNodeNestedInTableAdf } from '../__fixtures__/full-width-adf';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const PanelRenderer = generateRendererComponent({
	document: panelNodeAdf,
	appearance: 'full-width',
	allowCustomPanels: true,
});

export const PanelRendererWithReactLooselyLazy = generateRendererComponent({
	document: panelNodeAdf,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
	allowCustomPanels: true,
});

export const PanelRendererNestedInTable = generateRendererComponent({
	document: panelNodeNestedInTableAdf,
	appearance: 'full-width',
	allowCustomPanels: true,
});
