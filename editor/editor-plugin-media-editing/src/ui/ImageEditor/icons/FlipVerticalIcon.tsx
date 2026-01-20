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
interface FlipVerticalIconProps {
    isDisabled?: boolean;
    label: string;
    primaryColor?: string;
    secondaryColor?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export const FlipVerticalIcon = ({
    label,
    size = 'small',
    primaryColor = 'currentColor',
    secondaryColor,
    isDisabled,
}: FlipVerticalIconProps) => (
    <svg
        viewBox="0 0 16 16"
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
			d="M1.492e-05 8.75L1.49856e-05 7.25L16 7.25L16 8.75L1.492e-05 8.75ZM12.0039 1.97656C12.2224 2.56323 12.0533 3.2239 11.5801 3.63379L8.98146 5.88379L8.92873 5.92871C8.36667 6.37206 7.56364 6.35668 7.01759 5.88379L4.41994 3.63379C3.94669 3.2239 3.77765 2.56325 3.99611 1.97656C4.21484 1.38987 4.77528 1.00022 5.40138 1L10.5977 1C11.224 1.00003 11.7851 1.38973 12.0039 1.97656ZM11.5801 12.3662C12.0533 12.7761 12.2224 13.4368 12.0039 14.0234C11.7851 14.6103 11.224 15 10.5977 15L5.40138 15C4.77528 14.9998 4.21484 14.6101 3.99611 14.0234C3.77765 13.4368 3.94669 12.7761 4.41994 12.3662L7.01759 10.1162C7.56364 9.64332 8.36667 9.62794 8.92873 10.0713L8.98146 10.1162L11.5801 12.3662ZM5.40138 2.5L8.00002 4.75L10.5977 2.5L5.40138 2.5ZM8.00001 11.25L5.40138 13.5L10.5977 13.5L8.00001 11.25Z"
			fill={primaryColor}
		/>
	</svg>
);
