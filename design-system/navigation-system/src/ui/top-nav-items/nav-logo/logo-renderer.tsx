/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import type { LogoProps } from '@atlaskit/logo/types';

import { useHasCustomTheme } from '../themed/has-custom-theme-context';

export const themedLogoIcon = '--ds-top-bar-logo-icon';
export const themedLogoText = '--ds-top-bar-logo-text';

export function LogoRenderer({
	logoOrIcon: LogoOrIcon,
}: {
	logoOrIcon: (props: LogoProps) => JSX.Element;
}): JSX.Element {
	const hasCustomTheme = useHasCustomTheme();

	if (hasCustomTheme) {
		return (
			<LogoOrIcon
				label=""
				size="small"
				iconColor={`var(${themedLogoIcon})`}
				textColor={`var(${themedLogoText})`}
			/>
		);
	}

	return <LogoOrIcon size="small" label="" appearance="brand" />;
}
