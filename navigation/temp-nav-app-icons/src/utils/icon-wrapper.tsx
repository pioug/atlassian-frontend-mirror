/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';

import { CSS_VAR_ICON, CSS_VAR_THEMED_ICON, CSS_VAR_TILE } from './constants';
import type { IconSize } from './types';

const styles = cssMap({
	root: {
		display: 'inline-block',
	},
});

const sizeMap = cssMap({
	'20': {
		height: '20px',
	},
	'24': {
		height: '24px',
	},
	small: {
		height: '24px',
	},
	medium: {
		height: '32px',
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
	iconColor,
}: IconWrapperProps) {
	const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;

	const isCustomThemed = customThemeSvg && iconColor;

	return (
		// Role and testID behavior copied directly from `@atlaskit/logo` to maintain consistency.
		<span
			css={[styles.root, sizeMap[size]]}
			data-testid={testId}
			style={
				{
					// The 'legacy' appearance replaces icon colors with a blue tile and white icon, controlled via CSS variables
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					[CSS_VAR_ICON]: appearance === 'legacy' ? 'white' : 'initial',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					[CSS_VAR_TILE]: appearance === 'legacy' ? '#1868DB' : 'initial',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					[CSS_VAR_THEMED_ICON]: iconColor || 'initial',
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
