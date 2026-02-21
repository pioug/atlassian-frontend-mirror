/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
const sizeStyles = cssMap({
	small: {
		width: '20px',
		height: '20px',
	},
	medium: {
		width: '24px',
		height: '24px',
	},
	large: {
		width: '32px',
		height: '32px',
	},
	xlarge: {
		width: '48px',
		height: '48px',
	},
});
const svgStyles = css({
	fill: token('elevation.surface'),
	overflow: 'hidden',
	pointerEvents: 'none',
});
interface RotateIconProps {
	isDisabled?: boolean;
	label: string;
	primaryColor?: string;
	secondaryColor?: string;
	size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export const RotateIcon = ({
	label,
	size = 'small',
	primaryColor = 'currentColor',
	secondaryColor,
	isDisabled,
}: RotateIconProps) => (
	<svg
		viewBox="0 0 16 16"
		xmlns="http://www.w3.org/2000/svg"
		css={[svgStyles, sizeStyles[size]]}
		style={{
			color: primaryColor,
			fill: secondaryColor,
			opacity: isDisabled ? 0.5 : 1,
		}}
		aria-label={label || undefined}
		role={label ? 'img' : 'presentation'}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.93459 6.72227C7.47156 6.1853 8.34216 6.1853 8.87913 6.72227L12.0914 9.93458C12.6284 10.4716 12.6284 11.3422 12.0914 11.8791L8.87913 15.0914C8.34216 15.6284 7.47156 15.6284 6.93459 15.0914L3.72228 11.8791C3.18531 11.3422 3.18531 10.4716 3.72228 9.93458L6.93459 6.72227ZM7.90686 7.87132L4.87133 10.9069L7.90686 13.9424L10.9424 10.9069L7.90686 7.87132Z"
			fill={primaryColor}
		/>
		<path
			d="M0 8.5C0 4.08172 3.58172 0.5 8 0.5C10.6789 0.5 13.0485 1.81718 14.5 3.83691V0.75H16V5.5C16 5.91421 15.6642 6.25 15.25 6.25H10.5V4.75H13.3086C12.1308 3.08578 10.192 2 8 2C4.41015 2 1.5 4.91015 1.5 8.5V9.25H0V8.5Z"
			fill={primaryColor}
		/>
	</svg>
);
