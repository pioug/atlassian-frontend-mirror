import React, { useState } from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import CrossIcon from '@atlaskit/icon/core/cross';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type ContainerSubTypes, type ContainerTypes } from '../../../common/types';
import { ContainerIcon } from '../../../common/ui/container-icon';
import { Separator } from '../../../common/ui/separator';
import { TeamLinkCardActions } from '../../../common/ui/team-link-card-actions';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import { getContainerProperties } from '../../../common/utils/get-container-properties';
import { getIsExperimentEnabled } from '../../../common/utils/get-is-experiment-enabled';
import { getDomainFromLinkUri } from '../../../common/utils/get-link-domain';

import { TeamLinkCardTitle } from './team-link-card-title';

const styles = cssMap({
	container: {
		outlineWidth: token('border.width'),
		outlineColor: token('color.border'),
		outlineStyle: 'solid',
		borderRadius: token('radius.small', '8px'),
		borderColor: token('color.border.accent.gray'),
		paddingTop: token('space.150'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
		color: token('color.text'),
		backgroundColor: token('elevation.surface.raised'),
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
	},
	card: {
		alignItems: 'center',
		width: '100%',
	},
	anchor: {
		textDecoration: 'none',
		borderRadius: token('radius.small', '8px'),
		width: '100%',
		color: token('color.text'),
		'&:focus': {
			outlineWidth: token('border.width.focused'),
			outlineColor: token('color.border.focused'),
			outlineStyle: 'solid',
			outlineOffset: token('space.025'),
		},
		'&:hover': {
			color: token('color.text'),
		},
		'&:visited': {
			color: token('color.text'),
		},
	},
	anchorNoUnderline: {
		textDecoration: 'none',
		'&:hover': {
			color: token('color.text'),
			textDecoration: 'none',
		},
	},
	anchorWithExternalLinkIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
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
	externalLinkIconWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginLeft: token('space.100'),
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
	openInNewTab?: boolean;
	isReadOnly?: boolean;
	hideSubTextIcon?: boolean;
}

const renderContainerTypeTextWithSeparator = (
	containerTypeText: React.ReactNode,
	description: React.ReactNode,
) => {
	return (
		<>
			{containerTypeText && (
				<Text size="small" color="color.text.subtle">
					{containerTypeText}
				</Text>
			)}
			{containerTypeText && description && <Separator />}
			{description && (
				<Text size="small" color="color.text.subtle">
					{description}
				</Text>
			)}
		</>
	);
};

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
	openInNewTab,
	isReadOnly,
	hideSubTextIcon,
}: TeamLinkCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { description, icon, containerTypeText } = getContainerProperties({
		containerType,
		iconSize: 'medium',
		containerTypeProperties,
	});

	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [showCloseIcon, setShowCloseIcon] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showKeyboardFocus, setShowKeyboardFocus] = useState(false);
	const { formatMessage } = useIntl();
	const { fireUIEvent } = usePeopleAndTeamAnalytics();
	const { fireEvent } = useAnalyticsEventsNext();
	const isTeamLensInHomeEnabled: boolean = getIsExperimentEnabled('team_lens_in_atlassian_home');
	const isNewTeamProfilePageEnabled = FeatureGates.getExperimentValue(
		'new_team_profile',
		'isEnabled',
		false,
	);
	const isOpenWebLinkInNewTabEnabled =
		containerType === 'WebLink' && (isNewTeamProfilePageEnabled || isTeamLensInHomeEnabled);

	const handleMouseEnter = () => {
		if (isReadOnly) {
			return;
		}
		setHovered(true);
		if (containerType !== 'WebLink') {
			setShowCloseIcon(true);
		}
	};

	const handleFocus = () => {
		if (isReadOnly) {
			return;
		}
		setFocused(true);
		if (containerType !== 'WebLink') {
			setShowCloseIcon(true);
		}
	};

	const handleBlur = () => {
		setFocused(false);
		if (containerType !== 'WebLink' && !hovered) {
			setShowCloseIcon(false);
		}
	};

	const handleMouseLeave = () => {
		setHovered(false);
		if (containerType !== 'WebLink' && !focused) {
			setShowCloseIcon(false);
		}
	};

	const handleIconClick = () => {
		if (fg('fix_team_link_card_a11y')) {
			setShowKeyboardFocus(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (
			(e.key === 'Enter' || e.key === ' ' || e.key === 'Tab' || e.key === 'Escape') &&
			fg('fix_team_link_card_a11y')
		) {
			setShowKeyboardFocus(true);
		}
	};

	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.stopPropagation();
		const baseAttributes = { container: containerType, containerId };
		const attributes =
			containerType === 'WebLink' && link
				? { containerSelected: { ...baseAttributes, linkDomain: getDomainFromLinkUri(link) } }
				: { containerSelected: baseAttributes };

		if (fg('ptc-enable-teams-public-analytics-refactor')) {
			fireEvent('ui.container.clicked.teamContainer', attributes);
		} else {
			fireUIEvent(createAnalyticsEvent, {
				action: AnalyticsAction.CLICKED,
				actionSubject: 'container',
				actionSubjectId: 'teamContainer',
				attributes,
			});
		}

		if (openInNewTab || isOpenWebLinkInNewTabEnabled) {
			e.preventDefault();
			window.open(link || '#', '_blank', 'noopener, noreferrer');
		}
	};

	return (
		<Box
			xcss={styles.container}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			testId="team-link-card-inner"
		>
			<Inline space="space.150" xcss={styles.card}>
				<ContainerIcon
					containerType={containerType}
					title={title}
					containerIcon={containerIcon}
					size="medium"
					iconsLoading={iconsLoading}
					iconHasLoaded={iconHasLoaded}
				/>
				{fg('fix_team_link_card_a11y') ? (
					<>
						<Anchor
							xcss={cx(
								styles.anchor,
								isTeamLensInHomeEnabled && styles.anchorNoUnderline,
								isOpenWebLinkInNewTabEnabled && styles.anchorWithExternalLinkIcon,
							)}
							href={link || '#'}
							onClick={handleLinkClick}
							testId="team-link-card-linkable-content"
							target={isOpenWebLinkInNewTabEnabled ? '_blank' : '_self'}
						>
							<Stack>
								<TeamLinkCardTitle
									isTeamLensInHomeEnabled={isTeamLensInHomeEnabled}
									isOpenWebLinkInNewTabEnabled={isOpenWebLinkInNewTabEnabled}
									link={link || '#'}
									handleLinkClick={handleLinkClick}
									title={title}
								/>
								<Flex gap="space.050" alignItems="center">
									{!hideSubTextIcon ? icon : null}
									<Inline space="space.050" alignBlock="center">
										{isNewTeamProfilePageEnabled || isTeamLensInHomeEnabled ? (
											renderContainerTypeTextWithSeparator(containerTypeText, description)
										) : (
											<>
												<Text size="small" color="color.text.subtle">
													{description}
												</Text>
												<Text size="small" color="color.text.subtle">
													{containerTypeText}
												</Text>
											</>
										)}
									</Inline>
								</Flex>
							</Stack>
							{isOpenWebLinkInNewTabEnabled && (
								<Box xcss={styles.externalLinkIconWrapper}>
									<LinkExternalIcon
										label={formatMessage(messages.linkExternalIconLabel)}
										aria-hidden="true"
										size="small"
									/>
								</Box>
							)}
						</Anchor>
						{!isReadOnly && (
							<TeamLinkCardActions
								containerType={containerType}
								title={title}
								containerId={containerId}
								hovered={hovered}
								focused={focused}
								isDropdownOpen={isDropdownOpen}
								showKeyboardFocus={showKeyboardFocus}
								onDisconnectButtonClick={() => {
									handleIconClick();
									onDisconnectButtonClick();
								}}
								onEditLinkClick={() => {
									handleIconClick();
									onEditLinkClick?.();
								}}
								onDropdownOpenChange={setIsDropdownOpen}
							/>
						)}
					</>
				) : (
					<>
						<Box xcss={styles.linkableContent} testId="team-link-card-linkable-content">
							<Link href={link || '#'} appearance="subtle" onClick={handleLinkClick}>
								<Stack>
									<TeamLinkCardTitle
										isTeamLensInHomeEnabled={isTeamLensInHomeEnabled}
										isOpenWebLinkInNewTabEnabled={isOpenWebLinkInNewTabEnabled}
										link={link || '#'}
										handleLinkClick={handleLinkClick}
										title={title}
									/>
									<Flex gap="space.050" alignItems="center">
										{!hideSubTextIcon ? icon : null}
										<Inline space="space.050" alignBlock="center">
											{isNewTeamProfilePageEnabled || isTeamLensInHomeEnabled ? (
												renderContainerTypeTextWithSeparator(containerTypeText, description)
											) : (
												<>
													<Text size="small" color="color.text.subtle">
														{description}
													</Text>
													<Text size="small" color="color.text.subtle">
														{containerTypeText}
													</Text>
												</>
											)}
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
											if (fg('ptc-enable-teams-public-analytics-refactor')) {
												fireEvent('ui.button.clicked.containerUnlinkButton', {
													containerSelected: { container: containerType, containerId },
												});
											} else {
												fireUIEvent(createAnalyticsEvent, {
													action: AnalyticsAction.CLICKED,
													actionSubject: 'button',
													actionSubjectId: 'containerUnlinkButton',
													attributes: {
														containerSelected: { container: containerType, containerId },
													},
												});
											}
										}}
									/>
								</Tooltip>
							</Box>
						)}
						{containerType === 'WebLink' && (hovered || isDropdownOpen) && (
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
									shouldRenderToParent
									onOpenChange={(attrs) => {
										setIsDropdownOpen(attrs.isOpen);
									}}
								>
									<DropdownItemGroup>
										<DropdownItem
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												onEditLinkClick?.();
												if (fg('ptc-enable-teams-public-analytics-refactor')) {
													fireEvent('ui.button.clicked.containerEditLinkButton', {
														containerSelected: { container: containerType, containerId },
													});
												} else {
													fireUIEvent(createAnalyticsEvent, {
														action: AnalyticsAction.CLICKED,
														actionSubject: 'button',
														actionSubjectId: 'containerEditLinkButton',
														attributes: {
															containerSelected: { container: containerType, containerId },
														},
													});
												}
											}}
										>
											{formatMessage(messages.editLink)}
										</DropdownItem>
										<DropdownItem
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												onDisconnectButtonClick();
												if (fg('ptc-enable-teams-public-analytics-refactor')) {
													fireEvent('ui.button.clicked.containerUnlinkButton', {
														containerSelected: { container: containerType, containerId },
													});
												} else {
													fireUIEvent(createAnalyticsEvent, {
														action: AnalyticsAction.CLICKED,
														actionSubject: 'button',
														actionSubjectId: 'containerUnlinkButton',
														attributes: {
															containerSelected: { container: containerType, containerId },
														},
													});
												}
											}}
										>
											{formatMessage(messages.removeLink)}
										</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
							</Box>
						)}
					</>
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
	linkExternalIconLabel: {
		id: 'ptc-directory.team-containers.link-external-icon-label',
		defaultMessage: 'Open link in new tab',
		description: 'Open link in new tab',
	},
});
