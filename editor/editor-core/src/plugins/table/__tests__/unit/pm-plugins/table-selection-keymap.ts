import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { EditorView } from 'prosemirror-view';
import { PluginKey } from 'prosemirror-state';

import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tr,
  td,
  p,
  panel,
  code_block as codeBlock,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { uuid } from '@atlaskit/adf-schema';

import selectionPlugin from '../../../../selection';
import panelPlugin from '../../../../panel';
import codeBlockPlugin from '../../../../code-block';
import tablePlugin from '../../../index';
import { TablePluginState } from '../../../types';
import { pluginKey } from '../../../pm-plugins/plugin-factory';

const TABLE_LOCAL_ID = 'test-table-local-id';
describe('table selection keymap', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createProsemirrorEditorFactory();
  const preset = new Preset<LightEditorPlugin>()
    .add(selectionPlugin)
    .add(tablePlugin)
    .add(panelPlugin)
    .add(codeBlockPlugin);

  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey>({
      doc,
      preset,
      pluginKey,
    });

  const selectTable = (anchorCell: number, headCell: number) => {
    const cellSelection = CellSelection.create(
      editorView.state.doc,
      anchorCell,
      headCell,
    );
    editorView.dispatch(editorView.state.tr.setSelection(cellSelection as any));
    expect(editorView.state.selection).toBeInstanceOf(CellSelection);
  };

  let editorView: EditorView;
  let refs: { [ref: string]: number };

  describe('Arrow right keypress', () => {
    describe('from left side gap cursor selection', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            '{<gap|>}',
            table()(
              tr(td()(p('1')), td()(p('2')), td()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
            ),
          ),
        ));
        sendKeyToPm(editorView, 'ArrowRight');
      });

      it('sets cell selection for whole table when user hits right arrow', () => {
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p('{cell>}1')), td()(p('2')), td()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6{<cell}'))),
            ),
          ),
        );
      });

      describe('to text selection', () => {
        it('sets selection at start of first cell when user hits right arrow twice', () => {
          ({ editorView } = editor(
            doc(
              '{<gap|>}',
              table()(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowRight');
          sendKeyToPm(editorView, 'ArrowRight');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('{<>}1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });
      });

      describe('to gap cursor selection', () => {
        it('sets left-side gap cursor selection at start of first cell when user hits right arrow twice', () => {
          ({ editorView } = editor(
            doc(
              '{<gap|>}',
              table()(
                tr(td()(panel()(p('1'))), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowRight');
          sendKeyToPm(editorView, 'ArrowRight');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td()('{<gap|>}', panel()(p('1'))),
                  td()(p('2')),
                  td()(p('3')),
                ),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });
      });
    });

    describe('from last position of last cell', () => {
      describe('for text selection', () => {
        beforeEach(() => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6{<>}'))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowRight');
        });

        it('sets cell selection for whole table when user hits right arrow', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('{<cell}1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6{cell>}'))),
              ),
            ),
          );
        });

        it('sets right side gap cursor when user hits right arrow twice', () => {
          sendKeyToPm(editorView, 'ArrowRight');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
              '{<|gap>}',
            ),
          );
        });
      });

      describe('for text selection inside child node', () => {
        it("doesn't set cell selection for whole table when user hits right arrow", () => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(codeBlock()('6{<>}'))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowRight');

          expect(editorView.state.selection).not.toBeInstanceOf(CellSelection);
        });
      });

      describe('for node selection', () => {
        it('sets right side gap cursor on node when user hits right arrow', () => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()('{<node>}', panel()(p()))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowRight');

          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(panel()(p()), '{<|gap>}')),
              ),
            ),
          );
        });
      });

      describe('for gap cursor selection', () => {
        beforeEach(() => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(
                  td()(p('4')),
                  td()(p('5')),
                  td()(panel()(p('6')), '{<|gap>}'),
                ),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowRight');
        });

        it('sets cell selection for whole table when user hits right arrow', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('{<cell}1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(panel()(p('6{cell>}')))),
              ),
            ),
          );
        });

        it('sets right side gap cursor when user hits right arrow twice', () => {
          sendKeyToPm(editorView, 'ArrowRight');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(panel()(p('6')))),
              ),
              '{<|gap>}',
            ),
          );
        });
      });
    });

    describe('after clicking table controls to select whole table', () => {
      it('sets right side gap cursor when user hits right arrow', () => {
        ({ editorView, refs } = editor(
          doc(
            table()(
              tr('{firstCell}', td()(p('1')), td()(p('2')), td()(p('3'))),
              tr(td()(p('4')), td()(p('5')), '{lastCell}', td()(p('6'))),
            ),
          ),
        ));
        selectTable(refs.lastCell, refs.firstCell);
        sendKeyToPm(editorView, 'ArrowRight');

        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p('1')), td()(p('2')), td()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
            ),
            '{<|gap>}',
          ),
        );
      });
    });
  });

  describe('Arrow left keypress', () => {
    describe('from right side gap cursor selection', () => {
      beforeEach(() => {
        ({ editorView } = editor(
          doc(
            table()(
              tr(td()(p('1')), td()(p('2')), td()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6'))),
            ),
            '{<|gap>}',
          ),
        ));
        sendKeyToPm(editorView, 'ArrowLeft');
      });

      it('sets cell selection for whole table when user hits left arrow', () => {
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(p('{<cell}1')), td()(p('2')), td()(p('3'))),
              tr(td()(p('4')), td()(p('5')), td()(p('6{cell>}'))),
            ),
          ),
        );
      });

      describe('to text selection', () => {
        it('sets selection at end of last cell when user hits left arrow twice', () => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
              '{<|gap>}',
            ),
          ));
          sendKeyToPm(editorView, 'ArrowLeft');
          sendKeyToPm(editorView, 'ArrowLeft');

          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6{<>}'))),
              ),
            ),
          );
        });
      });

      describe('to gap cursor selection', () => {
        it('sets right-side gap cursor selection at end of last cell when user hits left arrow twice', () => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(panel()(p('6')))),
              ),
              '{<|gap>}',
            ),
          ));
          sendKeyToPm(editorView, 'ArrowLeft');
          sendKeyToPm(editorView, 'ArrowLeft');

          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(
                  td()(p('4')),
                  td()(p('5')),
                  td()(panel()(p('6')), '{<|gap>}'),
                ),
              ),
            ),
          );
        });
      });
    });

    describe('from start position of first cell', () => {
      describe('for text selection', () => {
        beforeEach(() => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(p('{<>}1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowLeft');
        });

        it('sets cell selection for whole table when user hits left arrow', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('{cell>}1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6{<cell}'))),
              ),
            ),
          );
        });

        it('sets left side gap cursor when user hits left arrow twice', () => {
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              '{<gap|>}',
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });
      });

      describe('for text selection inside child node', () => {
        it("doesn't set cell selection for whole table when user hits left arrow", () => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(td()(codeBlock()('{<>}1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowLeft');

          expect(editorView.state.selection).not.toBeInstanceOf(CellSelection);
        });
      });

      describe('for gap cursor selection', () => {
        beforeEach(() => {
          ({ editorView } = editor(
            doc(
              table()(
                tr(
                  td()('{<gap|>}', panel()(p('1'))),
                  td()(p('2')),
                  td()(p('3')),
                ),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          ));
          sendKeyToPm(editorView, 'ArrowLeft');
        });

        it('sets cell selection for whole table when user hits left arrow', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(panel()(p('{cell>}1'))), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6{<cell}'))),
              ),
            ),
          );
        });

        it('sets left side gap cursor when user hits left arrow twice', () => {
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              '{<gap|>}',
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(panel()(p('1'))), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });
      });
    });

    describe('after clicking table controls to select whole table', () => {
      describe('for table containing text in first cell', () => {
        beforeEach(() => {
          ({ editorView, refs } = editor(
            doc(
              table()(
                tr('{firstCell}', td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), '{lastCell}', td()(p('6'))),
              ),
            ),
          ));
          selectTable(refs.lastCell, refs.firstCell);
          sendKeyToPm(editorView, 'ArrowLeft');
        });

        it('sets selection at start of first cell when user hits left arrow', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('{<>}1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });

        it('sets left side gap cursor when user hits left arrow twice', () => {
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              '{<gap|>}',
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(p('1')), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });
      });

      describe('for table containing node in first cell', () => {
        beforeEach(() => {
          ({ editorView, refs } = editor(
            doc(
              table()(
                tr(
                  '{firstCell}',
                  td()(panel()(p('1'))),
                  td()(p('2')),
                  td()(p('3')),
                ),
                tr(td()(p('4')), td()(p('5')), '{lastCell}', td()(p('6'))),
              ),
            ),
          ));
          selectTable(refs.lastCell, refs.firstCell);
          sendKeyToPm(editorView, 'ArrowLeft');
        });

        it('sets selection at start of first cell when user hits left arrow', () => {
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td()('{<gap|>}', panel()(p('1'))),
                  td()(p('2')),
                  td()(p('3')),
                ),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });

        it('sets left side gap cursor when user hits left arrow twice', () => {
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(editorView.state).toEqualDocumentAndSelection(
            doc(
              '{<gap|>}',
              table({ localId: TABLE_LOCAL_ID })(
                tr(td()(panel()(p('1'))), td()(p('2')), td()(p('3'))),
                tr(td()(p('4')), td()(p('5')), td()(p('6'))),
              ),
            ),
          );
        });
      });
    });
  });
});
