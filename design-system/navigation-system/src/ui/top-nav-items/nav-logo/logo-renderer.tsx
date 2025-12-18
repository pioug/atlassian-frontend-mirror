/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import type { LogoProps } from '@atlaskit/logo';

import { useHasCustomTheme } from '../themed/has-custom-theme-context';

export const themedLogoIcon = '--ds-top-bar-logo-icon';
export const themedLogoText = '--ds-top-bar-logo-text';

export function LogoRenderer({
	logoOrIcon: LogoOrIcon,
	shouldUseNewLogoDesign,
}: {
	logoOrIcon: (props: LogoProps) => JSX.Element;
	shouldUseNewLogoDesign?: boolean;
}) {
	const hasCustomTheme = useHasCustomTheme();

	if (hasCustomTheme) {
		return (
			<LogoOrIcon
				label=""
				size="small"
				shouldUseNewLogoDesign={shouldUseNewLogoDesign}
				iconColor={`var(${themedLogoIcon})`}
				textColor={`var(${themedLogoText})`}
			/>
		);
	}

	return (
		<LogoOrIcon
			size="small"
			shouldUseNewLogoDesign={shouldUseNewLogoDesign}
			label=""
			appearance="brand"
		/>
	);
}
