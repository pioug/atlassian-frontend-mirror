import type { ComponentType } from 'react';

import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';
import * as adfWithDate from '../__fixtures__/date.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const DateRenderer: ComponentType<any> = generateRendererComponent({
	document: adfWithDate,
	appearance: 'full-width',
});

export const DateRendererWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: adfWithDate,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
