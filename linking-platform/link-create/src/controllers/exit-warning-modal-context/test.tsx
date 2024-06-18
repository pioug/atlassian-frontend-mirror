import { act, renderHook } from '@testing-library/react-hooks';

import { ExitWarningModalProvider, useExitWarningModal } from './index';

describe('Exit warning modal context', () => {
	it('should update the shouldShowWarning value correctly', () => {
		const { result } = renderHook(() => useExitWarningModal(), {
			wrapper: ExitWarningModalProvider,
		});

		expect(result.current.getShouldShowWarning()).toBe(false);

		result.current.setShouldShowWarning(true);
		expect(result.current.getShouldShowWarning()).toBe(true);
	});

	describe('withExitWarning', () => {
		it('should invoke callback when shouldShowWarning is false', () => {
			const { result } = renderHook(() => useExitWarningModal(), {
				wrapper: ExitWarningModalProvider,
			});

			const mockCallback = jest.fn();

			const wrappedCallback = result.current.withExitWarning(mockCallback);

			act(() => {
				wrappedCallback();
			});

			expect(mockCallback).toHaveBeenCalled();
		});

		it('should not invoke callback when shouldShowWarning is true', () => {
			const { result } = renderHook(() => useExitWarningModal(), {
				wrapper: ExitWarningModalProvider,
			});

			result.current.setShouldShowWarning(true);

			const mockCallback = jest.fn();

			const wrappedCallback = result.current.withExitWarning(mockCallback);

			act(() => {
				wrappedCallback();
			});

			expect(mockCallback).not.toHaveBeenCalled();
		});
	});
});
