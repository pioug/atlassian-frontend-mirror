import { renderHook } from '@testing-library/react';

import * as AppProvider from '@atlaskit/app-provider';

import { useCustomTheme } from '../../use-custom-theme';
import { useCustomThemeNew } from '../../use-custom-theme-new';

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

describe('useCustomThemeNew()', () => {
	it('should return an object with isEnabled, a style object, and hasDefaultBackground', () => {
		const { result } = renderHook(() =>
			useCustomThemeNew({
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

			const { result } = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#FFF',
					highlightColor: '#456',
				}),
			);

			expect(result.current).toHaveProperty('hasDefaultBackground', true);
		});

		it('should be false for #FFF in dark mode', () => {
			useColorModeSpy.mockReturnValue('dark');

			const { result } = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#FFF',
					highlightColor: '#456',
				}),
			);

			expect(result.current).toHaveProperty('hasDefaultBackground', false);
		});

		it('should be true for #1F1F21 in dark mode', () => {
			useColorModeSpy.mockReturnValue('dark');

			const { result } = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#1F1F21',
					highlightColor: '#456',
				}),
			);

			expect(result.current).toHaveProperty('hasDefaultBackground', true);
		});

		it('should be false for #1F1F21 in light mode', () => {
			useColorModeSpy.mockReturnValue('light');

			const { result } = renderHook(() =>
				useCustomThemeNew({
					backgroundColor: '#1F1F21',
					highlightColor: '#456',
				}),
			);

			expect(result.current).toHaveProperty('hasDefaultBackground', false);
		});
	});

	describe('invalid input', () => {
		it('should be disabled if there is no theme', () => {
			const { result } = renderHook(() => useCustomThemeNew(undefined));
			expect(result.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the backgroundColor cannot be parsed', () => {
			const { result } = renderHook(() =>
				useCustomThemeNew({ backgroundColor: 'invalidColorString', highlightColor: '#123' }),
			);
			expect(result.current).toEqual({ isEnabled: false });
		});

		it('should be disabled if the highlightColor cannot be parsed', () => {
			const { result } = renderHook(() =>
				useCustomThemeNew({ backgroundColor: '#123', highlightColor: 'invalidColorString' }),
			);
			expect(result.current).toEqual({ isEnabled: false });
		});
	});
});
