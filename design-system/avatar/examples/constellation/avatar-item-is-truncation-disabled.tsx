import React from 'react';

import Avatar, { AvatarItem } from '../../src';

export default function AvatarItemIsTruncationDisabled() {
  return (
    <div style={{ maxWidth: 120, border: '1px solid pink' }}>
      <AvatarItem
        avatar={<Avatar />}
        primaryText="Jennie"
        secondaryText="jennie@atlassian.com"
        isTruncationDisabled={true}
      />
      <AvatarItem
        avatar={<Avatar />}
        primaryText="Jennie"
        secondaryText="jennie@atlassian.com"
        isTruncationDisabled={false}
      />
    </div>
  );
}
