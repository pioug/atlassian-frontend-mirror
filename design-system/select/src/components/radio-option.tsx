/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { css, jsx } from '@compiled/react';

import { type IconProps } from '@atlaskit/icon';
import { token } from '@atlaskit/tokens';

import { type OptionProps, type OptionType } from '../types';

import { ControlOption } from './control-option';

const svgStyles = css({
	width: 24,
	height: 24,
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

const RadioIcon = (props: IconProps) => {
	const { primaryColor, secondaryColor, label } = props;

	return (
		<svg
			viewBox="0 0 24 24"
			style={{ color: primaryColor, fill: secondaryColor }}
			css={svgStyles}
			aria-label={label ? label : undefined}
			role={label ? 'img' : 'presentation'}
		>
			<g fillRule="evenodd">
				<circle cx="12" cy="12" r="6.75" fill="currentColor" strokeWidth="1.5" />
				<circle cx="12" cy="12" r="3" fill="inherit" />
			</g>
		</svg>
	);
};

/**
 * __Radio option__
 */
export const RadioOption: <OptionT extends OptionType>(
	props: OptionProps<OptionT, false>,
) => JSX.Element = <OptionT extends OptionType>(props: OptionProps<OptionT, false>) => (
	// TODO https://product-fabric.atlassian.net/browse/DSP-20769
	<ControlOption
		Icon={RadioIcon}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
