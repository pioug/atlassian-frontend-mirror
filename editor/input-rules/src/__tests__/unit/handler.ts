import { EditorState, PluginKey, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { code_block, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { createInputEventHandler } from '../../handler';
import type { HandleInputEvent, InputRuleWrapper } from '../../types';

describe('input-tule/handles/createInputEventHandler', () => {
  let inputEvent: HandleInputEvent;
  let editorView: EditorView;
  let dispatchSpy: jest.SpyInstance<void, [Transaction]>;
  let rules: InputRuleWrapper[] = [];
  let initialEditorState: EditorState;
  let RULE_BEFORE: InputRuleWrapper;

  type FROM_TYPE = number;
  type TO_TYPE = number;
  let ruleHandlerMock: jest.Mock<
    Transaction | null,
    [EditorState, RegExpExecArray, FROM_TYPE, TO_TYPE]
  >;

  const pluginKey = new PluginKey('lol');
  const TEXT_INSERTED = 'a';

  beforeEach(() => {
    initialEditorState = createEditorState(doc(p('before{<>}')));
    editorView = new EditorView(undefined, {
      state: initialEditorState,
    });

    dispatchSpy = jest.spyOn(editorView, 'dispatch');

    ruleHandlerMock = jest.fn().mockImplementation(state => {
      return state.tr;
    });

    RULE_BEFORE = {
      match: /^(before).*/,
      handler: ruleHandlerMock,
    };
  });

  afterEach(() => {
    dispatchSpy.mockReset();
    rules = [];
  });

  describe('when selection is inside of code node', () => {
    let inputHandleResult: boolean;
    beforeEach(() => {
      const newEditorState = createEditorState(doc(code_block()('before{<>}')));
      editorView = new EditorView(undefined, {
        state: newEditorState,
      });

      dispatchSpy = jest.spyOn(editorView, 'dispatch');

      const {
        selection: { from, to },
      } = newEditorState;

      inputEvent = createInputEventHandler({
        rules,
        pluginKey,
        allowInsertTextOnDocument: true,
      });

      inputHandleResult = inputEvent({
        view: editorView,
        from,
        to,
        text: TEXT_INSERTED,
      });
    });

    it('should return false', () => {
      expect(inputHandleResult).toBeFalsy();
    });

    it('should not call the editorView dispatch function', () => {
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('when there is no rule match', () => {
    let inputHandleResult: boolean;
    beforeEach(() => {
      const RULE_AFTER = {
        match: /^(after).*/,
        handler: jest.fn().mockImplementation(state => {
          return state.tr;
        }),
      };

      rules = [RULE_AFTER];

      const {
        selection: { from, to },
      } = initialEditorState;

      inputEvent = createInputEventHandler({
        rules,
        pluginKey,
        allowInsertTextOnDocument: true,
      });

      inputHandleResult = inputEvent({
        view: editorView,
        from,
        to,
        text: TEXT_INSERTED,
      });
    });

    it('should return false', () => {
      expect(inputHandleResult).toBeFalsy();
    });

    it('should not call the editorView dispatch function', () => {
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('when there is rule match', () => {
    beforeEach(() => {
      rules = [RULE_BEFORE];
    });

    describe.each([true, false])(
      'and when allowInsertTextOnDocument is %s',
      allowInsertTextOnDocument => {
        beforeEach(() => {
          const {
            selection: { from, to },
          } = initialEditorState;

          inputEvent = createInputEventHandler({
            rules,
            pluginKey,
            allowInsertTextOnDocument,
          });

          inputEvent({
            view: editorView,
            from,
            to,
            text: TEXT_INSERTED,
          });
        });

        it('should call the dispatch function', () => {
          expect(editorView.dispatch).toHaveBeenCalled();
        });

        it('should call the rule handler function', () => {
          expect(RULE_BEFORE.handler).toHaveBeenCalled();
        });

        it('should add the InputRulePluginState inside of the transaction', () => {
          const tr = dispatchSpy.mock.calls[0][0];

          expect(tr.getMeta(pluginKey)).toBeDefined();
        });

        it('should fill InputRulePluginState', () => {
          const tr = dispatchSpy.mock.calls[0][0];

          expect(tr.getMeta(pluginKey)).toEqual({
            from: 1,
            to: 7,
            textInserted: TEXT_INSERTED,
            matchedRule: {
              ...RULE_BEFORE,
              result: expect.any(Array),
            },
          });
        });

        it('should return true', () => {
          const {
            selection: { from, to },
          } = initialEditorState;

          inputEvent = createInputEventHandler({
            rules,
            pluginKey,
            allowInsertTextOnDocument: true,
          });

          const result = inputEvent({
            view: editorView,
            from,
            to,
            text: TEXT_INSERTED,
          });

          expect(result).toBeTruthy();
        });

        it('should call the rule handler with the from position calculated', () => {
          const handlerArgs = ruleHandlerMock.mock.calls[0];
          const fromArg: number = handlerArgs[2];

          expect(fromArg).toBe(1);
        });

        describe('when onBeforeRegexMatch is given', () => {
          let onBeforeRegexMatchMock: jest.Mock;

          beforeEach(() => {
            onBeforeRegexMatchMock = jest.fn();
            const {
              selection: { from, to },
            } = initialEditorState;

            inputEvent = createInputEventHandler({
              rules,
              pluginKey,
              allowInsertTextOnDocument,
              onBeforeRegexMatch: onBeforeRegexMatchMock,
            });

            inputEvent({
              view: editorView,
              from,
              to,
              text: TEXT_INSERTED,
            });
          });

          it('should be called', () => {
            expect(onBeforeRegexMatchMock).toHaveBeenCalled();
          });
        });

        describe('and when onInputEvent return false', () => {
          let inputHandleResult: boolean;
          let onInputEventMock: jest.Mock;

          beforeEach(() => {
            dispatchSpy.mockReset();
            onInputEventMock = jest.fn().mockReturnValue(false);

            const {
              selection: { from, to },
            } = initialEditorState;

            inputEvent = createInputEventHandler({
              rules,
              pluginKey,
              allowInsertTextOnDocument,
              onInputEvent: onInputEventMock,
            });

            inputHandleResult = inputEvent({
              view: editorView,
              from,
              to,
              text: TEXT_INSERTED,
            });
          });

          it('should return false', () => {
            expect(inputHandleResult).toBeFalsy();
          });

          it('should call onInputEvent', () => {
            expect(onInputEventMock).toHaveBeenCalled();
          });

          it('should not call the editorView dispatch function', () => {
            expect(dispatchSpy).not.toHaveBeenCalled();
          });
        });
      },
    );

    describe('and when allowInsertTextOnDocument is true', () => {
      beforeEach(() => {
        const {
          selection: { from, to },
        } = editorView.state;

        inputEvent = createInputEventHandler({
          rules,
          pluginKey,
          allowInsertTextOnDocument: true,
        });

        inputEvent({
          view: editorView,
          from,
          to,
          text: TEXT_INSERTED,
        });
      });

      it('should dispatch a transaction with the text inserted', () => {
        const tr = dispatchSpy.mock.calls[0][0];

        const { doc: docExpected } = createEditorState(
          doc(p(`before${TEXT_INSERTED}`)),
        );

        expect(tr.doc.toJSON()).toEqual(docExpected.toJSON());
      });

      it('should call the rule handler with the original document', () => {
        const handlerArgs = ruleHandlerMock.mock.calls[0];
        const nextEditorState: EditorState = handlerArgs[0];

        const { doc: docExpected } = createEditorState(doc(p(`before`)));

        expect(nextEditorState.doc.toJSON()).toEqual(docExpected.toJSON());
      });

      it('should call the rule handler with the same to position', () => {
        const handlerArgs = ruleHandlerMock.mock.calls[0];
        const {
          selection: { to },
        } = initialEditorState;

        expect(handlerArgs).toEqual([
          expect.any(EditorState),
          expect.any(Array),
          expect.any(Number),
          to,
        ]);
      });
    });

    describe('and when allowInsertTextOnDocument is false', () => {
      beforeEach(() => {
        const {
          selection: { from, to },
        } = editorView.state;

        inputEvent = createInputEventHandler({
          rules,
          pluginKey,
          allowInsertTextOnDocument: false,
        });

        inputEvent({
          view: editorView,
          from,
          to,
          text: TEXT_INSERTED,
        });
      });

      it('should call the rule handler using the current editor state', () => {
        const handlerArgs = ruleHandlerMock.mock.calls[0];
        const nextEditorState: EditorState = handlerArgs[0];

        expect(nextEditorState).toBe(initialEditorState);
      });

      it('should call the rule handler without the text length at the end position', () => {
        const handlerArgs = ruleHandlerMock.mock.calls[0];
        const {
          selection: { to },
        } = initialEditorState;

        expect(handlerArgs).toEqual([
          expect.any(EditorState),
          expect.any(Array),
          expect.any(Number),
          to,
        ]);
      });

      it('should dispatch a transaction without', () => {
        const tr = dispatchSpy.mock.calls[0][0];

        const { doc: docExpected } = createEditorState(doc(p(`before`)));

        expect(tr.doc.toJSON()).toEqual(docExpected.toJSON());
      });
    });
  });
});
