import { renderHook } from '@testing-library/react';

import { defaultMediaUserPreferences } from './getMediaUserPreferences';
import { useMediaParsedSettings } from './mediaParsedSettings';

describe('useMediaParsedSettings', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return object with default user preferences when no settings are provided', () => {
		const { result } = renderHook(() => useMediaParsedSettings());
		expect(result.current).toEqual({
			mediaUserPreferences: defaultMediaUserPreferences,
		});
	});

	it('should return settings with default user preferences', () => {
		const settings = {
			canUpdateVideoCaptions: true,
		};
		const { result } = renderHook(() => useMediaParsedSettings(settings));
		expect(result.current).toEqual({
			canUpdateVideoCaptions: true,
			mediaUserPreferences: defaultMediaUserPreferences,
		});
	});

	it('should memoize the result when dependencies do not change', () => {
		const settings = {
			canUpdateVideoCaptions: true,
		};

		const { result, rerender } = renderHook(() => useMediaParsedSettings(settings));
		const firstResult = result.current;

		rerender();
		expect(result.current).toBe(firstResult);
	});
});
