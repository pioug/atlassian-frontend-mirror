import {
  Fragment,
  NodeRange,
  Slice,
  Schema,
  Node,
  NodeType,
  Mark,
} from 'prosemirror-model';
import {
  EditorState,
  Transaction,
  TextSelection,
  Selection,
} from 'prosemirror-state';
import { liftTarget, ReplaceAroundStep } from 'prosemirror-transform';
import { autoJoin } from 'prosemirror-commands';
import { isListNode } from './utils/node';
import { mapSlice, mapChildren } from '../../utils/slice';
import { getListLiftTarget } from './utils/indentation';

function liftListItem(selection: Selection, tr: Transaction): Transaction {
  let { $from, $to } = selection;
  const nodeType = tr.doc.type.schema.nodes.listItem;
  let range = $from.blockRange(
    $to,
    (node) =>
      !!node.childCount &&
      !!node.firstChild &&
      node.firstChild.type === nodeType,
  );
  if (
    !range ||
    range.depth < 2 ||
    $from.node(range.depth - 1).type !== nodeType
  ) {
    return tr;
  }
  let end = range.end;
  let endOfList = $to.end(range.depth);
  if (end < endOfList) {
    tr.step(
      new ReplaceAroundStep(
        end - 1,
        endOfList,
        end,
        endOfList,
        new Slice(
          Fragment.from(nodeType.create(undefined, range.parent.copy())),
          1,
          0,
        ),
        1,
        true,
      ),
    );

    range = new NodeRange(
      tr.doc.resolve($from.pos),
      tr.doc.resolve(endOfList),
      range.depth,
    );
  }
  return tr.lift(range, liftTarget(range) as number).scrollIntoView();
}

// Function will lift list item following selection to level-1.
export function liftFollowingList(
  from: number,
  to: number,
  rootListDepth: number,
  tr: Transaction,
): Transaction {
  const { listItem } = tr.doc.type.schema.nodes;
  let lifted = false;
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (!lifted && node.type === listItem && pos > from) {
      lifted = true;
      let listDepth = rootListDepth + 3;
      while (listDepth > rootListDepth + 2) {
        const start = tr.doc.resolve(tr.mapping.map(pos));
        listDepth = start.depth;
        const end = tr.doc.resolve(
          tr.mapping.map(pos + node.textContent.length),
        );
        const sel = new TextSelection(start, end);
        tr = liftListItem(sel, tr);
      }
    }
  });
  return tr;
}

// The function will list paragraphs in selection out to level 1 below root list.
export function liftSelectionList(
  selection: Selection,
  tr: Transaction,
): Transaction {
  const { from, to } = selection;
  const { paragraph } = tr.doc.type.schema.nodes;
  const listCol: any[] = [];
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === paragraph) {
      listCol.push({ node, pos });
    }
  });
  for (let i = listCol.length - 1; i >= 0; i--) {
    const paragraph = listCol[i];
    const start = tr.doc.resolve(tr.mapping.map(paragraph.pos));
    if (start.depth > 0) {
      let end;
      if (paragraph.node.textContent && paragraph.node.textContent.length > 0) {
        end = tr.doc.resolve(
          tr.mapping.map(paragraph.pos + paragraph.node.textContent.length),
        );
      } else {
        end = tr.doc.resolve(tr.mapping.map(paragraph.pos + 1));
      }
      const range = start.blockRange(end);
      if (range) {
        tr.lift(range, getListLiftTarget(start));
      }
    }
  }
  return tr;
}

// matchers for text lists
const bullets = /^\s*[\*\-\u2022](\s+|\s+$)/;
const numbers = /^\s*\d[\.\)](\s+|$)/;

const getListType = (node: Node, schema: Schema): [NodeType, number] | null => {
  if (!node.text) {
    return null;
  }

  const { bulletList, orderedList } = schema.nodes;

  return [
    {
      node: bulletList,
      matcher: bullets,
    },
    {
      node: orderedList,
      matcher: numbers,
    },
  ].reduce((lastMatch: [NodeType, number] | null, listType) => {
    if (lastMatch) {
      return lastMatch;
    }

    const match = node.text!.match(listType.matcher);
    return match ? [listType.node, match[0].length] : lastMatch;
  }, null);
};

const extractListFromParagraph = (
  node: Node,
  parent: Node | null,
  schema: Schema,
): Fragment => {
  const { hardBreak, bulletList, orderedList } = schema.nodes;
  const content: Array<Node> = mapChildren(node.content, (node) => node);

  const listTypes = [bulletList, orderedList];

  // wrap each line into a listItem and a containing list
  const listified = content
    .map((child, index) => {
      const listMatch = getListType(child, schema);
      const prevChild = index > 0 && content[index - 1];

      // only extract list when preceded by a hardbreak
      if (prevChild && prevChild.type !== hardBreak) {
        return child;
      }

      if (!listMatch || !child.text) {
        return child;
      }

      const [nodeType, length] = listMatch;

      // convert to list item
      const newText = child.text.substr(length);
      const listItemNode = schema.nodes.listItem.createAndFill(
        undefined,
        schema.nodes.paragraph.createChecked(
          undefined,
          newText.length ? schema.text(newText) : undefined,
        ),
      );

      if (!listItemNode) {
        return child;
      }

      const newList = nodeType.createChecked(undefined, [listItemNode]);
      // Check whether our new list is valid content in our current structure,
      // otherwise dont convert.
      if (parent && !parent.type.validContent(Fragment.from(newList))) {
        return child;
      }

      return newList;
    })
    .filter((child, idx, arr) => {
      // remove hardBreaks that have a list node on either side

      // wasn't hardBreak, leave as-is
      if (child.type !== hardBreak) {
        return child;
      }

      if (idx > 0 && listTypes.indexOf(arr[idx - 1].type) > -1) {
        // list node on the left
        return null;
      }

      if (idx < arr.length - 1 && listTypes.indexOf(arr[idx + 1].type) > -1) {
        // list node on the right
        return null;
      }

      return child;
    });

  // try to join
  const mockState = EditorState.create({
    schema,
  });

  let joinedListsTr: Transaction | undefined;
  const mockDispatch = (tr: Transaction) => {
    joinedListsTr = tr;
  };

  autoJoin(
    (state, dispatch) => {
      if (!dispatch) {
        return false;
      }

      // Return false to prevent replaceWith from wrapping the text node in a paragraph
      // paragraph since that will be done later. If it's done here, it will fail
      // the paragraph.validContent check.
      if (listified.some((node) => node.isText)) {
        return false;
      }

      dispatch(state.tr.replaceWith(0, 2, listified));
      return true;
    },
    (before, after) => isListNode(before) && isListNode(after),
  )(mockState, mockDispatch);

  const fragment = joinedListsTr
    ? joinedListsTr.doc.content
    : Fragment.from(listified);

  // try to re-wrap fragment in paragraph (which is the original node we unwrapped)
  const { paragraph } = schema.nodes;
  if (paragraph.validContent(fragment)) {
    return Fragment.from(paragraph.create(node.attrs, fragment, node.marks));
  }

  // fragment now contains other nodes, get Prosemirror to wrap with ContentMatch later
  return fragment;
};

/**
 * Walks the slice, creating paragraphs that were previously separated by hardbreaks.
 * Returns the original paragraph node (as a fragment), or a fragment containing multiple nodes.
 */
const splitIntoParagraphs = ({
  fragment,
  blockMarks = [],
  schema,
}: {
  fragment: Fragment;
  blockMarks?: Mark[];
  schema: Schema;
}): Fragment => {
  const paragraphs = [];
  let curChildren: Array<Node> = [];
  let lastNode: Node | null = null;

  const { hardBreak, paragraph } = schema.nodes;

  fragment.forEach((node) => {
    if (lastNode && lastNode.type === hardBreak && node.type === hardBreak) {
      // double hardbreak

      // backtrack a little; remove the trailing hardbreak we added last loop
      curChildren.pop();

      // create a new paragraph
      paragraphs.push(
        paragraph.createChecked(undefined, curChildren, [...blockMarks]),
      );
      curChildren = [];
      return;
    }

    // add to this paragraph
    curChildren.push(node);
    lastNode = node;
  });

  if (curChildren.length) {
    paragraphs.push(
      paragraph.createChecked(undefined, curChildren, [...blockMarks]),
    );
  }

  return Fragment.from(
    paragraphs.length
      ? paragraphs
      : [paragraph.createAndFill(undefined, undefined, [...blockMarks])!],
  );
};

export const splitParagraphs = (slice: Slice, schema: Schema): Slice => {
  // exclude Text nodes with a code mark, since we transform those later
  // into a codeblock
  let hasCodeMark = false;
  slice.content.forEach((child) => {
    hasCodeMark =
      hasCodeMark ||
      child.marks.some((mark) => mark.type === schema.marks.code);
  });

  // slice might just be a raw text string
  if (schema.nodes.paragraph.validContent(slice.content) && !hasCodeMark) {
    const replSlice = splitIntoParagraphs({ fragment: slice.content, schema });
    return new Slice(replSlice, slice.openStart + 1, slice.openEnd + 1);
  }

  return mapSlice(slice, (node) => {
    if (node.type === schema.nodes.paragraph) {
      return splitIntoParagraphs({
        fragment: node.content,
        blockMarks: node.marks,
        schema,
      });
    }

    return node;
  });
};

// above will wrap everything in paragraphs for us
export const upgradeTextToLists = (slice: Slice, schema: Schema): Slice => {
  return mapSlice(slice, (node, parent) => {
    if (node.type === schema.nodes.paragraph) {
      return extractListFromParagraph(node, parent, schema);
    }

    return node;
  });
};
