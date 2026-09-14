import * as adfWithDate from '../__fixtures__/date.adf.json';
import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const DateRenderer: ComponentType<any> = generateRendererComponent({
	document: adfWithDate,
	appearance: 'full-width',
});

export const DateRendererWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: adfWithDate,
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});
