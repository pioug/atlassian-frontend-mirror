import React from 'react';
import { render } from '@testing-library/react';
import { DateComponent } from '../../../../react/nodes/date';
import { createIntl, IntlProvider } from 'react-intl';
import type { IntlShape } from 'react-intl';

import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import { timestampToString, todayTimestampInUTC } from '@atlaskit/editor-common/utils';
import { RendererContextProvider } from '../../../../renderer-context';

describe('Renderer - React/Nodes/Date', () => {
	let timestamp: string;
	let dateNowMockFn: jest.SpyInstance;
	let dateUTCMockFn: jest.SpyInstance;
	let intl: IntlShape;

	const renderDate = (props: Partial<React.ComponentProps<typeof DateComponent>> = {}) =>
		render(
			<IntlProvider locale="en">
				{/* eslint-disable-next-line react/jsx-props-no-spreading */}
				<DateComponent timestamp={timestamp.toString()} {...props} />
			</IntlProvider>,
		);

	beforeEach(() => {
		dateNowMockFn = jest.spyOn(Date, 'now');
		dateUTCMockFn = jest.spyOn(Date, 'UTC');

		dateUTCMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00
		dateNowMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00

		intl = createIntl({
			locale: 'en',
		});

		timestamp = todayTimestampInUTC();
	});

	afterEach(() => {
		dateNowMockFn.mockRestore();
		dateUTCMockFn.mockRestore();
	});

	it('should render a <span>-tag', () => {
		const { container } = renderDate();

		expect(container.querySelector(`.${DateSharedCssClassName.DATE_WRAPPER}`)?.tagName).toBe(
			'SPAN',
		);
	});

	it('should render formatted date', () => {
		const { container } = renderDate();

		expect(container.textContent).toEqual(timestampToString(timestamp, intl));
	});

	it('should render date formatted as today inside task task', () => {
		const { container } = renderDate({ parentIsIncompleteTask: true });

		expect(container.textContent).toEqual('Today');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderDate();

		await expect(container).toBeAccessible();
	});

	describe('with timeZone from RendererContext', () => {
		const renderDateWithTimeZone = (timeZone: string, dateTimestamp: string) =>
			render(
				<RendererContextProvider value={{ timeZone }}>
					<IntlProvider locale="en">
						<DateComponent timestamp={dateTimestamp} parentIsIncompleteTask={true} />
					</IntlProvider>
				</RendererContextProvider>,
			);

		beforeEach(() => {
			// Restore Date.UTC so it works normally for timezone-aware calculations
			dateUTCMockFn.mockRestore();

			dateNowMockFn.mockRestore();
			dateNowMockFn = jest.spyOn(Date, 'now');
			// 2024-06-15T04:00:00Z (UTC)
			// In America/Los_Angeles (PDT, UTC-7): June 14, 9:00 PM
			// In Asia/Tokyo (JST, UTC+9): June 15, 1:00 PM
			dateNowMockFn.mockImplementation(() => 1718424000000);

			dateUTCMockFn = jest.spyOn(Date, 'UTC');
		});

		it('should render Today for June 14 timestamp when timeZone is America/Los_Angeles', () => {
			const jun14 = Date.UTC(2024, 5, 14).toString();
			const { container } = renderDateWithTimeZone('America/Los_Angeles', jun14);

			expect(container.textContent).toEqual('Today');
		});

		it('should render Yesterday for June 14 timestamp when timeZone is Asia/Tokyo', () => {
			const jun14 = Date.UTC(2024, 5, 14).toString();
			const { container } = renderDateWithTimeZone('Asia/Tokyo', jun14);

			expect(container.textContent).toEqual('Yesterday');
		});

		it('same timestamp renders differently based on timeZone context', () => {
			const jun14 = Date.UTC(2024, 5, 14).toString();

			const { container: laContainer } = renderDateWithTimeZone('America/Los_Angeles', jun14);
			const { container: tokyoContainer } = renderDateWithTimeZone('Asia/Tokyo', jun14);

			expect(laContainer.textContent).toEqual('Today');
			expect(tokyoContainer.textContent).toEqual('Yesterday');
		});
	});
});
