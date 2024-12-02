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

/**
 * In order to pass linting rules, these props were renamed to be more descriptive i.e. props renamed to LogoProps and
 * defaultParams to defaultLogoParams. However, this is a breaking change as it is a file with public entry points. The code
 * below is here to keep Logo backwards compatible.
 * See the ticket here: https://product-fabric.atlassian.net/browse/DSP-4086.
 *
 * Note that some consumers are accessing this using like so: import { Props } from '@atlaskit/logo/constants', this should
 * still work despite `LogoProps` being in a different types.tsx file.
 *
 */

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-175 Internal documentation for deprecation (no external access)} This has been renamed, please import `LogoProps` instead.
 */
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type Props = LogoProps;
/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-176 Internal documentation for deprecation (no external access)} This has been renamed, please import `defaultLogoParams` instead.
 */
export const DefaultProps = defaultLogoParams;
