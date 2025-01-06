/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import { type WrapperProps } from './constants';

const CSS_VAR_COLOR = '--logo-color';
const CSS_VAR_FILL = '--logo-fill';

const styles = cssMapUnbound({
	root: {
		display: 'inline-block',
		position: 'relative',
		color: `var(${CSS_VAR_COLOR})`,
		fill: `var(${CSS_VAR_FILL})`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1,
		userSelect: 'none',
		whiteSpace: 'normal',
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> svg': {
			height: '100%',
			fill: 'inherit',
		},
	},
	stop: {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& stop': {
			stopColor: 'currentColor',
		},
	},
	xsmall: { height: '16px' },
	small: { height: '24px' },
	medium: { height: '32px' },
	large: { height: '40px' },
	xlarge: { height: '48px' },
});

/**
 * __Wrapper__
 *
 * An internal component used by `@atlaskit/logo` to render logo SVGs with correct styles.
 */
const Wrapper = ({
	label,
	svg,
	size,
	appearance,
	iconColor,
	textColor,
	testId: userDefinedTestId,
	...rest
}: WrapperProps) => {
	// Only required for old logos with gradients, which set gradient values to `inherit` when no appearance is provided
	const shouldApplyStopColor = appearance === undefined;

	const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;

	return (
		<span
			css={[styles.root, shouldApplyStopColor && styles.stop, size && styles[size]]}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				{
					[CSS_VAR_COLOR]: iconColor,
					[CSS_VAR_FILL]: textColor,
				} as React.CSSProperties
			}
			aria-label={label ? label : undefined}
			role={label ? 'img' : undefined}
			dangerouslySetInnerHTML={{
				__html: svg,
			}}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
		/>
	);
};

export default Wrapper;
