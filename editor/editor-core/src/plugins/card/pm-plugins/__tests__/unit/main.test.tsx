import React from 'react';

jest.mock('@atlaskit/link-datasource', () => ({
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

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  inlineCard,
  datasourceBlockCard,
  DocBuilder,
  a,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  CardAdf,
  CardAppearance,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
import { DatasourceAttributes } from '@atlaskit/adf-schema/schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { Request } from '../../../types';
import { INPUT_METHOD } from '../../../../analytics/types';
import { pluginKey } from '../../plugin-key';
import { createAnalyticsQueue } from '../../analytics/create-analytics-queue';
import { resolveWithProvider } from '../../util/resolve';
import { setNodeSelection } from '@atlaskit/editor-common/utils';
import { getPluginState } from '../../util/state';
import { DATASOURCE_INNER_CONTAINER_CLASSNAME } from '@atlaskit/editor-common/styles';

import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';

const mockAnalyticsQueue = {
  push: jest.fn(),
  flush: jest.fn(),
  canDispatch: jest.fn(() => true),
};

jest.mock('../../analytics/create-analytics-queue', () => ({
  createAnalyticsQueue: jest.fn(() => mockAnalyticsQueue),
}));

describe('resolveWithProvider()', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();
  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        allowPanel: true,
        smartLinks: {},
      },
      pluginKey,
    });
  };

  class TestCardProvider implements CardProvider {
    resolve = jest.fn().mockReturnValue(Promise.resolve({}));
    async findPattern(): Promise<boolean> {
      return true;
    }
  }

  let cardProvider: CardProvider;

  beforeEach(() => {
    cardProvider = new TestCardProvider();
  });

  it('should resolve with the right request appearance', async () => {
    const url = 'https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing';
    const request: Request = {
      appearance: 'block',
      compareLinkText: false,
      pos: 0,
      source: INPUT_METHOD.MANUAL,
      shouldReplaceLink: true,
      url,
    };
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
    );
    const options = { allowBlockCards: true };
    await resolveWithProvider(
      editorView,
      cardProvider,
      request,
      options,
      undefined,
      undefined,
    );
    expect(cardProvider.resolve).toHaveBeenCalledTimes(1);
    expect(cardProvider.resolve).toBeCalledWith(url, 'block', true);
  });

  it('should set shouldForceAppearance as false in case input source is Manual, but shouldReplaceLink flag is false', async () => {
    const url = 'https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing';
    const request: Request = {
      appearance: 'block',
      compareLinkText: false,
      pos: 0,
      source: INPUT_METHOD.MANUAL,
      shouldReplaceLink: false,
      url,
    };
    const { editorView } = editor(
      doc(
        p(
          '{<node>}',
          inlineCard({
            url,
          })(),
        ),
      ),
    );
    const options = { allowBlockCards: true };
    await resolveWithProvider(
      editorView,
      cardProvider,
      request,
      options,
      undefined,
      undefined,
    );
    expect(cardProvider.resolve).toHaveBeenCalledTimes(1);
    expect(cardProvider.resolve).toBeCalledWith(url, 'block', false);
  });

  describe('Allowed card type', () => {
    it.each([
      ['block', 'blockCard', false, true],
      ['embed', 'embedCard', true, false],
    ])(
      'resolves fallback to inline if %s card is not allowed',
      async (appearance, type, allowBlockCards, allowEmbeds) => {
        const url = 'https://atlassian.slack.com/archives/CR54/p123456';

        const testCardProvider = new TestCardProvider();
        const spy = jest.spyOn(testCardProvider, 'resolve').mockResolvedValue({
          type,
          attrs: { url, ...(type === 'embedCard' && { layout: 'wide' }) },
        });

        const request: Request = {
          appearance: appearance as CardAppearance,
          compareLinkText: false,
          pos: 0,
          source: INPUT_METHOD.MANUAL,
          url,
        };
        const { editorView } = editor(
          doc(p('{<node>}', inlineCard({ url })())),
        );
        const options = { allowBlockCards, allowEmbeds };
        const cardAdf = (await resolveWithProvider(
          editorView,
          testCardProvider,
          request,
          options,
          undefined,
          undefined,
        )) as CardAdf;

        expect(testCardProvider.resolve).toBeCalledWith(url, appearance, false);
        expect(cardAdf.type).toEqual('inlineCard');

        if (type === 'embedCard' && !allowEmbeds) {
          expect(cardAdf.attrs).not.toHaveProperty('layout');
        }

        spy.mockRestore();
      },
    );
  });
});

describe('datasource', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        allowPanel: true,
        smartLinks: {},
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
        '<div class="[\\w- ]+"><button data-testid="mock-datasource-table-view">Mock Datasource Table View</button></div>',
      ),
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
            '<div class="[\\w- ]+"><button data-testid="mock-datasource-table-view">Mock Datasource Table View</button></div>',
          ),
        );
      },
      () => {
        const { editorView } = editor(
          doc(datasourceBlockCard(mockAdfAttributesWithRealJiraId)()),
        );
        const nodeDOM = editorView.nodeDOM(0);

        expect((nodeDOM as HTMLDivElement).innerHTML).toMatch(
          new RegExp(`href="${url}"`),
        );

        expect((nodeDOM as HTMLDivElement).innerHTML).not.toMatch(
          new RegExp(`data-testid="mock-datasource-table-view"`),
        );
      },
    );
  });
});

describe('analytics queue', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
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

    expect(createAnalyticsQueue).toHaveBeenCalledWith(true);
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

    expect(createAnalyticsQueue).toHaveBeenCalledWith(false);
  });

  it('should disable dispatch of events if `lp-analytics-events-next` is provided as `false`', () => {
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

    expect(createAnalyticsQueue).toHaveBeenCalledWith(false);
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
