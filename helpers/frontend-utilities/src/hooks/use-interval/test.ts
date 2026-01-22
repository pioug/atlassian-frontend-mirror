import { act, renderHook } from '@testing-library/react';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import useInterval from './index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

jest.useFakeTimers();

describe('useInterval', () => {
	it('should call the callback at the specified interval', () => {
		const callback = jest.fn();
		renderHook(() => useInterval(callback, 1000));

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).toHaveBeenCalledTimes(1);

		act(() => {
			jest.advanceTimersByTime(2000);
		});

		expect(callback).toHaveBeenCalledTimes(3);
	});

	it('should not call the callback when delay is null', () => {
		const callback = jest.fn();

		renderHook(() => {
			useInterval(callback, null);
		});

		act(() => {
			jest.advanceTimersByTime(3000);
		});

		expect(callback).not.toHaveBeenCalled();
	});

	it('should clean up the interval on unmount', () => {
		const callback = jest.fn();

		const { unmount } = renderHook(() => {
			useInterval(callback, 1000);
		});

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).toHaveBeenCalledTimes(1);

		unmount();

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(callback).toHaveBeenCalledTimes(1);
	});
});
