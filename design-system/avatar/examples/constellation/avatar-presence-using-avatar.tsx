import React from 'react';

import Avatar from '../../src';

const AvatarPresenceUsingAvatarExample = () => {
  return (
    <div>
      <Avatar presence="online" />
      <Avatar presence="busy" />
      <Avatar presence="focus" />
      <Avatar presence="offline" />
    </div>
  );
};

export default AvatarPresenceUsingAvatarExample;
