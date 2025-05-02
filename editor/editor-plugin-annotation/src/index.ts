// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { annotationPlugin } from './annotationPlugin';
export type { AnnotationPlugin, AnnotationPluginOptions } from './annotationPluginType';
export type {
	AnnotationInfo,
	AnnotationProviders,
	AnnotationState,
	AnnotationTypeProvider,
	InlineCommentAnnotationProvider,
	InlineCommentCompoundExperience,
	InlineCommentCreateComponentProps,
	InlineCommentInputMethod,
	InlineCommentState,
	InlineCommentViewComponentProps,
	SelectInlineCommentCompoundExperience,
	SelectInlineCommentCompoundExperienceEntryPoint,
	SimpleSelectInlineCommentCompoundExperience,
	StartAttributes,
	TargetType,
} from './types';
export type {
	InlineCommentMap,
	InlineCommentPluginState,
	InlineCommentPluginOptions,
	InlineCommentAction,
} from './pm-plugins/types';
