import {
  doc,
  p,
  code_block,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { AllSelection } from 'prosemirror-state';
import analyticsPlugin, {
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  INDENT_DIRECTION,
  INDENT_TYPE,
} from '../../../analytics';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import basePlugin from '../../../base';
import codeBlockPlugin from '../../';

const createIndentationAttributes = (
  previousIndentationLevel: number,
  newIndentLevel: number,
) =>
  expect.objectContaining({
    attributes: expect.objectContaining({
      newIndentLevel,
      previousIndentationLevel,
    }),
  });

describe('IDE UX plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: jest.Mock<UIAnalyticsEvent>;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(basePlugin)
        .add(codeBlockPlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }]),
    });
  };

  describe('Select-All', () => {
    describe('when cursor inside code-block', () => {
      it('should select all text inside code-block when Cmd+A pressed', () => {
        const {
          editorView,
          refs: { start, end },
        } = editor(
          doc(p('start'), code_block()('{start}mid{<>}dle{end}'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        const { from, to } = editorView.state.selection;
        expect(from).toBe(start);
        expect(to).toBe(end);
      });
    });
    describe('when selection inside code-block', () => {
      it('should select all text inside code-block when Cmd+A pressed', () => {
        const {
          editorView,
          refs: { start, end },
        } = editor(
          doc(p('start'), code_block()('{start}{<}mid{>}dle{end}'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        const { from, to } = editorView.state.selection;
        expect(from).toBe(start);
        expect(to).toBe(end);
      });
    });

    describe('when starts inside code-block and finished outside', () => {
      it('should select whole document when Cmd+A pressed', () => {
        const { editorView } = editor(
          doc(p('start'), code_block()('mid{<}dle'), p('en{>}d')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        expect(editorView.state.selection).toBeInstanceOf(AllSelection);
      });
    });

    describe('when selection starts outside code-block and finishes inside', () => {
      it('should select whole document when Cmd+A pressed', () => {
        const { editorView } = editor(
          doc(p('start{<}'), code_block()('mid{>}dle'), p('end')),
        );
        sendKeyToPm(editorView, 'Mod-a');
        expect(editorView.state.selection).toBeInstanceOf(AllSelection);
      });
    });
  });

  describe('Indentation', () => {
    describe('Mod-] pressed', () => {
      describe('when cursor on line', () => {
        it('should create Analytics GAS v3 event', () => {
          const expectedPayload: AnalyticsEventPayload = {
            action: ACTION.FORMATTED,
            actionSubject: ACTION_SUBJECT.TEXT,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
            eventType: EVENT_TYPE.TRACK,
            attributes: expect.objectContaining({
              inputMethod: INPUT_METHOD.KEYBOARD,
              direction: INDENT_DIRECTION.INDENT,
              previousIndentationLevel: 0,
              newIndentLevel: 1,
              indentType: INDENT_TYPE.CODE_BLOCK,
            }),
          };
          const { editorView } = editor(
            doc(code_block()('top\n{<>}start\nbottom')),
          );

          sendKeyToPm(editorView, 'Mod-]');

          expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
        });

        it('should not expand selection to include added indent', () => {
          const { editorView } = editor(
            doc(code_block()('top\n{<>}start\nbottom')),
          );
          sendKeyToPm(editorView, 'Mod-]');
          expect(editorView.state.selection.empty).toBe(true);
          expect(editorView.state.selection.from).toBe(7);
        });

        describe('and line starts with spaces', () => {
          it('should indent by 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
          it('should indent by 1 space when odd number of spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>} start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should indent by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t{<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\t\tstart\nbottom')),
            );
          });

          it('should indent by a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t {<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\t\t start\nbottom')),
            );
          });
        });
      });

      describe('when selection is across multiple lines', () => {
        it('should create multiple Analytics GAS v3 event', () => {
          const firstExpectedIndentation = createIndentationAttributes(0, 1);
          const secondsExpectedIndentation = createIndentationAttributes(2, 3);
          const thirdExpectedIndentation = createIndentationAttributes(1, 2);

          const { editorView } = editor(
            doc(code_block()('t{<}op\n    start\n  bot{>}tom')),
          );

          createAnalyticsEvent.mockClear();
          sendKeyToPm(editorView, 'Mod-]');

          expect(createAnalyticsEvent).toHaveBeenCalledTimes(3);
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            firstExpectedIndentation,
          );
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            secondsExpectedIndentation,
          );
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            thirdExpectedIndentation,
          );
        });

        it('should expand selection to include added indent', () => {
          const { editorView } = editor(
            doc(code_block()('\n{<}top\nstart\nbott{>}om\n')),
          );
          sendKeyToPm(editorView, 'Mod-]');
          expect(editorView.state.selection.empty).toBe(false);
          expect(editorView.state.selection.from).toBe(2);
          expect(editorView.state.selection.to).toBe(22);
        });

        describe('and line starts with spaces', () => {
          it('should indent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('\nto{<}p\nstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n  top\n  start\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('  to{<}p\nstart\n    bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('    top\n  start\n      bottom')),
            );
          });

          it('should indent lines with odd indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\nstart\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\n  start\n    bottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should indent selected lines by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\n\tto{<}p\n\tstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n\t\ttop\n\t\tstart\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\tto{<}p\nstart\n\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-]');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ttop\n  start\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not indent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Mod-]');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('to'), p('end')),
          );
        });
      });
    });

    describe('Mod-[ pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should create Analytics GAS v3 event', () => {
            const expectedPayload: AnalyticsEventPayload = {
              action: ACTION.FORMATTED,
              actionSubject: ACTION_SUBJECT.TEXT,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
              eventType: EVENT_TYPE.TRACK,
              attributes: expect.objectContaining({
                inputMethod: INPUT_METHOD.KEYBOARD,
                direction: INDENT_DIRECTION.OUTDENT,
                previousIndentationLevel: 1,
                newIndentLevel: 0,
                indentType: INDENT_TYPE.CODE_BLOCK,
              }),
            };
            const { editorView } = editor(
              doc(code_block()('top\n  {<>}start\nbottom')),
            );

            sendKeyToPm(editorView, 'Mod-[');

            expect(createAnalyticsEvent).toHaveBeenCalledWith(expectedPayload);
          });

          it('should unindent by 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}  start\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should only unindent by 1 space when odd number of spaces and Mod-[ pressed', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}   start\nend')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nend')),
            );
          });

          it('should do nothing when no indentation on line and Mod-[ pressed', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nend')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n{<>}start\nend')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should unindent by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\tsta{<>}rt\nbottom')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should unindent by a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t sta{<>}rt\nend')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n start\nend')),
            );
          });
        });
      });
      describe('when selection is across multiple lines', () => {
        it('should create multiple Analytics GAS v3 event', () => {
          const firstExpectedIndentation = createIndentationAttributes(2, 1);
          const secondsExpectedIndentation = createIndentationAttributes(1, 0);

          const { editorView } = editor(
            doc(code_block()('t{<}op\n    start\n  bot{>}tom')),
          );

          createAnalyticsEvent.mockClear();
          sendKeyToPm(editorView, 'Mod-[');

          expect(createAnalyticsEvent).toHaveBeenCalledTimes(2);
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            firstExpectedIndentation,
          );
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            secondsExpectedIndentation,
          );
        });

        describe('and line starts with spaces', () => {
          it('should unindent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('  \n  to{<}p\n  start\n  bott{>}om\n  ')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  \ntop\nstart\nbottom\n  ')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('    to{<}p\n  start\n      bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\nstart\n    bottom')),
            );
          });

          it('should unindent lines with odd indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\n  start\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\n  bottom')),
            );
          });
        });
        describe('and line starts with tabs', () => {
          it('should unindent only selected lines by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\t\n\tto{<}p\n\tstart\n\tbott{>}om\n\t')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ntop\nstart\nbottom\n\t')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\t\tto{<}p\n\tstart\n\t\t\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Mod-[');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\ttop\nstart\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not unindent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}  to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Mod-[');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('  to'), p('end')),
          );
        });
      });
    });

    describe('Tab pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should insert 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
          it('should insert 1 space when odd number of character in line to cursor', () => {
            const { editorView } = editor(
              doc(code_block()('top\n {<>}start\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nbottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should insert a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\tst{<>}art\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\tst\tart\nbottom')),
            );
          });

          it('should insert a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t start {<>}\nbottom')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n\t start \t\nbottom')),
            );
          });
        });
      });

      describe('when selection is across multiple lines', () => {
        describe('and line starts with spaces', () => {
          it('should indent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('\nto{<}p\nstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n  top\n  start\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('  to{<}p\nstart\n    bott{>}om')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('    top\n  start\n      bottom')),
            );
          });

          it('should indent lines with odd indentation levels when', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\nstart\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\n  start\n    bottom')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should indent selected lines by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\n\tto{<}p\n\tstart\nbott{>}om\n')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\n\t\ttop\n\t\tstart\n  bottom\n')),
            );
          });

          it('should indent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\tto{<}p\nstart\n\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ttop\n  start\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not indent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Tab');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('to'), p('end')),
          );
        });
      });
    });

    describe('Shift-Tab pressed', () => {
      describe('when cursor on line', () => {
        describe('and line starts with spaces', () => {
          it('should unindent by 2 spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}  start\nbottom')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should only unindent by 1 space when odd number of spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}   start\nend')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n  start\nend')),
            );
          });

          it('should do nothing when no indentation on line', () => {
            const { editorView } = editor(
              doc(code_block()('top\n{<>}start\nend')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n{<>}start\nend')),
            );
          });
        });

        describe('and line starts with tabs', () => {
          it('should unindent by a tab', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\tsta{<>}rt\nbottom')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\nbottom')),
            );
          });

          it('should unindent by a tab when line also has spaces', () => {
            const { editorView } = editor(
              doc(code_block()('top\n\t sta{<>}rt\nend')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\n start\nend')),
            );
          });
        });
      });
      describe('when selection is across multiple lines', () => {
        describe('and line starts with spaces', () => {
          it('should unindent only selected lines by two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('  \n  to{<}p\n  start\n  bott{>}om\n  ')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  \ntop\nstart\nbottom\n  ')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('    to{<}p\n  start\n      bott{>}om')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  top\nstart\n    bottom')),
            );
          });

          it('should unindent lines with odd indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()(' to{<}p\n  start\n   bott{>}om')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('top\nstart\n  bottom')),
            );
          });
        });
        describe('and line starts with tabs', () => {
          it('should unindent only selected lines a tab', () => {
            const { editorView } = editor(
              doc(code_block()('\t\n\tto{<}p\n\tstart\n\tbott{>}om\n\t')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\t\ntop\nstart\nbottom\n\t')),
            );
          });

          it('should unindent lines with different indentation levels', () => {
            const { editorView } = editor(
              doc(code_block()('\t\tto{<}p\n\tstart\n\t\t\tbott{>}om')),
            );
            sendKeyToPm(editorView, 'Shift-Tab');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\ttop\nstart\n\t\tbottom')),
            );
          });
        });
      });

      describe('when selection goes outside the code-block', () => {
        it('should not unindent text', () => {
          const { editorView } = editor(
            doc(code_block()('{<}  to'), p('end{>}')),
          );
          sendKeyToPm(editorView, 'Shift-Tab');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('  to'), p('end')),
          );
        });
      });
    });

    describe('Enter pressed', () => {
      describe('when line starts with spaces', () => {
        it('should maintain indentation of the current line', () => {
          const { editorView } = editor(
            doc(code_block()('top\n  start{<>}\nbottom')),
          );
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('top\n  start\n  \nbottom')),
          );
        });
      });
      describe('when line starts with tabs', () => {
        it('should maintain indentation of the current line', () => {
          const { editorView } = editor(
            doc(code_block()('top\n\t\tstart{<>}\nbottom')),
          );
          sendKeyToPm(editorView, 'Enter');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('top\n\t\tstart\n\t\t\nbottom')),
          );
        });
      });
    });

    describe('Backspace pressed', () => {
      describe('when cursor on line', () => {
        describe('and next to leading indentation', () => {
          it('should remove two spaces when indentation ends with two spaces', () => {
            const { editorView } = editor(
              doc(code_block()('    {<>}start middle end')),
            );
            sendKeyToPm(editorView, 'Backspace');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  start middle end')),
            );
          });
          it('should only remove one space when indentation has odd number of preceding tokens', () => {
            const { editorView } = editor(
              doc(code_block()('   {<>}start middle end')),
            );
            sendKeyToPm(editorView, 'Backspace');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('  start middle end')),
            );
          });
          it('should remove tab when indentation ends with tab', () => {
            const { editorView } = editor(
              doc(code_block()('\t\t{<>}start middle end')),
            );
            sendKeyToPm(editorView, 'Backspace');
            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('\tstart middle end')),
            );
          });
        });
        it('should fallback to the default Backspace when in the middle of a line', () => {
          const { editorView } = editor(
            doc(code_block()('  start mid  {<>}dle end')),
          );
          sendKeyToPm(editorView, 'Backspace');
          // Document doesn't change since PM doesn't handle backspace itself.
          // It normally relies on the content-editable to change
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('  start mid  dle end')),
          );
        });
      });
      describe('when selection is across multiple lines', () => {
        it('should fallback to the default Backspace behaviour', () => {
          const { editorView } = editor(
            doc(code_block()('  {<} start\n  {>}end')),
          );
          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('  end')),
          );
        });
      });
    });
  });

  describe('Auto-closing Brackets', () => {
    [
      { left: '{', right: '}' },
      { left: '[', right: ']' },
      { left: '(', right: ')' },
    ].forEach(({ left, right }) => {
      describe(`when inserting '${left}'`, () => {
        it(`should insert a matching closing bracket '${right}'`, () => {
          const { editorView, sel } = editor(doc(code_block()('{<>}')));
          insertText(editorView, left, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`${left}${right}`)),
          );
          expect(editorView.state.selection.from).toBe(sel + 1);
        });
        it(`should insert a matching closing bracket '${right}' even when a '${right}' already exists`, () => {
          const { editorView, sel } = editor(doc(code_block()(`{<>}${right}`)));
          insertText(editorView, left, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`${left}${right}${right}`)),
          );
          expect(editorView.state.selection.from).toBe(sel + 1);
        });
      });
      describe(`when cursor in between '${left}' and '${right}'`, () => {
        it(`should only move the cursor when '${right}' inserted`, () => {
          const { editorView, sel } = editor(
            doc(code_block()(`${left}{<>}${right}`)),
          );
          insertText(editorView, right, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`${left}${right}`)),
          );
          expect(editorView.state.selection.from).toBe(sel + 1);
        });
        const nonMatchingBracket = right === '}' ? ']' : '}';
        it(`should insert non-matching closing bracket when '${nonMatchingBracket}' inserted`, () => {
          const { editorView, sel } = editor(
            doc(code_block()(`${left}{<>}${right}`)),
          );
          insertText(editorView, nonMatchingBracket, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`${left}${nonMatchingBracket}${right}`)),
          );
          expect(editorView.state.selection.from).toBe(sel + 1);
        });
        it('should remove the bracket pair when backspace pressed', () => {
          const { editorView, sel } = editor(
            doc(code_block()(`${left}{<>}${right}`)),
          );
          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(code_block()('')));
          expect(editorView.state.selection.from).toBe(sel - 1);
        });
      });
      describe(`when cursor in between multiple '${left}' and '${right}'`, () => {
        it(`should only move the cursor when '${right}' inserted`, () => {
          const { editorView, sel } = editor(
            doc(code_block()(`${left}${left}{<>}${right}${right}`)),
          );
          sendKeyToPm(editorView, 'Backspace');
          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.doc).toEqualDocument(doc(code_block()('')));
          expect(editorView.state.selection.from).toBe(sel - 2);
        });
      });
    });
  });
});
