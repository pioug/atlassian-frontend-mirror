import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Avatar from '@atlaskit/avatar';
import AvatarGroup, { type AvatarGroupProps } from '@atlaskit/avatar-group';
import Button, { IconButton, LinkButton } from '@atlaskit/button/new';
import FocusRing from '@atlaskit/focus-ring';
import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import { LinkItem, MenuGroup } from '@atlaskit/menu';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { Inline, Text } from '@atlaskit/primitives/compiled';
import { layers } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

import messages from '../../messages';
import { AnimatedKudosButton, AnimationWrapper, KudosBlobAnimation } from '../../styled/Card';
import { ErrorWrapper, TeamErrorText } from '../../styled/Error';
import {
	ActionButtons,
	AvatarSection,
	Description,
	DescriptionWrapper,
	MemberCount,
	MoreButton,
	TeamName,
	WrappedButton,
} from '../../styled/TeamCard';
import { CardContent, CardHeader, CardWrapper } from '../../styled/TeamTrigger';
import type { AnalyticsFunction, ProfileCardAction, Team, TeamProfilecardProps } from '../../types';
import {
	actionClicked,
	errorRetryClicked,
	moreActionsClicked,
	moreMembersClicked,
	profileCardRendered,
	teamAvatarClicked,
} from '../../util/analytics';
import { isBasicClick } from '../../util/click';
import { ErrorIllustration } from '../Error';

import TeamForbiddenErrorState from './TeamForbiddenErrorState';
import TeamLoadingState from './TeamLoadingState';

interface TeamMembers {
	analytics: AnalyticsFunction;
	members?: Team['members'];
	includingYou?: boolean;
}

type TeamMembersProps = TeamMembers &
	Pick<TeamProfilecardProps, 'generateUserLink' | 'onUserClick' | 'isTriggeredByKeyboard'>;

const LARGE_MEMBER_COUNT = 50;
const GIVE_KUDOS_ACTION_ID = 'give-kudos';
const avatarGroupMaxCount = 9;

function onMemberClick(
	callback: TeamMembersProps['onUserClick'],
	userId: string,
	analytics: AnalyticsFunction,
	index: number,
	hasHref: boolean,
) {
	return (event: React.MouseEvent<Element>) => {
		analytics((duration) =>
			teamAvatarClicked({
				duration,
				hasHref,
				hasOnClick: !!callback,
				index,
			}),
		);

		if (callback) {
			callback(userId, event);
		}
	};
}

const TeamMembers = ({
	analytics,
	generateUserLink,
	members,
	onUserClick,
	includingYou,
	isTriggeredByKeyboard,
}: TeamMembersProps) => {
	const { formatMessage } = useIntl();
	const count = members ? members.length : 0;

	const message = includingYou
		? count >= LARGE_MEMBER_COUNT
			? messages.membersMoreThan50IncludingYou
			: messages.memberCountIncludingYou
		: count >= LARGE_MEMBER_COUNT
			? messages.membersMoreThan50
			: messages.memberCount;

	// Use a ref to track whether this is currently open, so we can fire events
	// iff the more section is being opened (not closed).
	const isMoreMembersOpen = useRef(false);
	const avatarRef = useRef<HTMLElement | null>(null);
	const ref = (element: HTMLElement | null) => {
		if (isTriggeredByKeyboard) {
			avatarRef.current = element;
			avatarRef.current?.focus();
		}
	};

	const onMoreClick = useCallback(() => {
		const { current: isOpen } = isMoreMembersOpen;

		if (!isOpen) {
			analytics((duration) =>
				moreMembersClicked({
					duration,
					memberCount: count,
				}),
			);
		}

		isMoreMembersOpen.current = !isOpen;
	}, [analytics, count]);

	const showMoreButtonProps: AvatarGroupProps['showMoreButtonProps'] = {
		onClick: onMoreClick,
		'aria-label': formatMessage(messages.profileCardMoreMembersLabel, {
			count: count - avatarGroupMaxCount + 1,
		}),
	};

	return (
		<>
			<MemberCount>
				<FormattedMessage {...message} values={{ count }} />
			</MemberCount>
			{members && members.length > 0 && (
				<AvatarSection>
					{fg('enable_team_profilecard_toggletip_a11y_fix') ? (
						<AvatarGroup
							appearance="stack"
							data={members.map((member, index) => {
								const href = generateUserLink?.(member.id);

								const onClick = onMemberClick(
									onUserClick,
									member.id,
									analytics,
									index,
									!!generateUserLink,
								);

								return {
									key: member.id,
									name: member.fullName,
									src: member.avatarUrl,
									href,
									onClick,
								};
							})}
							maxCount={avatarGroupMaxCount}
							showMoreButtonProps={showMoreButtonProps}
							testId="profilecard-avatar-group"
							overrides={{
								Avatar: {
									render: (Component, props, index) =>
										index === 0 ? (
											<Avatar ref={ref} {...props} testId="first-member" />
										) : (
											<Component {...props} />
										),
								},
							}}
						/>
					) : (
						<AvatarGroup
							appearance="stack"
							data={members.map((member, index) => {
								const href = generateUserLink?.(member.id);

								const onClick = onMemberClick(
									onUserClick,
									member.id,
									analytics,
									index,
									!!generateUserLink,
								);

								return {
									key: member.id,
									name: member.fullName,
									src: member.avatarUrl,
									href,
									onClick,
								};
							})}
							maxCount={avatarGroupMaxCount}
							showMoreButtonProps={showMoreButtonProps}
							testId="profilecard-avatar-group"
						/>
					)}
				</AvatarSection>
			)}
		</>
	);
};

function onActionClick(action: ProfileCardAction, analytics: AnalyticsFunction, index: number) {
	return (event: React.MouseEvent | React.KeyboardEvent, ...args: any) => {
		analytics((duration) =>
			actionClicked('team', {
				duration,
				hasHref: !!action.link,
				hasOnClick: !!action.callback,
				index,
				actionId: action.id || '',
			}),
		);

		if (action.callback && isBasicClick(event)) {
			event.preventDefault();
			action.callback(event, ...args);
		}
	};
}

const ActionButton = ({
	action,
	analytics,
	index,
}: {
	action: ProfileCardAction;
	analytics: AnalyticsFunction;
	index: number;
}) => {
	const isGiveKudosActionButton = action.id === GIVE_KUDOS_ACTION_ID;

	const actionButton = (
		<FocusRing isInset>
			<LinkButton
				key={action.id || index}
				onClick={onActionClick(action, analytics, index)}
				href={action.link || ''}
				shouldFitContainer
			>
				{action.label}
				{isGiveKudosActionButton && (
					<AnimationWrapper>
						<KudosBlobAnimation />
					</AnimationWrapper>
				)}
			</LinkButton>
		</FocusRing>
	);

	if (isGiveKudosActionButton) {
		return <AnimatedKudosButton>{actionButton}</AnimatedKudosButton>;
	}

	return <WrappedButton>{actionButton}</WrappedButton>;
};

interface ActionProps {
	actions: ProfileCardAction[];
	analytics: AnalyticsFunction;
}

const ExtraActions = ({ actions, analytics }: ActionProps) => {
	const [isOpen, setOpen] = useState(false);

	const count = actions.length;

	const onMoreClick = useCallback(
		(shouldBeOpen: boolean) => {
			if (shouldBeOpen) {
				// Only fire this event when OPENING the dropdown
				analytics((duration) =>
					moreActionsClicked('team', {
						duration,
						numActions: count + 2,
					}),
				);
			}

			setOpen(shouldBeOpen);
		},
		[analytics, count],
	);

	if (!count) {
		return null;
	}

	return (
		<MoreButton>
			<Popup
				isOpen={isOpen}
				onClose={() => setOpen(false)}
				placement="bottom-start"
				content={() => (
					<MenuGroup>
						{actions.map((action, index) => (
							<LinkItem
								onClick={onActionClick(action, analytics, index + 2)}
								key={action.id || index}
								href={action.link}
							>
								{action.label}
							</LinkItem>
						))}
					</MenuGroup>
				)}
				trigger={(triggerProps) => {
					return (
						<IconButton
							testId="more-actions-button"
							{...triggerProps}
							isSelected={isOpen}
							onClick={() => onMoreClick(!isOpen)}
							icon={MoreIcon}
							label="actions"
						/>
					);
				}}
				zIndex={layers.modal()}
				shouldRenderToParent={fg('enable_appropriate_reading_order_in_profile_card')}
			/>
		</MoreButton>
	);
};

const ButtonSection = ({ actions, analytics }: ActionProps) => {
	if (!actions) {
		return null;
	}

	const extraActions = actions.slice(2);
	const initialActions = actions.slice(0, 2);

	return (
		<ActionButtons>
			{initialActions.map((action, index) => (
				<ActionButton action={action} analytics={analytics} index={index} key={index} />
			))}
			{extraActions && <ExtraActions actions={extraActions} analytics={analytics} />}
		</ActionButtons>
	);
};

const TeamProfilecardContent = ({
	actions,
	analytics,
	team,
	viewingUserId,
	generateUserLink,
	onUserClick,
	viewProfileLink,
	viewProfileOnClick,
	isTriggeredByKeyboard,
}: TeamProfilecardProps & { team: Team }) => {
	const allActions = [
		{
			label: <FormattedMessage {...messages.teamViewProfile} />,
			link: viewProfileLink,
			callback: viewProfileOnClick,
			id: 'view-profile',
		},
		...(actions || []),
	];

	const includingYou = team.members && team.members.some((member) => member.id === viewingUserId);

	useEffect(() => {
		analytics((duration) =>
			profileCardRendered('team', 'content', {
				duration,
				numActions: allActions.length,
				memberCount: team.members?.length,
				includingYou,
				descriptionLength: team.description.length,
				titleLength: team.displayName.length,
			}),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [analytics]);

	return (
		<CardWrapper testId="team-profilecard">
			<CardHeader
				image={team.largeHeaderImageUrl || team.smallHeaderImageUrl}
				label={team.displayName}
			/>
			<CardContent>
				<Tooltip content={team.displayName}>
					<Inline>
						<TeamName>{team.displayName}</TeamName>
						{team.isVerified && <VerifiedTeamIcon />}
					</Inline>
				</Tooltip>
				<TeamMembers
					analytics={analytics}
					members={team.members}
					generateUserLink={generateUserLink}
					includingYou={includingYou}
					onUserClick={onUserClick}
					isTriggeredByKeyboard={isTriggeredByKeyboard}
				/>
				{team.description.trim() && (
					<DescriptionWrapper>
						<Description>{team.description}</Description>
					</DescriptionWrapper>
				)}
				<ButtonSection actions={allActions} analytics={analytics} />
			</CardContent>
		</CardWrapper>
	);
};

const ErrorMessage = ({
	analytics,
	clientFetchProfile,
	isLoading,
}: {
	clientFetchProfile?: () => void;
	isLoading?: boolean;
	analytics: AnalyticsFunction;
}) => {
	const hasRetry = !!clientFetchProfile;

	useEffect(() => {
		analytics((duration) =>
			profileCardRendered('team', 'error', {
				duration,
				hasRetry,
			}),
		);
	}, [analytics, hasRetry]);

	const retry = useCallback(() => {
		analytics((duration) =>
			errorRetryClicked({
				duration,
			}),
		);

		if (clientFetchProfile) {
			clientFetchProfile();
		}
	}, [analytics, clientFetchProfile]);

	return (
		<ErrorWrapper testId="team-profilecard-error">
			<ErrorIllustration />
			<Text as="p" weight="semibold">
				<FormattedMessage {...messages.teamErrorTitle} />
			</Text>
			<TeamErrorText>
				<FormattedMessage {...messages.teamErrorText} />
			</TeamErrorText>
			{clientFetchProfile && (
				<ActionButtons>
					<WrappedButton>
						<Button
							testId="client-fetch-profile-button"
							shouldFitContainer
							onClick={retry}
							isLoading={isLoading}
						>
							<FormattedMessage {...messages.teamErrorButton} />
						</Button>
					</WrappedButton>
				</ActionButtons>
			)}
		</ErrorWrapper>
	);
};

const TeamProfileCard = (props: TeamProfilecardProps) => {
	const { analytics, clientFetchProfile, hasError, isLoading, team, errorType } = props;

	if (hasError) {
		if (errorType?.reason === 'TEAMS_FORBIDDEN') {
			return <TeamForbiddenErrorState analytics={analytics} />;
		} else {
			return (
				<CardWrapper testId="team-profilecard">
					<ErrorMessage
						analytics={analytics}
						clientFetchProfile={clientFetchProfile}
						isLoading={isLoading}
					/>
				</CardWrapper>
			);
		}
	}

	if (isLoading) {
		return <TeamLoadingState analytics={analytics} />;
	}

	if (team) {
		return <TeamProfilecardContent {...{ ...props, team }} />;
	}

	return null;
};

export default TeamProfileCard;
