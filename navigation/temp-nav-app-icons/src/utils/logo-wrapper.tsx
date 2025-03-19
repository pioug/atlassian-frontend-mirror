/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { useThemeObserver } from '@atlaskit/tokens';

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
	label: string;
	testId?: string;
};

export function LogoWrapper({ svg, label, testId: userDefinedTestId }: LogoWrapperProps) {
	const { colorMode } = useThemeObserver();
	const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;

	return (
		// Role and testID behavior copied directly from `@atlaskit/logo` to maintain consistency.
		<span
			css={[
				styles.root,
				// Setting the color so that the SVG can inherit the correct text color using "currentColor"
				logoTextColorMap[colorMode ?? 'light'],
			]}
			data-testid={testId}
			// For logos, the label will always be present and will never be an empty string, so we can always set these aria attributes.
			aria-label={label}
			role={label ? 'img' : undefined}
			aria-hidden={label === '' ? true : undefined}
			// We are using dangerouslySetInnerHTML here to tell React not to track changes to the SVG elements.
			// This is because the SVG elements are static and will not change, so we get a little performance benefit by
			// bypassing React.
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}
