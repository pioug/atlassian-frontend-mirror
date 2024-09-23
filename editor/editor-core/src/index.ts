// Used in products integration code
export { name, version } from './version-wrapper';
export { default as Editor } from './editor';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-core/editor-context`.
	 */
	default as EditorContext,
} from './ui/EditorContext';
export { default as WithEditorActions } from './ui/WithEditorActions';
export { default as WithHelpTrigger } from './ui/WithHelpTrigger';
export { default as CollapsedEditor } from './ui/CollapsedEditor';
export { default as ToolbarHelp } from './ui/ToolbarHelp';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON.
	 *
	 * This was intended for rollout of bitbucket only.
	 */
	default as ToolbarFeedback,
} from './ui/ToolbarFeedback';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON. This was intended for internal usage only
	 */
	ContextPanel,
} from './ui/ContextPanel';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/emoji/resource`.
	 */
	EmojiResource,
} from '@atlaskit/emoji/resource';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/mention/resource`.
	 */
	MentionResource,
} from '@atlaskit/mention/resource';
export type {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/mention/resource`.
	 */
	MentionProvider,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/mention/resource`.
	 */
	PresenceProvider,
} from '@atlaskit/mention/resource';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/mention/team-resource`.
	 */
	TeamMentionResource,
} from '@atlaskit/mention/team-resource';
/**
 * @deprecated
 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
 * Please use the export from `@atlaskit/editor-common/annotation`.
 */
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/annotation`.
	 */
	AnnotationUpdateEmitter,
} from '@atlaskit/editor-common/annotation';
export type {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/annotation`.
	 */
	UpdateEvent,
} from '@atlaskit/editor-common/annotation';
/**
 * @deprecated
 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
 * This is here while we work to extract the annotation plugin.
 * Please use the export from `@atlaskit/editor-plugins/annotation`.
 */
export type {
	AnnotationProviders,
	InlineCommentAnnotationProvider,
	InlineCommentCreateComponentProps,
	InlineCommentViewComponentProps,
	AnnotationInfo,
	AnnotationState,
	AnnotationTypeProvider,
	InlineCommentState,
} from '@atlaskit/editor-plugins/annotation';
// Used in mobile bridge
export type {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/provider-factory`.
	 */
	TypeAheadItem,
} from '@atlaskit/editor-common/provider-factory';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/analytics`.
	 */
	INPUT_METHOD,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/analytics`.
	 */
	ACTION,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/analytics`.
	 */
	ACTION_SUBJECT,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/analytics`.
	 */
	ACTION_SUBJECT_ID,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/analytics`.
	 */
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
export type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';

// Used in editor-test-helpers and mobile bridge
export { getNodesCount, measurements } from './utils';
export { setTextSelection } from '@atlaskit/editor-common/utils';
export type { Command, EditorPlugin, EditorProps, EditorInstance, CommandDispatch } from './types';
export { default as EditorActions } from './actions';
// Re-export from provider factory to not cause a breaking change
export type {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/provider-factory`.
	 */
	MacroProvider,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/provider-factory`.
	 */
	MacroAttributes,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/provider-factory`.
	 */
	ExtensionType,
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
	 * Please use the export from `@atlaskit/editor-common/provider-factory`.
	 */
	CardProvider,
} from '@atlaskit/editor-common/provider-factory';

/**
 * @deprecated
 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
 * This is here while we work to extract the media plugin.
 * Please use the export from `@atlaskit/editor-common/provider-factory`.
 */
export type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
/**
 * @deprecated
 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
 * This is here while we work to extract the media plugin.
 * Please use the export from `@atlaskit/editor-plugins/media/types`.
 */
export type { MediaOptions } from '@atlaskit/editor-plugins/media/types';
export type {
	/**
	 * @deprecated Use QuickInsertItem from @atlaskit/editor-common/provider-factory instead
	 */
	QuickInsertItem,
	/**
	 * @deprecated Use QuickInsertProvider from @atlaskit/editor-common/provider-factory instead
	 */
	QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

export { createEditorContentStyle } from './ui/ContentStyles';
