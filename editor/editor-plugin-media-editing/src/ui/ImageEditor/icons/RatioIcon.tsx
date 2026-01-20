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
interface RatioIconProps {
    isDisabled?: boolean;
    label: string;
    primaryColor?: string;
    secondaryColor?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export const RatioIcon = ({ 
    label,
    size = 'small',
    primaryColor = 'currentColor',
    secondaryColor,
    isDisabled,
}: RatioIconProps) => (
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
			d="M3 10V13H6V14.5H2.875C2.11561 14.5 1.5 13.8844 1.5 13.125V10H3ZM14.5 13.125C14.5 13.8844 13.8844 14.5 13.125 14.5H10V13H13V10H14.5V13.125ZM13.125 1.5C13.8844 1.5 14.5 2.11561 14.5 2.875V6H13V3H10V1.5H13.125ZM6 3H3V6H1.5V2.875C1.5 2.11561 2.11561 1.5 2.875 1.5H6V3Z"
			fill={primaryColor}
		/>
	</svg>
);
