import { insertContentDeleteRange } from '../../../../utils/commands';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

type DeleteAction = (props: {
  tr: Transaction;
  $next: ResolvedPos;
  $head: ResolvedPos;
}) => boolean;

//Case for two adjacent list items of the same indentation
export const joinSiblingListItems: DeleteAction = ({ tr, $next, $head }) => {
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

  return true;
};
