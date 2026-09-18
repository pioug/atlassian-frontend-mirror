import type { ComponentType } from 'react';

import { bodiedExtensionNodeAdf } from '../__fixtures__/full-width-adf';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const BodiedExtensionRenderer: ComponentType<any> = generateRendererComponent({
	document: bodiedExtensionNodeAdf,
	appearance: 'full-width',
});
