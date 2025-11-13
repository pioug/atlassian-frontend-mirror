import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import DateRangeRenderType, { DATERANGE_TYPE_TEST_ID, type DateRangeProps } from './index';

describe('DateRangeRenderType', () => {
	// Hint: Timezone is configured for jest tests in
	// @see platform/build/configs/jest-config/globalSetup.js
	const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const setup = ({
		value,
		testId,
		timeZone,
	}: {
		testId?: DateRangeProps['testId'];
		/**
		 * Please remember that `timeZone` is only changing formatting & handling through `IntlProvider`.
		 * It doesn't change real time zone within `Node.js` or browser environments.
		 * The shift is expected in a test because the date from UTC
		 * will be converted by `formatDate` to a specified time zone.
		 */
		timeZone?: string;
		value: DateRangeProps['value'];
	}) => {
		return render(
			<IntlProvider locale="en" timeZone={timeZone || defaultTimeZone}>
				<DateRangeRenderType value={value} testId={testId} />
			</IntlProvider>,
		);
	};

	it('does not render when the date is empty', async () => {
		setup({
			value: {
				start: '',
				end: '',
			},
		});
		expect(screen.queryByTestId(DATERANGE_TYPE_TEST_ID)).not.toBeInTheDocument();
	});

	it('does not render when the date is invalid', async () => {
		setup({
			value: {
				start: '2021-13-25',
				end: '2021-13-25',
			},
		});
		expect(screen.queryByTestId(DATERANGE_TYPE_TEST_ID)).not.toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = setup({
			value: {
				start: '2025-11-01',
				end: '2025-11-01',
			},
		});

		await expect(container).toBeAccessible();
	});

	describe('Day range', () => {
		it('renders date in the correct format when a valid date is passed', async () => {
			setup({
				value: {
					start: '2025-11-01',
					end: '2025-11-01',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Nov 1, 2025');
		});

		it('renders date in the correct format when a valid non-iso date format is passed', async () => {
			setup({
				value: {
					start: '11/01/2025',
					end: '11/01/2025',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Nov 1, 2025');
		});
	});

	describe('Month range', () => {
		it('renders date in the correct format when a valid date is passed', async () => {
			setup({
				value: {
					start: '2025-11-01',
					end: '2025-11-30',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Nov 2025');
		});

		it('renders date in the correct format when a valid non-iso date format is passed', async () => {
			setup({
				value: {
					start: '11/01/2025',
					end: '11/30/2025',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Nov 2025');
		});
	});

	describe('Quarter range', () => {
		it('renders date in the correct format when a valid date is passed', async () => {
			setup({
				value: {
					start: '2025-01-01',
					end: '2025-03-31',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Jan-Mar, 2025');
		});

		it('renders date in the correct format when a valid non-iso date format is passed', async () => {
			setup({
				value: {
					start: '01/01/2025',
					end: '03/31/2025',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Jan-Mar, 2025');
		});

		it('renders date in the correct format when a valid customer quarter date is passed', async () => {
			setup({
				value: {
					start: '2025-02-01',
					end: '2025-04-30',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Feb-Apr, 2025');
		});

		it('renders date in the correct format when a valid customer quarter date over years is passed', async () => {
			setup({
				value: {
					start: '2025-12-01',
					end: '2026-02-28',
				},
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Dec-Feb, 2025-2026');
		});
	});

	describe('Full range', () => {
		it('renders date in the correct format when a valid date is passed', async () => {
			setup({
				value: {
					start: '2025-01-01T00:00:00.000Z',
					end: '2025-03-31T23:59:59.999Z',
				},
				timeZone: 'UTC',
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Jan 1, 2025, 00:00 - Mar 31, 2025, 23:59');
		});

		it('renders date in the correct format when a valid date is passed', async () => {
			setup({
				value: {
					start: '2025-01-01T00:00:00.000Z',
					end: '2025-03-31T23:59:59.999Z',
				},
				timeZone: 'America/Los_Angeles',
			});

			const el = screen.queryByTestId(DATERANGE_TYPE_TEST_ID);

			expect(el).toBeInTheDocument();
			expect(el).toHaveTextContent('Dec 31, 2024, 16:00 - Mar 31, 2025, 16:59');
		});
	});
});
