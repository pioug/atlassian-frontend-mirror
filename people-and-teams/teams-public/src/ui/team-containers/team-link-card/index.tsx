import React, { useState } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { cssMap, cx } from '@atlaskit/css';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { Anchor, Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import { token } from '@atlaskit/tokens';

import { type ContainerSubTypes, type ContainerTypes } from '../../../common/types';
import { ContainerIcon } from '../../../common/ui/container-icon';
import { Separator } from '../../../common/ui/separator';
import { TeamLinkCardActions } from '../../../common/ui/team-link-card-actions';
import { getContainerProperties } from '../../../common/utils/get-container-properties';
import { getDomainFromLinkUri } from '../../../common/utils/get-domain-from-link-uri';
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
	openInNewTab,
	isReadOnly,
	hideSubTextIcon,
}: TeamLinkCardProps): React.JSX.Element => {
	const { description, icon, containerTypeText } = getContainerProperties({
		containerType,
		iconSize: 'medium',
		containerTypeProperties,
	});

	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showKeyboardFocus, setShowKeyboardFocus] = useState(false);
	const { formatMessage } = useIntl();
	const { fireEvent } = useAnalyticsEvents();
	const isOpenWebLinkInNewTabEnabled = containerType === 'WebLink';

	const handleMouseEnter = () => {
		if (isReadOnly) {
			return;
		}
		setHovered(true);
	};

	const handleFocus = () => {
		if (isReadOnly) {
			return;
		}
		setFocused(true);
	};

	const handleBlur = () => {
		setFocused(false);
	};

	const handleMouseLeave = () => {
		setHovered(false);
	};

	const handleIconClick = () => {
		setShowKeyboardFocus(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ' || e.key === 'Tab' || e.key === 'Escape') {
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

		fireEvent('ui.container.clicked.teamContainer', attributes);

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
				/>
				<Anchor
					xcss={cx(
						styles.anchor,
						styles.anchorNoUnderline,
						isOpenWebLinkInNewTabEnabled && styles.anchorWithExternalLinkIcon,
					)}
					href={link || '#'}
					onClick={handleLinkClick}
					testId="team-link-card-linkable-content"
					target={isOpenWebLinkInNewTabEnabled ? '_blank' : '_self'}
				>
					<Stack>
						<TeamLinkCardTitle
							isTeamLensInHomeEnabled
							isOpenWebLinkInNewTabEnabled={isOpenWebLinkInNewTabEnabled}
							link={link || '#'}
							handleLinkClick={handleLinkClick}
							title={title}
						/>
						<Flex gap="space.050" alignItems="center">
							{!hideSubTextIcon ? icon : null}
							<Inline space="space.050" alignBlock="center">
								{renderContainerTypeTextWithSeparator(containerTypeText, description)}
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
			</Inline>
		</Box>
	);
};

const messages = defineMessages({
	linkExternalIconLabel: {
		id: 'ptc-directory.team-containers.link-external-icon-label',
		defaultMessage: 'Open link in new tab',
		description:
			'Accessible label for the external link icon on team link cards that opens in a new tab',
	},
});
