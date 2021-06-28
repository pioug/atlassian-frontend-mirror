import { insertContentDeleteRange } from '../../../../utils/commands';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { isListNode } from '../../utils/node';

type DeleteAction = (props: {
  tr: Transaction;
  $next: ResolvedPos;
  $head: ResolvedPos;
}) => boolean;

//Case for two adjacent list items with the first being of greater indentation
export const joinListItemWithParentNestedList: DeleteAction = ({
  tr,
  $next,
  $head,
}) => {
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

  const containsChildrenO = isListNode(listItemK.lastChild);

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

  return true;
};
