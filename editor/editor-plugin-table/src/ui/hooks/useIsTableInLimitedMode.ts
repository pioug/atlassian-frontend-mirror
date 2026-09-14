import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { PluginInjectionAPI } from '../../types';

/**
 * Limited mode strips expensive behaviour on very large documents. For tables that means dragging
 * rows and columns is turned off, and so is resizing the table as a whole. Column resizing is left
 * alone — only the whole-table resizer goes away.
 */
export const useIsTableInLimitedMode = (
	api: PluginInjectionAPI | undefined | null,
	editorView: EditorView,
): boolean => {
	const enabled = useSharedPluginStateWithSelector(
		api,
		['limitedMode'],
		(states) => !!states.limitedModeState?.enabled,
	);
	return enabled && isExperimentEnabled('platform_editor_table_limited_mode');
};
