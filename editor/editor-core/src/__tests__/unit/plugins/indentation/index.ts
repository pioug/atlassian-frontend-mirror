import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  h1,
  blockquote,
  indentation,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

import * as indentationCommands from '../../../../plugins/indentation/commands';
import {
  getPrevIndentLevel,
  PrevAttributes,
  NewAttributes,
  getNewIndentLevel,
} from '../../../../plugins/indentation/commands/utils';

const { indent, outdent } = indentationCommands;

describe('indentation', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowTextAlignment: true,
        allowIndentation: true,
      },
    });

  describe('indent', () => {
    it('indents a top level paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}')));
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(p('hello'))),
      );
    });

    it('indents only the current paragraph', () => {
      const { editorView } = editor(doc(p('hello{<>}'), p('world')));
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(p('hello')), p('world')),
      );
    });

    it('indents a top level heading', () => {
      const { editorView } = editor(doc(h1('hello{<>}')));
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 1 })(h1('hello'))),
      );
    });

    it('indents multiple blocks', () => {
      const { editorView } = editor(
        doc(p('{<}hello'), blockquote(p('hello')), p('world{>}')),
      );
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          indentation({ level: 1 })(p('hello')),
          blockquote(p('hello')),
          indentation({ level: 1 })(p('world')),
        ),
      );
    });

    it('should not indent more than 6 levels', () => {
      const { editorView } = editor(
        doc(indentation({ level: 6 })(p('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      indent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 6 })(p('hello'))),
      );
    });
  });

  describe('outdent', () => {
    it('outdents a top level paragraph', () => {
      const { editorView } = editor(
        doc(indentation({ level: 3 })(p('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 2 })(p('hello'))),
      );
    });

    it('outdents only the current paragraph', () => {
      const { editorView } = editor(
        doc(indentation({ level: 3 })(p('hello{<>}')), p('world')),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 2 })(p('hello')), p('world')),
      );
    });

    it('outdents a top level heading', () => {
      const { editorView } = editor(
        doc(indentation({ level: 3 })(h1('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(indentation({ level: 2 })(h1('hello'))),
      );
    });

    it('outdents multiple blocks', () => {
      const { editorView } = editor(
        doc(
          indentation({ level: 2 })(p('{<}hello')),
          blockquote(p('hello')),
          indentation({ level: 3 })(p('world{>}')),
        ),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          indentation({ level: 1 })(p('hello')),
          blockquote(p('hello')),
          indentation({ level: 2 })(p('world')),
        ),
      );
    });

    it('should remove the marks when is at level 1', () => {
      const { editorView } = editor(
        doc(indentation({ level: 1 })(p('hello{<>}'))),
      );
      const { dispatch, state } = editorView;
      outdent(state, dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
    });
  });

  describe('keymap', () => {
    it('calls indent command on Tab', () => {
      const indentMock = jest.fn();
      jest.spyOn(indentationCommands, 'indent').mockImplementation(indentMock);
      const { editorView } = editor(doc(p('{<>}')));

      expect(indentMock).toHaveBeenCalledTimes(0);
      sendKeyToPm(editorView, 'Tab');
      expect(indentMock).toHaveBeenCalledTimes(1);
    });

    it('calls outdent command on Shift + Tab', () => {
      const outdentMock = jest.fn();
      jest
        .spyOn(indentationCommands, 'outdent')
        .mockImplementation(outdentMock);
      const { editorView } = editor(doc(p('{<>}')));

      expect(outdentMock).toHaveBeenCalledTimes(0);
      sendKeyToPm(editorView, 'Shift-Tab');
      expect(outdentMock).toHaveBeenCalledTimes(1);
    });

    it('calls outdent command on Backspace at the start of node', () => {
      const outdentMock = jest.fn();
      jest
        .spyOn(indentationCommands, 'outdent')
        .mockImplementation(outdentMock);
      const { editorView } = editor(doc(p('{<>}hello')));

      expect(outdentMock).toHaveBeenCalledTimes(0);
      sendKeyToPm(editorView, 'Backspace');
      expect(outdentMock).toHaveBeenCalledTimes(1);
    });

    it('should not call outdent command on Backspace if not at the start of node', () => {
      const outdentMock = jest.fn();
      jest
        .spyOn(indentationCommands, 'outdent')
        .mockImplementation(outdentMock);
      const { editorView } = editor(doc(p('h{<>}ello')));

      expect(outdentMock).toHaveBeenCalledTimes(0);
      sendKeyToPm(editorView, 'Backspace');
      expect(outdentMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('getPrevIndentLevel', () => {
    const testCases: [PrevAttributes, number][] = [
      [{ level: 1 }, 1],
      [undefined, 0],
    ];

    test.each(testCases)(
      'getPrevIndentLevel(%p, %p) should equal %p',
      (prevAttr: PrevAttributes, expectedResult: number) => {
        expect(getPrevIndentLevel(prevAttr)).toEqual(expectedResult);
      },
    );
  });

  describe('getNewIndentLevel', () => {
    const testCases: [PrevAttributes, NewAttributes, number][] = [
      [{ level: 1 }, { level: 1 }, 1],
      [{ level: 1 }, undefined, 1],
      [{ level: 1 }, false, 0],
      [undefined, { level: 1 }, 1],
      [undefined, undefined, 0],
      [undefined, false, 0],
    ];

    test.each(testCases)(
      'getNewIndentLevel(%p, %p) should equal %p',
      (
        prevAttr: PrevAttributes,
        newAttr: NewAttributes,
        expectedResult: number,
      ) => {
        expect(getNewIndentLevel(prevAttr, newAttr)).toEqual(expectedResult);
      },
    );
  });
});
