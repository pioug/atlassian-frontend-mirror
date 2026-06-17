/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl';

import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, screen } from '@atlassian/testing-library';

import BaseDateTime from '../index';

describe('Element: BaseDateTime', () => {
	const testId = 'smart-element-date-time';
	let oldDateNowFn: () => number;
	const mockedNow = new Date('2022-01-25T16:44:00.000+1000').getTime();
	beforeAll(() => {
		oldDateNowFn = Date.now;
		Date.now = jest.fn(() => mockedNow);
	});

	afterAll(() => {
		Date.now = oldDateNowFn;
	});

	it('should capture and report a11y violations', async () => {
		const oneDayBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 1);
		const { container } = render(
			<IntlProvider locale="en">
				<BaseDateTime date={oneDayBack} type="created" />
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('does not render with font size override', async () => {
		const eightDaysBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 8);
		render(
			<IntlProvider locale="en">
				<BaseDateTime date={new Date(eightDaysBack)} type="created" fontSize="font.body.large" />
			</IntlProvider>,
		);
		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent('Created on Jan 17, 2022');
		expect(element).toHaveCompiledCss(
			'font',
			'var(--ds-font-body-large,normal 400 1pc/24px "Atlassian Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Ubuntu,"Helvetica Neue",sans-serif)',
		);
	});

	describe('with relative mode', () => {
		it('should render created at element', async () => {
			const oneDayBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 1);
			render(
				<IntlProvider locale="en">
					<BaseDateTime date={oneDayBack} type="created" />
				</IntlProvider>,
			);
			const element = await screen.findByTestId(testId);
			expect(element).toBeTruthy();
			expect(element).toHaveTextContent('Created yesterday');
		});

		it('should render modified at element', async () => {
			const sixDaysBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 6);
			render(
				<IntlProvider locale="en">
					<BaseDateTime date={sixDaysBack} type="modified" />
				</IntlProvider>,
			);
			const element = await screen.findByTestId(testId);
			expect(element).toBeTruthy();
			expect(element).toHaveTextContent('Updated last week');
		});
	});

	describe('with absolute mode', () => {
		it('should render created at element', async () => {
			const eightDaysBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 8);
			render(
				<IntlProvider locale="en">
					<BaseDateTime date={new Date(eightDaysBack)} type="created" />
				</IntlProvider>,
			);
			const element = await screen.findByTestId(testId);
			expect(element).toBeTruthy();
			expect(element).toHaveTextContent('Created on Jan 17, 2022');
		});

		it('should render another modified at element', async () => {
			const twentyDaysBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 20);
			render(
				<IntlProvider locale="en">
					<BaseDateTime date={new Date(twentyDaysBack)} type="modified" />
				</IntlProvider>,
			);
			const element = await screen.findByTestId(testId);
			expect(element).toBeTruthy();
			expect(element).toHaveTextContent('Updated on Jan 5, 2022');
		});

		it('formats absolute date using provided timezone when gate is on', async () => {
			passGate('dfo_issue_view_remote_data_srr_group');
			const date = new Date('2022-01-17T23:30:00.000Z');
			const expectedDate = new Intl.DateTimeFormat('en', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				timeZone: 'UTC',
			}).format(date);
			render(
				<IntlProvider locale="en">
					<BaseDateTime date={date} type="created" timeZone="UTC" />
				</IntlProvider>,
			);
			const element = await screen.findByTestId(testId);
			expect(element).toHaveTextContent(`Created on ${expectedDate}`);
		});

		it('does not formats absolute date using provided timezone when gate is off', async () => {
			failGate('dfo_issue_view_remote_data_srr_group');
			const date = new Date('2022-01-17T23:30:00.000Z');
			const expectedDate = new Intl.DateTimeFormat('en', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}).format(date);
			render(
				<IntlProvider locale="en">
					<BaseDateTime date={date} type="created" timeZone="UTC" />
				</IntlProvider>,
			);
			const element = await screen.findByTestId(testId);
			expect(element).toHaveTextContent(`Created on ${expectedDate}`);
		});

		it('falls back to non-timezone formatting for invalid timezone when gate is on', async () => {
			passGate('dfo_issue_view_remote_data_srr_group');
			const date = new Date('2022-01-17T23:30:00.000Z');
			render(
				<IntlProvider locale="en">
					<BaseDateTime date={date} type="created" testId="no-timezone" />
				</IntlProvider>,
			);
			const defaultElement = await screen.findByTestId('no-timezone');

			render(
				<IntlProvider locale="en">
					<BaseDateTime
						date={date}
						type="created"
						timeZone="invalid/timezone"
						testId="invalid-timezone"
					/>
				</IntlProvider>,
			);
			const invalidTimezoneElement = await screen.findByTestId('invalid-timezone');

			expect(invalidTimezoneElement).toHaveTextContent(defaultElement.textContent || '');
		});
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			fontWeight: 'bold',
		});
		render(
			<IntlProvider locale="en">
				<BaseDateTime
					date={new Date('2020-02-04T12:40:12.353+0800')}
					css={overrideCss}
					type="created"
				/>
			</IntlProvider>,
		);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveCompiledCss('font-weight', 'bold');
	});

	it('should render overridden text for created on element', async () => {
		const eightDaysBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 8);
		render(
			<IntlProvider locale="en">
				<BaseDateTime date={new Date(eightDaysBack)} type="created" text="First commit on" />
			</IntlProvider>,
		);
		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent('First commit on Jan 17, 2022');
	});

	it('should render overridden text for modified on element', async () => {
		const eightDaysBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 8);
		render(
			<IntlProvider locale="en">
				<BaseDateTime date={new Date(eightDaysBack)} type="modified" text="Last commit on" />
			</IntlProvider>,
		);
		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent('Last commit on Jan 17, 2022');
	});

	it('should render date only if hideDatePrefix is true', async () => {
		const eightDaysBack = new Date(mockedNow - 1000 * 60 * 60 * 24 * 8);
		render(
			<IntlProvider locale="en">
				<BaseDateTime
					date={new Date(eightDaysBack)}
					type="created"
					text="First commit on"
					hideDatePrefix
				/>
			</IntlProvider>,
		);
		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(element).toHaveTextContent('Jan 17, 2022');
	});
});
