import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { layoutAndMediaAdf } from './__fixtures__/layout-and-media-adf';
import { annotationInlineCommentProvider } from '../__helpers/rendererWithAnnotations.vr.ap';
import type { ComponentType } from 'react';

export const BodiedSyncBlockWithLayoutAndMediaRenderer: ComponentType<any> =
	generateRendererComponent({
		document: layoutAndMediaAdf,
		appearance: 'full-page',
		allowAnnotations: true,
		annotationProvider: { inlineComment: annotationInlineCommentProvider },
	});
