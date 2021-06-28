import { Node, Slice, Fragment, Schema } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import { mapSlice } from '../../utils/slice';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';

function joinCodeBlocks(left: Node, right: Node) {
  const textContext = `${left.textContent!}\n${right.textContent!}`;
  return left.type.create(left.attrs, left.type.schema.text(textContext));
}

function mergeAdjacentCodeBlocks(fragment: Fragment): Fragment {
  const children = [] as Node[];
  fragment.forEach((maybeCodeBlock) => {
    if (maybeCodeBlock.type === maybeCodeBlock.type.schema.nodes.codeBlock) {
      const peekAtPrevious = children[children.length - 1];
      if (peekAtPrevious && peekAtPrevious.type === maybeCodeBlock.type) {
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
  return new Slice(
    mergeAdjacentCodeBlocks(slice.content),
    slice.openStart,
    slice.openEnd,
  );
}

export const transformSingleLineCodeBlockToCodeMark = (
  slice: Slice,
  schema: Schema,
) => {
  if (slice.content.childCount === 1 && (slice.openStart || slice.openEnd)) {
    const maybeCodeBlock = slice.content.firstChild;
    if (maybeCodeBlock && maybeCodeBlock.type === schema.nodes.codeBlock) {
      if (
        maybeCodeBlock.textContent &&
        maybeCodeBlock.textContent.indexOf('\n') === -1
      ) {
        return new Slice(
          Fragment.from(
            schema.text(maybeCodeBlock.textContent, [
              schema.marks.code.create(),
            ]),
          ),
          0,
          0,
        );
      }
    }
  }
  return slice;
};

export const findCodeBlock = (
  state: EditorState,
  selection?: Selection<any> | null,
) => {
  const { codeBlock } = state.schema.nodes;
  return (
    findSelectedNodeOfType(codeBlock)(selection || state.selection) ||
    findParentNodeOfType(codeBlock)(selection || state.selection)
  );
};
