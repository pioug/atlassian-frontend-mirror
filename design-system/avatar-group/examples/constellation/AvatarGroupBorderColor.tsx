import React from 'react';
import AvatarGroup from '../../src';
import { RANDOM_USERS } from '../../examples-util/data';

export default () => {
  const data = RANDOM_USERS.map(d => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
  }));

  return <AvatarGroup data={data} borderColor="#FF6347" />;
};
