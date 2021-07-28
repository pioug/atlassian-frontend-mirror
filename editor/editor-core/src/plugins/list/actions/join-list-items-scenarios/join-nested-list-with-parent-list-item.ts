import { insertContentDeleteRange } from '../../../../utils/commands';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { isListNode } from '../../utils/node';

type DeleteAction = (props: {
  tr: Transaction;
  $next: ResolvedPos;
  $head: ResolvedPos;
}) => boolean;

//Case for two adjacent list items with the first being of lower indentation
export const joinNestedListWithParentListItem: DeleteAction = ({
  tr,
  $next,
  $head,
}) => {
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

  const containsChildrenJ = isListNode(listItemF.lastChild);
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

  return true;
};
