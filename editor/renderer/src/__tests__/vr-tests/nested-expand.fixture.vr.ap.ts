import type { ComponentType } from 'react';

import { nestedExpandInExpandADF } from '../__fixtures__/nested-expand-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const NestedExpandInExpandRenderer: ComponentType<any> = generateRendererComponent({
	document: nestedExpandInExpandADF(),
	appearance: 'full-width',
});

export const NestedExpandInExpandDefaultModeRenderer: ComponentType<any> =
	generateRendererComponent({
		document: nestedExpandInExpandADF('default'),
		appearance: 'full-width',
	});

export const NestedExpandInExpandWideModeRenderer: ComponentType<any> = generateRendererComponent({
	document: nestedExpandInExpandADF('wide'),
	appearance: 'full-width',
});

export const NestedExpandInExpandFullWidthModeRenderer: ComponentType<any> =
	generateRendererComponent({
		document: nestedExpandInExpandADF('full-width'),
		appearance: 'full-width',
	});
