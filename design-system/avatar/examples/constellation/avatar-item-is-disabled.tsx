import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarItemIsDisabledExample = () => {
  return <AvatarItem isDisabled avatar={<Avatar presence="online" />} />;
};

export default AvatarItemIsDisabledExample;
