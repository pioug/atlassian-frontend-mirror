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
import * as prosemirrorUtils from 'prosemirror-utils';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  CONTENT_COMPONENT,
} from '../../../../../plugins/analytics/types/enums';

describe('Floating Insert Button when findDomRefAtPos fails', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      pluginKey,
      createAnalyticsEvent,
    });

  let wrapper: ReactWrapper<FloatingInsertButtonProps>;
  let editorView: EditorView;

  beforeEach(() => {
    const mock = jest.spyOn(prosemirrorUtils, 'findDomRefAtPos');
    mock.mockImplementation((pos, domAtPos) => {
      throw new Error('Error message from mock');
    });
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
        dispatchAnalyticsEvent={createAnalyticsEvent}
      />,
    );
  });

  afterEach(() => {
    safeUnmount(wrapper);
    jest.restoreAllMocks();
  });

  test('sends error analytics event after attempting to render for second column', () => {
    // We need to set the props here, as by default insertColumnButtonIndex in undefined (in
    // mountWithIntl()) and rendering halts when it's undefined
    wrapper.setProps({
      insertColumnButtonIndex: 1,
    });
    expect(createAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: ACTION.ERRORED,
      actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: expect.objectContaining({
        component: CONTENT_COMPONENT.FLOATING_INSERT_BUTTON,
        selection: { type: 'text', anchor: 18, head: 18 },
        position: 3,
        docSize: 46,
        error: 'Error: Error message from mock',
      }),
    });
  });

  test('should not render insert button with index', () => {
    expect(wrapper.find(InsertButton).length).toBe(0);
  });

  test("shouldn't render insert button for second column", () => {
    wrapper.setProps({
      insertColumnButtonIndex: 1,
    });

    expect(wrapper.find(InsertButton).length).toBe(0);
  });

  test("shouldn't render insert button for second row", () => {
    wrapper.setProps({
      insertRowButtonIndex: 1,
    });

    expect(wrapper.find(InsertButton).length).toBe(0);
  });
});
describe('Floating Insert Button', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) =>
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
