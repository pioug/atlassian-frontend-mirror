import { renderHook } from '@testing-library/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { spaceInviteScheduler } from '../utils/spaceInviteScheduler';

import { useSpaceInviteScheduler } from './useSpaceInviteScheduler';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

const mockFg = fg as jest.Mock;

describe('useSpaceInviteScheduler', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		mockFg.mockReturnValue(true);
	});

	afterEach(() => {
		jest.useRealTimers();
		mockFg.mockReset();
	});

	it('should flush pending invites on visibilitychange to hidden', () => {
		renderHook(() => useSpaceInviteScheduler());

		const callback = jest.fn();
		spaceInviteScheduler.scheduleInvite('team-1', 'container-1', callback);

		Object.defineProperty(document, 'visibilityState', {
			value: 'hidden',
			writable: true,
			configurable: true,
		});
		document.dispatchEvent(new Event('visibilitychange'));

		expect(callback).toHaveBeenCalledTimes(1);

		// restore
		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
			configurable: true,
		});
	});

	it('should not flush on visibilitychange when state is visible', () => {
		renderHook(() => useSpaceInviteScheduler());

		const callback = jest.fn();
		spaceInviteScheduler.scheduleInvite('team-1', 'container-1', callback);

		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
			configurable: true,
		});
		document.dispatchEvent(new Event('visibilitychange'));

		expect(callback).not.toHaveBeenCalled();

		// clean up so the pending timer doesn't leak
		spaceInviteScheduler.cancelInvite('team-1', 'container-1');
	});

	it('should flush pending invites on beforeunload', () => {
		renderHook(() => useSpaceInviteScheduler());

		const callback = jest.fn();
		spaceInviteScheduler.scheduleInvite('team-1', 'container-1', callback);

		window.dispatchEvent(new Event('beforeunload'));

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should flush all pending invites on unmount', () => {
		const { unmount } = renderHook(() => useSpaceInviteScheduler());

		const callback = jest.fn();
		spaceInviteScheduler.scheduleInvite('team-1', 'container-1', callback);

		unmount();

		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should remove listeners on unmount', () => {
		const { unmount } = renderHook(() => useSpaceInviteScheduler());
		unmount();

		// Schedule after unmount — listeners should no longer be active
		const callback = jest.fn();
		spaceInviteScheduler.scheduleInvite('team-1', 'container-1', callback);

		Object.defineProperty(document, 'visibilityState', {
			value: 'hidden',
			writable: true,
			configurable: true,
		});
		document.dispatchEvent(new Event('visibilitychange'));
		window.dispatchEvent(new Event('beforeunload'));

		expect(callback).not.toHaveBeenCalled();

		// restore
		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
			configurable: true,
		});

		// clean up pending timer
		spaceInviteScheduler.cancelInvite('team-1', 'container-1');
	});

	it('should not register listeners when feature gate is disabled', () => {
		mockFg.mockReturnValue(false);
		const { unmount } = renderHook(() => useSpaceInviteScheduler());

		const callback = jest.fn();
		spaceInviteScheduler.scheduleInvite('team-1', 'container-1', callback);

		Object.defineProperty(document, 'visibilityState', {
			value: 'hidden',
			writable: true,
			configurable: true,
		});
		document.dispatchEvent(new Event('visibilitychange'));
		window.dispatchEvent(new Event('beforeunload'));

		expect(callback).not.toHaveBeenCalled();

		// restore
		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
			configurable: true,
		});

		unmount();

		// callback should still not have been called after unmount
		expect(callback).not.toHaveBeenCalled();

		// clean up pending timer
		spaceInviteScheduler.cancelInvite('team-1', 'container-1');
	});
});
