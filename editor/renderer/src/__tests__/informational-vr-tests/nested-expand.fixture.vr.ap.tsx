import type { ComponentType } from 'react';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { adfNestedExpandInsideExpand } from './__fixtures__';

export const NestedExpandRenderer: ComponentType<any> = generateRendererComponent({
	document: adfNestedExpandInsideExpand,
	appearance: 'full-page',
});
