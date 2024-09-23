import { ffTest } from '@atlassian/feature-flags-test-utils';

import getThemeStyles, { type ThemeStyles } from '../../get-theme-styles';
import { type ThemeIdsWithOverrides, type ThemeOptionsSchema } from '../../theme-config';
import { hash } from '../../utils/hash';

import {
	mainThemes,
	verifyBrandRefreshColors,
	verifyNonBrandRefreshColors,
} from './brand-refresh-assertion-helper';

const UNSAFE_themeOptions: ThemeOptionsSchema = {
	brandColor: '#ff0000',
};

const customStyleHashId = hash(JSON.stringify(UNSAFE_themeOptions));

function getThemeData(themes: ThemeStyles[]) {
	return themes.reduce((acc: Omit<ThemeStyles, 'css'>[], { css, ...rest }) => {
		acc.push({ ...rest });
		return acc;
	}, []);
}

describe('getThemeStyles', () => {
	describe('returns an array of ThemeStyles when given non-default theme state', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				let results = await getThemeStyles({
					light: 'legacy-light',
					spacing: 'spacing',
					typography: 'typography-adg3',
				});

				// Check that CSS is defined for each result
				results.forEach((result) => {
					expect(result.css).toBeDefined();
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'legacy-light', attrs: { 'data-theme': 'legacy-light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{
						id: 'dark-increased-contrast',
						attrs: { 'data-theme': 'dark-increased-contrast' },
					},
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
				]);
			},
			async () => {
				let results = await getThemeStyles({
					light: 'legacy-light',
					spacing: 'spacing',
					typography: 'typography-adg3',
				});

				// Check that CSS is defined for each result
				results.forEach((result) => {
					expect(result.css).toBeDefined();
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'legacy-light', attrs: { 'data-theme': 'legacy-light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
				]);
			},
		);
	});

	describe('returns an array of the default ThemeStyles when a theme state argument is not provided', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				let results = await getThemeStyles();

				// Check that CSS is defined for each result
				results.forEach((result) => {
					expect(result.css).toBeDefined();
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{
						id: 'light-increased-contrast',
						attrs: { 'data-theme': 'light-increased-contrast' },
					},
					{
						id: 'dark-increased-contrast',
						attrs: { 'data-theme': 'dark-increased-contrast' },
					},
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
				]);
			},
			async () => {
				let results = await getThemeStyles();

				// Check that CSS is defined for each result
				results.forEach((result) => {
					expect(result.css).toBeDefined();
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
				]);
			},
		);
	});

	describe('returns an array of ThemeStyles that includes custom themes when theme options provided', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				let results = await getThemeStyles({
					colorMode: 'auto',
					dark: 'dark',
					light: 'light',
					UNSAFE_themeOptions,
					spacing: 'spacing',
					typography: 'typography-adg3',
				});
				// Check that CSS is defined for each result
				results.forEach((result) => {
					expect(result.css).toBeDefined();
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{
						id: 'light-increased-contrast',
						attrs: { 'data-theme': 'light-increased-contrast' },
					},
					{
						id: 'dark-increased-contrast',
						attrs: { 'data-theme': 'dark-increased-contrast' },
					},
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
					{
						id: 'light',
						attrs: {
							'data-theme': 'light',
							'data-custom-theme': customStyleHashId,
						},
					},
					{
						id: 'dark',
						attrs: {
							'data-theme': 'dark',
							'data-custom-theme': customStyleHashId,
						},
					},
				]);
			},
			async () => {
				let results = await getThemeStyles({
					colorMode: 'auto',
					dark: 'dark',
					light: 'light',
					UNSAFE_themeOptions,
					spacing: 'spacing',
					typography: 'typography-adg3',
				});
				// Check that CSS is defined for each result
				results.forEach((result) => {
					expect(result.css).toBeDefined();
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
					{
						id: 'light',
						attrs: {
							'data-theme': 'light',
							'data-custom-theme': customStyleHashId,
						},
					},
					{
						id: 'dark',
						attrs: {
							'data-theme': 'dark',
							'data-custom-theme': customStyleHashId,
						},
					},
				]);
			},
		);
	});

	describe('returns an array of ThemeStyles that does not include custom themes when brand color is invalid', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				let results = await getThemeStyles({
					colorMode: 'auto',
					UNSAFE_themeOptions: {
						brandColor: '#ff00',
					},
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{
						id: 'light-increased-contrast',
						attrs: { 'data-theme': 'light-increased-contrast' },
					},
					{
						id: 'dark-increased-contrast',
						attrs: { 'data-theme': 'dark-increased-contrast' },
					},
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
				]);
			},
			async () => {
				let results = await getThemeStyles({
					colorMode: 'auto',
					UNSAFE_themeOptions: {
						brandColor: '#ff00',
					},
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
				]);
			},
		);
	});

	describe('returns a minimal set of ThemeStyles when auto switching is disabled', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				let results = await getThemeStyles({
					colorMode: 'light',
					dark: 'dark',
					light: 'light',
					spacing: 'spacing',
					typography: 'typography-adg3',
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{
						id: 'light-increased-contrast',
						attrs: { 'data-theme': 'light-increased-contrast' },
					},
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
				]);
			},
			async () => {
				let results = await getThemeStyles({
					colorMode: 'light',
					dark: 'dark',
					light: 'light',
					spacing: 'spacing',
					typography: 'typography-adg3',
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
				]);
			},
		);
	});

	describe('returns an array of ThemeStyles without duplicates', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				// prompt a duplication
				const results = await getThemeStyles({
					light: 'dark',
					dark: 'dark',
					spacing: 'spacing',
					typography: 'typography-adg3',
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{
						id: 'dark-increased-contrast',
						attrs: { 'data-theme': 'dark-increased-contrast' },
					},
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
				]);
			},
			async () => {
				// prompt a duplication
				const results = await getThemeStyles({
					light: 'dark',
					dark: 'dark',
					spacing: 'spacing',
					typography: 'typography-adg3',
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
				]);
			},
		);
	});

	describe('skips invalid themes when given invalid theme state', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				const results = await getThemeStyles({
					//@ts-ignore
					dark: 'invalid',
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{
						id: 'light-increased-contrast',
						attrs: { 'data-theme': 'light-increased-contrast' },
					},
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
				]);
			},
			async () => {
				const results = await getThemeStyles({
					//@ts-ignore
					dark: 'invalid',
				});

				expect(getThemeData(results)).toEqual([
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
				]);
			},
		);
	});

	describe('returns all theme styles when provided "all" as an argument', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				const results = await getThemeStyles('all');

				// Check that CSS is defined for each result
				results.forEach((result) => {
					expect(result.css).toBeDefined();
				});

				expect(getThemeData(results)).toEqual([
					{
						id: 'light-increased-contrast',
						attrs: { 'data-theme': 'light-increased-contrast' },
					},
					{ id: 'light', attrs: { 'data-theme': 'light' } },
					{ id: 'light-future', attrs: { 'data-theme': 'light-future' } },
					{ id: 'dark', attrs: { 'data-theme': 'dark' } },
					{ id: 'dark-future', attrs: { 'data-theme': 'dark-future' } },
					{
						id: 'dark-increased-contrast',
						attrs: { 'data-theme': 'dark-increased-contrast' },
					},
					{ id: 'legacy-light', attrs: { 'data-theme': 'legacy-light' } },
					{ id: 'legacy-dark', attrs: { 'data-theme': 'legacy-dark' } },
					{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
					{ id: 'shape', attrs: { 'data-theme': 'shape' } },
					{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
					{
						id: 'typography-modernized',
						attrs: { 'data-theme': 'typography-modernized' },
					},
					{
						id: 'typography-refreshed',
						attrs: { 'data-theme': 'typography-refreshed' },
					},
				]);
			},
			(ff) => {
				const ensureNoVisualRefreshThemes = (results: ThemeStyles[]) => {
					if (
						results.find((x) => x.id === 'light-brand-refresh') ||
						results.find((x) => x.id === 'dark-brand-refresh')
					) {
						throw new Error(
							`Results should not contain light-brand-refresh and dark-brand-refresh entries.`,
						);
					}
				};
				const assertThemeDataIsCorrect = (results: ThemeStyles[]) => {
					expect(getThemeData(results)).toEqual([
						{ id: 'light', attrs: { 'data-theme': 'light' } },
						{ id: 'light-future', attrs: { 'data-theme': 'light-future' } },
						{ id: 'dark', attrs: { 'data-theme': 'dark' } },
						{ id: 'dark-future', attrs: { 'data-theme': 'dark-future' } },
						{ id: 'legacy-light', attrs: { 'data-theme': 'legacy-light' } },
						{ id: 'legacy-dark', attrs: { 'data-theme': 'legacy-dark' } },
						{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
						{ id: 'shape', attrs: { 'data-theme': 'shape' } },
						{ id: 'typography-adg3', attrs: { 'data-theme': 'typography-adg3' } },
						{
							id: 'typography-modernized',
							attrs: { 'data-theme': 'typography-modernized' },
						},
						{
							id: 'typography-refreshed',
							attrs: { 'data-theme': 'typography-refreshed' },
						},
					]);
				};
				const testWithVisualRefreshVariation = async (
					verify: (css: string, id: ThemeIdsWithOverrides) => void,
				) => {
					const results = await getThemeStyles('all');

					ensureNoVisualRefreshThemes(results);

					// Check that CSS is defined for each result
					// Regular expression to find the --ds-text variable and its value
					results.forEach((result) => {
						const id = result.id;
						const css = result.css;
						expect(css).toBeDefined();
						if (mainThemes.includes(id)) {
							verify(css, id);
						}
					});

					assertThemeDataIsCorrect(results);
				};

				return ffTest(
					'platform-component-visual-refresh',
					async () => {
						await testWithVisualRefreshVariation(verifyBrandRefreshColors);
					},
					async () => {
						await testWithVisualRefreshVariation(verifyNonBrandRefreshColors);
					},
					ff,
				);
			},
		);
	});
});
