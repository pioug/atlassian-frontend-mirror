import React from 'react';

import AvatarGroup from '../src';

const data = [
  { email: 'chaki@me.com', name: 'Chaki Caronni' },
  { email: 'nanop@outlook.com', name: 'Nanop Rgiersig' },
];

export default () => {
  return (
    <AvatarGroup
      data={data.map((d) => ({
        email: d.email,
        key: d.email,
        name: d.name,
        href: '#',
      }))}
    />
  );
};
