import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { selectColumns, selectRows } from '@atlaskit/editor-test-helpers/table';
import { selectTable, getCellsInColumn } from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import {
  TablePluginState,
  TableCssClassName,
} from '../../../plugins/table/types';
import FloatingDeleteButton, {
  Props as FloatingDeleteButtonProps,
} from '../../../plugins/table/ui/FloatingDeleteButton';
import * as tableColumnControlsUtils from '../../../plugins/table/utils/column-controls';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import tablePlugin from '../../../plugins/table-plugin';

describe('Floating Delete Button', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: false,
        dangerouslyAppendPlugins: { __plugins: [tablePlugin()] },
      },
      pluginKey,
    });

  let editorView: EditorView;

  beforeEach(() => {
    ({ editorView } = editor(
      doc(
        table()(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    ));
  });

  const component = (props: FloatingDeleteButtonProps) =>
    render(
      <IntlProvider locale="en">
        <FloatingDeleteButton
          tableRef={editorView.dom.querySelector('table')!}
          {...props}
        />
      </IntlProvider>,
    );

  it('should not render a delete button with no selection', () => {
    component({ selection: editorView.state.selection, editorView });

    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  it('should not render a delete button with whole table selected', () => {
    // selects the whole table
    editorView.dispatch(selectTable(editorView.state.tr));

    component({ selection: editorView.state.selection, editorView });

    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  describe('Columns', () => {
    beforeEach(() => {
      const COLUMN_WIDTH = 33;
      const tableWrapper = document.querySelector(
        `.${TableCssClassName.TABLE_NODE_WRAPPER}`,
      );
      jest.spyOn(tableWrapper!, 'getBoundingClientRect').mockReturnValue({
        width: COLUMN_WIDTH * 3,
      } as DOMRect);
      tableWrapper!.scrollLeft = 0;
      jest
        .spyOn(tableColumnControlsUtils, 'getColumnsWidths')
        .mockReturnValue([COLUMN_WIDTH, COLUMN_WIDTH, COLUMN_WIDTH]);
    });

    test.each([[1], [2], [3]])(
      'should renders a delete button with column %d selected',
      (column) => {
        // Select columns start from 0
        selectColumns([column - 1])(editorView.state, editorView.dispatch);

        component({ selection: editorView.state.selection, editorView });

        expect(screen.getAllByLabelText('Delete column').length).toBe(1);
      },
    );

    it('should render a single delete button over multiple column selections', () => {
      selectColumns([0, 1])(editorView.state, editorView.dispatch);

      component({ selection: editorView.state.selection, editorView });

      expect(screen.getAllByLabelText('Delete column').length).toBe(1);
    });
  });

  describe('Rows', () => {
    test.each([[1], [2], [3]])(
      'renders a delete button with row %d selected',
      (row) => {
        selectRows([row - 1])(editorView.state, editorView.dispatch);

        component({ selection: editorView.state.selection, editorView });

        expect(screen.getAllByLabelText('Delete row').length).toBe(1);
      },
    );

    it('only renders a single delete button over multiple row selections', () => {
      selectRows([0, 1])(editorView.state, editorView.dispatch);

      // selecting the row mutates the editor state (which is inside editorView)
      component({ selection: editorView.state.selection, editorView });

      expect(screen.getAllByLabelText('Delete row').length).toBe(1);
    });
  });
  describe('when deleting with the delete button', () => {
    describe('Columns', () => {
      it('should move cursor within the table after delete', () => {
        selectColumns([0, 1])(editorView.state, editorView.dispatch);
        component({ selection: editorView.state.selection, editorView });
        const { tr } = editorView.state;
        const { pos } = getCellsInColumn(2)(tr.selection)![2];
        const lastCellPos = tr.doc.resolve(pos).pos + 1;
        fireEvent.click(screen.getByLabelText('Delete column'));
        expect(editorView.state.selection.from).toBeLessThanOrEqual(
          lastCellPos,
        );
      });
    });
    describe('Rows', () => {
      it('should move cursor within the table after delete', () => {
        selectRows([0, 1])(editorView.state, editorView.dispatch);
        component({ selection: editorView.state.selection, editorView });
        const { tr } = editorView.state;
        const { pos } = getCellsInColumn(2)(tr.selection)![2];
        const lastCellPos = tr.doc.resolve(pos).pos + 1;
        fireEvent.click(screen.getByLabelText('Delete row'));
        expect(editorView.state.selection.from).toBeLessThanOrEqual(
          lastCellPos,
        );
      });
    });
  });
});
