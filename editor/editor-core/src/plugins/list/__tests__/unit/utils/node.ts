import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  p,
  ul,
  ol,
  li,
  doc,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { joinSiblingLists, JoinDirection } from '../../../utils/node';

type ListsJoined = {
  orderedList: number;
  bulletList: number;
};

describe('utils/node', () => {
  describe('#joinSiblingLists', () => {
    const case0: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'should join two list inside of the selection when the direction is right',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        ul(li(p('{<}A'))),
        ul(li(p('B{>}'))),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ul(
          li(p('{<}A')),
          li(p('B{>}')),
        ),
      ),
      {
        bulletList: 1,
        orderedList: 0,
      },
    ];

    const case1: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'should join two list inside of the selection when the direction is left',
      JoinDirection.LEFT,
      // Scenario
      // prettier-ignore
      doc(
        ol(li(p('{<}A'))),
        ol(li(p('B{>}'))),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ol(
          li(p('{<}A')),
          li(p('B{>}')),
        ),
      ),
      {
        bulletList: 0,
        orderedList: 1,
      },
    ];

    const case2: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'should join two ordered lists that are siblings into one ordered list',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        ul(
          li(
            p('A'),
            ol(
              li(p('B1')),
              li(p('B2{<>}')),
            ),
            ol(
              li(p('C1')),
            ),
          ),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ul(
          li(
            p('A'),
            ol(
              li(p('B1')),
              li(p('B2{<>}')),
              li(p('C1')),
            ),
          ),
        ),
      ),
      {
        bulletList: 0,
        orderedList: 1,
      },
    ];

    const case3: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'should join two lists sibling not nested from the same type',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        ul(li(p('A{<>}'))),
        ul(li(p('B'))),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ul(
          li(p('A{<>}')),
          li(p('B')),
        ),
      ),
      {
        bulletList: 1,
        orderedList: 0,
      },
    ];

    const case4: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'should not join two lists sibling not nested of diferent types',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        ul(
          li(p('A{<>}')),
        ),
        ol(
          li(p('B')),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ul(
          li(p('A{<>}')),
        ),
        ol(
          li(p('B')),
        ),
      ),
      {
        bulletList: 0,
        orderedList: 0,
      },
    ];

    const case5: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'when the list are inside of block node should not join two lists sibling not nested of different types',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        panel()(
          ul(
            li(p('A{<>}')),
          ),
          ol(
            li(p('B')),
          ),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        panel()(
          ul(
            li(p('A{<>}')),
          ),
          ol(
            li(p('B')),
          ),
        ),
      ),
      {
        bulletList: 0,
        orderedList: 0,
      },
    ];

    const case6: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'when the list are inside of block node should join two lists sibling not nested from same type',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        panel()(
          ul(
            li(p('A{<>}')),
          ),
          ul(
            li(p('B')),
          ),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        panel()(
          ul(
            li(p('A{<>}')),
            li(p('B')),
          ),
        ),
      ),
      {
        bulletList: 1,
        orderedList: 0,
      },
    ];

    const case7: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'when the selection is not inside a list',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(p('A')),
          ),
          ol(
            li(p('B1')),
          ),
          ol(
            li(p('B2')),
          ),
        ),
        ul(
          li(p('A1')),
        ),
        ul(
          li(p('A2')),
        ),
        ol(
          li(
            p('B3'),
            ul(
              li(p('X1')),
            ),
            ul(
              li(p('X2')),
            ),
          ),
        ),
        ul(
          li(
            p('B4'),
            ul(
              li(p('Y1')),
            ),
            ol(
              li(p('Y2')),
            ),
          ),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(p('A')),
          ),
          ol(
            li(p('B1')),
            li(p('B2')),
          ),
        ),
        ul(
          li(p('A1')),
          li(p('A2')),
        ),
        ol(
          li(
            p('B3'),
            ul(
              li(p('X1')),
              li(p('X2')),
            ),
          ),
        ),
        ul(
          li(
            p('B4'),
            ol(
              li(p('Y1')),
              li(p('Y2')),
            ),
          ),
        ),
      ),
      {
        bulletList: 2,
        orderedList: 2,
      },
    ];

    const case8: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'when there is more than one non-nested sibling lists to join',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(p('A')),
          ),
          ol(
            li(p('B1')),
          ),
          ol(
            li(p('B2')),
          ),
          ol(
            li(p('B3')),
          ),
          ol(
            li(p('B4')),
          ),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(p('A')),
          ),
          ol(
            li(p('B1')),
            li(p('B2')),
            li(p('B3')),
            li(p('B4')),
          ),
        ),
      ),
      {
        bulletList: 0,
        orderedList: 3,
      },
    ];

    const case9: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'when there is more than one nested sibling lists to join',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(
              p('A'),
              ol(
                li(p('B1')),
              ),
              ol(
                li(p('B2')),
              ),
              ol(
                li(p('B3')),
              ),
              ol(
                li(p('B4')),
              ),
            ),
          ),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(
              p('A'),
              ol(
                li(p('B1')),
                li(p('B2')),
                li(p('B3')),
                li(p('B4')),
              ),
            ),
          ),
        ),
      ),
      {
        bulletList: 0,
        orderedList: 3,
      },
    ];

    const case10: [
      string,
      JoinDirection,
      DocBuilder,
      DocBuilder,
      ListsJoined,
    ] = [
      'when there is more than one nested mixed sibling lists to join',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(
              p('A'),
              ol(
                li(p('B1')),
              ),
              ul(
                li(p('B2')),
              ),
              ol(
                li(p('B3')),
              ),
              ul(
                li(p('B4')),
              ),
            ),
          ),
        ),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        p('H{<>}'),
        panel()(
          ul(
            li(
              p('A'),
              ul(
                li(p('B1')),
                li(p('B2')),
                li(p('B3')),
                li(p('B4')),
              ),
            ),
          ),
        ),
      ),
      {
        bulletList: 2,
        orderedList: 1,
      },
    ];

    describe.each<[string, JoinDirection, DocBuilder, DocBuilder, ListsJoined]>(
      [
        // prettier-ignore
        case0,
        case1,
        case2,
        case3,
        case4,
        case5,
        case6,
        case7,
        case8,
        case9,
        case10,
      ],
    )(
      '[case%#] when %s',
      (_scenario, direction, previousDocument, expectedDocument, data) => {
        it('should match the expected document and keep the selection', () => {
          const myState = createEditorState(previousDocument);
          const { tr } = myState;

          const result = joinSiblingLists({ tr, direction });

          expect(tr).toEqualDocumentAndSelection(
            expectedDocument(sampleSchema),
          );
          expect(result).toEqual(data);
        });
      },
    );
  });
});
