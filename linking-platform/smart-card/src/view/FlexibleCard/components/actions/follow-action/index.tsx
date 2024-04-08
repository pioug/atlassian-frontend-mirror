import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import ServerAction from '../action/server-action';
import { FollowActionProps } from './types';
import UnfollowIcon from './unfollow-icon';

const FollowAction: React.FC<FollowActionProps> = (props) => {
  const context = useFlexibleUiContext();
  if (!context || !context?.actions?.[ActionName.FollowAction]) {
    return null;
  }

  const { value, ...data } = context?.actions?.[ActionName.FollowAction];
  const message = value ? messages.follow : messages.unfollow;
  const icon = value ? (
    <InviteTeamIcon label="Follow" />
  ) : (
    <UnfollowIcon label="Unfollow" />
  );

  return (
    <ServerAction
      content={<FormattedMessage {...message} />}
      icon={icon}
      testId="smart-action-follow-action"
      tooltipMessage={<FormattedMessage {...message} />}
      {...data}
      {...props}
    />
  );
};

export default FollowAction;
