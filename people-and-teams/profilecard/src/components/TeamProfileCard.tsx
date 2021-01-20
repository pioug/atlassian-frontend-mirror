import React, { useState } from 'react';

import { FormattedMessage } from 'react-intl';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import LoadingButton from '@atlaskit/button/loading-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Spinner from '@atlaskit/spinner';

import Popup from '@atlaskit/popup';
import { MenuGroup, LinkItem } from '@atlaskit/menu';

import {
  CardElevationWrapper,
  CardContainer,
  CardContent,
  CardHeader,
  TeamName,
  MemberCount,
  ActionButtons,
  WrappedButton,
  MoreButton,
  Description,
  AvatarSection,
  DescriptionWrapper,
  LoadingWrapper,
} from '../styled/TeamCard';
import { ErrorWrapper, TeamErrorTitle, TeamErrorText } from '../styled/Error';
import { ErrorIllustration } from './ErrorIllustration';

import { Team, TeamProfilecardProps, ProfileCardAction } from '../types';
import messages from '../messages';
import AvatarGroup from '@atlaskit/avatar-group';

interface TeamMembersProps {
  members?: Team['members'];
  generateUserLink?: (userId: string) => string;
  viewingUserId?: string;
}

// function onMemberClick(callback: TeamMembersProps['onUserClick'], userId: string) {
//   return (...args: any) => {
//     args[0].preventDefault();
//     console.log('User clicked :)');
//     // Analytics
//     callback(userId);
//   };
// }

const TeamMembers = ({
  generateUserLink,
  members,
  viewingUserId,
}: TeamMembersProps) => {
  const count = members ? members.length : 0;

  const includingYou =
    members && members.some(member => member.id === viewingUserId);

  const message = includingYou
    ? messages.memberCountIncludingYou
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
                    target: '_blank' as const,
                  }
                : {};

              return {
                key: member.id,
                name: member.fullName,
                src: member.avatarUrl,
                ...linkProps,
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
    <CardContainer>
      <CardHeader
        image={team.largeHeaderImageUrl || team.smallHeaderImageUrl}
      />
      <CardContent>
        <TeamName>{team.displayName}</TeamName>
        <TeamMembers
          members={team.members}
          generateUserLink={generateUserLink}
          viewingUserId={viewingUserId}
        />
        {team.description.trim() && (
          <DescriptionWrapper>
            <Description>{team.description}</Description>
          </DescriptionWrapper>
        )}
        <ButtonSection actions={allActions} />
      </CardContent>
    </CardContainer>
  );
};

const MaybeLoadingButton = ({
  children,
  isLoading,
  onClick,
}: {
  children: JSX.Element;
  isLoading?: boolean;
  onClick: () => void;
}) => {
  return (
    <WrappedButton>
      <LoadingButton shouldFitContainer onClick={onClick} isLoading={isLoading}>
        {children}
      </LoadingButton>
    </WrappedButton>
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
    <ErrorWrapper>
      <ErrorIllustration />
      <TeamErrorTitle>
        <FormattedMessage {...messages.teamErrorTitle} />
      </TeamErrorTitle>
      <TeamErrorText>
        <FormattedMessage {...messages.teamErrorText} />
      </TeamErrorText>
      {clientFetchProfile && (
        <ActionButtons>
          <MaybeLoadingButton
            isLoading={isLoading}
            onClick={clientFetchProfile}
          >
            <FormattedMessage {...messages.teamErrorButton} />
          </MaybeLoadingButton>
        </ActionButtons>
      )}
    </ErrorWrapper>
  );
};

const TeamProfileCard = (props: TeamProfilecardProps) => {
  const { clientFetchProfile, hasError, isLoading, team } = props;

  if (hasError) {
    return (
      <CardElevationWrapper>
        <CardContainer>
          <ErrorMessage
            clientFetchProfile={clientFetchProfile}
            isLoading={isLoading}
          />
        </CardContainer>
      </CardElevationWrapper>
    );
  }

  if (isLoading) {
    return (
      <CardElevationWrapper>
        <CardContainer>
          <CardHeader isLoading />
          <CardContent>
            <LoadingWrapper>
              <Spinner />
            </LoadingWrapper>
          </CardContent>
        </CardContainer>
      </CardElevationWrapper>
    );
  }

  if (team) {
    return (
      <CardElevationWrapper>
        <TeamProfilecardContent {...{ ...props, team }} />
      </CardElevationWrapper>
    );
  }

  return null;
};

export default TeamProfileCard;
