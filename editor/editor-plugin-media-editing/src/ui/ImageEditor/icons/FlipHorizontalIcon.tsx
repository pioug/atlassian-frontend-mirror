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
interface FlipHorizontalIconProps {
	isDisabled?: boolean;
	label: string;
	primaryColor?: string;
	secondaryColor?: string;
	size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export const FlipHorizontalIcon = ({
	label,
	size = 'small',
	primaryColor = 'currentColor',
	secondaryColor,
	isDisabled,
}: FlipHorizontalIconProps) => (
	<svg
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		css={[svgStyles, sizeStyles[size]]}
		style={{ 
            color: primaryColor,
			fill: secondaryColor,
            opacity: isDisabled ? 0.5 : 1 
        }}
		aria-label={label || undefined}
		role={label ? 'img' : 'presentation'}
	>
		<path
			d="M8.75 16H7.25V0H8.75V16ZM1.97559 3.99609C2.56238 3.77737 3.22379 3.94656 3.63379 4.41992L5.88379 7.01855L5.92773 7.07129C6.37112 7.63335 6.3567 8.43636 5.88379 8.98242L3.63379 11.5801C3.22379 12.0535 2.56239 12.2226 1.97559 12.0039C1.38909 11.7851 1.00022 11.2246 1 10.5986V5.40234C1.00003 4.77617 1.38894 4.21497 1.97559 3.99609ZM12.3662 4.41992C12.7762 3.94656 13.4376 3.77737 14.0244 3.99609C14.6111 4.21497 15 4.77617 15 5.40234V10.5986C14.9998 11.2246 14.6109 11.7851 14.0244 12.0039C13.4376 12.2226 12.7762 12.0535 12.3662 11.5801L10.1162 8.98242C9.6433 8.43636 9.62888 7.63335 10.0723 7.07129L10.1162 7.01855L12.3662 4.41992ZM2.5 10.5986L4.75 8L2.5 5.40234V10.5986ZM11.25 8L13.5 10.5986V5.40234L11.25 8Z"
			fill={primaryColor}
		/>
	</svg>
);
