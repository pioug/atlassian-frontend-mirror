import {
  insertContentDeleteRange,
  isEmptySelectionAtEnd,
  walkNextNode,
  WalkNode,
} from '../../../utils/commands';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  DELETE_DIRECTION,
  addAnalytics,
  LIST_TEXT_SCENARIOS,
} from '../../analytics';
import { Command } from '../../../types';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { CommandDispatch } from '../../../../src/types';
import { isPosInsideList, isPosInsideParagraph } from '../utils';

type DeleteCommand = (
  tr: Transaction,
  dispatch: CommandDispatch | undefined,
  $next: ResolvedPos,
  $head: ResolvedPos,
) => boolean;

//Cases below refer to the cases found in this document: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1146954996/List+Backspace+and+Delete+Behaviour

//Case for two adjacent nodes with the first being a list item and the last being a paragraph
const listDeleteCase1: DeleteCommand = (tr, dispatch, $next, $head) => {
  /* CASE 1
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$head||textInsertPos| }
   *   }
   * }
   * Paragraph E { |$next| text 2 }
   *
   * Converts to:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1text2 }
   *   }
   * }
   *
   */

  const paragraphE = $next.parent;

  const beforeParagraphE = $next.before();

  const afterParagraphE = $next.after();

  const textInsertPos = $head.pos;

  const textContent = paragraphE.content;

  insertContentDeleteRange(
    tr,
    (tr) => tr.doc.resolve(textInsertPos),
    [[textContent, textInsertPos]],
    [[beforeParagraphE, afterParagraphE]],
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

//Case for two adjacent list items of the same indentation
const listDeleteCase2: DeleteCommand = (tr, dispatch, $next, $head) => {
  /* CASE 2
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$head||textInsertPos| }       //Cant have children since that would be Case 4
   *   |childrenGInsertPos| }
   *   ListItem E { |$next|
   *     Paragraph F { text2 }
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

  const listItemE = $next.parent;
  const paragraphF = $next.nodeAfter; //ListItem must have at least one child
  if (!paragraphF) {
    return false;
  }

  const beforeListItemE = $next.before();
  const afterListItemE = $next.after();

  const endListItemB = $head.end(-1);

  const textInsertPos = $head.pos;
  const childrenGInsertPos = endListItemB;

  const textContent = paragraphF.content;
  const childrenGContent = listItemE.content.cut(paragraphF.nodeSize);

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
const listDeleteCase3: DeleteCommand = (tr, dispatch, $next, $head) => {
  /* CASE 3
   * Initial Structure:
   *
   * List A {
   *   ListItem B {
   *     ...Children C
   *     Paragraph D { text1 |$head||textInsertPos| } |childrenHInsertPos|
   *     List E { |$next||childrenJInsertPos|
   *       ListItem F {
   *         Paragraph G { text2 }
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

  const listE = $next.parent;
  const listItemF = $next.nodeAfter; //We know next is before a ListItem. ListItem must have at least one child
  if (!listItemF || !listItemF.lastChild) {
    return false;
  }
  const paragraphG = listItemF.firstChild; //ListItem must have at least one child
  if (!paragraphG) {
    return false;
  }

  const beforeListE = $next.before();
  const beforeListItemF = $next.pos;

  const afterParagraphD = $head.after();
  const afterListE = $next.after();
  const afterListItemF = tr.doc.resolve($next.pos + 1).after(); //List must always have at least one listItem

  const containsChildrenJ =
    listItemF.lastChild.type.name === 'bulletList' ||
    listItemF.lastChild.type.name === 'orderedList';
  const shouldRemoveListE = listE.childCount === 1 && !containsChildrenJ; //Assures no Children J and K

  const textInsertPos = $head.pos;
  const childrenHInsertPos = afterParagraphD;
  const childrenJInsertPos = $next.pos;

  const textContent = paragraphG.content;
  const childrenHContent = containsChildrenJ
    ? listItemF.content.cut(
        paragraphG.nodeSize,
        listItemF.nodeSize - listItemF.lastChild.nodeSize - 2,
      )
    : listItemF.content.cut(paragraphG.nodeSize); //If Children J doesn't exist then Children H will include the last node
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
const listDeleteCase4: DeleteCommand = (tr, dispatch, $next, $head) => {
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
   *             Paragraph J { text2 |$head||textInsertPos| } |childrenMInsertPos|        //Cant have children since this ListItem is the last of the block
   *           }
   *         }
   *       ...
   *     |childrenOInsertPos| }
   *   }
   *   ListItem K { |$next|
   *      Paragraph L { text3 }
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

  const listItemK = $next.parent; //List must have at least one child
  if (!listItemK.firstChild || !listItemK.lastChild) {
    return false;
  }

  const beforeListItemK = $next.before();

  const afterListItemB = $next.before();
  const afterListItemK = $next.after();

  const containsChildrenO =
    listItemK.lastChild.type.name === 'bulletList' ||
    listItemK.lastChild.type.name === 'orderedList';

  const textInsertPos = $head.pos;
  const childrenMInsertPos = $head.pos + 1;
  const childrenOInsertPos = afterListItemB - 2;

  const textContent = listItemK.firstChild.content;
  const childrenMContent = containsChildrenO
    ? listItemK.content.cut(
        listItemK.firstChild.nodeSize,
        listItemK.nodeSize - listItemK.lastChild.nodeSize - 2, //Get the position before
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
  | LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST
  | LIST_TEXT_SCENARIOS.JOIN_SIBLINGS
  | LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT
  | LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD;

const DELETE_FORWARD_COMMANDS: Record<ScenariosAllowed, DeleteCommand> = {
  [LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST]: listDeleteCase1,
  [LIST_TEXT_SCENARIOS.JOIN_SIBLINGS]: listDeleteCase2,
  [LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT]: listDeleteCase3,
  [LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD]: listDeleteCase4,
};

export const calcJoinListScenario = (
  walkNode: WalkNode,
  $head: ResolvedPos,
): ScenariosAllowed | false => {
  const { $pos: $next, foundNode: nextFoundNode } = walkNode;

  const headParent = $head.parent;
  const headGrandParent = $head.node(-1);
  const headInList = isPosInsideList($head);
  const headInParagraph = isPosInsideParagraph($head);

  const headInLastNonListChild =
    headGrandParent &&
    headGrandParent.lastChild &&
    (headGrandParent.lastChild === headParent ||
      (headGrandParent.childCount > 1 &&
        headGrandParent.child(headGrandParent.childCount - 2) === headParent && //find the second last child if a list item may be the last child
        (headGrandParent.lastChild.type.name === 'orderedList' ||
          headGrandParent.lastChild.type.name === 'bulletList')));

  const nextInList = isPosInsideList($next);

  const nextInParagraph = isPosInsideParagraph($next);

  if (
    !nextFoundNode ||
    !headInList ||
    !headInParagraph ||
    !headInLastNonListChild
  ) {
    return false;
  }

  if (!nextInList && nextInParagraph) {
    return LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST;
  }

  if (!nextInList) {
    return false;
  }

  const nextNodeAfter = $next.nodeAfter;
  const nextGrandParent = $next.node(-1);
  const headGreatGrandParent = $head.node(-2);

  const nextInListItem = $next.parent.type.name === 'listItem';

  const nextNodeAfterListItem =
    nextNodeAfter && nextNodeAfter.type.name === 'listItem';

  const nextListItemHasFirstChildParagraph =
    nextNodeAfter && //Redundant check but the linter complains otherwise
    nextNodeAfterListItem &&
    nextNodeAfter.firstChild &&
    nextNodeAfter.firstChild.type.name === 'paragraph';

  if (!nextInListItem && nextListItemHasFirstChildParagraph) {
    return LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT;
  }

  if (!nextInListItem) {
    return false;
  }

  const nextParentSiblingOfHeadParent =
    nextGrandParent && nextGrandParent === headGreatGrandParent;

  const nextNodeAfterIsParagraph =
    nextNodeAfter && nextNodeAfter.type.name === 'paragraph';

  if (!nextNodeAfterIsParagraph) {
    return false;
  }

  if (nextParentSiblingOfHeadParent) {
    return LIST_TEXT_SCENARIOS.JOIN_SIBLINGS;
  }

  return LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD;
};

export const listDelete: Command = (state, dispatch) => {
  const {
    tr,
    selection: { $head },
  } = state;
  const walkNode = walkNextNode($head);

  if (!isEmptySelectionAtEnd(state)) {
    return false;
  }

  const scenario = calcJoinListScenario(walkNode, $head);

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
      direction: DELETE_DIRECTION.FORWARD,
      scenario,
    },
  });

  return DELETE_FORWARD_COMMANDS[scenario](tr, dispatch, walkNode.$pos, $head);
};
