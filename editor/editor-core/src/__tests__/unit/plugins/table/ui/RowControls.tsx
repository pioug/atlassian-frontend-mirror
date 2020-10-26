import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  p,
  table,
  td,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { selectRows } from '@atlaskit/editor-test-helpers/table';
import { getSelectionRect, selectRow } from '@atlaskit/editor-tables/utils';
import React from 'react';
import { setTextSelection } from '../../../../../index';
import { hoverRows } from '../../../../../plugins/table/commands';
import {
  TableCssClassName as ClassName,
  TablePluginState,
} from '../../../../../plugins/table/types';
import TableFloatingControls from '../../../../../plugins/table/ui/TableFloatingControls';
import RowControls from '../../../../../plugins/table/ui/TableFloatingControls/RowControls';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

const ControlsButton = `.${ClassName.CONTROLS_BUTTON}`;
const RowControlsButtonWrap = `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`;

describe('RowControls', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  [1, 2, 3].forEach(row => {
    describe(`when table has ${row} rows`, () => {
      it(`should render ${row} row header buttons`, () => {
        const rows = [tr(tdCursor)];
        for (let i = 1; i < row; i++) {
          rows.push(tr(tdEmpty));
        }
        const { editorView } = editor(doc(p('text'), table()(...rows)));
        const floatingControls = mountWithIntl(
          <TableFloatingControls
            tableRef={document.querySelector('table')!}
            editorView={editorView}
          />,
        );
        expect(floatingControls.find(RowControlsButtonWrap)).toHaveLength(row);
        floatingControls.unmount();
      });
    });
  });

  [0, 1, 2].forEach(row => {
    describe(`when HeaderButton in row ${row + 1} is clicked`, () => {
      it('should not move the cursor when hovering controls', () => {
        const { editorView, refs } = editor(
          doc(
            table()(
              tr(thEmpty, td({})(p('{nextPos}')), thEmpty),
              tr(tdCursor, tdEmpty, tdEmpty),
              tr(tdEmpty, tdEmpty, tdEmpty),
            ),
          ),
        );

        const floatingControls = mountWithIntl(
          <TableFloatingControls
            tableRef={document.querySelector('table')!}
            editorView={editorView}
          />,
        );

        // move to header row
        const { nextPos } = refs;
        setTextSelection(editorView, nextPos);

        // now hover the row
        floatingControls
          .find(RowControlsButtonWrap)
          .at(row)
          .find('button')
          .first()
          .simulate('mouseover');

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        // release the hover
        floatingControls
          .find(RowControlsButtonWrap)
          .at(row)
          .find('button')
          .first()
          .simulate('mouseout');

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        floatingControls.unmount();
      });
    });
  });

  it('applies the danger class to the row buttons', () => {
    const { editorView } = editor(
      doc(
        table()(
          tr(thEmpty, td({})(p()), thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    const floatingControls = mountWithIntl(
      <RowControls
        tableRef={document.querySelector('table')!}
        editorView={editorView}
        hoverRows={(rows, danger) => {
          hoverRows(rows, danger)(editorView.state, editorView.dispatch);
        }}
        hoveredRows={[0, 1]}
        isInDanger={true}
        selectRow={row => {
          editorView.dispatch(selectRow(row)(editorView.state.tr));
        }}
      />,
    );

    floatingControls
      .find(RowControlsButtonWrap)
      .slice(0, 2)
      .forEach(buttonWrap => {
        expect(buttonWrap.hasClass('danger')).toBe(true);
      });

    floatingControls.unmount();
  });

  describe('row shift selection', () => {
    it('should shift select rows after the currently selected row', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      selectRows([0])(editorView.state, editorView.dispatch);
      const floatingControls = mountWithIntl(
        <RowControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
          hoverRows={(rows, danger) => {
            hoverRows(rows, danger)(editorView.state, editorView.dispatch);
          }}
          selectRow={(row, expand) => {
            editorView.dispatch(selectRow(row, expand)(editorView.state.tr));
          }}
        />,
      );

      floatingControls
        .find(ControlsButton)
        .at(2)
        .simulate('click', { shiftKey: true });

      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });

    it('should shift select row before the currently selected row', () => {
      const { editorView } = editor(
        doc(
          table()(
            tr(thEmpty, thEmpty, thEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty, tdEmpty),
          ),
        ),
      );

      selectRows([2])(editorView.state, editorView.dispatch);
      const floatingControls = mountWithIntl(
        <RowControls
          tableRef={document.querySelector('table')!}
          editorView={editorView}
          hoverRows={(rows, danger) => {
            hoverRows(rows, danger)(editorView.state, editorView.dispatch);
          }}
          selectRow={(row, expand) => {
            editorView.dispatch(selectRow(row, expand)(editorView.state.tr));
          }}
        />,
      );

      floatingControls
        .find(ControlsButton)
        .first()
        .simulate('click', { shiftKey: true });

      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });
  });
});
