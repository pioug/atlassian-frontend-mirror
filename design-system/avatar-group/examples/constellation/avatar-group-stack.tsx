import React from 'react';

import { RANDOM_USERS } from '../../examples-util/data';
import AvatarGroup from '../../src';

const AvatarGroupStackExample = () => {
  const data = RANDOM_USERS.map((d) => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
  }));

  return <AvatarGroup appearance="stack" data={data} />;
};

export default AvatarGroupStackExample;
