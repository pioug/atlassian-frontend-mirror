import React from 'react';

import Avatar from '../../src';

const AvatarPresenceUsingAvatarExample = () => {
  return (
    <div>
      <Avatar
        presence="online"
        label="Scott Farquhar (online)"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      />
      <Avatar
        presence="busy"
        label="Scott Farquhar (busy)"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      />
      <Avatar
        presence="focus"
        label="Scott Farquhar (focus)"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      />
      <Avatar
        presence="offline"
        label="Scott Farquhar (offline)"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      />
    </div>
  );
};

export default AvatarPresenceUsingAvatarExample;
