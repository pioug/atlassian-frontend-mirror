import React from 'react';

import Avatar from '../../src';

export default function AvatarStatusUsingAvatarExample() {
  return (
    <div>
      <Avatar status="approved" />
      <Avatar status="declined" />
      <Avatar status="locked" />
    </div>
  );
}
