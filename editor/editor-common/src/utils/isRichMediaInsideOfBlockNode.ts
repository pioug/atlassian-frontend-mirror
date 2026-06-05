import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const isRichMediaInsideOfBlockNode = (view: EditorView, pos: number | boolean): boolean => {
	if (typeof pos !== 'number' || isNaN(pos) || !view) {
		return false;
	}

	const $pos = view.state.doc.resolve(pos);

	const { expand, nestedExpand, layoutColumn, bodiedSyncBlock } = view.state.schema.nodes;

	if (editorExperiment('platform_synced_block', true)) {
		return !!findParentNodeOfTypeClosestToPos($pos, [
			expand,
			nestedExpand,
			layoutColumn,
			bodiedSyncBlock,
		]);
	}
	return !!findParentNodeOfTypeClosestToPos($pos, [expand, nestedExpand, layoutColumn]);
};
