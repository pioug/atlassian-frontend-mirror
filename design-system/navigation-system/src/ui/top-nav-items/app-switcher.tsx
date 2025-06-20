import React, { forwardRef } from 'react';

import { type IconButtonProps } from '@atlaskit/button/new';
import AppSwitcherIcon from '@atlaskit/icon/core/app-switcher';
import type { TriggerProps } from '@atlaskit/popup/types';

import { IconButton } from './themed/migration';

interface AppSwitcherProps
	extends Partial<
		Omit<
			TriggerProps,
			| 'ref' // not necessary because we're using forwardRef
			| 'data-ds--level' // this doesn't look like it should be exposed
		>
	> {
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: React.ReactNode;
	/**
	 * Handler called on click.
	 */
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	/**
	 * Called when the mouse enters the element container.
	 * Allows preloading popup components
	 */
	onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
	/**
	 * Indicates that the button is selected.
	 */
	isSelected?: boolean;
}

const toggleButtonTooltipOptions: IconButtonProps['tooltip'] = {
	// We're disabling pointer events on the tooltip to prevent it from blocking mouse events, so that the side nav flyout stays open
	// when moving the mouse from the top bar to the side nav.
	ignoreTooltipPointerEvents: true,
};

/**
 * __App switcher__
 *
 * The trigger button for the app switcher. Allows users to switch between Atlassian products.
 */
export const AppSwitcher = forwardRef<HTMLButtonElement, AppSwitcherProps>(
	(
		{
			label,
			onClick,
			onMouseEnter,
			interactionName,
			isSelected,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
		},
		ref,
	) => (
		<IconButton
			ref={ref}
			aria-controls={ariaControls}
			aria-expanded={ariaExpanded}
			aria-haspopup={ariaHasPopup}
			icon={AppSwitcherIcon}
			label={label}
			appearance="subtle"
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			interactionName={interactionName}
			isTooltipDisabled={false}
			tooltip={toggleButtonTooltipOptions}
			isSelected={isSelected}
		/>
	),
);
