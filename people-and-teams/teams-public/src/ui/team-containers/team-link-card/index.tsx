import React, { useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import CrossIcon from '@atlaskit/icon/core/close';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type ContainerSubTypes, type ContainerTypes } from '../../../common/types';
import { ContainerIcon } from '../../../common/ui/container-icon';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import { getContainerProperties } from '../../../common/utils/get-container-properties';
import { getDomainFromLinkUri } from '../../../common/utils/get-link-domain';

const styles = cssMap({
	container: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		borderRadius: token('border.radius.100', '8px'),
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
	showMoreIconWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
	},
	linkableContent: {
		flex: '1',
	},
});

export interface TeamLinkCardProps {
	containerType: ContainerTypes;
	title: string;
	containerId?: string;
	containerIcon?: string;
	link?: string;
	onDisconnectButtonClick: () => void;
	onEditLinkClick?: () => void;
	containerTypeProperties?: {
		subType?: ContainerSubTypes;
		name?: string;
	};
	iconsLoading?: boolean;
	iconHasLoaded?: boolean;
}

export const TeamLinkCard = ({
	containerType,
	title,
	containerIcon,
	link,
	containerId,
	containerTypeProperties,
	onDisconnectButtonClick,
	onEditLinkClick,
	iconsLoading,
	iconHasLoaded,
}: TeamLinkCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { description, icon, containerTypeText } = getContainerProperties({
		containerType,
		iconSize: 'medium',
		containerTypeProperties,
	});

	const [hovered, setHovered] = useState(false);
	const [showCloseIcon, setShowCloseIcon] = useState(false);
	const [showMoreIcon, setShowMoreIcon] = useState(false);
	const { formatMessage } = useIntl();
	const { fireUIEvent } = usePeopleAndTeamAnalytics();

	const handleMouseEnter = () => {
		setHovered(true);
		if (containerType === 'WebLink') {
			setShowMoreIcon(true);
		} else {
			setShowCloseIcon(true);
		}
	};

	const handleMouseLeave = () => {
		setHovered(false);
		if (containerType === 'WebLink') {
			setShowMoreIcon(false);
		} else {
			setShowCloseIcon(false);
		}
	};

	const handleLinkClick = () => {
		const baseAttributes = { container: containerType, containerId };
		const attributes =
			containerType === 'WebLink' && link
				? { containerSelected: { ...baseAttributes, linkDomain: getDomainFromLinkUri(link) } }
				: { containerSelected: baseAttributes };
		fireUIEvent(createAnalyticsEvent, {
			action: AnalyticsAction.CLICKED,
			actionSubject: 'container',
			actionSubjectId: 'teamContainer',
			attributes,
		});
	};

	return (
		<Box
			backgroundColor={hovered ? 'color.background.input.hovered' : 'color.background.input'}
			xcss={styles.container}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			testId="team-link-card-inner"
		>
			<Inline space="space.100" xcss={styles.card}>
				<ContainerIcon
					containerType={containerType}
					title={title}
					containerIcon={containerIcon}
					size="medium"
					iconsLoading={iconsLoading}
					iconHasLoaded={iconHasLoaded}
				/>
				<Box xcss={styles.linkableContent} testId="team-link-card-linkable-content">
					<Link href={link || '#'} appearance="subtle" onClick={handleLinkClick}>
						<Stack space="space.025">
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
					</Link>
				</Box>
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
										attributes: { containerSelected: { container: containerType, containerId } },
									});
								}}
							/>
						</Tooltip>
					</Box>
				)}
				{showMoreIcon && (
					<Box xcss={styles.showMoreIconWrapper}>
						<DropdownMenu
							trigger={({ triggerRef, ...triggerProps }) => (
								<IconButton
									ref={triggerRef}
									{...triggerProps}
									label={`more options for ${title}`}
									appearance="subtle"
									icon={(iconProps) => <ShowMoreHorizontalIcon {...iconProps} size="small" />}
									spacing="compact"
								/>
							)}
							placement="bottom-end"
							shouldRenderToParent={fg('should-render-to-parent-should-be-true-people-and-')}
						>
							<DropdownItemGroup>
								<DropdownItem
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onEditLinkClick?.();
										fireUIEvent(createAnalyticsEvent, {
											action: AnalyticsAction.CLICKED,
											actionSubject: 'button',
											actionSubjectId: 'containerEditLinkButton',
											attributes: { containerSelected: { container: containerType, containerId } },
										});
									}}
								>
									{formatMessage(messages.editLink)}
								</DropdownItem>
								<DropdownItem
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onDisconnectButtonClick();
										fireUIEvent(createAnalyticsEvent, {
											action: AnalyticsAction.CLICKED,
											actionSubject: 'button',
											actionSubjectId: 'containerUnlinkButton',
											attributes: { containerSelected: { container: containerType, containerId } },
										});
									}}
								>
									{formatMessage(messages.removeLink)}
								</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</Box>
				)}
			</Inline>
		</Box>
	);
};

const messages = defineMessages({
	disconnectTooltip: {
		id: 'ptc-directory.team-containers.disconnect-button.tooltip',
		defaultMessage: 'Disconnect',
		description: 'Tooltip for the disconnect button',
	},
	editLink: {
		id: 'ptc-directory.team-containers.edit-link',
		defaultMessage: 'Edit link',
		description: 'Edit link option in dropdown',
	},
	removeLink: {
		id: 'ptc-directory.team-containers.remove-link',
		defaultMessage: 'Remove',
		description: 'Remove link option in dropdown',
	},
});
