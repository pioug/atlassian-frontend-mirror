import { setup } from './_utils';

describe('Analytics: ConfluenceSearchConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('button clicked events', () => {
    const getEventPayload = (
      actionSubjectId: 'cancel',
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
  });
});
