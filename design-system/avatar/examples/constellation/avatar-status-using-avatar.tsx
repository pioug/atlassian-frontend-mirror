import React from 'react';

import Avatar from '../../src';

const AvatarStatusUsingAvatarExample = () => {
  return (
    <div>
      <Avatar status="approved" />
      <Avatar status="declined" />
      <Avatar status="locked" />
    </div>
  );
};

export default AvatarStatusUsingAvatarExample;
