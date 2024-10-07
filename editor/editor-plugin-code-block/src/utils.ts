export {
	findCodeBlock,
	transformSliceToJoinAdjacentCodeBlocks,
	transformSingleLineCodeBlockToCodeMark,
} from '@atlaskit/editor-common/transforms';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	ReadonlyTransaction,
	Selection,
	TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export function getCursor(selection: Selection): ResolvedPos | undefined {
	return (selection as TextSelection).$cursor || undefined;
}

// Replaced by getAllChangedCodeBlocksInTransaction with FG editor_code_wrapping_perf_improvement_ed-25141.
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

export function getAllChangedCodeBlocksInTransaction(
	tr: ReadonlyTransaction,
	state: EditorState,
): NodeWithPos[] | null {
	const changedCodeBlocks: NodeWithPos[] = [];
	const nodePositions = new Set();
	tr.steps.forEach((step) => {
		const mapResult = step.getMap();

		mapResult.forEach((oldStart, oldEnd, newStart, newEnd) => {
			state.doc.nodesBetween(newStart, newEnd, (node, pos) => {
				if (node.type.name === 'codeBlock') {
					if (!nodePositions.has(pos)) {
						nodePositions.add(pos);
						changedCodeBlocks.push({ node, pos });
					}
				}
			});
		});
	});

	if (changedCodeBlocks.length < 1) {
		return null;
	}
	return changedCodeBlocks;
}
