import Avatar from '@atlaskit/avatar';
import React from 'react';
import { getAvatarSize } from './utils';

export class Props {
  appearance!: string;
  src?: string;
  name?: string;
  presence?: string;
}

export class SizeableAvatar extends React.PureComponent<Props> {
  render() {
    const { src, name, presence, appearance } = this.props;

    return (
      <Avatar
        size={getAvatarSize(appearance)}
        src={src}
        name={name}
        borderColor="transparent"
        presence={presence}
      />
    );
  }
}
