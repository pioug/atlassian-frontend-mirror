import { setup } from './_utils';

describe('Analytics: ConfluenceSearchConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        it('should not fire the event if a user did not search', async () => {
          const { onAnalyticFireEvent } = await setup();

          expect(onAnalyticFireEvent).not.toHaveBeenCalled();
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
