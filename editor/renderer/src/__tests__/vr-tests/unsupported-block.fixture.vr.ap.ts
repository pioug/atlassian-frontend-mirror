import type { ComponentType } from 'react';
import { unsupportedBlockAdf } from '../__fixtures__/unsupported-block';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const UnsupportedBlockRenderer: ComponentType<any> = generateRendererComponent({
	document: unsupportedBlockAdf,
	appearance: 'full-width',
});
