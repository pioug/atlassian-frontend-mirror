// [ED-22843] use FF in editor-core for sake of example
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

// Used in products integration code
export { name, version } from './version-wrapper';
export { default as Editor } from './editor';
export { default as EditorContext } from './ui/EditorContext';
export { default as WithEditorActions } from './ui/WithEditorActions';
export { default as WithHelpTrigger } from './ui/WithHelpTrigger';
export { default as CollapsedEditor } from './ui/CollapsedEditor';
export { default as ToolbarHelp } from './ui/ToolbarHelp';
export { default as ToolbarFeedback } from './ui/ToolbarFeedback';
export { default as ContextPanel } from './ui/ContextPanel';
export { EmojiResource } from '@atlaskit/emoji/resource';
export { MentionResource } from '@atlaskit/mention/resource';
export type { MentionProvider, PresenceProvider } from '@atlaskit/mention/resource';
export { TeamMentionResource } from '@atlaskit/mention/team-resource';
/**
 * @deprecated
 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
 * This is here while we work to extract the annotation plugin.
 * Please use the export from `@atlaskit/editor-common/annotation`.
 */
export { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';
export type { UpdateEvent } from '@atlaskit/editor-common/annotation';
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
export type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
export {
	INPUT_METHOD,
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
export type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';

// Used in editor-test-helpers and mobile bridge
export { setTextSelection, getNodesCount, measurements } from './utils';
export type { Command, EditorPlugin, EditorProps, EditorInstance, CommandDispatch } from './types';
export { default as EditorActions } from './actions';
// Re-export from provider factory to not cause a breaking change
export type {
	MacroProvider,
	MacroAttributes,
	ExtensionType,
	CardProvider,
} from '@atlaskit/editor-common/provider-factory';
export {
	PortalProvider,
	LegacyPortalProviderAPI,
	PortalRenderer,
} from '@atlaskit/editor-common/portal-provider';

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

// [ED-22843] use FF in editor-core for sake of example
// @ts-expect-error function is not being used
const ignoreFunction = () => {
	// eslint-disable-next-line @atlaskit/platform/no-invalid-feature-flag-usage, @atlaskit/platform/ensure-feature-flag-prefix
	getBooleanFF('__live-view-toggle');
	return;
};
