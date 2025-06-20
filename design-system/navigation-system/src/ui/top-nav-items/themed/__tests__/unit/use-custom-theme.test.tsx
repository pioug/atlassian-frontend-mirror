import { renderHook } from '@testing-library/react-hooks';

import { useCustomTheme } from '../../use-custom-theme';

describe('useCustomTheme()', () => {
	it('should return an object with isEnabled and a style object', () => {
		const { result } = renderHook(() =>
			useCustomTheme({
				backgroundColor: '#123',
				highlightColor: '#456',
			}),
		);

		expect(result.current).toEqual({
			isEnabled: true,
			style: expect.objectContaining({
				backgroundColor: 'rgb(17, 34, 51)',
				color: '#FFF',
			}),
		});
	});

	describe('invalid input', () => {
		it('should be disabled if there is no theme', () => {
			const { result } = renderHook(() => useCustomTheme(undefined));
			expect(result.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the backgroundColor cannot be parsed', () => {
			const { result } = renderHook(() =>
				useCustomTheme({ backgroundColor: 'invalidColorString', highlightColor: '#123' }),
			);
			expect(result.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the highlightColor cannot be parsed', () => {
			const { result } = renderHook(() =>
				useCustomTheme({ backgroundColor: '#123', highlightColor: 'invalidColorString' }),
			);
			expect(result.current).toEqual({ isEnabled: false });
		});
	});
});
