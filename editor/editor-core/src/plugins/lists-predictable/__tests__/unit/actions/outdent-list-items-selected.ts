import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  p,
  ul,
  ol,
  li,
  doc,
  panel,
  mention,
  media,
  mediaSingle,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { outdentListItemsSelected } from '../../../actions/outdent-list-items-selected';

describe('outdent-list-items-selected', () => {
  const case0: [string, DocBuilder, DocBuilder] = [
    'cursor selection is inside of a nested list item',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
            li(p('B2{<>}')),
            li(p('B3')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
          ),
        ),
        li(
          p('B2{<>}'),
          ul(
            li(p('B3')),
          ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case1: [string, DocBuilder, DocBuilder] = [
    'cursor selection is inside of the last nested list item',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
            li(p('B2')),
            li(p('B3{<>}')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
            li(p('B2')),
          ),
        ),
        li(p('B3')),
        li(p('C')),
      ),
    ),
  ];

  const case2: [string, DocBuilder, DocBuilder] = [
    'range selection is surrounding a list item with nested items and it have a sibling with nested list',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
               p('{<}B'),
               ul(
                 li(p('B1{>}')),
               ),
            ),
            li(
               p('C'),
               ul(
                 li(p('C1')),
               ),
            ),
          ),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
           p('{<}B'),
           ul(
             li(p('B1{>}')),
             li(
                p('C'),
                ul(
                  li(p('C1')),
                ),
             ),
           ),
        ),
      ),
    ),
  ];

  const case3: [string, DocBuilder, DocBuilder] = [
    'range selection is surrounding a list item with nested items and it have previous sibling with nested list',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
               p('B'),
               ul(
                 li(p('B1')),
               ),
            ),
            li(
               p('{<}C'),
               ul(
                 li(p('C1{>}')),
               ),
            ),
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
          ul(
            li(
               p('B'),
               ul(
                 li(p('B1')),
               ),
            ),
          ),
        ),
        li(
           p('{<}C'),
           ul(
             li(p('C1{>}')),
           ),
        ),
      ),
    ),
  ];

  const case4: [string, DocBuilder, DocBuilder] = [
    'range selection is inside of a nested list item around two list items',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
            li(p('B{<}2')),
            li(p('B{>}3')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
          ),
        ),
        li(p('B{<}2')),
        li(p('B{>}3')),
        li(p('C')),
      ),
    ),
  ];

  const case5: [string, DocBuilder, DocBuilder] = [
    'range selection is inside of a nested list item around all list items',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B{<}1')),
            li(p('B2')),
            li(p('B{>}3')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('B')),
        li(p('B{<}1')),
        li(p('B2')),
        li(p('B{>}3')),
        li(p('C')),
      ),
    ),
  ];

  const case6: [string, DocBuilder, DocBuilder] = [
    'range selection is inside of a nested list item leaving only the last list item',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B{<}1')),
            li(p('B{>}2')),
            li(p('B3')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('B')),
        li(p('B{<}1')),
        li(
          p('B{>}2'),
          ul(
            li(p('B3')),
          ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case7: [string, DocBuilder, DocBuilder] = [
    'range selection is from a first level list item with nested items until the next sibling',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(p('B1')),
            li(p('B2')),
            li(p('B3')),
          ),
        ),
        li(p('C{>}')),
      ),
    ),
    // prettier-ignore
    doc(
      ul(li(p('A'))),
      p('{<}B'),
      ul(
        li(p('B1')),
        li(p('B2')),
        li(p('B3')),
      ),
      p('C{>}')
    ),
  ];

  const case8: [string, DocBuilder, DocBuilder] = [
    'range selection is from a first level list item to inside of a nested list item selection all list items',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(p('B1')),
            li(p('B2')),
            li(p('B3{>}')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // prettier-ignore
    doc(
      ul(li(p('A'))),
      p('{<}B'),
      ul(
        li(p('B1')),
        li(p('B2')),
        li(p('B3{>}')),
        li(p('C')),
      ),
    ),
  ];

  const case9: [string, DocBuilder, DocBuilder] = [
    'range selection is in the last list item',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
            li(p('B2')),
            li(p('B3')),
          ),
        ),
        li(p('C{<>}')),
      ),
    ),
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('B1')),
            li(p('B2')),
            li(p('B3')),
          ),
        ),
      ),
      p('C{<>}'),
    ),
  ];

  const case10: [string, DocBuilder, DocBuilder] = [
    'cursor selection is inside a list item with nested items and it have a sibling with nested list',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
               p('B'),
               ul(
                 li(p('B1{<>}')),
               ),
            ),
            li(
               p('C'),
               ul(
                 li(p('C1')),
               ),
            ),
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
          ul(
            li(p('B')),
            li(p('B1{<>}')),
            li(
               p('C'),
               ul(
                 li(p('C1')),
               ),
            ),
          ),
        ),
      ),
    ),
  ];

  const case11: [string, DocBuilder, DocBuilder] = [
    'range selection is surrounding from a level one list item to until his second last nested list item',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
               p('{<}B'),
               ul(
                 li(p('B1{>}')),
                 li(p('B2')),
               ),
            ),
            li(
               p('C'),
               ul(
                 li(p('C1')),
               ),
            ),
          ),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1{>}'),
              ul(
                li(p('B2')),
              ),
            ),
            li(
               p('C'),
               ul(
                 li(p('C1')),
               ),
            ),
          ),
        ),
      ),
    ),
  ];

  const case12: [string, DocBuilder, DocBuilder] = [
    'range selection is surrounding a deep nested item until its cousin',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
               p('B'),
               ul(
                 li(p('{<}B1')),
               ),
            ),
            li(
               p('C'),
               ul(
                 li(p('C1{>}')),
               ),
            ),
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
          ul(
            li(p('B')),
            li(p('{<}B1')),
          ),
        ),
        li(
          p('C'),
          ul(
            li(p('C1{>}')),
          ),
        ),
      ),
    ),
  ];

  const case13: [string, DocBuilder, DocBuilder] = [
    'range selection is surrounding a deep nested item until two level up sibling',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p("A"),
          ul(
            li(
              p("B1"),
              ul(
                li(
                  p("C1"),
                  ul(
                    li(
                      p("D{<}1"),
                    ),
                  ),
                ),
              ),
            ),
            li(
              p("B{>}2"),
            ),
          ),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(
          p("A"),
          ul(
            li(
              p("B1"),
              ul(
                li(
                  p("C1"),
                ),
                li(
                  p("D{<}1"),
                ),
              ),
            ),
          ),
        ),
        li(
          p("B{>}2"),
        ),
      ),
    ),
  ];

  const case14: [string, DocBuilder, DocBuilder] = [
    'range selection coming from a nested list until the first list item with nested list',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p("A"),
          ul(
            li(
              p("B"),
              ul(
                li(
                  p("B1"),
                  ul(
                    li(
                      p("X"),
                      ul(
                        li(p("B{<}3")),
                      ),
                    ),
                    li(p("Y")),
                  ),
                ),
              ),
            ),
            li(
              p("C"),
              ul(
                li(p("C1{>}")),
              )
            ),
            li(
              p("D"),
              ul(
                li(p("D1")),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Result
    // prettier-ignore
    doc(
      ul(
        li(
          p("A"),
          ul(
            li(
              p("B"),
              ul(
                li(
                  p("B1"),
                  ul(
                    li(p("X")),
                    li(p("B{<}3")),
                  ),
                ),
                li(p("Y")),
              ),
            ),
          )
        ),
        li(
          p("C"),
          ul(
            li(p("C1{>}")),
            li(
              p("D"),
              ul(
                li(p("D1")),
              ),
            ),
          )
        ),
      ),
    ),
  ];

  const case15: [string, DocBuilder, DocBuilder] = [
    'range selection is coming from a nested item going by three last nested list items',
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(
                  p('B1'),
                  ul(
                    li(p('X{<}X')),
                  ),
                ),
                li(p('B2')),
              ),
            ),
            li(
              p('C'),
              ul(
                li(p('C{>}1')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('B1')),
                li(p('X{<}X')),
              ),
            ),
            li(p('B2')),
          ),
        ),
        li(
          p('C'),
          ul(
            li(p('C{>}1')),
          ),
        ),
      ),
    ),
  ];

  const case16: [string, DocBuilder, DocBuilder] = [
    'list is inside of block node',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('A')),
          li(
            p('B'),
            ul(
              li(p('B1')),
              li(p('B2{<>}')),
              li(p('B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('A')),
          li(
            p('B'),
            ul(li(p('B1'))),
          ),
          li(
            p('B2{<>}'),
            ul(li(p('B3'))),
          ),
          li(p('C')),
        ),
      ),
    ),
  ];

  const case17: [string, DocBuilder, DocBuilder] = [
    'cursor selection is inside a bullet list and the parent is a ordered list',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(p('A')),
          li(
            p('B'),
            ul(
              li(p('B1')),
              li(p('B2{<>}')),
              li(p('B3')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(p('A')),
          li(
            p('B'),
            ul(li(p('B1'))),
          ),
          li(
            p('B2{<>}'),
            ul(li(p('B3'))),
          ),
          li(p('C')),
        ),
      ),
    ),
  ];

  const case18: [string, DocBuilder, DocBuilder] = [
    'cursor selection at the top of ordered list with a nested bullet list',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(
            p('A{<>}'),
            ul(
              li(p('B1')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        p('A{<>}'),
        ol(
          li(p('B1')),
          li(p('C')),
        ),
      ),
    ),
  ];

  const case19: [string, DocBuilder, DocBuilder] = [
    'cursor selection is a the begin of the first list item',
    // Scenario
    // prettier-ignore
    doc(
      ol(
        li(
          p('{<>}A'),
          ul(
            li(p('B1')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      p('{<>}A'),
      ol(
        li(p('B1')),
        li(p('C')),
      ),
    ),
  ];

  const case20: [string, DocBuilder, DocBuilder] = [
    'cursor selection is a the begin of the first list item inside a block node',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(
            p('{<>}A'),
            ul(
              li(p('B1')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        p('{<>}A'),
        ol(
          li(p('B1')),
          li(p('C')),
        ),
      ),
    ),
  ];

  const case21: [string, DocBuilder, DocBuilder] = [
    'range selection is at the begin of the first list item',
    // Scenario
    // prettier-ignore
    doc(
      ol(
        li(
          p('B{<}AL{>}A'),
          ul(
            li(p('B1')),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      p('B{<}AL{>}A'),
      ol(
        li(p('B1')),
        li(p('C')),
      ),
    ),
  ];

  const case22: [string, DocBuilder, DocBuilder] = [
    'range selection is at the begin of the first list item inside a block node',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(
            p('B{<}AL{>}A'),
            ul(
              li(p('B1')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        p('B{<}AL{>}A'),
        ol(
          li(p('B1')),
          li(p('C')),
        ),
      ),
    ),
  ];

  const case23: [string, DocBuilder, DocBuilder] = [
    'cursor selection is a node selection',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(
            p('B {<node>}', mention({ id: '1' })(),'A'),
            ul(
              li(p('B1')),
            ),
          ),
          li(p('C')),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        p('B {<node>}', mention({ id: '1' })(),'A'),
        ol(
          li(p('B1')),
          li(p('C')),
        ),
      ),
    ),
  ];

  const case24: [string, DocBuilder, DocBuilder] = [
    'range selection surrouding a media single',
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(
            p('A'),
            ul(
              li(p('{<}B')),
              li(
                mediaSingle({ layout: 'center' })(
                  media({
                    id: 'lol',
                    type: 'file',
                    collection: 'false',
                    __fileMimeType: 'image/png',
                    __contextId: 'DUMMY-OBJECT-ID',
                    width: 100,
                    height: 100,
                  })(),
                ),
              ),
              li(p('C{>}')),
            ),
          ),
        ),
      ),
    ),
    // Scenario
    // prettier-ignore
    doc(
      panel()(
        ol(
          li(p('A')),
          li(p('{<}B')),
          li(
            mediaSingle({ layout: 'center' })(
              media({
                id: 'lol',
                type: 'file',
                collection: 'false',
                __fileMimeType: 'image/png',
                __contextId: 'DUMMY-OBJECT-ID',
                width: 100,
                height: 100,
              })(),
            ),
          ),
          li(p('C{>}')),
        ),
      ),
    ),
  ];

  describe.each<[string, DocBuilder, DocBuilder]>([
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
    case11,
    case12,
    case13,
    case14,
    case15,
    case16,
    case17,
    case18,
    case19,
    case20,
    case21,
    case22,
    case23,
    case24,
  ])('[case%#] when %s', (_scenario, previousDocument, expectedDocument) => {
    it('should match the expected document and keep the selection', () => {
      const myState = createEditorState(previousDocument);
      const { tr } = myState;

      outdentListItemsSelected(tr);

      expect(tr).toEqualDocumentAndSelection(expectedDocument(sampleSchema));
    });
  });
});
