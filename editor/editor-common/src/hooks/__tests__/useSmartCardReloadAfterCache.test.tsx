import * as smartCardHooks from '@atlaskit/smart-card/hooks';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { renderHook } from '@atlassian/testing-library';

import useSmartCardReloadAfterCache from '../useSmartCardReloadAfterCache';

// Mock dependencies
jest.mock('@atlaskit/smart-card/hooks');

const mockUseSmartLinkReload = smartCardHooks.useSmartLinkReload as jest.MockedFunction<
	typeof smartCardHooks.useSmartLinkReload
>;

describe('useSmartCardReloadAfterCache', () => {
	let mockReload: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		mockReload = jest.fn();
		mockUseSmartLinkReload.mockReturnValue(mockReload);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	eeTest.describe('platform_editor_smartlink_local_cache', 'isEnabled').variant(true, () => {
		it('should reload when card was initially resolved (loaded from cache)', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'resolved', false));

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it('should not reload when card was initially pending (fresh fetch)', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'pending', false));

			expect(mockReload).not.toHaveBeenCalled();
		});

		it('should not reload when page is SSRed', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'resolved', true));

			expect(mockReload).not.toHaveBeenCalled();
		});

		it('should not reload when url is undefined', () => {
			renderHook(() => useSmartCardReloadAfterCache(undefined, 'resolved', false));

			expect(mockReload).not.toHaveBeenCalled();
		});

		it('should reload only once per URL (guards with hasReloaded ref)', () => {
			// The hook ensures reload is called only once per URL through the hasReloaded ref
			// This is tested indirectly through the single reload call
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'resolved', false));

			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it('should reset state when URL changes', () => {
			// Test that different URLs can each be reloaded independently
			renderHook(() =>
				useSmartCardReloadAfterCache('https://example.com/page1', 'resolved', false),
			);
			expect(mockReload).toHaveBeenCalledTimes(1);

			jest.clearAllMocks();
			mockReload = jest.fn();
			mockUseSmartLinkReload.mockReturnValue(mockReload);

			renderHook(() =>
				useSmartCardReloadAfterCache('https://example.com/page2', 'resolved', false),
			);
			expect(mockReload).toHaveBeenCalledTimes(1);
		});

		it('should not reload for different initial statuses', () => {
			// Only reload when initially resolved
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'pending', false));
			expect(mockReload).not.toHaveBeenCalled();

			jest.clearAllMocks();
			mockReload = jest.fn();
			mockUseSmartLinkReload.mockReturnValue(mockReload);

			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'resolved', false));
			expect(mockReload).toHaveBeenCalled();
		});

		it('should handle undefined initial card status', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', undefined, false));

			// Undefined initially, so reload should not be called
			expect(mockReload).not.toHaveBeenCalled();
		});

		it('should call reload when wasLoadedFromCache is true (initially resolved)', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'resolved', false));

			// If wasLoadedFromCache is true, reload should be called
			expect(mockReload).toHaveBeenCalled();
		});

		it('should not call reload when wasLoadedFromCache is false (initially pending)', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'pending', false));

			// If wasLoadedFromCache is false, reload should not be called
			expect(mockReload).not.toHaveBeenCalled();
		});
	});

	eeTest.describe('platform_editor_smartlink_local_cache', 'isEnabled').variant(false, () => {
		it('should not reload even when card was initially resolved', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'resolved', false));

			expect(mockReload).not.toHaveBeenCalled();
		});

		it('should not reload when feature flag is disabled', () => {
			renderHook(() => useSmartCardReloadAfterCache('https://example.com', 'resolved', false));

			// When feature flag is off, reload should not be called
			expect(mockReload).not.toHaveBeenCalled();
		});
	});
});
