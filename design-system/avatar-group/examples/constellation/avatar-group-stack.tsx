import React from 'react';

import {
  getFreeToUseAvatarImage,
  RANDOM_USERS,
} from '../../examples-util/data';
import AvatarGroup from '../../src';

const AvatarGroupStackExample = () => {
  const data = RANDOM_USERS.map((d, i) => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
    src: getFreeToUseAvatarImage(i),
  }));

  return <AvatarGroup appearance="stack" data={data} />;
};

export default AvatarGroupStackExample;
