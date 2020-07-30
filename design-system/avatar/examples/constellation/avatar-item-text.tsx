import React from 'react';

import Avatar, { AvatarItem } from '../../src';

export default function AvatarItemTextExample() {
  return (
    <AvatarItem
      avatar={<Avatar presence="online" />}
      primaryText="Atlassian CEO"
      secondaryText="CEO@atlassian.com"
    />
  );
}
