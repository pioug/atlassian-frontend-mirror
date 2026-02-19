import React from 'react';
import { mount, type ReactWrapper } from 'enzyme';
import { DateComponent } from '../../../../react/nodes/date';
import { createIntl, IntlProvider, type IntlShape } from 'react-intl-next';

import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import { timestampToString, todayTimestampInUTC } from '@atlaskit/editor-common/utils';
import { RendererContextProvider } from '../../../../renderer-context';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: () => true,
}));

describe('Renderer - React/Nodes/Date', () => {
	let timestamp: string;
	let wrapper: ReactWrapper<any>;
	let date: ReactWrapper<any>;
	let dateNowMockFn: jest.SpyInstance;
	let dateUTCMockFn: jest.SpyInstance;
	let intl: IntlShape;

	beforeEach(() => {
		dateNowMockFn = jest.spyOn(Date, 'now');
		dateUTCMockFn = jest.spyOn(Date, 'UTC');

		dateUTCMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00
		dateNowMockFn.mockImplementation(() => '1323993600000'); // 16 December 2011 00:00:00

		intl = createIntl({
			locale: 'en',
		});

		timestamp = todayTimestampInUTC();
		wrapper = mount(
			<IntlProvider locale="en">
				<DateComponent timestamp={timestamp.toString()} />
			</IntlProvider>,
		);
		date = wrapper.find(DateComponent);
	});

	afterEach(() => {
		dateNowMockFn.mockRestore();
		dateUTCMockFn.mockRestore();
	});

	it('should render a <span>-tag', () => {
		const dateWrapper = date.find(`.${DateSharedCssClassName.DATE_WRAPPER}`);
		expect(dateWrapper.is('span')).toEqual(true);
	});

	it('should render formatted date', () => {
		expect(date.text()).toEqual(timestampToString(timestamp, intl));
	});

	it('should render date formatted as today inside task task', () => {
		const wrapper = mount(
			<IntlProvider locale="en">
				<DateComponent timestamp={timestamp.toString()} parentIsIncompleteTask={true} />
			</IntlProvider>,
		);
		const date = wrapper.find(DateComponent);
		expect(date.text()).toEqual('Today');
	});

	describe('with timeZone from RendererContext', () => {
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
			const wrapper = mount(
				<RendererContextProvider value={{ timeZone: 'America/Los_Angeles' }}>
					<IntlProvider locale="en">
						<DateComponent timestamp={jun14} parentIsIncompleteTask={true} />
					</IntlProvider>
				</RendererContextProvider>,
			);
			expect(wrapper.find(DateComponent).text()).toEqual('Today');
		});

		it('should render Yesterday for June 14 timestamp when timeZone is Asia/Tokyo', () => {
			const jun14 = Date.UTC(2024, 5, 14).toString();
			const wrapper = mount(
				<RendererContextProvider value={{ timeZone: 'Asia/Tokyo' }}>
					<IntlProvider locale="en">
						<DateComponent timestamp={jun14} parentIsIncompleteTask={true} />
					</IntlProvider>
				</RendererContextProvider>,
			);
			expect(wrapper.find(DateComponent).text()).toEqual('Yesterday');
		});

		it('same timestamp renders differently based on timeZone context', () => {
			const jun14 = Date.UTC(2024, 5, 14).toString();

			const laWrapper = mount(
				<RendererContextProvider value={{ timeZone: 'America/Los_Angeles' }}>
					<IntlProvider locale="en">
						<DateComponent timestamp={jun14} parentIsIncompleteTask={true} />
					</IntlProvider>
				</RendererContextProvider>,
			);

			const tokyoWrapper = mount(
				<RendererContextProvider value={{ timeZone: 'Asia/Tokyo' }}>
					<IntlProvider locale="en">
						<DateComponent timestamp={jun14} parentIsIncompleteTask={true} />
					</IntlProvider>
				</RendererContextProvider>,
			);

			expect(laWrapper.find(DateComponent).text()).toEqual('Today');
			expect(tokyoWrapper.find(DateComponent).text()).toEqual('Yesterday');
		});
	});
});
