/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo } from 'react';

import { FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import AvatarGroup, { type AvatarProps } from '@atlaskit/avatar-group';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import LinkItem from '@atlaskit/menu/link-item';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline, Pressable, Stack, Text } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import TeamAvatar from '@atlaskit/teams-avatar';
import { type TeamContainer, TeamContainers, useTeamContainers } from '@atlaskit/teams-public';
import { token } from '@atlaskit/tokens';

import { fireEvent } from '../../util/analytics';
import TeamAppTile from '../common/assets/TeamAppTile.svg';

import { TeamActions, type TeamActionsProps } from './team-actions';
import { NewTeamConnections, TeamConnections } from './team-connections/main';
import { TeamContainersSkeleton } from './team-containers-skeleton';

const noop = () => {};

const styles = cssMap({
	wrapperStyles: {
		display: 'flex',
		flexDirection: 'column',
		borderRadius: token('radius.large'),
		width: '360px',
		minWidth: '340px',
		height: 'auto',
		transition: 'box-shadow 0.25s ease-in-out',
		overflow: 'hidden',
	},
	containerStyles: {
		marginBottom: token('space.200'),
	},
	avatarImageStyles: {
		position: 'absolute',
		marginLeft: token('space.300'),
	},
	headerImageStyles: {
		objectFit: 'cover',
		verticalAlign: 'top',
		height: '100px',
		width: '100%',
	},
	newHeaderImageStyles: {
		objectFit: 'cover',
		verticalAlign: 'top',
		height: '50px',
		width: '100%',
	},
	teamInformationStyles: {
		marginLeft: token('space.300'),
		marginTop: token('space.100'),
		marginRight: token('space.300'),
	},
	teamConnectionHeaderStyles: {
		marginLeft: token('space.100'),
		marginRight: token('space.100'),
		maxHeight: '265px',
		overflowY: 'auto',
	},
	teamConnectionContainerStyles: {
		marginLeft: token('space.100'),
		marginRight: token('space.100'),
	},
	teamConnectionStyles: {
		marginLeft: token('space.100'),
		marginRight: token('space.100'),
	},
	teamConnectionItemsStyles: {
		maxHeight: '265px',
		overflowY: 'auto',
	},
	connectionTitleStyles: {
		marginLeft: token('space.200'),
		marginTop: token('space.050'),
		marginRight: token('space.200'),
		marginBottom: token('space.075'),
		color: token('color.text.subtle'),
		font: token('font.heading.xxsmall'),
	},
	teamAppTileStyles: {
		marginLeft: 'auto',
		height: '16px',
		width: '16px',
	},
	viewProfileContainerStyles: {
		alignItems: 'center',
		borderTopWidth: token('border.width'),
		borderTopStyle: 'solid',
		borderTopColor: token('color.border'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
	},
	viewProfileButtonStyles: {
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtle'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		width: '100%',
		height: '30px',
		marginTop: token('space.200'),
	},
});

const TeamCardWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => (
	<Box xcss={styles.wrapperStyles} testId={`team-card-${id}`}>
		{children}
	</Box>
);

const HeaderImage = ({ srcUrl }: { srcUrl: string }) => (
	<Box
		as="img"
		src={srcUrl}
		xcss={styles.headerImageStyles}
		testId="profile-header-image"
		alt="team-header-image"
	/>
);

export type TeamProfileCardProps = {
	containerId: string;
	// this is Team Ari
	teamId: string;
	displayName: string;
	description: string;
	avatarImageUrl: string;
	headerImageUrl: string;
	memberAvatars: AvatarProps[];
	memberCount: number | string;
	cloudId: string;
	userId: string;
	isVerified?: boolean;
	teamProfileUrl?: string;
} & TeamActionsProps;

export const TeamProfileCard = ({
	containerId,
	teamId,
	displayName,
	description,
	avatarImageUrl,
	headerImageUrl,
	memberAvatars,
	memberCount,
	cloudId,
	userId,
	isVerified,
	teamProfileUrl,
	...props
}: TeamProfileCardProps) => {
	const { teamContainers, loading } = useTeamContainers(teamId);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { fireEvent: fireEventNext } = useAnalyticsEventsNext();
	// Ensure that the current container is not the only connection for this team before showing the "Where we work" section
	const hasOtherTeamConnections = useMemo(
		() =>
			teamContainers.filter((tc: TeamContainer) => tc.id === containerId).length <
			teamContainers.length,
		[containerId, teamContainers],
	);

	// TODO: set isNewLayout to be true when clean up 'team-bi-directional-container-connection' experiment
	const isNewLayout = Boolean(props.isKudosEnabled || props.otherActions);

	const onClick = useCallback(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			fireEventNext('ui.button.clicked.viewTeamProfileButton', {});
		} else {
			if (createAnalyticsEvent) {
				fireEvent(createAnalyticsEvent, {
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'viewTeamProfileButton',
					attributes: {},
				});
			}
		}

		if (!isNewLayout) {
			window.open(teamProfileUrl, '_blank');
		}
	}, [createAnalyticsEvent, teamProfileUrl, isNewLayout, fireEventNext]);

	if (isNewLayout) {
		return (
			<Box xcss={styles.wrapperStyles} testId={`team-card-${teamId}`}>
				<Box
					as="img"
					src={headerImageUrl}
					xcss={styles.newHeaderImageStyles}
					testId="profile-header-image"
					alt="team-header-image"
				/>
				<Stack space="space.200" xcss={styles.containerStyles}>
					<Inline spread="space-between" alignBlock="center">
						<Box xcss={styles.avatarImageStyles}>
							<TeamAvatar size="medium" src={avatarImageUrl} />
						</Box>
					</Inline>

					<Stack xcss={styles.teamInformationStyles} space="space.200">
						<Flex justifyContent="space-between">
							<Stack space="space.050">
								<Inline alignBlock="center">
									<Heading size="medium">{displayName}</Heading>
									{isVerified && <VerifiedTeamIcon showTooltip />}
								</Inline>
								<Text color="color.text.subtlest">
									{typeof memberCount === 'string' ? (
										<FormattedMessage
											defaultMessage="Contributing team &bull; {memberCount} members"
											values={{ memberCount }}
											id="people-and-teams.team-profile-card.large-member-count"
										/>
									) : (
										<FormattedMessage
											defaultMessage="Contributing team &bull; {count, plural, one {# member} other {# members}}"
											values={{ count: memberCount }}
											id="people-and-teams.team-profile-card.member-count"
										/>
									)}
								</Text>
							</Stack>
							<TeamActions cloudId={cloudId} teamId={teamId} {...props} />
						</Flex>
						<Inline>
							<AvatarGroup appearance="stack" data={memberAvatars} />
						</Inline>
						{description && (
							<Text color="color.text" maxLines={3}>
								{description}
							</Text>
						)}
					</Stack>
					<Box xcss={styles.teamConnectionStyles}>
						<Box xcss={styles.connectionTitleStyles}>
							<FormattedMessage
								defaultMessage="Team links"
								id="people-and-teams.team-profile-card.team-connections"
							/>
						</Box>
						<Box xcss={styles.teamConnectionItemsStyles}>
							<LinkItem
								href={teamProfileUrl}
								target="_blank"
								onClick={onClick}
								description={
									<FormattedMessage
										defaultMessage="Team profile"
										id="people-and-teams.team-profile-card.team-profile-description"
									/>
								}
								iconBefore={<TeamAvatar size="small" src={avatarImageUrl} />}
								iconAfter={
									<Box
										as="img"
										src={TeamAppTile}
										testId="team-app-tile"
										alt="team-app-tile"
										xcss={styles.teamAppTileStyles}
									/>
								}
								testId="team-profile-card-profile-link-item"
							>
								<Text maxLines={1} color="color.text">
									{displayName}
								</Text>
							</LinkItem>
							{(loading || hasOtherTeamConnections) && (
								<TeamContainers
									teamId={teamId}
									onAddAContainerClick={noop}
									userId={userId}
									cloudId={cloudId}
									components={{
										ContainerCard: NewTeamConnections,
										TeamContainersSkeleton: TeamContainersSkeleton,
									}}
									filterContainerId={containerId}
									isDisplayedOnProfileCard
									maxNumberOfContainersToShow={loading ? 0 : 9}
								/>
							)}
						</Box>
					</Box>
				</Stack>
			</Box>
		);
	}

	return (
		<TeamCardWrapper id={teamId}>
			<HeaderImage srcUrl={headerImageUrl} />
			<Stack space="space.200" xcss={styles.containerStyles}>
				<Inline spread="space-between" alignBlock="center">
					<Box xcss={styles.avatarImageStyles}>
						<TeamAvatar size="medium" src={avatarImageUrl} />
					</Box>
				</Inline>

				<Stack xcss={styles.teamInformationStyles} space="space.200">
					<Stack space="space.050">
						<Inline alignBlock="center">
							<Heading size="medium">{displayName}</Heading>
							{isVerified && <VerifiedTeamIcon showTooltip />}
						</Inline>
						<Text color="color.text.subtlest">
							{typeof memberCount === 'string' ? (
								<FormattedMessage
									defaultMessage="Contributing team &bull; {memberCount} members"
									values={{ memberCount }}
									id="people-and-teams.team-profile-card.large-member-count"
								/>
							) : (
								<FormattedMessage
									defaultMessage="Contributing team &bull; {count, plural, one {# member} other {# members}}"
									values={{ count: memberCount }}
									id="people-and-teams.team-profile-card.member-count"
								/>
							)}
						</Text>
					</Stack>
					<Inline>
						<AvatarGroup appearance="stack" data={memberAvatars} />
					</Inline>
					{description && (
						<Text color="color.text" maxLines={3}>
							{description}
						</Text>
					)}
				</Stack>
				{(loading || hasOtherTeamConnections) && (
					<Box
						xcss={
							hasOtherTeamConnections
								? styles.teamConnectionHeaderStyles
								: styles.teamConnectionContainerStyles
						}
					>
						{hasOtherTeamConnections && (
							<Box xcss={styles.connectionTitleStyles}>
								<FormattedMessage
									defaultMessage="Where we work"
									id="people-and-teams.team-profile-card.team-connections-header"
								/>
							</Box>
						)}
						<TeamContainers
							teamId={teamId}
							onAddAContainerClick={noop}
							userId={userId}
							cloudId={cloudId}
							components={{
								ContainerCard: TeamConnections,
								TeamContainersSkeleton: TeamContainersSkeleton,
							}}
							filterContainerId={containerId}
							isDisplayedOnProfileCard
						/>
					</Box>
				)}
				{teamProfileUrl && (
					<Stack xcss={styles.viewProfileContainerStyles}>
						<Pressable
							onClick={onClick}
							xcss={styles.viewProfileButtonStyles}
							testId="view-profile-button"
						>
							<FormattedMessage
								defaultMessage="View profile"
								id="people-and-teams.team-profile-card.view-profile"
							/>
						</Pressable>
					</Stack>
				)}
			</Stack>
		</TeamCardWrapper>
	);
};
