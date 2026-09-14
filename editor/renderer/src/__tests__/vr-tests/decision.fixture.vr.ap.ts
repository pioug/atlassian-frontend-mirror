import { decisionNodeAdf } from '../__fixtures__/full-width-adf';
import * as decisionAdf from '../__fixtures__/decision-adf.json';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

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
