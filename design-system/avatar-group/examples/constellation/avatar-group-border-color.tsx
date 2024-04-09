import React from 'react';

import {
  getFreeToUseAvatarImage,
  RANDOM_USERS,
} from '../../examples-util/data';
import AvatarGroup from '../../src';

const AvatarGroupBorderColorExample = () => {
  const data = RANDOM_USERS.map((d, i) => ({
    key: d.email,
    name: d.name,
    href: '#',
    src: getFreeToUseAvatarImage(i),
  }));

  return <AvatarGroup data={data} borderColor="#FF6347" />;
};

export default AvatarGroupBorderColorExample;
