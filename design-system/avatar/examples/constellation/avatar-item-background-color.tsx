import React from 'react';

import Avatar, { AvatarItem } from '../../src';

export default function AvatarItemBackgroundColorExample() {
  return (
    <AvatarItem backgroundColor="pink" avatar={<Avatar presence="online" />} />
  );
}
