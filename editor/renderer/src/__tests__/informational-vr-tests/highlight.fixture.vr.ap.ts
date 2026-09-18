import type { ComponentType } from 'react';

import * as adfHighlightPadding from '../__fixtures__/highlight-padding.adf.json';
import * as adfBackgroundColorYellow from '../__fixtures__/highlight-yellow.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';

export const BackgroundColorYellow: ComponentType<any> = generateRendererComponent({
	document: adfBackgroundColorYellow,
	appearance: 'comment',
});

export const HighlightPadding: ComponentType<any> = generateRendererComponent({
	document: adfHighlightPadding,
	appearance: 'comment',
});
