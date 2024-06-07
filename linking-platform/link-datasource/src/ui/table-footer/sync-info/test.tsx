import React from 'react';

import { act, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { SyncInfo } from './index';

describe('SyncInfo Component', () => {
	beforeAll(() => {
		jest.useFakeTimers();
		Date.now = jest.fn(() => new Date(Date.UTC(2022, 0, 20, 0, 0, 0)).valueOf());
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	const setup = (lastSyncTime: Date) => {
		return render(
			<IntlProvider locale={'en'}>
				<SyncInfo lastSyncTime={lastSyncTime}></SyncInfo>
			</IntlProvider>,
		);
	};

	it('should show full date for updated time above 8 days', () => {
		const { getByText } = setup(new Date('2020-03-17T20:53:46.046+1100'));

		expect(getByText('Synced Mar 17, 2020')).toBeInTheDocument();
	});

	it('should show number of days (plural) passed for updated time within 8 days', () => {
		const { getByText } = setup(new Date('2022-01-16T13:00:09.553+1100'));

		expect(getByText('Synced 3 days ago')).toBeInTheDocument();
	});

	it('should show number of days (singular) passed for updated time within 8 days', () => {
		const { getByText } = setup(new Date(Date.UTC(2022, 0, 19, 0, 0, 0)));

		expect(getByText('Synced 1 day ago')).toBeInTheDocument();
	});

	it('should show number of hours (plural) passed for updated time within 24 hrs', () => {
		const { getByText } = setup(new Date('2022-01-19T13:00:09.553+1100'));

		expect(getByText('Synced 21 hours ago')).toBeInTheDocument();
	});

	it('should show number of hours (singular) passed for updated time within 24 hrs', () => {
		const { getByText } = setup(new Date(Date.UTC(2022, 0, 19, 23, 0, 0)));

		expect(getByText('Synced 1 hour ago')).toBeInTheDocument();
	});

	it('should show number of minutes (plural) passed for updated time within 60 minutes', () => {
		const { getByText } = setup(new Date(Date.UTC(2022, 0, 19, 23, 55, 0)));

		expect(getByText('Synced 5 minutes ago')).toBeInTheDocument();
	});

	it('should show number of minutes (singular) passed for updated time at 60 seconds', () => {
		const { getByText } = setup(new Date(Date.UTC(2022, 0, 19, 23, 59, 0)));

		expect(getByText('Synced 1 minute ago')).toBeInTheDocument();
	});

	it('should show "just now" for updated time within 60 seconds', () => {
		const { getByText } = setup(new Date(Date.UTC(2022, 0, 19, 23, 59, 10)));

		expect(getByText('Synced just now')).toBeInTheDocument();
	});

	it('should update the sync info right away when lastSyncTime changes', () => {
		const { getByText, rerender } = setup(new Date(Date.UTC(2022, 0, 19, 23, 59, 10)));

		expect(getByText('Synced just now')).toBeInTheDocument();

		rerender(
			<IntlProvider locale={'en'}>
				<SyncInfo lastSyncTime={new Date(Date.UTC(2022, 0, 19, 23, 55, 10))}></SyncInfo>
			</IntlProvider>,
		);

		expect(getByText('Synced 4 minutes ago')).toBeInTheDocument();
	});

	it('should update the sync info when 1 second passed', () => {
		const { getByText } = setup(new Date(Date.UTC(2022, 0, 19, 23, 59, 10)));
		expect(getByText('Synced just now')).toBeInTheDocument();

		asMock(Date.now).mockReturnValue(new Date(Date.UTC(2022, 0, 20, 0, 2, 0)).valueOf());

		act(() => {
			jest.advanceTimersByTime(999);
		});
		expect(getByText('Synced just now')).toBeInTheDocument();

		act(() => {
			jest.advanceTimersByTime(1);
		});
		expect(getByText('Synced 2 minutes ago')).toBeInTheDocument();

		asMock(Date.now).mockReturnValue(new Date(Date.UTC(2022, 0, 20, 0, 4, 0)).valueOf());

		act(() => {
			jest.advanceTimersByTime(1000);
		});
		expect(getByText('Synced 4 minutes ago')).toBeInTheDocument();
	});
});
