import { browser } from '@atlaskit/editor-common';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  strike,
  strong,
  em,
  underline,
  code,
  p,
  subsup,
  mention,
  code_block,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  TextFormattingState,
  pluginKey as textFormattingPluginKey,
} from '../../../../plugins/text-formatting/pm-plugins/main';
import * as commands from '../../../../plugins/text-formatting/commands/text-formatting';
import { anyMarkActive } from '../../../../plugins/text-formatting/utils';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
  ACTION_SUBJECT_ID,
} from '../../../../plugins/analytics';

describe('text-formatting', () => {
  const createEditor = createEditorFactory<TextFormattingState>();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({
      fire() {},
    });
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        mentionProvider: new Promise(() => {}),
      },
      createAnalyticsEvent: createAnalyticsEvent,
      pluginKey: textFormattingPluginKey,
    });
  };

  describe('plugin', () => {
    it('should disable smart autocompletion if option given', () => {
      const { editorView, sel } = createEditor({
        doc: doc(p('{<>}')),
        editorProps: { textFormatting: { disableSmartTextCompletion: true } },
      });
      insertText(editorView, '-- ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('-- ')));
    });

    it('should enable smart autocompletion by default', () => {
      const { editorView, sel } = createEditor({ doc: doc(p('{<>}')) });
      insertText(editorView, '-- ', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('– ')));
    });
  });

  describe('keymap', () => {
    if (browser.mac) {
      describe('when on a mac', () => {
        describe('when hits Cmd-B', () => {
          it('toggles bold mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-b');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strong('text'))),
            );
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        describe('when hits Cmd-I', () => {
          it('toggles italic mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-i');

            expect(editorView.state.doc).toEqualDocument(doc(p(em('text'))));
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        describe('when hits Cmd-U', () => {
          it('toggles underline mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Cmd-u');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(underline('text'))),
            );
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        /*
         Node: Here dispatch key 'Shift-Cmd-S' instead of 'Cmd-Shift-S',
         Because after key binding, it was normalized.
         */
        describe('when hits Shift-Cmd-S', () => {
          it('toggles strikethrough mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Cmd-S');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strike('text'))),
            );
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        describe('when hits Shift-Cmd-M', () => {
          it('toggles code mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(
              doc(
                p(
                  strong('{<}text '),
                  mention({ id: '1234', text: '@helga' })(),
                  em(' text{>}'),
                ),
              ),
            );

            sendKeyToPm(editorView, 'Shift-Cmd-M');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(code('text @helga text'))),
            );
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });
      });
    } else {
      describe('when not on a mac', () => {
        describe('when hits Ctrl-B', () => {
          it('toggles bold mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-b');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strong('text'))),
            );
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        describe('when hits Ctrl-I', () => {
          it('toggles italic mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-i');

            expect(editorView.state.doc).toEqualDocument(doc(p(em('text'))));
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        describe('when hits Ctrl-U', () => {
          it('toggles underline mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Ctrl-u');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(underline('text'))),
            );
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        /*
         Node: Here dispatch key 'Shift-Ctrl-S' instead of 'Ctrl-Shift-S',
         Because after key binding, it was normalized.
         */
        describe('when hits Shift-Ctrl-S', () => {
          it('toggles strikethrough mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Ctrl-S');

            expect(editorView.state.doc).toEqualDocument(
              doc(p(strike('text'))),
            );
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });

        describe('when hits Shift-Ctrl-M', () => {
          it('toggles code mark', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.SHORTCUT,
              }),
            };
            const { editorView } = editor(doc(p('{<}text{>}')));

            sendKeyToPm(editorView, 'Shift-Ctrl-M');

            expect(editorView.state.doc).toEqualDocument(doc(p(code('text'))));
            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });
        });
      });
    }
    describe('inline code rule', () => {
      it('should convert when "``" is entered followed by a character in it', () => {
        const expectedPayload: AnalyticsEventPayload = {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
          eventType: EVENT_TYPE.TRACK,
          attributes: expect.objectContaining({
            inputMethod: INPUT_METHOD.FORMATTING,
          }),
        };
        const { editorView, sel } = editor(doc(p('`{<>}`')));
        insertText(editorView, 'c', sel);
        expect(editorView.state.doc).toEqualDocument(doc(p(code('c'))));
        expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
      });

      it('should not convert when "``" followed by a character in it is entered in a code block', () => {
        const { editorView, sel } = editor(doc(code_block()('`{<>}`')));
        insertText(editorView, 'c', sel);
        expect(editorView.state.doc).toEqualDocument(doc(code_block()('`c`')));
      });
    });
  });

  describe('code', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };

      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleCodeWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to toggle code on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(code('t'), 'ext')));
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether code is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(code('some{<>}code'))));
      expect(pluginState.codeActive).toBe(true);
    });

    it('should expose whether code is active on a text selection', () => {
      const { pluginState } = editor(doc(p(code('t{<}e{>}xt'))));
      expect(pluginState.codeActive).toBe(true);
    });

    it('exposes code as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.codeDisabled).toBe(true);
    });

    it('exposes code as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.codeDisabled).toBe(false);
    });

    it('should disable underline when code is active', () => {
      const { pluginState } = editor(doc(p(code('t{<}e{>}xt'))));
      expect(pluginState.underlineDisabled).toBe(true);
      expect(pluginState.codeActive).toBe(true);
    });

    it('should convert smart characters to normal ascii', () => {
      const { editorView } = editor(doc(p('{<}… → ← – “ ” ‘ ’{>}')));
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(code('... -> <- -- " " \' \''))),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p('... -> <- -- " " \' \'')),
      );
    });

    it('should convert smart characters to normal ascii in the middle of a paragraph', () => {
      const { editorView } = editor(
        doc(p(''), p('{<}hello … → ← – “ ” ‘ ’ world{>}')),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(''), p(code('hello ... -> <- -- " " \' \' world'))),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(''), p('hello ... -> <- -- " " \' \' world')),
      );
    });

    it('should convert smart characters to normal ascii in the middle of a paragraph and way down the document', () => {
      const { editorView } = editor(
        doc(p(''), p(''), p(''), p(''), p('{<}hello … → ← – “ ” ‘ ’ world{>}')),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(''),
          p(''),
          p(''),
          p(''),
          p(code('hello ... -> <- -- " " \' \' world')),
        ),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(''),
          p(''),
          p(''),
          p(''),
          p('hello ... -> <- -- " " \' \' world'),
        ),
      );
    });

    it('should convert smart characters to normal ascii in the middle of a word', () => {
      const { editorView } = editor(
        doc(p(''), p(''), p('he{<}llo … → ← – “ ” ‘ ’ wor{>}ld')),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(''),
          p(''),
          p('he', code('llo ... -> <- -- " " \' \' wor'), 'ld'),
        ),
      );
      expect(commands.toggleCode()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(''), p(''), p('hello ... -> <- -- " " \' \' world')),
      );
    });
  });

  describe('em', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };

      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleEmWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to toggle em on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleEm()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(em('t'), 'ext')));
      expect(commands.toggleEm()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether em is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(em('te{<>}xt'))));
      expect(pluginState.emActive).toBe(true);
    });

    it('should expose whether em is active on a text selection', () => {
      const { pluginState } = editor(doc(p(em('t{<}e{>}xt'))));
      expect(pluginState.emActive).toBe(true);
    });

    it('exposes em as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.emDisabled).toBe(true);
    });

    it('exposes em as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.emDisabled).toBe(false);
    });
  });

  describe('strong', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };

      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleStrongWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to toggle strong on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleStrong()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(strong('t'), 'ext')));
      expect(commands.toggleStrong()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether strong is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(strong('te{<>}xt'))));
      expect(pluginState.strongActive).toBe(true);
    });

    it('should expose whether strong is active on a text selection', () => {
      const { pluginState } = editor(doc(p(strong('t{<}e{>}xt'))));
      expect(pluginState.strongActive).toBe(true);
    });

    it('exposes strong as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.strongDisabled).toBe(true);
    });

    it('exposes strong as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.strongDisabled).toBe(false);
    });
  });

  describe('underline', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };
      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleUnderlineWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to toggle underline on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleUnderline()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(underline('t'), 'ext')),
      );
      expect(commands.toggleUnderline()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether underline is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(underline('te{<>}xt'))));
      expect(pluginState.underlineActive).toBe(true);
    });

    it('should expose whether underline is active on a text selection', () => {
      const { pluginState } = editor(doc(p(underline('t{<}e{>}xt'))));
      expect(pluginState.underlineActive).toBe(true);
    });

    it('exposes underline as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.underlineDisabled).toBe(true);
    });

    it('exposes underline as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.underlineDisabled).toBe(false);
    });
  });

  describe('strike', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };
      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleStrikeWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to toggle strike on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleStrike()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p(strike('t'), 'ext')));
      expect(commands.toggleStrike()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether strike is active on an empty selection', () => {
      const { pluginState } = editor(doc(p(strike('te{<>}xt'))));
      expect(pluginState.strikeActive).toBe(true);
    });

    it('should expose whether strike is active on a text selection', () => {
      const { pluginState } = editor(doc(p(strike('t{<}e{>}xt'))));
      expect(pluginState.strikeActive).toBe(true);
    });

    it('exposes strike as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.strikeDisabled).toBe(true);
    });

    it('exposes strike as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.strikeDisabled).toBe(false);
    });
  });

  describe('subscript', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_SUB,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };
      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleSubscriptWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to toggle subscript on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      expect(commands.toggleSubscript()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sub' })('t'), 'ext')),
      );
      expect(commands.toggleSubscript()(editorView.state, editorView.dispatch));
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether subcript is active on an empty selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('te{<>}xt'))),
      );
      expect(pluginState.subscriptActive).toBe(true);
    });

    it('should expose whether subcript is active on a text selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('t{<}e{>}xt'))),
      );
      expect(pluginState.subscriptActive).toBe(true);
    });

    it('exposes subcript as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.subscriptDisabled).toBe(true);
    });

    it('exposes subcript as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.subscriptDisabled).toBe(false);
    });

    it('deactives superscript if subscript is already active at empty selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('te{<>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(false);
    });

    it('deactives superscript if subscript is already active at selected text', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sub' })('t{<}e{>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(false);
    });
  });

  describe('superscript', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_SUPER,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };
      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleSuperscriptWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    it('should be able to toggle superscript on a character', () => {
      const { editorView } = editor(doc(p('{<}t{>}ext')));
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(subsup({ type: 'sup' })('t'), 'ext')),
      );
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should expose whether superscript is active on an empty selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sup' })('te{<>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(true);
    });

    it('should expose whether superscript is active on a text selection', () => {
      const { pluginState } = editor(
        doc(p(subsup({ type: 'sup' })('t{<}e{>}xt'))),
      );
      expect(pluginState.superscriptActive).toBe(true);
    });

    it('exposes superscript as disabled when the mark cannot be applied', () => {
      const { pluginState } = editor(doc(code_block()('te{<>}xt')));
      expect(pluginState.superscriptDisabled).toBe(true);
    });

    it('exposes superscript as not disabled when the mark can be applied', () => {
      const { pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.superscriptDisabled).toBe(false);
    });

    it('deactives subscript after toggling superscript for an empty selection', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));
      commands.toggleSubscript()(editorView.state, editorView.dispatch);
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(pluginState.subscriptActive).toBe(false);
    });

    it('deactives subscript after toggling superscript for selected text', () => {
      const { editorView, pluginState } = editor(doc(p('t{<}e{>}xt')));
      commands.toggleSubscript()(editorView.state, editorView.dispatch);
      commands.toggleSuperscript()(editorView.state, editorView.dispatch);
      expect(pluginState.subscriptActive).toBe(false);
    });

    it('deactives strong, em, strike if selected text is inside code mark', () => {
      const { pluginState } = editor(doc(p(code('t{<}e{>}xt'))));
      expect(pluginState.strongDisabled).toBe(true);
      expect(pluginState.emDisabled).toBe(true);
      expect(pluginState.strikeDisabled).toBe(true);
    });
  });

  describe('code', () => {
    it('should dispatch analytics event', () => {
      const inputMethod = INPUT_METHOD.TOOLBAR;
      const expectedPayload: AnalyticsEventPayload = {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
        eventType: EVENT_TYPE.TRACK,
        attributes: expect.objectContaining({
          inputMethod,
        }),
      };
      const { editorView } = editor(doc(p('{<}t{>}ext')));

      commands.toggleCodeWithAnalytics({ inputMethod })(
        editorView.state,
        editorView.dispatch,
      );

      expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
    });

    describe('when the cursor is right after the code mark', () => {
      it('should not be able to delete character with "Backspace" without entering into mark editing mode', () => {
        const { editorView, pluginState } = editor(doc(p(code('hell{<}o{>}'))));
        sendKeyToPm(editorView, 'Backspace');
        expect(pluginState.codeActive).toEqual(true);
      });
    });
    describe('when two code nodes separated with one non-code character', () => {
      describe('when moving between two code nodes with ArrowLeft', () => {
        it('should disable code for the first node and then enable for the second node', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{nextPos}'), 'x', code('h{<>}ello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when exiting code with ArrowRight', () => {
      describe('when code is the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{<>}'), '{nextPos}')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the last node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{<>}'), '{nextPos}text')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('x{<>}'), '{nextPos}text')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when exiting code with ArrowLeft', () => {
      describe('when code is the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('{nextPos}', code('{<>}hello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the first node', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{nextPos}', code('h{<>}ello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should disable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{nextPos}', code('x{<>}'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when entering code with ArrowRight', () => {
      describe('when code is the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('{<>}', code('{nextPos}hello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the first node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{<>}', code('{nextPos}hello'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p('text{<>}', code('{nextPos}x'))),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });

    describe('when entering code with ArrowLeft', () => {
      describe('when code is the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{nextPos}'), '{<>}')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          sendKeyToPm(editorView, 'ArrowRight');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code is not the last node', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('hello{nextPos}'), 't{<>}ext')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
      describe('when code has only one character long', () => {
        it('should enable code and preserve the cursor position', () => {
          const { editorView, refs } = editor(
            doc(p(code('x{nextPos}'), 't{<>}ext')),
          );
          const { code: codeMark } = editorView.state.schema.marks;
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(false);
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(anyMarkActive(editorView.state, codeMark)).toEqual(true);
          expect(editorView.state.selection.$from.pos).toEqual(refs.nextPos);
        });
      });
    });
  });
});
