import React, { forwardRef } from 'react';

import { LinkButton as AkLinkButton } from '@atlaskit/button/new';

import { useHasCustomTheme } from './has-custom-theme-context';
import { ThemedLinkButton, type ThemedLinkButtonProps } from './themed-link-button';

export const LinkButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedLinkButtonProps> & React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, ThemedLinkButtonProps>((props, ref) => {
	const hasCustomTheme = useHasCustomTheme();
	const Component = hasCustomTheme ? ThemedLinkButton : AkLinkButton;

	return <Component ref={ref} {...props} />;
});
