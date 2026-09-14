import * as highlightAdf from '../__fixtures__/highlight.adf.json';
import * as highlightOverlappedAdf from '../__fixtures__/highlight-overlapped.adf.json';
import * as highlightCustomColorsAdf from '../__fixtures__/highlight-custom-colors.adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { annotationInlineCommentProvider } from '../__helpers/rendererWithAnnotations.vr.ap';
import type { ComponentType } from 'react';

export const BackgroundColorDefinedColors: ComponentType<any> = generateRendererComponent({
	document: highlightAdf,
	appearance: 'comment',
});

export const BackgroundColorOverlapped: ComponentType<any> = generateRendererComponent({
	document: highlightOverlappedAdf,
	appearance: 'comment',
	allowAnnotations: true,
	annotationProvider: {
		inlineComment: annotationInlineCommentProvider,
	},
});

export const BackgroundColorCustomColors: ComponentType<any> = generateRendererComponent({
	document: highlightCustomColorsAdf,
	appearance: 'comment',
});
