/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { useThemeObserver } from '@atlaskit/tokens';

import { CSS_VAR_THEMED_ICON, CSS_VAR_THEMED_TEXT } from './constants';

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

type LogoWrapperProps = {
	svg: string;
	customThemeSvg?: string;
	label: string;
	testId?: string;
	iconColor?: string;
	textColor?: string;
};

export function LogoWrapper({
	svg,
	customThemeSvg,
	label,
	testId: userDefinedTestId,
	iconColor,
	textColor,
}: LogoWrapperProps) {
	const { colorMode } = useThemeObserver();
	const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;
	const isCustomThemed = customThemeSvg && (iconColor || textColor);

	return (
		// Role and testID behavior copied directly from `@atlaskit/logo` to maintain consistency.
		<span
			css={[
				styles.root,
				// Setting the color so that the SVG can inherit the correct text color using "currentColor"
				logoTextColorMap[colorMode ?? 'light'],
			]}
			style={
				{
					// Nav v3 passes in "inherit" incorrectly for iconColor, so we fall back to textColor when this happens.
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					[CSS_VAR_THEMED_ICON]: iconColor === 'inherit' ? textColor : iconColor || 'initial',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
					[CSS_VAR_THEMED_TEXT]: textColor || 'initial',
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
