import { type LogoProps } from './types';

export type { LogoProps };

/**
 * These are the default parameters for LogoProps if the user does not specify values.
 */
export const defaultLogoParams: Partial<LogoProps> = {
	iconColor: 'inherit',
	label: '',
	size: 'medium',
	textColor: 'currentColor',
};

export const legacyDefaultLogoParams = {
	iconGradientStart: 'inherit',
	iconGradientStop: 'inherit',
};

/**
 * The props for the <Wrapper /> that takes the svg and turns it into a component.
 */
export type WrapperProps = LogoProps & {
	svg: string;
};
