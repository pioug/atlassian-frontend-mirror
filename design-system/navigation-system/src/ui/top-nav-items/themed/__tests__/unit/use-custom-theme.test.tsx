import { renderHook } from '@atlassian/testing-library/render-hook';
import * as AppProvider from '@atlaskit/app-provider/use-color-mode';

import { useCustomTheme } from '../../use-custom-theme';
import { useCustomThemeNew } from '../../use-custom-theme-new';

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

describe('useCustomThemeNew()', () => {
	it('should return an object with isEnabled, a style object, and hasDefaultBackground', () => {
		const utils = renderHook(() =>
			useCustomThemeNew({
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
			hasDefaultBackground: false,
		});
	});

	describe('hasDefaultBackground', () => {
		const useColorModeSpy = jest.spyOn(AppProvider, 'useColorMode');

		afterAll(() => {
			useColorModeSpy.mockRestore();
		});

		it('should be true for #FFF in light mode', () => {
			useColorModeSpy.mockReturnValue('light');

			const utils = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#FFF',
					highlightColor: '#456',
				}),
			);

			expect(utils.current).toHaveProperty('hasDefaultBackground', true);
		});

		it('should be false for #FFF in dark mode', () => {
			useColorModeSpy.mockReturnValue('dark');

			const utils = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#FFF',
					highlightColor: '#456',
				}),
			);

			expect(utils.current).toHaveProperty('hasDefaultBackground', false);
		});

		it('should be true for #1F1F21 in dark mode', () => {
			useColorModeSpy.mockReturnValue('dark');

			const utils = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#1F1F21',
					highlightColor: '#456',
				}),
			);

			expect(utils.current).toHaveProperty('hasDefaultBackground', true);
		});

		it('should be false for #1F1F21 in light mode', () => {
			useColorModeSpy.mockReturnValue('light');

			const utils = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#1F1F21',
					highlightColor: '#456',
				}),
			);

			expect(utils.current).toHaveProperty('hasDefaultBackground', false);
		});
	});

	describe('invalid input', () => {
		it('should be disabled if there is no theme', () => {
			const utils = renderHook(() => useCustomThemeNew(undefined));
			expect(utils.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the backgroundColor cannot be parsed', () => {
			const utils = renderHook(() =>
				useCustomThemeNew({ backgroundColor: 'invalidColorString', highlightColor: '#123' }),
			);
			expect(utils.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the highlightColor cannot be parsed', () => {
			const utils = renderHook(() =>
				useCustomThemeNew({ backgroundColor: '#123', highlightColor: 'invalidColorString' }),
			);
			expect(utils.current).toEqual({ isEnabled: false });
		});
	});
});
