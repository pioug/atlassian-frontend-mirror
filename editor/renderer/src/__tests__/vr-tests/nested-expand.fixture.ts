import { nestedExpandInExpandADF } from '../__fixtures__/nested-expand-adf';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const NestedExpandInExpandRenderer = generateRendererComponent({
	document: nestedExpandInExpandADF(),
	appearance: 'full-width',
});

export const NestedExpandInExpandDefaultModeRenderer = generateRendererComponent({
	document: nestedExpandInExpandADF('default'),
	appearance: 'full-width',
});

export const NestedExpandInExpandWideModeRenderer = generateRendererComponent({
	document: nestedExpandInExpandADF('wide'),
	appearance: 'full-width',
});

export const NestedExpandInExpandFullWidthModeRenderer = generateRendererComponent({
	document: nestedExpandInExpandADF('full-width'),
	appearance: 'full-width',
});
