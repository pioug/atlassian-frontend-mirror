import React from 'react';

import { RANDOM_USERS } from '../../examples-util/data';
import AvatarGroup from '../../src';

export default () => {
  const data = RANDOM_USERS.map(d => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
  }));

  return (
    <div style={{ maxWidth: 200 }}>
      <AvatarGroup appearance="grid" maxCount={14} data={data} />
    </div>
  );
};
