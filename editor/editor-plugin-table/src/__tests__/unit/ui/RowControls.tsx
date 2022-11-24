import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  td,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { selectRows } from '@atlaskit/editor-test-helpers/table';
import { getSelectionRect, selectRow } from '@atlaskit/editor-tables/utils';
import React from 'react';
import { setTextSelection } from '@atlaskit/editor-common/utils';
import { hoverRows } from '../../../plugins/table/commands';
import TableFloatingControls from '../../../plugins/table/ui/TableFloatingControls';
import { RowControls } from '../../../plugins/table/ui/TableFloatingControls/RowControls';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import tablePlugin from '../../../plugins/table-plugin';

describe('RowControls', () => {
  const createEditor = createProsemirrorEditorFactory();
  const fakeGetEditorFeatureFlags = jest.fn(() => ({}));
  let originalResizeObserver: any;

  beforeAll(() => {
    originalResizeObserver = (window as any).ResizeObserver;
    (window as any).ResizeObserver = function resizeObserverMock(
      callback: () => {},
    ) {
      this.disconnect = jest.fn();
      this.observe = jest.fn();
    };
  });

  afterAll(() => {
    (window as any).ResizeObserver = originalResizeObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(tablePlugin),
      pluginKey,
    });
  };

  [1, 2, 3].forEach((row) => {
    describe(`when table has ${row} rows`, () => {
      it(`should render ${row} row header buttons`, () => {
        const rows = [tr(tdCursor)];
        for (let i = 1; i < row; i++) {
          rows.push(tr(tdEmpty));
        }
        const { editorView } = editor(doc(p('text'), table()(...rows)));
        const ref = editorView.dom.querySelector('table') || undefined;

        render(
          <IntlProvider locale="en">
            <TableFloatingControls
              tableRef={ref}
              tableActive
              editorView={editorView}
              getEditorFeatureFlags={fakeGetEditorFeatureFlags}
            />
          </IntlProvider>,
        );

        const rowControlButtons = screen.getAllByLabelText('Highlight row');

        expect(rowControlButtons).toHaveLength(row);
      });
    });
  });

  it('does not render rowControls if table is not active', () => {
    const { editorView } = editor(doc(p('text'), table()(tr(tdCursor))));
    const ref = editorView.dom.querySelector('table') || undefined;

    render(
      <IntlProvider locale="en">
        <TableFloatingControls
          tableRef={ref}
          tableActive={false}
          editorView={editorView}
          getEditorFeatureFlags={fakeGetEditorFeatureFlags}
        />
      </IntlProvider>,
    );

    expect(screen.queryByLabelText('Highlight row')).toBeFalsy();
  });

  [0, 1, 2].forEach((row) => {
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

        const ref = editorView.dom.querySelector('table') || undefined;

        render(
          <IntlProvider locale="en">
            <TableFloatingControls
              tableRef={ref}
              tableActive
              editorView={editorView}
              getEditorFeatureFlags={fakeGetEditorFeatureFlags}
            />
          </IntlProvider>,
        );

        // move to header row
        const { nextPos } = refs;
        setTextSelection(editorView, nextPos);

        // now hover the row
        const rowControls = screen.getAllByLabelText('Highlight row');

        fireEvent.mouseOver(rowControls[row]);

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);

        // release the hover
        fireEvent.mouseOut(rowControls[row]);

        // assert the cursor is still in same position
        expect(editorView.state.selection.$from.pos).toBe(nextPos);
        expect(editorView.state.selection.$to.pos).toBe(nextPos);
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

    const ref = editorView.dom.querySelector('table') || undefined;

    render(
      <IntlProvider locale="en">
        <RowControls
          tableRef={ref!}
          editorView={editorView}
          hoverRows={(rows, danger) => {
            hoverRows(rows, danger)(editorView.state, editorView.dispatch);
          }}
          hoveredRows={[0, 1]}
          isInDanger={true}
          selectRow={(row) => {
            editorView.dispatch(selectRow(row)(editorView.state.tr));
          }}
        />
      </IntlProvider>,
    );

    const rowControls = screen.getAllByLabelText('Highlight row');
    rowControls
      .slice(0, 2)
      .forEach((control) =>
        expect(
          control?.parentElement?.classList?.contains('danger'),
        ).toBeTruthy(),
      );
  });

  describe('row shift selection', () => {
    it('should be able to shift + click to select rows after the currently selected row', () => {
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

      const ref = editorView.dom.querySelector('table');

      render(
        <IntlProvider locale="en">
          <RowControls
            tableRef={ref!}
            editorView={editorView}
            hoverRows={(rows, danger) => {
              hoverRows(rows, danger)(editorView.state, editorView.dispatch);
            }}
            selectRow={(row, expand) => {
              editorView.dispatch(selectRow(row, expand)(editorView.state.tr));
            }}
          />
        </IntlProvider>,
      );

      const rowControls = screen.getAllByLabelText('Highlight row');
      fireEvent.click(rowControls[2], { shiftKey: true });

      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });

    it('should be able to shift + click to select rows before the currently selected row', () => {
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

      const ref = editorView.dom.querySelector('table') || undefined;

      render(
        <IntlProvider locale="en">
          <RowControls
            tableRef={ref!}
            editorView={editorView}
            hoverRows={(rows, danger) => {
              hoverRows(rows, danger)(editorView.state, editorView.dispatch);
            }}
            selectRow={(row, expand) => {
              editorView.dispatch(selectRow(row, expand)(editorView.state.tr));
            }}
          />
        </IntlProvider>,
      );

      const rowControls = screen.getAllByLabelText('Highlight row');
      fireEvent.click(rowControls[0], { shiftKey: true });

      const rect = getSelectionRect(editorView.state.selection);
      expect(rect).toEqual({ left: 0, top: 0, right: 3, bottom: 3 });
    });
  });
});
