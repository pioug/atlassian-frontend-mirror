import { renderHook } from '@atlassian/testing-library/render-hook';

import { useCustomTheme } from '../../use-custom-theme';

describe('useCustomTheme()', () => {
	it('should return an object with isEnabled and a style object', () => {
		const utils = renderHook(() =>
			useCustomTheme({
				backgroundColor: '#123',
				highlightColor: '#456',
			}),
		);

		expect(utils.current).toEqual({
			isEnabled: true,
			style: expect.objectContaining({
				backgroundColor: 'rgb(17, 34, 51)',
				color: '#FFF',
			}),
		});
	});

	describe('invalid input', () => {
		it('should be disabled if there is no theme', () => {
			const utils = renderHook(() => useCustomTheme(undefined));
			expect(utils.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the backgroundColor cannot be parsed', () => {
			const utils = renderHook(() =>
				useCustomTheme({ backgroundColor: 'invalidColorString', highlightColor: '#123' }),
			);
			expect(utils.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the highlightColor cannot be parsed', () => {
			const utils = renderHook(() =>
				useCustomTheme({ backgroundColor: '#123', highlightColor: 'invalidColorString' }),
			);
			expect(utils.current).toEqual({ isEnabled: false });
		});
	});
});
