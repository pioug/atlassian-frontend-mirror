import React, { useCallback } from 'react';

import { cssMap } from '@atlaskit/css';
import { LinkItem } from '@atlaskit/menu';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';
import {
	ContainerIcon,
	getContainerProperties,
	type LinkedContainerCardProps,
} from '@atlaskit/teams-public';

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
	const { fireEvent } = useAnalyticsEvents();

	const onClick = useCallback(() => {
		fireEvent('ui.teamConnectionItem.clicked.teamProfileCard', {
			container: containerType,
		});
	}, [containerType, fireEvent]);

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
