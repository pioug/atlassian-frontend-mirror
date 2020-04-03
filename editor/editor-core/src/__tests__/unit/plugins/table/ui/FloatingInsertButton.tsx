import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  selectCell,
  selectColumns,
  selectRows,
} from '@atlaskit/editor-test-helpers/table';
import { ReactWrapper } from 'enzyme';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { TablePluginState } from '../../../../../plugins/table/types';
import FloatingInsertButton, {
  Props as FloatingInsertButtonProps,
} from '../../../../../plugins/table/ui/FloatingInsertButton';
import InsertButton from '../../../../../plugins/table/ui/FloatingInsertButton/InsertButton';
import safeUnmount from '../../../../__helpers/safeUnmount';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

describe('Floating Insert Button', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
    });

  let wrapper: ReactWrapper<FloatingInsertButtonProps>;
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

    const tableNode = findParentNodeOfTypeClosestToPos(
      editorView.state.selection.$from,
      editorView.state.schema.nodes.table,
    );

    wrapper = mountWithIntl(
      <FloatingInsertButton
        tableRef={document.querySelector('table')!}
        tableNode={tableNode && tableNode.node}
        editorView={editorView}
      />,
    );
  });

  afterEach(() => {
    safeUnmount(wrapper);
  });

  test('should not render insert button with index', () => {
    expect(wrapper.find(InsertButton).length).toBe(0);
  });

  test('should render insert button for second column', () => {
    wrapper.setProps({
      insertColumnButtonIndex: 1,
    });

    expect(wrapper.find(InsertButton).length).toBe(1);
  });

  test('should render insert button for second row', () => {
    wrapper.setProps({
      insertRowButtonIndex: 1,
    });

    expect(wrapper.find(InsertButton).length).toBe(1);
  });

  test('should no render insert button for first row when row header is enabled', () => {
    wrapper.setProps({
      insertRowButtonIndex: 0,
      isHeaderRowEnabled: true,
    });

    expect(wrapper.find(InsertButton).length).toBe(0);
  });

  test('should render insert button for first row when row header is disabled', () => {
    wrapper.setProps({
      insertRowButtonIndex: 0,
      isHeaderRowEnabled: false,
    });

    expect(wrapper.find(InsertButton).length).toBe(1);
  });

  test('should no render insert button for first col when column header is enabled', () => {
    wrapper.setProps({
      insertColumnButtonIndex: 0,
      isHeaderColumnEnabled: true,
    });

    expect(wrapper.find(InsertButton).length).toBe(0);
  });

  test('should render insert button for first col when column header is disabled', () => {
    wrapper.setProps({
      insertColumnButtonIndex: 0,
      isHeaderColumnEnabled: false,
    });

    expect(wrapper.find(InsertButton).length).toBe(1);
  });

  test('should render insert button when a single cell is selected', () => {
    selectCell(1, 1)(editorView.state, editorView.dispatch);

    wrapper.setProps({
      insertColumnButtonIndex: 0,
      editorView,
    });

    expect(wrapper.find(InsertButton).length).toBe(1);
  });

  test('should no render insert button when a whole column is selected', () => {
    selectColumns([1])(editorView.state, editorView.dispatch);

    wrapper.setProps({
      insertColumnButtonIndex: 0,
      editorView,
    });

    expect(wrapper.find(InsertButton).length).toBe(0);
  });

  test('should no render insert button when a whole row is selected', () => {
    selectRows([1])(editorView.state, editorView.dispatch);

    wrapper.setProps({
      insertRowButtonIndex: 0,
      editorView,
    });

    expect(wrapper.find(InsertButton).length).toBe(0);
  });
});
