import React from 'react';

import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { type JQLEditorProps } from '@atlaskit/jql-editor';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import {
	fieldValuesResponseForStatusesMapped,
	mockSiteData,
} from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { type InlineCardAdf } from '@atlaskit/linking-common/types';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { useBasicFilterAGG } from '../../../../services/useBasicFilterAGG';
import { type SelectOption } from '../../../common/modal/popup-select/types';
import { LINK_TYPE_TEST_ID } from '../../../issue-like-table/render-type/link';
import { type IssueLikeDataTableViewProps } from '../../../issue-like-table/types';
import { useFilterOptions } from '../../basic-filters/hooks/useFilterOptions';
import JiraIssuesConfigModal from '../../index'; // Using async one to test lazy integration at the same time
import { type JiraIssuesDatasourceAdf } from '../../types';

import {
	getAvailableSites,
	getDefaultHookState,
	getDefaultParameters,
	getEmptyHookState,
	getErrorHookState,
	getInsertAnalyticPayload,
	getLoadingHookState,
	getSingleResponseItemHookState,
	IssueLikeDataTableView,
	JQLEditor,
	setup,
	useDatasourceTableState,
} from './_utils';

mockSimpleIntersectionObserver(); // for smart link rendering

jest.mock('../../basic-filters/hooks/useFilterOptions');
jest.mock('../../../../services/useBasicFilterAGG', () => {
	const originalModule = jest.requireActual('../../../../services/useBasicFilterAGG');
	return {
		...originalModule,
		useBasicFilterAGG: jest.fn(),
	};
});
jest.useFakeTimers();

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('JiraIssuesConfigModal', () => {
	const user = userEvent.setup({ delay: null });

	beforeEach(() => {
		jsdom.reconfigure({
			url: 'https://hello.atlassian.net',
		});
	});

	beforeEach(() => {
		jest.clearAllMocks();
		asMock(useFilterOptions).mockReturnValue({
			filterOptions: fieldValuesResponseForStatusesMapped as SelectOption[],
			status: 'resolved',
			fetchFilterOptions: jest.fn(),
			reset: jest.fn(),
		});
		const getHydratedJQL = jest.fn().mockResolvedValue(fieldValuesResponseForStatusesMapped);
		asMock(useBasicFilterAGG).mockReturnValue({
			getHydratedJQL,
		});
	});

	describe('when no Jira instances are returned', () => {
		it('should not show insert button, mode switcher, or search bar, and show the no instances content', async () => {
			asMock(getAvailableSites).mockReturnValue([]);
			asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());

			render(
				<IntlProvider locale="en">
					<JiraIssuesConfigModal
						datasourceId={'some-jira-datasource-id'}
						onCancel={jest.fn()}
						onInsert={jest.fn()}
					/>
				</IntlProvider>,
			);

			// TODO: further refactoring in EDM-9573
			// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6828011
			await waitFor(() => expect(getAvailableSites).toHaveBeenCalledTimes(1));

			const insertButton = screen.queryByTestId('jira-datasource-modal--insert-button');
			const modeSwitcher = screen.queryByTestId('mode-toggle-container');
			const searchBar = screen.queryByTestId('jira-search-container');

			await screen.findByTestId('no-jira-instances-content');

			expect(insertButton).not.toBeInTheDocument();
			expect(searchBar).not.toBeInTheDocument();
			expect(modeSwitcher).not.toBeInTheDocument();
		});
	});

	it('should call onCancel when cancel button is clicked', async () => {
		const { onCancel } = await setup();
		const cancelbutton = await screen.findByRole('button', { name: 'Cancel' });
		await user.click(cancelbutton);

		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('should call onInsert when "Insert results" button is clicked', async () => {
		const { onInsert } = await setup();
		const insertButton = await screen.findByRole('button', { name: 'Insert results' });
		await user.click(insertButton);

		expect(onInsert).toHaveBeenCalledTimes(1);
	});

	it('should display the preselected jira site in the title', async () => {
		const { getConfigModalTitleText } = await setup();
		const modalTitle = await getConfigModalTitleText();

		expect(modalTitle).toEqual('Insert Jira issues from hello');
	});

	it('should display the expected title for a single jira site', async () => {
		(getAvailableSites as jest.Mock).mockResolvedValueOnce(mockSiteData.slice(0, 1));
		await setup({ dontWaitForSitesToLoad: true });
		const modalTitle = await screen.findByTestId('jira-datasource-modal--title');

		expect(modalTitle.innerText).toContain('Insert Jira issues');
	});

	describe('when selecting a different jira site', () => {
		it('should reset hooks state', async () => {
			const hookState = getDefaultHookState();
			const { selectNewInstanceSite } = await setup({ hookState });
			await selectNewInstanceSite();
			expect(hookState.reset).toHaveBeenCalledWith({
				shouldForceRequest: true,
			});
		});
	});

	it('should update title with new site name when cloudId updates', async () => {
		const { getConfigModalTitleText, rerender } = await setup();
		const modalTitle = await getConfigModalTitleText();
		expect(modalTitle).toEqual('Insert Jira issues from hello');

		rerender(
			<IntlProvider locale="en">
				<JiraIssuesConfigModal
					datasourceId={'some-jira-datasource-id'}
					parameters={{
						cloudId: '12345',
						jql: 'some-query',
					}}
					onCancel={jest.fn()}
					onInsert={jest.fn()}
				/>
			</IntlProvider>,
		);

		await screen.findByTestId(`jira-datasource-modal--site-selector--trigger`);

		const modalTitle2 = await getConfigModalTitleText();
		expect(modalTitle2).toEqual('Insert Jira issues from test1');
	});

	describe('when cloudId', () => {
		describe('is not present', () => {
			it('should produce ADF with cloudId for the site which user is browsing from', async () => {
				const { getConfigModalTitleText, searchWithNewBasic, assertInsertResult } = await setup({
					parameters: undefined,
				});
				await getConfigModalTitleText();

				// We need to do generate jql, since insert button won't active without it.
				searchWithNewBasic('some keywords');

				assertInsertResult(
					{
						cloudId: '67899',
						jql: 'text ~ "some keywords*" or summary ~ "some keywords*" ORDER BY created DESC',
						jqlUrl:
							'https://hello.atlassian.net/issues/?jql=text%20~%20%22some%20keywords*%22%20or%20summary%20~%20%22some%20keywords*%22%20ORDER%20BY%20created%20DESC',
					},
					{
						attributes: {
							actions: ['query updated'],
							searchCount: 2,
							searchMethod: 'datasource_basic_filter',
							projectBasicFilterSelectionCount: 0,
							statusBasicFilterSelectionCount: 0,
							typeBasicFilterSelectionCount: 0,
							assigneeBasicFilterSelectionCount: 0,
						},
					},
				);
			});

			it('should default to first cloudId if no URL match is found', async () => {
				const { getConfigModalTitleText, searchWithNewJql, assertInsertResult } = await setup({
					parameters: undefined,
					mockSiteDataOverride: mockSiteData.slice(0, 2),
				});
				await getConfigModalTitleText();

				searchWithNewJql('some-query');

				assertInsertResult(
					{
						cloudId: '67899',
						jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
					},
					{
						attributes: {
							actions: ['query updated'],
							searchCount: 1,
							searchMethod: 'datasource_search_query',
							isQueryComplex: true,
						},
					},
				);
			});
		});
	});

	it('should call insert with correct basic filter selection count attributes when a selection is made', async () => {
		const { getConfigModalTitleText, assertInsertResult } = await setup({
			parameters: {
				cloudId: '67899',
				jql: 'status = done',
			},
		});
		await getConfigModalTitleText();

		await user.click(await screen.findByTestId('mode-toggle-basic'));

		// open the status dropdown
		const triggerButton = await screen.findByTestId(`jlol-basic-filter-status-trigger`);
		invariant(triggerButton);

		await user.click(triggerButton);

		const statusSelectMenu = await screen.findByTestId(
			'jlol-basic-filter-status-popup-select--menu',
		);

		const [firstStatus, secondStatus] = within(statusSelectMenu).queryAllByTestId(
			'basic-filter-popup-select-option--lozenge',
		);

		await user.click(firstStatus); // select the first status

		act(() => {
			jest.runAllTimers();
		});

		await user.click(secondStatus); // select the second status

		act(() => {
			jest.runAllTimers();
		});

		assertInsertResult(
			{
				cloudId: '67899',
				jql: 'status in (Authorize, "Awaiting approval") ORDER BY created DESC',
				jqlUrl:
					'https://hello.atlassian.net/issues/?jql=status%20in%20(Authorize%2C%20%22Awaiting%20approval%22)%20ORDER%20BY%20created%20DESC',
			},
			{
				attributes: {
					actions: ['query updated'],
					searchCount: 2,
					searchMethod: 'datasource_basic_filter',
					projectBasicFilterSelectionCount: 0,
					statusBasicFilterSelectionCount: 2,
					typeBasicFilterSelectionCount: 0,
					assigneeBasicFilterSelectionCount: 0,
				},
			},
		);
	});

	it('should provide parameters to JQLEditor', async () => {
		await setup();

		expect(JQLEditor).toHaveBeenCalledWith(
			expect.objectContaining({
				query: 'some-query',
				isSearching: false,
				onSearch: expect.any(Function),
				onUpdate: expect.any(Function),
			} as JQLEditorProps),
			expect.anything(),
		);
	});

	it('should display a placeholder smart link if there is no jql', async () => {
		await setup({
			parameters: { cloudId: '67899', jql: '' },
			viewMode: 'inline',
		});

		expect(screen.getByText('### Issues')).toBeInTheDocument();
	});

	describe('when onSearch is called from JiraSearchContainer', () => {
		it('should call onInsert with new JQL', async () => {
			const { assertInsertResult, searchWithNewJql } = await setup();

			searchWithNewJql('different-query');

			assertInsertResult(
				{
					jql: 'different-query',
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=different-query',
				},
				{
					attributes: {
						actions: ['query updated'],
						searchCount: 1,
						searchMethod: 'datasource_search_query',
						isQueryComplex: true,
					},
				},
			);
		});

		it('should reset hooks state', async () => {
			const hookState = getDefaultHookState();
			const { searchWithNewJql } = await setup({
				hookState,
			});

			searchWithNewJql('different-query');

			expect(hookState.reset).toHaveBeenCalledWith({
				shouldForceRequest: true,
			});
		});

		it('should show a smart link in count view', async () => {
			const { searchWithNewJql } = await setup({
				viewMode: 'inline',
			});

			searchWithNewJql('different-query');
			expect(await screen.findByText('55 Issues')).toBeTruthy();

			const card = screen.queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);
			expect(card).toBeInTheDocument();
			expect(card).toHaveAttribute(
				'href',
				'https://hello.atlassian.net/issues/?jql=different-query',
			);
		});

		it('should not show footer issue count in count view', async () => {
			const { searchWithNewJql } = await setup({
				viewMode: 'inline',
			});

			searchWithNewJql('different-query');
			expect(await screen.findByText('55 Issues')).toBeTruthy();

			expect(screen.queryByTestId('jira-datasource-modal-total-issues-count')).toBeNull();
		});

		it('should call onInsert with new JQL and isQueryComplex=true when the query is complex', async () => {
			const { assertInsertResult, searchWithNewJql } = await setup();

			searchWithNewJql('resolution=done');

			assertInsertResult(
				{
					jql: 'resolution=done',
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=resolution%3Ddone',
				},
				{
					attributes: {
						actions: ['query updated'],
						searchCount: 1,
						searchMethod: 'datasource_search_query',
						isQueryComplex: true,
					},
				},
			);
		});

		it('should call onInsert with new JQL and isQueryComplex=false when the query is not complex', async () => {
			const { assertInsertResult, searchWithNewJql } = await setup();

			searchWithNewJql('status=done');

			assertInsertResult(
				{
					jql: 'status=done',
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=status%3Ddone',
				},
				{
					attributes: {
						actions: ['query updated'],
						searchCount: 1,
						searchMethod: 'datasource_search_query',
						isQueryComplex: false,
					},
				},
			);
		});
	});

	describe('when onNextPage is called from IssueLikeDataTableView', () => {
		it('it should call onNextPage from the hook with the correct parameters', async () => {
			const mockOnNextPage = jest.fn();

			const { getLatestIssueLikeTableProps } = await setup({
				hookState: {
					...getDefaultHookState(),
					hasNextPage: true,
					onNextPage: mockOnNextPage,
				},
			});

			const { onNextPage } = getLatestIssueLikeTableProps();
			onNextPage({
				isSchemaFromData: false,
				shouldForceRequest: true,
			});

			expect(mockOnNextPage).toHaveBeenCalledWith({
				isSchemaFromData: false,
				shouldForceRequest: true,
			});
		});
	});

	it('should use useDatasourceTableState hook', async () => {
		await setup();
		expect(useDatasourceTableState).toHaveBeenCalledWith<
			Parameters<typeof useDatasourceTableState>
		>({
			datasourceId: 'some-jira-datasource-id',
			parameters: getDefaultParameters(),
			fieldKeys: ['myColumn'],
		});
	});

	describe('when there is no parameters yet', () => {
		it('should render defaults correctly', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: undefined,
			});

			expect(screen.getByTestId('mode-toggle-basic').querySelector('input')).toBeChecked();
			screen.getAllByText('Search for issues by keyword').forEach((element) => {
				expect(element).toBeInTheDocument();
			});

			expect(screen.queryByText('Beta')).not.toBeInTheDocument();
			expect(
				screen.queryByRole('link', { name: 'Learn how to search with JQL' }),
			).not.toBeInTheDocument();
		});

		it('should not display issue count', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: undefined,
			});

			expect(screen.queryByTestId('jira-datasource-modal-total-issues-count')).toBeNull();
		});

		it('should disable insert button', async () => {
			await setup({
				visibleColumnKeys: undefined,
				parameters: { cloudId: '', jql: '' },
				hookState: getEmptyHookState(),
			});
			const button = screen.getByRole('button', { name: 'Insert results' });
			expect(button).toBeDisabled();
		});

		it('should NOT call onNextPage automatically', async () => {
			const hookState = getEmptyHookState();
			await setup({
				visibleColumnKeys: undefined,
				parameters: { cloudId: '', jql: '' },
				hookState,
			});

			expect(hookState.onNextPage).not.toHaveBeenCalled();
		});
	});

	describe('when status is `loading` and parameters provided', () => {
		it('should disable insert button', async () => {
			await setup({
				visibleColumnKeys: undefined,
				parameters: { cloudId: 'abc123', jql: 'cool' },
				hookState: getLoadingHookState(),
			});

			const button = screen.getByRole('button', { name: 'Insert results' });
			expect(button).toBeDisabled();
		});
	});

	describe('when status is still `empty` but parameters provided', () => {
		it('should NOT call onNextPage automatically', async () => {
			const hookState = getEmptyHookState();
			await setup({
				visibleColumnKeys: undefined,
				parameters: {
					cloudId: 'some-cloud-id',
					jql: 'some-jql',
				},
				hookState,
			});

			expect(hookState.onNextPage).not.toHaveBeenCalled();
		});

		it('should display EmptyState', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: {
					cloudId: 'some-cloud-id',
					jql: 'some-jql',
				},
			});
			expect(screen.queryByTestId('jira-datasource-modal--empty-state')).toBeTruthy();
		});
	});

	describe('when only one issue is returned', () => {
		it('should call LinkRenderType with the correct url', async () => {
			const hookState = getSingleResponseItemHookState(
				'https://product-fabric.atlassian.net/browse/EDM-5941',
			);
			const { switchMode } = await setup({
				hookState,
			});

			expect(IssueLikeDataTableView).toHaveBeenCalled();
			switchMode('inline');

			await screen.findByText('EDM-5941: Implement mapping between data type and visual component');

			const card = screen.queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-view`);
			expect(card).toBeInTheDocument();
			expect(card).toHaveAttribute('href', 'https://product-fabric.atlassian.net/browse/EDM-5941');
		});

		it('should not render a smart-link when the response object does not have a "key" prop', async () => {
			const hookState = getSingleResponseItemHookState();
			hookState.responseItems = [{}];
			await setup({
				hookState,
			});

			expect(IssueLikeDataTableView).toHaveBeenCalled();

			const card = screen.queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
			expect(card).not.toBeInTheDocument();
		});

		it('should not render a smart-link when the response object does not have a url in the "key" prop', async () => {
			const hookState = getSingleResponseItemHookState();
			hookState.responseItems = [
				{
					key: {
						data: '',
					},
				},
			];
			await setup({
				hookState,
			});

			expect(IssueLikeDataTableView).toHaveBeenCalled();

			const card = screen.queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
			expect(card).not.toBeInTheDocument();
		});

		it('should not render a smart-link when the response object has more than one object', async () => {
			const hookState = getDefaultHookState();
			await setup({
				hookState,
			});

			expect(IssueLikeDataTableView).toHaveBeenCalled();

			const card = screen.queryByTestId(`${LINK_TYPE_TEST_ID}-resolved-views`);
			expect(card).not.toBeInTheDocument();
		});

		it('should have enabled Insert button', async () => {
			const hookState = getSingleResponseItemHookState();
			await setup({
				hookState,
			});

			const insertButton = await screen.findByTestId('jira-datasource-modal--insert-button');
			expect(insertButton).not.toBeDisabled();
		});

		it('should call onInsert with inline card ADF upon Insert button press', async () => {
			const hookState = getSingleResponseItemHookState(
				'https://product-fabric.atlassian.net/browse/EDM-5941',
			);

			const { onInsert } = await setup({
				hookState,
				viewMode: 'inline',
			});

			await screen.findByText('EDM-5941: Implement mapping between data type and visual component');
			const insertButton = await screen.findByTestId('jira-datasource-modal--insert-button');
			await user.click(insertButton);

			expect(onInsert).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'inlineCard',
					attrs: {
						url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
					},
				}),
				expect.objectContaining(
					getInsertAnalyticPayload({
						attributes: {
							display: 'inline',
							totalItemCount: 1,
							actions: ['display view changed'],
						},
					}),
				),
			);
		});

		it('should call onInsert with datasource ADF when no valid url is available', async () => {
			const hookState = getSingleResponseItemHookState();
			hookState.responseItems = [
				{
					key: {
						data: '',
					},
				},
			];
			const { onInsert } = await setup({
				hookState,
			});

			const insertButton = await screen.findByTestId('jira-datasource-modal--insert-button');
			await user.click(insertButton);

			expect(onInsert).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'blockCard',
				}),
				expect.objectContaining(
					getInsertAnalyticPayload({
						attributes: {
							display: 'datasource_table',
							totalItemCount: 1,
						},
					}),
				),
			);
		});

		it('should call onInsert with datasource ADF when response does not have a "key" prop', async () => {
			const hookState = getSingleResponseItemHookState();
			hookState.responseItems = [{}];
			const { onInsert } = await setup({
				hookState,
			});

			const insertButton = await screen.findByTestId('jira-datasource-modal--insert-button');
			await user.click(insertButton);

			expect(onInsert).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'blockCard',
				}),
				expect.objectContaining(
					getInsertAnalyticPayload({
						attributes: {
							display: 'datasource_table',
							totalItemCount: 1,
						},
					}),
				),
			);
		});
	});

	describe('when there are more then one issue returned', () => {
		it('should provide useDataSourceTableState variables to IssueLikeTable', async () => {
			const hookState = getDefaultHookState();
			await setup({
				hookState,
			});

			expect(IssueLikeDataTableView).toHaveBeenCalledWith(
				expect.objectContaining({
					status: 'resolved',
					columns: [
						{ key: 'myColumn', title: 'My Column', type: 'string' },
						{ key: 'otherColumn', title: 'My Other Column', type: 'string' },
						{ key: 'myId', title: 'ID', type: 'string', isIdentity: true },
					],
					testId: 'jira-datasource-table',
					hasNextPage: false,
					items: [
						{
							myColumn: { data: 'some-value' },
							otherColumn: { data: 'other-column-value' },
							myId: { data: 'some-id1' },
						},
						{
							myColumn: { data: 'other-value' },
							otherColumn: { data: 'other-column-other-value' },
							myId: { data: 'some-id2' },
						},
					],
					visibleColumnKeys: ['myColumn'],
					onNextPage: expect.any(Function),
					onLoadDatasourceDetails: hookState.loadDatasourceDetails,
					onVisibleColumnKeysChange: expect.any(Function),
					extensionKey: expect.any(String),
					columnCustomSizes: undefined,
					onColumnResize: expect.any(Function),
				} as Partial<IssueLikeDataTableViewProps>),
				expect.anything(),
			);
		});

		it('should display a count of all issues found with and link to the JQL link', async () => {
			const hookState = getDefaultHookState();
			await setup({
				hookState,
			});
			expect(screen.getByTestId('jira-datasource-modal-total-issues-count').textContent).toEqual(
				'3 issues',
			);

			const issueCountLink = screen.getByTestId('item-count-url');
			expect(issueCountLink).toHaveAttribute('target', '_blank');
			expect(issueCountLink).toHaveAttribute(
				'href',
				'https://hello.atlassian.net/issues/?jql=some-query',
			);
		});

		it('should have enabled Insert button', async () => {
			await setup();
			const button = screen.getByRole('button', { name: 'Insert results' });
			expect(button).not.toBeDisabled();
		});

		it('should call onInsert with query from search bar even if user did not click search previously', async () => {
			const { onInsert } = await setup();

			const toggleButton = screen.getByTestId('mode-toggle-basic');
			await user.click(toggleButton);

			const basicTextInput = await screen.findByTestId('jira-search-placeholder');
			await user.type(basicTextInput, 'testing');

			const insertButton = await screen.findByTestId('jira-datasource-modal--insert-button');
			await user.click(insertButton);

			expect(onInsert).toHaveBeenCalledWith(
				{
					type: 'blockCard',
					attrs: {
						url: 'https://hello.atlassian.net/issues/?jql=some-query',
						datasource: {
							id: 'some-jira-datasource-id',
							parameters: {
								cloudId: '67899',
								jql: 'some-query',
							},
							views: [
								{
									type: 'table',
									properties: {
										columns: [{ key: 'myColumn' }],
									},
								},
							],
						},
					},
				} as JiraIssuesDatasourceAdf,
				expect.objectContaining(getInsertAnalyticPayload({})),
			);
		});

		it('should call onInsert with datasource ADF upon Insert button press', async () => {
			const { onInsert } = await setup();
			const insertButton = await screen.findByTestId('jira-datasource-modal--insert-button');
			await user.click(insertButton);

			expect(onInsert).toHaveBeenCalledWith(
				{
					type: 'blockCard',
					attrs: {
						url: 'https://hello.atlassian.net/issues/?jql=some-query',
						datasource: {
							id: 'some-jira-datasource-id',
							parameters: {
								cloudId: '67899',
								jql: 'some-query',
							},
							views: [
								{
									type: 'table',
									properties: {
										columns: [{ key: 'myColumn' }],
									},
								},
							],
						},
					},
				} as JiraIssuesDatasourceAdf,
				expect.objectContaining(getInsertAnalyticPayload({})),
			);
		});

		it('should call onInsert with inlineCard ADF upon Insert button press in count view mode', async () => {
			const { onInsert } = await setup({ viewMode: 'inline' });

			const insertButton = await screen.findByTestId('jira-datasource-modal--insert-button');
			await user.click(insertButton);

			expect(onInsert).toHaveBeenCalledWith(
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://hello.atlassian.net/issues/?jql=some-query',
					},
				} as InlineCardAdf,
				expect.objectContaining(
					getInsertAnalyticPayload({
						attributes: {
							actions: ['display view changed'],
							display: 'datasource_inline',
						},
					}),
				),
			);
		});

		it('should render inlineCard ADF with firstIssueUrl upon Insert button press in count view mode', async () => {
			const hookState = getSingleResponseItemHookState(
				'https://product-fabric.atlassian.net/browse/EDM-5941',
			);
			const { onInsert } = await setup({
				hookState,
				viewMode: 'inline',
			});

			const insertIssuesButton = await screen.findByRole('button', {
				name: 'Insert results',
			});
			insertIssuesButton.click();

			expect(onInsert).toHaveBeenCalledWith(
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
					},
				} as InlineCardAdf,
				expect.objectContaining(
					getInsertAnalyticPayload({
						attributes: {
							totalItemCount: 1,
							actions: ['display view changed'],
							display: 'inline',
						},
					}),
				),
			);
		});

		it('should not call onNextPage automatically', async () => {
			const hookState = getDefaultHookState();
			await setup({
				hookState,
			});
			expect(hookState.onNextPage).not.toHaveBeenCalled();
		});
	});

	describe('when consumer provides list of visible column keys', () => {
		it('should NOT use default list coming from backend in resulting ADF', async () => {
			const { assertInsertResult } = await setup({
				visibleColumnKeys: ['myColumn'],
			});

			assertInsertResult(
				{
					properties: { columns: [{ key: 'myColumn' }] },
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
				},
				{},
			);
		});
	});

	describe('when user provides list of custom column widths', () => {
		it('should use custom column widths in resulting ADF', async () => {
			const { assertInsertResult } = await setup({
				visibleColumnKeys: ['myColumn'],
				columnCustomSizes: { myColumn: 42 },
			});

			assertInsertResult(
				{
					properties: { columns: [{ key: 'myColumn', width: 42 }] },
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
				},
				{},
			);
		});

		it('should render IssueLikeDataTableView with custom column width', async () => {
			await setup({
				visibleColumnKeys: ['myColumn'],
				columnCustomSizes: { myColumn: 42 },
			});

			expect(IssueLikeDataTableView).toHaveBeenCalledWith(
				expect.objectContaining({
					columnCustomSizes: { myColumn: 42 },
				} as Partial<IssueLikeDataTableViewProps>),
				expect.anything(),
			);
		});
	});

	describe('when user provides callback for column resizing', () => {
		it('should use updated custom column widths in resulting ADF', async () => {
			const { getLatestIssueLikeTableProps, assertInsertResult } = await setup({
				visibleColumnKeys: ['myColumn'],
				columnCustomSizes: { myColumn: 42 },
			});

			const { onColumnResize } = getLatestIssueLikeTableProps();

			invariant(onColumnResize);

			act(() => {
				onColumnResize('myColumn', 56);
			});

			assertInsertResult(
				{
					properties: { columns: [{ key: 'myColumn', width: 56 }] },
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
				},
				{},
			);
		});

		it('should update and send custom column widths to table component', async () => {
			const { getLatestIssueLikeTableProps } = await setup({
				visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
				columnCustomSizes: { myColumn: 42, otherColumn: 43 },
			});

			const { onColumnResize } = getLatestIssueLikeTableProps();

			invariant(onColumnResize);

			act(() => {
				onColumnResize('myColumn', 56);
			});

			expect(IssueLikeDataTableView).toHaveBeenLastCalledWith(
				expect.objectContaining({
					columnCustomSizes: { myColumn: 56, otherColumn: 43 },
				} as Partial<IssueLikeDataTableViewProps>),
				expect.anything(),
			);
		});
	});

	describe('when user provides list of isWrapped column attributes', () => {
		it('should use isWrapped column attribute in resulting ADF', async () => {
			const { assertInsertResult } = await setup({
				visibleColumnKeys: ['myColumn', 'otherColumn'],
				wrappedColumnKeys: ['myColumn'],
			});

			assertInsertResult(
				{
					properties: {
						columns: [{ key: 'myColumn', isWrapped: true }, { key: 'otherColumn' }],
					},
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
				},
				{
					attributes: {
						displayedColumnCount: 2,
					},
				},
			);
		});
		it('should render IssueLikeDataTableView with isWrapped column attribute', async () => {
			await setup({
				visibleColumnKeys: ['myColumn'],
				wrappedColumnKeys: ['myColumn'],
			});

			expect(IssueLikeDataTableView).toHaveBeenCalledWith(
				expect.objectContaining({
					wrappedColumnKeys: ['myColumn'],
				} as Partial<IssueLikeDataTableViewProps>),
				expect.anything(),
			);
		});
	});

	describe('when user provides callback for when wrapped changed', () => {
		it('should use updated isWrapped column attributes in resulting ADF', async () => {
			const { getLatestIssueLikeTableProps, assertInsertResult } = await setup({
				visibleColumnKeys: ['myColumn'],
				wrappedColumnKeys: ['myColumn'],
			});

			const { onWrappedColumnChange } = getLatestIssueLikeTableProps();

			invariant(onWrappedColumnChange);

			act(() => {
				onWrappedColumnChange('myColumn', true);
			});

			assertInsertResult(
				{
					properties: { columns: [{ key: 'myColumn', isWrapped: true }] },
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
				},
				{},
			);
		});
		it('should add new isWrapped column attributes going to table component', async () => {
			const { getLatestIssueLikeTableProps } = await setup({
				visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
				wrappedColumnKeys: ['myColumn', 'otherColumn'],
			});

			const { onWrappedColumnChange } = getLatestIssueLikeTableProps();

			invariant(onWrappedColumnChange);

			act(() => {
				onWrappedColumnChange('thirdColumn', true);
			});
			expect(IssueLikeDataTableView).toHaveBeenLastCalledWith(
				expect.objectContaining({
					wrappedColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
				} as Partial<IssueLikeDataTableViewProps>),
				expect.anything(),
			);
		});
		it('should remove existing isWrapped column attributes going to table component', async () => {
			const { getLatestIssueLikeTableProps } = await setup({
				visibleColumnKeys: ['myColumn', 'otherColumn', 'thirdColumn'],
				wrappedColumnKeys: ['myColumn', 'otherColumn'],
			});

			const { onWrappedColumnChange } = getLatestIssueLikeTableProps();

			invariant(onWrappedColumnChange);

			act(() => {
				onWrappedColumnChange('otherColumn', false);
			});
			expect(IssueLikeDataTableView).toHaveBeenLastCalledWith(
				expect.objectContaining({
					wrappedColumnKeys: ['myColumn'],
				} as Partial<IssueLikeDataTableViewProps>),
				expect.anything(),
			);
		});
	});

	describe('when user changes visible columns from within IssueLikeTable', () => {
		it('should use new columnKeyList in resulting ADF', async () => {
			const { updateVisibleColumnList, assertInsertResult } = await setup();

			act(() => {
				updateVisibleColumnList(['someColumn']);
			});

			assertInsertResult(
				{
					properties: { columns: [{ key: 'someColumn' }] },
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
				},
				{
					attributes: {
						actions: ['column reordered'],
					},
				},
			);
		});
	});

	describe('when consumer not providing list of visible column keys', () => {
		it('should use default list coming from backend', async () => {
			const { assertInsertResult } = await setup({
				visibleColumnKeys: undefined,
			});
			expect(IssueLikeDataTableView).toHaveBeenCalledWith(
				expect.objectContaining({
					visibleColumnKeys: ['myColumn', 'otherColumn'],
				}),
				expect.anything(),
			);

			assertInsertResult(
				{
					properties: {
						columns: [{ key: 'myColumn' }, { key: 'otherColumn' }],
					},
					jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
				},
				{
					attributes: {
						displayedColumnCount: 2,
					},
				},
			);
		});

		describe("but hook state hasn't loaded default column keys yet", () => {
			it('should NOT use default list coming from backend in resulting ADF', async () => {
				const { assertInsertResult, renderComponent } = await setup({
					visibleColumnKeys: undefined,
					hookState: getEmptyHookState(),
				});

				asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());

				renderComponent();

				assertInsertResult(
					{
						properties: {
							columns: [{ key: 'myColumn' }, { key: 'otherColumn' }],
						},
						jqlUrl: 'https://hello.atlassian.net/issues/?jql=some-query',
					},
					{
						attributes: {
							displayedColumnCount: 2,
						},
					},
				);
			});
		});
	});

	describe('when no issues are returned', () => {
		it('should show no results screen in issue view mode', async () => {
			const { onInsert } = await setup({
				hookState: { ...getDefaultHookState(), responseItems: [] },
			});

			expect(
				screen.getByText(`We couldn't find anything matching your search`),
			).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Insert results' })).not.toBeDisabled();

			await user.click(screen.getByRole('button', { name: 'Insert results' }));
			expect(onInsert).toHaveBeenCalledTimes(1);
		});

		it('should not show no results screen in count view mode', async () => {
			const { onInsert } = await setup({
				hookState: { ...getDefaultHookState(), responseItems: [] },
				viewMode: 'inline',
			});

			expect(
				screen.queryByText("We couldn't find anything matching your search"),
			).not.toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Insert results' })).not.toBeDisabled();
			await user.click(screen.getByRole('button', { name: 'Insert results' }));
			expect(onInsert).toHaveBeenCalledTimes(1);
		});
	});

	describe('when an error occurs on data request', () => {
		it('should show network error message', async () => {
			await setup({
				hookState: { ...getErrorHookState() },
			});

			expect(screen.getByText(`We ran into an issue trying to fetch results`)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Insert results' })).toBeDisabled();
		});

		it('should not show network error message in count view mode', async () => {
			await setup({
				hookState: { ...getErrorHookState() },
				viewMode: 'inline',
			});

			expect(
				screen.queryByText(`We ran into an issue trying to fetch results`),
			).not.toBeInTheDocument();
		});

		it('should show no results message on a 403 aka forbidden status', async () => {
			await setup({
				hookState: { ...getErrorHookState(), status: 'forbidden' },
			});

			// issue view
			expect(screen.getByTestId('datasource-modal--no-results')).toBeInTheDocument();
			// button is still clickable since users are able to insert on no results found
			expect(screen.getByRole('button', { name: 'Insert results' })).not.toBeDisabled();
		});

		it('should show unauthorized error message', async () => {
			const { switchMode } = await setup({
				hookState: { ...getErrorHookState(), status: 'unauthorized' },
			});

			// issue view
			expect(screen.getByText("You don't have access to")).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Insert results' })).toBeDisabled();

			// count view
			switchMode('inline');
			expect(screen.getByText("You don't have access to")).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Insert results' })).toBeDisabled();
		});

		// TODO: further refactoring in EDM-9573
		// check that JQL URL comes through in error message
		// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/82725/overview?commentId=6828360
		it('should show rejected error message', async () => {
			await setup({
				hookState: { ...getErrorHookState(), status: 'rejected' },
			});

			expect(screen.getByTestId('datasource-modal--loading-error')).toBeInTheDocument();
			expect(screen.getByText(`We ran into an issue trying to fetch results`)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Insert results' })).toBeDisabled();
		});

		describe('during editing (unauthorized)', () => {
			it('should not select a site if cloudId is not in availableSites', async () => {
				const { getSiteSelectorText } = await setup({
					hookState: { ...getErrorHookState(), status: 'unauthorized' },
					mockSiteDataOverride: mockSiteData.slice(3),
					url: 'https://hello.atlassian.net',
				});

				expect(await getSiteSelectorText()).toEqual('Select a site');
				expect(screen.getByText("You don't have access to")).toBeInTheDocument();
				expect(screen.getByText('https://hello.atlassian.net')).toBeInTheDocument();
			});

			it('should not select a site if cloudId is not in availableSites and should not show a site in message if URL is not provided', async () => {
				const { getSiteSelectorText } = await setup({
					hookState: { ...getErrorHookState(), status: 'unauthorized' },
					mockSiteDataOverride: mockSiteData.slice(3),
				});

				expect(await getSiteSelectorText()).toEqual('Select a site');
				expect(screen.getByText("You don't have access to this content")).toBeInTheDocument();
			});

			it('should not show a site name if cloudId is not in availableSites and an invalid URL is provided', async () => {
				const { getSiteSelectorText } = await setup({
					hookState: { ...getErrorHookState(), status: 'unauthorized' },
					mockSiteDataOverride: mockSiteData.slice(3),
					url: '',
				});

				expect(await getSiteSelectorText()).toEqual('Select a site');
				expect(screen.getByText("You don't have access to this content")).toBeInTheDocument();
			});
		});
	});

	it('should show DisplayViewDropdown when disableDisplayDropdown is false', async () => {
		await setup({
			disableDisplayDropdown: false,
			hookState: { ...getErrorHookState(), status: 'unauthorized' },
			mockSiteDataOverride: mockSiteData.slice(3),
			url: '',
		});

		expect(screen.getByTestId('datasource-modal--view-drop-down--trigger')).toBeInTheDocument();
	});

	it('should show DisplayViewDropdown when disableDisplayDropdown is undefined', async () => {
		await setup({
			disableDisplayDropdown: undefined,
			hookState: { ...getErrorHookState(), status: 'unauthorized' },
			mockSiteDataOverride: mockSiteData.slice(3),
			url: '',
		});

		expect(screen.getByTestId('datasource-modal--view-drop-down--trigger')).toBeInTheDocument();
	});

	it('should not show DisplayViewDropdown when disableDisplayDropdown is true', async () => {
		await setup({
			disableDisplayDropdown: true,
			hookState: { ...getErrorHookState(), status: 'unauthorized' },
			mockSiteDataOverride: mockSiteData.slice(3),
			url: '',
		});

		expect(screen.queryByTestId('datasource-modal--view-drop-down--trigger')).toBeNull();
	});

	it('when opening the modal, it should set the correct mode based on FF', async () => {
		await setup({
			hookState: getEmptyHookState(),
			parameters: undefined,
		});
		expect(screen.getByTestId('mode-toggle-basic').querySelector('input')).toBeChecked();
	});

	describe('initial state should be based on the query', () => {
		it('should default to jql mode for complex jql query', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: {
					cloudId: '131231',
					jql: 'project in (ABC, DEF) and ORDER BY test asc',
				},
			});

			expect(screen.getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();
		});
		it('should default to jql mode if query contains created field and it is complex', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: {
					cloudId: '131231',
					jql: 'created >= -30d order by created DESC',
				},
			});

			expect(screen.getByTestId('mode-toggle-jql').querySelector('input')).toBeChecked();
		});
		it('should default to basic mode if query is not complex', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: {
					cloudId: '131231',
					jql: 'order by created DESC',
				},
			});

			expect(screen.getByTestId('mode-toggle-basic').querySelector('input')).toBeChecked();
		});
	});

	describe('when a JQL inline link is inserted', () => {
		it('Special characters should be escaped', async () => {
			// A combination of & # + characters should be escaped
			const { assertInsertResult, searchWithNewJql } = await setup();

			searchWithNewJql('project in ("combination&of#all+chars##&++#&+")');

			assertInsertResult(
				{
					jql: 'project in ("combination&of#all+chars##&++#&+")',
					jqlUrl:
						'https://hello.atlassian.net/issues/?jql=project%20in%20(%22combination%26of%23all%2Bchars%23%23%26%2B%2B%23%26%2B%22)',
				},
				{
					attributes: {
						actions: ['query updated'],
						searchCount: 1,
						searchMethod: 'datasource_search_query',
					},
				},
			);
		});
	});

	it('should capture and report a11y violations', async () => {
		asMock(getAvailableSites).mockReturnValue([]);
		asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());
		const { container } = render(
			<IntlProvider locale="en">
				<JiraIssuesConfigModal
					datasourceId={'some-jira-datasource-id'}
					onCancel={jest.fn()}
					onInsert={jest.fn()}
				/>
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});
});
