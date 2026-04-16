import React, { forwardRef } from 'react';

import { LinkIconButton as AkLinkIconButton } from '@atlaskit/button/new';

import { useHasCustomTheme } from './has-custom-theme-context';
import { ThemedLinkIconButton, type ThemedLinkIconButtonProps } from './themed-link-icon-button';

type IconButtonMigrationProps = {
	// These props are present for compatibility with the normal icon button API,
	// but they do nothing in the themed icon button
	isTooltipDisabled?: boolean;
};

export const LinkIconButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedLinkIconButtonProps & IconButtonMigrationProps> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, ThemedLinkIconButtonProps & IconButtonMigrationProps>(
	(props, ref) => {
		const hasCustomTheme = useHasCustomTheme();
		const Component = hasCustomTheme ? ThemedLinkIconButton : AkLinkIconButton;

		return <Component ref={ref} {...props} />;
	},
);
