/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token, useThemeObserver } from '@atlaskit/tokens';

import { type LogoSize } from './types';

const styles = cssMap({
	root: {
		display: 'inline-block',
		// We are setting the line-height to 0 to remove the extra space added for a line box.
		// This is safe as the logo does not contain any text content.
		// This ensures the parent `span` is the exact same size as its child SVG.
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
	},
	TEMP_assets: {
		'--tile-color': '#DDDEE1',
	},
});

// These styles set the `color` property so that the child SVG can inherit the correct text color using "currentColor"
const logoTextColorMap = cssMap({
	light: {
		color: '#101214',
	},
	dark: {
		color: '#E2E3E4',
	},
});

const sizeMap = cssMap({
	xxsmall: {
		height: '16px',
	},
	xsmall: {
		height: '20px',
	},
	small: {
		height: '24px',
	},
	medium: {
		height: '32px',
	},
	large: {
		height: '40px',
	},
	xlarge: {
		height: '48px',
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const textLightAppearanceMap = cssMap({
	brand: {
		'--text-color': token('color.text'),
	},
	neutral: {
		'--text-color': '#505258',
	},
	inverse: {
		'--text-color': '#FFFFFF',
	},
	legacy: {
		'--text-color': 'white',
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const textDarkAppearanceMap = cssMap({
	brand: {
		'--text-color': token('color.text'),
	},
	neutral: {
		'--text-color': '#A9ABAF',
	},
	inverse: {
		'--text-color': '#1E1F21',
	},
	legacy: {
		'--text-color': 'white',
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const cloudLightAppearanceMap = cssMap({
	brand: {
		'--icon-color': 'initial',
		'--tile-color': 'initial',
	},
	neutral: {
		'--icon-color': '#505258',
		'--tile-color': '#DDDEE1',
	},
	inverse: {
		'--icon-color': '#1E1F21',
		'--tile-color': '#FFFFFF',
	},
	legacy: {
		'--icon-color': 'white',
		'--tile-color': '#1868DB',
	},
});
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const cloudDarkAppearanceMap = cssMap({
	brand: {
		'--icon-color': 'initial',
		'--tile-color': 'initial',
	},
	neutral: {
		'--icon-color': '#A9ABAF',
		'--tile-color': '#4B4D51',
	},
	inverse: {
		'--icon-color': '#FFFFFF',
		'--tile-color': '#1E1F21',
	},
	legacy: {
		'--icon-color': 'white',
		'--tile-color': '#1868DB',
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const dataCenterLightAppearanceMap = cssMap({
	brand: {
		'--icon-color': '#1868DB',
		'--tile-color': '#FFFFFF',
		'--border-color': '#DDDEE1',
	},
	neutral: {
		'--icon-color': '#505258',
		'--tile-color': '#DDDEE1',
		'--border-color': '#505258',
	},
	inverse: {
		'--icon-color': '#FFFFFF',
		'--tile-color': '#101214',
		'--border-color': '#FFFFFF',
	},
	legacy: {
		'--icon-color': '#1868DB',
		'--tile-color': '#FFFFFF',
		'--border-color': '#DDDEE1',
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const dataCenterDarkAppearanceMap = cssMap({
	brand: {
		'--icon-color': '#1868DB',
		'--tile-color': '#101214',
		'--border-color': '#4B4D51',
	},
	neutral: {
		'--icon-color': '#A9ABAF',
		'--tile-color': '#4B4D51',
		'--border-color': '#A9ABAF',
	},
	inverse: {
		'--icon-color': '#1F1F21',
		'--tile-color': '#FFFFFF',
		'--border-color': '#1F1F21',
	},
	legacy: {
		'--icon-color': '#1868DB',
		'--tile-color': '#101214',
		'--border-color': '#4B4D51',
	},
});

const rovoDarkAppearanceMap = cssMap({
	brand: {
		'--rovo-blue-color': '#357DE8',
		'--rovo-yellow-color': '#FCA700',
		'--rovo-purple-color': '#BF63F3',
		'--rovo-green-color': '#82B536',
	},
	neutral: {
		'--rovo-blue-color': '#A9ABAF',
		'--rovo-yellow-color': '#A9ABAF',
		'--rovo-purple-color': '#A9ABAF',
		'--rovo-green-color': '#A9ABAF',
	},
	inverse: {
		'--rovo-blue-color': '#101214',
		'--rovo-yellow-color': '#101214',
		'--rovo-purple-color': '#101214',
		'--rovo-green-color': '#101214',
	},
	legacy: {
		'--rovo-blue-color': '#1868DB',
		'--rovo-yellow-color': '#1868DB',
		'--rovo-purple-color': '#1868DB',
		'--rovo-green-color': '#1868DB',
	},
});

const rovoLightAppearanceMap = cssMap({
	brand: {
		'--rovo-blue-color': 'initial',
		'--rovo-yellow-color': 'initial',
		'--rovo-purple-color': 'initial',
		'--rovo-green-color': 'initial',
	},
	neutral: {
		'--rovo-blue-color': '#505258',
		'--rovo-yellow-color': '#505258',
		'--rovo-purple-color': '#505258',
		'--rovo-green-color': '#505258',
	},
	inverse: {
		'--rovo-blue-color': '#ffffff',
		'--rovo-yellow-color': '#ffffff',
		'--rovo-purple-color': '#ffffff',
		'--rovo-green-color': '#ffffff',
	},
	legacy: {
		'--rovo-blue-color': '#1868DB',
		'--rovo-yellow-color': '#1868DB',
		'--rovo-purple-color': '#1868DB',
		'--rovo-green-color': '#1868DB',
	},
});

/* eslint-enable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-enable @atlaskit/ui-styling-standard/no-unsafe-values */

type LogoWrapperProps = {
	appearance: 'brand' | 'neutral' | 'inverse' | 'legacy';
	customThemeSvg?: string;
	iconColor?: string;
	isAssets?: boolean;
	label: string;
	size?: LogoSize;
	svg: string;
	testId?: string;
	textColor?: string;
	type?: 'tile' | 'rovo' | 'data-center';
};

export function LogoWrapper({
	appearance = 'brand',
	size = 'small',
	svg,
	customThemeSvg,
	label,
	testId: userDefinedTestId,
	iconColor: customIconColor,
	textColor: customTextColor,
	isAssets = false,
	type = 'tile',
}: LogoWrapperProps): JSX.Element {
	const { colorMode } = useThemeObserver();
	const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;
	const isCustomThemed = customThemeSvg && (customIconColor || customTextColor);

	return (
		// Role and testID behavior copied directly from `@atlaskit/logo` to maintain consistency.
		<span
			css={[
				styles.root,
				// Setting the color so that the SVG can inherit the correct text color using "currentColor"
				logoTextColorMap[colorMode ?? 'light'],
				sizeMap[size],
				// Text colors
				colorMode === 'dark'
					? textDarkAppearanceMap[appearance]
					: textLightAppearanceMap[appearance],
				// Icon colors
				type === 'data-center'
					? colorMode === 'dark'
						? dataCenterDarkAppearanceMap[appearance]
						: dataCenterLightAppearanceMap[appearance]
					: undefined,
				type === 'rovo'
					? colorMode === 'dark'
						? rovoDarkAppearanceMap[appearance]
						: rovoLightAppearanceMap[appearance]
					: colorMode === 'dark'
						? cloudDarkAppearanceMap[appearance]
						: cloudLightAppearanceMap[appearance],
				isAssets && appearance === 'brand' && fg('assets-platform-branding') && styles.TEMP_assets,
			]}
			style={
				{
					// Nav v3 passes in "inherit" incorrectly for iconColor, so we fall back to textColor when this happens.
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					'--themed-icon-color': customIconColor === 'inherit' ? customTextColor : customIconColor,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					'--themed-text-color': customTextColor || 'inherit',
				} as React.CSSProperties
			}
			data-testid={testId}
			// If the label is provided an empty string, we want to remove the element from the accessibility tree.
			aria-label={label ? label : undefined}
			role={label ? 'img' : undefined}
			aria-hidden={label === '' ? true : undefined}
			// We are using dangerouslySetInnerHTML here to tell React not to track changes to the SVG elements.
			// This is because the SVG elements are static and will not change, so we get a little performance benefit by
			// bypassing React.
			dangerouslySetInnerHTML={{ __html: isCustomThemed ? customThemeSvg : svg }}
		/>
	);
}
