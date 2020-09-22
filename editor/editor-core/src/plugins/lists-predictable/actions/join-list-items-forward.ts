import { WalkNode } from '../../../utils/commands';
import { LIST_TEXT_SCENARIOS } from '../../analytics';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { isParagraphNode, isListNode, isListItemNode } from '../utils/node';
import { isPosInsideList, isPosInsideParagraph } from '../utils/selection';
import {
  joinParagrapWithList,
  joinSiblingListItems,
  joinNestedListWithParentListItem,
  joinListItemWithParentNestedList,
  joinListItemWithParagraph,
} from './join-list-items-scenarios';

type ScenariosAllowed =
  | LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST
  | LIST_TEXT_SCENARIOS.JOIN_SIBLINGS
  | LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT
  | LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD
  | LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH;

type DeleteAction = (props: {
  tr: Transaction;
  $next: ResolvedPos;
  $head: ResolvedPos;
}) => boolean;

type ScenarioAction = false | [ScenariosAllowed, DeleteAction];

export const calcJoinListScenario = (
  walkNode: WalkNode,
  $head: ResolvedPos,
): ScenarioAction => {
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
        isListNode(headGrandParent.lastChild)));

  const nextInList = isPosInsideList($next);

  const nextInParagraph = isPosInsideParagraph($next);

  if (!headInList && headInParagraph && nextInList) {
    return [
      LIST_TEXT_SCENARIOS.JOIN_LIST_ITEM_WITH_PARAGRAPH,
      joinListItemWithParagraph,
    ];
  }

  if (
    !nextFoundNode ||
    !headInList ||
    !headInParagraph ||
    !headInLastNonListChild
  ) {
    return false;
  }

  if (!nextInList && nextInParagraph) {
    return [LIST_TEXT_SCENARIOS.JOIN_PARAGRAPH_WITH_LIST, joinParagrapWithList];
  }

  if (!nextInList) {
    return false;
  }

  const nextNodeAfter = $next.nodeAfter;
  const nextGrandParent = $next.node(-1);
  const headGreatGrandParent = $head.node(-2);

  const nextInListItem = isListItemNode($next.parent);

  const nextNodeAfterListItem = isListItemNode(nextNodeAfter);

  const nextListItemHasFirstChildParagraph =
    nextNodeAfter && //Redundant check but the linter complains otherwise
    nextNodeAfterListItem &&
    isParagraphNode(nextNodeAfter.firstChild);

  if (!nextInListItem && nextListItemHasFirstChildParagraph) {
    return [
      LIST_TEXT_SCENARIOS.JOIN_DESCENDANT_TO_PARENT,
      joinNestedListWithParentListItem,
    ];
  }

  if (!nextInListItem) {
    return false;
  }

  const nextParentSiblingOfHeadParent =
    nextGrandParent && nextGrandParent === headGreatGrandParent;

  const nextNodeAfterIsParagraph = isParagraphNode(nextNodeAfter);

  if (!nextNodeAfterIsParagraph) {
    return false;
  }

  if (nextParentSiblingOfHeadParent) {
    return [LIST_TEXT_SCENARIOS.JOIN_SIBLINGS, joinSiblingListItems];
  }

  return [
    LIST_TEXT_SCENARIOS.JOIN_PARENT_SIBLING_TO_PARENT_CHILD,
    joinListItemWithParentNestedList,
  ];
};
