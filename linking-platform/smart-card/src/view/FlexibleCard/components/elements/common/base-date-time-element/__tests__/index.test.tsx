/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import BaseDateTime from '../index';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

describe('Element: Text', () => {
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
		(fg as jest.Mock).mockReturnValue(true);
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
