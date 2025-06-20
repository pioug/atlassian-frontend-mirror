/**
 * @jsxRuntime classic
 */
import React, { type ComponentType, forwardRef } from 'react';

import HelpIcon from '@atlaskit/icon/core/question-circle';

import { BadgeContainer } from '../../components/badge-container';

import { EndItem, type EndItemProps } from './end-item';

const HELP_NOTIFICATION_BADGE_ID = 'atlassian-navigation-help-notification-count';

interface HelpProps
	extends Omit<
		EndItemProps,
		| 'icon'
		// Omitting popup trigger aria attributes as Help should not open a Popup - it should open a Panel.
		| 'aria-controls'
		| 'aria-expanded'
		| 'aria-haspopup'
	> {
	/**
	 * The component to render as the badge.
	 * You are recommended to use the Badge component from `@atlaskit/badge`.
	 */
	badge?: ComponentType;
}

/**
 * __Help__
 *
 * The trigger button for the help menu in the top navigation bar.
 */
export const Help = forwardRef<HTMLButtonElement, HelpProps>(function Help(
	{ label, onClick, onMouseEnter, isSelected, testId, interactionName, isListItem, badge },
	ref,
) {
	const sharedProps = {
		icon: HelpIcon,
		label,
		onClick,
		onMouseEnter,
		isSelected,
		testId,
		interactionName,
		ref,
	};

	if (!badge) {
		return <EndItem {...sharedProps} isListItem={isListItem} />;
	}

	return (
		<BadgeContainer
			id={HELP_NOTIFICATION_BADGE_ID}
			badge={badge}
			// We only need to set the list item role on the top level element (BadgeContainer)
			isListItem={isListItem}
		>
			<EndItem
				{...sharedProps}
				// We explicitly set the EndItem to not be a list item,
				// because the BadgeContainer already has a list item role (if `isListItem` is true)
				isListItem={false}
			/>
		</BadgeContainer>
	);
});
