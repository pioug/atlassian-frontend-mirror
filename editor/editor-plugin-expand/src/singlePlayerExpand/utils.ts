import type { EditorState } from '@atlaskit/editor-prosemirror/dist/types/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export {
	findExpand,
	transformSliceToRemoveOpenExpand,
	transformSliceToRemoveOpenNestedExpand,
	transformSliceNestedExpandToExpand,
} from '@atlaskit/editor-common/transforms';

export const findParentExpandNode = (state: EditorState) => {
	return (
		findParentNodeOfType(state.schema.nodes.expand)(state.selection) ||
		findParentNodeOfType(state.schema.nodes.nestedExpand)(state.selection)
	);
};
