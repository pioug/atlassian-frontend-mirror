import type { ComponentType } from 'react';

import * as placeholderAdf from '../__fixtures__/placeholder.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const PlaceholderRenderer: ComponentType<any> = generateRendererComponent({
	document: placeholderAdf,
	appearance: 'full-width',
	allowPlaceholderText: true,
});
