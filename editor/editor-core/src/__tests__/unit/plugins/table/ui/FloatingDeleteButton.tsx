import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
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
import { ReactWrapper } from 'enzyme';
import { selectTable } from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import {
  TablePluginState,
  TableCssClassName,
} from '@atlaskit/editor-plugin-table/types';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import FloatingDeleteButton, {
  Props as FloatingDeleteButtonProps,
} from '@atlaskit/editor-plugin-table/src/plugins/table/ui/FloatingDeleteButton';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import DeleteButton from '@atlaskit/editor-plugin-table/src/plugins/table/ui/FloatingDeleteButton/DeleteButton';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import tableMessages from '@atlaskit/editor-plugin-table/src/plugins/table/ui/messages';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import * as tableColumnControlsUtils from '@atlaskit/editor-plugin-table/src/plugins/table/utils/column-controls';
import { pluginKey } from '@atlaskit/editor-plugin-table/plugin-key';

describe('Floating Delete Button', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  let wrapper: ReactWrapper<FloatingDeleteButtonProps>;
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

    wrapper = (mountWithIntl(
      <FloatingDeleteButton
        tableRef={document.querySelector('table')!}
        editorView={editorView}
        selection={editorView.state.selection}
      />,
    ) as unknown) as ReactWrapper<FloatingDeleteButtonProps>;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('should not render a delete button with no selection', () => {
    expect(wrapper.find(DeleteButton).length).toBe(0);
  });

  test('should not render a delete button with whole table selected', () => {
    // select the whole table
    editorView.dispatch(selectTable(editorView.state.tr));

    // We need to force renderer
    wrapper.setProps({ selection: editorView.state.selection });
    // set numberOfColumns prop to trick shouldComponentUpdate and force re-render
    expect(wrapper.find(DeleteButton).length).toBe(0);
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

        // We need to force renderer
        wrapper.setProps({ selection: editorView.state.selection });

        // we should now have a delete button
        expect(wrapper.find(DeleteButton).length).toBe(1);
      },
    );

    test('should render a single delete button over multiple column selections', () => {
      selectColumns([0, 1])(editorView.state, editorView.dispatch);

      // We need to force renderer
      wrapper.setProps({ selection: editorView.state.selection });

      expect(wrapper.find(DeleteButton).length).toBe(1);
    });
  });

  describe('Rows', () => {
    test.each([[1], [2], [3]])(
      'renders a delete button with row %d selected',
      (row) => {
        selectRows([row - 1])(editorView.state, editorView.dispatch);

        wrapper.setProps({ selection: editorView.state.selection });

        expect(wrapper.find(DeleteButton).length).toBe(1);
      },
    );

    it('only renders a single delete button over multiple row selections', () => {
      selectRows([0, 1])(editorView.state, editorView.dispatch);

      // selecting the row mutates the editor state (which is inside editorView)
      // we set tableHeight prop to trick shouldComponentUpdate and force re-render
      wrapper.setProps({ selection: editorView.state.selection });

      expect(wrapper.find(DeleteButton).length).toBe(1);
    });
  });

  describe('<DeleteButton />', () => {
    it('should fire the onMouseEnter callback', () => {
      const onMouseEnter = jest.fn();
      const button = mountWithIntl(
        <DeleteButton
          removeLabel={tableMessages.removeColumns}
          onMouseEnter={onMouseEnter}
        />,
      );
      button.simulate('mouseenter');
      expect(onMouseEnter).toBeCalled();
      button.unmount();
    });

    it('should fire the onMouseLeave callback', () => {
      const onMouseLeave = jest.fn();
      const button = mountWithIntl(
        <DeleteButton
          removeLabel={tableMessages.removeRows}
          onMouseLeave={onMouseLeave}
        />,
      );
      button.simulate('mouseleave');
      expect(onMouseLeave).toBeCalled();
      button.unmount();
    });
  });
});
