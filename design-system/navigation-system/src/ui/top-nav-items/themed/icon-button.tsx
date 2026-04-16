import React, { forwardRef } from 'react';

import { IconButton as AkIconButton } from '@atlaskit/button/new';

import { useHasCustomTheme } from './has-custom-theme-context';
import { ThemedIconButton, type ThemedIconButtonProps } from './themed-icon-button';

type IconButtonMigrationProps = {
	// These props are present for compatibility with the normal icon button API,
	// but they do nothing in the themed icon button
	isTooltipDisabled?: boolean;
};

export const IconButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedIconButtonProps & IconButtonMigrationProps> &
		React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ThemedIconButtonProps & IconButtonMigrationProps>(
	(props, ref) => {
		const hasCustomTheme = useHasCustomTheme();
		const Component = hasCustomTheme ? ThemedIconButton : AkIconButton;

		return <Component ref={ref} {...props} />;
	},
);
