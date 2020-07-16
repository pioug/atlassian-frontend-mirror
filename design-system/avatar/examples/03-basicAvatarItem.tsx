import React from 'react';

import { getAdorableAvatar, RANDOM_USERS } from '../examples-util/data';
import Avatar, { AvatarItem } from '../src';

export default () => {
  const data = RANDOM_USERS.map(user => ({
    ...user,
    src: getAdorableAvatar(user.email),
  }));

  return (
    <div style={{ maxWidth: 270 }}>
      {data.map((user, index) => (
        <AvatarItem
          avatar={<Avatar src={user.src} presence="busy" />}
          key={user.email}
          onClick={console.log}
          primaryText={user.name}
          secondaryText={user.email}
          testId={`avataritem${index}`}
        />
      ))}
    </div>
  );
};
