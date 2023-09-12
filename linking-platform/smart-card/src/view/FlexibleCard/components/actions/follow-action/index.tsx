import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../../../messages';

import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import ServerAction from '../action/server-action';
import type { ActionProps } from '../action/types';
import UnfollowIcon from './unfollow-icon';

const FollowAction: React.FC<ActionProps> = (props) => {
  const context = useContext(FlexibleUiContext);
  if (!context || !context.followAction) {
    return null;
  }

  const { value, ...data } = context.followAction;
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
