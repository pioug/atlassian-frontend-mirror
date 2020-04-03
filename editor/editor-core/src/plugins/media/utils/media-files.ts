import { Node as PMNode, NodeType, Fragment } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  setNodeSelection,
  setTextSelection,
  insideTableCell,
  isInListItem,
  findFarthestParentNode,
} from '../../../utils';
import { MediaState } from '../types';
import {
  posOfPrecedingMediaGroup,
  posOfMediaGroupNearby,
  posOfParentMediaGroup,
  isSelectionNonMediaBlockNode,
  isInsidePotentialEmptyParagraph,
  copyOptionalAttrsFromMediaState,
} from './media-common';
import {
  safeInsert,
  hasParentNode,
  ContentNodeWithPos,
} from 'prosemirror-utils';
import {
  atTheBeginningOfBlock,
  atTheEndOfBlock,
  atTheEndOfDoc,
  endPositionOfParent,
  startPositionOfParent,
} from '../../../utils/prosemirror/position';

export interface Range {
  start: number;
  end: number;
}

/**
 * Check if current editor selections is a media group or not.
 * @param state Editor state
 */
function isSelectionMediaGroup(state: EditorState): boolean {
  const { schema } = state;
  const selectionParent = state.selection.$anchor.node();

  return selectionParent && selectionParent.type === schema.nodes.mediaGroup;
}

/**
 * Check if grand parent accepts media group
 * @param state Editor state
 * @param mediaNodes Media nodes to be inserted
 */
function grandParentAcceptMediaGroup(
  state: EditorState,
  mediaNodes: PMNode[],
): boolean {
  const grandParent = state.selection.$from.node(-1);

  return (
    grandParent &&
    grandParent.type.validContent(
      Fragment.from(
        state.schema.nodes.mediaGroup.createChecked({}, mediaNodes),
      ),
    )
  );
}

/**
 * Insert a paragraph after if reach the end of doc
 * and there is no media group in the front or selection is a non media block node
 * @param node Node at insertion point
 * @param state Editor state
 */
function shouldAppendParagraph(
  state: EditorState,
  node?: PMNode | null,
): boolean {
  const {
    schema: {
      nodes: { media },
    },
  } = state;

  const wasMediaNode = node && node.type === media;

  return (
    (insideTableCell(state) ||
      isInListItem(state) ||
      (atTheEndOfDoc(state) &&
        (!posOfPrecedingMediaGroup(state) ||
          isSelectionNonMediaBlockNode(state)))) &&
    !wasMediaNode
  );
}

/**
 * Insert a media into an existing media group
 * or create a new media group to insert the new media.
 * @param view Editor view
 * @param mediaStates Media files to be added to the editor
 * @param collection Collection for the media to be added
 */
export const insertMediaGroupNode = (
  view: EditorView,
  mediaStates: MediaState[],
  collection: string,
): void => {
  const { state, dispatch } = view;
  const { tr, schema } = state;
  const { media, paragraph } = schema.nodes;

  // Do nothing if no media found
  if (!media || !mediaStates.length) {
    return;
  }

  const mediaNodes = createMediaFileNodes(mediaStates, collection, media);
  const mediaInsertPos = findMediaInsertPos(state);
  const resolvedInsertPos = tr.doc.resolve(mediaInsertPos);
  const parent = resolvedInsertPos.parent;
  const nodeAtInsertionPoint = tr.doc.nodeAt(mediaInsertPos);

  const shouldSplit =
    !isSelectionMediaGroup(state) &&
    grandParentAcceptMediaGroup(state, mediaNodes);
  const withParagraph = shouldAppendParagraph(state, nodeAtInsertionPoint);

  let content: PMNode[] =
    parent.type === schema.nodes.mediaGroup
      ? mediaNodes // If parent is a mediaGroup do not wrap items again.
      : [schema.nodes.mediaGroup.createChecked({}, mediaNodes)];

  if (shouldSplit) {
    content = withParagraph ? content.concat(paragraph.create()) : content;

    // delete the selection or empty paragraph
    // delete the selection or empty paragraph
    const deleteRange = findDeleteRange(state);
    if (!deleteRange) {
      tr.insert(mediaInsertPos, content);
    } else if (mediaInsertPos <= deleteRange.start) {
      tr.deleteRange(deleteRange.start, deleteRange.end).insert(
        mediaInsertPos,
        content,
      );
    } else {
      tr.insert(mediaInsertPos, content).deleteRange(
        deleteRange.start,
        deleteRange.end,
      );
    }
    dispatch(tr);
    setSelectionAfterMediaInsertion(view);
    return;
  }

  // Don't append new paragraph when adding media to a existing mediaGroup
  if (withParagraph && parent.type !== schema.nodes.mediaGroup) {
    content.push(paragraph.create());
  }

  dispatch(safeInsert(Fragment.fromArray(content), mediaInsertPos)(tr));
};

const createMediaFileNodes = (
  mediaStates: MediaState[],
  collection: string,
  media: NodeType,
): PMNode[] => {
  const nodes = mediaStates.map(mediaState => {
    const { id } = mediaState;
    const node = media.create({
      id,
      type: 'file',
      collection,
    });
    copyOptionalAttrsFromMediaState(mediaState, node);
    return node;
  });

  return nodes;
};

/**
 * Find root list node if exist from current selection
 * @param state Editor state
 */
const findRootListNode = (state: EditorState): ContentNodeWithPos | null => {
  const {
    schema: {
      nodes: { bulletList, orderedList },
    },
  } = state;

  return findFarthestParentNode(
    (node: PMNode) => node.type === bulletList || node.type === orderedList,
  )(state.selection.$from);
};

/**
 * Return position of media to be inserted, if it is inside a list
 * @param content Content to be inserted
 * @param state Editor State
 */
export const getPosInList = (state: EditorState): number | undefined => {
  const {
    schema: {
      nodes: { mediaGroup, listItem },
    },
  } = state;

  // 1. Check if I am inside a list.
  if (hasParentNode(node => node.type === listItem)(state.selection)) {
    // 2. Get end position of root list
    const rootListNode = findRootListNode(state);

    if (rootListNode) {
      const pos = rootListNode.pos + rootListNode.node.nodeSize;
      // 3. Fint the first location inside the media group
      const nextNode = state.doc.nodeAt(pos);
      if (nextNode && nextNode.type === mediaGroup) {
        return pos + 1;
      }

      return pos;
    }
  }
  return;
};

/**
 * Find insertion point,
 * If it is in a List it will return position to the next block,
 * If there are any media group close it will return this position
 * Otherwise, It will return the respective block given selection.
 * @param content Content to be inserted
 * @param state Editor state
 */
const findMediaInsertPos = (state: EditorState): number => {
  const { $from, $to } = state.selection;

  // Check if selection is inside a list.
  const posInList = getPosInList(state);

  if (posInList) {
    // If I have a position in lists, I should return, otherwise I am not inside a list
    return posInList;
  }

  const nearbyMediaGroupPos = posOfMediaGroupNearby(state);

  if (
    nearbyMediaGroupPos &&
    (!isSelectionNonMediaBlockNode(state) ||
      ($from.pos < nearbyMediaGroupPos && $to.pos < nearbyMediaGroupPos))
  ) {
    return nearbyMediaGroupPos;
  }

  if (isSelectionNonMediaBlockNode(state)) {
    return $to.pos;
  }

  if (atTheEndOfBlock(state)) {
    return $to.pos + 1;
  }

  if (atTheBeginningOfBlock(state)) {
    return $from.pos - 1;
  }

  return $to.pos;
};

const findDeleteRange = (state: EditorState): Range | undefined => {
  const { $from, $to } = state.selection;

  if (posOfParentMediaGroup(state)) {
    return;
  }

  if (!isInsidePotentialEmptyParagraph(state) || posOfMediaGroupNearby(state)) {
    return range($from.pos, $to.pos);
  }

  return range(startPositionOfParent($from) - 1, endPositionOfParent($to));
};

const range = (start: number, end: number = start) => {
  return { start, end };
};

const setSelectionAfterMediaInsertion = (view: EditorView): void => {
  const { state } = view;
  const { doc } = state;
  const mediaPos = posOfMediaGroupNearby(state);
  if (!mediaPos) {
    return;
  }

  const $mediaPos = doc.resolve(mediaPos);
  const endOfMediaGroup = endPositionOfParent($mediaPos);

  if (endOfMediaGroup + 1 >= doc.nodeSize - 1) {
    // if nothing after the media group, fallback to select the newest uploaded media item
    setNodeSelection(view, mediaPos);
  } else {
    setTextSelection(view, endOfMediaGroup + 1);
  }
};
