import React, { forwardRef } from 'react';

import AkIconButton from '@atlaskit/button/icon/button';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useHasCustomTheme } from './has-custom-theme-context';
import { ResponsiveIconButton } from './responsive-icon-button';
import { ThemedIconButton, type ThemedIconButtonProps } from './themed-icon-button';

export const IconButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ThemedIconButtonProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ThemedIconButtonProps>(
	({ isTooltipDisabled, shouldShowLabel, ...props }, ref) => {
		const hasCustomTheme = useHasCustomTheme();
		if (shouldShowLabel !== undefined) {
			return (
				<ResponsiveIconButton
					{...props}
					ref={ref}
					shouldShowLabel={shouldShowLabel}
					isTooltipDisabled={isTooltipDisabled}
				/>
			);
		}
		// Preserve legacy custom-theme behavior outside the chat-panel rollout.
		return hasCustomTheme ? (
			<ThemedIconButton
				ref={ref}
				{...props}
				isTooltipDisabled={fg('platform-dst-chat-panel-layout') ? isTooltipDisabled : undefined}
			/>
		) : (
			<AkIconButton ref={ref} {...props} isTooltipDisabled={isTooltipDisabled} />
		);
	},
);
