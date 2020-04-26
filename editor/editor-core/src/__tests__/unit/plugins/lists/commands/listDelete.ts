import {
  doc,
  ul,
  li,
  p,
  code_block,
  createEditorFactory,
} from '@atlaskit/editor-test-helpers';
import { deleteKeyCommand } from '../../../../../plugins/lists/commands';
import { listDelete } from '../../../../../plugins/lists/commands/listDelete';

describe('deleteKeyCommand', () => {
  const createEditor = createEditorFactory();

  describe("when case isn't a list delete case", () => {
    it('should ignore when there is no next node', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}'))));
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when previous node is not in a list', () => {
      const unchangedDoc = doc(p('a{<>}'), ul(li(p('b'))));
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when next node is not in a paragraph', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}')), li(code_block()('b'))));
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when selection is not the last child of its parent', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}'), p('b')), li(p('c'))));
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when selection is not empty and at the end', () => {
      const unchangedDoc = doc(ul(li(p('a{<>}b')), li(p('c'))));
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 1', () => {
      const unchangedDoc = doc(
        ul(li(p('a'), p('b{<>}'))),
        code_block()('c'),
        code_block()('d'),
      );
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 2', () => {
      const unchangedDoc = doc(
        ul(li(p('a'), p('b{<>}')), li(code_block()('c'), code_block()('d'))),
      );
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 3', () => {
      const unchangedDoc = doc(
        ul(
          li(
            p('a'),
            ul(
              li(
                p('b'),
                p('c{<>}'),
                ul(li(code_block()('d'), code_block()('e'))),
              ),
            ),
          ),
        ),
      );
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for next node in case 4', () => {
      const unchangedDoc = doc(
        ul(
          li(p('a'), ul(li(p('b'), p('c{<>}')))),
          li(code_block()('d'), code_block()('e')),
        ),
      );
      const { editorView } = createEditor({ doc: unchangedDoc });
      const commandReturn = listDelete(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });
  });

  //Cases below refer to the cases found in this document: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1146954996/List+Backspace+and+Delete+Behaviour
  describe('when list delete case 1', () => {
    it('should lift an empty paragraph into an empty list item', () => {
      const initialDoc = doc(ul(li(p('{<>}'))), p(''));
      const expectedDoc = doc(ul(li(p('{<>}'))));

      const { editorView } = createEditor({ doc: initialDoc });

      deleteKeyCommand(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });

    it('should lift the paragraph into the list item', () => {
      const initialDoc = doc(
        ul(li(code_block()('a'), p('b{<>}'))),
        p('c'),
        p('d'),
      );
      const expectedDoc = doc(ul(li(code_block()('a'), p('b{<>}c'))), p('d'));

      const { editorView } = createEditor({ doc: initialDoc });

      deleteKeyCommand(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });
  });

  describe('when list delete case 2', () => {
    it('should lift the next listitem into the previous when they both have empty paragraphs', () => {
      const initialDoc = doc(ul(li(p('{<>}')), li(p(''))));
      const expectedDoc = doc(ul(li(p('{<>}'))));
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should lift the next listItem into the previous and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), p('b{<>}')),
          li(p('c'), code_block()('d'), ul(li(p('e')))),
        ),
        p('g'),
      );
      const expectedDoc = doc(
        ul(
          li(code_block()('a'), p('b{<>}c'), code_block()('d'), ul(li(p('e')))),
        ),
        p('g'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when list delete case 3', () => {
    it('should lift the indented listItem into the previous when they both have empty paragraphs', () => {
      const initialDoc = doc(ul(li(p('{<>}'), ul(li(p(''))))));
      const expectedDoc = doc(ul(li(p('{<>}'))));
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tested without children since this will trigger the deletion of the nested list while other tests won't
    it('should lift the indented listItem into the previous and keep siblings', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), p('b{<>}'), ul(li(p('c'), code_block()('d')))),
        ),
        p('e'),
      );
      const expectedDoc = doc(
        ul(li(code_block()('a'), p('b{<>}c'), code_block()('d'))),
        p('e'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children K are present but not Children J
    it('should lift the indented listItem into the previous and keep siblings / unindented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}'),
            ul(li(p('c'), code_block()('d')), li(p('e')), li(p('f'))),
          ),
        ),
        p('g'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}c'),
            code_block()('d'),
            ul(li(p('e')), li(p('f'))),
          ),
        ),
        p('g'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children J are present but not Children K
    it('should lift the indented listItem into the previous and keep siblings / indented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}'),
            ul(li(p('c'), code_block()('d'), ul(li(p('e')), li(p('f'))))),
          ),
        ),
        p('g'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}c'),
            code_block()('d'),
            ul(li(p('e')), li(p('f'))),
          ),
        ),
        p('g'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children K and J are present
    it('should lift the indented listItem into the previous and keep siblings / indented and unindented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}'),
            ul(
              li(p('c'), code_block()('d'), ul(li(p('e')), li(p('f')))),
              li(p('g')),
              li(p('h')),
            ),
          ),
        ),
        p('i'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b{<>}c'),
            code_block()('d'),
            ul(li(p('e')), li(p('f')), li(p('g')), li(p('h'))),
          ),
        ),
        p('i'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when list delete case 4', () => {
    it('should lift the unindented listItem into the previous when both contain blank paragraphs', () => {
      const initialDoc = doc(ul(li(p(''), ul(li(p('{<>}')))), li(p(''))));
      const expectedDoc = doc(ul(li(p(''), ul(li(p(''))))));
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children O is not present
    it('should lift the unindented listItem into the previous and keep siblings', () => {
      const initialDoc = doc(
        ul(
          li(p('a'), ul(li(code_block()('b'), p('c{<>}')))),
          li(p('d'), code_block()('e')),
        ),
        p('f'),
      );
      const expectedDoc = doc(
        ul(
          li(p('a'), ul(li(code_block()('b'), p('c{<>}d'), code_block()('e')))),
        ),
        p('f'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children O is present
    it('should lift the unindented listItem into the previous and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), ul(li(code_block()('b'), p('c{<>}')))),
          li(p('d'), code_block()('e'), ul(li(p('f')), li(p('g')))),
        ),
        p('h'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            ul(
              li(code_block()('b'), p('c{<>}d'), code_block()('e')),
              li(p('f')),
              li(p('g')),
            ),
          ),
        ),
        p('h'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where the nested list isn't just a single list (since we have to search for the paragraph inside the leaf list)
    it('should lift the unindented listItem into the previous when it is deeply nested and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            ul(
              li(p('b'), ul(li(p('c'), ul(li(code_block()('d'), p('e{<>}')))))),
            ),
          ),
          li(p('f'), code_block()('g'), ul(li(p('h')), li(p('i')))),
        ),
        p('j'),
      );
      const expectedDoc = doc(
        ul(
          li(
            code_block()('a'),
            ul(
              li(
                p('b'),
                ul(
                  li(
                    p('c'),
                    ul(li(code_block()('d'), p('e{<>}f'), code_block()('g'))),
                  ),
                ),
              ),
              li(p('h')),
              li(p('i')),
            ),
          ),
        ),
        p('j'),
      );
      const { editorView } = createEditor({ doc: initialDoc });
      deleteKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });
});
