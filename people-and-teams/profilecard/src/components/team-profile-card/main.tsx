/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import AvatarGroup, { type AvatarProps } from '@atlaskit/avatar-group';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import LinkItem from '@atlaskit/menu/link-item';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import TeamAvatar from '@atlaskit/teams-avatar';
import { type TeamContainer, TeamContainers, useTeamContainers } from '@atlaskit/teams-public';
import { token } from '@atlaskit/tokens';

import { fireEvent } from '../../util/analytics';
import TeamAppTile from '../common/assets/TeamAppTile.svg';

import { TeamActions, type TeamActionsProps } from './team-actions';
import { TeamConnections } from './team-connections/main';
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
		height: '50px',
		width: '100%',
	},
	teamInformationStyles: {
		marginLeft: token('space.300'),
		marginTop: token('space.100'),
		marginRight: token('space.300'),
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
});

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
	}, [createAnalyticsEvent, fireEventNext]);

	return (
		<Box xcss={styles.wrapperStyles} testId={`team-card-${teamId}`}>
			<Box
				as="img"
				src={headerImageUrl}
				xcss={styles.headerImageStyles}
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
									ContainerCard: TeamConnections,
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
};
