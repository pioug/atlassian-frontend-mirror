import * as adfBackgroundColorYellow from '../__fixtures__/highlight-yellow.adf.json';
import * as adfHighlightPadding from '../__fixtures__/highlight-padding.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import type { ComponentType } from 'react';

export const BackgroundColorYellow: ComponentType<any> = generateRendererComponent({
	document: adfBackgroundColorYellow,
	appearance: 'comment',
});

export const HighlightPadding: ComponentType<any> = generateRendererComponent({
	document: adfHighlightPadding,
	appearance: 'comment',
});
