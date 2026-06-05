import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Node } from '@atlaskit/editor-prosemirror/model';

import { mapSlice } from '../utils/slice';

function joinCodeBlocks(left: Node, right: Node) {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const textContext = `${left.textContent!}\n${right.textContent!}`;
	return left.type.create(left.attrs, left.type.schema.text(textContext));
}

function mergeAdjacentCodeBlocks(fragment: Fragment): Fragment {
	const children = [] as Node[];
	fragment.forEach((maybeCodeBlock) => {
		if (maybeCodeBlock.type === maybeCodeBlock.type.schema.nodes.codeBlock) {
			const peekAtPrevious = children[children.length - 1];
			if (peekAtPrevious && peekAtPrevious.type === maybeCodeBlock.type) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return children.push(joinCodeBlocks(children.pop()!, maybeCodeBlock));
			}
		}
		return children.push(maybeCodeBlock);
	});
	return Fragment.from(children);
}

export function transformSliceToJoinAdjacentCodeBlocks(slice: Slice): Slice {
	slice = mapSlice(slice, (node) => {
		return node.isBlock && !node.isTextblock
			? node.copy(mergeAdjacentCodeBlocks(node.content))
			: node;
	});
	// mapSlice won't be able to merge adjacent top-level code-blocks
	return new Slice(mergeAdjacentCodeBlocks(slice.content), slice.openStart, slice.openEnd);
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { transformSingleLineCodeBlockToCodeMark } from './transformSingleLineCodeBlockToCodeMark';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { findCodeBlock } from './findCodeBlock';
