import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook, waitFor } from '@atlassian/testing-library';

import { useMessages } from './index';

describe('useMessages()', () => {
	const translated = { foo: 'Translated string' };
	const loaderFn = jest.fn(() => Promise.resolve(translated));

	beforeEach(() => {
		jest.clearAllMocks();
	});

	ffTest.on('navx-4615-fix-async-intl-for-gsn', '', () => {
		it('should return the default messages-value for the default language', async () => {
			const result = renderHook(() => {
				return useMessages('en-US', loaderFn);
			});

			expect(result.current).toEqual(undefined);

			// Wait for the loaderFn to be called (if at all)
			await waitFor(() => {
				expect(result.current).toEqual(undefined);
			});
			// The loaderFn is not called because the initial locale ('en-uS') matches the NEW_DEFAULT_LOCALE_STATE.locale
			expect(loaderFn).toHaveBeenCalledTimes(0);
		});

		it('should return translations for other languages', async () => {
			const result = renderHook(() => {
				return useMessages('es', loaderFn);
			});

			expect(result.current).toEqual(undefined);

			// Wait for the loaderFn to be called (if at all)
			await waitFor(() => {
				expect(result.current).toEqual(translated);
			});

			expect(loaderFn).toHaveBeenCalledTimes(1);
		});
	});

	ffTest.off('navx-4615-fix-async-intl-for-gsn', '', () => {
		it('should return the default messages-value for the default language', async () => {
			const result = renderHook(() => {
				return useMessages('en', loaderFn);
			});

			expect(result.current).toEqual({});

			// Wait for the loaderFn to be called (if at all)
			await waitFor(() => {
				expect(result.current).toEqual({});
			});

			// The loaderFn is not called because the initial locale ('en') matches the DEFAULT_LOCALE_STATE.locale
			expect(loaderFn).toHaveBeenCalledTimes(0);
		});

		it('should return translations for other languages', async () => {
			const result = renderHook(() => {
				return useMessages('es', loaderFn);
			});

			expect(result.current).toEqual({});

			// Wait for the loaderFn to be called (if at all)
			await waitFor(() => {
				expect(result.current).toEqual(translated);
			});

			expect(loaderFn).toHaveBeenCalledTimes(1);
		});
	});
});
