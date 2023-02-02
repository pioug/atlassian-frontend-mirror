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
import { render, screen } from '@testing-library/react';
import {
  selectCell,
  selectColumns,
  selectRows,
} from '@atlaskit/editor-test-helpers/table';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { TablePluginState } from '../../../plugins/table/types';
import {
  FloatingInsertButton,
  Props as FloatingInsertButtonProps,
} from '../../../plugins/table/ui/FloatingInsertButton';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import tablePlugin from '../../../plugins/table-plugin';
import * as prosemirrorUtils from 'prosemirror-utils';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  CONTENT_COMPONENT,
} from '@atlaskit/editor-common/analytics';
import { getPluginState } from '../../../plugins/table/pm-plugins/plugin-factory';
import { createIntl } from 'react-intl-next';
import { setTableRef, setEditorFocus } from '../../../plugins/table/commands';
import { IntlProvider } from 'react-intl-next';

const getEditorContainerWidth = () => ({ width: 500 });
const createEditor = createEditorFactory<TablePluginState>();
const createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

const editor = (doc: DocBuilder) =>
  createEditor({
    doc,
    editorProps: {
      allowTables: false,
      dangerouslyAppendPlugins: { __plugins: [tablePlugin()] },
    },
    pluginKey,
  });

describe('Floating Insert Button when findDomRefAtPos fails', () => {
  let tableRef: HTMLTableElement | undefined;
  let tableNode: prosemirrorUtils.ContentNodeWithPos | undefined;
  let tableEditorView: EditorView;

  beforeEach(() => {
    const { editorView } = editor(
      doc(
        table()(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    tableNode = findParentNodeOfTypeClosestToPos(
      editorView.state.selection.$from,
      editorView.state.schema.nodes.table,
    );

    const ref = editorView.dom.querySelector('table');
    setEditorFocus(true)(editorView.state, editorView.dispatch);
    setTableRef(ref!)(editorView.state, editorView.dispatch);

    tableRef = getPluginState(editorView.state).tableRef;
    tableEditorView = editorView;

    const mock = jest.spyOn(prosemirrorUtils, 'findDomRefAtPos');
    mock.mockImplementation(() => {
      const error = new Error('Error message from mock');
      error.stack = 'stack trace';

      throw error;
    });
  });

  const intl = createIntl({ locale: 'en' });

  const component = (props: FloatingInsertButtonProps) =>
    render(
      <IntlProvider locale="en">
        <FloatingInsertButton
          intl={intl}
          tableRef={tableRef}
          tableNode={tableNode && tableNode.node}
          {...props}
        />
      </IntlProvider>,
    );

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send error analytics event', () => {
    component({
      insertColumnButtonIndex: 1,
      editorView: tableEditorView,
      getEditorContainerWidth,
      dispatchAnalyticsEvent: createAnalyticsEvent,
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
      nonPrivacySafeAttributes: expect.objectContaining({
        errorStack: 'stack trace',
      }),
    });
  });

  it('should not render insert button by default', () => {
    component({ editorView: tableEditorView, getEditorContainerWidth });
    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  it("shouldn't render insert button for second column", () => {
    component({
      insertColumnButtonIndex: 1,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  it("shouldn't render insert button for second row", () => {
    component({
      insertRowButtonIndex: 1,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });
});

describe('Floating Insert Button', () => {
  const createAnalyticsEvent = jest.fn(
    () => ({ fire() {} } as UIAnalyticsEvent),
  );

  let tableRef: HTMLTableElement | undefined;
  let tableNode: prosemirrorUtils.ContentNodeWithPos | undefined;
  let tableEditorView: EditorView;

  beforeEach(() => {
    const { editorView } = editor(
      doc(
        table()(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );

    tableNode = findParentNodeOfTypeClosestToPos(
      editorView.state.selection.$from,
      editorView.state.schema.nodes.table,
    );

    const ref = editorView.dom.querySelector('table');
    setEditorFocus(true)(editorView.state, editorView.dispatch);
    setTableRef(ref!)(editorView.state, editorView.dispatch);

    tableRef = getPluginState(editorView.state).tableRef;
    tableEditorView = editorView;
  });

  const intl = createIntl({ locale: 'en' });

  const component = (props: FloatingInsertButtonProps) =>
    render(
      <IntlProvider locale="en">
        <FloatingInsertButton
          intl={intl}
          tableRef={tableRef}
          tableNode={tableNode && tableNode.node}
          dispatchAnalyticsEvent={createAnalyticsEvent}
          {...props}
        />
      </IntlProvider>,
    );

  it('should not render insert button with index', () => {
    component({ editorView: tableEditorView, getEditorContainerWidth });
    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  it('should render insert button for second column', () => {
    component({
      insertColumnButtonIndex: 1,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.getByLabelText('Popup')).toBeInTheDocument();
  });

  it('should render insert button for second row', () => {
    component({
      insertRowButtonIndex: 1,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.getByLabelText('Popup')).toBeInTheDocument();
  });

  it('should not render insert button for first row when row header is enabled', () => {
    component({
      insertRowButtonIndex: 0,
      isHeaderRowEnabled: true,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  it('should render insert button for first row when row header is disabled', () => {
    component({
      insertRowButtonIndex: 0,
      isHeaderRowEnabled: false,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.getByLabelText('Popup')).toBeInTheDocument();
  });

  it('should no render insert button for first col when column header is enabled', () => {
    component({
      insertColumnButtonIndex: 0,
      isHeaderColumnEnabled: true,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });

    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  it('should render insert button for first col when column header is disabled', () => {
    component({
      insertColumnButtonIndex: 0,
      isHeaderColumnEnabled: false,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });

    expect(screen.getByLabelText('Popup')).toBeInTheDocument();
  });

  it('should render insert button when a single cell is selected', () => {
    selectCell(1, 1)(tableEditorView.state, tableEditorView.dispatch);
    component({
      insertColumnButtonIndex: 0,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.getByLabelText('Popup')).toBeInTheDocument();
  });

  it('should no render insert button when a whole column is selected', () => {
    selectColumns([1])(tableEditorView.state, tableEditorView.dispatch);

    component({
      insertColumnButtonIndex: 0,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });
    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });

  it('should not render insert button when a whole row is selected', () => {
    selectRows([1])(tableEditorView.state, tableEditorView.dispatch);

    component({
      insertRowButtonIndex: 0,
      editorView: tableEditorView,
      getEditorContainerWidth,
    });

    expect(screen.queryByLabelText('Popup')).toBeFalsy();
  });
});
