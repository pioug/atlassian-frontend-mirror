import { insertContentDeleteRange } from '../../../../utils/commands';
import { Fragment, ResolvedPos } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { isListNode } from '../../utils/node';

type DeleteAction = (props: {
  tr: Transaction;
  $next: ResolvedPos;
  $head: ResolvedPos;
}) => boolean;

// Case for when a users selection is at the end of a paragraph, the paragraph
// is followed by a list, and they delete forward
export const joinListItemWithParagraph: DeleteAction = ({
  tr,
  $next,
  $head,
}) => {
  /* CASE remove empty paragraph when followed by single level list
    Initial Structure:
    p('{<>}'),
    ul(
      li(
        p('A'),
      ),
      li(
        p('B'),
      ),
    ),
    Converts to:
    p('{<>}A'),
    ul(
      li(
        p('B'),
      ),
    ),
  */

  /* CASE remove empty paragraph when followed by a nested list
    Initial Structure:
    p('{<>}'),
    ul(
      li(
        p('A'),
        ul(
          li(
            p('child 1'),
          ),
          li(
            p('child 2'),
          ),
        ),
      ),
      li(
        p('B'),
      ),
    ),
    Converts to:
    ul(
      li(
        p('{<>}A'),
        ul(
          li(
            p('child 1')
          ),
          li(
            p('child 2')
          )
        )
      ),
      li(
        p('B')
      )
    ),
  */

  /* CASE join first list item to paragraph containing text
    Initial Structure:
    p('some text {<>}'),
    ul(
      li(
        p('A'),
      ),
      li(
        p('B'),
      ),
    ),
    Converts to:
    p('some text {<>}A'),
      ul(
        li(
          p('B')
        )
      )
  */

  /* CASE join first list item to paragraph containing text, and join child list to top level of list
    Initial Structure:
    p('some text {<>}'),
    ul(
      li(
        p('A'),
        ul(
          li(
            p('child 1'),
            ul(
              li(
                p('third level child'),
              ),
            ),
          ),
          li(
            p('child 2'),
          ),
        ),
      ),
      li(
        p('B'),
      ),
    ),
    Converts to:
    p('some text {<>}A'),
    ul(
      li(
        p('child 1'),
        ul(
          li(
            p('third level child')
            )
          )
        ),
      li(
        p('child 2')
      ),
      li(
        p('B')
      ),
    ),
  */

  /* CASE join first list item to paragraph containing text, and remove list entirely if there are no list items left
    Initial Structure:
    p('some text {<>}'),
    ul(
      li(
        p('A'),
      ),
    ),
    Converts to:
    p('some text {<>}A')
  */

  /* CASE remove empty list item when the first list item is empty
    Initial Structure:
    p('some text {<>}'),
    ul(
      li(
        p(''),
        ul(
          li(
            p('A')
          )
        )
      ),
    ),
  );
    Converts to:
    p('some text {<>}'),
    ul(
      li(
        p('A')
      )
    ),
  */

  // For empty paragraphs
  if ($head.parent.content.size < 1) {
    insertContentDeleteRange(
      tr,
      tr => tr.doc.resolve($head.pos),
      [],
      [[$head.pos - 1, $head.pos]],
    );

    return true;
  }

  // For paragraphs containing text
  const insertions: [Fragment, number][] = [];
  const deletions: [number, number][] = [];
  const paragraphPosition = $head.pos;
  const firstListItem = tr.doc.nodeAt($next.pos);
  const list = $next.parent;

  if (!firstListItem) {
    return false;
  }

  const firstChildOfFirstListItem = firstListItem.firstChild;
  const secondLevelNestedListItemOfFirstListItem =
    firstChildOfFirstListItem?.firstChild;
  const lastChildOfFirstListItem = firstListItem.lastChild;

  if (!firstChildOfFirstListItem) {
    return false;
  }

  // for first list items that contain text
  if (!secondLevelNestedListItemOfFirstListItem) {
    deletions.push([
      tr.mapping.map($next.pos),
      tr.mapping.map($next.pos + list.nodeSize - 1),
    ]);
  } else {
    deletions.push([
      tr.mapping.map($next.pos),
      tr.mapping.map($next.pos + firstListItem.nodeSize - 1),
    ]);

    const firstListItemText = Fragment.from(
      secondLevelNestedListItemOfFirstListItem,
    );

    insertions.push([firstListItemText, paragraphPosition]);
  }

  if (lastChildOfFirstListItem && isListNode(firstListItem.lastChild)) {
    const firstListItemNestedList = Fragment.from(
      lastChildOfFirstListItem.content,
    );
    insertions.push([firstListItemNestedList, tr.mapping.map($next.pos)]);
  }

  // for lists that only have one list item - need to remove remaining list
  if (firstListItem.childCount < 2 && $next.nodeAfter) {
    deletions.push([
      tr.mapping.map($next.pos - 1),
      tr.mapping.map($next.pos + $next.nodeAfter.nodeSize + 1),
    ]);
  }

  if (insertions.length < 1 && deletions.length < 1) {
    return false;
  }

  insertContentDeleteRange(
    tr,
    tr => tr.doc.resolve($head.pos),
    insertions,
    deletions,
  );
  return true;
};
