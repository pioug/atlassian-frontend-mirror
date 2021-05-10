import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { doc, DocBuilder, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { createInputRulePlugin } from '../../plugin';

describe('input-tule/plugin/createInputRulePlugin', () => {
  let editorViewElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    editorViewElement = document.createElement('div');
    document.body.appendChild(editorViewElement);
  });

  function insertText(view: EditorView, text: string) {
    const { $from, $to } = view.state.selection;
    view.someProp('handleTextInput', f => f(view, $from.pos, $to.pos, text));
  }

  function createEditorView(lol: DocBuilder, customInputRule: Plugin) {
    const editorState = createEditorState(lol, customInputRule);

    return new EditorView(editorViewElement, {
      state: editorState,
    });
  }

  describe('inline code transformation: ', () => {
    let handlerMock: jest.Mock;
    let editorView: EditorView;

    beforeEach(() => {
      handlerMock = jest.fn().mockImplementation((state: EditorState) => {
        return state.tr;
      });

      const INLINE_CODE_REGEX = /(\S*)(`[^\s][^`]*`)$/;
      const myCustomInputRule = createInputRulePlugin(
        'lol',
        [
          {
            match: INLINE_CODE_REGEX,
            handler: handlerMock,
          },
        ],
        {
          allowInsertTextOnDocument: true,
        },
      );

      editorView = createEditorView(
        doc(p('here `some{<} words{>}')),
        myCustomInputRule,
      );
    });

    describe('when the handler is called', () => {
      describe('during the textInput flow', () => {
        it('should call the handler only once', () => {
          jest.spyOn(editorView, 'dispatch').mockImplementation(tr => {});
          insertText(editorView, '`');

          expect(handlerMock).toHaveBeenCalledTimes(1);
        });

        it('should send the editor state without the inserted text', () => {
          insertText(editorView, '`');
          const nextEditorState = createEditorState(doc(p('here `some words')));

          const [argEditorState] = handlerMock.mock.calls[0];

          expect(argEditorState.doc.toJSON()).toEqual(
            nextEditorState.doc.toJSON(),
          );
        });
      });

      describe('after the appendTransaction flow', () => {
        it('should call the handler only twice', () => {
          insertText(editorView, '`');

          expect(handlerMock).toHaveBeenCalledTimes(2);
        });

        it('should send the editor state with the inserted text', () => {
          insertText(editorView, '`');
          const nextEditorState = createEditorState(doc(p('here `some`')));

          const [argEditorState] = handlerMock.mock.calls[1];

          expect(argEditorState.doc.toJSON()).toEqual(
            nextEditorState.doc.toJSON(),
          );
        });
      });
    });
  });

  describe('code block node: ', () => {
    let handlerMock: jest.Mock;
    let editorView: EditorView;

    beforeEach(() => {
      handlerMock = jest.fn().mockImplementation((state: EditorState) => {
        return state.tr;
      });

      const CODE_BLOCK_REGEX = /(?!\s)(`{3,})/;
      const myCustomInputRule = createInputRulePlugin(
        'lol',
        [
          {
            match: CODE_BLOCK_REGEX,
            handler: handlerMock,
          },
        ],
        {
          allowInsertTextOnDocument: true,
        },
      );

      editorView = createEditorView(doc(p('here {<>}')), myCustomInputRule);
    });

    describe('when the handler is called', () => {
      describe('during the textInput flow', () => {
        it('should call the handler only once', () => {
          jest.spyOn(editorView, 'dispatch').mockImplementation(tr => {});
          insertText(editorView, '```');

          expect(handlerMock).toHaveBeenCalledTimes(1);
        });

        it('should send the editor state without the inserted text', () => {
          insertText(editorView, '```');

          const nextEditorState = createEditorState(doc(p('here ')));

          const [argEditorState] = handlerMock.mock.calls[0];

          expect(argEditorState.doc.toJSON()).toEqual(
            nextEditorState.doc.toJSON(),
          );
        });
      });

      describe('after the appendTransaction flow', () => {
        it('should call the handler only twice', () => {
          insertText(editorView, '```');

          expect(handlerMock).toHaveBeenCalledTimes(2);
        });

        it('should send the editor state with the inserted text', () => {
          insertText(editorView, '```');

          const nextEditorState = createEditorState(doc(p('here ```')));

          const [argEditorState] = handlerMock.mock.calls[1];

          expect(argEditorState.doc.toJSON()).toEqual(
            nextEditorState.doc.toJSON(),
          );
        });
      });
    });
  });
});
