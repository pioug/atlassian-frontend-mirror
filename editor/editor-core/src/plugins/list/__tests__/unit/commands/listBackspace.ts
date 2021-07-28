import {
  doc,
  ul,
  li,
  p,
  code_block,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { backspaceKeyCommand } from '../../../commands';
import { listBackspace } from '../../../commands/listBackspace';
import listPlugin from '../../..';
import codeBlockPlugin from '../../../../code-block';

describe('backspaceKeyCommand', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPlugin)
      .add(codeBlockPlugin);

    return createEditor({
      doc,
      preset,
    });
  };

  describe("when case isn't a list backspace case", () => {
    it('should ignore when there is no previous node', () => {
      const unchangedDoc = doc(ul(li(p('{<>}a'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when previous node is not in a list', () => {
      const unchangedDoc = doc(p('a'), ul(li(p('{<>}b'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when selection is not in a paragraph', () => {
      const unchangedDoc = doc(ul(li(p('a')), li(code_block()('{<>}b'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when selection is not the first child of its parent', () => {
      const unchangedDoc = doc(ul(li(p('a')), li(p('b'), p('{<>}c'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when selection is not empty and at the start', () => {
      const unchangedDoc = doc(ul(li(p('a')), li(p('b{<>}c'))));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    //Case 1 is already handled, this test case may need to be changed if listBackspace will eventually recognise case 1
    it('should ignore when selection is not in a list', () => {
      const unchangedDoc = doc(ul(li(p('a'))), p('{<>}b'));
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for previous node in case 1', () => {
      const unchangedDoc = doc(
        ul(li(p('a'), code_block()('b'))),
        p('{<>}c'),
        code_block()('d'),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for previous node in case 2', () => {
      const unchangedDoc = doc(
        ul(li(p('a'), code_block()('b')), li(p('{<>}c'), code_block()('d'))),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for previous node in case 3', () => {
      const unchangedDoc = doc(
        ul(
          li(
            p('a'),
            ul(
              li(
                p('b'),
                code_block()('c'),
                ul(li(p('{<>}d'), code_block()('e'))),
              ),
            ),
          ),
        ),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });

    it('should ignore when paragraph not present for previous node in case 4', () => {
      const unchangedDoc = doc(
        ul(
          li(p('a'), ul(li(p('b'), code_block()('c')))),
          li(p('{<>}d'), code_block()('e')),
        ),
      );
      const { editorView } = editor(unchangedDoc);
      const commandReturn = listBackspace(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state).toEqualDocumentAndSelection(unchangedDoc);
      expect(commandReturn).toBeFalsy();
    });
  });

  //Cases below refer to the cases found in this document: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1146954996/List+Backspace+and+Delete+Behaviour
  describe('when list backspace case 1', () => {
    it('should lift an empty paragrpah into an empty list item', () => {
      const initialDoc = doc(ul(li(p(''))), p('{<>}'));
      const expectedDoc = doc(ul(li(p('{<>}'))));

      const { editorView } = editor(initialDoc);

      backspaceKeyCommand(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });

    it('should lift the paragraph into the list item', () => {
      const initialDoc = doc(
        ul(li(code_block()('a'), p('b'))),
        p('{<>}c'),
        p('d'),
      );
      const expectedDoc = doc(ul(li(code_block()('a'), p('b{<>}c'))), p('d'));

      const { editorView } = editor(initialDoc);

      backspaceKeyCommand(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });
  });

  describe('when list backspace case 2', () => {
    it('should lift the next listitem into the previous when they both have empty paragraphs', () => {
      const initialDoc = doc(ul(li(p('')), li(p('{<>}'))));
      const expectedDoc = doc(ul(li(p('{<>}'))));
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    it('should lift the next listItem into the previous and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), p('b')),
          li(p('{<>}c'), code_block()('d'), ul(li(p('e')))),
        ),
        p('g'),
      );
      const expectedDoc = doc(
        ul(
          li(code_block()('a'), p('b{<>}c'), code_block()('d'), ul(li(p('e')))),
        ),
        p('g'),
      );
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when list backspace case 3', () => {
    it('should lift the indented listItem into the previous when they both have empty paragraphs', () => {
      const initialDoc = doc(ul(li(p(''), ul(li(p('{<>}'))))));
      const expectedDoc = doc(ul(li(p('{<>}'))));
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tested without children since this will trigger the deletion of the nested list while other tests won't
    it('should lift the indented listItem into the previous and keep siblings', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), p('b'), ul(li(p('{<>}c'), code_block()('d')))),
        ),
        p('e'),
      );
      const expectedDoc = doc(
        ul(li(code_block()('a'), p('b{<>}c'), code_block()('d'))),
        p('e'),
      );
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children K are present but not Children J
    it('should lift the indented listItem into the previous and keep siblings / unindented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b'),
            ul(li(p('{<>}c'), code_block()('d')), li(p('e')), li(p('f'))),
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
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children J are present but not Children K
    it('should lift the indented listItem into the previous and keep siblings / indented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b'),
            ul(li(p('{<>}c'), code_block()('d'), ul(li(p('e')), li(p('f'))))),
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
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children K and J are present
    it('should lift the indented listItem into the previous and keep siblings / indented and unindented children', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            p('b'),
            ul(
              li(p('{<>}c'), code_block()('d'), ul(li(p('e')), li(p('f')))),
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
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });

  describe('when list backspace case 4', () => {
    it('should lift the unindented listItem into the previous when both contain blank paragraphs', () => {
      const initialDoc = doc(ul(li(p(''), ul(li(p('')))), li(p('{<>}'))));
      const expectedDoc = doc(ul(li(p(''), ul(li(p(''))))));
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children O is not present
    it('should lift the unindented listItem into the previous and keep siblings', () => {
      const initialDoc = doc(
        ul(
          li(p('a'), ul(li(code_block()('b'), p('c')))),
          li(p('{<>}d'), code_block()('e')),
        ),
        p('f'),
      );
      const expectedDoc = doc(
        ul(
          li(p('a'), ul(li(code_block()('b'), p('c{<>}d'), code_block()('e')))),
        ),
        p('f'),
      );
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where Children O is present
    it('should lift the unindented listItem into the previous and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(code_block()('a'), ul(li(code_block()('b'), p('c')))),
          li(p('{<>}d'), code_block()('e'), ul(li(p('f')), li(p('g')))),
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
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });

    //Tests case where the nested list isn't just a single list (since we have to search for the paragraph inside the leaf list)
    it('should lift the unindented listItem into the previous when it is deeply nested and keep siblings / children with the same indentation', () => {
      const initialDoc = doc(
        ul(
          li(
            code_block()('a'),
            ul(li(p('b'), ul(li(p('c'), ul(li(code_block()('d'), p('e'))))))),
          ),
          li(p('{<>}f'), code_block()('g'), ul(li(p('h')), li(p('i')))),
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
      const { editorView } = editor(initialDoc);
      backspaceKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
    });
  });
});
