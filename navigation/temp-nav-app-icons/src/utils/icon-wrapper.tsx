/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { IconSize } from './types';

const styles = cssMap({
	root: {
		display: 'inline-block',
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
const appearanceMap = cssMap({
	brand: {
		'--icon-color': 'initial',
		'--tile-color': 'initial',
	},
	neutral: {
		'--icon-color': token('color.text.inverse'),
		'--tile-color': token('color.text'),
	},
	inverse: {
		'--icon-color': token('color.text'),
		'--tile-color': token('color.text.inverse'),
	},
	// The 'legacy' appearance replaces icon colors with a blue tile and white icon, controlled via CSS variables
	legacy: {
		'--icon-color': 'white',
		'--tile-color': '#1868DB',
	},
});
/* eslint-enable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-enable @atlaskit/ui-styling-standard/no-unsafe-values */

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
	'12': {
		height: '12px',
	},
	'16': {
		height: '16px',
	},
	'20': {
		height: '20px',
	},
	'24': {
		height: '24px',
	},
	'32': {
		height: '32px',
	},
});

type IconWrapperProps = {
	size?: IconSize;
	label: string;
	testId?: string;
	svg: string;
	customThemeSvg?: string;
	appearance?: 'brand' | 'legacy' | 'neutral' | 'inverse';
	iconColor?: string;
};

export function IconWrapper({
	size = '20',
	label,
	svg,
	customThemeSvg,
	testId: userDefinedTestId,
	appearance = 'brand',
	iconColor: customIconColor,
}: IconWrapperProps) {
	const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;

	const isCustomThemed = customThemeSvg && customIconColor;

	return (
		// Role and testID behavior copied directly from `@atlaskit/logo` to maintain consistency.
		<span
			css={[styles.root, sizeMap[size], appearanceMap[appearance]]}
			data-testid={testId}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					'--themed-icon-color': customIconColor || 'initial',
				} as React.CSSProperties
			}
			// In some icons (such as the app switcher specific icons), the label is a consumer prop.
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
