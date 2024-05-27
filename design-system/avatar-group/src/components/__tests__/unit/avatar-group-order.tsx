/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React, { useEffect } from 'react';

import { render } from '@testing-library/react';

import Avatar, { type AppearanceType, type SizeType } from '@atlaskit/avatar';

import { RANDOM_USERS } from '../../../../examples-util/data';
import AvatarGroup, { type AvatarGroupProps } from '../../avatar-group';
import { type AvatarProps } from '../../types';
import { composeUniqueKey } from '../../utils';

const generateData = (avatarCount: number) => {
  return RANDOM_USERS.slice(0, avatarCount).map((user, index) => ({
    name: user.name,
    src: `#${index}`,
    key: user.email,
    size: 'medium' as SizeType,
    appearance: 'circle' as AppearanceType,
    href: '#',
  }));
};

const createAvatarAuditor =
  ({ onMount, onUnmount }: { onMount: () => void; onUnmount: () => void }) =>
  (props: AvatarProps) => {
    useEffect(() => {
      onMount();

      return () => onUnmount();
    }, []); // [] forces the effect to only run once on mount/unmount.

    return <Avatar {...props} />;
  };

const createAvatarGroup = (
  props: AvatarGroupProps,
  withUniqueIndex = false,
) => {
  return (
    <AvatarGroup
      testId="test"
      maxCount={4}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...props}
      overrides={{
        Avatar: {
          render: (Component, props: AvatarProps, index: number) => (
            <Component
              {...props}
              key={withUniqueIndex ? composeUniqueKey(props, index) : index}
            />
          ),
        },
      }}
    />
  );
};

describe('avatar group re-ordering', () => {
  const rearrange = (data: Array<any>) => {
    const updated = [...data];

    updated[0] = data[2];
    updated[2] = data[0];

    return updated;
  };

  const avatarCount = 4;
  const data = generateData(avatarCount);

  it('render with unique key', () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();

    const Avatar = createAvatarAuditor({ onMount, onUnmount });

    const { rerender } = render(
      createAvatarGroup(
        {
          data,
          avatar: Avatar,
        },
        true,
      ),
    );

    expect(onMount.mock.calls.length).toBe(avatarCount);

    rerender(
      createAvatarGroup(
        {
          data: rearrange(data),
          avatar: Avatar,
        },
        true,
      ),
    );

    // should not have unmount triggered
    expect(onUnmount.mock.calls.length).toBe(0);
  });

  it('render with index', () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();

    const Avatar = createAvatarAuditor({ onMount, onUnmount });

    const { rerender } = render(
      createAvatarGroup(
        {
          data,
          avatar: Avatar,
        },
        false,
      ),
    );

    expect(onMount.mock.calls.length).toBe(avatarCount);

    rerender(
      createAvatarGroup(
        {
          data: rearrange(data),
          avatar: Avatar,
        },
        false,
      ),
    );

    // should have 2 unmount triggered
    expect(onUnmount.mock.calls.length).toBe(2);
  });
});
