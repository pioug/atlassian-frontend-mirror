import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { getPluginState } from '../plugin-factory';

export function getAllowAddColumnCustomStep(state: EditorState): boolean {
	const tablePluginState = getPluginState(state);
	return (
		Boolean(tablePluginState) && Boolean(tablePluginState.pluginConfig.allowAddColumnWithCustomStep)
	);
}
