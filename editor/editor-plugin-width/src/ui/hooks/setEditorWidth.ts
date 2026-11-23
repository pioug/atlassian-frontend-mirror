import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types/editor-container-width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { pluginKey } from '../../pm-plugins/plugin-key';

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
