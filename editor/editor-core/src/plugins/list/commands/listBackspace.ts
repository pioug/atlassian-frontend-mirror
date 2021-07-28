import {
  insertContentDeleteRange,
  isEmptySelectionAtStart,
  walkPrevNode,
  WalkNode,
} from '../../../utils/commands';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  DELETE_DIRECTION,
  LIST_TEXT_SCENARIOS,
  addAnalytics,
} from '../../analytics';
import { Command } from '../../../types';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { CommandDispatch } from '../../../types';
import { isListNode, isParagraphNode } from '../utils/node';
import { isPosInsideList, isPosInsideParagraph } from '../utils/selection';

type BackspaceCommand = (
  tr: Transaction,
  dispatch: CommandDispatch | undefined,
  $prev: ResolvedPos,
  $head: ResolvedPos,
  $last?: ResolvedPos | null,
) => boolean;

//Cases below refer to the cases found in this document: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1146954996/List+Backspace+and+Delete+Behaviour

//Case for two adjacent list items of the same indentation
const listBackspaceCase2: BackspaceCommand = (tr, dispatch, $prev, $head) => {
  /* CASE 2
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |textInsertPos| }       //Cant have children since that would be Case 4
   *   |$prev||childrenGInsertPos| }
   *   ListItem E {
   *     Paragraph F { |$head| text2 }
   *     ...Children G
   *   }
   * }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph C { text1text2 }
   *     ...Children G
   *   }
   * }
   *
   */

  const listItemE = $head.node(-1); //Head is inside listItem E so it must have a first and last child
  if (!listItemE.firstChild) {
    return false;
  }

  const beforeListItemE = $head.before(-1);

  const afterListItemE = $head.after(-1);

  const textInsertPos = $prev.pos - 1; //Paragraph D must be directly behind $prev otherwise it would be case 4
  const childrenGInsertPos = $prev.pos;

  const textContent = $head.parent.content;
  const childrenGContent = listItemE.content.cut(listItemE.firstChild.nodeSize);

  insertContentDeleteRange(
    tr,
    (tr) => tr.doc.resolve(textInsertPos),
    [
      [textContent, textInsertPos],
      [childrenGContent, childrenGInsertPos],
    ],
    [[beforeListItemE, afterListItemE]],
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

//Case for two adjacent list items with the first being of lower indentation
const listBackspaceCase3: BackspaceCommand = (tr, dispatch, $prev, $head) => {
  /* CASE 3
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$prev||textInsertPos| } |childrenHInsertPos|
   *     List E { |childrenJInsertPos|
   *       ListItem F {
   *         Paragraph G { |$head| text2 }
   *         ...Children H
   *         List? I {
   *           ...Children J
   *         }
   *       }
   *       ...Children K
   *     }
   *   }
   * }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1text2 }
   *     ...Children H
   *     List E {
   *       ...Children J
   *       ...Children K
   *     }
   *   }
   * }
   *
   */

  const listE = $head.node(-2);
  const listItemF = $head.node(-1); //Head is inside listItem F so it must have a first and last child
  if (!listItemF.firstChild || !listItemF.lastChild) {
    return false;
  }

  const beforeListE = $head.before(-2);
  const beforeListItemF = $head.before(-1);

  const afterParagraphD = $prev.after();
  const afterListE = $head.after(-2);
  const afterListItemF = $head.after(-1);

  const startListE = $head.start(-2);

  const containsChildrenJ = isListNode(listItemF.lastChild);
  const shouldRemoveListE = listE.childCount === 1 && !containsChildrenJ; //Assures no Children J and K
  const textInsertPos = $prev.pos;
  const childrenHInsertPos = afterParagraphD;
  const childrenJInsertPos = startListE;

  const textContent = $head.parent.content;
  const childrenHContent = containsChildrenJ
    ? listItemF.content.cut(
        listItemF.firstChild.nodeSize,
        listItemF.nodeSize - listItemF.lastChild.nodeSize - 2,
      )
    : listItemF.content.cut(listItemF.firstChild.nodeSize); //If Children J doesn't exist then Children H will include the last node
  const childrenJContent = listItemF.lastChild.content; //Will be invalid if there are no Children J but it will be unused

  insertContentDeleteRange(
    tr,
    (tr) => tr.doc.resolve(textInsertPos),
    containsChildrenJ
      ? [
          [textContent, textInsertPos],
          [childrenHContent, childrenHInsertPos],
          [childrenJContent, childrenJInsertPos],
        ]
      : [
          [textContent, textInsertPos],
          [childrenHContent, childrenHInsertPos],
        ],
    [
      shouldRemoveListE
        ? [beforeListE, afterListE]
        : [beforeListItemF, afterListItemF],
    ],
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

//Case for two adjacent list items with the first being of greater indentation
const listBackspaceCase4: BackspaceCommand = (
  tr,
  dispatch,
  $prev,
  $head,
  $last,
) => {
  /* CASE 4
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     Paragraph C { text1 }
   *     ...Children D
   *     List E {
   *       ...
   *         List F {       //May be multiple levels of lists
   *           ...Children G
   *           ListItem H {        //Last node of the block
   *             ...Children I
   *             Paragraph J { text2 |$last||textInsertPos| } |childrenMInsertPos|        //Cant have children since this ListItem is the last of the block
   *           }
   *         }
   *       ...
   *     |childrenOInsertPosition| }
   *   |$prev| }
   *   ListItem K {
   *      Paragraph L { |$head| text3 }
   *      ...Children M
   *      List? N {
   *       ...Children O
   *      }
   *   }
   * }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     Paragraph C { text1 }
   *     ...Children D
   *     List E {
   *       ...
   *         List F {
   *           ...Children G
   *           ListItem H {
   *             ...Children I
   *             Paragraph J { text2text3 }
   *             ...Children M
   *           }
   *         }
   *       ...
   *       ...Children O
   *     }
   *   }
   * }
   *
   */

  if (!$last) {
    //Exit if an invalid last was given as a parameter
    return false;
  }

  const listItemK = $head.node(-1); //Head is inside listItem K so it must have a first and last child
  if (!listItemK.firstChild || !listItemK.lastChild) {
    return false;
  }
  const paragraphL = $head.parent;

  const beforeListItemK = $head.before(-1);

  const afterParagraphJ = $last.after();
  const afterListItemK = $head.after(-1);

  const containsChildrenO = isListNode(listItemK.lastChild);

  const textInsertPos = $last.pos;
  const childrenMInsertPos = afterParagraphJ;
  const childrenOInsertPos = $prev.pos - 1; //Last item of listItem B must be a list therefore we can simply decrement $prev to get there

  const textContent = paragraphL.content;
  const childrenMContent = containsChildrenO
    ? listItemK.content.cut(
        listItemK.firstChild.nodeSize,
        listItemK.nodeSize - listItemK.lastChild.nodeSize - 2,
      )
    : listItemK.content.cut(listItemK.firstChild.nodeSize);
  const childrenOContent = listItemK.lastChild.content;

  insertContentDeleteRange(
    tr,
    (tr) => tr.doc.resolve(textInsertPos),
    containsChildrenO
      ? [
          [textContent, textInsertPos],
          [childrenMContent, childrenMInsertPos],
          [childrenOContent, childrenOInsertPos],
        ]
      : [
          [textContent, textInsertPos],
          [childrenMContent, childrenMInsertPos],
        ],
    [[beforeListItemK, afterListItemK]],
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

type ScenariosAllowed =
  | LIST_TEXT_SCENARIOS.JOIN_SIBLINGS
  | LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT
  | LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT;

const BACKSPACE_COMMANDS: Record<ScenariosAllowed, BackspaceCommand> = {
  [LIST_TEXT_SCENARIOS.JOIN_SIBLINGS]: listBackspaceCase2,
  [LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT]: listBackspaceCase3,
  [LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT]: listBackspaceCase4,
};

export const calcJoinListScenario = (
  walkNode: WalkNode,
  $head: ResolvedPos,
  tr: Transaction,
): [ScenariosAllowed, ResolvedPos | null] | false => {
  const { $pos: $prev, foundNode: prevFoundNode } = walkNode;
  const prevInList = isPosInsideList($prev);
  const headInParagraph = isPosInsideParagraph($head);
  const headInFirstChild = $head.index(-1) === 0;
  const headInList = isPosInsideList($head);

  //Must be at the start of the selection of the first child in the listItem

  if (
    !prevFoundNode ||
    !prevInList ||
    !headInParagraph ||
    !headInFirstChild ||
    !headInList
  ) {
    return false;
  }

  const prevInParagraph = isPosInsideParagraph($prev);

  if (prevInParagraph) {
    return [LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT, null];
  }

  const prevParentLastChildIsList =
    $prev.parent.lastChild && isListNode($prev.parent.lastChild);
  const prevParentLastChildIsParagraph = isParagraphNode(
    $prev.parent.lastChild,
  );

  // Will search for the possible last node for case 4 (where the list could be indented multiple times)
  // $last is required to determine whether we are in case 2 or 4
  let $last: ResolvedPos = tr.doc.resolve($prev.pos);
  let lastFoundNode: boolean;

  do {
    let walkNode = walkPrevNode($last);

    $last = walkNode.$pos;
    lastFoundNode = walkNode.foundNode;
  } while (lastFoundNode && !$last.parent.isTextblock);
  const lastInParagraph = isPosInsideParagraph($last);

  if (lastFoundNode && prevParentLastChildIsList && lastInParagraph) {
    return [LIST_TEXT_SCENARIOS.JOIN_TO_SIBLING_DESCENDANT, $last];
  } else if (prevParentLastChildIsParagraph) {
    return [LIST_TEXT_SCENARIOS.JOIN_SIBLINGS, null];
  }

  return false;
};

export const listBackspace: Command = (state, dispatch) => {
  const {
    tr,
    selection: { $head },
  } = state;
  const walkNode = walkPrevNode($head);

  if (!isEmptySelectionAtStart(state)) {
    return false;
  }

  const scenario = calcJoinListScenario(walkNode, $head, tr);

  if (!scenario) {
    return false;
  }

  const { bulletList, orderedList } = state.schema.nodes;
  const listParent = findParentNodeOfType([bulletList, orderedList])(
    tr.selection,
  );

  let actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_BULLET;
  if (listParent && listParent.node.type === orderedList) {
    actionSubjectId = ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  }

  addAnalytics(state, tr, {
    action: ACTION.LIST_ITEM_JOINED,
    actionSubject: ACTION_SUBJECT.LIST,
    actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.KEYBOARD,
      direction: DELETE_DIRECTION.BACKWARD,
      scenario: scenario[0],
    },
  });

  return BACKSPACE_COMMANDS[scenario[0]](
    tr,
    dispatch,
    walkNode.$pos,
    $head,
    scenario[1],
  );
};
