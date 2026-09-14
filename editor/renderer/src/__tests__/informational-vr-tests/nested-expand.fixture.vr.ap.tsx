import { adfNestedExpandInsideExpand } from './__fixtures__';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const NestedExpandRenderer: ComponentType<any> = generateRendererComponent({
	document: adfNestedExpandInsideExpand,
	appearance: 'full-page',
});
