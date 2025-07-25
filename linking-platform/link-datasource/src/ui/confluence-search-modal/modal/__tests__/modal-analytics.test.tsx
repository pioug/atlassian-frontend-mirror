import { waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';

import { asMock } from '@atlaskit/link-test-helpers/jest';
import { type DatasourceTableStatusType } from '@atlaskit/linking-types';

import { EVENT_CHANNEL } from '../../../../analytics';
import { DatasourceSearchMethod } from '../../../../analytics/types';
import { type DatasourceTableState } from '../../../../hooks/useDatasourceTableState';
import { useCurrentUserInfo } from '../../basic-filters/hooks/useCurrentUserInfo';

import {
	getDefaultHookState,
	getEmptyHookState,
	getErrorHookState,
	getLoadingHookState,
	getUnauthorisedHookState,
	setup,
	useDatasourceTableState,
} from './_utils';

jest.mock('../../basic-filters/hooks/useCurrentUserInfo');

describe('Analytics: ConfluenceSearchConfigModal', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		asMock(useCurrentUserInfo).mockReturnValue({
			user: {
				accountId: '123',
			},
		});
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

		await waitFor(() => {
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
	});

	it('should fire "ui.emptyResult.shown.datasource" when datasource results are empty', async () => {
		const { onAnalyticFireEvent } = await setup({
			hookState: { ...getDefaultHookState(), responseItems: [] },
		});

		expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					action: 'shown',
					actionSubject: 'emptyResult',
					actionSubjectId: 'datasource',
					attributes: {},
					eventType: 'ui',
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

	it('should fire "ui.error.shown" with reason as "access" when the user unauthorised', async () => {
		const { onAnalyticFireEvent } = await setup({
			hookState: { ...getErrorHookState(), status: 'unauthorized' },
		});

		expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					action: 'shown',
					actionSubject: 'error',
					attributes: {
						reason: 'access',
					},
					eventType: 'ui',
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

	it('should fire "ui.error.shown" with reason as "network" when the user request failed', async () => {
		const { onAnalyticFireEvent } = await setup({
			hookState: { ...getErrorHookState() },
		});

		expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					action: 'shown',
					actionSubject: 'error',
					attributes: {
						reason: 'network',
					},
					eventType: 'ui',
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

		const actionAttributeTests = (
			actionSubjectId: 'insert' | 'cancel',
			buttonName: 'Insert results' | 'Cancel',
			defaultAttributes: any,
		) => {
			describe('with "actions" attribute', () => {
				const getExpectedPayload = (overrideAttributes = {}) => {
					return getEventPayload(actionSubjectId, defaultAttributes, overrideAttributes);
				};

				it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "instance updated" when user selected a new site, searched for results and then clicked the ${buttonName} button`, async () => {
					const { selectNewInstanceSite, assertAnalyticsAfterButtonClick, searchWithNewBasic } =
						await setup();

					await selectNewInstanceSite();

					if (actionSubjectId === 'insert') {
						await searchWithNewBasic();
					}

					await assertAnalyticsAfterButtonClick(
						buttonName,
						getExpectedPayload({
							actions: ['instance updated'],
						}),
					);
				});

				it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "query updated" when user searched with a new query and then clicked the ${buttonName} button`, async () => {
					const { searchWithNewBasic, assertAnalyticsAfterButtonClick } = await setup();

					await searchWithNewBasic();

					await assertAnalyticsAfterButtonClick(
						buttonName,
						getExpectedPayload({
							actions: ['query updated'],
							searchCount: 1,
						}),
					);
				});

				it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "display view changed" and display = "datasource_inline" when user changed the view and then clicked the ${buttonName} button`, async () => {
					const { assertAnalyticsAfterButtonClick } = await setup({
						viewMode: 'inline',
					});

					await assertAnalyticsAfterButtonClick(
						buttonName,
						getExpectedPayload({
							actions: ['display view changed'],
						}),
					);
				});

				it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "column added" when the user added a new column and then clicked the ${buttonName} button`, async () => {
					const {
						getLatestIssueLikeTableProps,
						updateVisibleColumnList,
						assertAnalyticsAfterButtonClick,
					} = await setup();

					const { visibleColumnKeys } = getLatestIssueLikeTableProps();

					updateVisibleColumnList([...visibleColumnKeys, 'additionalColumn']);

					await assertAnalyticsAfterButtonClick(
						buttonName,
						getExpectedPayload({
							actions: ['column added'],
						}),
					);
				});

				it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "column removed" when the user removed one column and then clicked the ${buttonName} button`, async () => {
					const { assertAnalyticsAfterButtonClick, updateVisibleColumnList } = await setup({
						visibleColumnKeys: ['myColumn', 'otherColumn'],
					});

					updateVisibleColumnList(['myColumn']);

					await assertAnalyticsAfterButtonClick(
						buttonName,
						getExpectedPayload({
							actions: ['column removed'],
						}),
					);
				});

				it(`should fire "ui.button.clicked.${actionSubjectId}" with action = "column reordered" when the user reorders one column and then clicked the ${buttonName} button`, async () => {
					const { assertAnalyticsAfterButtonClick, updateVisibleColumnList } = await setup({
						visibleColumnKeys: ['myColumn', 'secondColumn'],
					});

					updateVisibleColumnList(['myColumn', 'otherColumn']);
					updateVisibleColumnList(['otherColumn', 'myColumn']);

					await assertAnalyticsAfterButtonClick(
						buttonName,
						getExpectedPayload({
							actions: ['column reordered'],
						}),
					);
				});
			});
		};

		describe('insert', () => {
			const INSERT_BUTTON_NAME = 'Insert results';
			const INSERT_ACTION_SUBJECT_ID = 'insert';
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

			actionAttributeTests(INSERT_ACTION_SUBJECT_ID, INSERT_BUTTON_NAME, defaultAttributes);

			describe('with "display" attribute', () => {
				it('should fire "ui.button.clicked.insert" with display "datasource_table" when the insert button is clicked and results are presented as a table', async () => {
					const { assertAnalyticsAfterButtonClick } = await setup();
					await assertAnalyticsAfterButtonClick(
						INSERT_BUTTON_NAME,
						getEventPayload('insert', defaultAttributes),
					);
				});

				it('should fire "ui.button.clicked.insert" with display "inline" when the insert button is clicked in inline view', async () => {
					const expectedPayload = getEventPayload('insert', defaultAttributes, {
						totalItemCount: 1,
						display: 'datasource_inline',
						actions: ['display view changed'],
					});

					const { assertAnalyticsAfterButtonClick } = await setup({
						hookState: {
							...getDefaultHookState(),
							responseItems: [
								{
									myColumn: { data: 'some-value' },
									otherColumn: { data: 'other-column-value' },
									myId: { data: 'some-id1' },
								},
							],
							totalCount: 1,
						},
						viewMode: 'inline',
					});

					await assertAnalyticsAfterButtonClick(INSERT_BUTTON_NAME, expectedPayload);
				});

				it('payload should contain "datasource_table" as display option when the insert button is clicked and results are presented in issue view', async () => {
					const expectedPayload = getEventPayload('insert', defaultAttributes, {
						totalItemCount: 1,
						displayedColumnCount: 1,
						display: 'datasource_table',
					});

					const { assertAnalyticsAfterButtonClick } = await setup({
						hookState: {
							...getDefaultHookState(),
							responseItems: [
								{
									key: { data: { url: 'some-value' } },
								},
							],
							totalCount: 1,
						},
					});

					await assertAnalyticsAfterButtonClick(INSERT_BUTTON_NAME, expectedPayload);
				});

				it('should fire "ui.button.clicked.insert" with display "datasource_inline" when the insert button is clicked and results are presented as an inline issue', async () => {
					const expectedPayload = getEventPayload('insert', defaultAttributes, {
						actions: ['display view changed'],
						display: 'datasource_inline',
					});

					const { assertAnalyticsAfterButtonClick } = await setup({
						viewMode: 'inline',
					});

					await assertAnalyticsAfterButtonClick(INSERT_BUTTON_NAME, expectedPayload);
				});
			});

			describe('with search attributes', () => {
				it('should fire the event with searchCount = 0 if a user did not search', async () => {
					const expectedPayload = getEventPayload('insert', defaultAttributes, {
						actions: [],
						searchMethod: DatasourceSearchMethod.DATASOURCE_SEARCH_QUERY,
						searchCount: 0,
					});

					const { assertAnalyticsAfterButtonClick } = await setup();

					await assertAnalyticsAfterButtonClick(INSERT_BUTTON_NAME, expectedPayload);
				});

				it('should fire the event with searchMethod = "datasource_search_query" when the user searched using basic search and set searchCount to 1', async () => {
					const expectedPayload = getEventPayload('insert', defaultAttributes, {
						actions: ['query updated'],
						searchMethod: 'datasource_search_query',
						searchCount: 1,
					});

					const { assertAnalyticsAfterButtonClick, searchWithNewBasic } = await setup();

					await searchWithNewBasic('new_search');
					await assertAnalyticsAfterButtonClick(INSERT_BUTTON_NAME, expectedPayload);
				});

				it('should fire the event with the last used searchMethod if user searched multiple times and update the searchCount accordingly', async () => {
					const expectedPayload = getEventPayload('insert', defaultAttributes, {
						actions: ['query updated'],
						searchMethod: 'datasource_search_query',
						searchCount: 3,
					});

					const { assertAnalyticsAfterButtonClick, searchWithNewBasic } = await setup();

					await searchWithNewBasic('basic_search');
					await searchWithNewBasic('basic_search_2');
					await searchWithNewBasic('basic_search_3');

					await assertAnalyticsAfterButtonClick(INSERT_BUTTON_NAME, expectedPayload);
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
					const { assertAnalyticsAfterButtonClick, updateVisibleColumnList } = await setup({
						visibleColumnKeys: ['myColumn', 'secondColumn'],
					});

					// updating the number of columns to 3
					updateVisibleColumnList(['myColumn', 'secondColumn', 'other column']);

					await assertAnalyticsAfterButtonClick(INSERT_BUTTON_NAME, expectedPayload);
				});
			});
		});

		describe('cancel', () => {
			const CANCEL_BUTTON_NAME = 'Cancel';
			const CANCEL_BUTTON_ACTION_SUBJECT_ID = 'cancel';
			let defaultAttributes = {};

			beforeEach(() => {
				defaultAttributes = {
					actions: [],
					searchCount: 0,
				};
			});

			actionAttributeTests(CANCEL_BUTTON_ACTION_SUBJECT_ID, CANCEL_BUTTON_NAME, defaultAttributes);

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

					const { assertAnalyticsAfterButtonClick, searchWithNewBasic } = await setup();

					searchWithNewBasic('new_search');
					searchWithNewBasic('new_search2');
					searchWithNewBasic('new_search3');

					await assertAnalyticsAfterButtonClick(CANCEL_BUTTON_NAME, expectedPayload);
				});
			});
		});
	});

	describe('viewed events', () => {
		const linkActionSubject = 'link';
		const tableActionSubject = 'table';

		const unresolvedTestCases: [DatasourceTableStatusType, DatasourceTableState][] = [
			['unauthorized', getUnauthorisedHookState()],
			['empty', getEmptyHookState()],
			['loading', getLoadingHookState()],
		];

		const getEventPayload = (
			actionSubject: 'link' | 'table',
			actionSubjectId: 'singleItem' | 'count' | 'datasourceConfigModal',
			overrideAttributes = {},
			payloadOverride = {},
		) => ({
			payload: {
				eventType: 'ui',
				actionSubject: actionSubject,
				action: 'viewed',
				actionSubjectId: actionSubjectId,
				...payloadOverride,
				attributes: {
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
					searchMethod: 'datasource_search_query',
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

		describe('link viewed count', () => {
			const countActionSubjectId = 'count';

			const defaultAttributes = {
				totalItemCount: 3,
			};

			it('should fire "ui.link.viewed.count" event once when inline is viewed', async () => {
				const { onAnalyticFireEvent } = await setup({
					viewMode: 'inline',
				});

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					getEventPayload(linkActionSubject, countActionSubjectId, defaultAttributes),
					EVENT_CHANNEL,
				);
			});

			it.each(unresolvedTestCases)(
				'should not fire "ui.link.viewed.count" when status is %s',
				async (status, hookState) => {
					const { onAnalyticFireEvent } = await setup({
						hookState,
						viewMode: 'inline',
					});

					expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
						getEventPayload(linkActionSubject, countActionSubjectId, defaultAttributes),
						EVENT_CHANNEL,
					);
				},
			);
		});

		describe('table viewed', () => {
			const datasourceConfigModalActionSubjectId = 'datasourceConfigModal';

			const defaultAttributes = {
				totalItemCount: 3,
				displayedColumnCount: 1,
			};

			it('should fire "ui.table.viewed.datasourceConfigModal" event when status is resolved, table mode is on', async () => {
				const { onAnalyticFireEvent } = await setup();

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					getEventPayload(
						tableActionSubject,
						datasourceConfigModalActionSubjectId,
						defaultAttributes,
					),
					EVENT_CHANNEL,
				);
			});

			it('should fire "ui.table.viewed.datasourceConfigModal" event with defaultDisplayedColumns when status is resolved and there are no visibleColumnKeys passed with props', async () => {
				const { onAnalyticFireEvent } = await setup({
					visibleColumnKeys: [],
					hookState: {
						...getDefaultHookState(),
						defaultVisibleColumnKeys: ['myColumn', 'otherColumn', 'someOtherColumn', 'andOneMore'],
					},
				});

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					getEventPayload(tableActionSubject, datasourceConfigModalActionSubjectId, {
						...defaultAttributes,
						displayedColumnCount: 4,
					}),
					EVENT_CHANNEL,
				);
			});

			it.each(unresolvedTestCases)(
				'should not fire "ui.table.viewed.datasourceConfigModal" event when status is %s',
				async (status, hookState) => {
					const { onAnalyticFireEvent } = await setup({
						hookState: hookState,
					});

					expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
						getEventPayload(
							tableActionSubject,
							datasourceConfigModalActionSubjectId,
							defaultAttributes,
						),
						EVENT_CHANNEL,
					);
				},
			);

			it('should not fire "ui.table.viewed.datasourceConfigModal" event when totalCount is undefined', async () => {
				const { onAnalyticFireEvent } = await setup({
					hookState: {
						...getDefaultHookState(),
						totalCount: undefined,
					},
				});

				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(
						tableActionSubject,
						datasourceConfigModalActionSubjectId,
						defaultAttributes,
					),
					EVENT_CHANNEL,
				);
			});

			it('should not fire when user changes visibleColumnKeys', async () => {
				// initial number of column = 2
				const { updateVisibleColumnList, onAnalyticFireEvent } = await setup({
					visibleColumnKeys: ['myColumn', 'secondColumn'],
				});

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					getEventPayload(tableActionSubject, datasourceConfigModalActionSubjectId, {
						...defaultAttributes,
						displayedColumnCount: 2,
					}),
					EVENT_CHANNEL,
				);

				// All rendering is finished when analytics has been fired three times
				await waitFor(() => {
					expect(onAnalyticFireEvent).toHaveBeenCalledTimes(3);
				});

				// adding a new column
				act(() => {
					updateVisibleColumnList(['myColumn', 'secondColumn', 'other column']);
				});
				expect(onAnalyticFireEvent).toHaveBeenCalledTimes(3);
				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(tableActionSubject, datasourceConfigModalActionSubjectId, {
						...defaultAttributes,
						displayedColumnCount: 3,
					}),
					EVENT_CHANNEL,
				);

				// re-arranging the columns
				act(() => {
					updateVisibleColumnList(['secondColumn', 'myColumn', 'other column']);
				});

				expect(onAnalyticFireEvent).toHaveBeenCalledTimes(3);
				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(tableActionSubject, datasourceConfigModalActionSubjectId, {
						...defaultAttributes,
						displayedColumnCount: 3,
					}),
					EVENT_CHANNEL,
				);

				// removing 2 columns
				act(() => {
					updateVisibleColumnList(['secondColumn']);
				});

				expect(onAnalyticFireEvent).toHaveBeenCalledTimes(3);
				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(tableActionSubject, datasourceConfigModalActionSubjectId, {
						...defaultAttributes,
						displayedColumnCount: 1,
					}),
					EVENT_CHANNEL,
				);
			});

			it('should fire "ui.table.viewed.datasourceConfigModal" event with correct displayedColumnCount when user searches from empty modal for the first time', async () => {
				// first render, mimicking an empty state when a user opens a modal config for the first time with no data
				const { onAnalyticFireEvent, renderComponent } = await setup({
					hookState: getEmptyHookState(),
					visibleColumnKeys: [],
				});

				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(
						tableActionSubject,
						datasourceConfigModalActionSubjectId,
						defaultAttributes,
					),
					EVENT_CHANNEL,
				);

				// second render, mimicking a case when the BE response is received and we set resolved state, but haven't updated visible columns yet
				asMock(useDatasourceTableState).mockReturnValue({
					...getDefaultHookState(),
					defaultVisibleColumnKeys: [],
				});
				renderComponent();

				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(tableActionSubject, datasourceConfigModalActionSubjectId, {
						...defaultAttributes,
						displayedColumnCount: 0,
					}),
					EVENT_CHANNEL,
				);

				// third render, mimicking a case when the BE response is received and we set all data into state
				asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());
				renderComponent();

				expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
					getEventPayload(tableActionSubject, datasourceConfigModalActionSubjectId, {
						...defaultAttributes,
						displayedColumnCount: 2,
					}),
					EVENT_CHANNEL,
				);
			});
		});
	});

	it('should capture and report a11y violations', async () => {
		const { component } = await setup();

		await expect(component.container).toBeAccessible();
	});
});
