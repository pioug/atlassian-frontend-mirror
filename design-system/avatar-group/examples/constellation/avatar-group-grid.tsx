import React from 'react';

import {
  getFreeToUseAvatarImage,
  RANDOM_USERS,
} from '../../examples-util/data';
import AvatarGroup from '../../src';

const AvatarGroupGridExample = () => {
  const data = RANDOM_USERS.map((d, i) => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
    src: getFreeToUseAvatarImage(i),
  }));

  return (
    <div style={{ maxWidth: 200 }}>
      <AvatarGroup appearance="grid" data={data} />
    </div>
  );
};

export default AvatarGroupGridExample;
