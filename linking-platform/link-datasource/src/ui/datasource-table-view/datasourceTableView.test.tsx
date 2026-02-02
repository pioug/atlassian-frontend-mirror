import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider, useSmartCardContext } from '@atlaskit/link-provider';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import {
	type DatasourceDataResponseItem,
	type DatasourceTableStatusType,
} from '@atlaskit/linking-types';
import { type ConcurrentExperience } from '@atlaskit/ufo';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { EVENT_CHANNEL } from '../../analytics';
import { type DatasourceRenderSuccessAttributesType } from '../../analytics/generated/analytics.types';
import { DatasourceExperienceIdProvider } from '../../contexts/datasource-experience-id';
import {
	type DatasourceTableState,
	useDatasourceTableState,
} from '../../hooks/useDatasourceTableState';
import { Store } from '../../state';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../assets-modal';
import * as issueLikeModule from '../issue-like-table';
import { type IssueLikeDataTableViewProps } from '../issue-like-table/types';
import { useIsOnScreen } from '../issue-like-table/useIsOnScreen';

import { DatasourceTableView } from './datasourceTableView';
import { type DatasourceTableViewProps } from './types';

jest.mock('../../hooks/useDatasourceTableState');
jest.mock('../issue-like-table/useIsOnScreen');
jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	useSmartCardContext: jest.fn(),
}));

const mockTableRenderUfoStart = jest.fn();
const mockTableRenderUfoSuccess = jest.fn();
const mockTableRenderUfoFailure = jest.fn();
const mockTableRenderUfoAddMetadata = jest.fn();

const mockColumnPickerRenderUfoFailure = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
	__esModule: true,
	...jest.requireActual<object>('@atlaskit/ufo'),
	ConcurrentExperience: jest.fn().mockImplementation(
		(experienceId: string): Partial<ConcurrentExperience> => ({
			experienceId: experienceId,
			getInstance: jest.fn().mockImplementation(() => {
				if (experienceId === 'datasource-rendered') {
					return {
						start: mockTableRenderUfoStart,
						success: mockTableRenderUfoSuccess,
						failure: mockTableRenderUfoFailure,
						addMetadata: mockTableRenderUfoAddMetadata,
					};
				}
				if (experienceId === 'column-picker-rendered') {
					return {
						failure: mockColumnPickerRenderUfoFailure,
					};
				}
			}),
		}),
	),
}));

jest.mock('@atlaskit/outbound-auth-flow-client', () => ({
	__esModule: true,
	...jest.requireActual<object>('@atlaskit/outbound-auth-flow-client'),
	auth: (url: string) => {
		if (url === 'test.success.url') {
			return Promise.resolve();
		}

		return Promise.reject();
	},
}));

const testRefreshButtonLabel = 'Test refresh button';
jest.mock('../common/error-state/loading-error', () => ({
	...jest.requireActual('../common/error-state/loading-error'),
	LoadingError: jest.fn(({ onRefresh, url }) => (
		<div>
			<div>Unable to load items</div>
			<button onClick={onRefresh}>{testRefreshButtonLabel}</button>
			<div>URL is: {url}</div>
		</div>
	)),
}));

jest.mock('../common/error-state/no-results', () => ({
	...jest.requireActual('../common/error-state/no-results'),
	NoResults: jest.fn(({ onRefresh }) => (
		<div>
			<div>We couldn't find anything matching your search</div>
			{onRefresh && <button onClick={onRefresh}>{testRefreshButtonLabel}</button>}
		</div>
	)),
}));

const onAnalyticFireEvent = jest.fn();

const defaultMockResponseItems: DatasourceDataResponseItem[] = [
	{
		myColumn: {
			data: 'some-value',
		},
		id: {
			data: 'some-id1',
		},
		ari: {
			data: 'some-id1',
		},
	},
];

const setup = (
	stateOverride: Partial<DatasourceTableState> & {
		onVisibleColumnKeysChange?: ((visibleColumnKeys: string[]) => void) | null;
		responseItems?: DatasourceDataResponseItem[];
		visibleColumnKeys?: string[] | null;
	} = {},
	propsOverride: Partial<DatasourceTableViewProps> = {},
) => {
	const { visibleColumnKeys, onVisibleColumnKeysChange, responseItems } = stateOverride;

	const mockReset = jest.fn();
	const mockResponseItems = responseItems || defaultMockResponseItems;

	asMock(useDatasourceTableState).mockReturnValue({
		reset: mockReset,
		status: 'resolved',
		onNextPage: jest.fn(),
		loadDatasourceDetails: jest.fn(),
		hasNextPage: false,
		responseItemIds: mockResponseItems.map((item) => item.ari?.data),
		responseItems: mockResponseItems,
		totalCount: mockResponseItems.length,
		columns: [
			{ key: 'myColumn', title: 'My Column', type: 'string' },
			{ key: 'id', title: 'Id' },
		],
		defaultVisibleColumnKeys: ['myColumn'],
		extensionKey: 'jira-object-provider',
		destinationObjectTypes: ['issue'],
		...(stateOverride || {}),
	} as DatasourceTableState);

	const renderResult = render(
		<DatasourceTableView
			datasourceId={'some-datasource-id'}
			parameters={{
				cloudId: 'some-cloud-id',
				jql: 'some-jql-query',
			}}
			visibleColumnKeys={
				visibleColumnKeys === null
					? undefined
					: visibleColumnKeys || ['visible-column-1', 'visible-column-2']
			}
			onVisibleColumnKeysChange={
				onVisibleColumnKeysChange === null ? undefined : onVisibleColumnKeysChange || jest.fn()
			}
			{...propsOverride}
		/>,
		{
			wrapper: ({ children }) => (
				<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
					<DatasourceExperienceIdProvider>
						<SmartCardProvider>
							<IntlProvider locale="en">{children}</IntlProvider>
						</SmartCardProvider>
					</DatasourceExperienceIdProvider>
				</AnalyticsListener>
			),
		},
	);

	return { mockReset, ...renderResult };
};

const setupAssetsTable = (
	stateOverride: Partial<DatasourceTableState> & {
		onVisibleColumnKeysChange?: ((visibleColumnKeys: string[]) => void) | null;
		responseItems?: DatasourceDataResponseItem[];
		visibleColumnKeys?: string[] | null;
	} = {},
	propsOverride: Partial<DatasourceTableViewProps> = {},
) => {
	const { visibleColumnKeys, onVisibleColumnKeysChange, responseItems } = stateOverride;

	const mockReset = jest.fn();
	const mockResponseItems = responseItems || defaultMockResponseItems;

	asMock(useDatasourceTableState).mockReturnValue({
		reset: mockReset,
		status: 'resolved',
		onNextPage: jest.fn(),
		loadDatasourceDetails: jest.fn(),
		hasNextPage: false,
		responseItemIds: mockResponseItems.map((item) => item.ari?.data),
		responseItems: mockResponseItems,
		totalCount: responseItems?.length || 2,
		columns: [
			{ key: 'myColumn', title: 'My Column', type: 'string' },
			{ key: 'id', title: 'Id' },
		],
		defaultVisibleColumnKeys: ['myColumn'],
		extensionKey: 'jsm-cmdb-gateway',
		destinationObjectTypes: ['assets'],
		...(stateOverride || {}),
	} as DatasourceTableState);

	const renderResult = render(
		<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
			<IntlProvider locale="en">
				<DatasourceTableView
					datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
					parameters={{
						workspaceId: 'workspaceId',
						aql: 'name like a',
						schemaId: '2',
					}}
					visibleColumnKeys={
						visibleColumnKeys === null
							? undefined
							: visibleColumnKeys || ['visible-column-1', 'visible-column-2']
					}
					onVisibleColumnKeysChange={
						onVisibleColumnKeysChange === null ? undefined : onVisibleColumnKeysChange || jest.fn()
					}
					{...propsOverride}
				/>
			</IntlProvider>
		</AnalyticsListener>,
		{
			wrapper: ({ children }) => <SmartCardProvider>{children}</SmartCardProvider>,
		},
	);

	return { mockReset, ...renderResult };
};

describe('DatasourceTableView', () => {
	const store = defaultRegistry.getStore(Store, 'datasource');

	beforeEach(() => {
		store.storeState.resetState();
		jest.clearAllMocks();
		// Default to "normal" (non-PDF) render mode for most tests.
		// PDF render mode (shouldControlDataExport: true) should be opt-in per test.
		asMock(useSmartCardContext).mockReturnValue({
			value: {
				shouldControlDataExport: false,
			},
		} as any);
	});

	it('should call IssueLikeDataTableView with right props', () => {
		store.actions.onAddItems(defaultMockResponseItems, 'jira', 'work-item');

		// Not exactly "correct" way of testing with React Testing Library,
		// But in this case 4 props we want to check are just passed through and
		// the only way to test them would be to test how they affect UI
		// which is already tested in IssueLikeDataTableView unit tests
		const IssueLikeDataTableViewConstructorSpy = jest.spyOn(
			issueLikeModule,
			'IssueLikeDataTableView',
		);
		const mockOnColumnResize = jest.fn();
		const mockOnWrappedColumnChange = jest.fn();
		const { getByTestId } = setup(
			{
				visibleColumnKeys: ['myColumn'],
				responseItems: defaultMockResponseItems,
			},
			{
				columnCustomSizes: { myColumn: 67 },
				wrappedColumnKeys: ['myColumn'],
				onColumnResize: mockOnColumnResize,
				onWrappedColumnChange: mockOnWrappedColumnChange,
			},
		);

		expect(getByTestId('myColumn-column-heading')).toHaveTextContent('My Column');
		expect(getByTestId('datasource-table-view--row-some-id1')).toHaveTextContent('some-value');

		expect(IssueLikeDataTableViewConstructorSpy).toHaveBeenCalled();
		const issueLikeDataTableViewProps = IssueLikeDataTableViewConstructorSpy.mock
			.calls[0][0] as IssueLikeDataTableViewProps;

		expect(issueLikeDataTableViewProps).toEqual(
			expect.objectContaining({
				columnCustomSizes: { myColumn: 67 },
				wrappedColumnKeys: ['myColumn'],
				onColumnResize: mockOnColumnResize,
				onWrappedColumnChange: mockOnWrappedColumnChange,
			}),
		);
	});

	it('should call useDatasourceTableState with the correct arguments', () => {
		setup();

		expect(useDatasourceTableState).toHaveBeenCalledWith({
			datasourceId: 'some-datasource-id',
			parameters: {
				cloudId: 'some-cloud-id',
				jql: 'some-jql-query',
			},
			fieldKeys: ['visible-column-1', 'visible-column-2'],
		});
	});

	it('should call onVisibleColumnKeysChange with defaultVisibleColumnKeys if no visibleColumnKeys are received from props', () => {
		const onVisibleColumnKeysChange = jest.fn();
		const { getByTestId } = setup({
			onVisibleColumnKeysChange,
			visibleColumnKeys: null,
		});

		expect(getByTestId('myColumn-column-heading')).toHaveTextContent('My Column');
		expect(onVisibleColumnKeysChange).toHaveBeenCalledWith(['myColumn']);
	});

	it('should NOT call onVisibleColumnKeysChange with defaultVisibleColumnKeys if visibleColumnKeys are received from props', () => {
		const onVisibleColumnKeysChange = jest.fn();
		setup({
			visibleColumnKeys: ['myColumn'],
			onVisibleColumnKeysChange,
		});

		expect(onVisibleColumnKeysChange).not.toHaveBeenCalled();
	});

	it('should NOT call onVisibleColumnKeysChange with defaultVisibleColumnKeys if no defaultVisibleColumnKeys are returned from hook', () => {
		const onVisibleColumnKeysChange = jest.fn();
		setup({
			defaultVisibleColumnKeys: [],
			onVisibleColumnKeysChange,
		});

		expect(onVisibleColumnKeysChange).not.toHaveBeenCalled();
	});

	it('should wait for data AND columns before rendering table', () => {
		const { queryByTestId } = setup({
			columns: [],
			visibleColumnKeys: ['myColumn'],
		});

		expect(queryByTestId('datasource-table-view')).toBe(null);
		expect(queryByTestId('datasource-table-view-skeleton')).toBeInTheDocument();
	});

	ffTest.on('lp_enable_datasource-table-view_height_override', '', () => {
		it('should render IssueLikeDataTableView with the overriden height', () => {
			store.actions.onAddItems(defaultMockResponseItems, 'jira', 'work-item');
			const IssueLikeDataTableViewConstructorSpy = jest.spyOn(
				issueLikeModule,
				'IssueLikeDataTableView',
			);
			const { getByTestId } = setup(
				{
					visibleColumnKeys: ['myColumn'],
					responseItems: defaultMockResponseItems,
				},
				{
					scrollableContainerHeight: 500,
				},
			);

			expect(getComputedStyle(getByTestId('issue-like-table-container')).maxHeight).toEqual(
				'500px',
			);

			expect(IssueLikeDataTableViewConstructorSpy).toHaveBeenCalled();
			const issueLikeDataTableViewProps = IssueLikeDataTableViewConstructorSpy.mock
				.calls[0][0] as IssueLikeDataTableViewProps;

			expect(issueLikeDataTableViewProps).toEqual(
				expect.objectContaining({
					scrollableContainerHeight: 500,
				}),
			);
		});

		it('should render IssueLikeDataTableView with the default height when scrollableContainerHeight is not specified', () => {
			store.actions.onAddItems(defaultMockResponseItems, 'jira', 'work-item');
			const IssueLikeDataTableViewConstructorSpy = jest.spyOn(
				issueLikeModule,
				'IssueLikeDataTableView',
			);
			const { getByTestId } = setup({
				visibleColumnKeys: ['myColumn'],
				responseItems: defaultMockResponseItems,
			});

			expect(getComputedStyle(getByTestId('issue-like-table-container')).maxHeight).toEqual(
				'590px',
			);

			expect(IssueLikeDataTableViewConstructorSpy).toHaveBeenCalled();
			const issueLikeDataTableViewProps = IssueLikeDataTableViewConstructorSpy.mock
				.calls[0][0] as IssueLikeDataTableViewProps;

			expect(issueLikeDataTableViewProps).toEqual(
				expect.objectContaining({
					scrollableContainerHeight: 590,
				}),
			);
		});
	});

	ffTest.off('lp_enable_datasource-table-view_height_override', '', () => {
		it('should render IssueLikeDataTableView with the default height', () => {
			store.actions.onAddItems(defaultMockResponseItems, 'jira', 'work-item');
			const IssueLikeDataTableViewConstructorSpy = jest.spyOn(
				issueLikeModule,
				'IssueLikeDataTableView',
			);
			const { getByTestId } = setup(
				{
					visibleColumnKeys: ['myColumn'],
					responseItems: defaultMockResponseItems,
				},
				{
					scrollableContainerHeight: 500,
				},
			);

			expect(getComputedStyle(getByTestId('issue-like-table-container')).maxHeight).toEqual(
				'590px',
			);

			expect(IssueLikeDataTableViewConstructorSpy).toHaveBeenCalled();
			const issueLikeDataTableViewProps = IssueLikeDataTableViewConstructorSpy.mock
				.calls[0][0] as IssueLikeDataTableViewProps;

			expect(issueLikeDataTableViewProps).toEqual(
				expect.objectContaining({
					scrollableContainerHeight: 590,
				}),
			);
		});
	});

	it('should render IssueLikeDataTableView with undefined height when shouldControlDataExport is true and feature gate is enabled', () => {
		store.actions.onAddItems(defaultMockResponseItems, 'jira', 'work-item');
		asMock(useSmartCardContext).mockReturnValue({
			value: {
				shouldControlDataExport: true,
			},
		} as any);
		const IssueLikeDataTableViewConstructorSpy = jest.spyOn(
			issueLikeModule,
			'IssueLikeDataTableView',
		);
		setup(
			{
				visibleColumnKeys: ['myColumn'],
				responseItems: defaultMockResponseItems,
			},
			{
				scrollableContainerHeight: 500,
			},
		);

		expect(IssueLikeDataTableViewConstructorSpy).toHaveBeenCalled();
		const issueLikeDataTableViewProps = IssueLikeDataTableViewConstructorSpy.mock
			.calls[0][0] as IssueLikeDataTableViewProps;

		expect(issueLikeDataTableViewProps).toEqual(
			expect.objectContaining({
				scrollableContainerHeight: undefined,
			}),
		);
	});

	it('should render IssueLikeDataTableView with default height when shouldControlDataExport is false and feature gate is enabled', () => {
		store.actions.onAddItems(defaultMockResponseItems, 'jira', 'work-item');
		// Simulate shouldControlDataExport being false
		jest.spyOn(require('@atlaskit/link-provider'), 'useSmartCardContext').mockReturnValue({
			value: { shouldControlDataExport: false },
		});
		const IssueLikeDataTableViewConstructorSpy = jest.spyOn(
			issueLikeModule,
			'IssueLikeDataTableView',
		);
		setup(
			{
				visibleColumnKeys: ['myColumn'],
				responseItems: defaultMockResponseItems,
			},
			{
				scrollableContainerHeight: 500,
			},
		);

		expect(IssueLikeDataTableViewConstructorSpy).toHaveBeenCalled();
		const issueLikeDataTableViewProps = IssueLikeDataTableViewConstructorSpy.mock
			.calls[0][0] as IssueLikeDataTableViewProps;

		expect(issueLikeDataTableViewProps).toEqual(
			expect.objectContaining({
				scrollableContainerHeight: 590,
			}),
		);
	});

	it('should render table footer', () => {
		const { getByTestId } = setup();

		expect(getByTestId('table-footer')).toBeInTheDocument();
	});

	it('should render the powered by JSM Assets link with Assets DatasourceId', async () => {
		const { queryByTestId } = setupAssetsTable();
		const assetsLink = queryByTestId('powered-by-jsm-assets-link');

		expect(assetsLink).toBeInTheDocument();
	});

	it('should fire ui.link.clicked.poweredBy when Assets link is clicked', async () => {
		const { findByTestId } = setupAssetsTable();
		const assetsLink = await findByTestId('powered-by-jsm-assets-link');
		expect(assetsLink).toBeInTheDocument();

		await assetsLink.click();
		await waitFor(() => {
			expect(onAnalyticFireEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						action: 'clicked',
						actionSubject: 'link',
						actionSubjectId: 'poweredBy',
						eventType: 'ui',
						attributes: {
							componentHierarchy: 'datasourceTable',
							extensionKey: 'jsm-cmdb-gateway',
						},
					}),
				}),
				EVENT_CHANNEL,
			);
		});
	});

	it('should not render the powered by JSM Assets link on footer if datasource is not Assets', async () => {
		const { queryByTestId } = setup();
		const assetsLink = queryByTestId('powered-by-jsm-assets-link');

		expect(assetsLink).not.toBeInTheDocument();
	});

	it('should not call reset() on initial load (only when parameters change)', () => {
		const { mockReset } = setup();
		expect(mockReset).not.toHaveBeenCalled();
	});

	it('should call reset() when parameters change', () => {
		const { rerender, mockReset } = setup();

		const newParameters = {
			cloudId: 'new-cloud-id',
			jql: 'some-jql-query',
		};

		rerender(
			<DatasourceTableView
				datasourceId={'some-datasource-id'}
				parameters={newParameters}
				visibleColumnKeys={['visible-column-1', 'visible-column-2']}
				onVisibleColumnKeysChange={jest.fn()}
			/>,
		);

		expect(mockReset).toHaveBeenCalledTimes(1);
	});

	it('should call reset() when refresh button is preset', () => {
		const { getByRole, mockReset } = setup();

		asMock(mockReset).mockReset();

		getByRole('button', { name: 'Refresh' }).click();

		expect(mockReset).toHaveBeenCalledTimes(1);
		expect(mockReset).toHaveBeenCalledWith({
			shouldForceRequest: true,
			shouldResetColumns: false,
		});
	});

	it('should call reset() with shouldResetColumns to be true when Assets Table', () => {
		const { getByRole, mockReset } = setupAssetsTable();
		asMock(mockReset).mockReset();
		getByRole('button', { name: 'Refresh' }).click();
		expect(mockReset).toHaveBeenCalledTimes(1);
		expect(mockReset).toHaveBeenCalledWith({
			shouldForceRequest: true,
			shouldResetColumns: true,
		});
	});

	it('should not show duplicate response items when a new column is added', () => {
		const { rerender, getByTestId } = setup({
			visibleColumnKeys: ['title'],
			responseItems: [
				{
					title: {
						data: 'title1',
					},
					id: {
						data: 'id1',
					},
					date: {
						data: 'date1',
					},
				},
			],
		});

		// check there is 1 response item
		expect(getByTestId('item-count').textContent).toEqual('1 item');

		// rerender the component with the new column added
		rerender(
			<DatasourceTableView
				datasourceId={'some-datasource-id'}
				parameters={{
					cloudId: 'some-cloud-id',
					jql: 'some-jql-query',
				}}
				visibleColumnKeys={['title', 'id']}
				onVisibleColumnKeysChange={jest.fn()}
			/>,
		);

		// ensure hook is called with the new column
		expect(useDatasourceTableState).toHaveBeenCalledWith({
			datasourceId: 'some-datasource-id',
			parameters: {
				cloudId: 'some-cloud-id',
				jql: 'some-jql-query',
			},
			fieldKeys: ['title', 'id'],
		});

		// check there is still only 1 response item
		expect(getByTestId('item-count').textContent).toEqual('1 item');
	});

	it.each([
		['should', true, true],
		['should not', true, false],
		['should not', false, true],
		['should not', false, false],
	])(
		`%p call onNextPage when hasNextPage is %p and isLastItemVisible is %p`,
		(outcome, hasNextPage, isLastItemVisible) => {
			asMock(useIsOnScreen).mockReturnValue(isLastItemVisible);
			const onNextPage = jest.fn();

			setup({ hasNextPage, onNextPage });

			if (outcome === 'should') {
				expect(onNextPage).toHaveBeenCalled();
			} else {
				expect(onNextPage).not.toHaveBeenCalled();
			}
		},
	);

	describe('when an error on /data request occurs', () => {
		it('should show an error message on request failure', () => {
			const url = 'https://www.atlassian.com/test-url';
			const { getByRole, getByText, mockReset } = setup(
				{
					status: 'rejected',
				},
				{ url },
			);

			expect(getByText(`URL is: ${url}`)).toBeInTheDocument();

			expect(getByText('Unable to load items')).toBeInTheDocument();

			getByRole('button', { name: testRefreshButtonLabel }).click();
			expect(mockReset).toHaveBeenCalledTimes(1);
			expect(mockReset).toHaveBeenCalledWith({ shouldForceRequest: true });
		});

		it('should show an no results message on 403 response', () => {
			const { getByText } = setup({ status: 'forbidden' });

			expect(getByText("We couldn't find anything matching your search")).toBeInTheDocument();
		});
	});

	describe('when the request status is unauthorized', () => {
		it('should display the access error ui', () => {
			const { getByTestId } = setup({ status: 'unauthorized' });
			expect(getByTestId('datasource--access-required')).toBeInTheDocument();
		});

		it('should display the access error ui with auth connection info when auth details is available', () => {
			const { getByTestId, getByRole } = setup({
				status: 'unauthorized',
				providerName: 'Amplitude',
				authDetails: [
					{
						key: 'amplitude',
						displayName: 'Atlassian Links - Amplitude',
						url: 'https://id.atlassian.com/login',
					},
				],
			});

			const authUI = getByTestId('datasource--access-required-with-auth');
			expect(authUI).toBeInTheDocument();
			expect(getByRole('button')).toHaveTextContent('Connect');
			expect(getByRole('heading')).toHaveTextContent('Connect your Amplitude account');
			expect(getByRole('link')).toHaveTextContent('Learn more about Smart Links.');
			expect(authUI).toHaveTextContent(
				`Connect your Amplitude account to collaborate on work across Atlassian products.`,
			);
		});

		it('should display default access error ui text when providerName is undefined', () => {
			const { getByTestId, getByRole } = setup({
				status: 'unauthorized',
				authDetails: [
					{
						key: 'amplitude',
						displayName: 'Atlassian Links - Amplitude',
						url: 'https://id.atlassian.com/login',
					},
				],
			});
			expect(getByRole('heading')).toHaveTextContent('Connect your account');
			expect(getByTestId('datasource--access-required-with-auth')).toHaveTextContent(
				'Connect your account to collaborate on work across Atlassian products.',
			);
		});

		it('should call reset when auth completes successfully', async () => {
			const { getByRole, mockReset } = setup({
				status: 'unauthorized',
				authDetails: [
					{
						key: 'amplitude',
						displayName: 'Atlassian Links - Amplitude',
						url: 'test.success.url',
					},
				],
			});

			const authConnectButton = getByRole('button');
			fireEvent.click(authConnectButton);

			await waitFor(() => expect(mockReset).toHaveBeenCalled());
		});

		it('should call reset when auth fails', async () => {
			const { getByRole, mockReset } = setup({
				status: 'unauthorized',
				authDetails: [
					{
						key: 'amplitude',
						displayName: 'Atlassian Links - Amplitude',
						url: 'test.fail.url',
					},
				],
			});

			const authConnectButton = getByRole('button');
			fireEvent.click(authConnectButton);

			await waitFor(() => expect(mockReset).toHaveBeenCalled());
		});
	});

	it('should display count text correctly when single row is present', () => {
		const { getByTestId } = setup({
			visibleColumnKeys: ['title'],
			responseItems: [
				{
					title: {
						data: 'title1',
					},
				},
			],
		});

		expect(getByTestId('item-count').textContent).toEqual('1 item');
	});

	it('should display count text correctly when multiple rows are present', () => {
		const { getByTestId } = setup({
			visibleColumnKeys: ['title'],
			responseItems: [
				{
					title: {
						data: 'title1',
					},
				},
				{
					title: {
						data: 'title1',
					},
				},
			],
		});

		expect(getByTestId('item-count').textContent).toEqual('2 items');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup();

		await expect(container).toBeAccessible();
	});
});

describe('Analytics: DatasourceTableView', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should fire "ui.error.shown" with reason as "access" when the user unauthorised', () => {
		setup({
			status: 'unauthorized',
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
			},
			EVENT_CHANNEL,
		);
	});

	it('should fire "ui.button.clicked.sync" event when refresh button is clicked', async () => {
		const { getByRole } = setup();

		getByRole('button', { name: 'Refresh' }).click();
		expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
			{
				payload: {
					eventType: 'ui',
					actionSubject: 'button',
					action: 'clicked',
					actionSubjectId: 'sync',
					attributes: {
						extensionKey: 'jira-object-provider',
						destinationObjectTypes: ['issue'],
					},
				},
				context: [
					{
						component: 'datasourceTable',
					},
				],
			},
			EVENT_CHANNEL,
		);
	});

	describe('"ui.datasource.renderSuccess" event', () => {
		const getEventPayload = (
			overrideAttributes: Partial<DatasourceRenderSuccessAttributesType> = {},
		) => ({
			payload: {
				action: 'renderSuccess',
				actionSubject: 'datasource',
				attributes: {
					extensionKey: 'jira-object-provider',
					destinationObjectTypes: ['issue'],
					displayedColumnCount: 2,
					display: 'table',
					...overrideAttributes,
				},
				eventType: 'ui',
			},
			context: [
				{
					component: 'datasourceTable',
				},
			],
		});

		it('should fire "ui.datasource.renderSuccess" event with display = "table" when the data is present and status is resolved', () => {
			setup();

			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				getEventPayload({ totalItemCount: 1 }),
				EVENT_CHANNEL,
			);
		});

		it.each(['unauthorized', 'empty', 'rejected'])(
			'should not fire "ui.datasource.renderSuccess" event with display = "table" when the status is %s',
			(status) => {
				setup({ status: status as DatasourceTableStatusType });

				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(),
					EVENT_CHANNEL,
				);
			},
		);

		it.each([
			{
				columns: [],
			},
			{
				responseItems: [],
			},
			{
				totalCount: 0,
			},
		])(
			'should not fire "ui.datasource.renderSuccess" event with display = "table" when status is resolved, but %s',
			(override) => {
				setup({ status: 'resolved', ...override });

				expect(onAnalyticFireEvent).not.toBeFiredWithAnalyticEventOnce(
					getEventPayload(),
					EVENT_CHANNEL,
				);
			},
		);
	});

	it('should Fire "operational.provider.authSuccess" on sucessful auth flow', async () => {
		const { getByRole } = setup({
			status: 'unauthorized',
			authDetails: [
				{
					key: 'Jira',
					displayName: 'Atlassian Links - Jira',
					url: 'test.success.url',
				},
			],
		});

		const authConnectButton = getByRole('button');
		fireEvent.click(authConnectButton);

		await waitFor(() => {
			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'authSuccess',
						actionSubject: 'provider',
						attributes: {
							extensionKey: 'jira-object-provider',
							experience: 'datasource',
						},
						eventType: 'operational',
					},
				},
				EVENT_CHANNEL,
			);
		});
	});

	it('should Fire "operational.provider.authFailure" on auth failure', async () => {
		const { getByRole } = setup({
			status: 'unauthorized',
			authDetails: [
				{
					key: 'Jira',
					displayName: 'Atlassian Links - Jira',
					url: 'test.fail.url',
				},
			],
		});

		const authConnectButton = getByRole('button');
		fireEvent.click(authConnectButton);

		await waitFor(() => {
			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'authFailure',
						actionSubject: 'provider',
						attributes: {
							reason: null,
							extensionKey: 'jira-object-provider',
							experience: 'datasource',
						},
						eventType: 'operational',
					},
				},
				EVENT_CHANNEL,
			);
		});
	});
});

describe('UFO metrics: DatasourceTableView', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('TableRendered', () => {
		it('should start ufo experience when DatasourceTableView is initialised', async () => {
			setup({
				status: 'loading',
			});

			expect(mockTableRenderUfoStart).toHaveBeenCalledTimes(1);

			expect(mockTableRenderUfoSuccess).not.toHaveBeenCalled();
			expect(mockTableRenderUfoFailure).not.toHaveBeenCalled();
		});

		it('should add extensionKey metadata to ufo experience when DatasourceTableView is initialised', async () => {
			setup({
				status: 'loading',
			});

			expect(mockTableRenderUfoAddMetadata).toHaveBeenCalledTimes(1);
			expect(mockTableRenderUfoAddMetadata).toHaveBeenCalledWith({
				extensionKey: 'jira-object-provider',
			});
		});

		it('should mark as a successful experience when DatasourceTableView results are resolved', async () => {
			setup({
				responseItems: [
					{
						id: {
							data: 'some-id1',
						},
					},
					{
						id: {
							data: 'some-id2',
						},
					},
				],
			});

			expect(mockTableRenderUfoSuccess).toHaveBeenCalledTimes(1);

			expect(mockTableRenderUfoFailure).not.toHaveBeenCalled();
		});

		it('should start experience when DatasourceTableView gets re-rendered', async () => {
			const { rerender } = setup({
				status: 'loading',
			});

			const newParameters = {
				cloudId: 'new-cloud-id',
				jql: 'some-jql-query',
			};

			rerender(
				<DatasourceTableView
					datasourceId={'some-datasource-id'}
					parameters={newParameters}
					visibleColumnKeys={['visible-column-1', 'visible-column-2', 'visible-column-3']}
				/>,
			);

			expect(mockTableRenderUfoStart).toHaveBeenCalledTimes(2);
		});

		it('should not start experience when DatasourceTableView gets re-rendered but hook status is resolved', async () => {
			const { rerender } = setup({
				status: 'loading',
			});

			const newParameters = {
				cloudId: 'new-cloud-id',
				jql: 'some-jql-query',
			};

			setup();

			rerender(
				<DatasourceTableView
					datasourceId={'some-datasource-id'}
					parameters={newParameters}
					visibleColumnKeys={['visible-column-1']}
				/>,
			);

			expect(mockTableRenderUfoStart).toHaveBeenCalledTimes(1);
		});

		it('should mark as a failed experience when DatasourceTableView request fails', async () => {
			setup({
				status: 'rejected',
			});

			expect(mockTableRenderUfoFailure).toHaveBeenCalled();
			expect(mockTableRenderUfoFailure).toHaveBeenCalledTimes(1);

			expect(mockTableRenderUfoSuccess).not.toHaveBeenCalled();
		});

		it('should mark as a failed experience when DatasourceTableView data request returns unauthorised response', async () => {
			setup({
				status: 'unauthorized',
			});

			expect(mockTableRenderUfoSuccess).toHaveBeenCalled();
			expect(mockTableRenderUfoSuccess).toHaveBeenCalledTimes(1);

			expect(mockTableRenderUfoFailure).not.toHaveBeenCalled();
		});

		it('should abort the experience when DatasourceTableView results are empty', async () => {
			setup({
				responseItems: [],
			});

			expect(mockTableRenderUfoSuccess).toHaveBeenCalled();
			expect(mockTableRenderUfoSuccess).toHaveBeenCalledTimes(1);

			expect(mockTableRenderUfoFailure).not.toHaveBeenCalled();
		});
	});

	describe('ColumnPickerRendered', () => {
		it('should not mark as a failed experience when status is resolved', async () => {
			setup();

			expect(mockColumnPickerRenderUfoFailure).not.toHaveBeenCalled();
		});

		it('should mark as a failed experience when status is rejected', async () => {
			setup({
				status: 'rejected',
			});

			expect(mockColumnPickerRenderUfoFailure).toHaveBeenCalledTimes(1);
		});
	});
});
