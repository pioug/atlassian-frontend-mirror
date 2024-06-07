import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { DatePicker } from '@atlaskit/datetime-picker';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { type DateRangeOption } from '../../../../../common/modal/popup-select/types';
import { DateRangePicker, type DateRangeSelection } from '../index';

const popupContainerTestId = 'confluence-search-datasource-popup-container';
const lastModifiedValues = [
	'Anytime',
	'Today',
	'Yesterday',
	'Past 7 days',
	'Past 30 days',
	'Past year',
	'Custom',
];

jest.mock('@atlaskit/datetime-picker', () => ({
	DatePicker: jest.fn().mockReturnValue(<div data-testid={'mocked-date-picker'}></div>),
}));

describe('DateRangePicker', () => {
	const buildTestFixture = (
		onSelectionChange: (updatedOption: DateRangeSelection) => void,
		config?: {
			selection: DateRangeOption | undefined;
		},
	) => {
		return (
			<IntlProvider locale="en">
				<DateRangePicker onSelectionChange={onSelectionChange} selection={config?.selection} />
			</IntlProvider>
		);
	};

	const setup = () => {
		userEvent.setup();
		const spy = jest.fn();

		const mockDatePickerCalls = asMock(DatePicker).mock.calls;

		const getFromDatePickerMockProps = () => {
			return mockDatePickerCalls[mockDatePickerCalls.length - 2][0];
		};

		const getToDatePickerMockProps = () => {
			return mockDatePickerCalls[mockDatePickerCalls.length - 1][0];
		};

		const onSelectionChange = jest.fn();
		const { rerender } = render(buildTestFixture(onSelectionChange));

		return {
			getFromDatePickerMockProps,
			getToDatePickerMockProps,
			rerender,
			spy,
			onSelectionChange,
		};
	};

	describe('basic functionality', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should render a button with default option selected', async () => {
			setup();

			const triggerButton = await screen.findByTestId('confluence-search-modal--date-range-button');
			expect(triggerButton).toBeInTheDocument();
			expect(triggerButton).toHaveTextContent('Last updated: Anytime');
		});

		it.each(lastModifiedValues)(
			'should should render a popup with option %p in the list',
			async (optionTitle) => {
				setup();
				const triggerButton = await screen.findByTestId(
					'confluence-search-modal--date-range-button',
				);
				await userEvent.click(triggerButton);

				expect(await screen.findByTestId(popupContainerTestId)).toBeInTheDocument();
				expect(await screen.findByText(optionTitle)).toBeInTheDocument();
			},
		);

		it('should hide popup when option is selected', async () => {
			setup();
			const triggerButton = await screen.findByTestId('confluence-search-modal--date-range-button');
			await userEvent.click(triggerButton);

			expect(await screen.findByTestId(popupContainerTestId)).toBeInTheDocument();

			const option = await screen.findByText('Today');
			await userEvent.click(option);

			await waitFor(() => {
				expect(screen.queryByTestId(popupContainerTestId)).not.toBeInTheDocument();
			});
		});

		// The Custom option doesn't update trigger label until update button is clicked, tested in separate suite below
		it.each(lastModifiedValues.filter((option) => option !== 'Custom'))(
			'should update button text with option %p when selected',
			async (optionTitle) => {
				const { rerender, onSelectionChange } = setup();
				const triggerButton = await screen.findByTestId(
					'confluence-search-modal--date-range-button',
				);
				await userEvent.click(triggerButton);

				expect(await screen.findByTestId(popupContainerTestId)).toBeInTheDocument();

				const selectedOption = await screen.findByText(optionTitle);
				await userEvent.click(selectedOption);

				const mockCalls = onSelectionChange.mock.calls;
				const selectedDateRangeOption = mockCalls[mockCalls.length - 1][0];

				// label is updated by rerender with new filterSelection state value from parent triggered by onSelectionChange
				rerender(
					buildTestFixture(onSelectionChange, {
						selection: selectedDateRangeOption,
					}),
				);

				expect(triggerButton).toHaveTextContent(`Last updated: ${optionTitle}`);
			},
		);

		it.each([
			['Anytime', 'anyTime', 'anyTime'],
			['Today', 'today', 'today'],
			['Yesterday', 'yesterday', 'yesterday'],
			['Past 7 days', 'past7Days', 'past7Days'],
			['Past 30 days', 'past30Days', 'past30Days'],
			['Past year', 'pastYear', 'pastYear'],
		])(
			'should call onSelectionChange with selected option value for constant options',
			async (optionTitle, expectedValue, expectedLabel) => {
				const { onSelectionChange } = setup();
				const triggerButton = await screen.findByTestId(
					'confluence-search-modal--date-range-button',
				);
				await userEvent.click(triggerButton);

				expect(await screen.findByTestId(popupContainerTestId)).toBeInTheDocument();

				const option = await screen.findByText(optionTitle);
				await userEvent.click(option);

				expect(onSelectionChange).toHaveBeenCalledWith({
					value: expectedValue,
					from: undefined,
					to: undefined,
				});
			},
		);
	});

	describe('Custom lastModified Date Picker', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		const clickToCustomOption = async () => {
			const triggerButton = await screen.findByTestId('confluence-search-modal--date-range-button');
			await userEvent.click(triggerButton);

			expect(await screen.findByTestId(popupContainerTestId)).toBeInTheDocument();

			const selectedOption = await screen.findByText('Custom');
			await userEvent.click(selectedOption);
		};

		it('Should render date pickers and update button correctly', async () => {
			const { getFromDatePickerMockProps, getToDatePickerMockProps } = setup();
			await clickToCustomOption();

			expect(await screen.getByTestId('custom-date-range-update-button')).toBeInTheDocument();

			const fromDatePickerMockProps = getFromDatePickerMockProps();
			const toDatePickerMockProps = getToDatePickerMockProps();

			expect(fromDatePickerMockProps).not.toBe(null);
			expect(toDatePickerMockProps).not.toBe(null);
		});

		it('When update clicked the label is set to custom correctly', async () => {
			const { rerender, onSelectionChange } = setup();
			await clickToCustomOption();

			const updateButton = screen.getByTestId('custom-date-range-update-button');
			await userEvent.click(updateButton);

			const mockCalls = onSelectionChange.mock.calls;
			const selectedDateRangeOption = mockCalls[mockCalls.length - 1][0];

			// label is updated by rerender with new filterSelection state value from parent triggered by onSelectionChange
			rerender(
				buildTestFixture(onSelectionChange, {
					selection: selectedDateRangeOption,
				}),
			);

			const triggerButton = await screen.findByTestId('confluence-search-modal--date-range-button');

			expect(triggerButton).toHaveTextContent(`Last updated: Custom`);
		});

		describe('When only from date is supplied', () => {
			it('When a valid date is supplied the correct options are returned', async () => {
				const expectedDate = '2016-01-01';
				const { getFromDatePickerMockProps, onSelectionChange } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedDate);
				});

				const updateButton = screen.getByTestId('custom-date-range-update-button');
				await userEvent.click(updateButton);

				expect(onSelectionChange).toHaveBeenCalledWith({
					value: 'custom',
					from: expectedDate,
					to: undefined,
				});
			});

			it('When a future date is selected state should be invalid', async () => {
				const expectedDate = '2090-11-11';
				const { getFromDatePickerMockProps } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedDate);
				});

				const updatedFromDateMockProps = getFromDatePickerMockProps();
				expect(updatedFromDateMockProps.isInvalid).toEqual(true);
			});

			it('should update button label when valid "from" date is selected', async () => {
				const expectedDate = '2016-01-01';
				const { getFromDatePickerMockProps, onSelectionChange, rerender } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedDate);
				});

				const updateButton = screen.getByTestId('custom-date-range-update-button');
				await userEvent.click(updateButton);

				const mockCalls = onSelectionChange.mock.calls;
				const selectedDateRangeOption = mockCalls[mockCalls.length - 1][0];

				// label is updated by rerender with new filterSelection state value from parent triggered by onSelectionChange
				rerender(
					buildTestFixture(onSelectionChange, {
						selection: selectedDateRangeOption,
					}),
				);

				const triggerButton = await screen.findByTestId(
					'confluence-search-modal--date-range-button',
				);

				expect(triggerButton).toHaveTextContent(`Last updated: after Jan 1, 2016`);
			});
		});

		describe('When only to date is supplied', () => {
			it('When a valid date is supplied the correct options are returned', async () => {
				const expectedDate = '2016-01-01';
				const { getToDatePickerMockProps, onSelectionChange } = setup();
				await clickToCustomOption();

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedDate);
				});

				const updateButton = screen.getByTestId('custom-date-range-update-button');
				await userEvent.click(updateButton);

				expect(onSelectionChange).toHaveBeenCalledWith({
					value: 'custom',
					from: undefined,
					to: expectedDate,
				});
			});

			it('When a future date is selected state should be invalid', async () => {
				const expectedDate = '2090-11-11';
				const { getToDatePickerMockProps } = setup();
				await clickToCustomOption();

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedDate);
				});

				const updatedToDateMockProps = getToDatePickerMockProps();
				expect(updatedToDateMockProps.isInvalid).toEqual(true);
			});

			it('should update button label when valid "to" date is selected', async () => {
				const expectedDate = '2016-01-01';
				const { getToDatePickerMockProps, onSelectionChange, rerender } = setup();
				await clickToCustomOption();

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedDate);
				});

				const updateButton = screen.getByTestId('custom-date-range-update-button');
				await userEvent.click(updateButton);

				const mockCalls = onSelectionChange.mock.calls;
				const selectedDateRangeOption = mockCalls[mockCalls.length - 1][0];

				// label is updated by rerender with new filterSelection state value from parent triggered by onSelectionChange
				rerender(
					buildTestFixture(onSelectionChange, {
						selection: selectedDateRangeOption,
					}),
				);

				const triggerButton = await screen.findByTestId(
					'confluence-search-modal--date-range-button',
				);

				expect(triggerButton).toHaveTextContent(`Last updated: before Jan 1, 2016`);
			});
		});

		describe('When both from and to date is supplied', () => {
			it('Correct options are returned for valid date range', async () => {
				const expectedFromDate = '2016-01-01';
				const expectedToDate = '2016-12-12';
				const { getFromDatePickerMockProps, getToDatePickerMockProps, onSelectionChange } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedFromDate);
				});

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedToDate);
				});

				const updateButton = screen.getByTestId('custom-date-range-update-button');
				await userEvent.click(updateButton);

				expect(onSelectionChange).toHaveBeenCalledWith({
					value: 'custom',
					from: expectedFromDate,
					to: expectedToDate,
				});
			});

			it('If from date is after to date error state should be shown', async () => {
				const expectedFromDate = '2016-11-11';
				const expectedToDate = '2016-10-10';
				const { getFromDatePickerMockProps, getToDatePickerMockProps } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedFromDate);
				});

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedToDate);
				});

				const updatedFromDateMockProps = getFromDatePickerMockProps();
				expect(updatedFromDateMockProps.isInvalid).toEqual(true);

				const updatedToDateMockProps = getToDatePickerMockProps();
				expect(updatedToDateMockProps.isInvalid).toEqual(true);
			});

			it('If from date is in future and to date is valid error state should be shown', async () => {
				const expectedFromDate = '2090-11-11';
				const expectedToDate = '2016-10-10';
				const { getFromDatePickerMockProps, getToDatePickerMockProps } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedFromDate);
				});

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedToDate);
				});

				const updatedFromDateMockProps = getFromDatePickerMockProps();
				expect(updatedFromDateMockProps.isInvalid).toEqual(true);

				const updatedToDateMockProps = getToDatePickerMockProps();
				expect(updatedToDateMockProps.isInvalid).toEqual(true);
			});

			it('If from date is valid and to date is in future then error state should be shown', async () => {
				const expectedFromDate = '2016-10-10';
				const expectedToDate = '2090-10-10';
				const { getFromDatePickerMockProps, getToDatePickerMockProps } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedFromDate);
				});

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedToDate);
				});

				const updatedFromDateMockProps = getFromDatePickerMockProps();
				expect(updatedFromDateMockProps.isInvalid).toEqual(true);

				const updatedToDateMockProps = getToDatePickerMockProps();
				expect(updatedToDateMockProps.isInvalid).toEqual(true);
			});

			it('If both from and to dates are in future then error state should be shown', async () => {
				const expectedFromDate = '2090-10-10';
				const expectedToDate = '2090-11-11';
				const { getFromDatePickerMockProps, getToDatePickerMockProps } = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedFromDate);
				});

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedToDate);
				});

				const updatedFromDateMockProps = getFromDatePickerMockProps();
				expect(updatedFromDateMockProps.isInvalid).toEqual(true);

				const updatedToDateMockProps = getToDatePickerMockProps();
				expect(updatedToDateMockProps.isInvalid).toEqual(true);
			});

			it('should update button label when valid "from" and "to" dates are selected', async () => {
				const expectedFromDate = '2016-01-01';
				const expectedToDate = '2016-12-12';
				const {
					getFromDatePickerMockProps,
					getToDatePickerMockProps,
					onSelectionChange,
					rerender,
				} = setup();
				await clickToCustomOption();

				const fromDatePickerMockProps = getFromDatePickerMockProps();
				act(() => {
					fromDatePickerMockProps.onChange(expectedFromDate);
				});

				const toDatePickerMockProps = getToDatePickerMockProps();
				act(() => {
					toDatePickerMockProps.onChange(expectedToDate);
				});

				const updateButton = screen.getByTestId('custom-date-range-update-button');
				await userEvent.click(updateButton);

				const mockCalls = onSelectionChange.mock.calls;
				const selectedDateRangeOption = mockCalls[mockCalls.length - 1][0];

				// label is updated by rerender with new filterSelection state value from parent triggered by onSelectionChange
				rerender(
					buildTestFixture(onSelectionChange, {
						selection: selectedDateRangeOption,
					}),
				);

				const triggerButton = await screen.findByTestId(
					'confluence-search-modal--date-range-button',
				);

				expect(triggerButton).toHaveTextContent(`Last updated: Jan 1, 2016 - Dec 12, 2016`);
			});
		});
	});
});
