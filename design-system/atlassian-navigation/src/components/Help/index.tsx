import React, { forwardRef, type Ref } from 'react';

import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';

import { useTheme } from '../../theme';
import { BadgeContainer } from '../BadgeContainer';
import { IconButton } from '../IconButton';

import { type HelpProps } from './types';

const HELP_NOTIFICATION_BADGE_ID = 'atlassian-navigation-help-notification-count';

/**
 * __Help__
 *
 * A help button that can be passed into `AtlassianNavigation`'s `renderHelp` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#help)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Help = forwardRef((props: HelpProps, ref: Ref<any>) => {
	const {
		badge,
		component,
		href,
		id,
		isDisabled,
		isSelected,
		label,
		onBlur,
		onClick,
		onFocus,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseUp,
		target,
		testId,
		tooltip,
		...rest
	} = props;
	const {
		mode: { navigation },
	} = useTheme();

	const button = (
		<IconButton
			component={component}
			href={href}
			icon={
				<QuestionCircleIcon
					label={typeof tooltip === 'string' ? tooltip : 'Help Icon'}
					color="currentColor"
					spacing="spacious"
					LEGACY_secondaryColor={navigation.backgroundColor}
				/>
			}
			id={id}
			isDisabled={isDisabled}
			isSelected={isSelected}
			label={label}
			onBlur={onBlur}
			onClick={onClick}
			onFocus={onFocus}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onMouseUp={onMouseUp}
			ref={ref}
			target={target}
			testId={testId}
			tooltip={tooltip}
			// These are all explicit, leaving it in just in case
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
		/>
	);

	return badge ? (
		<BadgeContainer id={HELP_NOTIFICATION_BADGE_ID} badge={badge} role="listitem">
			{button}
		</BadgeContainer>
	) : (
		<div role="listitem">{button}</div>
	);
});
