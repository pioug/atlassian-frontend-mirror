// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { annotationPlugin } from './annotationPlugin';
export type { AnnotationPlugin, AnnotationPluginOptions } from './annotationPluginType';
export type {
	AnnotationProviders,
	InlineCommentAnnotationProvider,
	AnnotationInfo,
	InlineCommentCreateComponentProps,
	InlineCommentViewComponentProps,
	AnnotationState,
	AnnotationTypeProvider,
	InlineCommentState,
	TargetType,
	InlineCommentInputMethod,
} from './types';
export type {
	InlineCommentMap,
	InlineCommentPluginState,
	InlineCommentPluginOptions,
	InlineCommentAction,
} from './pm-plugins/types';
