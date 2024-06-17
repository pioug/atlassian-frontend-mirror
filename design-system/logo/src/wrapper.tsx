/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { sizes, type WrapperProps } from './constants';
import { type Size } from './types';

const CSS_VAR_COLOR = '--logo-color';
const CSS_VAR_FILL = '--logo-fill';

const baseWrapperStyles = css({
	display: 'inline-block',
	position: 'relative',
	color: `var(${CSS_VAR_COLOR})`,
	fill: `var(${CSS_VAR_FILL})`,
	lineHeight: 1,
	userSelect: 'none',
	whiteSpace: 'normal',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> svg': {
		height: '100%',
		fill: 'inherit',
	},
});

const stopColorStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	stop: {
		stopColor: 'currentColor',
	},
});

type SizeStyles = Record<Size, SerializedStyles>;
const sizeStyles = Object.entries(sizes).reduce((acc, [key, val]) => {
	acc[key as Size] = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: `${val}px`,
	});
	return acc;
}, {} as Partial<SizeStyles>) as SizeStyles;

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
			css={[baseWrapperStyles, shouldApplyStopColor && stopColorStyles, size && sizeStyles[size]]}
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
