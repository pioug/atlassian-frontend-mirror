/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { memo } from 'react';

import { jsx } from '@compiled/react';

import type { LogoProps } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import type {
	IconProps as TempIconProps,
	LogoProps as TempLogoProps,
} from '@atlaskit/temp-nav-app-icons/types';

import { useHasCustomTheme } from '../themed/has-custom-theme-context';

export const themedLogoIcon = '--ds-top-bar-logo-icon';
export const themedLogoText = '--ds-top-bar-logo-text';

export function LogoRenderer({ logoOrIcon }: React.ComponentProps<typeof LogoRendererNoMemo>) {
	return fg('jiv-20710-fix-nav-rerender') ? (
		<LogoRendererMemo logoOrIcon={logoOrIcon} />
	) : (
		<LogoRendererNoMemo logoOrIcon={logoOrIcon} />
	);
}

const LogoRendererMemo = memo(LogoRendererNoMemo);

function LogoRendererNoMemo({
	logoOrIcon: LogoOrIcon,
}: {
	logoOrIcon:
		| ((props: LogoProps) => JSX.Element)
		| ((props: TempLogoProps) => JSX.Element)
		| ((props: TempIconProps) => JSX.Element);
}) {
	const hasCustomTheme = useHasCustomTheme();

	if (hasCustomTheme) {
		return (
			<LogoOrIcon
				size="small"
				label=""
				iconColor={`var(${themedLogoIcon})`}
				textColor={`var(${themedLogoText})`}
			/>
		);
	}

	return <LogoOrIcon size="small" label="" appearance="brand" />;
}
