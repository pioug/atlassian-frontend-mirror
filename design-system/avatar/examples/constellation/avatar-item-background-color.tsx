import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarItemBackgroundColorExample = () => (
  <AvatarItem
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    backgroundColor="pink"
    avatar={
      <Avatar
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
        presence="online"
        label="Scott Farquhar (online)"
      />
    }
  />
);

export default AvatarItemBackgroundColorExample;
