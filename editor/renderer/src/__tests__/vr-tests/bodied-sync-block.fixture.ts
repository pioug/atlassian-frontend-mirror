import { generateRendererComponent } from '../__helpers/rendererComponents';
import { layoutAndMediaAdf } from './__fixtures__/layout-and-media-adf';
import { annotationInlineCommentProvider } from '../__helpers/rendererWithAnnotations';

export const BodiedSyncBlockWithLayoutAndMediaRenderer = generateRendererComponent({
	document: layoutAndMediaAdf,
	appearance: 'full-page',
	allowAnnotations: true,
	annotationProvider: { inlineComment: annotationInlineCommentProvider },
});
