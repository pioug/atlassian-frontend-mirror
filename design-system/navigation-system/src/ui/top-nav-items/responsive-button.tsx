import React, { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { useIsCompactTopNav } from '../page-layout/top-nav/use-is-compact-top-nav';
import type { Button } from './themed/button';
import type { IconButton } from './themed/icon-button';

type ResponsiveButtonProps = Omit<
	ComponentPropsWithoutRef<typeof Button>,
	'children' | 'iconBefore'
> &
	Pick<ComponentPropsWithoutRef<typeof IconButton>, 'icon' | 'label'> & {
		/**
		 * The TopNavIconButton component used for both presentations.
		 * It must forward its ref and support TopNavIconButton's shouldShowLabel prop.
		 * Both presentations receive the same handlers and state.
		 */
		iconButton: typeof IconButton;
		/**
		 * Tooltip options for the compact, icon-only presentation. Tooltips are enabled by default.
		 */
		tooltip?: ComponentPropsWithoutRef<typeof IconButton>['tooltip'];
	};

/**
 * An explicit responsive action: icon-only at xs/xxs, icon and label at sm and above.
 * TopNav provides container measurements behind platform-dst-chat-panel-layout.
 * Server markup uses an accessible icon-only fallback until client measurement.
 * With the gate off or outside TopNav, it uses text. The button element is preserved.
 */
export const ResponsiveButton: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ResponsiveButtonProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ResponsiveButtonProps>(
	(
		{ iconButton: IconButtonComponent, icon, label, tooltip, isTooltipDisabled = false, ...props },
		ref,
	) => {
		const isCompact = useIsCompactTopNav();
		return (
			<IconButtonComponent
				{...props}
				ref={ref}
				icon={icon}
				label={label}
				shouldShowLabel={!isCompact}
				isTooltipDisabled={isTooltipDisabled}
				tooltip={tooltip}
			/>
		);
	},
);
