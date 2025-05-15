import React, { useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Avatar from '@atlaskit/avatar';
import { cssMap } from '@atlaskit/css';
import { LinkItem } from '@atlaskit/menu';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getContainerProperties, type LinkedContainerCardProps } from '@atlaskit/teams-public';
import { token } from '@atlaskit/tokens';

import { fireEvent } from '../../../util/analytics';

const styles = cssMap({
	containerWrapperStyles: {
		display: 'flex',
		alignItems: 'center',
	},
	containerIconStyles: {
		borderRadius: token('border.radius.100'),
		height: '24px',
		width: '24px',
	},
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
}: LinkedContainerCardProps) => {
	const { description, icon, containerTypeText } = getContainerProperties(containerType, 'medium');
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const onClick = useCallback(() => {
		fireEvent(createAnalyticsEvent, {
			action: 'clicked',
			actionSubject: 'teamConnectionItem',
			actionSubjectId: 'teamProfileCard',
			attributes: { container: containerType },
		});
	}, [containerType, createAnalyticsEvent]);

	return (
		<LinkItem href={link} onClick={onClick}>
			<Inline space="space.100" xcss={styles.containerWrapperStyles}>
				<Box
					as="img"
					src={containerIcon}
					alt=""
					testId="linked-container-icon"
					xcss={styles.containerIconStyles}
				/>
				<Stack>
					<Text maxLines={1} color="color.text">
						{title}
					</Text>
					<Inline space="space.050">
						<Text size="small" color="color.text.subtlest">
							{description}
						</Text>
						<Text size="small" color="color.text.subtlest">
							{containerTypeText}
						</Text>
					</Inline>
				</Stack>
				<Box
					backgroundColor={'color.background.neutral.subtle'}
					xcss={styles.containerTypeIconButtonStyles}
					testId="container-type-icon"
				>
					{icon}
				</Box>
			</Inline>
		</LinkItem>
	);
};

export const NewTeamConnections = ({
	containerType,
	title,
	containerIcon,
	link,
}: LinkedContainerCardProps) => {
	const { description, icon, containerTypeText } = getContainerProperties(containerType, 'medium');
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const onClick = useCallback(() => {
		fireEvent(createAnalyticsEvent, {
			action: 'clicked',
			actionSubject: 'teamConnectionItem',
			actionSubjectId: 'teamProfileCard',
			attributes: { container: containerType },
		});
	}, [containerType, createAnalyticsEvent]);

	return (
		<LinkItem
			href={link}
			onClick={onClick}
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
				<Avatar
					size="small"
					appearance="square"
					src={containerIcon}
					testId="linked-container-icon"
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
		>
			<Text maxLines={1} color="color.text">
				{title}
			</Text>
		</LinkItem>
	);
};
