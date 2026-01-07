import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import cases from 'jest-in-case';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Calendar from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Calendar analytics', () => {
	const testId = 'calendar';
	const testIdMonth = `${testId}--month`;
	const setup = (analyticsContext = {}) => {
		const onChange = jest.fn();
		const onSelect = jest.fn();
		const onAnalyticsEvent = jest.fn();
		const selectedDay = 15;

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
				<Calendar
					testId={testId}
					onChange={onChange}
					onSelect={onSelect}
					defaultDay={selectedDay}
					analyticsContext={analyticsContext}
				/>
			</AnalyticsListener>,
		);

		const changeEventResult = {
			payload: {
				action: 'changed',
				actionSubject: 'calendar',
				attributes: {
					componentName: 'calendar',
					packageName,
					packageVersion,
				},
			},
		};

		const selectEventResult = {
			payload: {
				action: 'selected',
				actionSubject: 'calendar',
				attributes: {
					componentName: 'calendar',
					packageName,
					packageVersion,
				},
			},
		};

		return {
			onChange,
			onSelect,
			onAnalyticsEvent,
			selectedDay,
			changeEventResult,
			selectEventResult,
		};
	};

	describe('send change event to atlaskit/analytics', () => {
		it('when switched to previous year', async () => {
			const user = userEvent.setup();
			const { onChange, onAnalyticsEvent, changeEventResult } = setup();

			const previousYearButton = screen.getByTestId('calendar--previous-year');

			await user.click(previousYearButton);

			expect(onChange).toHaveBeenCalledTimes(1);

			// calendar and button analytics
			expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining(changeEventResult),
				'atlaskit',
			);
		});

		it('when switched to previous month', async () => {
			const user = userEvent.setup();
			const { onChange, onAnalyticsEvent, changeEventResult } = setup();

			const previousMonthButton = screen.getByTestId('calendar--previous-month');

			await user.click(previousMonthButton);

			expect(onChange).toHaveBeenCalledTimes(1);

			// calendar and button analytics
			expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining(changeEventResult),
				'atlaskit',
			);
		});

		it('when switched to next month', async () => {
			const user = userEvent.setup();
			const { onChange, onAnalyticsEvent, changeEventResult } = setup();

			const nextMonthButton = screen.getByTestId('calendar--next-month');

			await user.click(nextMonthButton);

			expect(onChange).toHaveBeenCalledTimes(1);

			// calendar and button analytics
			expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining(changeEventResult),
				'atlaskit',
			);
		});

		it('when switched to next year', async () => {
			const user = userEvent.setup();
			const { onChange, onAnalyticsEvent, changeEventResult } = setup();

			const nextYearButton = screen.getByTestId('calendar--next-year');

			await user.click(nextYearButton);

			expect(onChange).toHaveBeenCalledTimes(1);

			// calendar and button analytics
			expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining(changeEventResult),
				'atlaskit',
			);
		});

		cases(
			'when navigated using following keys',
			({ key, code }: { key: string; code: string }) => {
				const { onChange, onAnalyticsEvent, changeEventResult } = setup();

				const calendarGrid = screen.getByTestId(testIdMonth);
				// Not sure why, but this doesn't like userEvent
				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.keyDown(calendarGrid as HTMLDivElement, {
					key,
					code,
				});

				expect(onChange).toHaveBeenCalledTimes(1);

				// calendar analytics
				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);

				expect(onAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining(changeEventResult),
					'atlaskit',
				);
			},
			[
				{
					name: 'ArrowDown',
					key: 'ArrowDown',
					code: 'ArrowDown',
				},
				{
					name: 'ArrowLeft',
					key: 'ArrowLeft',
					code: 'ArrowLeft',
				},
				{
					name: 'ArrowRight',
					key: 'ArrowRight',
					code: 'ArrowRight',
				},
				{
					name: 'ArrowUp',
					key: 'ArrowUp',
					code: 'ArrowUp',
				},
			],
		);
	});

	describe('send select event to atlaskit/analytics', () => {
		it('when day is clicked', async () => {
			const user = userEvent.setup();
			const { onSelect, onAnalyticsEvent, selectEventResult, selectedDay } = setup();

			const stringifiedSelectedDay = selectedDay.toString();
			const selectedDayElementInnerElement = screen.getByText(stringifiedSelectedDay);

			await user.click(selectedDayElementInnerElement);

			expect(onSelect).toHaveBeenCalledTimes(1);

			// calendar analytics
			expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);

			expect(onAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining(selectEventResult),
				'atlaskit',
			);
		});

		cases(
			'when day is selected using following keys',
			({ key, code }: { key: string; code: string }) => {
				const { onSelect, onAnalyticsEvent, selectEventResult } = setup();

				const calendarGrid = screen.getByTestId(testIdMonth);
				// Doesn't like userEvent
				// eslint-disable-next-line testing-library/prefer-user-event
				fireEvent.keyDown(calendarGrid as HTMLDivElement, {
					key,
					code,
				});

				expect(onSelect).toHaveBeenCalledTimes(1);

				// calendar analytics
				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);

				expect(onAnalyticsEvent).toHaveBeenCalledWith(
					expect.objectContaining(selectEventResult),
					'atlaskit',
				);
			},
			[
				{ name: 'Enter', key: 'Enter', code: 'Enter' },
				{ name: 'Space', key: ' ', code: 'Space' },
			],
		);
	});

	describe('context', () => {
		it('should not error if there is no analytics provider', () => {
			const error = jest.spyOn(console, 'error');

			render(<Calendar />);

			expect(error).not.toHaveBeenCalled();

			error.mockRestore();
		});

		it('should allow the addition of additional context', async () => {
			const user = userEvent.setup();
			const analyticsContext = { key: 'value' };
			const { onChange, changeEventResult } = setup(analyticsContext);

			const nextMonthButton = screen.getByTestId('calendar--next-month');

			await user.click(nextMonthButton);

			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				...changeEventResult,
				context: [
					{
						componentName: 'calendar',
						packageName,
						packageVersion,
						...analyticsContext,
					},
				],
			});

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange.mock.calls[0][1].payload).toEqual(expected.payload);
			expect(onChange.mock.calls[0][1].context).toEqual(expected.context);
		});
	});
});
