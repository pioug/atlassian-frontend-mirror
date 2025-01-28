import { decisionNodeAdf } from '../__fixtures__/full-width-adf';
import * as decisionAdf from '../__fixtures__/decision-adf.json';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const DecisionRenderer = generateRendererComponent({
	document: decisionNodeAdf,
	appearance: 'full-width',
});

export const DecisionHoverRenderer = generateRendererComponent({
	document: decisionAdf,
	appearance: 'full-width',
});

export const DecisionRendererWithReactLooselyLazy = generateRendererComponent({
	document: decisionNodeAdf,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
