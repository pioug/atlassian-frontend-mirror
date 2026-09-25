import React, { Profiler } from 'react';

import { act, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { SyncInfo } from './index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('SyncInfo Component', () => {
	beforeAll(() => {
		jest.useFakeTimers();
		jest.spyOn(Date, 'now').mockReturnValue(new Date(Date.UTC(2022, 0, 20, 0, 0, 0)).valueOf());
	});

	afterAll(() => {
		jest.restoreAllMocks();
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

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale={'en'}>
				<SyncInfo lastSyncTime={new Date('2020-03-17T20:53:46.046+1100')}></SyncInfo>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});
});

describe('SyncInfo boundary updates', () => {
	const now = new Date('2026-09-14T00:00:00.000Z');
	const onRender = jest.fn();
	const view = (lastSyncTime: Date) => (
		<IntlProvider locale="en">
			<Profiler id="sync-info" onRender={onRender}>
				<SyncInfo lastSyncTime={lastSyncTime} />
			</Profiler>
		</IntlProvider>
	);
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(now);
		onRender.mockClear();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not render between minute boundaries', () => {
		const { getByText } = render(view(new Date(now.getTime() - 60_000)));
		onRender.mockClear();
		for (let second = 0; second < 5; second++) {
			act(() => {
				jest.advanceTimersByTime(1_000);
			});
			expect(getByText('Synced 1 minute ago')).toBeInTheDocument();
		}
		expect(onRender).not.toHaveBeenCalled();
	});

	it.each([
		[50_250, 9_750, 'Synced just now', 'Synced 1 minute ago'],
		[119_250, 750, 'Synced 1 minute ago', 'Synced 2 minutes ago'],
		[3_599_250, 750, 'Synced 59 minutes ago', 'Synced 1 hour ago'],
		[7_199_250, 750, 'Synced 1 hour ago', 'Synced 2 hours ago'],
		[86_399_250, 750, 'Synced 23 hours ago', 'Synced 1 day ago'],
		[172_799_250, 750, 'Synced 1 day ago', 'Synced 2 days ago'],
	])('updates at the next boundary after %i ms', (elapsed, delay, before, after) => {
		const { getByText } = render(view(new Date(now.getTime() - elapsed)));
		expect(getByText(before)).toBeInTheDocument();
		onRender.mockClear();
		act(() => {
			jest.advanceTimersByTime(delay - 1);
		});
		expect(onRender).not.toHaveBeenCalled();
		act(() => {
			jest.advanceTimersByTime(1);
		});
		expect(getByText(after)).toBeInTheDocument();
	});

	it.each([
		[0, 60_000],
		[3_600_000, 3_600_000],
		[86_400_000, 86_400_000],
	])('only renders once per displayed unit after %i ms', (elapsed, unit) => {
		render(view(new Date(now.getTime() - elapsed)));
		onRender.mockClear();
		act(() => {
			jest.advanceTimersByTime(unit - 1);
		});
		expect(onRender).not.toHaveBeenCalled();
		act(() => {
			jest.advanceTimersByTime(1);
		});
		expect(onRender).toHaveBeenCalledTimes(1);
		onRender.mockClear();
		act(() => {
			jest.advanceTimersByTime(unit - 1);
		});
		expect(onRender).not.toHaveBeenCalled();
	});

	it('stops scheduling after switching to a fixed date at eight days', () => {
		const { getByText } = render(view(new Date(now.getTime() - 8 * 86_400_000 + 250)));
		expect(getByText('Synced 7 days ago')).toBeInTheDocument();
		act(() => {
			jest.advanceTimersByTime(250);
		});
		expect(getByText('Synced Sep 06, 2026')).toBeInTheDocument();
		expect(jest.getTimerCount()).toBe(0);
	});

	it('does not schedule for a timestamp already older than eight days', () => {
		render(view(new Date(now.getTime() - 9 * 86_400_000)));
		expect(jest.getTimerCount()).toBe(0);
	});

	it('restarts the timeout when refreshed and clears it on unmount', () => {
		const { getByText, rerender, unmount } = render(view(new Date(now.getTime() - 59_000)));
		rerender(view(now));
		act(() => {
			jest.advanceTimersByTime(1_000);
		});
		expect(getByText('Synced just now')).toBeInTheDocument();
		act(() => {
			jest.advanceTimersByTime(59_000);
		});
		expect(getByText('Synced 1 minute ago')).toBeInTheDocument();
		unmount();
		expect(jest.getTimerCount()).toBe(0);
	});

	it('recalculates elapsed time after a delayed callback', () => {
		const { getByText } = render(view(new Date(now.getTime() - 50_000)));
		jest.setSystemTime(now.getTime() + 3_600_000);
		act(() => {
			jest.advanceTimersByTime(10_000);
		});
		expect(getByText('Synced 1 hour ago')).toBeInTheDocument();
		onRender.mockClear();
		act(() => {
			jest.advanceTimersByTime(3_539_999);
		});
		expect(onRender).not.toHaveBeenCalled();
		act(() => {
			jest.advanceTimersByTime(1);
		});
		expect(getByText('Synced 2 hours ago')).toBeInTheDocument();
	});
});
