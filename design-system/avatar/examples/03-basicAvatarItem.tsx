// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { RANDOM_USERS } from '../examples-util/data';
import Avatar, { AvatarItem } from '../src';

const presenceOptions = ['online', 'busy', 'focus', 'offline'];
const statusOptions = ['approved', 'declined', 'locked'];

const presenceOptionsLength = presenceOptions.length;
const statusOptionsLength = statusOptions.length;

export default () => {
  const data = RANDOM_USERS.slice(
    0,
    presenceOptionsLength + statusOptionsLength,
  ).map((user, i) => {
    const presence = presenceOptions[i % presenceOptionsLength];
    const status =
      i > statusOptionsLength
        ? statusOptions[i % statusOptionsLength]
        : undefined;
    return {
      ...user,
      presence,
      status,
      label: `${user.name} ${user.email} (${status || presence})`,
    };
  });

  return (
    <div id="avatar-item-examples" style={{ display: 'flex' }}>
      <div>
        <div style={{ maxWidth: 270, padding: 20 }}>
          <h1>onClick</h1>
          {data.map((user, index) => (
            <AvatarItem
              avatar={<Avatar presence={user.presence} status={user.status} />}
              key={user.email}
              onClick={console.log}
              primaryText={user.name}
              secondaryText={user.email}
              testId={`avataritem-onClick-${index}`}
              label={user.label}
            />
          ))}
        </div>
        <div style={{ maxWidth: 270, padding: 20 }}>
          <h1>href</h1>
          {data.map((user, index) => (
            <AvatarItem
              avatar={<Avatar presence={user.presence} status={user.status} />}
              key={user.email}
              href="#"
              primaryText={user.name}
              secondaryText={user.email}
              testId={`avataritem-href-${index}`}
              label={user.label}
            />
          ))}
        </div>
      </div>
      <div>
        <div style={{ maxWidth: 270, padding: 20 }}>
          <h1>non-interactive</h1>
          {data.map((user, index) => (
            <AvatarItem
              avatar={<Avatar presence={user.presence} status={user.status} />}
              key={user.email}
              primaryText={user.name}
              secondaryText={user.email}
              testId={`avataritem-non-interactive-${index}`}
              label={user.label}
            />
          ))}
        </div>
        <div style={{ maxWidth: 270, padding: 20 }}>
          <h1>disabled</h1>
          {data.map((user, index) => (
            <AvatarItem
              avatar={<Avatar presence={user.presence} status={user.status} />}
              key={user.email}
              primaryText={user.name}
              secondaryText={user.email}
              href="#"
              testId={`avataritem-disabled-${index}`}
              label={user.label}
              isDisabled
            />
          ))}
        </div>
      </div>
    </div>
  );
};
