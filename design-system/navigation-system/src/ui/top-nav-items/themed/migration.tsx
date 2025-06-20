import React, { forwardRef } from 'react';

import AkButton, {
	IconButton as AkIconButton,
	LinkButton as AkLinkButton,
	LinkIconButton as AkLinkIconButton,
} from '@atlaskit/button/new';

import {
	ThemedButton,
	type ThemedButtonProps,
	ThemedIconButton,
	type ThemedIconButtonProps,
	ThemedLinkButton,
	type ThemedLinkButtonProps,
	ThemedLinkIconButton,
	type ThemedLinkIconButtonProps,
} from './button';
import { useHasCustomTheme } from './has-custom-theme-context';

type IconButtonMigrationProps = {
	// These props are present for compatibility with the normal icon button API,
	// but they do nothing in the themed icon button
	isTooltipDisabled?: boolean;
};

// Explicitly typed to use only the themed button API,
// which is a subset of the normal button API
const IconButton = forwardRef<HTMLButtonElement, ThemedIconButtonProps & IconButtonMigrationProps>(
	(props, ref) => {
		const hasCustomTheme = useHasCustomTheme();
		const Component = hasCustomTheme ? ThemedIconButton : AkIconButton;

		return <Component ref={ref} {...props} />;
	},
);

// Explicitly typed to use only the themed button API,
// which is a subset of the normal button API
const LinkIconButton = forwardRef<
	HTMLAnchorElement,
	ThemedLinkIconButtonProps & IconButtonMigrationProps
>((props, ref) => {
	const hasCustomTheme = useHasCustomTheme();
	const Component = hasCustomTheme ? ThemedLinkIconButton : AkLinkIconButton;

	return <Component ref={ref} {...props} />;
});

// Explicitly typed to use only the themed button API,
// which is a subset of the normal button API
const Button = forwardRef<HTMLButtonElement, ThemedButtonProps & IconButtonMigrationProps>(
	(props, ref) => {
		const hasCustomTheme = useHasCustomTheme();
		const Component = hasCustomTheme ? ThemedButton : AkButton;

		return <Component ref={ref} {...props} />;
	},
);

// Explicitly typed to use only the themed button API,
// which is a subset of the normal button API
const LinkButton = forwardRef<HTMLAnchorElement, ThemedLinkButtonProps>((props, ref) => {
	const hasCustomTheme = useHasCustomTheme();
	const Component = hasCustomTheme ? ThemedLinkButton : AkLinkButton;

	return <Component ref={ref} {...props} />;
});

export { IconButton, Button, LinkIconButton, LinkButton };
