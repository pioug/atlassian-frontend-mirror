import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { pluginKey } from '../../pm-plugins/plugin-key';

/**
 * Copy of the helper in `useResizeWidthObserver`, so that file stays untouched while
 * `platform_editor_reduce_forced_layout` is running. On cleanup, delete that file and this becomes
 * the only definition.
 */
export const setEditorWidth: (
	props: Partial<WidthPluginState>,
) => (editorView: EditorView) => void =
	(props) =>
	(editorView): void => {
		const {
			dispatch,
			state: { tr },
		} = editorView;

		tr.setMeta(pluginKey, props);

		dispatch(tr);
	};
