import React from 'react';

import Avatar, { AvatarItem } from '../../src';

export default function AvatarPrimaryTextExample() {
  return (
    <AvatarItem
      avatar={<Avatar presence="online" />}
      primaryText="Mike Cannon-Brookes"
    />
  );
}
