import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarSecondaryTextExample = () => {
  return (
    <AvatarItem
      avatar={<Avatar presence="online" />}
      secondaryText="Scott Farquhar"
    />
  );
};

export default AvatarSecondaryTextExample;
