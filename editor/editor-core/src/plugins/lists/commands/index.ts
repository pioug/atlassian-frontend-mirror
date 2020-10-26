import * as baseCommand from 'prosemirror-commands';
import {
  Fragment,
  Node,
  NodeRange,
  NodeType,
  ResolvedPos,
  Slice,
} from 'prosemirror-model';
import * as baseListCommand from 'prosemirror-schema-list';
import {
  EditorState,
  NodeSelection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { liftTarget, ReplaceAroundStep } from 'prosemirror-transform';
import {
  findParentNodeOfTypeClosestToPos,
  findPositionOfNodeBefore,
  hasParentNodeOfType,
  ContentNodeWithPos,
  findParentNodeClosestToPos,
} from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { Command } from '../../../types';
import { compose, sanitiseSelectionMarksForWrapping } from '../../../utils';
import {
  filter,
  findCutBefore,
  isEmptySelectionAtStart,
  isFirstChildOfParent,
} from '../../../utils/commands';
import { hasVisibleContent, isNodeEmpty } from '../../../utils/document';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  CommonListAnalyticsAttributes,
  EVENT_TYPE,
  INDENT_DIRECTION,
  INDENT_TYPE,
  INPUT_METHOD,
  withAnalytics,
} from '../../analytics';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
import { liftFollowingList, liftSelectionList } from '../transforms';
import {
  canJoinToPreviousListItem,
  canOutdent,
  isInsideListItem,
} from '../utils';
import { listBackspace } from './listBackspace';
import { listDelete } from './listDelete';

export type InputMethod = INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR;

const maxIndentation = 5;

export const deletePreviousEmptyListItem: Command = (state, dispatch) => {
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

export const joinToPreviousListItem: Command = (state, dispatch) => {
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
        canOutdent,
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

export const deleteKeyCommand: Command = listDelete;

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

/**
 * Merge closest bullet list blocks into one
 *
 * @param {NodeType} listItem
 * @param {NodeRange} range
 * @returns
 */
function mergeLists(listItem: NodeType, range: NodeRange) {
  return (command: Command): Command => {
    return (state, dispatch) =>
      command(state, tr => {
        /* we now need to handle the case that we lifted a sublist out,
         * and any listItems at the current level get shifted out to
         * their own new list; e.g.:
         *
         * unorderedList
         *  listItem(A)
         *  listItem
         *    unorderedList
         *      listItem(B)
         *  listItem(C)
         *
         * becomes, after unindenting the first, top level listItem, A:
         *
         * content of A
         * unorderedList
         *  listItem(B)
         * unorderedList
         *  listItem(C)
         *
         * so, we try to merge these two lists if they're of the same type, to give:
         *
         * content of A
         * unorderedList
         *  listItem(B)
         *  listItem(C)
         */

        const $start: ResolvedPos = state.doc.resolve(range.start);
        const $end: ResolvedPos = state.doc.resolve(range.end);
        const $join = tr.doc.resolve(tr.mapping.map(range.end - 1));

        if (
          $join.nodeBefore &&
          $join.nodeAfter &&
          $join.nodeBefore.type === $join.nodeAfter.type
        ) {
          if (
            $end.nodeAfter &&
            $end.nodeAfter.type === listItem &&
            $end.parent.type === $start.parent.type
          ) {
            tr.join($join.pos);
          }
        }

        if (dispatch) {
          dispatch(tr.scrollIntoView());
        }
      });
  };
}

export function outdentList(
  inputMethod: InputMethod = INPUT_METHOD.KEYBOARD,
): Command {
  return function (state, dispatch) {
    const { listItem } = state.schema.nodes;
    const { $from, $to } = state.selection;
    if (isInsideListItem(state)) {
      // if we're backspacing at the start of a list item, unindent it
      // take the the range of nodes we might be lifting

      // the predicate is for when you're backspacing a top level list item:
      // we don't want to go up past the doc node, otherwise the range
      // to clear will include everything
      let range = $from.blockRange(
        $to,
        node => node.childCount > 0 && node.firstChild!.type === listItem,
      );

      if (!range) {
        return false;
      }
      const initialIndentationLevel = numberNestedLists(
        state.selection.$from,
        state.schema.nodes,
      );

      const parentAtStart = findParentNodeOfTypeClosestToPos(
        state.selection.$from,
        [state.schema.nodes.bulletList, state.schema.nodes.orderedList],
      );

      return compose(
        // 4. Richer indentation analytics to compare against new predictable lists
        withAnalytics({
          action: ACTION.INDENTED,
          actionSubject: ACTION_SUBJECT.LIST,
          actionSubjectId: schemaTypeToAnalyticsType(
            // ! - It's guaranteed that if we've gotten to this point that there is a listType parent. We just don't know which one.
            parentAtStart!.node.type.name,
          ),
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            ...getCommonListAnalyticsAttributes(state),
            inputMethod,
            indentDirection: INDENT_DIRECTION.OUTDENT,
          },
        }),
        withAnalytics({
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            inputMethod,
            previousIndentationLevel: initialIndentationLevel,
            newIndentLevel: initialIndentationLevel - 1,
            direction: INDENT_DIRECTION.OUTDENT,
            indentType: INDENT_TYPE.LIST,
          },
        }), // 3. Send analytics event
        mergeLists(listItem, range), // 2. Check if I need to merge nearest list
        baseListCommand.liftListItem, // 1. First lift list item
      )(listItem)(state, dispatch);
    }

    return false;
  };
}

/**
 * Check if we can sink the list.
 *
 * @param {number} initialIndentationLevel
 * @param {EditorState} state
 * @returns {boolean} - true if we can sink the list
 *                    - false if we reach the max indentation level
 */
function canSink(initialIndentationLevel: number, state: EditorState): boolean {
  /*
      - Keep going forward in document until indentation of the node is < than the initial
      - If indentation is EVER > max indentation, return true and don't sink the list
      */
  let currentIndentationLevel: number;
  let currentPos = state.tr.selection.$to.pos;
  do {
    const resolvedPos = state.doc.resolve(currentPos);
    currentIndentationLevel = numberNestedLists(
      resolvedPos,
      state.schema.nodes,
    );
    if (currentIndentationLevel > maxIndentation) {
      // Cancel sink list.
      // If current indentation less than the initial, it won't be
      // larger than the max, and the loop will terminate at end of this iteration
      return false;
    }
    currentPos++;
  } while (currentIndentationLevel >= initialIndentationLevel);

  return true;
}

export function indentList(
  inputMethod: InputMethod = INPUT_METHOD.KEYBOARD,
): Command {
  return function (state, dispatch) {
    const { listItem } = state.schema.nodes;
    if (isInsideListItem(state)) {
      // Record initial list indentation
      const initialIndentationLevel = numberNestedLists(
        state.selection.$from,
        state.schema.nodes,
      );

      const sinkable = canSink(initialIndentationLevel, state);

      let customTr = state.tr;
      const fakeDispatch = (tr: Transaction) => {
        customTr = tr;
      };

      if (sinkable) {
        // Analytics command wrapper should be here because we need to get indentation level
        compose(
          withAnalytics({
            action: ACTION.FORMATTED,
            actionSubject: ACTION_SUBJECT.TEXT,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
            eventType: EVENT_TYPE.TRACK,
            attributes: {
              inputMethod,
              previousIndentationLevel: initialIndentationLevel,
              newIndentLevel: initialIndentationLevel + 1,
              direction: INDENT_DIRECTION.INDENT,
              indentType: INDENT_TYPE.LIST,
            },
          }),
          baseListCommand.sinkListItem,
        )(listItem)(state, fakeDispatch);
      }

      // Richer indentation analytics to compare against new predictable lists
      // Should always fire, even if can't sink.
      // Amends to the current tr before dispatching
      addAnalytics(state, customTr, {
        action: ACTION.INDENTED,
        actionSubject: ACTION_SUBJECT.LIST,
        actionSubjectId: schemaTypeToAnalyticsType('bulletList'),
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          ...getCommonListAnalyticsAttributes(state),
          inputMethod,
          canSink: customTr.docChanged,
          indentDirection: INDENT_DIRECTION.INDENT,
        },
      });

      if (dispatch) {
        dispatch(customTr);
      }

      return true;
    }

    return false;
  };
}

export function liftListItems(): Command {
  return function (state, dispatch) {
    const { tr } = state;
    const { $from, $to } = state.selection;

    tr.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      // Following condition will ensure that block types paragraph, heading, codeBlock, blockquote, panel are lifted.
      // isTextblock is true for paragraph, heading, codeBlock.
      if (node.isTextblock) {
        const sel = new NodeSelection(tr.doc.resolve(tr.mapping.map(pos)));
        const range = sel.$from.blockRange(sel.$to);

        if (!range || sel.$from.parent.type !== state.schema.nodes.listItem) {
          return false;
        }

        const target = range && liftTarget(range);

        if (target === undefined || target === null) {
          return false;
        }

        tr.lift(range, target);
      }
      return;
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

/**
 * Sometimes a selection in the editor can be slightly offset, for example:
 * it's possible for a selection to start or end at an empty node at the very end of
 * a line. This isn't obvious by looking at the editor and it's likely not what the
 * user intended - so we need to adjust the selection a bit in scenarios like that.
 */
export function adjustSelectionInList(
  doc: Node,
  selection: TextSelection,
): TextSelection {
  let { $from, $to } = selection;

  const isSameLine = $from.pos === $to.pos;

  let startPos = $from.pos;
  let endPos = $to.pos;

  if (isSameLine && startPos === doc.nodeSize - 3) {
    // Line is empty, don't do anything
    return selection;
  }

  // Selection started at the very beginning of a line and therefor points to the previous line.
  if ($from.nodeBefore && !isSameLine) {
    startPos++;
    let node = doc.nodeAt(startPos);
    while (!node || (node && !node.isText)) {
      startPos++;
      node = doc.nodeAt(startPos);
    }
  }

  if (endPos === startPos) {
    return new TextSelection(doc.resolve(startPos));
  }

  return new TextSelection(doc.resolve(startPos), doc.resolve(endPos));
}

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

// Returns the number of nested lists that are ancestors of the given selection
export const numberNestedLists = (
  resolvedPos: ResolvedPos,
  nodes: Record<string, NodeType>,
) => {
  const { bulletList, orderedList } = nodes;
  let count = 0;
  for (let i = resolvedPos.depth - 1; i > 0; i--) {
    const node = resolvedPos.node(i);
    if (node.type === bulletList || node.type === orderedList) {
      count += 1;
    }
  }
  return count;
};

export const toggleList = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
  view: EditorView,
  listType: 'bulletList' | 'orderedList',
  inputMethod: InputMethod,
): boolean => {
  const { selection } = state;
  const fromNode = selection.$from.node(selection.$from.depth - 2);
  const endNode = selection.$to.node(selection.$to.depth - 2);
  if (
    !fromNode ||
    fromNode.type.name !== listType ||
    !endNode ||
    endNode.type.name !== listType
  ) {
    return toggleListCommandWithAnalytics(inputMethod, listType)(
      state,
      dispatch,
      view,
    );
  } else {
    const depth = rootListDepth(selection.$to, state.schema.nodes);
    let tr = liftFollowingList(
      state,
      selection.$to.pos,
      selection.$to.end(depth),
      depth || 0,
      state.tr,
    );
    tr = liftSelectionList(state, tr);
    tr = addAnalytics(state, tr, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: schemaTypeToAnalyticsType(listType),
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod,
      },
    });
    dispatch(tr);
    return true;
  }
};

/**
 * Check of is selection is inside a list of the specified type
 * @param state
 * @param listType
 */
function isInsideList(
  state: EditorState,
  listType: 'bulletList' | 'orderedList',
) {
  const { $from } = state.selection;
  const parent = $from.node(-2);
  const grandgrandParent = $from.node(-3);

  return (
    (parent && parent.type === state.schema.nodes[listType]) ||
    (grandgrandParent && grandgrandParent.type === state.schema.nodes[listType])
  );
}

export function toggleListCommand(
  listType: 'bulletList' | 'orderedList',
): Command {
  return function (state, dispatch, view) {
    if (dispatch) {
      dispatch(
        state.tr.setSelection(
          adjustSelectionInList(state.doc, state.selection as TextSelection),
        ),
      );
    }

    if (!view) {
      return false;
    }

    state = view.state;

    const {
      doc,
      selection: { $from, $to },
    } = state;
    const listNodeType = state.schema.nodes[listType];

    // find closest parent of listNodeType from start of selection
    const listParentPos = findParentNodeOfTypeClosestToPos(
      doc.resolve($from.pos),
      listNodeType,
    );
    // determine if end of selection is outside of that list (if selection is in a list at all)
    const isSameListTypeSelected =
      listParentPos &&
      $to.pos <= listParentPos.pos + listParentPos.node.nodeSize;

    if (isInsideList(state, listType) && isSameListTypeSelected) {
      // Untoggles list
      return liftListItems()(state, dispatch);
    } else {
      // Converts list type e.g. bullet_list -> ordered_list if needed
      if (!isSameListTypeSelected) {
        liftListItems()(state, dispatch);
        state = view.state;
      }

      // Remove any invalid marks that are not supported
      const tr = sanitiseSelectionMarksForWrapping(state, listNodeType);
      if (tr && dispatch) {
        dispatch(tr);
        state = view.state;
      }

      // Wraps selection in list
      return wrapInList(listNodeType)(state, dispatch);
    }
  };
}

const getItemAttributes = (state: EditorState, $pos: ResolvedPos) => {
  const indentLevel = numberNestedLists($pos, state.schema.nodes) - 1;
  const itemAtPos = findParentNodeOfTypeClosestToPos(
    $pos,
    state.schema.nodes.listItem,
  );

  // Get the index of the current item relative to parent (parent is at item depth - 1)
  const itemIndex = $pos.index(itemAtPos ? itemAtPos.depth - 1 : undefined);
  return { indentLevel, itemIndex };
};

const countListItemsInSelection = (editorState: EditorState): number => {
  const { tr, schema } = editorState;
  const {
    selection,
    doc,
    selection: { from, to, empty },
  } = tr;

  if (empty) {
    return 1;
  }

  // get the positions of all the leaf nodes within the selection
  const nodePositions = [];
  if (selection instanceof TextSelection && selection.$cursor) {
    nodePositions.push(from);
  } else {
    // nodesBetween doesn't return leaf nodes that are outside of from and to
    doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isLeaf) {
        return true;
      }
      nodePositions.push(pos);
    });
  }

  // use those positions to get the closest parent list nodes
  nodePositions.reduce((acc: ContentNodeWithPos[], pos: number) => {
    const closestParentListNode = findParentNodeClosestToPos(
      doc.resolve(pos),
      node => node.type === schema.nodes.listItem,
    );
    if (!closestParentListNode) {
      return acc;
    }

    // don't add duplicates if the parent has already been added into the array
    const existingParent = acc.find((node: ContentNodeWithPos) => {
      return (
        node.pos === closestParentListNode.pos &&
        node.start === closestParentListNode.start &&
        node.depth === closestParentListNode.depth
      );
    });

    if (!existingParent) {
      acc.push(closestParentListNode);
    }

    return acc;
  }, []);

  return nodePositions.length;
};

const getCommonListAnalyticsAttributes = (
  state: EditorState,
): CommonListAnalyticsAttributes => {
  const {
    selection: { $from, $to },
  } = state.tr;
  const fromAttrs = getItemAttributes(state, $from);
  const toAttrs = getItemAttributes(state, $to);

  return {
    itemIndexAtSelectionStart: fromAttrs.itemIndex,
    itemIndexAtSelectionEnd: toAttrs.itemIndex,
    indentLevelAtSelectionStart: fromAttrs.indentLevel,
    indentLevelAtSelectionEnd: toAttrs.indentLevel,
    itemsInSelection: countListItemsInSelection(state),
  };
};

const schemaTypeToAnalyticsType = (
  type: string,
):
  | ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
  | ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER =>
  type === 'bulletList'
    ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET
    : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;

// TODO: Toggle list command dispatch more than one time, so commandWithAnalytics doesn't work as expected.
// This is a helper to fix that.
export const toggleListCommandWithAnalytics = (
  inputMethod: InputMethod,
  listType: 'bulletList' | 'orderedList',
): Command => {
  return (state, dispatch, view) => {
    if (view && dispatch) {
      // Richer conversion analytics to compare against new predictable lists
      const parentAtStart = findParentNodeOfTypeClosestToPos(
        state.selection.$from,
        [state.schema.nodes.bulletList, state.schema.nodes.orderedList],
      );

      if (parentAtStart) {
        dispatch(
          addAnalytics(state, view.state.tr, {
            action: ACTION.CONVERTED,
            actionSubject: ACTION_SUBJECT.LIST,
            eventType: EVENT_TYPE.TRACK,
            actionSubjectId: schemaTypeToAnalyticsType(listType),
            attributes: {
              ...getCommonListAnalyticsAttributes(state),
              transformedFrom: schemaTypeToAnalyticsType(
                parentAtStart.node.type.name,
              ),
              inputMethod,
            },
          }),
        );
      }

      if (toggleListCommand(listType)(state, dispatch, view)) {
        dispatch(
          addAnalytics(state, view.state.tr, {
            action: ACTION.FORMATTED,
            actionSubject: ACTION_SUBJECT.TEXT,
            actionSubjectId: schemaTypeToAnalyticsType(listType),
            eventType: EVENT_TYPE.TRACK,
            attributes: {
              inputMethod,
            },
          }),
        );
      }

      return true;
    }

    return false;
  };
};

export function toggleBulletList(
  view: EditorView,
  inputMethod: InputMethod = INPUT_METHOD.TOOLBAR,
) {
  return toggleList(view.state, view.dispatch, view, 'bulletList', inputMethod);
}

export function toggleOrderedList(
  view: EditorView,
  inputMethod: InputMethod = INPUT_METHOD.TOOLBAR,
) {
  return toggleList(
    view.state,
    view.dispatch,
    view,
    'orderedList',
    inputMethod,
  );
}

export function wrapInList(nodeType: NodeType): Command {
  return baseCommand.autoJoin(
    baseListCommand.wrapInList(nodeType),
    (before, after) => before.type === after.type && before.type === nodeType,
  );
}
