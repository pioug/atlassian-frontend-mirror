import React from 'react';

import Avatar, { AvatarItem } from '../../src';

export default function AvatarItemIsDisabledExample() {
  return <AvatarItem isDisabled avatar={<Avatar presence="online" />} />;
}
