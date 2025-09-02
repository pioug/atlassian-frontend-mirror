import React, { useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type ContainerSubTypes, type ContainerTypes } from '../../../common/types';
import { LoomSpaceAvatar } from '../../../common/ui/loom-avatar';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import { getContainerProperties } from '../../../common/utils/get-container-properties';

const messages = defineMessages({
	disconnectTooltip: {
		id: 'ptc-directory.team-containers.disconnect-button.tooltip',
		defaultMessage: 'Disconnect',
		description: 'Tooltip for the disconnect button',
	},
});

const styles = cssMap({
	container: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		borderRadius: token('radius.small', '8px'),
		borderColor: token('color.border.accent.gray'),
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		color: token('color.text'),
	},
	card: {
		alignItems: 'center',
		width: '100%',
	},
	iconWrapper: {
		width: '32px',
		height: '32px',
		minWidth: '32px',
		minHeight: '32px',
	},
	crossIconWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
	},
	linkIconWrapper: {
		width: '34px',
		height: '34px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: token('radius.small', '8px'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		backgroundColor: token('elevation.surface.sunken'),
	},
});

export interface LinkedContainerCardProps {
	containerType: ContainerTypes;
	title: string;
	containerId?: string;
	containerIcon?: string;
	link?: string;
	onDisconnectButtonClick: () => void;
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	};
}

interface CustomItemComponentPropsWithHref {
	href: string;
	handleMouseEnter: () => void;
	handleMouseLeave: () => void;
	children: React.ReactNode;
}

const LinkedCardWrapper = ({
	children,
	href,
	handleMouseEnter,
	handleMouseLeave,
	containerType,
	containerId,
}: CustomItemComponentPropsWithHref & { containerType: ContainerTypes; containerId?: string }) => {
	const [hovered, setHovered] = useState(false);
	const onMouseEnter = () => {
		handleMouseEnter();
		setHovered(true);
	};
	const { fireUIEvent } = usePeopleAndTeamAnalytics();
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const onMouseLeave = () => {
		handleMouseLeave();
		setHovered(false);
	};
	return (
		<Box
			backgroundColor={hovered ? 'color.background.input.hovered' : 'color.background.input'}
			xcss={styles.container}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			testId="linked-container-card-inner"
		>
			<Link
				href={href}
				appearance="subtle"
				onClick={() => {
					fireUIEvent(createAnalyticsEvent, {
						action: AnalyticsAction.CLICKED,
						actionSubject: 'container',
						actionSubjectId: 'teamContainer',
						attributes: { containerSelected: { container: containerType, containerId } },
					});
				}}
			>
				{children}
			</Link>
		</Box>
	);
};

const getContainerIcon = (containerType: ContainerTypes, title: string, containerIcon?: string) => {
	if (containerType === 'LoomSpace') {
		return <LoomSpaceAvatar spaceName={title} size={'large'} />;
	}
	return (
		<Avatar appearance="square" size="medium" src={containerIcon} testId="linked-container-icon" />
	);
};

export const LinkedContainerCard = ({
	containerType,
	title,
	containerIcon,
	link,
	containerId,
	containerTypeProperties,
	onDisconnectButtonClick,
}: LinkedContainerCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { description, icon, containerTypeText } = getContainerProperties({
		containerType,
		iconSize: fg('enable_medium_size_icons_for_team_link_cards') ? 'medium' : 'small',
		containerTypeProperties,
	});

	const [showCloseIcon, setShowCloseIcon] = useState(false);
	const { formatMessage } = useIntl();
	const { fireUIEvent } = usePeopleAndTeamAnalytics();

	return (
		<LinkedCardWrapper
			href={link || '#'}
			handleMouseEnter={() => setShowCloseIcon(true)}
			handleMouseLeave={() => setShowCloseIcon(false)}
			containerType={containerType}
			containerId={containerId}
		>
			<Inline space="space.100" xcss={styles.card}>
				{getContainerIcon(containerType, title, containerIcon)}

				<Stack
					{...(fg('enable_medium_size_icons_for_team_link_cards') ? { space: 'space.025' } : {})}
				>
					<Text maxLines={1} weight="medium" color="color.text">
						{title}
					</Text>
					<Flex gap="space.050" alignItems="center">
						{icon}
						<Inline space="space.050">
							<Text size="small" color="color.text.subtle">
								{description}
							</Text>
							<Text size="small" color="color.text.subtle">
								{containerTypeText}
							</Text>
						</Inline>
					</Flex>
				</Stack>
				{showCloseIcon && (
					<Box xcss={styles.crossIconWrapper}>
						<Tooltip content={formatMessage(messages.disconnectTooltip)} position="top">
							<IconButton
								label={`disconnect the container ${title}`}
								appearance="subtle"
								icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
								spacing="compact"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onDisconnectButtonClick();
									fireUIEvent(createAnalyticsEvent, {
										action: AnalyticsAction.CLICKED,
										actionSubject: 'button',
										actionSubjectId: 'containerUnlinkButton',
									});
								}}
							/>
						</Tooltip>
					</Box>
				)}
			</Inline>
		</LinkedCardWrapper>
	);
};
