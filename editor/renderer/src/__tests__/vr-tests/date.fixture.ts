import * as adfWithDate from '../__fixtures__/date.adf.json';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const DateRenderer = generateRendererComponent({
	document: adfWithDate,
	appearance: 'full-width',
});

export const DateRendererWithReactLooselyLazy = generateRendererComponent({
	document: adfWithDate,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
