// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { annotationPlugin } from './annotationPlugin';
export type {
	AnnotationPlugin,
	AnnotationPluginOptions,
	AnnotationPluginDependencies,
} from './annotationPluginType';
export type {
	AnnotationInfo,
	AnnotationProviders,
	AnnotationState,
	AnnotationTypeProvider,
	InlineCommentAnnotationProvider,
	InlineCommentCreateComponentProps,
	InlineCommentInputMethod,
	InlineCommentState,
	InlineCommentViewComponentProps,
	TargetType,
} from './types';
export type {
	InlineCommentMap,
	InlineCommentPluginState,
	InlineCommentPluginOptions,
	InlineCommentAction,
} from './pm-plugins/types';
