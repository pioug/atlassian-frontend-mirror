import type { ComponentType } from 'react';

import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';
import * as decisionAdf from '../__fixtures__/decision-adf.json';
import { decisionNodeAdf } from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const DecisionRenderer: ComponentType<any> = generateRendererComponent({
	document: decisionNodeAdf,
	appearance: 'full-width',
});

export const DecisionHoverRenderer: ComponentType<any> = generateRendererComponent({
	document: decisionAdf,
	appearance: 'full-width',
});

export const DecisionRendererWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: decisionNodeAdf,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
