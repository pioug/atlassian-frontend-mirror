/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
import { cssMap, jsx } from '@compiled/react';

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
const lightAppearanceMap = cssMap({
	brand: {
		'--icon-color': 'initial',
		'--tile-color': 'initial',
		'--text-color': token('color.text'),
	},
	neutral: {
		'--icon-color': '#505258',
		'--tile-color': '#DDDEE1',
		'--text-color': '#505258',
	},
	inverse: {
		'--icon-color': '#1E1F21',
		'--tile-color': '#FFFFFF',
		'--text-color': '#FFFFFF',
	},
	legacy: {
		'--icon-color': 'white',
		'--tile-color': '#1868DB',
		'--text-color': 'white',
	},
});
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const darkAppearanceMap = cssMap({
	brand: {
		'--icon-color': 'initial',
		'--tile-color': 'initial',
		'--text-color': token('color.text'),
	},
	neutral: {
		'--icon-color': '#A9ABAF',
		'--tile-color': '#4B4D51',
		'--text-color': '#A9ABAF',
	},
	inverse: {
		'--icon-color': '#FFFFFF',
		'--tile-color': '#1E1F21',
		'--text-color': '#1E1F21',
	},
	legacy: {
		'--icon-color': 'white',
		'--tile-color': '#1868DB',
		'--text-color': 'white',
	},
});
/* eslint-enable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-enable @atlaskit/ui-styling-standard/no-unsafe-values */

type LogoWrapperProps = {
	appearance: 'brand' | 'neutral' | 'inverse' | 'legacy';
	size?: LogoSize;
	svg: string;
	customThemeSvg?: string;
	label: string;
	testId?: string;
	iconColor?: string;
	textColor?: string;
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
}: LogoWrapperProps) {
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
				colorMode === 'light' ? lightAppearanceMap[appearance] : darkAppearanceMap[appearance],
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
			// For logos, the label will always be present and will never be an empty string, so we can always set these aria attributes.
			aria-label={label}
			role={label ? 'img' : undefined}
			aria-hidden={label === '' ? true : undefined}
			// We are using dangerouslySetInnerHTML here to tell React not to track changes to the SVG elements.
			// This is because the SVG elements are static and will not change, so we get a little performance benefit by
			// bypassing React.
			dangerouslySetInnerHTML={{ __html: isCustomThemed ? customThemeSvg : svg }}
		/>
	);
}
