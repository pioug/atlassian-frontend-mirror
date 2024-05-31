import * as placeholderAdf from '../__fixtures__/placeholder.adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';

export const PlaceholderRenderer = generateRendererComponent({
	document: placeholderAdf,
	appearance: 'full-width',
	allowPlaceholderText: true,
});
