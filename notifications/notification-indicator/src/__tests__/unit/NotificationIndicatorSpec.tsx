import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import {
	NotificationLogClient,
	type NotificationCountResponse,
} from '@atlaskit/notification-log-client';

import NotificationIndicator, {
	type ValueUpdatingParams,
	type ValueUpdatingResult,
} from '../../NotificationIndicator';

class MockNotificationLogClient extends NotificationLogClient {
	private response?: Promise<NotificationCountResponse>;

	constructor() {
		super('', '');
	}

	public async countUnseenNotifications() {
		return (
			this.response ||
			Promise.resolve({
				count: 5,
			})
		);
	}

	public setResponse(response: Promise<NotificationCountResponse>) {
		this.response = response;
	}
}

describe('NotificationIndicator', () => {
	let notificationLogClient: MockNotificationLogClient;

	function returnCount(count: number): Promise<NotificationCountResponse> {
		return Promise.resolve({ count });
	}

	function returnError(): Promise<NotificationCountResponse> {
		return Promise.reject(new Error());
	}

	async function renderNotificationIndicator(
		response: Promise<NotificationCountResponse>,
		props: object = {},
	) {
		notificationLogClient.setResponse(response);
		const clientPromise = Promise.resolve(notificationLogClient);

		let renderResult;
		act(() => {
			renderResult = render(
				<NotificationIndicator
					notificationLogProvider={clientPromise}
					refreshOnHidden={true}
					{...props}
				/>,
			);
		});

		try {
			await clientPromise;
		} catch (e) {}

		try {
			await response;
		} catch (e) {}

		return renderResult;
	}

	function triggerVisibilityChange() {
		const visibilityChange = document.createEvent('HTMLEvents');
		visibilityChange.initEvent('visibilitychange', true, true);
		document.body.dispatchEvent(visibilityChange);
	}

	beforeEach(() => {
		notificationLogClient = new MockNotificationLogClient();
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it('should render SSR placehoulder count if passed, even before the async data returns', () => {
		render(<NotificationIndicator refreshOnHidden={true} ssrInitialValue={5} />);
		const badge = screen.getByTestId('notification-indicator-badge');
		expect(badge).toHaveTextContent('5');
	});

	it('Should render badge with correct count', async () => {
		await renderNotificationIndicator(returnCount(5), {
			max: 10,
			appearance: 'primary',
		});

		const badge = await screen.findByTestId('notification-indicator-badge');

		expect(badge).toHaveTextContent('5');
	});

	it('Should render badge with correct count when above max count', async () => {
		await renderNotificationIndicator(returnCount(50), {
			max: 10,
			appearance: 'primary',
		});

		const badge = await screen.findByTestId('notification-indicator-badge');

		expect(badge).toHaveTextContent('10+');
	});

	it('Should not render indicator when there are no new notifications', async () => {
		await renderNotificationIndicator(returnCount(1), {
			max: 10,
			appearance: 'primary',
		});

		const badge = await screen.queryByTestId('notification-indicator-badge');
		expect(badge).toBe(null);
	});

	it('Should not render indicator when there is an error', async () => {
		await renderNotificationIndicator(returnError());

		const badge = await screen.queryByTestId('notification-indicator-badge');

		expect(badge).toBe(null);
	});

	it('Should not refresh when skip=true on call to onCountUpdating', async () => {
		const mockOnCountUpdating = jest.fn(() => ({
			skip: true,
		}));
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(1), {
			onCountUpdating: mockOnCountUpdating,
			onCountUpdated: mockOnCountUpdated,
		});

		expect(mockOnCountUpdated).not.toHaveBeenCalled();
	});

	it('Should override count when countOverride is set on call to onCountUpdating', async () => {
		const mockOnCountUpdating = jest.fn(() => ({
			countOverride: 3,
			skip: false,
		}));
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnError(), {
			onCountUpdating: mockOnCountUpdating,
			onCountUpdated: mockOnCountUpdated,
		});

		expect(mockOnCountUpdated).toHaveBeenCalled();
		const badge = await screen.findByTestId('notification-indicator-badge');

		expect(badge).toHaveTextContent('3');
	});

	it('Should call onCountUpdated on new count', async () => {
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(1), {
			onCountUpdated: mockOnCountUpdated,
		});

		await waitFor(() => expect(mockOnCountUpdated).toHaveBeenCalled());
	});

	it('Should call onCountUpdated after refresh returns 0', async () => {
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(0), {
			onCountUpdated: mockOnCountUpdated,
		});

		await waitFor(() => expect(mockOnCountUpdated).toHaveBeenCalled());
	});

	it('Should call onCountUpdated once after multiple 0 counts', async () => {
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(0), {
			refreshRate: 1,
			onCountUpdated: mockOnCountUpdated,
		});

		await waitFor(() => expect(mockOnCountUpdated).toHaveBeenCalledTimes(1));
	});

	it('Should auto refresh when specified', async () => {
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(1), {
			refreshRate: 1,
			onCountUpdated: mockOnCountUpdated,
		});

		const badge = await screen.findByTestId('notification-indicator-badge');
		await waitFor(() => expect(badge).toHaveTextContent('1'));

		notificationLogClient.setResponse(returnCount(2));

		await waitFor(() => expect(badge).toHaveTextContent('2'));

		badge.remove();
		jest.advanceTimersByTime(1);

		// Ensure window.setInterval has been cleared
		expect(badge).toHaveTextContent('2');
	});

	it('Should not refresh on visibilitychange if refreshOnVisibilityChange=false', async () => {
		const onCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(1), {
			refreshRate: 99999,
			refreshOnVisibilityChange: false,
			onCountUpdated,
		});

		const badge = await screen.findByTestId('notification-indicator-badge');
		await waitFor(() => expect(badge).toHaveTextContent('1'));

		notificationLogClient.setResponse(returnCount(5));
		triggerVisibilityChange();

		// no change
		await waitFor(() => expect(badge).toHaveTextContent('1'));
	});

	it('Should refresh on visibilitychange if document is visible for refreshOnVisibilityChange=true', async () => {
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(1), {
			refreshRate: 99999,
			onCountUpdated: mockOnCountUpdated,
		});

		const badge = await screen.findByTestId('notification-indicator-badge');
		await waitFor(() => expect(badge).toHaveTextContent('1'));

		notificationLogClient.setResponse(returnCount(5));
		triggerVisibilityChange();

		await waitFor(() => expect(badge).toHaveTextContent('5'));
	});

	it('Should not refresh on visibilitychange when skipping too many eager fetches on tab change', async () => {
		const mockOnCountUpdating = ({
			visibilityChangesSinceTimer,
		}: ValueUpdatingParams): ValueUpdatingResult => {
			if ((visibilityChangesSinceTimer as number) > 1) {
				return { skip: true };
			}
			return {};
		};
		const mockOnCountUpdated = jest.fn();
		await renderNotificationIndicator(returnCount(1), {
			refreshRate: 2,
			mockOnCountUpdating,
			mockOnCountUpdated,
		});
		const badge = await screen.findByTestId('notification-indicator-badge');
		await waitFor(() => expect(badge).toHaveTextContent('1'));

		// initial visibilitychange
		notificationLogClient.setResponse(returnCount(5));
		triggerVisibilityChange();
		await waitFor(() => expect(badge).toHaveTextContent('5'));

		// ignore next visibilitychange until timer cycles
		notificationLogClient.setResponse(returnCount(6));
		await waitFor(() => expect(badge).toHaveTextContent('5'));

		// timer has cycled, update on visibilitychange
		jest.advanceTimersByTime(5);
		triggerVisibilityChange();
		await waitFor(() => expect(badge).toHaveTextContent('6'));
	});
});
