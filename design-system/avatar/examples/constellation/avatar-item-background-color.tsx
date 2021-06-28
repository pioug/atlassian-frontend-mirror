import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarItemBackgroundColorExample = () => {
  return (
    <AvatarItem backgroundColor="pink" avatar={<Avatar presence="online" />} />
  );
};

export default AvatarItemBackgroundColorExample;
