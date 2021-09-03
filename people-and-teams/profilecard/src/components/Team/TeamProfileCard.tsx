import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormattedMessage } from 'react-intl';

import AvatarGroup from '@atlaskit/avatar-group';
import ButtonGroup from '@atlaskit/button/button-group';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { LinkItem, MenuGroup } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { layers } from '@atlaskit/theme/constants';

import messages from '../../messages';
import {
  ErrorWrapper,
  TeamErrorText,
  TeamErrorTitle,
} from '../../styled/Error';
import {
  ActionButtons,
  AvatarSection,
  CardContent,
  CardHeader,
  CardWrapper,
  Description,
  DescriptionWrapper,
  MemberCount,
  MoreButton,
  TeamName,
  WrappedButton,
} from '../../styled/TeamCard';
import type {
  AnalyticsFunction,
  ProfileCardAction,
  Team,
  TeamProfilecardProps,
} from '../../types';
import {
  errorRetryClicked,
  moreActionsClicked,
  moreMembersClicked,
  teamActionClicked,
  teamAvatarClicked,
  teamProfileCardRendered,
} from '../../util/analytics';
import { isBasicClick } from '../../util/click';
import { ErrorIllustration } from '../Error';

import TeamLoadingState from './TeamLoadingState';

interface TeamMembers {
  analytics: AnalyticsFunction;
  members?: Team['members'];
  includingYou?: boolean;
}

type TeamMembersProps = TeamMembers &
  Pick<TeamProfilecardProps, 'generateUserLink' | 'onUserClick'>;

const LARGE_MEMBER_COUNT = 50;

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
}: TeamMembersProps) => {
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

  return (
    <>
      <MemberCount>
        <FormattedMessage {...message} values={{ count }} />
      </MemberCount>
      {members && members.length > 0 && (
        <AvatarSection>
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
            maxCount={9}
            showMoreButtonProps={{ onClick: onMoreClick }}
            testId="profilecard-avatar-group"
          />
        </AvatarSection>
      )}
    </>
  );
};

function onActionClick(
  action: ProfileCardAction,
  analytics: AnalyticsFunction,
  index: number,
) {
  return (event: React.MouseEvent | React.KeyboardEvent, ...args: any) => {
    analytics((duration) =>
      teamActionClicked({
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
  return (
    <WrappedButton>
      <Button
        href={action.link}
        onClick={onActionClick(action, analytics, index)}
        shouldFitContainer
      >
        {action.label}
      </Button>
    </WrappedButton>
  );
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
          moreActionsClicked({
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
        trigger={(triggerProps) => (
          <Button
            testId="more-actions-button"
            {...triggerProps}
            isSelected={isOpen}
            onClick={() => onMoreClick(!isOpen)}
            iconAfter={<MoreIcon label="actions" />}
          />
        )}
        zIndex={layers.modal()}
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
    <ButtonGroup>
      <ActionButtons>
        {initialActions.map((action, index) => (
          <ActionButton
            action={action}
            analytics={analytics}
            index={index}
            key={index}
          />
        ))}
        {extraActions && (
          <ExtraActions actions={extraActions} analytics={analytics} />
        )}
      </ActionButtons>
    </ButtonGroup>
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

  const includingYou =
    team.members && team.members.some((member) => member.id === viewingUserId);

  useEffect(() => {
    analytics((duration) =>
      teamProfileCardRendered('content', {
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
    <CardWrapper data-testid="team-profilecard">
      <CardHeader
        image={team.largeHeaderImageUrl || team.smallHeaderImageUrl}
      />
      <CardContent>
        <TeamName>{team.displayName}</TeamName>
        <TeamMembers
          analytics={analytics}
          members={team.members}
          generateUserLink={generateUserLink}
          includingYou={includingYou}
          onUserClick={onUserClick}
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
      teamProfileCardRendered('error', {
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
    <ErrorWrapper data-testid="team-profilecard-error">
      <ErrorIllustration />
      <TeamErrorTitle>
        <FormattedMessage {...messages.teamErrorTitle} />
      </TeamErrorTitle>
      <TeamErrorText>
        <FormattedMessage {...messages.teamErrorText} />
      </TeamErrorText>
      {clientFetchProfile && (
        <ActionButtons>
          <WrappedButton>
            <LoadingButton
              testId="client-fetch-profile-button"
              shouldFitContainer
              onClick={retry}
              isLoading={isLoading}
            >
              <FormattedMessage {...messages.teamErrorButton} />
            </LoadingButton>
          </WrappedButton>
        </ActionButtons>
      )}
    </ErrorWrapper>
  );
};

const TeamProfileCard = (props: TeamProfilecardProps) => {
  const { analytics, clientFetchProfile, hasError, isLoading, team } = props;

  if (hasError) {
    return (
      <CardWrapper data-testid="team-profilecard">
        <ErrorMessage
          analytics={analytics}
          clientFetchProfile={clientFetchProfile}
          isLoading={isLoading}
        />
      </CardWrapper>
    );
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
