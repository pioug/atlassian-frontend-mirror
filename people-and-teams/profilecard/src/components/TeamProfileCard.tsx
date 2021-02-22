import React, { useState } from 'react';

import { FormattedMessage } from 'react-intl';

import AvatarGroup from '@atlaskit/avatar-group';
import ButtonGroup from '@atlaskit/button/button-group';
import LoadingButton from '@atlaskit/button/loading-button';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { LinkItem, MenuGroup } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';

import messages from '../messages';
import { ErrorWrapper, TeamErrorText, TeamErrorTitle } from '../styled/Error';
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
} from '../styled/TeamCard';
import { ProfileCardAction, Team, TeamProfilecardProps } from '../types';

import { ErrorIllustration } from './ErrorIllustration';
import TeamLoadingState from './TeamLoadingState';

interface TeamMembers {
  members?: Team['members'];
}

type TeamMembersProps = TeamMembers &
  Pick<
    TeamProfilecardProps,
    'generateUserLink' | 'onUserClick' | 'viewingUserId'
  >;

const LARGE_MEMBER_COUNT = 50;

function onMemberClick(
  callback: Required<TeamMembersProps>['onUserClick'],
  userId: string,
) {
  return (event: React.MouseEvent<Element>) => {
    // Analytics
    callback(userId, event);
  };
}

const TeamMembers = ({
  generateUserLink,
  members,
  onUserClick,
  viewingUserId,
}: TeamMembersProps) => {
  const count = members ? members.length : 0;

  const includingYou =
    members && members.some(member => member.id === viewingUserId);

  const message = includingYou
    ? count >= LARGE_MEMBER_COUNT
      ? messages.membersMoreThan50IncludingYou
      : messages.memberCountIncludingYou
    : count >= LARGE_MEMBER_COUNT
    ? messages.membersMoreThan50
    : messages.memberCount;

  return (
    <>
      <MemberCount>
        <FormattedMessage {...message} values={{ count }} />
      </MemberCount>
      {members && members.length > 0 && (
        <AvatarSection>
          <AvatarGroup
            appearance="stack"
            data={members.map(member => {
              const linkProps = generateUserLink
                ? {
                    href: generateUserLink(member.id),
                  }
                : {};

              const onClickProps = onUserClick
                ? {
                    onClick: onMemberClick(onUserClick, member.id),
                  }
                : {};

              return {
                key: member.id,
                name: member.fullName,
                src: member.avatarUrl,
                ...linkProps,
                ...onClickProps,
              };
            })}
            maxCount={9}
          />
        </AvatarSection>
      )}
    </>
  );
};

function onActionClick(callback: ProfileCardAction['callback']) {
  return (...args: any) => {
    // Analytics
    if (callback) {
      args[0].preventDefault();
      callback(...args);
    }
  };
}

const ActionButton = ({ label, callback, link }: ProfileCardAction) => {
  return (
    <WrappedButton>
      <Button shouldFitContainer onClick={onActionClick(callback)} href={link}>
        {label}
      </Button>
    </WrappedButton>
  );
};

interface ActionProps {
  actions: ProfileCardAction[];
}

const ExtraActions = ({ actions }: ActionProps) => {
  const [isOpen, setOpen] = useState(false);

  if (!actions.length) {
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
                onClick={onActionClick(action.callback)}
                key={action.id || index}
                href={action.link}
              >
                {action.label}
              </LinkItem>
            ))}
          </MenuGroup>
        )}
        trigger={triggerProps => (
          <Button
            testId="more-actions-button"
            {...triggerProps}
            isSelected={isOpen}
            onClick={() => setOpen(!isOpen)}
            iconAfter={<MoreIcon label="actions" />}
          />
        )}
      />
    </MoreButton>
  );
};

const ButtonSection = ({ actions }: ActionProps) => {
  if (!actions) {
    return null;
  }

  const extraActions = actions.slice(2);
  const initialActions = actions.slice(0, 2);

  return (
    <ButtonGroup>
      <ActionButtons>
        {initialActions.map((action, index) => (
          <ActionButton {...action} key={index} />
        ))}
        {extraActions && <ExtraActions actions={extraActions} />}
      </ActionButtons>
    </ButtonGroup>
  );
};

const TeamProfilecardContent = ({
  actions,
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
    },
    ...(actions || []),
  ];

  return (
    <CardWrapper data-testid="team-profilecard">
      <CardHeader
        image={team.largeHeaderImageUrl || team.smallHeaderImageUrl}
      />
      <CardContent>
        <TeamName>{team.displayName}</TeamName>
        <TeamMembers
          members={team.members}
          generateUserLink={generateUserLink}
          viewingUserId={viewingUserId}
          onUserClick={onUserClick}
        />
        {team.description.trim() && (
          <DescriptionWrapper>
            <Description>{team.description}</Description>
          </DescriptionWrapper>
        )}
        <ButtonSection actions={allActions} />
      </CardContent>
    </CardWrapper>
  );
};

const ErrorMessage = ({
  clientFetchProfile,
  isLoading,
}: {
  clientFetchProfile?: () => void;
  isLoading?: boolean;
}) => {
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
              onClick={clientFetchProfile}
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
  const { clientFetchProfile, hasError, isLoading, team } = props;

  if (hasError) {
    return (
      <CardWrapper data-testid="team-profilecard">
        <ErrorMessage
          clientFetchProfile={clientFetchProfile}
          isLoading={isLoading}
        />
      </CardWrapper>
    );
  }

  if (isLoading) {
    return <TeamLoadingState />;
  }

  if (team) {
    return <TeamProfilecardContent {...{ ...props, team }} />;
  }

  return null;
};

export default TeamProfileCard;
