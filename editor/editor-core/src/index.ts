// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

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

// Used in editor-test-helpers and mobile bridge
export { getNodesCount } from './utils/getNodesCount';
export { default as measurements } from './utils/performance/measure-enum';
export type { Command, EditorProps, EditorInstance, CommandDispatch } from './types';
export { default as EditorActions } from './actions';

export { createEditorContentStyle } from './ui/ContentStyles';
