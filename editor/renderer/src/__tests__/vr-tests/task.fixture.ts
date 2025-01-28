import { taskNodeAdf } from '../__fixtures__/full-width-adf';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';
import { generateRendererComponent } from '../__helpers/rendererComponents';

export const TaskRenderer = generateRendererComponent({
	document: taskNodeAdf,
	appearance: 'full-width',
});

export const TaskRendererWithReactLooselyLazy = generateRendererComponent({
	document: taskNodeAdf,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
