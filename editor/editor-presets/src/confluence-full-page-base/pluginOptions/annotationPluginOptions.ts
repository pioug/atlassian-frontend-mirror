import type { AnnotationManager } from '@atlaskit/editor-common/annotation';
import type {
	AnnotationPluginOptions,
	InlineCommentAnnotationProvider,
} from '@atlaskit/editor-plugin-annotation';

interface Props {
	options: {
		annotationManager: AnnotationManager | undefined;
		createCommentExperience: AnnotationPluginOptions['createCommentExperience'];
		selectCommentExperience:
			| {
					selectAnnotation: {
						complete: (_: {
							annotationId: string;
							entryPoint: 'annotation-change';
							pageClass: 'editor';
						}) => void;
					};
			  }
			| undefined;
		viewInlineCommentTraceUFOPress?: () => void;
	};
	providers: { inlineCommentAnnotationProvider?: InlineCommentAnnotationProvider };
}

export function annotationPluginOptions({
	options,
	providers,
}: Props): AnnotationPluginOptions | undefined {
	if (!providers.inlineCommentAnnotationProvider) {
		return undefined;
	}

	return {
		inlineComment: providers.inlineCommentAnnotationProvider,
		createCommentExperience: options.createCommentExperience,
		selectCommentExperience: {
			selectAnnotation: {
				complete: (annotationId: string) => {
					options.selectCommentExperience?.selectAnnotation.complete({
						pageClass: 'editor',
						annotationId,
						entryPoint: 'annotation-change',
					});
				},
			},
		},
		viewInlineCommentTraceUFOPress: options.viewInlineCommentTraceUFOPress,
		annotationManager: options.annotationManager,
	};
}
