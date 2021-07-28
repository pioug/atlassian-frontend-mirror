import { ResolvedPos, Fragment, Slice, NodeType } from 'prosemirror-model';
import { Transaction, NodeSelection } from 'prosemirror-state';
import { ReplaceAroundStep } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as baseCommand from 'prosemirror-commands';
import * as baseListCommand from 'prosemirror-schema-list';
import {
  hasParentNodeOfType,
  findPositionOfNodeBefore,
} from 'prosemirror-utils';
import { hasVisibleContent, isNodeEmpty } from '../../../utils/document';
import {
  findCutBefore,
  isEmptySelectionAtStart,
  isFirstChildOfParent,
  filter,
} from '../../../utils/commands';
import { sanitiseMarksInSelection } from '../../../utils';
import { liftFollowingList, liftSelectionList } from '../transforms';
import { Command } from '../../../types';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  addAnalytics,
} from '../../analytics';
import {
  isInsideListItem,
  canJoinToPreviousListItem,
  selectionContainsList,
} from '../utils/selection';
import { getCommonListAnalyticsAttributes } from '../utils/analytics';
import { listBackspace } from './listBackspace';
import { joinListItemForward } from './join-list-item-forward';
import { convertListType } from '../actions/conversions';
import { outdentList } from './outdent-list';
import { indentList } from './indent-list';

export { outdentList, indentList };

export type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;

export const enterKeyCommand: Command = (state, dispatch): boolean => {
  const { selection } = state;
  if (selection.empty) {
    const { $from } = selection;
    const { listItem, codeBlock } = state.schema.nodes;
    const node = $from.node($from.depth);
    const wrapper = $from.node($from.depth - 1);

    if (wrapper && wrapper.type === listItem) {
      /** Check if the wrapper has any visible content */
      const wrapperHasContent = hasVisibleContent(wrapper);
      if (isNodeEmpty(node) && !wrapperHasContent) {
        return outdentList(INPUT_METHOD.KEYBOARD)(state, dispatch);
      } else if (!hasParentNodeOfType(codeBlock)(selection)) {
        return splitListItem(listItem)(state, dispatch);
      }
    }
  }
  return false;
};

export const backspaceKeyCommand: Command = (state, dispatch) => {
  return baseCommand.chainCommands(
    listBackspace,
    // if we're at the start of a list item, we need to either backspace
    // directly to an empty list item above, or outdent this node
    filter(
      [
        isEmptySelectionAtStart,

        // list items might have multiple paragraphs; only do this at the first one
        isFirstChildOfParent,
        isInsideListItem,
      ],
      baseCommand.chainCommands(
        deletePreviousEmptyListItem,
        outdentList(INPUT_METHOD.KEYBOARD),
      ),
    ),

    // if we're just inside a paragraph node (or gapcursor is shown) and backspace, then try to join
    // the text to the previous list item, if one exists
    filter(
      [isEmptySelectionAtStart, canJoinToPreviousListItem],
      joinToPreviousListItem,
    ),
  )(state, dispatch);
};

export const deleteKeyCommand: Command = joinListItemForward;

// Get the depth of the nearest ancestor list
export const rootListDepth = (
  pos: ResolvedPos,
  nodes: Record<string, NodeType>,
) => {
  const { bulletList, orderedList, listItem } = nodes;
  let depth;
  for (let i = pos.depth - 1; i > 0; i--) {
    const node = pos.node(i);
    if (node.type === bulletList || node.type === orderedList) {
      depth = i;
    }
    if (
      node.type !== bulletList &&
      node.type !== orderedList &&
      node.type !== listItem
    ) {
      break;
    }
  }
  return depth;
};

function untoggleSelectedList(tr: Transaction) {
  const { selection } = tr;
  const depth = rootListDepth(selection.$to, tr.doc.type.schema.nodes);
  tr = liftFollowingList(
    selection.$to.pos,
    selection.$to.end(depth),
    depth || 0,
    tr,
  );
  tr = liftSelectionList(selection, tr);
}

export function toggleList(
  inputMethod: InputMethod,
  listType: 'bulletList' | 'orderedList',
): Command {
  return function (state, dispatch) {
    let customTr = state.tr;
    const listInsideSelection = selectionContainsList(customTr);
    const listNodeType = state.schema.nodes[listType];

    const actionSubjectId =
      listType === 'bulletList'
        ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
        : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

    if (listInsideSelection) {
      const { selection } = state;
      const fromNode = selection.$from.node(selection.$from.depth - 2);
      const toNode = selection.$to.node(selection.$to.depth - 2);
      const transformedFrom =
        listInsideSelection.type.name === 'bulletList'
          ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
          : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

      if (fromNode.type.name === listType && toNode.type.name === listType) {
        let tr = state.tr;
        untoggleSelectedList(tr);
        addAnalytics(state, tr, {
          action: ACTION.CONVERTED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: ACTION_SUBJECT_ID.TEXT,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            ...getCommonListAnalyticsAttributes(state),
            transformedFrom,
            inputMethod,
          },
        });
        if (dispatch) {
          dispatch(tr);
        }
        return true;
      }

      convertListType({ tr: customTr, nextListNodeType: listNodeType });
      addAnalytics(state, customTr, {
        action: ACTION.CONVERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          ...getCommonListAnalyticsAttributes(state),
          transformedFrom,
          inputMethod,
        },
      });
    } else {
      const replaceCurrentTr = (tr: Transaction) => {
        customTr = tr;
      };

      // NOTE: replaceCurrentTr is supplied here instead of the usual dispatch function
      // to 'mutate' the transaction without actually dispatching (as it is more performant
      // if we only dispatch once at the end). This means customTr should not be modified
      // until after wrapInList, since any changes made to it will be discarded when it
      // gets replaced with the transaction generated by wrapInList.
      wrapInList(listNodeType)(state, replaceCurrentTr);

      addAnalytics(state, customTr, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod,
        },
      });
    }

    // if document wasn't changed, that means setNodeMarkup step didn't work, so
    // return false from the command to indicate that the editing action failed
    if (!customTr.docChanged) {
      return false;
    }

    sanitiseMarksInSelection(customTr, listNodeType);

    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };
}

export function toggleBulletList(
  view: EditorView,
  inputMethod: InputMethod = INPUT_METHOD.TOOLBAR,
) {
  return toggleList(inputMethod, 'bulletList')(view.state, view.dispatch);
}

export function toggleOrderedList(
  view: EditorView,
  inputMethod: InputMethod = INPUT_METHOD.TOOLBAR,
) {
  return toggleList(inputMethod, 'orderedList')(view.state, view.dispatch);
}

export function wrapInList(nodeType: NodeType): Command {
  return baseCommand.autoJoin(
    baseListCommand.wrapInList(nodeType),
    (before, after) => before.type === after.type && before.type === nodeType,
  );
}

/**
 * Implementation taken and modified for our needs from PM
 * @param itemType Node
 * Splits the list items, specific implementation take from PM
 */
function splitListItem(itemType: NodeType): Command {
  return function (state, dispatch) {
    const ref = state.selection as NodeSelection;
    const $from = ref.$from;
    const $to = ref.$to;
    const node = ref.node;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }
    const grandParent = $from.node(-1);
    if (grandParent.type !== itemType) {
      return false;
    }
    /** --> The following line changed from the original PM implementation to allow list additions with multiple paragraphs */
    if (
      (grandParent.content as any).content.length <= 1 &&
      $from.parent.content.size === 0 &&
      !(grandParent.content.size === 0)
    ) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if (
        $from.depth === 2 ||
        $from.node(-3).type !== itemType ||
        $from.index(-2) !== $from.node(-2).childCount - 1
      ) {
        return false;
      }
      if (dispatch) {
        let wrap = Fragment.empty;
        const keepItem = $from.index(-1) > 0;
        // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor
        for (
          let d = $from.depth - (keepItem ? 1 : 2);
          d >= $from.depth - 3;
          d--
        ) {
          wrap = Fragment.from($from.node(d).copy(wrap));
        }
        // Add a second list item with an empty default start node
        wrap = wrap.append(Fragment.from(itemType.createAndFill()!));
        const tr$1 = state.tr.replace(
          $from.before(keepItem ? undefined : -1),
          $from.after(-3),
          new Slice(wrap, keepItem ? 3 : 2, 2),
        );
        tr$1.setSelection(
          (state.selection.constructor as any).near(
            tr$1.doc.resolve($from.pos + (keepItem ? 3 : 2)),
          ),
        );
        dispatch(tr$1.scrollIntoView());
      }
      return true;
    }
    const nextType =
      $to.pos === $from.end()
        ? grandParent.contentMatchAt(0).defaultType
        : undefined;
    const tr = state.tr.delete($from.pos, $to.pos);
    const types = nextType && [undefined, { type: nextType }];

    if (dispatch) {
      dispatch(tr.split($from.pos, 2, types as any).scrollIntoView());
    }
    return true;
  };
}

const deletePreviousEmptyListItem: Command = (state, dispatch) => {
  const { $from } = state.selection;
  const { listItem } = state.schema.nodes;

  const $cut = findCutBefore($from);
  if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
    return false;
  }

  const previousListItemEmpty =
    $cut.nodeBefore.childCount === 1 &&
    $cut.nodeBefore.firstChild!.nodeSize <= 2;

  if (previousListItemEmpty) {
    const { tr } = state;

    if (dispatch) {
      dispatch(
        tr
          .delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos)
          .scrollIntoView(),
      );
    }
    return true;
  }

  return false;
};

const joinToPreviousListItem: Command = (state, dispatch) => {
  const { $from } = state.selection;
  const {
    paragraph,
    listItem,
    codeBlock,
    bulletList,
    orderedList,
  } = state.schema.nodes;
  const isGapCursorShown = state.selection instanceof GapCursorSelection;
  const $cutPos = isGapCursorShown ? state.doc.resolve($from.pos + 1) : $from;
  let $cut = findCutBefore($cutPos);
  if (!$cut) {
    return false;
  }

  // see if the containing node is a list
  if (
    $cut.nodeBefore &&
    [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1
  ) {
    // and the node after this is a paragraph or a codeBlock
    if (
      $cut.nodeAfter &&
      ($cut.nodeAfter.type === paragraph || $cut.nodeAfter.type === codeBlock)
    ) {
      // find the nearest paragraph that precedes this node
      let $lastNode = $cut.doc.resolve($cut.pos - 1);

      while ($lastNode.parent.type !== paragraph) {
        $lastNode = state.doc.resolve($lastNode.pos - 1);
      }

      let { tr } = state;
      if (isGapCursorShown) {
        const nodeBeforePos = findPositionOfNodeBefore(tr.selection);
        if (typeof nodeBeforePos !== 'number') {
          return false;
        }
        // append the codeblock to the list node
        const list = $cut.nodeBefore.copy(
          $cut.nodeBefore.content.append(
            Fragment.from(listItem.createChecked({}, $cut.nodeAfter)),
          ),
        );
        tr.replaceWith(
          nodeBeforePos,
          $from.pos + $cut.nodeAfter.nodeSize,
          list,
        );
      } else {
        // take the text content of the paragraph and insert after the paragraph up until before the the cut
        tr = state.tr.step(
          new ReplaceAroundStep(
            $lastNode.pos,
            $cut.pos + $cut.nodeAfter.nodeSize,
            $cut.pos + 1,
            $cut.pos + $cut.nodeAfter.nodeSize - 1,
            state.tr.doc.slice($lastNode.pos, $cut.pos),
            0,
            true,
          ),
        );
      }

      // find out if there's now another list following and join them
      // as in, [list, p, list] => [list with p, list], and we want [joined list]
      let $postCut = tr.doc.resolve(
        tr.mapping.map($cut.pos + $cut.nodeAfter.nodeSize),
      );
      if (
        $postCut.nodeBefore &&
        $postCut.nodeAfter &&
        $postCut.nodeBefore.type === $postCut.nodeAfter.type &&
        [bulletList, orderedList].indexOf($postCut.nodeBefore.type) > -1
      ) {
        tr = tr.join($postCut.pos);
      }

      if (dispatch) {
        dispatch(tr.scrollIntoView());
      }
      return true;
    }
  }

  return false;
};
