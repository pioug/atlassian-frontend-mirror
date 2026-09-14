import { taskNodeAdf } from '../__fixtures__/full-width-adf';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const TaskRenderer: ComponentType<any> = generateRendererComponent({
	document: taskNodeAdf,
	appearance: 'full-width',
});

export const TaskRendererWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: taskNodeAdf,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
