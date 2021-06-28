import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { selectRows } from '@atlaskit/editor-test-helpers/table';
import { getSelectionRect, selectRow } from '@atlaskit/editor-tables/utils';
import React from 'react';
import { EditorProps, setTextSelection } from '../../../../../index';
import { hoverRows } from '../../../../../plugins/table/commands';
import {
  TableCssClassName as ClassName,
  TablePluginState,
} from '../../../../../plugins/table/types';
import TableFloatingControls from '../../../../../plugins/table/ui/TableFloatingControls';
import RowControls from '../../../../../plugins/table/ui/TableFloatingControls/RowControls';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';
import { ReactWrapper } from 'enzyme';

const ControlsButton = `.${ClassName.CONTROLS_BUTTON}`;
const RowControlsButtonWrap = `.${ClassName.ROW_CONTROLS_BUTTON_WRAP}`;

describe('RowControls', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  let floatingControls: ReactWrapper;
  let originalResizeObserver: any;

  let triggerElementResize = (element: HTMLElement, height: number) => {
    const entries = [
      {
        target: element,
        contentRect: { height },
      },
    ];
    resizeCallback(entries);
  };
  let resizeCallback: (entries: any[]) => {};

  beforeAll(() => {
    originalResizeObserver = (window as any).ResizeObserver;
    (window as any).ResizeObserver = function resizeObserverMock(
      callback: () => {},
    ) {
      this.disconnect = jest.fn();
      this.observe = jest.fn();
      resizeCallback = callback;
    };
  });

  afterAll(() => {
    (window as any).ResizeObserver = originalResizeObserver;
  });

  afterEach(() => {
    if (floatingControls && floatingControls.length) {
      floatingControls.unmount();
    }
    jest.clearAllMocks();
  });

  const editor = (doc: DocBuilder, props?: EditorProps) =>
    createEditor({
      doc,
      editorProps: { allowTables: true, ...props },
      pluginKey,
    });

  [1, 2, 3].forEach((row) => {
    describe(`when table has ${row} rows`, () => {
      it(`should render ${row} row header buttons`, () => {
        const rows = [tr(tdCursor)];
        for (let i = 1; i < row; i++) {
          rows.push(tr(tdEmpty));
        }
        const { editorView } = editor(doc(p('text'), table()(...rows)));
        floatingControls = mountWithIntl(
          <TableFloatingControls
            tableRef={document.querySelector('table')!}
            tableActive={true}
            editorView={editorView}
          />,
        );
        expect(floatingControls.find(RowControlsButtonWrap)).toHaveLength(row);
      });
    });
  });

  it('does not render rowControls if table is not active', () => {
    const { editorView } = editor(doc(p('text'), table()(tr(tdCursor))));
    floatingControls = mountWithIntl(
      <TableFloatingControls
        tableRef={document.querySelector('table')!}
        tableActive={false}
        editorView={editorView}
      />,
    );
    expect(floatingControls.find(RowControlsButtonWrap)).toHaveLength(0);
  });

  describe('with tableRenderOptimization enabled', () => {
    it('updates rowControls if table height changes', () => {
      const { editorView } = editor(doc(table()(tr(tdCursor))), {
        featureFlags: { tableRenderOptimization: true },
      });
      floatingControls = mountWithIntl(
        <TableFloatingControls
          tableRef={document.querySelector('table')!}
          tableActive={true}
          editorView={editorView}
        />,
      );
      const tableElement = editorView.domAtPos(1).node as HTMLElement;
      triggerElementResize(tableElement, 10);
      expect(floatingControls.state('tableHeight')).toBe(10);
      tableElement.style.height = '100px';
      triggerElementResize(tableElement, 100);
      expect(floatingControls.state('tableHeight')).toBe(100);
    });
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

        floatingControls = mountWithIntl(
          <TableFloatingControls
            tableRef={document.querySelector('table')!}
            tableActive={true}
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

    floatingControls = mountWithIntl(
      <RowControls
        tableRef={document.querySelector('table')!}
        editorView={editorView}
        hoverRows={(rows, danger) => {
          hoverRows(rows, danger)(editorView.state, editorView.dispatch);
        }}
        hoveredRows={[0, 1]}
        isInDanger={true}
        selectRow={(row) => {
          editorView.dispatch(selectRow(row)(editorView.state.tr));
        }}
      />,
    );

    floatingControls
      .find(RowControlsButtonWrap)
      .slice(0, 2)
      .forEach((buttonWrap) => {
        expect(buttonWrap.hasClass('danger')).toBe(true);
      });
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
      floatingControls = mountWithIntl(
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
      floatingControls = mountWithIntl(
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
