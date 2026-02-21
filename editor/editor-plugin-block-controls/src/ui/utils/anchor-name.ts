import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { findNodeDecs } from '../../pm-plugins/decorations-anchor';
import { key } from '../../pm-plugins/main';

type RefreshAnchorNameParams = {
	anchorName?: string;
	getPos: () => number | undefined;
	view: EditorView;
};

/**
 * Checks for plugin state for latest anchorName based on the position, returns
 * provided anchorName if available
 */
export const refreshAnchorName = ({
	getPos,
	view,
	anchorName,
}: RefreshAnchorNameParams): string => {
	let newAnchorName = anchorName || '';
	if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
		return newAnchorName;
	}
	const pos = getPos();

	if (anchorName || pos === undefined) {
		return newAnchorName;
	}

	const node = view.state.doc.nodeAt(pos);
	const state = key.getState(view.state);

	if (state?.decorations) {
		const nodeDecs = findNodeDecs(view.state, state.decorations, pos, pos + (node?.nodeSize ?? 0));
		const nodeDec = nodeDecs.at(0);
		if (!nodeDec) {
			return newAnchorName;
		}
		newAnchorName = nodeDec.spec.anchorName;
	}

	return newAnchorName;
};
