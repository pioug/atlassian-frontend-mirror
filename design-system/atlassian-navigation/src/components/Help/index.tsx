import React, { forwardRef, type Ref } from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

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
	const { badge, tooltip, ...iconButtonProps } = props;
	const {
		mode: { navigation },
	} = useTheme();

	const button = (
		<IconButton
			icon={
				<QuestionCircleIcon
					label={typeof tooltip === 'string' ? tooltip : 'Help Icon'}
					secondaryColor={navigation.backgroundColor}
				/>
			}
			ref={ref}
			tooltip={tooltip}
			{...iconButtonProps}
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

export default Help;
