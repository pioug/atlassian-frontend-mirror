import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarItemIsTruncationDisabled = () => {
  return (
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
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
};

export default AvatarItemIsTruncationDisabled;
