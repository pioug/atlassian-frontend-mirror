import React, { forwardRef } from 'react';

import AkButton from '@atlaskit/button/new';

import { useHasCustomTheme } from './has-custom-theme-context';
import { ThemedButton, type ThemedButtonProps } from './themed-button';

type IconButtonMigrationProps = {
	// These props are present for compatibility with the normal icon button API,
	// but they do nothing in the themed icon button
	isTooltipDisabled?: boolean;
};

// Explicitly typed to use only the themed button API,
// which is a subset of the normal button API
export const Button: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedButtonProps & IconButtonMigrationProps> &
		React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ThemedButtonProps & IconButtonMigrationProps>((props, ref) => {
	const hasCustomTheme = useHasCustomTheme();
	const Component = hasCustomTheme ? ThemedButton : AkButton;

	return <Component ref={ref} {...props} />;
});
