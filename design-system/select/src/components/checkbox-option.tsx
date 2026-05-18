/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { type IconProps } from '@atlaskit/icon';
import { token } from '@atlaskit/tokens';

import { type OptionType, type OptionProps } from '../types';

import { ControlOption } from './control-option';

const svgStyles = css({
	width: 24,
	height: 24,
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});

const CheckboxIcon = (props: IconProps) => {
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
				<rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="currentColor" />
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M16.3262 9.48011L15.1738 8.51984L10.75 13.8284L8.82616 11.5198L7.67383 12.4801L10.1738 15.4801C10.3163 15.6511 10.5274 15.75 10.75 15.75C10.9726 15.75 11.1837 15.6511 11.3262 15.4801L16.3262 9.48011Z"
					fill="inherit"
				/>
			</g>
		</svg>
	);
};

/**
 * __Checkbox option__
 */
export const CheckboxOption: <OptionT extends OptionType>(
	props: OptionProps<OptionT, true>,
) => JSX.Element = <OptionT extends OptionType>(props: OptionProps<OptionT, true>): JSX.Element => (
	<ControlOption<OptionT, true>
		Icon={CheckboxIcon}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);
