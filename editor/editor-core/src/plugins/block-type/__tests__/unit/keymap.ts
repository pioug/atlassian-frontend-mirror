import {
  blockquote,
  code_block,
  doc,
  h1,
  hardBreak,
  mention,
  p,
  hr,
  ul,
  li,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import simulatePlatform, {
  Platforms,
} from '@atlaskit/editor-test-helpers/simulate-platform';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { setNodeSelection } from '../../../../utils';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import blockTypePlugin from '../../';
import analyticsPlugin from '../../../analytics';
import typeAheadPlugin from '../../../type-ahead';
import tablesPlugin from '../../../table';
import mentionsPlugin from '../../../mentions';
import rulePlugin from '../../../rule';
import codeBlockPlugin from '../../../code-block';
import listPlugin from '../../../list';

const codeBlockGASV3Payload = {
  action: 'formatted',
  actionSubject: 'text',
  eventType: 'track',
  actionSubjectId: 'blockQuote',
  attributes: expect.objectContaining({
    inputMethod: 'keyboard',
  }),
};

describe('codeBlock - keymaps', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const providerFactory = ProviderFactory.create({
      mentionProvider: new Promise(() => {}),
    });

    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(blockTypePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(tablesPlugin)
        .add(rulePlugin)
        .add(mentionsPlugin)
        .add(codeBlockPlugin)
        .add(listPlugin)
        .add(typeAheadPlugin),
      providerFactory,
    });
  };

  describe('keymap', () => {
    describe('when hits cmd-z', () => {
      it('should undo last autoformatting', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '# ', sel);
        expect(editorView.state.doc).toEqualDocument(doc(h1()));
        sendKeyToPm(editorView, 'Mod-z');
        expect(editorView.state.doc).toEqualDocument(doc(p('#')));
      });
    });

    describe('when hits up', () => {
      describe('when on a text block', () => {
        describe('when selection is not empty', () => {
          it('does not create a new paragraph above', () => {
            const { editorView } = editor(doc(code_block()('{<}te{>}xt')));

            sendKeyToPm(editorView, 'ArrowUp');

            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('text')),
            );
          });
        });

        describe('when selection is empty', () => {
          describe('on a non nested structure', () => {
            describe('inside a paragraph', () => {
              it('does not create a new paragraph above', () => {
                const { editorView } = editor(doc(p('{<>}text')));

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).toEqualDocument(doc(p('text')));
              });
            });

            describe('when cursor is in the middle of the first block node', () => {
              it('does not create a new paragraph above', () => {
                const { editorView } = editor(doc(code_block()('te{<>}xt')));

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).toEqualDocument(
                  doc(code_block()('text')),
                );
              });
            });

            describe('when cursor is at the beginning of the second block node', () => {
              it('does not create a new paragraph above', () => {
                const { editorView } = editor(
                  doc(p('text'), code_block()('{<>}text')),
                );

                sendKeyToPm(editorView, 'ArrowUp');

                expect(editorView.state.doc).toEqualDocument(
                  doc(p('text'), code_block()('text')),
                );
              });
            });

            describe('when cursor is at the beginning of the whole content', () => {
              describe('on non list items', () => {
                it('does not ignore @mention', () => {
                  const { editorView } = editor(
                    doc(p(mention({ id: 'foo1', text: '@bar1' })())),
                  );

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(mention({ id: 'foo1', text: '@bar1' })())),
                  );
                });
              });

              describe('list item', () => {
                it('creates a new paragraph below the ul', () => {
                  const { editorView } = editor(doc(ul(li(p('{<>}text')))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(''), ul(li(p('text')))),
                  );
                });
              });
            });
          });

          describe('on a nested structure', () => {
            describe('when cursor is at the beginning of the nested structure', () => {
              describe('when there is still content before the nested block', () => {
                it('does not create a new paragraph above', () => {
                  const { editorView } = editor(
                    doc(p('text'), blockquote(p('{<>}text'))),
                  );

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p('text'), blockquote(p('text'))),
                  );
                });
              });

              describe('when there is no more content before the nested block', () => {
                it('creates a new paragraph above', () => {
                  const { editorView } = editor(doc(blockquote(p('{<>}text'))));

                  sendKeyToPm(editorView, 'ArrowUp');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(p(''), blockquote(p('text'))),
                  );
                });
              });
            });
          });
        });
      });

      describe('when on a node selection', () => {
        describe('on a non nested structure', () => {
          describe('when selection is in the middle of the content', () => {
            it('does not create a paragraph', () => {
              const { editorView, sel } = editor(
                doc(p('text'), hr(), code_block()('{<>}text')),
              );
              setNodeSelection(editorView, sel - 1);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).toEqualDocument(
                doc(p('text'), hr(), code_block()('text')),
              );
            });
          });
        });

        describe('on a nested structure', () => {
          describe('when there is more content before the nested block', () => {
            it('does not create a paragraph', () => {
              const { editorView, sel } = editor(
                doc(p('text'), blockquote(p('text'), p('{<>}more text'))),
              );
              setNodeSelection(editorView, sel - 1);

              sendKeyToPm(editorView, 'ArrowUpv');

              expect(editorView.state.doc).toEqualDocument(
                doc(p('text'), blockquote(p('text'), p('more text'))),
              );
            });
          });

          describe('when there is no more content before the nested block', () => {
            it('creates a new paragraph above', () => {
              const { editorView } = editor(
                doc(blockquote(p('pre text'), p('{<>}text'))),
              );
              setNodeSelection(editorView, 1);

              sendKeyToPm(editorView, 'ArrowUp');

              expect(editorView.state.doc).toEqualDocument(
                doc(p(''), blockquote(p('pre text'), p('text'))),
              );
            });
          });
        });
      });
    });

    describe('when hits down', () => {
      describe('when on a text block', () => {
        describe('when selection is not empty', () => {
          it('does not create a new paragraph below', () => {
            const { editorView } = editor(doc(code_block()('te{<}xt{>}')));

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(code_block()('text')),
            );
          });
        });

        describe('when selection is empty', () => {
          describe('on a non nested structure', () => {
            describe('when cursor is in the middle of the first block node', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(doc(code_block()('te{<>}xt')));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(code_block()('text')),
                );
              });
            });

            describe('when cursor is at the end of the second last block node', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(
                  doc(code_block()('text{<>}'), p('text')),
                );

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(code_block()('text'), p('text')),
                );
              });
            });

            describe('when cursor is at the end of the whole content', () => {
              describe('non list item', () => {
                it('creates a new paragraph below', () => {
                  const { editorView } = editor(doc(code_block()('text{<>}')));

                  sendKeyToPm(editorView, 'ArrowDown');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(code_block()('text'), p('')),
                  );
                });
              });
              describe('list item', () => {
                it('creates a new paragraph below the ul', () => {
                  const { editorView } = editor(doc(ul(li(p('text{<>}')))));

                  sendKeyToPm(editorView, 'ArrowDown');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(ul(li(p('text'))), p('')),
                  );
                });
              });
              describe('nested list item', () => {
                it('creates a new paragraph below at depth 0', () => {
                  const { editorView } = editor(
                    doc(ul(li(p('text'), ul(li(p('text{<>}')))))),
                  );

                  sendKeyToPm(editorView, 'ArrowDown');

                  expect(editorView.state.doc).toEqualDocument(
                    doc(ul(li(p('text'), ul(li(p('text'))))), p('')),
                  );
                });
              });
            });

            describe('when cursor is in the last cell of the table', () => {
              const TABLE_LOCAL_ID = 'test-table-local-id';
              it('creates a new paragraph below the table', () => {
                const { editorView } = editor(
                  doc(
                    table({ localId: TABLE_LOCAL_ID })(
                      tr(tdEmpty, tdEmpty, tdCursor),
                    ),
                  ),
                );

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(
                    table({ localId: TABLE_LOCAL_ID })(
                      tr(tdEmpty, tdEmpty, tdEmpty),
                    ),
                    p(''),
                  ),
                );
              });
            });
          });
        });

        describe('on a nested structure', () => {
          describe('when cursor is at the end of the nested structure', () => {
            describe('when there is still content after the nested block', () => {
              it('does not create a new paragraph below', () => {
                const { editorView } = editor(
                  doc(blockquote(p('text{<>}')), p('text')),
                );

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(blockquote(p('text')), p('text')),
                );
              });
            });

            describe('when there is no more content before the nested block', () => {
              it('creates a new paragraph below', () => {
                const { editorView } = editor(doc(blockquote(p('text{<>}'))));

                sendKeyToPm(editorView, 'ArrowDown');

                expect(editorView.state.doc).toEqualDocument(
                  doc(blockquote(p('text')), p('')),
                );
              });
            });
          });
        });
      });
    });

    describe('when on a node selection', () => {
      describe('on a non nested structure', () => {
        describe('when selection is in the middle of the content', () => {
          it('does not create a paragraph', () => {
            const { editorView, sel } = editor(
              doc(p('text{<>}'), hr(), code_block()('text')),
            );
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(p('text'), hr(), code_block()('text')),
            );
          });
        });
      });

      describe('on a nested structure', () => {
        describe('when there is more content after the nested block', () => {
          it('does not create a paragraph', () => {
            const { editorView, sel } = editor(
              doc(blockquote(p(''), p('{<>}text')), p('text')),
            );
            setNodeSelection(editorView, sel - 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(blockquote(p(''), p('text')), p('text')),
            );
          });
        });

        describe('when there is no more content after the nested block', () => {
          it('creates a new paragraph below', () => {
            const { editorView, sel } = editor(
              doc(blockquote(p('text{<>}'), p(''))),
            );
            setNodeSelection(editorView, sel + 1);

            sendKeyToPm(editorView, 'ArrowDown');

            expect(editorView.state.doc).toEqualDocument(
              doc(blockquote(p('text'), p('')), p('')),
            );
          });
        });
      });
    });

    describe('when hits backspace', () => {
      it('should convert empty heading to paragraph', () => {
        const { editorView } = editor(doc(h1('{<>}')));
        sendKeyToPm(editorView, 'Backspace');
        expect(editorView.state.doc).toEqualDocument(doc(p('')));
      });

      it('should not convert heading with text to paragraph', () => {
        const { editorView } = editor(doc(h1('{<>}Content')));
        sendKeyToPm(editorView, 'Backspace');
        expect(editorView.state.doc).toEqualDocument(doc(h1('{<>}Content')));
      });
    });

    describe('when hits Shift-Enter', () => {
      let editorView: EditorView;

      beforeEach(() => {
        ({ editorView } = editor(doc(h1('t{<}ex{>}t'))));
        sendKeyToPm(editorView, 'Shift-Enter');
      });

      it('should insert hard-break', () => {
        expect(editorView.state.doc).toEqualDocument(
          doc(h1('t', hardBreak(), 't')),
        );
      });

      it('should insert multiple hard-breaks', () => {
        sendKeyToPm(editorView, 'Shift-Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(h1('t', hardBreak(), hardBreak(), 't')),
        );
      });

      it('moves selection along with hard-breaks', () => {
        const { editorView } = editor(doc(h1('t{<}ex{>}t')));
        const { from: initialFrom } = editorView.state.selection;

        // first line break
        sendKeyToPm(editorView, 'Shift-Enter');

        const { from: firstFrom, to: firstTo } = editorView.state.selection;
        expect(firstFrom).toEqual(firstTo);
        expect(firstFrom).toEqual(initialFrom + 1);

        // second line break
        sendKeyToPm(editorView, 'Shift-Enter');

        const { from: secondFrom, to: secondTo } = editorView.state.selection;

        expect(secondFrom).toEqual(secondTo);
        expect(secondFrom).toEqual(firstFrom + 1);
      });
    });

    describe('when on a Mac', () => {
      simulatePlatform(Platforms.Mac);

      describe('when hits Cmd-Alt-9', () => {
        let editorView: EditorView;
        beforeEach(() => {
          ({ editorView } = editor(doc(p('text'))));
          sendKeyToPm(editorView, 'Cmd-Alt-9');
        });

        it('should inserts blockquote', () => {
          expect(editorView.state.doc).toEqualDocument(
            doc(blockquote(p('text'))),
          );
        });

        it('should create analytics GAS V3 event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            codeBlockGASV3Payload,
          );
        });
      });

      describe('when blockquote nodetype is not in schema', () => {
        it('corresponding keymaps should not work', () => {
          const editor = (doc: DocBuilder) =>
            createEditor({
              doc,
              preset: new Preset<LightEditorPlugin>().add([
                blockTypePlugin,
                { allowBlockType: { exclude: ['blockquote'] } },
              ]),
            });
          const { editorView } = editor(doc(p('text')));
          sendKeyToPm(editorView, 'Cmd-Alt-9');

          expect(editorView.state.doc).toEqualDocument(doc(p('text')));
        });
      });
    });
  });
});
