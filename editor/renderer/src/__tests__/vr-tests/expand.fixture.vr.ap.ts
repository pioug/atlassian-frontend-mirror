import type { ComponentType } from 'react';

import { nodeToReact as looselyLazyNodes } from '../../react/nodes/loosely-lazy';
import { expandADF } from '../__fixtures__/expand-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const ExpandRenderer: ComponentType<any> = generateRendererComponent({
	document: expandADF(),
	appearance: 'full-width',
});

export const ExpandHoveredRenderer: ComponentType<any> = generateRendererComponent({
	document: expandADF(),
	appearance: 'full-width',
});

export const ExpandWrappedRenderer: ComponentType<any> = generateRendererComponent({
	document: expandADF(
		undefined,
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem',
	),
	appearance: 'full-width',
});

export const ExpandDefaultModeRenderer: ComponentType<any> = generateRendererComponent({
	document: expandADF('default'),
	appearance: 'full-width',
});

export const ExpandWideModeRenderer: ComponentType<any> = generateRendererComponent({
	document: expandADF('wide'),
	appearance: 'full-width',
});

export const ExpandFullWidthModeRenderer: ComponentType<any> = generateRendererComponent({
	document: expandADF('full-width'),
	appearance: 'full-width',
});

export const ExpandRendererWithReactLooselyLazy: ComponentType<any> = generateRendererComponent({
	document: expandADF(),
	appearance: 'full-width',
	nodeComponents: looselyLazyNodes,
});

export const ExpandFullPageRenderer: ComponentType<any> = generateRendererComponent({
	document: expandADF('full-width'),
	appearance: 'full-page',
});
