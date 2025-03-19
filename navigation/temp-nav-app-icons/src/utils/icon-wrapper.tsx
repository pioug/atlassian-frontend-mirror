/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';

import type { IconSize } from './types';

const CSS_VAR_ICON = '--icon-color';
const CSS_VAR_TILE = '--tile-color';

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
	'32': {
		height: '32px',
	},
});

type IconWrapperProps = {
	size?: IconSize;
	label: string;
	testId?: string;
	svg: string;
	appearance?: 'brand' | 'legacy';
};

export function IconWrapper({
	size = '20',
	label,
	svg,
	testId: userDefinedTestId,
	appearance = 'brand',
}: IconWrapperProps) {
	const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;

	return (
		// Role and testID behavior copied directly from `@atlaskit/logo` to maintain consistency.
		<span
			css={[styles.root, sizeMap[size]]}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				{
					[CSS_VAR_ICON]: appearance === 'legacy' ? 'white' : 'initial',
					[CSS_VAR_TILE]: appearance === 'legacy' ? '#1868DB' : 'initial',
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
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}
