/**
 * Custom hook for managing navigation theming
 * Handles setting data attributes and styles on nav elements
 */

import { useEffect } from 'react';

import { getThemeHtmlAttrs } from '@atlaskit/tokens/get-theme-html-attrs';
import { UNSAFE_loadCustomThemeStyles } from '@atlaskit/tokens/unsafe-load-custom-theme-styles';

import type { AdvancedParameters, NavThemingMode, TintingConfig } from '../types';
import { setColorLightnessByHct } from '../utils/color-utils';

interface UseNavThemingParams {
	enableNavCustomization: boolean;
	navThemingMode: NavThemingMode;
	tintingConfig: TintingConfig;
	advancedParameters: AdvancedParameters;
	resolvedColorMode: 'light' | 'dark';
}

/**
 * Custom hook that manages navigation theming by setting data attributes and styles on nav elements
 */
export function useNavTheming({
	enableNavCustomization,
	navThemingMode,
	tintingConfig,
	advancedParameters,
	resolvedColorMode,
}: UseNavThemingParams): void {
	const isDarkMode = resolvedColorMode === 'dark';
	const brandColor = tintingConfig.brandColor as `#${string}`;

	// Set background color on nav elements. Nav content is themed by a nested ThemeProvider in the
	// example, so the nav surfaces themselves are painted here.
	useEffect(() => {
		if (
			enableNavCustomization &&
			(navThemingMode === 'subtle' || navThemingMode === 'bold') &&
			advancedParameters.themeWholeNav
		) {
			let rafId: number;
			let timeoutId: ReturnType<typeof setTimeout>;

			const updateNavStyles = () => {
				// Find nav elements after they mount
				const topNavElement = document.querySelector(
					'header[data-layout-slot]',
				) as HTMLElement | null;
				const sideNavElement = document.querySelector(
					'nav[data-layout-slot]',
				) as HTMLElement | null;

				if (topNavElement && sideNavElement) {
					// Set background color manually for "subtle" mode only if tintNavBackground is enabled
					if (navThemingMode === 'bold' || advancedParameters.tintNavBackground !== false) {
						const bgColor =
							navThemingMode === 'bold'
								? tintingConfig.brandColor
								: setColorLightnessByHct(
										tintingConfig.brandColor,
										advancedParameters.subtleLightness,
										isDarkMode,
									);
						topNavElement.style.backgroundColor = bgColor;
						sideNavElement.style.backgroundColor = bgColor;
					} else {
						// Clear background color when nav background tinting is disabled
						topNavElement.style.backgroundColor = '';
						sideNavElement.style.backgroundColor = '';
					}
				}
			};

			// Use requestAnimationFrame for smooth updates during dragging
			rafId = requestAnimationFrame(() => {
				updateNavStyles();
			});

			// Also use setTimeout as fallback for initial mount
			timeoutId = setTimeout(() => {
				updateNavStyles();
			}, 0);

			// Cleanup
			return () => {
				cancelAnimationFrame(rafId);
				clearTimeout(timeoutId);
			};
		}
	}, [
		enableNavCustomization,
		navThemingMode,
		tintingConfig.brandColor,
		advancedParameters.subtleLightness,
		advancedParameters.tintNavBackground,
		advancedParameters.tintNeutrals,
		advancedParameters.tintSurface,
		advancedParameters.themeWholeNav,
		isDarkMode,
	]);

	// Set data attributes and load theme styles for tinting (applies even when themeWholeNav is false)
	useEffect(() => {
		if (enableNavCustomization && (navThemingMode === 'subtle' || navThemingMode === 'bold')) {
			// Use setTimeout to ensure DOM elements are available after render
			const timeoutId = setTimeout(() => {
				// Find nav elements after they mount
				const topNavElement = document.querySelector(
					'header[data-layout-slot]',
				) as HTMLElement | null;
				const sideNavElement = document.querySelector(
					'nav[data-layout-slot]',
				) as HTMLElement | null;

				if (topNavElement && sideNavElement) {
					const themeAttrs = getThemeHtmlAttrs({
						colorMode: resolvedColorMode,
						light: 'light',
						dark: 'dark',
						spacing: 'spacing',
						typography: 'typography',
						UNSAFE_themeOptions: { brandColor },
					});

					// Set attributes on nav elements
					Object.entries(themeAttrs).forEach(([key, value]) => {
						topNavElement.setAttribute(key, value);
						sideNavElement.setAttribute(key, value);
					});

					// Load brand-tinted theme styles. Base themes are loaded by the root ThemeProvider.
					UNSAFE_loadCustomThemeStyles({
						colorMode: resolvedColorMode,
						UNSAFE_themeOptions: { brandColor },
					});

					// Clear background color when themeWholeNav is false (tinting still applies via theme attributes)
					if (!advancedParameters.themeWholeNav) {
						topNavElement.style.backgroundColor = '';
						sideNavElement.style.backgroundColor = '';
					}
				}
			}, 0);

			// Cleanup: remove attributes and styles when switching away from tinting modes
			return () => {
				clearTimeout(timeoutId);
				const topNavElement = document.querySelector(
					'header[data-layout-slot]',
				) as HTMLElement | null;
				const sideNavElement = document.querySelector(
					'nav[data-layout-slot]',
				) as HTMLElement | null;
				if (topNavElement) {
					// Don't remove data-color-mode - let it inherit from AppProvider
					topNavElement.removeAttribute('data-theme');
					topNavElement.removeAttribute('data-custom-theme');
					topNavElement.style.backgroundColor = '';
				}
				if (sideNavElement) {
					// Don't remove data-color-mode - let it inherit from AppProvider
					sideNavElement.removeAttribute('data-theme');
					sideNavElement.removeAttribute('data-custom-theme');
					sideNavElement.style.backgroundColor = '';
				}
			};
		} else if (!enableNavCustomization || navThemingMode === 'none') {
			// When customization is disabled or mode is 'none',
			// ensure nav elements have proper theme attributes without custom theming
			const timeoutId = setTimeout(() => {
				const topNavElement = document.querySelector(
					'header[data-layout-slot]',
				) as HTMLElement | null;
				const sideNavElement = document.querySelector(
					'nav[data-layout-slot]',
				) as HTMLElement | null;
				if (topNavElement && sideNavElement) {
					// Get proper theme attributes without custom theming
					const themeAttrs = getThemeHtmlAttrs({
						colorMode: resolvedColorMode,
						light: 'light',
						dark: 'dark',
						spacing: 'spacing',
						typography: 'typography',
					});

					// Set attributes on nav elements
					Object.entries(themeAttrs).forEach(([key, value]) => {
						topNavElement.setAttribute(key, value);
						sideNavElement.setAttribute(key, value);
					});

					// Clear background color
					topNavElement.style.backgroundColor = '';
					sideNavElement.style.backgroundColor = '';
				}
			}, 0);
			return () => clearTimeout(timeoutId);
		}
	}, [
		enableNavCustomization,
		navThemingMode,
		brandColor,
		advancedParameters.tintNeutrals,
		advancedParameters.tintSurface,
		advancedParameters.themeWholeNav,
		resolvedColorMode,
	]);

	// Clear background colors when themeWholeNav is false (but keep tinting via theme attributes)
	useEffect(() => {
		if (
			enableNavCustomization &&
			(navThemingMode === 'subtle' || navThemingMode === 'bold') &&
			!advancedParameters.themeWholeNav
		) {
			const timeoutId = setTimeout(() => {
				const topNavElement = document.querySelector(
					'header[data-layout-slot]',
				) as HTMLElement | null;
				const sideNavElement = document.querySelector(
					'nav[data-layout-slot]',
				) as HTMLElement | null;
				if (topNavElement && sideNavElement) {
					// Clear background color but keep tinting theme attributes
					topNavElement.style.backgroundColor = '';
					sideNavElement.style.backgroundColor = '';
				}
			}, 0);
			return () => clearTimeout(timeoutId);
		}
	}, [enableNavCustomization, navThemingMode, advancedParameters.themeWholeNav, resolvedColorMode]);
}
