/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar/Avatar';
import { token } from '@atlaskit/tokens';

import { type ProfileCardWrapper, type User } from '../types';

const agentAvatarStyle = css({
	position: 'relative',
	width: '32px',
	height: '32px',
	flexShrink: 0,
});

const personAvatarStyle = css({
	position: 'absolute',
	top: '18px',
	insetInlineStart: '18px',
	width: '16px',
	height: '16px',
	borderRadius: token('radius.full'),
	boxShadow: `0 0 0 1px ${token('elevation.surface')}`,
});

const personAvatarClipStyle = css({
	width: '16px',
	height: '16px',
	overflow: 'hidden',
	borderRadius: token('radius.full'),
});

const personAvatarShiftStyle = css({
	marginBlockStart: token('space.negative.025'),
	marginBlockEnd: token('space.negative.025'),
	marginInlineStart: token('space.negative.025'),
	marginInlineEnd: token('space.negative.025'),
});

export const AgentReactionAvatar = ({
	user,
	agent,
	ProfileCardWrapper,
}: {
	agent: NonNullable<User['agent']>;
	ProfileCardWrapper?: ProfileCardWrapper;
	user: User;
}): JSX.Element => {
	const profile = user.profilePicture?.path;
	const agentAvatar = (
		<Avatar
			appearance="hexagon"
			size="medium"
			src={agent.avatarUrl}
			name={agent.name}
			borderColor="transparent"
			label=""
			testId="agent-profile"
		/>
	);
	const personAvatar = (
		<div css={personAvatarClipStyle}>
			<div css={personAvatarShiftStyle}>
				<Avatar
					size="xxsmall"
					src={profile}
					name={user.displayName}
					borderColor="transparent"
					label=""
					testId="agent-person-profile"
				/>
			</div>
		</div>
	);
	return (
		<div css={agentAvatarStyle}>
			{ProfileCardWrapper && agent.identityAccountId ? (
				<ProfileCardWrapper
					userId={agent.identityAccountId}
					isAnonymous={false}
					canViewProfile
					position="left-start"
				>
					{agentAvatar}
				</ProfileCardWrapper>
			) : (
				agentAvatar
			)}
			<div css={personAvatarStyle}>
				{ProfileCardWrapper && user.accountId ? (
					<ProfileCardWrapper
						userId={user.accountId}
						isAnonymous={false}
						canViewProfile
						position="left-start"
					>
						{personAvatar}
					</ProfileCardWrapper>
				) : (
					personAvatar
				)}
			</div>
		</div>
	);
};
