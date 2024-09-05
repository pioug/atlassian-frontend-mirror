import React from 'react';

const mockColumnPickerUfoSuccess = jest.fn();

import {
	act,
	findByTestId,
	fireEvent,
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
	within,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { defaultRegistry } from 'react-sweet-state';
import invariant from 'tiny-invariant';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
	flushPromises,
	MockIntersectionObserverFactory,
	type MockIntersectionObserverOpts,
} from '@atlaskit/link-test-helpers';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import {
	type DatasourceDataResponseItem,
	type DatasourceResponseSchemaProperty,
} from '@atlaskit/linking-types/datasource';
import { type Input } from '@atlaskit/pragmatic-drag-and-drop/types';
import { type ConcurrentExperience } from '@atlaskit/ufo';
import { type WidthObserver } from '@atlaskit/width-detector';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import SmartLinkClient from '../../../../examples-helpers/smartLinkCustomClient';
import { DatasourceExperienceIdProvider } from '../../../contexts/datasource-experience-id';
import { Store } from '../../../state';
import { ActionsStore } from '../../../state/actions';
import { getOrderedColumns, IssueLikeDataTableView } from '../index';
import { ScrollableContainerHeight } from '../styled';
import { type IssueLikeDataTableViewProps, type TableViewPropsRenderType } from '../types';
import { getColumnMinWidth } from '../utils';

function getDefaultInput(overrides: Partial<Input> = {}): Input {
	const defaults: Input = {
		// user input
		altKey: false,
		button: 0,
		buttons: 0,
		ctrlKey: false,
		metaKey: false,
		shiftKey: false,

		// coordinates
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
	};

	return {
		...defaults,
		...overrides,
	};
}
const mockColumnPickerUfoStart = jest.fn();
const mockTableRenderUfoSuccess = jest.fn();
const mockTableRenderUfoFailure = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
	__esModule: true,
	...jest.requireActual<object>('@atlaskit/ufo'),
	ConcurrentExperience: jest.fn().mockImplementation(
		(experienceId: string): Partial<ConcurrentExperience> => ({
			experienceId: experienceId,
			getInstance: jest.fn().mockImplementation(() => {
				if (experienceId === 'datasource-rendered') {
					return {
						success: mockTableRenderUfoSuccess,
					};
				}
				if (experienceId === 'smart-link-rendered' || experienceId === 'smart-link-authenticated') {
					return {
						success: mockTableRenderUfoSuccess,
						start: mockColumnPickerUfoStart,
						failure: mockTableRenderUfoFailure,
					};
				}
				if (experienceId === 'column-picker-rendered') {
					return {
						start: mockColumnPickerUfoStart,
						addMetadata: mockColumnPickerUfoAddMetadata,
						success: mockColumnPickerUfoSuccess,
					};
				}
			}),
		}),
	),
}));

const mockColumnPickerUfoAddMetadata = jest.fn();

let mockInnerSetWidth: (w: number) => void | undefined;

const setWidth = (width: number) =>
	typeof mockInnerSetWidth === 'function' ? mockInnerSetWidth(width) : undefined;

type WidthObserverType = typeof WidthObserver;

jest.mock('@atlaskit/width-detector', () => {
	return {
		WidthObserver: ((props) => {
			mockInnerSetWidth = props.setWidth;
			return null;
		}) as WidthObserverType,
	};
});

const drag = async (source: HTMLElement, destination: HTMLElement, moveItBy: number = 5) => {
	fireEvent.dragStart(source, getDefaultInput({ clientX: 5 }));
	act(() => {
		// ticking forward an animation frame will complete the lift
		// @ts-ignore
		requestAnimationFrame.step();
	});
	fireEvent.dragEnter(destination);
	fireEvent.dragOver(destination, getDefaultInput({ clientX: 5 + moveItBy }));
	act(() => {
		// ticking forward an animation frame will complete the lift
		// @ts-ignore
		requestAnimationFrame.step();
	});
};

const drop = async (destination: HTMLElement) => {
	fireEvent.drop(destination);
	// dragEnd is important to be called if there are tooltips involved in any tests
	// tooltip watches dragstart event and stops appearing until dragend is called
	fireEvent.dragEnd(destination);
};

const dragAndDrop = async (source: HTMLElement, destination: HTMLElement, moveItBy: number = 5) => {
	await drag(source, destination, moveItBy);
	await drop(destination);
};

describe('IssueLikeDataTableView', () => {
	let mockGetEntries: jest.Mock;
	let mockIntersectionObserverOpts: MockIntersectionObserverOpts;
	let mockCallBackFn: jest.Mock;
	let mockGetBoundingClientRect: jest.MockedFunction<
		typeof Element.prototype.getBoundingClientRect
	>;
	const store = defaultRegistry.getStore(Store);
	const actionStore = defaultRegistry.getStore(ActionsStore);

	const setup = (props: Partial<IssueLikeDataTableViewProps>) => {
		const onAnalyticsEvent = jest.fn();
		const onNextPage = jest.fn(() => {});
		const onLoadDatasourceDetails = jest.fn(() => {});
		const onVisibleColumnKeysChange = jest.fn(() => {});
		const onColumnResize = jest.fn(() => {});
		const onWrappedColumnChange = jest.fn(() => {});
		const smartLinkClient = new SmartLinkClient();

		const renderResult = render(
			<AnalyticsListener channel="media" onEvent={onAnalyticsEvent}>
				<DatasourceExperienceIdProvider>
					<IntlProvider locale="en">
						<SmartCardProvider client={smartLinkClient}>
							<IssueLikeDataTableView
								testId="sometable"
								status={'resolved'}
								onNextPage={onNextPage}
								onLoadDatasourceDetails={onLoadDatasourceDetails}
								hasNextPage={false}
								onVisibleColumnKeysChange={onVisibleColumnKeysChange}
								onColumnResize={onColumnResize}
								onWrappedColumnChange={onWrappedColumnChange}
								items={[]}
								itemIds={[]}
								columns={[]}
								visibleColumnKeys={['id']}
								{...props}
							/>
						</SmartCardProvider>
					</IntlProvider>
				</DatasourceExperienceIdProvider>
			</AnalyticsListener>,
		);

		let wasColumnPickerOpenBefore = false;
		const openColumnPicker = async () => {
			const { findByTestId, getByText, baseElement } = renderResult;

			const triggerButton = await findByTestId('column-picker-trigger-button');

			// open popup
			act(() => {
				fireEvent.click(triggerButton);
			});

			if (!wasColumnPickerOpenBefore) {
				expect(getByText('Loading...')).not.toBeNull();
				await waitForElementToBeRemoved(() => getByText('Loading...'));
			}
			wasColumnPickerOpenBefore = true;

			const picker = baseElement.querySelector('#column-picker-popup');
			invariant(picker);
			const allOptions = picker.querySelectorAll('.column-picker-popup__option');
			const selectedOptions = picker.querySelectorAll('.column-picker-popup__option--is-selected');

			const close = () => {
				// close popup
				act(() => {
					fireEvent.click(triggerButton);
				});
			};

			return {
				close,
				picker,
				allOptions,
				selectedOptions,
			};
		};

		return {
			...renderResult,
			onAnalyticsEvent,
			onNextPage,
			onLoadDatasourceDetails,
			onVisibleColumnKeysChange,
			onColumnResize,
			onWrappedColumnChange,
			openColumnPicker,
		};
	};

	const mockCellBoundingRect = (args: { cellWidth?: number; tableWidth?: number }) => {
		const { cellWidth = 200, tableWidth = 1000 } = args;
		mockGetBoundingClientRect = jest.fn();
		Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
		mockGetBoundingClientRect.mockImplementation(function () {
			// @ts-ignore
			const thisElement = this as HTMLElement;
			const thisElementTestId = thisElement.getAttribute('data-testid');
			// getBoundingClientRect is used in couple of different places
			// we want to be able to distinguish between them
			// when it is used to measure tale container width we want it
			// to be very narrow to make sure last column is resizable and can has `width` css
			if (thisElementTestId === 'issue-like-table-container') {
				return { width: tableWidth, height: 350 } as DOMRect;
			} else {
				return { width: cellWidth, height: 42 } as DOMRect;
			}
		});
	};

	beforeEach(() => {
		jest.useRealTimers();
		store.storeState.resetState();
		mockGetEntries = jest.fn().mockImplementation(() => [{ isIntersecting: false }]);
		mockCallBackFn = jest.fn(async () => {});
		mockIntersectionObserverOpts = {
			disconnect: jest.fn(),
			getMockEntries: mockGetEntries,
		};
		// Gives us access to a mock IntersectionObserver, which we can
		// use to spoof visibility of a Smart Link.
		window.IntersectionObserver = MockIntersectionObserverFactory(mockIntersectionObserverOpts);
		mockCellBoundingRect({ cellWidth: 600, tableWidth: 100 });
	});

	afterEach(() => {
		asMock(Element.prototype.getBoundingClientRect).mockRestore();
	});

	const getSimpleItems = (amount: number = 3): DatasourceDataResponseItem[] =>
		Array(amount)
			.fill(null)
			.map<DatasourceDataResponseItem>((_, i) => ({
				id: {
					data: `id${i}`,
				},
			}));

	const getComplexItems = (): DatasourceDataResponseItem[] => [
		{
			ari: {
				data: 'ari/blah',
			},
			id: {
				data: 'id0',
			},
			someKey: {
				data: 'someData',
			},
			someOtherKey: {
				data: 'someOtherValue',
			},
		},
	];

	const getFalsyItems = (): DatasourceDataResponseItem[] => [
		{
			ari: {
				data: 'ari/blah',
			},
			someNumericKey: {
				data: 0,
			},
			someBooleanKey: {
				data: false,
			},
		},
	];

	const getSimpleColumns = (): DatasourceResponseSchemaProperty[] => [
		{
			key: 'id',
			title: 'ID',
			type: 'string',
		},
	];

	const getComplexColumns = (): DatasourceResponseSchemaProperty[] => [
		{
			key: 'id',
			title: 'Some Id',
			type: 'string',
		},
		{
			key: 'someKey',
			title: 'Some key',
			type: 'string',
		},
		{
			key: 'someOtherKey',
			title: 'Some Other key',
			type: 'string',
		},
	];

	const getFalsyColumns = (): DatasourceResponseSchemaProperty[] => [
		{
			key: 'someNumericKey',
			title: 'numeric key',
			type: 'number',
		},
		{
			key: 'someBooleanKey',
			title: 'boolean key',
			type: 'boolean',
		},
	];

	const getExampleColumns = (): DatasourceResponseSchemaProperty[] => [
		{
			key: 'key',
			title: 'Key',
			type: 'link',
		},
		{
			key: 'type',
			type: 'icon',
			title: 'Type',
		},
		{
			key: 'summary',
			title: 'Summary',
			type: 'link',
		},
		{
			key: 'description',
			title: 'Description',
			type: 'richtext',
		},
		{
			key: 'assignee',
			title: 'Assignee',
			type: 'user',
		},
		{
			key: 'priority',
			title: 'Priority',
			type: 'icon',
		},
		{
			key: 'labels',
			title: 'Labels',
			type: 'tag',
			isList: true,
		},
		{
			key: 'status',
			title: 'Status for each issue',
			type: 'status',
		},
		{
			key: 'created',
			title: 'Date of Creation for each issue',
			type: 'date',
		},
	];

	async function assertColumnTitles(onColumnChange?: () => void) {
		const items = getComplexItems();
		const columns = getComplexColumns();

		const { getByTestId } = setup({
			itemIds: items.map((item) => `${item.ari?.data}`),
			items,
			columns,
			visibleColumnKeys: ['id', 'someOtherKey'],
			onVisibleColumnKeysChange: onColumnChange,
		});

		expect(getByTestId('id-column-heading')).toHaveTextContent('Some Id');
		expect(getByTestId('someOtherKey-column-heading')).toHaveTextContent('Some Other key');
	}

	ffTest.both(
		'platform-datasources-enable-two-way-sync',
		'toggling between read only implementation and inline editable cell',
		() => {
			/**
			 * Exhaustively checks no behaviour change when ids are passed irrespective of flag state
			 * Also checks if ids are passed it has not impact when flag is off
			 */
			describe.each<
				[string, 'both' | 'off' | 'on', (items: DatasourceDataResponseItem[]) => string[]]
			>([
				[
					'with flag on and off and store is populated (provides ids)',
					'both',
					(items: DatasourceDataResponseItem[]) =>
						store.actions.onAddItems(items, 'jira', 'work-item'),
				],
				['with sweet state flag off and with store unpopulated (empty ids)', 'off', () => []],
			])('%s', (_, ffScenario, setupItemIds) => {
				ffTest[ffScenario](
					'enable_datasource_react_sweet_state',
					'behaviour is identical with and without sweet state',
					() => {
						it('should display X rows in correct order given the data', async () => {
							const items: DatasourceDataResponseItem[] = [
								{ id: { data: 'id0' } },
								{},
								{
									id: {
										data: 'id2',
									},
								},
								{
									id: {
										data: 'id3',
									},
								},
							];
							const itemIds = setupItemIds(items);

							const columns: DatasourceResponseSchemaProperty[] = [
								{
									key: 'id',
									title: 'ID',
									type: 'string',
								},
							];

							setup({
								items,
								itemIds,
								columns,
							});

							const rows = await screen.findAllByTestId(/sometable--row-.+/);
							expect(rows[0]).toHaveTextContent('id0');
							expect(rows[1]).toHaveTextContent('');
							expect(rows[2]).toHaveTextContent('id2');
							expect(rows[3]).toHaveTextContent('id3');
						});

						it('should display only selected columns', async () => {
							const items = getComplexItems();
							const columns = getComplexColumns();
							const itemIds = setupItemIds(items);

							const visibleColumnKeys = ['id', 'someOtherKey'];

							setup({
								itemIds,
								items,
								columns,
								visibleColumnKeys,
							});

							const rowColumnTestIds = (await screen.findAllByTestId(/sometable--cell-.+/)).map(
								(el) => el.getAttribute('data-testid'),
							);

							expect(rowColumnTestIds).toEqual(['sometable--cell-0', 'sometable--cell-1']);

							expect(screen.getByTestId('sometable--cell-0')).toHaveTextContent('id0');
							expect(screen.getByTestId('sometable--cell-1')).toHaveTextContent('someOtherValue');
						});

						it('should have column titles in table header', async () => {
							await assertColumnTitles(() => {});
						});

						it('should show tooltip when table header title is hovered', async () => {
							jest.useFakeTimers();
							const items = getComplexItems();
							const columns = getComplexColumns();
							const itemIds = setupItemIds(items);

							setup({
								itemIds,
								items,
								columns,
								visibleColumnKeys: ['id', 'someOtherKey'],
							});

							const headerText = screen.getByText('Some Id');
							expect(headerText).toBeInTheDocument();

							// hover over the tooltip
							fireEvent.mouseOver(headerText);
							act(() => {
								// when there is _.debounce use in the code runOnlyPendingTimers needs to be used
								jest.runAllTimers();
							});

							const usersListWrapper = await screen.findByRole('tooltip');
							expect(usersListWrapper).toBeInTheDocument();
							expect(usersListWrapper).toHaveAttribute('data-placement', 'bottom-start');

							expect(usersListWrapper.textContent).toEqual('Some Id');
						});

						it('should show tooltip when row with list of items is hovered', async () => {
							jest.useFakeTimers();
							const items: DatasourceDataResponseItem[] = [
								{
									ari: { data: 'ari/something' },
									listProp: {
										data: [
											{
												text: 'item1',
											},
											{
												text: 'item2',
											},
										],
									},
								},
							];
							const itemIds = setupItemIds(items);

							const columns: DatasourceResponseSchemaProperty[] = [
								{
									key: 'listProp',
									title: 'List',
									type: 'tag',
									isList: true,
								},
							];

							setup({
								itemIds,
								items,
								columns,
								visibleColumnKeys: ['listProp'],
							});

							expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent(
								'item1item2',
							);

							const listText = screen.getByText('item1');

							// hover over the tooltip
							fireEvent.mouseOver(listText);
							act(() => {
								jest.runOnlyPendingTimers();
							});

							const tooltip = await screen.findByTestId('issues-table-cell-tooltip');

							expect(tooltip).toBeInTheDocument();
							expect(tooltip).toHaveTextContent('item1, item2');

							await waitFor(async () => {
								const hoverCard = screen.queryByTestId('hover-card-trigger-wrapper');
								expect(hoverCard).not.toBeInTheDocument();
							});
						});

						it('should not show tooltip when row with link item is hovered', async () => {
							jest.useFakeTimers();
							const items: DatasourceDataResponseItem[] = [
								{
									ari: { data: 'ari/something' },
									link: {
										data: {
											url: 'https://www.google.com/',
											text: 'sample link',
											style: {
												appearance: 'key',
											},
										},
									},
								},
							];
							const itemIds = setupItemIds(items);

							const columns: DatasourceResponseSchemaProperty[] = [
								{
									key: 'link',
									title: 'link',
									type: 'link',
								},
							];

							setup({
								itemIds,
								items,
								columns,
								visibleColumnKeys: ['link'],
							});

							const link = screen.getByText('sample link');

							// hover over the tooltip
							fireEvent.mouseOver(link);
							act(() => {
								jest.runOnlyPendingTimers();
							});

							const tooltip = screen.queryByTestId('issues-table-cell-tooltip');
							expect(tooltip).not.toBeInTheDocument();

							const hoverCard = screen.queryByTestId('hover-card-trigger-wrapper');
							expect(hoverCard).toBeInTheDocument();
						});

						it('should render list type', async () => {
							const items: DatasourceDataResponseItem[] = [
								{
									ari: { data: 'ari/something' },
									listProp: {
										data: [
											{
												text: 'item1',
											},
											{
												text: 'item2',
											},
										],
									},
								},
							];
							const itemIds = setupItemIds(items);

							const columns: DatasourceResponseSchemaProperty[] = [
								{
									key: 'listProp',
									title: 'List',
									type: 'tag',
									isList: true,
								},
							];

							setup({
								itemIds,
								items,
								columns,
								visibleColumnKeys: ['listProp'],
							});

							expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent(
								'item1item2',
							);
						});

						it('should use provided renderer to transform data by type', async () => {
							const items: DatasourceDataResponseItem[] = [
								{
									ari: { data: 'ari/something' },
									someNumber: { data: 40 },
									someString: { data: 'abc' },
								},
							];
							const itemIds = setupItemIds(items);
							const columns: DatasourceResponseSchemaProperty[] = [
								{
									key: 'someNumber',
									title: 'Some number',
									type: 'number',
								},
								{
									key: 'someString',
									title: 'Some string',
									type: 'string',
								},
							];

							const visibleColumnKeys: string[] = ['someNumber', 'someString'];

							const renderItem: TableViewPropsRenderType = (item) => {
								switch (item.type) {
									case 'number':
										return item.values.map((value) => value + 2);
									case 'string':
										return item.values.map((value) => value + '-blah');
								}
							};

							setup({
								itemIds,
								items,
								columns,
								visibleColumnKeys,
								renderItem,
								hasNextPage: true,
							});

							expect(await screen.findByTestId('sometable--cell-0')).toHaveTextContent('42');
							expect(await screen.findByTestId('sometable--cell-1')).toHaveTextContent('abc-blah');
						});

						it('should process and render falsy values correctly', async () => {
							const items = getFalsyItems();
							const columns = getFalsyColumns();
							const itemIds = setupItemIds(items);
							const visibleColumnKeys = ['someNumericKey', 'someBooleanKey'];

							setup({
								itemIds,
								items,
								columns,
								visibleColumnKeys,
							});
							expect(screen.getByTestId('sometable--cell-0')).toHaveTextContent('0');
							expect(screen.getByTestId('sometable--cell-1')).toHaveTextContent('No');
						});

						it('should call onNextPage again when scrolled to the bottom and actually has a next page', async () => {
							jest.useFakeTimers();

							const items = getSimpleItems();
							const itemIds = setupItemIds(items);
							const columns = getSimpleColumns();

							const { onNextPage } = setup({
								items,
								itemIds,
								columns,
								hasNextPage: true,
							});

							// set bottom visible
							mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

							act(() => {
								jest.runOnlyPendingTimers();
							});

							// should be called twice total since nextPage is called on initial page load and then when bottom is visible
							expect(onNextPage).toHaveBeenCalledTimes(1);
							expect(onNextPage).toHaveBeenCalledWith({
								isSchemaFromData: false,
								shouldForceRequest: true,
							});
						});

						it('should not call nextPage again when scrolled to the bottom and does not have a next page', async () => {
							jest.useFakeTimers();
							const items = getSimpleItems();
							const itemIds = setupItemIds(items);
							const columns = getSimpleColumns();

							const { onNextPage } = setup({
								items,
								itemIds,
								columns,
								hasNextPage: false,
							});

							mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);

							act(() => {
								jest.runOnlyPendingTimers();
							});

							expect(onNextPage).toHaveBeenCalledTimes(0);
						});

						it('should not call nextPage when scrolled to the bottom and next page is already loading', async () => {
							jest.useFakeTimers();
							const items = getSimpleItems();
							const itemIds = setupItemIds(items);
							const columns = getSimpleColumns();

							const { onNextPage } = setup({
								items,
								itemIds,
								columns,
								status: 'loading',
								hasNextPage: true,
							});

							// first scroll to bottom
							mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
							act(() => {
								jest.runOnlyPendingTimers();
							});

							// second scroll to bottom
							mockGetEntries.mockImplementation(() => [{ isIntersecting: false }]);
							act(() => {
								jest.runOnlyPendingTimers();
							});
							mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
							act(() => {
								jest.runOnlyPendingTimers();
							});

							// should only be called twice even though we scrolled to bottom again since second scroll was still in loading state
							expect(onNextPage).not.toHaveBeenCalled();
							act(() => {
								jest.runOnlyPendingTimers();
							});

							// make sure again only called twice after all async stuff just in case
							expect(onNextPage).not.toHaveBeenCalled();
						});

						it('returns 10 loading rows when there are no tableRows and status is loading and scrollableContainerHeight is not provided (modal)', () => {
							jest.useFakeTimers();
							const items: DatasourceDataResponseItem[] = [];
							const itemIds = setupItemIds(items);
							const columns: DatasourceResponseSchemaProperty[] = [];

							const { getByTestId, queryByTestId } = setup({
								items,
								itemIds,
								columns,
								status: 'loading',
								hasNextPage: false,
							});
							for (let i = 0; i < 10; i++) {
								expect(getByTestId(`sometable--row-loading-${i}`)).toBeInTheDocument();
							}
							expect(queryByTestId('sometable--row-loading-10')).toBeNull();
						});

						it('returns 14 loading rows when there are no tableRows and status is loading and scrollableContainerHeight is provided (non-modal)', () => {
							jest.useFakeTimers();
							const items: DatasourceDataResponseItem[] = [];
							const itemIds = setupItemIds(items);
							const columns: DatasourceResponseSchemaProperty[] = [];

							const { getByTestId, queryByTestId } = setup({
								items,
								itemIds,
								columns,
								status: 'loading',
								hasNextPage: false,
								scrollableContainerHeight: ScrollableContainerHeight,
							});
							for (let i = 0; i < 14; i++) {
								expect(getByTestId(`sometable--row-loading-${i}`)).toBeInTheDocument();
							}
							expect(queryByTestId('sometable--row-loading-14')).toBeNull();
						});

						it('should show 1 loading row when new page is loading', async () => {
							jest.useFakeTimers();
							const items = getSimpleItems();
							const itemIds = setupItemIds(items);
							const columns = getSimpleColumns();

							const { findByTestId } = setup({
								items,
								itemIds,
								columns,
								status: 'loading',
								hasNextPage: true,
							});

							// scroll down
							mockGetEntries.mockImplementation(() => [{ isIntersecting: true }]);
							act(() => {
								jest.runOnlyPendingTimers();
							});

							expect(await findByTestId('issues-table-row-loading')).toBeInTheDocument();
						});

						it('should not show column picker button if onColumnsChange is not passed in', async () => {
							jest.useFakeTimers();
							const items = getSimpleItems();
							const itemIds = setupItemIds(items);
							const columns = getSimpleColumns();

							setup({
								items,
								itemIds,
								columns,
								hasNextPage: true,
								onVisibleColumnKeysChange: undefined,
							});

							expect(screen.queryByTestId('column-picker-trigger-button')).not.toBeInTheDocument();
						});

						it('should show column picker button if onColumnsChange is passed in', async () => {
							jest.useFakeTimers();
							const items = getSimpleItems();
							const itemIds = setupItemIds(items);
							const columns = getSimpleColumns();

							setup({
								items,
								itemIds,
								hasNextPage: true,
								columns,
							});

							expect(screen.getByTestId('column-picker-trigger-button')).toBeInTheDocument();
						});

						describe('column picker integration', () => {
							it('should call onLoadDatasourceDetails when opening the picker for the first time', async () => {
								const items = getSimpleItems();
								const itemIds = setupItemIds(items);
								const columns = getSimpleColumns();

								const { onLoadDatasourceDetails, openColumnPicker } = setup({
									items,
									itemIds,
									columns,
									hasNextPage: true,
								});

								await openColumnPicker();
								expect(onLoadDatasourceDetails).toHaveBeenCalledTimes(1);
							});

							it('should not call onLoadDatasourceDetails after opening the picker for the first time', async () => {
								const items = getSimpleItems();
								const itemIds = setupItemIds(items);
								const columns = getSimpleColumns();

								const { onLoadDatasourceDetails, openColumnPicker } = setup({
									items,
									itemIds,
									columns,
									hasNextPage: true,
								});

								const { close } = await openColumnPicker();

								await flushPromises();

								close();

								await openColumnPicker();

								expect(onLoadDatasourceDetails).toHaveBeenCalledTimes(1);
							});

							it('should show all columns', async () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);
								const columns = getComplexColumns();

								const { openColumnPicker } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys: ['someKey', 'someOtherKey'],
									hasNextPage: true,
								});

								const { allOptions } = await openColumnPicker();

								expect(allOptions).toHaveLength(3);
							});

							it('should have visible columns selected', async () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);
								const columns = getComplexColumns();

								const { openColumnPicker } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys: ['someKey', 'someOtherKey'],
									hasNextPage: true,
								});

								const { selectedOptions } = await openColumnPicker();

								expect(selectedOptions).toHaveLength(2);
							});

							it('should update visible columns when column is unselected', async () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);
								const columns = getComplexColumns();

								const { onVisibleColumnKeysChange, openColumnPicker, findByTestId } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys: ['someKey', 'someOtherKey'],
									hasNextPage: true,
								});

								const { selectedOptions } = await openColumnPicker();

								const someKeyColumn = await findByTestId('someKey-column-heading');
								const someOtherKeyColumn = await findByTestId('someOtherKey-column-heading');

								expect(someKeyColumn).toHaveTextContent('Some key');
								expect(someOtherKeyColumn).toHaveTextContent('Some Other key');

								const otherKeyItem = Array.from(selectedOptions).find(
									(el) => (el as HTMLElement).innerText === 'Some Other key',
								);
								invariant(otherKeyItem);

								fireEvent.click(otherKeyItem);

								expect(onVisibleColumnKeysChange).toHaveBeenLastCalledWith(['someKey']);
							});
						});

						const makeDragAndDropTableProps = () => {
							const onColumnsChange = jest.fn();
							const onNextPage = jest.fn();
							const items: DatasourceDataResponseItem[] = [
								{
									id: { data: `id1` },
									task: {
										data: 'TASK-1',
									},
									emoji: { data: ':D' },
									summary: { data: 'some summary' },
								},
								{
									id: { data: `id2` },
									task: { data: 'TASK-2' },
									emoji: { data: ':)' },
									summary: { data: 'some summary' },
								},
								{
									id: { data: `id3` },
									task: { data: 'TASK-3' },
									emoji: { data: ':(' },
									summary: { data: 'some summary' },
								},
							];
							const itemIds = setupItemIds(items);
							const columns: DatasourceResponseSchemaProperty[] = [
								{
									key: 'id',
									title: 'id',
									type: 'string',
								},
								{
									key: 'task',
									title: 'task',
									type: 'string',
								},
								{
									key: 'emoji',
									title: 'emoji',
									type: 'string',
								},
								{
									key: 'summary',
									title: 'summary',
									type: 'string',
								},
							];

							const visibleColumnKeys: string[] = ['id', 'task', 'emoji'];

							return {
								onNextPage,
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								onColumnsChange,
							};
						};

						it('should not have column resizing handles when no onWidthChange was given', () => {
							const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

							const { queryByTestId } = setup({
								onColumnResize: undefined,
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								columnCustomSizes: { id: 100, task: 200, emoji: 300 },
								hasNextPage: false,
							});

							expect(queryByTestId('column-resize-handle')).toBeNull();
						});

						it('should use max-width when onWidthChange is not defined AND there are NO custom widths defined neither', () => {
							const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

							const { queryByTestId, queryAllByTestId } = setup({
								onColumnResize: undefined,
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								columnCustomSizes: undefined,
								hasNextPage: false,
							});

							expect(queryByTestId('task-column-heading')).toHaveStyle('max-width: 176px');
							expect(queryAllByTestId('sometable--cell-1')[0]).toHaveStyle('max-width: 176px');
							expect(queryByTestId('sometable')).not.toHaveStyle('table-layout: fixed');
						});

						it('should use max-width when in readonly mode AND there are NO custom widths defined either', () => {
							const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

							const { queryByTestId, queryAllByTestId } = setup({
								onColumnResize: undefined,
								onVisibleColumnKeysChange: undefined,
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								columnCustomSizes: undefined,
								hasNextPage: false,
							});

							expect(queryByTestId('task-column-heading')).toHaveStyle('max-width: 176px');
							expect(queryAllByTestId('sometable--cell-1')[0]).toHaveStyle('max-width: 176px');
							expect(queryByTestId('sometable')).not.toHaveStyle('table-layout: fixed');
						});

						it('should use width when in readonly mode AND there ARE custom widths defined', () => {
							const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

							const { queryByTestId, queryAllByTestId } = setup({
								onColumnResize: undefined,
								onVisibleColumnKeysChange: undefined,
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								columnCustomSizes: { emoji: 300 },
								hasNextPage: false,
							});

							expect(queryByTestId('task-column-heading')).toHaveStyle('width: 176px');
							expect(queryAllByTestId('sometable--cell-1')[0]).toHaveStyle('width: 176px');
							expect(queryByTestId('emoji-column-heading')).toHaveStyle('width: 300px');
							expect(queryByTestId('sometable')).toHaveStyle('table-layout: fixed');
						});

						it('should call onWidthChange when column resized', async () => {
							const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

							mockCellBoundingRect({ cellWidth: 200 });

							const { onColumnResize, getByTestId } = setup({
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								columnCustomSizes: { id: 100, task: 200, emoji: 300 },
								hasNextPage: false,
							});

							const dragHandle = await findByTestId(
								getByTestId('task-column-heading'),
								'column-resize-handle',
							);
							await dragAndDrop(dragHandle, dragHandle);

							expect(onColumnResize).toHaveBeenCalledWith('task', 205);
						});

						it.each<[string, number]>([
							['task', 32],
							['summary', 208],
						])(
							'should not allow column "%s" width smaller then %d when resized',
							async (key, expectedMinWidth) => {
								const { columns, items, itemIds } = makeDragAndDropTableProps();

								mockCellBoundingRect({ cellWidth: 400 });

								const { onColumnResize, getByTestId } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys: ['id', 'summary', 'task', 'emoji'],
									columnCustomSizes: { id: 100, task: 200, summary: 300, emoji: 300 },
									hasNextPage: false,
								});

								const dragHandle = await findByTestId(
									getByTestId(`${key}-column-heading`),
									'column-resize-handle',
								);
								await drag(dragHandle, dragHandle, -395);
								expect(getByTestId(`${key}-column-heading`)).toHaveStyle({
									width: `${expectedMinWidth}px`,
								});
								await drop(dragHandle);

								expect(onColumnResize).toHaveBeenCalledWith(key, getColumnMinWidth(key));
							},
						);

						describe('when container is wider then sum of all column widths, last column', () => {
							it('should not have resize handle', () => {
								const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

								mockCellBoundingRect({ tableWidth: 1000 });

								const { getByTestId } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys,
									columnCustomSizes: { id: 100, task: 200, emoji: 300 },
									hasNextPage: false,
								});

								expect(
									within(getByTestId('emoji-column-heading')).queryByTestId('column-resize-handle'),
								).toBeNull();
							});

							it('should has no with nor max-width css set', () => {
								const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

								mockCellBoundingRect({ tableWidth: 1000 });

								const { queryByTestId } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys,
									columnCustomSizes: { id: 100, task: 200, emoji: 300 },
									hasNextPage: false,
								});

								expect(queryByTestId('emoji-column-heading')).toHaveStyle({
									maxWidth: undefined,
									width: undefined,
								});
							});

							describe('and there is no onColumnResize (readonly)', () => {
								it('should have max-width set', () => {
									const { columns, items, itemIds, visibleColumnKeys } =
										makeDragAndDropTableProps();

									mockCellBoundingRect({ tableWidth: 1000 });

									const { queryByTestId } = setup({
										items,
										itemIds,
										columns,
										visibleColumnKeys,
										onColumnResize: undefined,
										columnCustomSizes: undefined,
										hasNextPage: false,
									});

									expect(queryByTestId('emoji-column-heading')).toHaveStyle('max-width: 176px');
								});
							});

							describe('and then container width changes and gets smaller', () => {
								it('should bring back resize handle and set width css', () => {
									jest.useFakeTimers();
									const { columns, items, itemIds, visibleColumnKeys } =
										makeDragAndDropTableProps();

									mockCellBoundingRect({ tableWidth: 1000 });

									const { getByTestId } = setup({
										items,
										itemIds,
										columns,
										visibleColumnKeys,
										columnCustomSizes: { id: 100, task: 200, emoji: 300 },
										hasNextPage: false,
									});

									act(() => setWidth(100));
									act(() => {
										jest.runOnlyPendingTimers();
									});

									const emojiHeading = getByTestId('emoji-column-heading');
									expect(within(emojiHeading).queryByTestId('column-resize-handle')).not.toBeNull();
									expect(emojiHeading).toHaveStyle('width: 300px');
								});
							});
						});

						describe('when sum of all column widths is bigger than container width, last column', () => {
							it('should have resize handle', () => {
								const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

								const { getByTestId } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys,
									columnCustomSizes: { id: 100, task: 200, emoji: 300 },
									hasNextPage: false,
								});

								expect(
									within(getByTestId('emoji-column-heading')).queryByTestId('column-resize-handle'),
								).not.toBeNull();
							});

							it('should has width css set', () => {
								const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

								mockCellBoundingRect({ tableWidth: 100 });

								const { queryByTestId } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys,
									columnCustomSizes: { id: 100, task: 200, emoji: 300 },
									hasNextPage: false,
								});

								expect(queryByTestId('emoji-column-heading')).toHaveStyle('width: 300px');
							});

							describe('and then container width changes and gets bigger', () => {
								it('should remove resize handle as well as width css', () => {
									jest.useFakeTimers();
									const { columns, items, itemIds, visibleColumnKeys } =
										makeDragAndDropTableProps();

									mockCellBoundingRect({ tableWidth: 100 });

									const { getByTestId } = setup({
										items,
										itemIds,
										columns,
										visibleColumnKeys,
										columnCustomSizes: { id: 100, task: 200, emoji: 300 },
										hasNextPage: false,
									});

									act(() => setWidth(1000));
									act(() => {
										jest.runOnlyPendingTimers();
									});

									const emojiHeading = getByTestId('emoji-column-heading');
									expect(within(emojiHeading).queryByTestId('column-resize-handle')).toBeNull();
									expect(emojiHeading).toHaveStyle({
										maxWidth: undefined,
										width: undefined,
									});
								});
							});
						});

						it('should have correct column order after a drag and drop reorder', async () => {
							const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

							const { onVisibleColumnKeysChange, getByTestId } = setup({
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								hasNextPage: false,
							});

							const dragHandle = screen.getByTestId('id-column-heading');
							const dropTarget = await findByTestId(
								getByTestId('emoji-column-heading'),
								'column-drop-target',
							);
							expect(dropTarget).toBeDefined();

							await dragAndDrop(dragHandle, dropTarget);
							expect(onVisibleColumnKeysChange).toHaveBeenCalledTimes(1);
							expect(onVisibleColumnKeysChange).toHaveBeenCalledWith(['task', 'id', 'emoji']);
						});

						it('should have correct order of columns inside picker', async () => {
							const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();

							const { getByTestId, openColumnPicker } = setup({
								items,
								itemIds,
								columns,
								visibleColumnKeys,
								hasNextPage: false,
							});

							const dragHandle = screen.getByTestId('id-column-heading');
							const dropTarget = await findByTestId(
								getByTestId('emoji-column-heading'),
								'column-drop-target',
							);
							expect(dropTarget).toBeDefined();

							await dragAndDrop(dragHandle, dropTarget);

							const { allOptions } = await openColumnPicker();

							const pickerOptionTitles = Array.from(allOptions).map(
								(el) => (el as HTMLElement).innerText,
							);
							expect(pickerOptionTitles).toEqual(['task', 'id', 'emoji', 'summary']);
						});

						it('should not be able to drag and drop between tables', async () => {
							const {
								onColumnsChange: onColumnsChange1,
								columns: columns1,
								onNextPage: onNextPage1,
								items: items1,
								itemIds: itemIds1,
								visibleColumnKeys,
							} = makeDragAndDropTableProps();
							const {
								onColumnsChange: onColumnsChange2,
								columns: columns2,
								onNextPage: onNextPage2,
								items: items2,
								itemIds: itemIds2,
							} = makeDragAndDropTableProps();

							const { getByTestId } = render(
								<DatasourceExperienceIdProvider>
									<IntlProvider locale="en">
										<div>
											<IssueLikeDataTableView
												testId="sometable1"
												status={'resolved'}
												items={items1}
												itemIds={itemIds1}
												onNextPage={onNextPage1}
												onLoadDatasourceDetails={mockCallBackFn}
												hasNextPage={false}
												columns={columns1}
												visibleColumnKeys={visibleColumnKeys}
												onVisibleColumnKeysChange={onColumnsChange1}
											/>
											<IssueLikeDataTableView
												testId="sometable2"
												status={'resolved'}
												items={items2}
												itemIds={itemIds2}
												onNextPage={onNextPage2}
												onLoadDatasourceDetails={mockCallBackFn}
												hasNextPage={false}
												columns={columns2}
												visibleColumnKeys={visibleColumnKeys}
												onVisibleColumnKeysChange={onColumnsChange2}
											/>
										</div>
									</IntlProvider>
								</DatasourceExperienceIdProvider>,
							);

							const table1Head = getByTestId('sometable1--head');
							const table2Head = getByTestId('sometable2--head');

							const dragHandle = await findByTestId(table1Head, 'id-column-heading');
							const table2EmojiHeader = await findByTestId(table2Head, 'emoji-column-heading');
							const dropTarget = await findByTestId(table2EmojiHeader, 'column-drop-target');

							await dragAndDrop(dragHandle, dropTarget);
							expect(onColumnsChange1).not.toHaveBeenCalled();
							expect(onColumnsChange2).not.toHaveBeenCalled();
						});

						describe('drag and drop features should not be shown', () => {
							it('should not show when onColumnsChange is not provided', async () => {
								const { columns, items, itemIds, visibleColumnKeys } = makeDragAndDropTableProps();
								const { queryByTestId, queryByLabelText } = setup({
									items,
									itemIds,
									columns,
									visibleColumnKeys,
									hasNextPage: false,
									onVisibleColumnKeysChange: undefined,
								});

								expect(queryByLabelText('emoji-drag-icon')).toBeNull();
								expect(queryByTestId('column-drop-target')).toBeNull();
							});

							it('should not show when table is loading', async () => {
								const { columns, visibleColumnKeys } = makeDragAndDropTableProps();
								const { queryByTestId, queryByLabelText } = setup({
									items: [],
									itemIds: [],
									columns,
									status: 'loading',
									visibleColumnKeys,
								});

								expect(queryByLabelText('emoji-drag-icon')).toBeNull();
								expect(queryByTestId('column-drop-target')).toBeNull();
							});

							it('should have column titles in table header', async () => {
								await assertColumnTitles(undefined);
							});
						});

						describe('when custom column size is not defined, and default widths are applied', () => {
							const prepColumns = (): {
								[key: string]: DatasourceResponseSchemaProperty;
							} => ({
								summary: {
									key: 'summary',
									title: 'Summary',
									type: 'string',
									isList: true,
								},
								key: {
									key: 'key',
									title: 'Key',
									type: 'string',
									isList: true,
								},
								name: {
									key: 'name',
									title: 'Name',
									type: 'string',
									isList: true,
								},
								dob: {
									key: 'dob',
									title: 'DoB',
									type: 'date',
									isList: true,
								},
								hobby: {
									key: 'hobby',
									title: 'Hobby',
									type: 'tag',
									isList: true,
								},
								status: {
									key: 'status',
									title: 'Status',
									type: 'status',
								},
								priority: {
									key: 'priority',
									title: 'Priority',
									type: 'icon',
								},
							});

							it('should render the header and cells with width from the configured fields', () => {
								const items: DatasourceDataResponseItem[] = [
									{ summary: { data: 'summary' }, status: { data: { text: 'done' } } },
								];
								const itemIds = setupItemIds(items);
								const columns = prepColumns();

								const { queryByTestId, queryAllByTestId } = setup({
									items,
									itemIds,
									columns: [columns.summary, columns.status],
									visibleColumnKeys: ['summary', 'status'],
									hasNextPage: false,
									onColumnResize: undefined,
									onVisibleColumnKeysChange: undefined,
								});

								expect(queryByTestId('summary-column-heading')).toHaveStyle('max-width: 360px');
								expect(queryAllByTestId('sometable--cell-0')[0]).toHaveStyle('max-width: 360px');

								expect(queryByTestId('status-column-heading')).toHaveStyle(
									`max-width: ${8 * 18}px`,
								);
							});

							it('should render the header and cells with width from the configured types', () => {
								const items: DatasourceDataResponseItem[] = [
									{ name: { data: 'key1' }, dob: { data: '12/12/2023' } },
								];
								const itemIds = setupItemIds(items);
								const columns = prepColumns();

								const { queryByTestId } = setup({
									items,
									itemIds,
									columns: [columns.name, columns.dob, columns.priority],
									visibleColumnKeys: ['name', 'dob', 'priority'],
									hasNextPage: false,
									onColumnResize: undefined,
									onVisibleColumnKeysChange: undefined,
								});

								expect(queryByTestId('name-column-heading')).toHaveStyle('max-width: 176px');

								expect(queryByTestId('dob-column-heading')).toHaveStyle('max-width: 128px');

								expect(queryByTestId('priority-column-heading')).toHaveStyle('max-width: 64px');
							});

							it('should render the header and cells with given column width in draggable mode', () => {
								const items: DatasourceDataResponseItem[] = [
									{ name: { data: 'key1' }, dob: { data: '12/12/2023' } },
								];
								const itemIds = setupItemIds(items);
								const columns = prepColumns();

								const { queryByTestId, queryAllByTestId } = setup({
									items,
									itemIds,
									columns: [columns.name, columns.dob],
									columnCustomSizes: { name: 100, dob: 200 },
									visibleColumnKeys: ['name', 'dob'],
									hasNextPage: false,
								});

								expect(queryByTestId('name-column-heading')).toHaveStyle({
									width: '100px',
								});
								expect(queryAllByTestId('sometable--cell-0')[0]).toHaveStyle('width: 100px');

								expect(queryByTestId('dob-column-heading')).toHaveStyle({
									width: '200px',
								});
							});

							it('should render the header and cells with given column width in static mode', () => {
								const items: DatasourceDataResponseItem[] = [
									{ name: { data: 'key1' }, dob: { data: '12/12/2023' } },
								];
								const itemIds = setupItemIds(items);
								const columns = prepColumns();

								const { queryByTestId } = setup({
									items,
									itemIds,
									columns: [columns.name, columns.dob],
									columnCustomSizes: { name: 100, dob: 200 },
									visibleColumnKeys: ['name', 'dob'],
									hasNextPage: false,
									onVisibleColumnKeysChange: undefined,
								});

								expect(queryByTestId('name-column-heading')).toHaveStyle({
									width: '100px',
								});

								expect(queryByTestId('dob-column-heading')).toHaveStyle({
									width: '200px',
								});
							});

							it('should render the header and cells with width in draggable mode', () => {
								const items: DatasourceDataResponseItem[] = [
									{ summary: { data: 'summary' }, status: { data: { text: 'done' } } },
								];
								const itemIds = setupItemIds(items);
								const columns = prepColumns();
								const { queryByTestId } = setup({
									items,
									itemIds,
									columns: [columns.summary, columns.status],
									visibleColumnKeys: ['summary', 'status'],
									hasNextPage: false,
								});

								expect(queryByTestId('summary-column-heading')).toHaveStyle({
									width: '360px',
								});

								expect(queryByTestId('status-column-heading')).toHaveStyle({
									width: `${8 * 18}px`,
								});
							});

							it('should render the header and cells with truncate css properties', () => {
								const items: DatasourceDataResponseItem[] = [
									{
										summary: {
											data: 'summary',
										},
										key: { data: 'KEY-123' },
									},
								];
								const itemIds = setupItemIds(items);
								const columns = prepColumns();
								const { queryByTestId } = setup({
									items,
									itemIds,
									columns: [columns.summary, columns.key],
									visibleColumnKeys: ['summary', 'key'],
									hasNextPage: false,
								});

								const tableCell = queryByTestId('sometable--cell-0');
								const styles = getComputedStyle(tableCell!);
								expect(styles.textOverflow).toBe('ellipsis');
							});
						});

						describe('header dropdown', () => {
							it('should have an item with "wrap text" title', async () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);

								const { getByTestId } = setup({
									items,
									itemIds,
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});

								expect(
									screen.queryByTestId('someOtherKey-column-dropdown-item-toggle-wrapping'),
								).toBeNull();

								getByTestId('someOtherKey-column-dropdown').click();
								expect(
									(await screen.findByTestId('someOtherKey-column-dropdown-item-toggle-wrapping'))
										.textContent,
								).toBe('Wrap text');
							});

							it('should call onWrappedColumnChange when "Wrap text" is clicked', async () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);

								const { onWrappedColumnChange, findByTestId } = setup({
									items,
									itemIds,
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});

								const someOtherKeyColumn = await findByTestId('someOtherKey-column-dropdown');
								fireEvent.click(someOtherKeyColumn);

								const toggleWrappingButton = await findByTestId(
									'someOtherKey-column-dropdown-item-toggle-wrapping',
								);
								fireEvent.click(toggleWrappingButton);

								expect(onWrappedColumnChange).toHaveBeenCalledWith('someOtherKey', true);
							});

							it('should not have header dropdown when onWrappedColumnChange is not provided', () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);

								const { queryByTestId } = setup({
									onWrappedColumnChange: undefined,
									items,
									itemIds,
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});

								expect(queryByTestId('someOtherKey-column-dropdown')).toBeNull();
							});

							it('should have readonly title when onWrappedColumnChange is not provided', () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);

								const { getByTestId } = setup({
									onWrappedColumnChange: undefined,
									items,
									itemIds,
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});

								expect(getByTestId('someOtherKey-column-heading').textContent).toBe(
									'Some Other key',
								);
							});

							it('should display Unwrap Text item when column is wrapped', async () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);

								const { getByTestId } = setup({
									wrappedColumnKeys: ['someOtherKey'],
									items,
									itemIds,
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});

								getByTestId('someOtherKey-column-dropdown').click();
								expect(
									(await screen.findByTestId('someOtherKey-column-dropdown-item-toggle-wrapping'))
										.textContent,
								).toBe('Unwrap text');
							});

							it('should fire ui.button.clicked.wrap event on "Wrap text" is clicked', () => {
								const { onAnalyticsEvent, getByTestId, getByText } = setup({
									items: getComplexItems(),
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});

								fireEvent.click(getByTestId('someOtherKey-column-dropdown'));
								fireEvent.click(getByText('Wrap text'));

								expect(onAnalyticsEvent).toBeFiredWithAnalyticEventOnce(
									{
										payload: {
											eventType: 'ui',
											action: 'clicked',
											actionSubject: 'button',
											actionSubjectId: 'wrap',
										},
									},
									'media',
								);
							});

							it('should call onWrappedColumnChange when "Unwrap text" is clicked', async () => {
								const items = getComplexItems();
								const itemIds = setupItemIds(items);

								const { onWrappedColumnChange, findByTestId } = setup({
									wrappedColumnKeys: ['someOtherKey'],
									items,
									itemIds,
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});
								const someOtherKeyColumn = await findByTestId('someOtherKey-column-dropdown');
								fireEvent.click(someOtherKeyColumn);

								const toggleWrappingButton = await findByTestId(
									'someOtherKey-column-dropdown-item-toggle-wrapping',
								);
								fireEvent.click(toggleWrappingButton);

								expect(onWrappedColumnChange).toHaveBeenCalledWith('someOtherKey', false);
							});

							it('should fire ui.button.clicked.unwrap event on "Unwrap text" is clicked', () => {
								const { onAnalyticsEvent, getByTestId, getByText } = setup({
									wrappedColumnKeys: ['someOtherKey'],
									items: getComplexItems(),
									columns: getComplexColumns(),
									visibleColumnKeys: ['id', 'someOtherKey'],
								});

								fireEvent.click(getByTestId('someOtherKey-column-dropdown'));
								fireEvent.click(getByText('Unwrap text'));

								expect(onAnalyticsEvent).toBeFiredWithAnalyticEventOnce(
									{
										payload: {
											eventType: 'ui',
											action: 'clicked',
											actionSubject: 'button',
											actionSubjectId: 'unwrap',
										},
									},
									'media',
								);
							});
						});

						it('should sort columns in correct order for column picker', () => {
							const columns = getExampleColumns();
							const visibleColumnKeys = ['created', 'priority', 'key'];
							const orderedColumns = getOrderedColumns(columns, visibleColumnKeys);
							const expectedOrderedColumns = [
								{
									key: 'created',
									title: 'Date of Creation for each issue',
									type: 'date',
								},
								{ key: 'priority', title: 'Priority', type: 'icon' },
								{ key: 'key', title: 'Key', type: 'link' },
								{ key: 'assignee', title: 'Assignee', type: 'user' },
								{ key: 'description', title: 'Description', type: 'richtext' },
								{ key: 'labels', title: 'Labels', type: 'tag', isList: true },
								{ key: 'status', title: 'Status for each issue', type: 'status' },
								{ key: 'summary', title: 'Summary', type: 'link' },
								{ key: 'type', type: 'icon', title: 'Type' },
							];
							expect(orderedColumns).toEqual(expectedOrderedColumns);
						});
					},
				);
			});
		},
	);

	ffTest.on('platform-datasources-enable-two-way-sync', 'toggling inline editable cell', () => {
		ffTest.on('enable_datasource_react_sweet_state', 'with react sweet state on', () => {
			it('shows editable cell on click when field is editable', async () => {
				const items = getComplexItems();
				const columns = getComplexColumns();
				const itemIds = store.actions.onAddItems(items, 'jira', 'work-item');
				actionStore.storeState.setState({
					actionsByIntegration: {
						jira: {
							someKey: {
								actionKey: 'atlassian:issue:update:someKey',
								type: 'string',
							},
						},
					},
					permissions: {
						'ari/blah': {
							someKey: { isEditable: true },
						},
					},
				});

				const visibleColumnKeys = ['id', 'someKey', 'someOtherKey'];

				setup({
					itemIds,
					items,
					columns,
					visibleColumnKeys,
				});

				const rowColumnTestIds = (await screen.findAllByTestId(/sometable--cell-.+/)).map((el) =>
					el.getAttribute('data-testid'),
				);

				expect(rowColumnTestIds).toEqual([
					'sometable--cell-0',
					'sometable--cell-1',
					'sometable--cell-2',
				]);

				const cell = screen.getByText('someData');
				fireEvent.click(cell);

				expect(screen.getByTestId('inline-edit-text')).toBeInTheDocument();
			});

			it('does not show editable cell on click when field is NOT editable', async () => {
				const items = getComplexItems();
				const columns = getComplexColumns();
				const itemIds = store.actions.onAddItems(items, 'jira', 'work-item');
				actionStore.storeState.setState({
					actionsByIntegration: {
						jira: {
							someKey: {
								actionKey: 'atlassian:issue:update:someKey',
								type: 'string',
							},
						},
					},
					permissions: {
						'ari/blah': {
							someKey: { isEditable: false },
						},
					},
				});

				const visibleColumnKeys = ['id', 'someKey', 'someOtherKey'];

				setup({
					itemIds,
					items,
					columns,
					visibleColumnKeys,
				});

				const rowColumnTestIds = (await screen.findAllByTestId(/sometable--cell-.+/)).map((el) =>
					el.getAttribute('data-testid'),
				);

				expect(rowColumnTestIds).toEqual([
					'sometable--cell-0',
					'sometable--cell-1',
					'sometable--cell-2',
				]);

				const cell = screen.getByText('someData');
				fireEvent.click(cell);

				expect(screen.queryByTestId('inline-edit-text')).not.toBeInTheDocument();
			});

			it('does not show editable cell on click when there are no actions available', async () => {
				const items = getComplexItems();
				const columns = getComplexColumns();
				const itemIds = store.actions.onAddItems(items, 'jira', 'work-item');
				actionStore.storeState.setState({
					actionsByIntegration: {},
					permissions: {},
				});

				const visibleColumnKeys = ['id', 'someKey', 'someOtherKey'];

				setup({
					itemIds,
					items,
					columns,
					visibleColumnKeys,
				});

				const rowColumnTestIds = (await screen.findAllByTestId(/sometable--cell-.+/)).map((el) =>
					el.getAttribute('data-testid'),
				);

				expect(rowColumnTestIds).toEqual([
					'sometable--cell-0',
					'sometable--cell-1',
					'sometable--cell-2',
				]);

				const cell = screen.getByText('someData');
				fireEvent.click(cell);

				expect(screen.queryByTestId('inline-edit-text')).not.toBeInTheDocument();
			});
		});
	});

	describe('UFO metrics', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		describe('TableRendered', () => {
			it('should not mark Ufo experience as successful when data is loading', async () => {
				jest.useRealTimers();
				setup({
					status: 'loading',
				});

				expect(mockTableRenderUfoSuccess).not.toHaveBeenCalled();
			});
		});

		describe('TableRendered', () => {
			it('should mark Ufo experience as successful when data is loaded', async () => {
				const items: DatasourceDataResponseItem[] = [
					{ id: { data: 'id1' } },
					{
						id: {
							data: 'id2',
						},
					},
					{
						id: {
							data: 'id3',
						},
					},
				];

				const columns: DatasourceResponseSchemaProperty[] = [
					{
						key: 'id',
						title: 'ID',
						type: 'string',
					},
				];

				setup({
					items,
					columns,
				});

				expect(mockTableRenderUfoSuccess).toHaveBeenCalled();
			});
		});

		describe('ColumnPickerRendered', () => {
			it('should mark Ufo experience as started when column picker is opened', async () => {
				const items: DatasourceDataResponseItem[] = [
					{ id: { data: 'id1' } },
					{
						id: {
							data: 'id2',
						},
					},
					{
						id: {
							data: 'id3',
						},
					},
				];

				const columns: DatasourceResponseSchemaProperty[] = [
					{
						key: 'id',
						title: 'ID',
						type: 'string',
					},
				];

				const { openColumnPicker } = setup({
					items,
					columns,
				});

				await openColumnPicker();

				expect(mockColumnPickerUfoStart).toHaveBeenCalledTimes(1);
				expect(mockColumnPickerUfoAddMetadata).toHaveBeenCalledTimes(1);
			});
		});
	});
});
