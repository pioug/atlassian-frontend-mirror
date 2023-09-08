import React from 'react';

import type { DatasourceAttributes } from '@atlaskit/adf-schema/schema';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { CardOptions } from '@atlaskit/editor-common/card';
import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { DATASOURCE_INNER_CONTAINER_CLASSNAME } from '@atlaskit/editor-common/styles';
import type { EditorAppearance } from '@atlaskit/editor-common/types';
import { setNodeSelection } from '@atlaskit/editor-common/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  a,
  datasourceBlockCard,
  doc,
  inlineCard,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import type { CardProps } from '@atlaskit/smart-card';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { createEventsQueue } from '../../../analytics/create-events-queue';
import { pluginKey } from '../../plugin-key';
import { getPluginState } from '../../util/state';

jest.mock('@atlaskit/link-datasource', () => ({
  ...jest.requireActual('@atlaskit/link-datasource'),
  DatasourceTableView: ({
    onVisibleColumnKeysChange,
  }: {
    onVisibleColumnKeysChange: (columnKeys: string[]) => void;
  }) => {
    return (
      <button
        data-testid="mock-datasource-table-view"
        onClick={() => onVisibleColumnKeysChange(['mock-new-column'])}
      >
        Mock Datasource Table View
      </button>
    );
  },
  __esModule: true,
}));

jest.mock('@atlaskit/smart-card', () => {
  const React = require('react');
  return {
    ...jest.requireActual<Object>('@atlaskit/smart-card'),
    Card: class Card extends React.Component<CardProps> {
      render() {
        this.props.onResolve({
          title: 'my-title',
          url: 'https://my.url.com',
        });
        return (
          <div
            className="smart-card-mock"
            data-isinline={this.props.appearance === 'inline'}
          >
            Smart Card Mock
          </div>
        );
      }
    },
  };
});

jest.mock('../../../analytics/create-events-queue', () => ({
  createEventsQueue: jest.fn(),
}));

describe('datasource', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();

  const editor = (
    doc: DocBuilder,
    appearance: EditorAppearance = 'full-page',
    cardPropsOverride?: Partial<CardOptions>,
  ) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        allowPanel: true,
        smartLinks: {},
        linking: {
          smartLinks: { allowDatasource: true, ...cardPropsOverride },
        },
        appearance,
      },
      pluginKey,
    });
  };

  const mockAdfAttributes: DatasourceAttributes = {
    layout: 'wide',
    datasource: {
      id: 'mock-datasource-id',
      parameters: {
        cloudId: 'mock-cloud-id',
        jql: 'JQL=MOCK',
      },
      views: [
        {
          type: 'table',
          properties: {
            columns: [{ key: 'column-1' }, { key: 'column-2' }],
          },
        },
      ],
    },
  };

  const mockAdfAttributesWithUrl: DatasourceAttributes = {
    layout: 'wide',
    url: 'https://mono.jira-dev.com/?jql=something',
    datasource: {
      id: 'mock-datasource-id',
      parameters: {
        cloudId: 'mock-cloud-id',
        jql: 'JQL=MOCK',
      },
      views: [
        {
          type: 'table',
          properties: {
            columns: [{ key: 'column-1' }, { key: 'column-2' }],
          },
        },
      ],
    },
  };

  it('should render the datasource component', async () => {
    const { editorView } = editor(
      doc(datasourceBlockCard(mockAdfAttributes)()),
    );
    expect(editorView.state.doc.content.childCount).toBe(1);
    expect(editorView.state.doc.content.firstChild?.attrs).toEqual({
      data: null,
      url: null,
      width: null,
      ...mockAdfAttributes,
    });
    const nodeDOM = editorView.nodeDOM(0);
    expect((nodeDOM as HTMLDivElement).innerHTML).toMatch(
      new RegExp(
        '<div class="[\\w- ]+" style="min-width: 100%;"><button data-testid="mock-datasource-table-view">Mock Datasource Table View</button></div>',
      ),
    );
  });

  it('should render inlineCard if allowDatasource prop is false', async () => {
    const url = 'https://hello.atlassian.com/?jql=testing';
    const { editorView } = editor(
      doc(
        datasourceBlockCard({
          ...mockAdfAttributes,
          url,
        })(),
      ),
      'full-page',
      {
        allowDatasource: false,
      },
    );
    expect(editorView.state.doc.content.childCount).toBe(1);
    expect(editorView.state.doc.content.firstChild?.attrs).toEqual({
      data: null,
      width: null,
      ...mockAdfAttributes,
      url,
    });
    const nodeDOM = editorView.nodeDOM(0);
    expect((nodeDOM as HTMLDivElement).innerHTML).toContain(
      '<div class="smart-card-mock" data-isinline="true">Smart Card Mock</div>',
    );
  });

  it('should fallback to the inline card on platform="mobile" when datasource is provided with url', async () => {
    const { editorView } = editor(
      doc(datasourceBlockCard(mockAdfAttributesWithUrl)()),
      'mobile',
    );
    expect(editorView.state.doc.content.childCount).toBe(1);
    expect(editorView.state.doc.content.firstChild?.attrs).toEqual({
      data: null,
      url: null,
      width: null,
      ...mockAdfAttributesWithUrl,
    });
    const nodeDOM = editorView.nodeDOM(0);
    expect((nodeDOM as HTMLDivElement).innerHTML).toContain(
      '<div class="smart-card-mock" data-isinline="true">Smart Card Mock</div>',
    );
  });

  it(`should fallback to the inline card on platform="mobile"
    which fails to UnsupportedContent when datasource is provided without url`, async () => {
    const { editorView } = editor(
      doc(datasourceBlockCard(mockAdfAttributes)()),
      'mobile',
    );
    expect(editorView.state.doc.content.childCount).toBe(1);
    expect(editorView.state.doc.content.firstChild?.attrs).toEqual({
      data: null,
      url: null,
      width: null,
      ...mockAdfAttributes,
    });
    const nodeDOM = editorView.nodeDOM(0);
    expect((nodeDOM as HTMLDivElement).innerHTML).toContain(
      '<div class="smart-card-mock" data-isinline="true">Smart Card Mock</div>',
    );
  });

  it('should set datasourceTableRef correctly when datasource table is selected/unselected', async () => {
    const { editorView } = editor(
      doc(p('{<>}hello'), datasourceBlockCard(mockAdfAttributes)()),
    );

    const initalState = getPluginState(editorView.state);
    expect(initalState?.datasourceTableRef).toBeUndefined();

    setNodeSelection(editorView, 7);

    const datasourceTargetEl = editorView.dom.querySelector(
      `.${DATASOURCE_INNER_CONTAINER_CLASSNAME}`,
    );
    const stateOnSelection = getPluginState(editorView.state);
    expect(stateOnSelection?.datasourceTableRef).toEqual(datasourceTargetEl);

    setNodeSelection(editorView, 0);

    const stateAfterSelection = getPluginState(editorView.state);
    expect(stateAfterSelection?.datasourceTableRef).toBeUndefined();
  });

  it('should call dispatch once per selection and de-selection', async () => {
    const { editorView } = editor(
      doc(p('{<>}hello'), datasourceBlockCard(mockAdfAttributes)()),
    );

    const initalState = getPluginState(editorView.state);
    expect(initalState?.layout).toEqual('wide');

    const mockDispatch = jest.fn();
    editorView.dispatch = mockDispatch;

    setNodeSelection(editorView, 7);
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    mockDispatch.mockReset();

    setNodeSelection(editorView, 0);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should update layout when the datasource layout button is pressed', async () => {
    const eventDispatcher = new EventDispatcher();
    let createAnalyticsEvent = jest.fn(
      () => ({ fire() {} } as UIAnalyticsEvent),
    );

    const { editorView, contentComponents } = editor(
      doc(p('hello'), datasourceBlockCard(mockAdfAttributes)()),
    );
    const [, , , layoutButtonComponent] = contentComponents;
    const wrapper = renderWithIntl(
      layoutButtonComponent({
        editorView,
        editorActions: null as any,
        eventDispatcher,
        providerFactory,
        appearance: 'full-page',
        disabled: false,
        containerElement: null,
        dispatchAnalyticsEvent: createAnalyticsEvent,
        wrapperElement: null,
      })!,
    );
    const layoutButton = wrapper.getByTestId('datasource-table-layout-button');

    const stateWithLayoutAsWide = getPluginState(editorView.state);
    expect(stateWithLayoutAsWide?.layout).toEqual('wide');

    layoutButton.click();

    const stateWithLayoutAsFullWidth = getPluginState(editorView.state);
    expect(stateWithLayoutAsFullWidth?.layout).toEqual('full-width');

    layoutButton.click();

    const stateWithLayoutAsCenter = getPluginState(editorView.state);
    expect(stateWithLayoutAsCenter?.layout).toEqual('center');
  });

  describe('should be able to quick insert based on the FF state', () => {
    ffTest(
      'platform.linking-platform.datasource-jira_issues',
      async () => {
        const { editorView, typeAheadTool, pluginState } = editor(
          doc(p('{<>}')),
        );
        expect(pluginState?.datasourceModalType).toBeUndefined();
        expect(pluginState?.showDatasourceModal).toEqual(false);

        const insertItems = await typeAheadTool.searchQuickInsert('jira');
        const [jiraQuickInsertItem] = (await insertItems.result()) || [];

        expect(jiraQuickInsertItem).toEqual(
          expect.objectContaining({
            title: 'Jira Issues',
            description:
              'Insert Jira issues from Jira Cloud with enhanced search, filtering, and configuration.',
          }),
        );

        await typeAheadTool.searchQuickInsert('jira')?.insert({ index: 0 });

        const pluginStateAfterQuickInsert = getPluginState(editorView.state);
        expect(pluginStateAfterQuickInsert?.datasourceModalType).toEqual(
          'jira',
        );
        expect(pluginStateAfterQuickInsert?.showDatasourceModal).toEqual(true);
      },
      async () => {
        const { editorView, typeAheadTool, pluginState } = editor(
          doc(p('{<>}')),
        );
        expect(pluginState?.datasourceModalType).toBeUndefined();
        expect(pluginState?.showDatasourceModal).toEqual(false);

        await typeAheadTool.searchQuickInsert('jira')?.insert({ index: 0 });

        const pluginStateAfterQuickInsert = getPluginState(editorView.state);
        expect(
          pluginStateAfterQuickInsert?.datasourceModalType,
        ).toBeUndefined();
        expect(pluginStateAfterQuickInsert?.showDatasourceModal).toEqual(false);
      },
    );

    ffTest(
      'platform.linking-platform.datasource-assets_objects',
      async () => {
        const { editorView, typeAheadTool, pluginState } = editor(
          doc(p('{<>}')),
        );
        expect(pluginState?.datasourceModalType).toBeUndefined();
        expect(pluginState?.showDatasourceModal).toEqual(false);

        const insertItems = typeAheadTool.searchQuickInsert('assets');
        const [assetsQuickInsertItem] = (await insertItems.result()) || [];

        expect(assetsQuickInsertItem).toEqual(
          expect.objectContaining({
            title: 'Assets',
            description:
              'Insert objects from Assets in Jira Service Management with search and filtering',
          }),
        );

        await typeAheadTool.searchQuickInsert('assets')?.insert({ index: 0 });

        const pluginStateAfterQuickInsert = getPluginState(editorView.state);
        expect(pluginStateAfterQuickInsert?.datasourceModalType).toEqual(
          'assets',
        );
        expect(pluginStateAfterQuickInsert?.showDatasourceModal).toEqual(true);
      },
      async () => {
        const { editorView, typeAheadTool, pluginState } = editor(
          doc(p('{<>}')),
        );
        expect(pluginState?.datasourceModalType).toBeUndefined();
        expect(pluginState?.showDatasourceModal).toEqual(false);

        await typeAheadTool.searchQuickInsert('assets')?.insert({ index: 0 });

        const pluginStateAfterQuickInsert = getPluginState(editorView.state);
        expect(
          pluginStateAfterQuickInsert?.datasourceModalType,
        ).toBeUndefined();
        expect(pluginStateAfterQuickInsert?.showDatasourceModal).toEqual(false);
      },
    );
  });

  describe('when using feature flag', () => {
    const url = 'https://www.atlassian.com/';

    const mockAdfAttributesWithRealJiraId = {
      ...mockAdfAttributes,
      url,
      datasource: {
        ...mockAdfAttributes.datasource,
        id: JIRA_LIST_OF_LINKS_DATASOURCE_ID,
      },
    };

    ffTest(
      'platform.linking-platform.datasource-jira_issues',
      () => {
        const { editorView } = editor(
          doc(datasourceBlockCard(mockAdfAttributesWithRealJiraId)()),
        );
        const nodeDOM = editorView.nodeDOM(0);
        expect((nodeDOM as HTMLDivElement).innerHTML).toMatch(
          new RegExp(
            '<div class="[\\w- ]+" style="min-width: 100%;"><button data-testid="mock-datasource-table-view">Mock Datasource Table View</button></div>',
          ),
        );
      },
      () => {
        const { editorView } = editor(
          doc(datasourceBlockCard(mockAdfAttributesWithRealJiraId)()),
        );
        const nodeDOM = editorView.nodeDOM(0);

        expect((nodeDOM as HTMLDivElement).innerHTML).toContain(
          '<div class="smart-card-mock" data-isinline="true">Smart Card Mock</div>',
        );

        expect((nodeDOM as HTMLDivElement).innerHTML).not.toMatch(
          new RegExp(`data-testid="mock-datasource-table-view"`),
        );
      },
    );
  });
});

describe('analytics events queue', () => {
  const mockAnalyticsQueue = {
    push: jest.fn(),
    flush: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    asMock(createEventsQueue).mockReturnValue(mockAnalyticsQueue);
  });

  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder, featureFlags?: Record<string, boolean>) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        featureFlags,
        smartLinks: {},
      },
      pluginKey,
    });
  };

  it('should enable dispatch of events if `lp-analytics-events-next` is provided as `true`', () => {
    const url = 'https://atlassian.com';
    editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {
        'lp-analytics-events-next': true,
      },
    );

    expect(createEventsQueue).toHaveBeenCalled();
  });

  it('should disable dispatch of events if `lp-analytics-events-next` is not provided', () => {
    const url = 'https://atlassian.com';
    editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {},
    );

    expect(createEventsQueue).not.toHaveBeenCalled();
  });

  it('should not initialise events queue if `lp-analytics-events-next` is provided as `false`', () => {
    const url = 'https://atlassian.com';
    editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {
        'lp-analytics-events-next': false,
      },
    );

    expect(createEventsQueue).not.toHaveBeenCalled();
  });

  it('should flush events when the editor updates and flush should always be called after push', () => {
    let lastCalled = null;
    mockAnalyticsQueue.push.mockImplementation(() => {
      lastCalled = mockAnalyticsQueue.push;
    });
    mockAnalyticsQueue.flush.mockImplementation(() => {
      lastCalled = mockAnalyticsQueue.flush;
    });
    const url = 'https://atlassian.com';
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
      {
        'lp-analytics-events-next': true,
      },
    );

    expect(mockAnalyticsQueue.push).toHaveBeenCalled();
    expect(mockAnalyticsQueue.flush).toHaveBeenCalled();
    expect(lastCalled).toBe(mockAnalyticsQueue.flush);

    mockAnalyticsQueue.push.mockClear();
    mockAnalyticsQueue.flush.mockClear();

    editorView.dispatch(
      editorView.state.tr.insert(
        0,
        a({ href: url })('Some link')(editorView.state.schema),
      ),
    );

    expect(mockAnalyticsQueue.push).toHaveBeenCalled();
    expect(mockAnalyticsQueue.flush).toHaveBeenCalled();
    expect(lastCalled).toBe(mockAnalyticsQueue.flush);
  });
});
