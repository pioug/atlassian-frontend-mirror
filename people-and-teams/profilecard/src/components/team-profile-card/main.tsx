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
import TeamAvatar from '@atlaskit/teams-avatar';
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
	teamInformationStyles: {
		marginLeft: token('space.300'),
		marginTop: token('space.100'),
		marginRight: token('space.300'),
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
		borderRadius: token('border.radius.100'),
		backgroundColor: token('color.background.neutral.subtle'),
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
			<Stack space="space.200" xcss={styles.containerStyles}>
				<Inline spread="space-between" alignBlock="center">
					<Box xcss={styles.avatarImageStyles}>
						<TeamAvatar size="medium" src={avatarImageUrl} />
					</Box>
				</Inline>

				<Stack xcss={styles.teamInformationStyles} space="space.200">
					<Stack>
						<Inline alignBlock="center">
							<Heading size="medium">{displayName}</Heading>
							{isVerified && <VerifiedTeamIcon showTooltip />}
						</Inline>
						<Text color="color.text.subtlest">
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
					{description && (
						<Text color="color.text" maxLines={3}>
							{description}
						</Text>
					)}
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
