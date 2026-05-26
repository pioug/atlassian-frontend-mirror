import type { Valign } from '@atlaskit/adf-schema/layout-column';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { getPluginState } from '../../../../pm-plugins/plugin-factory';

const getNormalizedValign = (valign?: Valign | null): Valign => valign ?? 'top';

export const getSelectedCellValign = (editorView?: EditorView): Valign => {
	if (!editorView) {
		return 'top';
	}

	const { state } = editorView;
	const { targetCellPosition } = getPluginState(state);
	const cell =
		typeof targetCellPosition === 'number' ? state.doc.nodeAt(targetCellPosition) : undefined;

	return getNormalizedValign(cell?.attrs.valign);
};
