import React from 'react';

import Avatar from '../../src';

const AvatarStatusUsingAvatarExample = () => {
  return (
    <div>
      <Avatar
        status="approved"
        label="Scott Farquhar (approved)"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      />
      <Avatar
        status="declined"
        label="Scott Farquhar (declined)"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      />
      <Avatar
        status="locked"
        label="Scott Farquhar (locked)"
        src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
      />
    </div>
  );
};

export default AvatarStatusUsingAvatarExample;
