/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import AvatarGroup, { type AvatarProps } from '@atlaskit/avatar-group';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';
import { Box, Inline, Pressable, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapperStyles: {
		display: 'flex',
		flexDirection: 'column',
		borderRadius: token('border.radius.200'),
		width: '340px',
		minWidth: '340px',
		height: 'auto',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		transition: 'box-shadow 0.25s ease-in-out',
		overflow: 'hidden',
	},
	containerStyles: {
		marginBottom: token('space.200'),
	},
	avatarImageContainerStyles: {
		position: 'absolute',
		marginLeft: token('space.150'),
	},
	avatarImageStyles: {
		position: 'absolute',
		marginLeft: token('space.150'),
		borderRadius: token('border.radius.100'),
		height: '64px',
		width: '64px',
	},
	headerImageStyles: {
		objectFit: 'cover',
		verticalAlign: 'top',
		maxHeight: '100px',
		width: '100%',
	},
	teamInformationStyles: {
		marginLeft: token('space.150'),
		marginTop: token('space.400'),
		marginRight: token('space.150'),
	},
	viewProfileContainerStyles: {
		alignItems: 'center',
		borderTopWidth: token('border.width'),
		borderTopStyle: 'solid',
		borderTopColor: token('color.border'),
	},
	viewProfileButtonStyles: {
		borderRadius: token('border.radius.100'),
		backgroundColor: token('color.background.neutral.subtle'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		width: '80%',
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

const TeamAvatar = ({ avatarUrl }: { avatarUrl: string }) => (
	<Box as="img" src={avatarUrl} xcss={styles.avatarImageStyles} alt="team-avatar-image" />
);

interface TeamProfileCardProps {
	teamId: string;
	displayName: string;
	description: string;
	avatarImageUrl: string;
	headerImageUrl: string;
	memberAvatars: AvatarProps[];
	memberCount: number;
	isVerified?: boolean;
	teamProfileUrl?: string;
}

export const TeamProfileCard = ({
	teamId,
	displayName,
	description,
	avatarImageUrl,
	headerImageUrl,
	memberAvatars,
	memberCount,
	isVerified,
	teamProfileUrl,
}: TeamProfileCardProps) => {
	return (
		<TeamCardWrapper id={teamId}>
			<HeaderImage srcUrl={headerImageUrl} />
			<Stack space="space.150" xcss={styles.containerStyles}>
				<Inline spread="space-between" alignBlock="center">
					<TeamAvatar avatarUrl={avatarImageUrl} />
				</Inline>
				<Stack xcss={styles.teamInformationStyles} space="space.150">
					<Stack space="space.150">
						<Inline alignBlock="center">
							<Heading size="small">{displayName}</Heading>
							{isVerified && <VerifiedTeamIcon showTooltip />}
						</Inline>
						<Text color="color.text.subtle">
							<FormattedMessage
								defaultMessage="Contributing team &bull; {count, plural, one {# member} other {# members}}"
								values={{ count: memberCount }}
								id="people-and-teams.team-profile-card.member-count"
							/>
						</Text>
					</Stack>
					<Inline>
						<AvatarGroup appearance="stack" data={memberAvatars} />
					</Inline>
					<Stack space="space.050">
						<Text color="color.text.subtle" maxLines={3}>
							{description}
						</Text>
					</Stack>
				</Stack>
				{teamProfileUrl && (
					<Stack xcss={styles.viewProfileContainerStyles}>
						<Pressable
							onClick={() => window.open(teamProfileUrl, '_blank')}
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
