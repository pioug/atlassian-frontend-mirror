import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import Avatar from '../../src';

export default function AvatarHoverExample() {
  return (
    <Tooltip content="Mike Cannon-Brookes">
      <Avatar
        name="Mike Cannon-Brookes"
        src="https://pbs.twimg.com/profile_images/568401563538841600/2eTVtXXO_400x400.jpeg"
        size="large"
        onClick={console.log}
      />
    </Tooltip>
  );
}
