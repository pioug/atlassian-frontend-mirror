import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Avatar from '@atlaskit/avatar';
import AvatarGroup, { type AvatarGroupProps } from '@atlaskit/avatar-group';
import Button, { IconButton, LinkButton } from '@atlaskit/button/new';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
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
	ArchiveLozengeWrapper,
	AvatarSection,
	Description,
	DescriptionWrapper,
	MemberCount,
	MoreButton,
	TeamName,
	WrappedButton,
} from '../../styled/TeamCard';
import { CardContent, CardHeader, CardWrapper } from '../../styled/TeamTrigger';
import type {
	AnalyticsFunction,
	AnalyticsFunctionNext,
	ProfileCardAction,
	Team,
	TeamProfilecardProps,
} from '../../types';
import {
	actionClicked,
	errorRetryClicked,
	moreActionsClicked,
	moreMembersClicked,
	PACKAGE_META_DATA,
	profileCardRendered,
	teamAvatarClicked,
} from '../../util/analytics';
import { isBasicClick } from '../../util/click';
import { getPageTime } from '../../util/performance';
import { ErrorIllustration } from '../Error';

import TeamForbiddenErrorState from './TeamForbiddenErrorState';
import TeamLoadingState from './TeamLoadingState';

interface TeamMembers {
	isArchived?: boolean;
	analytics: AnalyticsFunction;
	analyticsNext: AnalyticsFunctionNext;
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
	analyticsNext: AnalyticsFunctionNext,
	index: number,
	hasHref: boolean,
) {
	return (event: React.MouseEvent<Element>) => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			analyticsNext('ui.teamProfileCard.clicked.avatar', (duration) => ({
				duration,
				hasHref,
				hasOnClick: !!callback,
				index,
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
			analytics((duration) =>
				teamAvatarClicked({
					duration,
					hasHref,
					hasOnClick: !!callback,
					index,
				}),
			);
		}

		if (callback) {
			callback(userId, event);
		}
	};
}

const TeamMembers = ({
	analytics,
	generateUserLink,
	members,
	isArchived,
	onUserClick,
	includingYou,
	analyticsNext,
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
			if (fg('ptc-enable-profile-card-analytics-refactor')) {
				analyticsNext('ui.teamProfileCard.clicked.moreMembers', (duration) => ({
					duration,
					memberCount: count,
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				}));
			} else {
				analytics((duration) =>
					moreMembersClicked({
						duration,
						memberCount: count,
					}),
				);
			}
		}

		isMoreMembersOpen.current = !isOpen;
	}, [analytics, count, analyticsNext]);

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
			{isArchived && (
				<ArchiveLozengeWrapper>
					<Lozenge appearance="default" isBold>
						<FormattedMessage {...messages.archivedLozenge} />
					</Lozenge>
				</ArchiveLozengeWrapper>
			)}
			{members && members.length > 0 && (
				<AvatarSection>
					{
						<AvatarGroup
							appearance="stack"
							data={members.map((member, index) => {
								const href = generateUserLink?.(member.id);

								const onClick = onMemberClick(
									onUserClick,
									member.id,
									analytics,
									analyticsNext,
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
					}
				</AvatarSection>
			)}
		</>
	);
};

function onActionClick(
	action: ProfileCardAction,
	analytics: AnalyticsFunction,
	analyticsNext: AnalyticsFunctionNext,
	index: number,
) {
	return (event: React.MouseEvent | React.KeyboardEvent, ...args: any) => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			analyticsNext('ui.teamProfileCard.clicked.action', (duration) => ({
				duration,
				hasHref: !!action.link,
				hasOnClick: !!action.callback,
				index,
				actionId: action.id || '',
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
			analytics((duration) =>
				actionClicked('team', {
					duration,
					hasHref: !!action.link,
					hasOnClick: !!action.callback,
					index,
					actionId: action.id || '',
				}),
			);
		}

		if (action.callback && isBasicClick(event)) {
			event.preventDefault();
			action.callback(event, ...args);
		}
	};
}

const ActionButton = ({
	action,
	analytics,
	analyticsNext,
	index,
}: {
	action: ProfileCardAction;
	analytics: AnalyticsFunction;
	analyticsNext: AnalyticsFunctionNext;
	index: number;
}) => {
	const isGiveKudosActionButton = action.id === GIVE_KUDOS_ACTION_ID;

	const actionButton = (
		<LinkButton
			key={action.id || index}
			onClick={onActionClick(action, analytics, analyticsNext, index)}
			href={action.link || ''}
			target={action.target}
			shouldFitContainer
		>
			{action.label}
			{isGiveKudosActionButton && (
				<AnimationWrapper>
					<KudosBlobAnimation />
				</AnimationWrapper>
			)}
		</LinkButton>
	);

	if (isGiveKudosActionButton) {
		return <AnimatedKudosButton>{actionButton}</AnimatedKudosButton>;
	}

	return <WrappedButton>{actionButton}</WrappedButton>;
};

interface ActionProps {
	actions: ProfileCardAction[];
	analytics: AnalyticsFunction;
	analyticsNext: AnalyticsFunctionNext;
}

const ExtraActions = ({ actions, analytics, analyticsNext }: ActionProps) => {
	const [isOpen, setOpen] = useState(false);

	const count = actions.length;

	const onMoreClick = useCallback(
		(shouldBeOpen: boolean) => {
			if (shouldBeOpen) {
				// Only fire this event when OPENING the dropdown
				if (fg('ptc-enable-profile-card-analytics-refactor')) {
					analyticsNext('ui.teamProfileCard.clicked.moreActions', (duration) => ({
						duration,
						numActions: count + 2,
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					}));
				} else {
					analytics((duration) =>
						moreActionsClicked('team', {
							duration,
							numActions: count + 2,
						}),
					);
				}
			}

			setOpen(shouldBeOpen);
		},
		[analytics, count, analyticsNext],
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
								onClick={onActionClick(action, analytics, analyticsNext, index + 2)}
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

const ButtonSection = ({ actions, analytics, analyticsNext }: ActionProps) => {
	if (!actions) {
		return null;
	}

	const extraActions = actions.slice(2);
	const initialActions = actions.slice(0, 2);

	return (
		<ActionButtons>
			{initialActions.map((action, index) => (
				<ActionButton
					action={action}
					analytics={analytics}
					analyticsNext={analyticsNext}
					index={index}
					key={index}
				/>
			))}
			{extraActions && (
				<ExtraActions actions={extraActions} analytics={analytics} analyticsNext={analyticsNext} />
			)}
		</ActionButtons>
	);
};

const TeamProfilecardContent = ({
	actions,
	analytics,
	analyticsNext,
	team,
	viewingUserId,
	generateUserLink,
	onUserClick,
	viewProfileLink,
	viewProfileOnClick,
	isTriggeredByKeyboard,
}: TeamProfilecardProps & { team: Team }) => {
	const newTeamProfileEnabled = FeatureGates.getExperimentValue(
		'new_team_profile',
		'isEnabled',
		false,
	);
	const isTeamArchived = team.state === 'DISBANDED' && newTeamProfileEnabled;
	const allActions = [
		{
			label: <FormattedMessage {...messages.teamViewProfile} />,
			link: viewProfileLink,
			callback: viewProfileOnClick,
			id: 'view-profile',
		},
		...(isTeamArchived ? [] : actions || []),
	];

	const includingYou = team.members && team.members.some((member) => member.id === viewingUserId);

	useEffect(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			analyticsNext('ui.teamProfileCard.rendered.content', (duration) => ({
				duration,
				numActions: allActions.length,
				memberCount: team.members?.length ?? null,
				includingYou: includingYou ?? null,
				descriptionLength: team.description.length,
				titleLength: team.displayName.length,
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
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
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [analytics]);

	return (
		<CardWrapper testId="team-profilecard">
			<CardHeader
				image={team.largeHeaderImageUrl || team.smallHeaderImageUrl}
				label={team.displayName}
				isDisabled={isTeamArchived}
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
					analyticsNext={analyticsNext}
					members={team.members}
					isArchived={isTeamArchived}
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
				<ButtonSection actions={allActions} analytics={analytics} analyticsNext={analyticsNext} />
			</CardContent>
		</CardWrapper>
	);
};

const ErrorMessage = ({
	analytics,
	analyticsNext,
	clientFetchProfile,
	isLoading,
}: {
	clientFetchProfile?: () => void;
	isLoading?: boolean;
	analytics: AnalyticsFunction;
	analyticsNext: AnalyticsFunctionNext;
}) => {
	const hasRetry = !!clientFetchProfile;

	useEffect(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			analyticsNext('ui.teamProfileCard.rendered.error', (duration) => ({
				duration,
				hasRetry,
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
			analytics((duration) =>
				profileCardRendered('team', 'error', {
					duration,
					hasRetry,
				}),
			);
		}
	}, [analytics, analyticsNext, hasRetry]);

	const retry = useCallback(() => {
		if (fg('ptc-enable-profile-card-analytics-refactor')) {
			analyticsNext('ui.teamProfileCard.clicked.errorRetry', (duration) => ({
				duration,
				firedAt: Math.round(getPageTime()),
				...PACKAGE_META_DATA,
			}));
		} else {
			analytics((duration) =>
				errorRetryClicked({
					duration,
				}),
			);
		}

		if (clientFetchProfile) {
			clientFetchProfile();
		}
	}, [analytics, analyticsNext, clientFetchProfile]);

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

const TeamProfileCard = (props: TeamProfilecardProps): React.JSX.Element | null => {
	const { analytics, analyticsNext, clientFetchProfile, hasError, isLoading, team, errorType } =
		props;

	if (hasError) {
		if (errorType?.reason === 'TEAMS_FORBIDDEN') {
			return <TeamForbiddenErrorState analytics={analytics} analyticsNext={analyticsNext} />;
		} else {
			return (
				<CardWrapper testId="team-profilecard">
					<ErrorMessage
						analytics={analytics}
						analyticsNext={analyticsNext}
						clientFetchProfile={clientFetchProfile}
						isLoading={isLoading}
					/>
				</CardWrapper>
			);
		}
	}

	if (isLoading) {
		return <TeamLoadingState analytics={analytics} analyticsNext={analyticsNext} />;
	}

	if (team) {
		return <TeamProfilecardContent {...{ ...props, team }} />;
	}

	return null;
};

export default TeamProfileCard;
