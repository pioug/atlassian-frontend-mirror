import type { ComponentType } from 'react';

import * as unsupportedInlineAdf from '../__fixtures__/unsupported-inline.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const UnsupportedInlineRenderer: ComponentType<any> = generateRendererComponent({
	document: unsupportedInlineAdf,
	appearance: 'full-width',
});
