import { createCommand } from './pm-plugins/plugin-factory';
import { PastePluginActionTypes as ActionTypes } from './actions';
import type {
  Node,
  NodeType,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import {
  isListNode,
  mapChildren,
  mapSlice,
} from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { autoJoin } from '@atlaskit/editor-prosemirror/commands';
import type { Mark } from '@atlaskit/editor-prosemirror/model';

/**
 * Use this to register macro link positions during a paste operation, that you
 * want to track in a document over time, through any document changes.
 *
 * @param positions a map of string keys (custom position references) and position values e.g. { ['my-key-1']: 11 }
 *
 * **Context**: This is neccessary if there is an async process or an unknown period of time
 * between obtaining an original position, and wanting to know about what its final eventual
 * value. In that scenario, positions will need to be actively tracked and mapped in plugin
 * state so that they can be mapped through any other independent document change transactions being
 * dispatched to the editor that could affect their value.
 */
export const startTrackingPastedMacroPositions = (pastedMacroPositions: {
  [key: string]: number;
}) =>
  createCommand(() => {
    return {
      type: ActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS,
      pastedMacroPositions,
    };
  });

export const stopTrackingPastedMacroPositions = (
  pastedMacroPositionKeys: string[],
) =>
  createCommand(() => {
    return {
      type: ActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS,
      pastedMacroPositionKeys,
    };
  });

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
      // Dont return false if there are lists, as they arent validContent for paragraphs
      // and will result in hanging textNodes
      const containsList = listified.some(
        (node) => node.type === bulletList || node.type === orderedList,
      );
      if (listified.some((node) => node.isText) && !containsList) {
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

// above will wrap everything in paragraphs for us
export const upgradeTextToLists = (slice: Slice, schema: Schema): Slice => {
  return mapSlice(slice, (node, parent) => {
    if (node.type === schema.nodes.paragraph) {
      return extractListFromParagraph(node, parent, schema);
    }

    return node;
  });
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

/**
 * Walks the slice, creating paragraphs that were previously separated by hardbreaks.
 * Returns the original paragraph node (as a fragment), or a fragment containing multiple nodes.
 */
export const splitIntoParagraphs = ({
  fragment,
  blockMarks = [],
  schema,
}: {
  fragment: Fragment;
  blockMarks?: readonly Mark[];
  schema: Schema;
}): Fragment => {
  const paragraphs = [];
  let curChildren: Array<Node> = [];
  let lastNode: Node | null = null;

  const { hardBreak, paragraph } = schema.nodes;

  fragment.forEach((node, i) => {
    const isNodeValidContentForParagraph = schema.nodes.paragraph.validContent(
      Fragment.from(node),
    );

    if (!isNodeValidContentForParagraph) {
      paragraphs.push(node);
      return;
    }
    // ED-14725 Fixed the issue that it make duplicated line
    // when pasting <br /> from google docs.
    if (i === 0 && node.type === hardBreak) {
      paragraphs.push(
        paragraph.createChecked(undefined, curChildren, [...blockMarks]),
      );
      lastNode = node;
      return;
    } else if (
      lastNode &&
      lastNode.type === hardBreak &&
      node.type === hardBreak
    ) {
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
