import { unstable_scheduleCallback as scheduleCallback } from 'scheduler';

import { fg } from '@atlaskit/platform-feature-flags';

import scheduleIdleCallback from './schedule-idle-callback';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

jest.mock('scheduler', () => ({
	unstable_IdlePriority: 'idlePriority',
	unstable_scheduleCallback: jest.fn(),
}));

describe('scheduleIdleCallback', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should use requestIdleCallback if available and feature flag is enabled', () => {
		const work = jest.fn();
		(fg as jest.Mock).mockReturnValue(true);
		window.requestIdleCallback = jest.fn();

		scheduleIdleCallback(work);

		expect(window.requestIdleCallback).toHaveBeenCalledWith(work);
		expect(scheduleCallback).not.toHaveBeenCalled();
	});

	it('should use scheduler callback if requestIdleCallback is not available', () => {
		const work = jest.fn();
		(fg as jest.Mock).mockReturnValue(true);
		// @ts-ignore
		window.requestIdleCallback = undefined;

		scheduleIdleCallback(work);

		expect(scheduleCallback).toHaveBeenCalledWith('idlePriority', work);
	});

	it('should use scheduler callback if feature flag is disabled', () => {
		const work = jest.fn();
		(fg as jest.Mock).mockReturnValue(false);
		window.requestIdleCallback = jest.fn();

		scheduleIdleCallback(work);

		expect(scheduleCallback).toHaveBeenCalledWith('idlePriority', work);
		expect(window.requestIdleCallback).not.toHaveBeenCalled();
	});
});
