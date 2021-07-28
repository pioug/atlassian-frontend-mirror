import { insertContentDeleteRange } from '../../../../utils/commands';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

type DeleteAction = (props: {
  tr: Transaction;
  $next: ResolvedPos;
  $head: ResolvedPos;
}) => boolean;

//Case for two adjacent nodes with the first being a list item and the last being a paragraph
export const joinParagrapWithList: DeleteAction = ({ tr, $next, $head }) => {
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

  return true;
};
