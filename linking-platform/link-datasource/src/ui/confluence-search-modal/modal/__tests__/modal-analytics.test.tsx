import { EVENT_CHANNEL } from '../../../../analytics';
import { DatasourceSearchMethod } from '../../../../analytics/types';

import { setup } from './_utils';

describe('Analytics: ConfluenceSearchConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire "screen.datasourceModalDialog.viewed" when the confluence modal is rendered', async () => {
    const { onAnalyticFireEvent } = await setup({
      dontWaitForSitesToLoad: true,
    });

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'screen',
          name: 'datasourceModalDialog',
          action: 'viewed',
          attributes: {},
        },
        context: [
          {
            component: 'datasourceConfigModal',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'confluence-search' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  it('should fire "ui.modal.ready.datasource" when modal is ready for the user to search and display data', async () => {
    const { onAnalyticFireEvent } = await setup({
      dontWaitForSitesToLoad: false,
    });

    expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
      {
        payload: {
          eventType: 'ui',
          action: 'ready',
          actionSubject: 'modal',
          actionSubjectId: 'datasource',
          attributes: {
            instancesCount: 8,
            schemasCount: null,
          },
        },
        context: [
          {
            component: 'datasourceConfigModal',
            source: 'datasourceConfigModal',
            attributes: { dataProvider: 'confluence-search' },
          },
        ],
      },
      EVENT_CHANNEL,
    );
  });

  describe('button clicked events', () => {
    const getEventPayload = (
      actionSubjectId: 'insert' | 'cancel',
      defaultAttributes = {},
      overrideAttributes = {},
      payloadOverride = {},
    ) => ({
      payload: {
        eventType: 'ui',
        actionSubject: 'button',
        action: 'clicked',
        actionSubjectId: actionSubjectId,
        ...payloadOverride,
        attributes: {
          ...defaultAttributes,
          ...overrideAttributes,
        },
      },
      context: [
        {
          component: 'datasourceConfigModal',
          source: 'datasourceConfigModal',
          attributes: { dataProvider: 'confluence-search' },
        },
      ],
    });

    describe('cancel', () => {
      const CANCEL_BUTTON_NAME = 'Cancel';
      let defaultAttributes = {};

      beforeEach(() => {
        defaultAttributes = {
          actions: [],
          searchCount: 0,
        };
      });

      describe('with search count attribute', () => {
        it('should fire "ui.button.clicked.cancel" with searchCount = 0 if a user did not search', async () => {
          const { assertAnalyticsAfterButtonClick } = await setup();
          await assertAnalyticsAfterButtonClick(
            CANCEL_BUTTON_NAME,
            getEventPayload('cancel', defaultAttributes),
          );
        });

        it('should fire "ui.button.clicked.cancel" with correct searchCount if a user searched using %p search multiple times', async () => {
          const expectedPayload = getEventPayload('cancel', {
            actions: ['query updated'],
            searchCount: 3,
            extensionKey: 'confluence-object-provider',
            destinationObjectTypes: [
              'page',
              'attachment',
              'blogpost',
              'space',
              'comment',
              'whiteboard',
              'database',
            ],
          });

          const { assertAnalyticsAfterButtonClick, searchWithNewBasic } =
            await setup();

          searchWithNewBasic('new_search');
          searchWithNewBasic('new_search2');
          searchWithNewBasic('new_search3');

          await assertAnalyticsAfterButtonClick(
            CANCEL_BUTTON_NAME,
            expectedPayload,
          );
        });
      });
    });

    describe('insert', () => {
      const INSERT_BUTTON_NAME = 'Insert results';
      let defaultAttributes = {};

      beforeEach(() => {
        defaultAttributes = {
          extensionKey: 'confluence-object-provider',
          destinationObjectTypes: [
            'page',
            'attachment',
            'blogpost',
            'space',
            'comment',
            'whiteboard',
            'database',
          ],
          searchCount: 0,
          totalItemCount: 3,
          actions: [],
        };
      });

      describe('with search attributes', () => {
        it('should fire the event with searchCount = 0 if a user did not search', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: [],
            searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
            searchCount: 0,
          });

          const { assertAnalyticsAfterButtonClick } = await setup();

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });

        it('should fire the event with searchMethod = "datasource_search_query" when the user searched using jql search and set searchCount to 1', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['query updated'],
            searchMethod: 'datasource_search_query',
            searchCount: 1,
          });

          const { assertAnalyticsAfterButtonClick, searchWithNewBasic } =
            await setup();

          await searchWithNewBasic('new_search');
          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });

        it('should fire the event with the last used searchMethod if user searched multiple times and update the searchCount accordingly', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['query updated'],
            searchMethod: 'datasource_search_query',
            searchCount: 3,
          });

          const { assertAnalyticsAfterButtonClick, searchWithNewBasic } =
            await setup();

          await searchWithNewBasic('basic_search');
          await searchWithNewBasic('basic_search_2');
          await searchWithNewBasic('basic_search_3');

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });
      });

      describe('with displayedColumnCount attribute', () => {
        it('should fire "ui.button.clicked.insert" with the latest displayedColumnCount', async () => {
          const expectedPayload = getEventPayload('insert', defaultAttributes, {
            actions: ['column added'],
            searchMethod: 'datasource_search_query',
            displayedColumnCount: 3,
          });

          // initial number of column = 2
          const { assertAnalyticsAfterButtonClick, updateVisibleColumnList } =
            await setup({ visibleColumnKeys: ['myColumn', 'secondColumn'] });

          // updating the number of columns to 3
          updateVisibleColumnList(['myColumn', 'secondColumn', 'other column']);

          await assertAnalyticsAfterButtonClick(
            INSERT_BUTTON_NAME,
            expectedPayload,
          );
        });
      });
    });
  });
});
