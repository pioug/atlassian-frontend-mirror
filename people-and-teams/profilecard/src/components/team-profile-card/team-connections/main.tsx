import React, { useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { cssMap } from '@atlaskit/css';
import { LinkItem } from '@atlaskit/menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import {
	ContainerIcon,
	getContainerProperties,
	type LinkedContainerCardProps,
} from '@atlaskit/teams-public';

import { fireEvent } from '../../../util/analytics';

const styles = cssMap({
	containerTypeIconButtonStyles: {
		marginLeft: 'auto',
		height: '16px',
		width: '16px',
	},
});

export const TeamConnections = ({
	containerType,
	title,
	containerIcon,
	link,
}: LinkedContainerCardProps): React.JSX.Element => {
	const { description, icon, containerTypeText } = getContainerProperties({
		containerType,
		iconSize: 'medium',
		isDisplayedOnProfileCard: true,
	});
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { fireEvent: fireEventNext } = useAnalyticsEventsNext();

	const onClick = useCallback(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			fireEventNext('ui.teamConnectionItem.clicked.teamProfileCard', {
				container: containerType,
			});
		} else {
			fireEvent(createAnalyticsEvent, {
				action: 'clicked',
				actionSubject: 'teamConnectionItem',
				actionSubjectId: 'teamProfileCard',
				attributes: { container: containerType },
			});
		}
	}, [containerType, createAnalyticsEvent, fireEventNext]);

	return (
		<LinkItem
			href={link}
			onClick={onClick}
			target="_blank"
			description={
				<Inline space="space.050">
					<Text size="small" color="color.text.subtlest">
						{description}
					</Text>
					<Text size="small" color="color.text.subtlest">
						{containerTypeText}
					</Text>
				</Inline>
			}
			iconBefore={
				<ContainerIcon
					containerType={containerType}
					title={title}
					containerIcon={containerIcon}
					size="small"
				/>
			}
			iconAfter={
				<Box
					backgroundColor={'color.background.neutral.subtle'}
					xcss={styles.containerTypeIconButtonStyles}
					testId="container-type-icon"
				>
					{icon}
				</Box>
			}
			testId="team-connection-item"
		>
			<Text maxLines={1} color="color.text">
				{title}
			</Text>
		</LinkItem>
	);
};
