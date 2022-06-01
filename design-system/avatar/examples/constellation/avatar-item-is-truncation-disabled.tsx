import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarItemIsTruncationDisabled = () => {
  return (
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    <div style={{ maxWidth: 120, border: '1px solid pink' }}>
      <AvatarItem
        avatar={
          <Avatar
            src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
            name="Scott Farquhar"
          />
        }
        primaryText="Scott"
        secondaryText="scott@atlassian.com"
        isTruncationDisabled={true}
      />
      <AvatarItem
        avatar={
          <Avatar
            src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
            name="Scott Farquhar"
          />
        }
        primaryText="Scott"
        secondaryText="Scott@atlassian.com"
        isTruncationDisabled={false}
      />
    </div>
  );
};

export default AvatarItemIsTruncationDisabled;
