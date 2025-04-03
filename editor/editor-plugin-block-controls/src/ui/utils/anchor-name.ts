import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { findNodeDecs } from '../../pm-plugins/decorations-anchor';
import { key } from '../../pm-plugins/main';

type RefreshAnchorNameParams = {
	getPos: () => number | undefined;
	view: EditorView;
	anchorName?: string;
};

/**
 * Checks for plugin state for latest anchorName based on the position, returns
 * provided anchorName if available
 */
export const refreshAnchorName = ({ getPos, view, anchorName }: RefreshAnchorNameParams) => {
	let newAnchorName = anchorName || '';
	const pos = getPos();

	if (anchorName || pos === undefined) {
		return newAnchorName;
	}

	const node = view.state.doc.nodeAt(pos);
	const state = key.getState(view.state);

	if (state?.decorations) {
		const nodeDecs = findNodeDecs(state.decorations, pos, pos + (node?.nodeSize ?? 0));
		const nodeDec = nodeDecs.at(0);
		if (!nodeDec) {
			return newAnchorName;
		}
		newAnchorName = nodeDec.spec.anchorName;
	}

	return newAnchorName;
};
