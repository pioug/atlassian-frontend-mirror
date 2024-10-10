import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useMessages } from './index';

// Skipping as tests timing out due to open handles (#hot-112198)
describe.skip('useMessages()', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	const translated = { foo: 'Translated string' };
	const loaderFn = jest.fn(() => Promise.resolve(translated));

	it('should return undefined for the default language', () => {
		const { result } = renderHook(() => {
			return useMessages('en', loaderFn);
		});

		waitFor(() => {
			expect(result.current).toBeUndefined();
		});
	});

	it('should return translations for other languages', () => {
		const { result } = renderHook(() => {
			return useMessages('es', loaderFn);
		});

		waitFor(() => {
			expect(result.current).toEqual(translated);
		});
	});
});
