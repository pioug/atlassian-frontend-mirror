import React from 'react';

import Avatar, { AvatarItem } from '../../src';

export default function AvatarSecondaryTextExample() {
  return (
    <AvatarItem
      avatar={<Avatar presence="online" />}
      secondaryText="Scott Farquhar"
    />
  );
}
