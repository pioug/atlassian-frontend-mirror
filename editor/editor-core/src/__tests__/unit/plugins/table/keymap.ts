import { TableMap, CellSelection } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import {
  selectRow,
  selectColumn,
  selectTable,
  findTable,
} from 'prosemirror-utils';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  thCursor,
  tr,
  td,
  tdEmpty,
  tdCursor,
  thEmpty,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { pmNodeBuilder } from '@atlaskit/editor-test-helpers/schema-element-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

import { TablePluginState } from '../../../../plugins/table/types';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';

describe('table keymap', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let editorView: EditorView;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTables: true,
      },
      pluginKey,
      createAnalyticsEvent,
    });
  };

  const editorWithPlugins = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowExtension: true,
        allowTables: true,
        allowRule: true,
        allowPanel: true,
        allowTasksAndDecisions: true,
        allowExpand: true,
        media: { allowMediaSingle: true },
      },
      pluginKey,
    });

  describe('Tab keypress', () => {
    describe('when the whole row is selected', () => {
      it('should select the first cell of the next row', () => {
        const { editorView, refs } = editor(
          doc(
            table()(tr(tdCursor, tdEmpty), tr(td({})(p('{nextPos}')), tdEmpty)),
          ),
        );
        const { nextPos } = refs;
        editorView.dispatch(selectRow(0)(editorView.state.tr));
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });

    describe('when the whole column is selected', () => {
      it('should select the last cell of the next column', () => {
        const { editorView, refs } = editor(
          doc(
            table()(tr(tdCursor, tdEmpty), tr(tdEmpty, td({})(p('{nextPos}')))),
          ),
        );
        const { nextPos } = refs;

        editorView.dispatch(selectColumn(0)(editorView.state.tr));
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });

    describe('when the cursor is at the first cell of the first row', () => {
      it('should select next cell of the current row', () => {
        const { editorView, refs } = editor(
          doc(table()(tr(tdCursor, td({})(p('{nextPos}')), tdEmpty))),
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });

    describe('when the cursor is at the last cell of the first row', () => {
      it('should select first cell of the next row', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(tdEmpty, tdEmpty, tdCursor),
              tr(td({})(p('{nextPos}')), tdEmpty, tdEmpty),
            ),
          ),
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });

    describe('when the cursor is at the last cell of the last row', () => {
      it('should create a new row and select the first cell of the new row', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(tdEmpty, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdCursor),
            ),
          ),
        );
        sendKeyToPm(editorView, 'Tab');
        const tableNode = findTable(editorView.state.selection)!;
        const map = TableMap.get(tableNode.node);
        expect(map.height).toEqual(3);
        expect(editorView.state.selection.$from.pos).toEqual(32);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });
  });

  describe('Shift-Tab keypress', () => {
    describe('when the cursor is at the last cell of the first row', () => {
      it('should select previous cell of the current row', () => {
        const { editorView, refs } = editor(
          doc(table()(tr(tdEmpty, td({})(p('{nextPos}')), tdCursor))),
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });

    describe('when the cursor is at the first cell of the second row', () => {
      it('should select the last cell of the first row', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(tdEmpty, tdEmpty, td({})(p('{nextPos}'))),
              tr(tdCursor, tdEmpty, tdEmpty),
            ),
          ),
        );
        const { nextPos } = refs;
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });

    describe('when the cursor is at the first cell of the first row', () => {
      it('should create a new row and select the first cell of the new row', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );
        sendKeyToPm(editorView, 'Shift-Tab');
        const tableNode = findTable(editorView.state.selection)!;
        const map = TableMap.get(tableNode.node);
        expect(map.height).toEqual(3);
        expect(editorView.state.selection.$from.pos).toEqual(4);
        expect(editorView.state.selection.empty).toEqual(true);
      });
    });
  });

  describe('Backspace keypress', () => {
    describe('when cursor is immediately after the table', () => {
      it('should move cursor to the last cell', () => {
        const { editorView, refs } = editor(
          doc(
            p('text'),
            table()(tr(tdEmpty, td({})(p('hello{nextPos}')))),
            p('{<>}text'),
          ),
        );
        const { nextPos } = refs;

        sendKeyToPm(editorView, 'Backspace');
        expect(editorView.state.selection.$from.pos).toEqual(nextPos);
      });

      const backspace = (view: EditorView) => {
        const {
          state: {
            tr,
            selection: { $head },
          },
        } = view;
        view.dispatch(tr.delete($head.pos - 1, $head.pos));
      };

      const excludeNodes = ['doc', 'table', 'bodiedExtension'];

      Object.keys(defaultSchema.nodes).forEach(nodeName => {
        const node = defaultSchema.nodes[nodeName];
        if (
          node.spec.group !== 'block' ||
          excludeNodes.indexOf(nodeName) > -1
        ) {
          return;
        }

        if (!(pmNodeBuilder as Record<string, any>)[nodeName]) {
          return;
        }

        it(`should remove a ${nodeName}, and place the cursor into the last cell`, () => {
          const { editorView, refs } = editorWithPlugins(
            doc(
              table()(tr(tdEmpty, td({})(p('hello{nextPos}')))),
              (pmNodeBuilder as Record<string, any>)[nodeName],
            ),
          );
          const { nextPos } = refs;
          const { state } = editorView;

          // work backwards from document end to find out where to put the cursor
          let last = state.doc.lastChild;

          while (last && !last.isTextblock) {
            last = last.lastChild;
          }

          let backspaceAmount = 0;
          if (last) {
            // also delete any existing placeholder content that pmNodeBuilder gave us
            backspaceAmount += last.content.size;
          }

          // lists need an an extra backspace before cursor moves to table, since we need to
          // outdent the first item, first.
          if (nodeName.endsWith('List')) {
            backspaceAmount++;
          }
          for (let i = 0; i < backspaceAmount; i++) {
            sendKeyToPm(editorView, 'Backspace');
            backspace(editorView);
          }

          sendKeyToPm(editorView, 'Backspace');
          expect(editorView.state.selection.$from.pos).toEqual(nextPos);
        });
      });
    });

    describe('when table is selected', () => {
      it('should empty table cells and move cursor to the first selected cell', () => {
        const { editorView } = editor(
          doc(
            table()(
              tr(
                tdCursor,
                td({})(p('text text text')),
                td({})(p('more text text text')),
              ),
            ),
          ),
        );

        editorView.dispatch(selectTable(editorView.state.tr));
        expect(editorView.state.selection instanceof CellSelection).toEqual(
          true,
        );
        sendKeyToPm(editorView, 'Backspace');
        expect(editorView.state.doc).toEqualDocument(
          doc(table()(tr(tdEmpty, tdEmpty, tdEmpty))),
        );
        expect(editorView.state.selection.$from.pos).toEqual(4);
      });
    });

    [0, 1, 2].forEach(index => {
      describe(`when row ${index + 1} is selected`, () => {
        it(`should empty cells in the row ${
          index + 1
        } and move cursor to the first selected cell`, () => {
          const { editorView } = editor(
            doc(
              table()(
                tr(tdEmpty, td({})(p('{<>}1'))),
                tr(tdEmpty, td({})(p('2'))),
                tr(tdEmpty, td({})(p('3'))),
              ),
            ),
          );

          editorView.dispatch(selectRow(index)(editorView.state.tr));
          expect(editorView.state.selection instanceof CellSelection).toEqual(
            true,
          );
          const { selection } = editorView.state;
          const { start } = findTable(selection)!;
          const cursorPos =
            selection.$head.pos - selection.$head.parentOffset + start!;
          sendKeyToPm(editorView, 'Backspace');
          const rows: any = [];
          for (let i = 0; i < 3; i++) {
            rows.push(tr(tdEmpty, td({})(p(i === index ? '' : `${i + 1}`))));
          }
          expect(editorView.state.doc).toEqualDocument(doc(table()(...rows)));
          expect(cursorPos).toEqual(editorView.state.selection.$from.pos);
          expect(editorView.state.selection.$from.pos).toEqual(
            [4, 15, 26][index],
          );
        });
      });

      describe(`when column ${index + 1} is selected`, () => {
        it(`should empty cells in the column ${
          index + 1
        } and move cursor to the last selected cell`, () => {
          const emptyRow = tr(tdEmpty, tdEmpty, tdEmpty);
          const { editorView } = editor(
            doc(
              table()(
                emptyRow,
                tr(td({})(p('{<>}1')), td({})(p('2')), td({})(p('3'))),
              ),
            ),
          );

          editorView.dispatch(selectColumn(index)(editorView.state.tr));
          expect(editorView.state.selection instanceof CellSelection).toEqual(
            true,
          );
          const { selection } = editorView.state;
          const { start } = findTable(selection)!;
          const cursorPos =
            selection.$head.pos - selection.$head.parentOffset + start;
          sendKeyToPm(editorView, 'Backspace');
          const columns: any = [];
          for (let i = 0; i < 3; i++) {
            columns.push(td({})(p(i === index ? '' : `${i + 1}`)));
          }
          expect(editorView.state.doc).toEqualDocument(
            doc(table()(emptyRow, tr(...columns))),
          );
          expect(cursorPos).toEqual(editorView.state.selection.$from.pos);
          expect(editorView.state.selection.$from.pos).toEqual(
            [4, 8, 12][index],
          );
        });
      });
    });
  });

  describe('Cmd-A keypress', () => {
    describe('when a table cell is selected', () => {
      it('should select whole editor', () => {
        const { editorView } = editor(
          doc(
            p('testing'),
            table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty)),
            p('testing'),
          ),
        );
        sendKeyToPm(editorView, 'Mod-a');
        expect(editorView.state.selection.$from.pos).toEqual(0);
        expect(editorView.state.selection.$to.pos).toEqual(
          editorView.state.doc.content.size,
        );
      });
    });

    describe('when a table row is selected', () => {
      it('should select whole editor', () => {
        const { editorView } = editor(
          doc(
            p('testing'),
            table()(tr(td()(p('{<}testing{>}'))), tr(tdEmpty)),
            p('testing'),
          ),
        );
        sendKeyToPm(editorView, 'Mod-a');
        expect(editorView.state.selection.$from.pos).toEqual(0);
        expect(editorView.state.selection.$to.pos).toEqual(
          editorView.state.doc.content.size,
        );
      });
    });
  });

  describe('Ctrl-Alt-Arrows', () => {
    it('should add row before any table row', () => {
      const { editorView } = editor(
        doc(table()(tr(tdCursor, td()(p('text'))))),
      );

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowUp');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(tdEmpty, tdEmpty), tr(tdCursor, td()(p('text'))))),
      );
    });

    it('should not add row before when cursor in table header', () => {
      const { editorView } = editor(doc(table()(tr(thCursor, thEmpty))));

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowUp');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(thCursor, thEmpty))),
      );
    });

    it('should not add row before when selected table header', () => {
      const { editorView } = editor(doc(table()(tr(thEmpty, thEmpty))));

      editorView.dispatch(selectRow(0)(editorView.state.tr));
      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowUp');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(thEmpty, thEmpty))),
      );
    });

    it('should add row after any table row', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowDown');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
      );
    });

    it('should add row after table header', () => {
      const { editorView } = editor(doc(table()(tr(thCursor, thEmpty))));

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowDown');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(thCursor, thEmpty), tr(tdEmpty, tdEmpty))),
      );
    });

    it('should add column before any table column', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowLeft');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(tdEmpty, tdCursor, tdEmpty))),
      );
    });

    it('should not add column before when cursor in table header', () => {
      const { editorView } = editor(doc(table()(tr(thCursor, thEmpty))));

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowLeft');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(thCursor, thEmpty))),
      );
    });

    it('should not add column before when selected table header', () => {
      const { editorView } = editor(doc(table()(tr(thEmpty, thEmpty))));

      editorView.dispatch(selectRow(0)(editorView.state.tr));
      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowLeft');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(thEmpty, thEmpty))),
      );
    });

    it('should add column after any table column', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor, tdEmpty))));

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowRight');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
      );
    });

    it('should add column after table header', () => {
      const { editorView } = editor(doc(table()(tr(thCursor, thEmpty))));

      sendKeyToPm(editorView, 'Ctrl-Alt-ArrowRight');

      expect(editorView.state.doc).toEqualDocument(
        doc(table()(tr(thCursor, thEmpty, thEmpty))),
      );
    });
  });

  describe('Shift-Alt-T keypress', () => {
    beforeEach(() => {
      ({ editorView } = editor(doc(p())));
      sendKeyToPm(editorView, 'Shift-Alt-T');
    });

    it('should insert 3x3 table', () => {
      const tableNode = table()(
        tr(thEmpty, thEmpty, thEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
        tr(tdEmpty, tdEmpty, tdEmpty),
      );
      expect(editorView.state.doc).toEqualDocument(doc(tableNode));
    });

    it('should dispatch analytics event', () => {
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'table',
        attributes: expect.objectContaining({ inputMethod: 'shortcut' }),
        eventType: 'track',
      });
    });
  });
});
