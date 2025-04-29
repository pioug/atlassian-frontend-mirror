import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { LinkButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { fireEvent } from '../../../util/analytics';

import { messages } from './messages';
import { ActionItem, MoreActions } from './more-actions';

const GIVE_KUDOS_ACTION_ID = 'give-kudos';

const styles = cssMap({
	containerStyles: {
		borderTopWidth: token('border.width'),
		borderTopStyle: 'solid',
		borderTopColor: token('color.border'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
		paddingTop: token('space.200'),
	},
	actionContainerStyles: {
		flexGrow: 1,
	},
});

type ButtonSectionProps = {
	teamProfileUrl?: string;
	isKudosEnabled?: boolean;
	otherActions?: ActionItem[];
};

export const ButtonSection = ({
	teamProfileUrl,
	isKudosEnabled,
	otherActions,
}: ButtonSectionProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { formatMessage } = useIntl();

	const onTeamProfileClick = useCallback(() => {
		if (createAnalyticsEvent) {
			fireEvent(createAnalyticsEvent, {
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'viewTeamProfileButton',
				attributes: {},
			});
		}
	}, [createAnalyticsEvent]);

	const extraActions: ActionItem[] = [];
	if (isKudosEnabled) {
		extraActions.push({
			id: GIVE_KUDOS_ACTION_ID,
			item: <ButtonItem>{formatMessage(messages.giveKudos)}</ButtonItem>,
		});
	}
	if (otherActions) {
		extraActions.push(...otherActions);
	}

	return (
		<Stack xcss={styles.containerStyles}>
			<Inline space="space.050">
				{teamProfileUrl && (
					<Box xcss={styles.actionContainerStyles}>
						<LinkButton
							onClick={onTeamProfileClick}
							href={teamProfileUrl}
							target="_blank"
							shouldFitContainer
						>
							{formatMessage(messages.viewProfile)}
						</LinkButton>
					</Box>
				)}
				{extraActions.length > 0 && <MoreActions actions={extraActions} />}
			</Inline>
		</Stack>
	);
};
