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
/**
 * @deprecated
 * DO NOT USE THIS WILL BE REMOVED SOON AND IS UNSAFE.
 * Please use the the openHelp action via the editorAPI from the `@atlaskit/editor-plugin-help-dialog` plugin.
 */
export { default as WithHelpTrigger } from './ui/WithHelpTrigger';
export { default as CollapsedEditor } from './ui/CollapsedEditor';
export { default as ToolbarHelp } from './ui/ToolbarHelp';
export {
	/**
	 * @deprecated
	 * DO NOT USE THIS WILL BE REMOVED SOON. This was intended for internal usage only
	 */
	ContextPanel,
} from './ui/ContextPanel';

export type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';

// Used in editor-test-helpers and mobile bridge
export { getNodesCount, measurements } from './utils';
export { setTextSelection } from '@atlaskit/editor-common/utils';
export type { Command, EditorPlugin, EditorProps, EditorInstance, CommandDispatch } from './types';
export { default as EditorActions } from './actions';

export { createEditorContentStyle } from './ui/ContentStyles';
