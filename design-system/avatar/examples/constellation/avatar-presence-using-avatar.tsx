import React from 'react';

import Avatar from '../../src';

export default function AvatarPresenceUsingAvatarExample() {
  return (
    <div>
      <Avatar presence="online" />
      <Avatar presence="busy" />
      <Avatar presence="focus" />
      <Avatar presence="offline" />
    </div>
  );
}
