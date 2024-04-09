import React from 'react';

import {
  getFreeToUseAvatarImage,
  RANDOM_USERS,
} from '../../examples-util/data';
import AvatarGroup from '../../src';

const AvatarGroupSizeExample = () => {
  const data = RANDOM_USERS.map((d, i) => ({
    key: d.email,
    name: d.name,
    href: '#',
    src: getFreeToUseAvatarImage(i),
  }));

  return <AvatarGroup data={data} size="large" />;
};

export default AvatarGroupSizeExample;
