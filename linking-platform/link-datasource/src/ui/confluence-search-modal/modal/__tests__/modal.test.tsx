import React from 'react';

import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { type InlineCardAdf } from '@atlaskit/linking-common';

import { mockTransformedUserHydrationResponse } from '../../../../services/mocks';
import { LINK_TYPE_TEST_ID } from '../../../issue-like-table/render-type/link';
import type { IssueLikeDataTableViewProps } from '../../../issue-like-table/types';
import { useBasicFilterHydration } from '../../basic-filters/hooks/useBasicFilterHydration';
import { useCurrentUserInfo } from '../../basic-filters/hooks/useCurrentUserInfo';
import useRecommendation from '../../basic-filters/hooks/useRecommendation';
import { type ConfluenceSearchDatasourceAdf } from '../../types';

import {
	getAvailableSites,
	getDefaultHookState,
	getEmptyHookState,
	getErrorHookState,
	getLoadingHookState,
	getSingleResponseItemHookState,
	IssueLikeDataTableView,
	setup,
	useDatasourceTableState,
} from './_utils';

// This is needed because if you remove this order, it messes up the test setup, somehow.
// eslint-disable-next-line import/order
import { ConfluenceSearchConfigModal } from '../index';

jest.mock('../../basic-filters/hooks/useCurrentUserInfo');
jest.mock('../../basic-filters/hooks/useRecommendation');
jest.mock('../../basic-filters/hooks/useBasicFilterHydration');

const mockUserRecommendationHook = {
	filterOptions: [
		{
			optionType: 'avatarLabel',
			label: 'Job Bob',
			value: '5ffe1efc34847e0069446bf8',
		},
		{
			optionType: 'avatarLabel',
			label: 'Mike Scott',
			value: '62df272c3aaeedcae755c533',
		},
	],
	status: 'resolved',
	fetchFilterOptions: jest.fn(),
	reset: jest.fn(),
};

describe('ConfluenceSearchConfigModal', () => {
	const testIds = {
		insertButton: 'confluence-search-datasource-modal--insert-button',
		initialState: 'datasource-modal--initial-state-view',
		modalTitle: 'confluence-search-datasource-modal--title',
		basicSearchInput: 'confluence-search-datasource-modal--basic-search-input',
		noContent: 'no-confluence-instances-content',
		noResults: 'datasource-modal--no-results',
		emptyState: 'confluence-search-datasource-modal--empty-state',
		totalResultsCount: 'confluence-search-datasource-modal-total-results-count',
		displayViewDropdown: 'datasource-modal--view-drop-down--trigger',
	};

	beforeEach(() => {
		jsdom.reconfigure({ url: 'https://hello.atlassian.net' });
	});

	beforeEach(() => {
		jest.clearAllMocks();
		asMock(useBasicFilterHydration).mockReturnValue({
			reset: () => {},
		});
		asMock(useRecommendation).mockReturnValue(mockUserRecommendationHook);
		asMock(useCurrentUserInfo).mockReturnValue({
			user: {
				accountId: '123',
			},
		});
	});

	describe('when no Confluence instances are returned', () => {
		it('should not show insert button, or search bar. It should show the "no instances" content', async () => {
			asMock(getAvailableSites).mockReturnValue([]);
			asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());
			await setup({
				mockSiteDataOverride: [],
				dontWaitForSitesToLoad: true,
			});

			await screen.findByTestId(testIds.noContent);

			const insertButton = screen.queryByTestId(testIds.insertButton);
			const searchBar = screen.queryByTestId(testIds.basicSearchInput);
			expect(insertButton).not.toBeInTheDocument();
			expect(searchBar).not.toBeInTheDocument();
		});
	});

	it('should call onCancel when cancel button is clicked', async () => {
		const { onCancel } = await setup();
		(await screen.findByRole('button', { name: 'Cancel' })).click();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});

	it('should call onInsert when "Insert results" button is clicked', async () => {
		const { onInsert } = await setup();
		(await screen.findByRole('button', { name: 'Insert results' })).click();
		expect(onInsert).toHaveBeenCalledTimes(1);
	});

	it('should display the preselected Confluence site in the title', async () => {
		const { getConfigModalTitleText } = await setup();
		const modalTitle = await getConfigModalTitleText();

		expect(modalTitle).toEqual('Insert Confluence list from hello');
	});

	it('should display the expected title for a single Confluence site', async () => {
		(getAvailableSites as jest.Mock).mockResolvedValueOnce(mockSiteData.slice(0, 1));
		const { getConfigModalTitleText } = await setup({
			dontWaitForSitesToLoad: true,
		});
		const modalTitle = await getConfigModalTitleText();

		expect(modalTitle).toEqual('Insert Confluence list');
	});

	describe('when selecting a different confluence site', () => {
		it('should reset hooks state', async () => {
			const hookState = getDefaultHookState();
			const { selectNewInstanceSite } = await setup({ hookState });
			await selectNewInstanceSite();
			expect(hookState.reset).toHaveBeenCalledWith({
				shouldForceRequest: true,
			});
		});

		it('should reset hooks parameters', async () => {
			const hookState = getDefaultHookState();
			const { selectNewInstanceSite } = await setup({
				hookState,
				parameters: {
					cloudId: '6879',
					searchString: 'test',
				},
			});

			expect(useDatasourceTableState).toHaveBeenLastCalledWith(
				expect.objectContaining({
					parameters: {
						cloudId: '6879',
						searchString: 'test',
					},
				}),
			);

			await selectNewInstanceSite();

			expect(useDatasourceTableState).toHaveBeenLastCalledWith(
				expect.objectContaining({
					parameters: undefined,
				}),
			);
		});

		it('should call `useDatasourceTableState` with `undefined` parameters', async () => {
			const hookState = getDefaultHookState();
			const { selectNewInstanceSite } = await setup({
				hookState,
				parameters: { cloudId: '6879' },
			});
			await selectNewInstanceSite();
			expect(hookState.reset).toHaveBeenCalledWith({
				shouldForceRequest: true,
			});
			expect(useDatasourceTableState).toHaveBeenLastCalledWith({
				datasourceId: 'some-confluence-search-datasource-id',
				fieldKeys: ['myColumn'],
				parameters: undefined,
			});
		});
	});

	it('should update title with new site name when cloudId updates', async () => {
		const { getConfigModalTitleText, rerender } = await setup();
		const modalTitle = await getConfigModalTitleText();
		expect(modalTitle).toEqual('Insert Confluence list from hello');

		rerender(
			<IntlProvider locale="en">
				<ConfluenceSearchConfigModal
					datasourceId={'some-confluence-datasource-id'}
					parameters={{
						cloudId: '12345',
						searchString: 'some query',
					}}
					onCancel={jest.fn()}
					onInsert={jest.fn()}
				/>
			</IntlProvider>,
		);

		await screen.findByTestId(`confluence-search-datasource-modal--site-selector--trigger`);

		const modalTitle2 = await getConfigModalTitleText();
		expect(modalTitle2).toEqual('Insert Confluence list from test1');
	});

	describe('when cloudId is not present', () => {
		beforeAll(() => {
			jest.useFakeTimers({ legacyFakeTimers: true });
		});

		afterAll(() => {
			jest.useRealTimers();
		});

		it('should produce ADF with cloudId for the site which user is browsing from', async () => {
			const { getConfigModalTitleText, searchWithNewBasic, assertInsertResult } = await setup({
				parameters: undefined,
			});
			await getConfigModalTitleText();

			// We need to do generate a search, since insert button won't active without it.
			searchWithNewBasic('some keywords');

			assertInsertResult(
				{
					parameters: {
						cloudId: '67899',
						searchString: 'some keywords',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+keywords',
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

		it('should default to first cloudId if no URL match is found', async () => {
			const { getConfigModalTitleText, searchWithNewBasic, assertInsertResult } = await setup({
				parameters: undefined,
				mockSiteDataOverride: mockSiteData.slice(0, 2),
			});
			await getConfigModalTitleText();

			searchWithNewBasic('some keywords');

			assertInsertResult(
				{
					parameters: {
						cloudId: '67899',
						searchString: 'some keywords',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+keywords',
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

	describe('when onSearch is called from ConfluenceSearchContainer', () => {
		it('should call onInsert with new searchString', async () => {
			const { assertInsertResult, searchWithNewBasic } = await setup();

			searchWithNewBasic('some query');

			assertInsertResult(
				{
					parameters: {
						cloudId: '67899',
						searchString: 'some query',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+query',
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

		describe('CLOL basic filters', () => {
			it('should call insert with correct basic filter selection attributes when `last updated` selection is made', async () => {
				const { assertInsertResult } = await setup({
					parameters: {
						cloudId: '67899',
						searchString: 'some-query',
					},
				});

				// Select option from last Updated list
				await userEvent.click(
					await screen.findByTestId(`confluence-search-modal--date-range-button`),
				);
				await userEvent.click(await screen.findByText(`Today`));

				assertInsertResult(
					{
						parameters: {
							cloudId: '67899',
							searchString: 'some-query',
							lastModified: 'today',
							// for custom would have lastModifiedTo & lastModifiedFrom
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some-query&lastModified=today',
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

			it('should call insert with correct basic filter selection attributes when `last updated` selection is made with custom selected and no to or from dates', async () => {
				const { assertInsertResult } = await setup({
					parameters: {
						cloudId: '67899',
						searchString: 'some-query',
					},
				});

				await userEvent.click(
					await screen.findByTestId(`confluence-search-modal--date-range-button`),
				);
				await userEvent.click(await screen.findByText(`Custom`));

				assertInsertResult(
					{
						parameters: {
							cloudId: '67899',
							searchString: 'some-query',
							lastModified: 'custom',
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some-query&lastModified=custom',
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

			it('should call insert with correct basic filter selection attributes when `last updated` selection is made with custom selected and only from date', async () => {
				const { assertInsertResult } = await setup({
					// setting up the parameters with custom selected and only from date pre-selected to not have to mock the flaky date picker component
					parameters: {
						cloudId: '67899',
						searchString: 'some-query',
						lastModified: 'custom',
						lastModifiedFrom: '2024-02-02',
					},
				});

				await userEvent.click(
					await screen.findByTestId(`confluence-search-modal--date-range-button`),
				);
				await userEvent.click(await screen.findByText(`Update`));

				assertInsertResult(
					{
						parameters: {
							cloudId: '67899',
							searchString: 'some-query',
							lastModified: 'custom',
							lastModifiedFrom: '2024-02-02',
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some-query&lastModified=custom&from=2024-02-02',
					},
					{
						attributes: {
							// technically search wasn't actioned as it was pre-filled therefore this has not updated
							actions: [],
							searchCount: 0,
							searchMethod: 'datasource_search_query',
						},
					},
				);
			});

			it('should call insert with correct basic filter selection attributes when `last updated` selection is made with custom selected and only to date', async () => {
				const { assertInsertResult } = await setup({
					// setting up the parameters with custom selected and only from date pre-selected to not have to mock the flaky date picker component
					parameters: {
						cloudId: '67899',
						searchString: 'some-query',
						lastModified: 'custom',
						lastModifiedTo: '2024-02-03',
					},
				});

				await userEvent.click(
					await screen.findByTestId(`confluence-search-modal--date-range-button`),
				);
				await userEvent.click(await screen.findByText(`Update`));

				assertInsertResult(
					{
						parameters: {
							cloudId: '67899',
							searchString: 'some-query',
							lastModified: 'custom',
							lastModifiedTo: '2024-02-03',
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some-query&lastModified=custom&to=2024-02-03',
					},
					{
						attributes: {
							// technically search wasn't actioned as it was pre-filled therefore this has not updated
							actions: [],
							searchCount: 0,
							searchMethod: 'datasource_search_query',
						},
					},
				);
			});

			it('should call insert with correct basic filter selection attributes when `last updated` selection is made with custom selected and both from and to date', async () => {
				const { assertInsertResult } = await setup({
					// setting up the parameters with custom selected and only from date pre-selected to not have to mock the flaky date picker component
					parameters: {
						cloudId: '67899',
						searchString: 'some-query',
						lastModified: 'custom',
						lastModifiedFrom: '2024-02-02',
						lastModifiedTo: '2024-02-03',
					},
				});

				await userEvent.click(
					await screen.findByTestId(`confluence-search-modal--date-range-button`),
				);
				await userEvent.click(await screen.findByText(`Update`));

				assertInsertResult(
					{
						parameters: {
							cloudId: '67899',
							searchString: 'some-query',
							lastModified: 'custom',
							lastModifiedFrom: '2024-02-02',
							lastModifiedTo: '2024-02-03',
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some-query&lastModified=custom&from=2024-02-02&to=2024-02-03',
					},
					{
						attributes: {
							// technically search wasn't actioned as it was pre-filled therefore this has not updated
							actions: [],
							searchCount: 0,
							searchMethod: 'datasource_search_query',
						},
					},
				);
			});

			describe('on insert', () => {
				beforeAll(() => {
					jest.useFakeTimers({ legacyFakeTimers: true });
				});

				afterAll(() => {
					jest.useRealTimers();
				});

				it('should call insert with correct parameters when `Edited or created by` selection is made', async () => {
					const { assertInsertResult, findByTestId, findByText } = await setup({
						parameters: {
							cloudId: '67899',
							searchString: 'some-query',
						},
					});

					// Select option from edited/created by filter list
					fireEvent.click(await findByTestId(`clol-basic-filter-editedOrCreatedBy-trigger`));
					fireEvent.click(await findByText(`Mike Scott`));

					act(() => {
						jest.advanceTimersByTime(500);
					});

					assertInsertResult(
						{
							parameters: {
								cloudId: '67899',
								searchString: 'some-query',
								contributorAccountIds: ['62df272c3aaeedcae755c533'],
							},
							url: 'https://hello.atlassian.net/wiki/search?text=some-query&contributors=62df272c3aaeedcae755c533',
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

			it('should pass the initialFilterSelection prop to ConfluenceSearchContainer for hydration when modal parameters have contributorAccountIds', async () => {
				asMock(useBasicFilterHydration).mockReturnValue({
					status: 'resolved',
					hydrateUsersFromAccountIds: () => {},
					users: mockTransformedUserHydrationResponse,
					reset: () => {},
				});

				await setup({
					parameters: {
						cloudId: '67899',
						searchString: 'some-query',
						contributorAccountIds: ['23432'],
					},
				});

				const editedOrCreatedByTriggerButton = await screen.findByTestId(
					'clol-basic-filter-editedOrCreatedBy-trigger--button',
				);

				expect(editedOrCreatedByTriggerButton).toHaveTextContent(
					'Edited or created by: Peter Grasevski+3',
				);
			});
		});

		it('should reset hooks state', async () => {
			const hookState = getDefaultHookState();
			const { searchWithNewBasic } = await setup({
				hookState,
			});

			searchWithNewBasic('some query');

			expect(hookState.reset).toHaveBeenCalledWith({
				shouldForceRequest: true,
			});
		});

		it('should preserve existing parameters', async () => {
			const { assertInsertResult, searchWithNewBasic } = await setup({
				parameters: {
					cloudId: '67899',
					labels: ['foo', 'bar'],
					shouldMatchTitleOnly: true,
				},
			});

			searchWithNewBasic('some query');

			assertInsertResult(
				{
					parameters: {
						cloudId: '67899',
						labels: ['foo', 'bar'],
						shouldMatchTitleOnly: true,
						searchString: 'some query',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+query',
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

		it('should show a placeholder smart link in inline view with no search string', async () => {
			await setup({
				viewMode: 'inline',
			});

			const card = await screen.findByTestId(`lazy-render-placeholder`);
			expect(card).toHaveAttribute('href', 'https://hello.atlassian.net/wiki/search?text=');
		});

		it('should show a smart link in inline view with search string', async () => {
			const { searchWithNewBasic } = await setup({
				viewMode: 'inline',
			});

			searchWithNewBasic('test');

			const card = await screen.findByTestId(`lazy-render-placeholder`);
			expect(card).toHaveAttribute('href', 'https://hello.atlassian.net/wiki/search?text=test');
		});

		it('should not show footer issue count in count view', async () => {
			const { searchWithNewBasic } = await setup({
				viewMode: 'inline',
			});

			searchWithNewBasic('some query');

			expect(
				screen.queryByTestId('confluence-search-datasource-modal-total-results-count'),
			).toBeNull();
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
			datasourceId: 'some-confluence-search-datasource-id',
			parameters: { cloudId: '67899', searchString: '' },
			fieldKeys: ['myColumn'],
		});
	});

	describe('when there is no parameters yet', () => {
		it('should render basic search input', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: undefined,
			});

			expect(await screen.findByTestId(testIds.basicSearchInput)).toBeInTheDocument();
			expect(
				(await screen.findByTestId(testIds.basicSearchInput)).getAttribute('placeholder'),
			).toEqual('Enter keywords to find pages, attachments, and more');
		});

		it('should not display results count', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: undefined,
			});

			expect(screen.queryByTestId(testIds.totalResultsCount)).toBeNull();
		});

		it('should disable insert button', async () => {
			await setup({
				visibleColumnKeys: undefined,
				parameters: { cloudId: '' },
				hookState: getEmptyHookState(),
			});
			const button = await screen.findByTestId(testIds.insertButton);
			expect(button).toBeDisabled();
		});

		it('should NOT call onNextPage automatically', async () => {
			const hookState = getEmptyHookState();
			await setup({
				visibleColumnKeys: undefined,
				parameters: { cloudId: '' },
				hookState,
			});

			expect(hookState.onNextPage).not.toHaveBeenCalled();
		});
	});

	describe('when status is `loading` and parameters provided', () => {
		it('should disable insert button', async () => {
			await setup({
				visibleColumnKeys: undefined,
				parameters: { cloudId: 'abc123', searchString: 'cool' },
				hookState: getLoadingHookState(),
			});

			const button = await screen.findByTestId(testIds.insertButton);
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
					searchString: 'some-jql',
				},
				hookState,
			});

			expect(hookState.onNextPage).not.toHaveBeenCalled();
		});

		it('should display EmptyState', async () => {
			await setup({
				hookState: getEmptyHookState(),
				parameters: {
					cloudId: '67899',
					searchString: 'some-jql',
				},
			});
			expect(await screen.findByTestId(testIds.emptyState)).toBeTruthy();
		});
	});

	describe('when only one search result is returned', () => {
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

			const button = await screen.findByTestId(testIds.insertButton);
			expect(button).not.toBeDisabled();
		});
	});

	describe('when there are more then one result returned', () => {
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
						{
							key: 'otherColumn',
							title: 'My Other Column',
							type: 'string',
						},
						{ key: 'myId', title: 'ID', type: 'string', isIdentity: true },
					],
					testId: 'confluence-search-datasource-table',
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

		it('should display a count of all search results found', async () => {
			const hookState = getDefaultHookState();
			await setup({
				hookState,
			});
			expect(
				(await screen.findByTestId('confluence-search-datasource-modal-total-results-count'))
					.textContent,
			).toEqual('3 results');
		});

		it('should display a link to the confluence search link', async () => {
			const hookState = getDefaultHookState();
			await setup({
				hookState,
			});

			const searchResultsCountLink = await screen.findByTestId('item-count-url');
			expect(searchResultsCountLink).toHaveAttribute('target', '_blank');
			expect(searchResultsCountLink).toHaveAttribute(
				'href',
				'https://hello.atlassian.net/wiki/search?text=',
			);
		});

		it('should have enabled Insert button', async () => {
			await setup();
			const button = await screen.findByTestId(testIds.insertButton);
			expect(button).not.toBeDisabled();
		});

		it('should call onInsert with datasource ADF upon Insert button press', async () => {
			const { onInsert } = await setup();
			const button = await screen.findByRole('button', { name: 'Insert results' });
			button.click();
			expect(onInsert).toHaveBeenCalledWith(
				{
					type: 'blockCard',
					attrs: {
						url: 'https://hello.atlassian.net/wiki/search?text=',
						datasource: {
							id: 'some-confluence-search-datasource-id',
							parameters: {
								cloudId: '67899',
								searchString: '',
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
				} as ConfluenceSearchDatasourceAdf,
				expect.objectContaining({}),
			);
		});

		it('should call onInsert with datasource ADF with overridable parameters upon Insert button press', async () => {
			const { onInsert } = await setup({
				overrideParameters: {
					entityTypes: ['parameter1', 'parameter2'],
				},
			});
			const button = await screen.findByRole('button', { name: 'Insert results' });
			button.click();
			expect(onInsert).toHaveBeenCalledWith(
				{
					type: 'blockCard',
					attrs: {
						url: 'https://hello.atlassian.net/wiki/search?text=',
						datasource: {
							id: 'some-confluence-search-datasource-id',
							parameters: {
								cloudId: '67899',
								searchString: '',
								entityTypes: ['parameter1', 'parameter2'],
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
				} as ConfluenceSearchDatasourceAdf,
				expect.objectContaining({}),
			);
		});

		it('should call onInsert with inlineCard ADF upon Insert button press in inline view mode', async () => {
			const { onInsert } = await setup({ viewMode: 'inline' });

			const insertIssuesButton = await screen.findByRole('button', {
				name: 'Insert results',
			});
			insertIssuesButton.click();

			expect(onInsert).toHaveBeenCalledWith(
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://hello.atlassian.net/wiki/search?text=',
					},
				} as InlineCardAdf,
				expect.objectContaining({}),
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
			const { assertInsertResult, searchWithNewBasic } = await setup({
				visibleColumnKeys: ['myColumn'],
			});

			searchWithNewBasic('some query');

			assertInsertResult(
				{
					properties: { columns: [{ key: 'myColumn' }] },
					parameters: {
						cloudId: '67899',
						searchString: 'some query',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+query',
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

	describe('when user provides list of custom column widths', () => {
		it('should use custom column widths in resulting ADF', async () => {
			const { assertInsertResult, searchWithNewBasic } = await setup({
				visibleColumnKeys: ['myColumn'],
				columnCustomSizes: { myColumn: 42 },
			});

			searchWithNewBasic('some query');

			assertInsertResult(
				{
					properties: { columns: [{ key: 'myColumn', width: 42 }] },
					parameters: {
						cloudId: '67899',
						searchString: 'some query',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+query',
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
			const { getLatestIssueLikeTableProps, assertInsertResult, searchWithNewBasic } = await setup({
				visibleColumnKeys: ['myColumn'],
				columnCustomSizes: { myColumn: 42 },
			});

			searchWithNewBasic('some query');

			const { onColumnResize } = getLatestIssueLikeTableProps();
			invariant(onColumnResize);
			act(() => {
				onColumnResize('myColumn', 56);
			});

			assertInsertResult(
				{
					properties: { columns: [{ key: 'myColumn', width: 56 }] },
					parameters: {
						cloudId: '67899',
						searchString: 'some query',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+query',
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

	describe('text wrapping in columns', () => {
		describe('when user provides list of isWrapped column attributes', () => {
			it('should use isWrapped column attribute in resulting ADF', async () => {
				const { assertInsertResult, searchWithNewBasic } = await setup({
					visibleColumnKeys: ['myColumn', 'otherColumn'],
					wrappedColumnKeys: ['myColumn'],
				});

				searchWithNewBasic('some query');

				assertInsertResult(
					{
						properties: {
							columns: [{ key: 'myColumn', isWrapped: true }, { key: 'otherColumn' }],
						},
						parameters: {
							cloudId: '67899',
							searchString: 'some query',
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some+query',
					},
					{
						attributes: {
							actions: ['query updated'],
							searchCount: 1,
							displayedColumnCount: 2,
							searchMethod: 'datasource_search_query',
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
				const { getLatestIssueLikeTableProps, assertInsertResult, searchWithNewBasic } =
					await setup({
						visibleColumnKeys: ['myColumn'],
						wrappedColumnKeys: ['myColumn'],
					});

				searchWithNewBasic('some query');

				const { onWrappedColumnChange } = getLatestIssueLikeTableProps();

				invariant(onWrappedColumnChange);
				act(() => {
					onWrappedColumnChange('myColumn', true);
				});

				assertInsertResult(
					{
						properties: { columns: [{ key: 'myColumn', isWrapped: true }] },
						parameters: {
							cloudId: '67899',
							searchString: 'some query',
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some+query',
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
	});

	describe('when user changes visible columns from within IssueLikeTable', () => {
		it('should use new columnKeyList in resulting ADF', async () => {
			const { updateVisibleColumnList, assertInsertResult, searchWithNewBasic } = await setup();

			searchWithNewBasic('some query');

			act(() => {
				updateVisibleColumnList(['someColumn']);
			});

			assertInsertResult(
				{
					properties: { columns: [{ key: 'someColumn' }] },
					parameters: {
						cloudId: '67899',
						searchString: 'some query',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+query',
				},
				{
					attributes: {
						actions: ['query updated', 'column reordered'],
						searchCount: 1,
						searchMethod: 'datasource_search_query',
					},
				},
			);
		});
	});

	describe('when consumer not providing list of visible column keys', () => {
		it('should use default list coming from backend', async () => {
			const { assertInsertResult, searchWithNewBasic } = await setup({
				visibleColumnKeys: undefined,
			});

			searchWithNewBasic('some query');

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
					parameters: {
						cloudId: '67899',
						searchString: 'some query',
					},
					url: 'https://hello.atlassian.net/wiki/search?text=some+query',
				},
				{
					attributes: {
						actions: ['query updated'],
						searchCount: 1,
						displayedColumnCount: 2,
						searchMethod: 'datasource_search_query',
					},
				},
			);
		});

		describe("but hook state hasn't loaded default column keys yet", () => {
			it('should NOT use default list coming from backend in resulting ADF', async () => {
				const { assertInsertResult, renderComponent, searchWithNewBasic } = await setup({
					visibleColumnKeys: undefined,
					hookState: getEmptyHookState(),
				});

				searchWithNewBasic('some query');

				asMock(useDatasourceTableState).mockReturnValue(getDefaultHookState());

				renderComponent();

				assertInsertResult(
					{
						properties: {
							columns: [{ key: 'myColumn' }, { key: 'otherColumn' }],
						},
						parameters: {
							cloudId: '67899',
							searchString: 'some query',
						},
						url: 'https://hello.atlassian.net/wiki/search?text=some+query',
					},
					{
						attributes: {
							actions: ['query updated'],
							searchCount: 1,
							displayedColumnCount: 2,
							searchMethod: 'datasource_search_query',
						},
					},
				);
			});
		});
	});

	describe('when no issues are returned', () => {
		it('should show no results screen in table view mode', async () => {
			await setup({
				hookState: { ...getDefaultHookState(), responseItems: [] },
			});

			expect(await screen.findByText('No results found')).toBeInTheDocument();
			expect(await screen.findByTestId(testIds.insertButton)).not.toBeDisabled();
		});

		it('should not show no results screen in inline view mode', async () => {
			const { onInsert } = await setup({
				hookState: { ...getDefaultHookState(), responseItems: [] },
				viewMode: 'inline',
			});

			expect(screen.queryByText('No results found')).not.toBeInTheDocument();
			expect(await screen.findByRole('button', { name: 'Insert results' })).not.toBeDisabled();
			await userEvent.click(await screen.findByRole('button', { name: 'Insert results' }));
			expect(onInsert).toHaveBeenCalledTimes(1);
		});
	});

	describe('when an error occurs on data request', () => {
		it('should show network error message', async () => {
			await setup({
				hookState: { ...getErrorHookState() },
			});

			expect(await screen.findByText('Unable to load results')).toBeInTheDocument();
			expect(await screen.findByTestId(testIds.insertButton)).toBeDisabled();
		});

		it('should not show network error message in inline view mode', async () => {
			await setup({
				hookState: { ...getErrorHookState() },
				viewMode: 'inline',
			});

			expect(screen.queryByText('Unable to load results')).not.toBeInTheDocument();
		});

		it('should show no results message on a 403 aka forbidden status', async () => {
			await setup({
				hookState: { ...getErrorHookState(), status: 'forbidden' },
			});

			// results view
			expect(await screen.findByTestId(testIds.noResults)).toBeInTheDocument();
			// button is still clickable since users are able to insert on no results found
			expect(await screen.findByTestId(testIds.insertButton)).not.toBeDisabled();
		});

		it('should show unauthorized error message', async () => {
			await setup({
				hookState: { ...getErrorHookState(), status: 'unauthorized' },
			});

			// results view
			expect(
				await screen.findByText("You don't have access to the following site:"),
			).toBeInTheDocument();
			expect(await screen.findByTestId(testIds.insertButton)).toBeDisabled();
		});

		describe('during editing (unauthorized)', () => {
			it('should not select a site if cloudId is not in availableSites', async () => {
				const { getSiteSelectorText } = await setup({
					hookState: { ...getErrorHookState(), status: 'unauthorized' },
					mockSiteDataOverride: mockSiteData.slice(3),
					url: 'https://hello.atlassian.net',
				});

				expect(getSiteSelectorText()).toEqual('Choose site');
				expect(
					await screen.findByText("You don't have access to the following site:"),
				).toBeInTheDocument();
				expect(await screen.findByText('https://hello.atlassian.net')).toBeInTheDocument();
			});

			it('should not select a site if cloudId is not in availableSites and should not show a site in message if URL is not provided', async () => {
				const { getSiteSelectorText } = await setup({
					hookState: { ...getErrorHookState(), status: 'unauthorized' },
					mockSiteDataOverride: mockSiteData.slice(3),
				});

				expect(getSiteSelectorText()).toEqual('Choose site');
				expect(
					await screen.findByText("You don't have access to this content"),
				).toBeInTheDocument();
			});

			it('should not show a site name if cloudId is not in availableSites and an invalid URL is provided', async () => {
				const { getSiteSelectorText } = await setup({
					hookState: { ...getErrorHookState(), status: 'unauthorized' },
					mockSiteDataOverride: mockSiteData.slice(3),
					url: '',
				});

				expect(getSiteSelectorText()).toEqual('Choose site');
				expect(
					await screen.findByText("You don't have access to this content"),
				).toBeInTheDocument();
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

		expect(await screen.findByTestId(testIds.displayViewDropdown)).toBeInTheDocument();
	});

	it('should show DisplayViewDropdown when disableDisplayDropdown is undefined', async () => {
		await setup({
			disableDisplayDropdown: undefined,
			hookState: { ...getErrorHookState(), status: 'unauthorized' },
			mockSiteDataOverride: mockSiteData.slice(3),
			url: '',
		});

		expect(await screen.findByTestId(testIds.displayViewDropdown)).toBeInTheDocument();
	});

	it('should not show DisplayViewDropdown when disableDisplayDropdown is true', async () => {
		await setup({
			disableDisplayDropdown: true,
			hookState: { ...getErrorHookState(), status: 'unauthorized' },
			mockSiteDataOverride: mockSiteData.slice(3),
			url: '',
		});

		expect(screen.queryByTestId(testIds.displayViewDropdown)).toBeNull();
	});

	it('should pass parameters to the useDatasourceTableState hook as normal, when `overrideParameters` are not provided', async () => {
		await setup({
			overrideParameters: undefined,
			mockSiteDataOverride: mockSiteData.slice(3),
			parameters: {
				cloudId: mockSiteData[0].cloudId,
				searchString: '',
				entityTypes: ['original1'],
			},
			url: '',
		});

		expect(useDatasourceTableState).toHaveBeenLastCalledWith({
			datasourceId: 'some-confluence-search-datasource-id',
			fieldKeys: ['myColumn'],
			parameters: {
				cloudId: '67899',
				entityTypes: ['original1'],
				searchString: '',
			},
		});
	});

	it('should pass parameters plus `overrideParameters` to the useDatasourceTableState hook', async () => {
		await setup({
			overrideParameters: {
				entityTypes: ['entity1', 'entity2', 'entity3', 'entity4'],
			},
			mockSiteDataOverride: mockSiteData.slice(3),
			parameters: { cloudId: mockSiteData[0].cloudId, searchString: '' },
			url: '',
		});

		expect(useDatasourceTableState).toHaveBeenLastCalledWith({
			datasourceId: 'some-confluence-search-datasource-id',
			fieldKeys: ['myColumn'],
			parameters: {
				cloudId: '67899',
				entityTypes: ['entity1', 'entity2', 'entity3', 'entity4'],
				searchString: '',
			},
		});
	});

	it('should pass parameters, and replace original `entityTypes` with the ones from `overrideParameters` to the useDatasourceTableState hook', async () => {
		await setup({
			overrideParameters: {
				entityTypes: ['entity1', 'entity2', 'entity3', 'entity4'],
			},
			mockSiteDataOverride: mockSiteData.slice(3),
			parameters: {
				cloudId: mockSiteData[0].cloudId,
				searchString: '',
				entityTypes: ['originalType1', 'originalType2'],
			},
			url: '',
		});

		expect(useDatasourceTableState).toHaveBeenLastCalledWith({
			datasourceId: 'some-confluence-search-datasource-id',
			fieldKeys: ['myColumn'],
			parameters: {
				cloudId: '67899',
				entityTypes: ['entity1', 'entity2', 'entity3', 'entity4'],
				searchString: '',
			},
		});
	});

	it('should pass `undefined` parameters even with provided `overrideParameters` to the useDatasourceTableState hook, when there are not enough provided parameters to call API', async () => {
		await setup({
			overrideParameters: {
				entityTypes: ['entity1', 'entity2', 'entity3', 'entity4'],
			},
			mockSiteDataOverride: mockSiteData.slice(3),
			parameters: {
				cloudId: mockSiteData[0].cloudId,
			},
			url: '',
		});

		expect(useDatasourceTableState).toHaveBeenLastCalledWith({
			datasourceId: 'some-confluence-search-datasource-id',
			fieldKeys: ['myColumn'],
			parameters: undefined,
		});
	});
});
