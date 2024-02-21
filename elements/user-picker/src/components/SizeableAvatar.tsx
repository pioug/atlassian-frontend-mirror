import Avatar, { AvatarPropTypes } from '@atlaskit/avatar';
import TeamAvatar from '@atlaskit/teams-avatar';
import React from 'react';
import { getAvatarSize } from './utils';

export type Props = {
  appearance: string;
  src?: string;
  name?: string;
  presence?: string;
  type?: 'person' | 'team';
};

export class SizeableAvatar extends React.PureComponent<Props> {
  render() {
    const { src, name, presence, appearance, type = 'person' } = this.props;

    const props: AvatarPropTypes = {
      size: getAvatarSize(appearance),
      src,
      name,
      borderColor: 'transparent',
      presence,
    };

    return type === 'team' ? <TeamAvatar {...props} /> : <Avatar {...props} />;
  }
}
