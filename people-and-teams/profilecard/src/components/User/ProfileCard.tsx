import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FormattedMessage } from 'react-intl-next';

import { type AnalyticsEventPayload, withAnalyticsEvents } from '@atlaskit/analytics-next';
import Avatar from '@atlaskit/avatar';
import { LinkButton } from '@atlaskit/button/new';
import FocusRing from '@atlaskit/focus-ring';
import { fg } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import messages from '../../messages';
import {
	ActionButtonGroup,
	ActionsFlexSpacer,
	AnimatedKudosButton,
	AnimationWrapper,
	CardContainer,
	CardContent,
	KudosBlobAnimation,
	ProfileImage,
} from '../../styled/Card';
import { CardWrapper, SpinnerContainer } from '../../styled/UserTrigger';
import {
	type AnalyticsFromDuration,
	type AnalyticsProps,
	type AnalyticsWithDurationProps,
	type ProfileCardAction,
	type ProfilecardProps,
} from '../../types';
import { actionClicked, fireEvent, profileCardRendered } from '../../util/analytics';
import { isBasicClick } from '../../util/click';
import { getPageTime } from '../../util/performance';
import { ErrorMessage } from '../Error';

import {
	ACTION_OVERFLOW_THRESHOLD,
	OverflowProfileCardButtons,
} from './OverflowProfileCardButtons';
import { ProfileCardDetails } from './ProfileCardDetails';

const GIVE_KUDOS_ACTION_ID = 'give-kudos';

const useKudos = (
	cloudId?: string,
	userId?: string,
	teamCentralBaseUrl?: string,
	openKudosDrawer?: () => void,
) => {
	const kudosUrl = useMemo(() => {
		const recipientId = userId ? `&recipientId=${userId}` : '';
		const cloudIdParam = cloudId ? `&cloudId=${cloudId}` : '';

		return `${teamCentralBaseUrl || ''}/kudos/give?type=individual${recipientId}${cloudIdParam}`;
	}, [cloudId, teamCentralBaseUrl, userId]);

	const kudosButtonCallback = useCallback(() => {
		if (openKudosDrawer) {
			openKudosDrawer();
		} else {
			window.open(kudosUrl);
		}
	}, [kudosUrl, openKudosDrawer]);

	const kudosAction = useMemo(() => {
		return {
			label: <FormattedMessage {...messages.giveKudosButton} />,
			id: GIVE_KUDOS_ACTION_ID,
			callback: kudosButtonCallback,
			link: kudosUrl,
		};
	}, [kudosButtonCallback, kudosUrl]);

	return {
		kudosAction,
		kudosButtonCallback,
		kudosUrl,
	};
};

const Wrapper = (props: { children: React.ReactNode }) => (
	<CardWrapper testId="profilecard" role="dialog" labelledBy="profilecard-name-label">
		{props.children}
	</CardWrapper>
);

export const ProfilecardInternal = (props: ProfilecardProps & AnalyticsProps) => {
	const [openTime] = useState<number>(getPageTime());

	const { createAnalyticsEvent } = props;

	const fireAnalytics = useCallback(
		(payload: AnalyticsEventPayload) => {
			if (createAnalyticsEvent) {
				fireEvent(createAnalyticsEvent, payload);
			}
		},
		[createAnalyticsEvent],
	);

	const fireAnalyticsWithDuration = useCallback(
		(generator: AnalyticsFromDuration) => {
			const elapsed = getPageTime() - openTime;
			const event = generator(elapsed);
			fireAnalytics(event);
		},
		[fireAnalytics, openTime],
	);

	const { kudosAction } = useKudos(
		props.cloudId,
		props.userId,
		props.teamCentralBaseUrl,
		props.openKudosDrawer,
	);

	const { actions = [], isCurrentUser, isKudosEnabled, status = 'active' } = props;

	const realActions = useMemo(() => {
		if (isCurrentUser || !isKudosEnabled || status !== 'active') {
			return actions;
		}

		return actions.concat([kudosAction]);
	}, [actions, isCurrentUser, isKudosEnabled, kudosAction, status]);

	const { isLoading, fullName, hasError } = props;

	const canRender = !hasError && !isLoading && !!(fullName || status === 'closed');

	useEffect(() => {
		if (canRender) {
			fireAnalyticsWithDuration((duration) =>
				profileCardRendered('user', 'content', {
					duration,
					numActions: realActions.length,
				}),
			);
		}
	}, [canRender, fireAnalyticsWithDuration, realActions]);

	if (hasError) {
		return (
			<Wrapper>
				<ErrorMessage
					reload={props.clientFetchProfile}
					errorType={props.errorType || null}
					fireAnalytics={fireAnalytics}
				/>
			</Wrapper>
		);
	}

	if (isLoading) {
		return (
			<Wrapper>
				<LoadingView fireAnalyticsWithDuration={fireAnalyticsWithDuration} />
			</Wrapper>
		);
	}

	if (!canRender) {
		return null;
	}

	const isDisabledUser = status === 'inactive' || status === 'closed';

	return (
		<Wrapper>
			<CardContainer isDisabledUser={isDisabledUser} withoutElevation={props.withoutElevation}>
				<ProfileImage>
					<Avatar
						size="xlarge"
						src={status !== 'closed' ? props.avatarUrl : undefined}
						borderColor={token('elevation.shadow.overlay', N0)}
					/>
				</ProfileImage>
				<CardContent>
					<ProfileCardDetails
						{...props}
						status={status}
						fireAnalyticsWithDuration={fireAnalyticsWithDuration}
					/>
					{realActions && (
						<>
							<ActionsFlexSpacer />
							<Actions
								actions={realActions}
								fireAnalyticsWithDuration={fireAnalyticsWithDuration}
								isTriggeredUsingKeyboard={props.isTriggeredUsingKeyboard}
							/>
						</>
					)}
				</CardContent>
			</CardContainer>
		</Wrapper>
	);
};

interface ActionsProps extends AnalyticsWithDurationProps {
	actions: ProfileCardAction[];
	isTriggeredUsingKeyboard: boolean | undefined;
}

const Actions = ({
	actions,
	fireAnalyticsWithDuration,
	isTriggeredUsingKeyboard,
}: ActionsProps) => {
	const onActionClick = useCallback(
		(
			action: ProfileCardAction,
			args: any,
			event: React.MouseEvent | React.KeyboardEvent,
			index: number,
		) => {
			fireAnalyticsWithDuration((duration) =>
				actionClicked('user', {
					duration,
					hasHref: !!action.link,
					hasOnClick: !!action.callback,
					index,
					actionId: action.id || 'no-id-specified',
				}),
			);

			if (action.callback && isBasicClick(event)) {
				event.preventDefault();
				action.callback(event, ...args);
			}
		},
		[fireAnalyticsWithDuration],
	);

	if (!actions || actions.length === 0) {
		return null;
	}

	const regularActions = actions.slice(0, ACTION_OVERFLOW_THRESHOLD);
	const overflowActions =
		actions.length > ACTION_OVERFLOW_THRESHOLD
			? actions.slice(ACTION_OVERFLOW_THRESHOLD)
			: undefined;

	return (
		<ActionButtonGroup testId="profilecard-actions">
			{regularActions.map((action, index) => {
				const isKudos = action.id === GIVE_KUDOS_ACTION_ID;

				const button = (
					<FocusRing isInset key={`profile-card-action-focus-ring_${action.id || index}`}>
						<LinkButton
							appearance="default"
							key={action.id || index}
							onClick={(event: React.MouseEvent<HTMLElement>, ...args: any) =>
								onActionClick(action, args, event, index)
							}
							href={action.link || ''}
							autoFocus={index === 0 && isTriggeredUsingKeyboard}
							id={`action-button-${action.id}`}
							aria-labelledby={
								fg('enable_userprofilecard_arialabelfix')
									? `action-button-${action.id} profilecard-name-label`
									: ''
							}
						>
							{action.label}
							{isKudos && (
								<AnimationWrapper>
									<KudosBlobAnimation />
								</AnimationWrapper>
							)}
						</LinkButton>
					</FocusRing>
				);

				if (isKudos) {
					return (
						<AnimatedKudosButton key={`profile-card-action-kudos_${action.id || index}`}>
							{button}
						</AnimatedKudosButton>
					);
				}

				return button;
			})}
			{overflowActions && (
				<OverflowProfileCardButtons
					actions={overflowActions}
					fireAnalyticsWithDuration={fireAnalyticsWithDuration}
					onItemClick={(action, args, event, index) =>
						onActionClick(action, args, event, index + ACTION_OVERFLOW_THRESHOLD)
					}
				/>
			)}
		</ActionButtonGroup>
	);
};

const LoadingView = ({ fireAnalyticsWithDuration }: AnalyticsWithDurationProps) => {
	useEffect(() => {
		fireAnalyticsWithDuration((duration) => profileCardRendered('user', 'spinner', { duration }));
	}, [fireAnalyticsWithDuration]);

	return (
		<SpinnerContainer testId="profilecard-spinner-container">
			<Spinner />
		</SpinnerContainer>
	);
};

export default withAnalyticsEvents()(ProfilecardInternal);
