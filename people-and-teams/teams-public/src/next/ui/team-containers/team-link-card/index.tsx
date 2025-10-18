import React, { useState } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import { token } from '@atlaskit/tokens';

import { type ContainerSubTypes, type ContainerTypes } from '../../../../common/types';
import { ContainerIcon } from '../../../../common/ui/container-icon';
import { Separator } from '../../../../common/ui/separator';
import { TeamLinkCardActions } from '../../../../common/ui/team-link-card-actions';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../../../common/utils/analytics';
import { getContainerProperties } from '../../../../common/utils/get-container-properties';
import { getDomainFromLinkUri } from '../../../../common/utils/get-link-domain';

const styles = cssMap({
	container: {
		paddingTop: token('space.050'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.075'),
		borderRadius: token('radius.small', '4px'),
		color: token('color.text'),
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
			textDecoration: 'none',
		},
		'&:visited': {
			color: token('color.text'),
		},
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
	openInNewTab?: boolean;
	isReadOnly?: boolean;
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
	openInNewTab,
	isReadOnly,
}: TeamLinkCardProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { description, containerTypeText } = getContainerProperties({
		containerType,
		iconSize: 'medium',
		containerTypeProperties,
	});

	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showKeyboardFocus, setShowKeyboardFocus] = useState(false);
	const { fireUIEvent } = usePeopleAndTeamAnalytics();
	const { fireEvent } = useAnalyticsEventsNext();

	const handleMouseEnter = () => {
		setHovered(true);
	};

	const handleFocus = () => {
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

		if (openInNewTab) {
			e.preventDefault();
			window.open(link || '#', '_blank', 'noopener, noreferrer');
		}
	};

	return (
		<Box
			backgroundColor={hovered ? 'elevation.surface.hovered' : 'elevation.surface'}
			xcss={styles.container}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			testId="team-link-card-inner"
		>
			<Inline space="space.100" xcss={styles.card}>
				<ContainerIcon
					containerType={containerType}
					title={title}
					containerIcon={containerIcon}
					size="small"
					iconsLoading={iconsLoading}
					iconHasLoaded={iconHasLoaded}
				/>
				<Anchor
					xcss={styles.anchor}
					href={link || '#'}
					onClick={handleLinkClick}
					testId="team-link-card-linkable-content"
				>
					<Stack space="space.025">
						<Text maxLines={1} color="color.text">
							{title}
						</Text>
						<Flex gap="space.050" alignItems="center">
							<Inline space="space.050">
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
							</Inline>
						</Flex>
					</Stack>
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
