import { Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import {
  doc,
  p,
  a,
  ol,
  ul,
  li,
  alignment,
  panel,
  code_block,
  hr,
  expand,
  nestedExpand,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/schema-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import {
  createEditorState,
  DocumentType,
} from '@atlaskit/editor-test-helpers/create-editor-state';
import { toJSON } from '../../../../utils';
import { handleParagraphBlockMarks, insertSlice } from '../../handlers';

describe('handleParagraphBlockMarks', () => {
  let slice: Slice;

  describe('slice has alignment or indentation marks', () => {
    beforeEach(() => {
      const paragraphWithAlignment = doc(
        alignment({ align: 'end' })(p('hello')), // source
      )(defaultSchema);

      const json = toJSON(paragraphWithAlignment);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });
    });

    describe('destination supports those marks', () => {
      let state: EditorState;

      beforeEach(() => {
        state = createEditorState(
          doc(
            p('{<>}'), // destination
          ),
        );
      });

      it('should decrement the open depth of the slice', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.openStart).toEqual(0);
      });

      it('retains alignment or indentation marks', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.firstChild?.marks[0].type.name).toEqual(
          'alignment',
        );
      });
    });

    describe('destination does not support those marks', () => {
      let state: EditorState;

      beforeEach(() => {
        state = createEditorState(
          doc(
            panel()(p('{<>}')), // destination
          ),
        );
      });

      it('should not decrement the open depth of the slice', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.openStart).toEqual(1);
      });

      it('drops alignment or indentation marks', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.firstChild?.marks.length).toEqual(0);
      });

      it('handles multiple paragraphs', () => {
        const multipleParagraphs = doc(
          p('normal text'),
          alignment({ align: 'end' })(p('hello')),
          p('normal text'),
        )(defaultSchema);

        const json = toJSON(multipleParagraphs);
        slice = Slice.fromJSON(defaultSchema, {
          content: json.content,
          openStart: 1,
          openEnd: 1,
        });

        const expectedFragment = doc(
          p('normal text'),
          p('hello'),
          p('normal text'),
        )(defaultSchema);

        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.eq(expectedFragment.content)).toBeTruthy();
      });
    });
  });

  describe('slice does not have alignment or indentation marks', () => {
    beforeEach(() => {
      const paragraphWithoutAlignment = doc(
        p(
          a({ href: 'https://hello.atlassian.net' })('hello'), // source
        ),
      )(defaultSchema);

      const json = toJSON(paragraphWithoutAlignment);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });
    });

    it('should not decrement the open depth of the slice', () => {
      const state = createEditorState(
        doc(
          panel()(p('{<>}')), // destination
        ),
      );

      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.openStart).toEqual(1);
    });
  });

  describe('destination already has content', () => {
    let state: EditorState;

    beforeEach(() => {
      state = createEditorState(
        doc(
          alignment({ align: 'center' })(p('pre-existing text {<>}')), // destination
        ),
      );
    });

    it('pasting a single paragraph should not alter the slice', () => {
      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.eq(slice)).toBeTruthy();
    });

    it('pasting multiple paragraphs should keep source formatting', () => {
      const multipleParagraphs = doc(
        p('normal text'),
        alignment({ align: 'end' })(p('hello')),
        p('normal text'),
      )(defaultSchema);

      const json = toJSON(multipleParagraphs);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.openStart).toEqual(0);
    });
  });
});

describe('paste list', () => {
  const case0: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a empty panel',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}'),
      ),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(li(p('A{<>}'))),
      ),
    ),
  ];

  const case1: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is the start of paragraph',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}Hello'),
      ),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(li(p('A{<>}'))),
        p('Hello'),
      ),
    ),
  ];

  const case2: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is the end of paragraph',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('Hello{<>}'),
      ),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        p('Hello'),
        ul(li(p('{<>}A'))),
      ),
    ),
  ];

  const case3: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is the start of paragraph',
    'paste content has a nested list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}Hello'),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(li(p('B{>}'))),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(
            p('A'),
            ul(li(p('B'))),
          ),
        ),
        p('{<>}Hello'),
      ),
    ),
  ];

  const case4: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is the end of paragraph',
    'paste content has a nested list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('Hello{<>}'),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(li(p('B{>}'))),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        p('Hello'),
        ul(
          li(
            p('A'),
            ul(li(p('B{<>}'))),
          ),
        ),
      ),
    ),
  ];

  const case5: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a empty panel selected by node selection',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      '{<node>}',
      panel()(p()),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(li(p('A{<>}'))),
      ),
    ),
  ];

  const case6: [string, string, DocumentType, DocumentType, DocumentType] = [
    'the document is empty',
    'paste content has a simple list',
    // Destination
    doc(p()),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      ul(li(p('A{<>}'))),
    ),
  ];

  const case7: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection over two nested list items',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(p('C{>}')),
            li(p('D')),
          ),
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('D')),
          ),
        ),
      ),
    ),
  ];

  const case8: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection over two nested list items',
    'paste content is a nested bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(p('C{>}')),
            li(p('D')),
          ),
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(p('baz{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(
          p('baz'),
          ul(li(p('D')))
        ),
      ),
    ),
  ];

  const case9: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection at the start of an empty list item',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('{<>}')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(p('baz{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(
          p('baz'),
        )
      ),
    ),
  ];

  const case10: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection at the start of an empty list item',
    'paste content is a text from a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('{<>}')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1 {<}- test{>}')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(p('baz'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('- test')),
      ),
    ),
  ];

  const case11: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across two levels of list item and has nested children',
    'paste content is a bullet list',
    // Destination
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
                li(
                  p('B2'),
                  ul(
                    li(
                      p('B3')
                      ),
                  ),
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(
              p('B2'),
              ul(
                li(
                  p('B3')
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case12: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across two levels of list item and has nested children',
    'paste content is a bullet list with a code block in a list item',
    // Destination
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
                li(
                  p('B2'),
                  ul(
                    li(
                      p('B3')
                      ),
                  ),
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('foo'),
          code_block({})('test')
        ),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('foo'),
          code_block({})('test')
        ),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(
              p('B2'),
              ul(
                li(
                  p('B3')
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case13: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across three levels of list item and has nested children',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B2{>}'),
                  ul(
                    li(
                      p('B3')
                      ),
                  ),
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('B3')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case14: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across three levels of list item and the last item has a sibling thats unselected',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(p('B2{>}')),
                li(p('B3')),
                li(p('B4')),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('B3')),
            li(p('B4')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case15: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across four levels of list item and the last item has a sibling thats unselected',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B2'),
                  ul(
                    li(p('B3{>}')),
                    li(p('B4')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('B4')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case16: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across four levels of list item, has an empty list item sibling',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B2'),
                  ul(
                    li(p('B3{>}')),
                    li(p('')),
                    li(p('B4')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(p('{<}foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('')),
            li(p('B4')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  // TODO: caseX & caseY to be turned on as part of https://product-fabric.atlassian.net/browse/ED-10942
  // const caseX: [string, string, DocumentType, DocumentType, DocumentType] = [
  //   'destination is a selection across four levels of list item and ends midway through a list item',
  //   'paste content is a bullet list',
  //   // Destination
  //   // prettier-ignore
  //   doc(
  //     ul(
  //       li(p('A')),
  //       li(
  //         p('{<}B'),
  //         ul(
  //           li(
  //             p('B1'),
  //             ul(
  //               li(
  //                 p('B2'),
  //                 ul(
  //                   li(p('B{>}3')),
  //                   li(p('B4')),
  //                 )
  //               ),
  //             ),
  //           ),
  //         ),
  //       ),
  //       li(p('C')),
  //     ),
  //   ),
  //   // Pasted Content
  //   // prettier-ignore
  //   doc(
  //     '{<}',
  //     ul(
  //       li(p('foo')),
  //       li(p('bar')),
  //       li(p('baz{>}')),
  //     ),
  //   ),
  //   // Expected Document
  //   // prettier-ignore
  //   doc(
  //     ul(
  //       li(p('A')),
  //       li(p('foo')),
  //       li(p('bar')),
  //       li(
  //         p('baz3'),
  //         ul(
  //           li(p('B4')),
  //           ),
  //       ),
  //       li(p('C')),
  //     ),
  //   ),
  // ];

  // const caseY: [string, string, DocumentType, DocumentType, DocumentType] = [
  //   'destination is a selection across four levels of list item and last list item an extra unselected paragraph',
  //   'paste content is a bullet list',
  //   // Destination
  //   // prettier-ignore
  //   doc(
  //     ul(
  //       li(p('A')),
  //       li(
  //         p('{<}B'),
  //         ul(
  //           li(
  //             p('B1'),
  //             ul(
  //               li(
  //                 p('B2'),
  //                 ul(
  //                   li(
  //                     p('B3{>}'),
  //                     p('B4')
  //                   ),
  //                   li(p('B5')),
  //                 )
  //               ),
  //             ),
  //           ),
  //         ),
  //       ),
  //       li(p('C')),
  //     ),
  //   ),
  //   // Pasted Content
  //   // prettier-ignore
  //   doc(
  //     '{<}',
  //     ul(
  //       li(p('foo')),
  //       li(p('bar')),
  //       li(p('baz{>}')),
  //     ),
  //   ),
  //   // Expected Document
  //   // prettier-ignore
  //   doc(
  //     ul(
  //       li(p('A')),
  //       li(p('foo')),
  //       li(p('bar')),
  //       li(
  //         p('baz'),
  //         p('B4'),
  //         ul(
  //           li(p('B5')),
  //           ),
  //       ),
  //       li(p('C')),
  //     ),
  //   ),
  // ];

  const case17: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel node',
    'paste content is a paragraph, followed by a divider, then a list',
    // Destination
    // prettier-ignore
    doc(
      panel()(p('{<>}')),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      p('{<}hello'),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(p('')),
      p('hello'),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{<>}')),
      ),
    ),
  ];

  const case18: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel node, selection is a ghost selection caused by right clicking to paste which ends in the next node',
    'paste content is a paragraph, followed by a divider, then a list',
    // Destination
    // prettier-ignore
    doc(
      panel()(p('{<}')),
      p('{>}hello'),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      p('{<}hello'),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(p('hello')),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{<>}hello')),
      ),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
  ];

  const case19: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is the start of an empty paragraph after a divider and a list item, the selection is followed by empty paragraphs',
    'paste content is list item directly after a divider',
    // Destination
    // prettier-ignore
    doc(
      hr(),
      ul(
        li(p('A')),
      ),
      p(''),
      p('{<>}'),
      p(''),
      p(''),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      hr(),
      '{<}',
      ul(li(p('A{>}'))),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      hr(),
      ul(
        li(p('A')),
      ),
      p(''),
      ul(
        li(p('A{<>}')),
      ),
      p(''),
      p(''),
    ),
  ];

  const case20: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty list item at the end of a nested list, with an empty parent list item',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('X')),
        li(
          p(''),
          ul(
            li(p('Y')),
            li(p('{<>}'))
          )
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('X')),
        li(
          p(),
          ul(
            li(p('Y')),
            li(p('A')),
            li(p('B')),
            li(p('C')),
          )
        ),
      ),
    ),
  ];

  const case21: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel inside a table cell',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              ul(
                li(p('A')),
                li(p('B')),
                li(p('C{<>}'))
              ),
            )
          )
        )
      )
    ),
  ];

  const case22: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty expand inside a table cell',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('A'),
            ),
            ul(
              li(p('B')),
              li(p('C{<>}'))
            ),
          )
        )
      )
    ),
  ];

  const case23: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty expand',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      expand()(p('')),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        ul(
          li(p('A')),
          li(p('B')),
          li(p('C{<>}'))
        ),
      ),
    ),
  ];

  const case24: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel inside an expand',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      expand()(
        panel()(
          p('')
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        panel()(
          ul(
            li(p('A')),
            li(p('B')),
            li(p('C{<>}'))
          ),
        )
      ),
    ),
  ];

  const case25: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel inside a table cell',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              ul(
                li(
                  p('A'),
                  ul(
                    li(
                      p('B'),
                      ul(
                        li(p('C{<>}')),
                      ),
                    ),
                  ),
                ),
              ),
            )
          )
        )
      )
    ),
  ];

  const case26: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty expand inside a table cell',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('A'),
            ),
            ul(
              li(
                p('B'),
                ul(
                  li(
                    p('C{<>}'),
                  ),
                ),
              ),
            ),
          )
        )
      )
    ),
  ];

  const case27: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty expand',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      expand()(p('')),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        ul(
          li(
            p('A'),
            ul(
              li(
                p('B'),
                ul(
                  li(p('C{<>}')),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ];

  const case28: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel inside an expand',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      expand()(
        panel()(
          p('')
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        panel()(
          ul(
            li(
              p('A'),
              ul(
                li(
                  p('B'),
                  ul(
                    li(p('C{<>}')),
                  ),
                ),
              ),
            ),
          ),
        )
      ),
    ),
  ];

  const case29: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across two separate lists',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(
              p('{<}B1'),
              ol(
                li(p('B2')),
                li(p('B3')),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
      p(''),
      ul(
        li(p('foo{>}')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('the')),
        li(p('pasted')),
        li(p('list{>}')),
      )
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(p('the')),
            li(p('pasted')),
            li(p('list{<>}')),
          ),
        ),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
  ];

  const case30: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a selection across two separate lists',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(
              p('{<}B1'),
              ol(
                li(p('B2')),
                li(p('B3')),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
      p(''),
      ul(
        li(p('foo{>}')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('qux'),
          ul(
            li(
              p('quux'),
              ul(
                li(p('quuz{>}')),
              )
            ),
          ),
        ),
      )
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(
              p('qux'),
              ul(
                li(
                  p('quux'),
                  ul(
                    li(p('quuz{>}')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
  ];

  const case31: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is a nested list',
    'paste content contains two separate lists',
    // Destination
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('{<}B'),
          ol(
            li(
              p('B1'),
              ol(
                li(p('B2{>}')),
                li(p('B3')),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('qux'),
          ul(
            li(
              p('quux'),
              ul(
                li(p('quuz')),
              )
            ),
          ),
        ),
      ),
      p(''),
      ol(
        li(
          p('foo'),
          ol(li(p('bar')))
        ),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('qux'),
          ul(
            li(
              p('quux'),
              ul(
                li(p('quuz')),
              )
            ),
          ),
        ),
      ),
      p(''),
      ol(
        li(
          p('foo'),
          ol(li(p('bar')))
        ),
        li(
          p('baz'),
          ol(li(p('B3'))),
        ),
        li(p('{<>}C')),
      ),
    ),
  ];

  const case32: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty paragraph',
    'paste content is a nested list item across two levels',
    // Destination
    // prettier-ignore
    doc(
      p('{<>}'),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(
            li(
              p('bar'),
              ul(
                li(p('baz{>}')),
              )
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(
          p('bar'),
          ul(
            li(p('baz{<>}')),
          )
        ),
      ),
    ),
  ];

  const case33: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty paragraph',
    'paste content is a single nested list item',
    // Destination
    // prettier-ignore
    doc(
      p('{<>}'),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(
            li(
              p('bar{>}'),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(
          p('bar{<>}'),
        ),
      ),
    ),
  ];

  const case34: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty paragraph',
    'paste content is a single nested list item, which has a nested child',
    // Destination
    // prettier-ignore
    doc(
      p('{<>}'),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(
            li(
              p('bar{>}'),
              ul(
                li(
                  p('baz')
                )
              )
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(
          p('bar{<>}'),
        ),
      ),
    ),
  ];

  const case35: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel selected by node selection',
    'paste content is a single nested list item',
    // Destination
    // prettier-ignore
    doc(
      '{<node>}',
      panel()(p()),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(li(p('bar{>}'))),
        ),
        li(p('baz'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(
            p('bar{<>}'),
          ),
        ),
      )
    ),
  ];

  const case36: [string, string, DocumentType, DocumentType, DocumentType] = [
    'destination is an empty panel',
    'paste content is a single nested list item',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}'),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(li(p('bar{>}'))),
        ),
        li(p('baz'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(
            p('bar{<>}'),
          ),
        ),
      )
    ),
  ];

  describe.each<[string, string, DocumentType, DocumentType, DocumentType]>([
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
    case25,
    case26,
    case27,
    case28,
    case29,
    case30,
    case31,
    case32,
    case33,
    case34,
    case35,
    case36,
    // caseX & caseY to be turned on as part of https://product-fabric.atlassian.net/browse/ED-10942
  ])(
    '[case%#] when %s and %s',
    (
      _scenarioDest,
      _scenarioContent,
      destinationDocument,
      pasteContent,
      expectedDocument,
    ) => {
      it('should match the expected document and selection', () => {
        const destinationState = createEditorState(destinationDocument);
        const pasteOriginState = createEditorState(pasteContent);
        const pasteSlice = pasteOriginState.doc.slice(
          pasteOriginState.selection.from,
          pasteOriginState.selection.to,
          // @ts-ignore
          true,
        );
        const { tr } = destinationState;
        insertSlice({ tr, slice: Slice.maxOpen(pasteSlice.content, false) });
        expect(tr).toEqualDocumentAndSelection(expectedDocument(defaultSchema));
        expect(() => {
          tr.doc.check();
        }).not.toThrow();
      });
    },
  );
});
