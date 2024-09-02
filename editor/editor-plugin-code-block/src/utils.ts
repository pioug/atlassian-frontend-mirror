export {
	findCodeBlock,
	transformSliceToJoinAdjacentCodeBlocks,
	transformSingleLineCodeBlockToCodeMark,
} from '@atlaskit/editor-common/transforms';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export function getCursor(selection: Selection): ResolvedPos | undefined {
	return (selection as TextSelection).$cursor || undefined;
}

export function getAllCodeBlockNodesInDoc(state: EditorState): NodeWithPos[] {
	const codeBlockNodes: NodeWithPos[] = [];
	state.doc.descendants((node, pos) => {
		if (node.type === state.schema.nodes.codeBlock) {
			codeBlockNodes.push({ node, pos });
			return false;
		}
		return true;
	});

	return codeBlockNodes;
}
