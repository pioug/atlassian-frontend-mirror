/* eslint-disable @repo/internal/react/no-unsafe-overrides */
import React, { ElementType, useEffect } from 'react';

import { render } from '@testing-library/react';

import Avatar, { AppearanceType, SizeType } from '@atlaskit/avatar';

import { RANDOM_USERS } from '../../../../examples-util/data';
import AvatarGroup from '../../avatar-group';
import { AvatarProps } from '../../types';
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

const createAvatarAuditor = ({
  onMount,
  onUnmount,
}: {
  onMount: () => void;
  onUnmount: () => void;
}) => (props: AvatarProps) => {
  useEffect(() => {
    onMount();

    return () => onUnmount();
  }, []); // [] forces the effect to only run once on mount/unmount.

  return <Avatar {...props} />;
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
    const overrides = {
      Avatar: {
        render: (
          Component: ElementType<AvatarProps>,
          props: AvatarProps,
          index: number,
        ) => <Component {...props} key={composeUniqueKey(props, index)} />,
      },
    };

    const { rerender } = render(
      <AvatarGroup
        testId="test"
        data={data}
        avatar={Avatar}
        maxCount={4}
        overrides={overrides}
      />,
    );

    expect(onMount.mock.calls.length).toBe(avatarCount);

    rerender(
      <AvatarGroup
        testId="test"
        data={rearrange(data)}
        maxCount={4}
        avatar={Avatar}
        overrides={overrides}
      />,
    );

    // should not have unmount triggered
    expect(onUnmount.mock.calls.length).toBe(0);
  });

  it('render with index', () => {
    const onMount = jest.fn();
    const onUnmount = jest.fn();

    const Avatar = createAvatarAuditor({ onMount, onUnmount });
    const overrides = {
      Avatar: {
        render: (
          Component: ElementType<AvatarProps>,
          props: AvatarProps,
          index: number,
        ) => <Component {...props} key={index} />,
      },
    };

    const { rerender } = render(
      <AvatarGroup
        testId="test"
        data={data}
        maxCount={4}
        avatar={Avatar}
        overrides={overrides}
      />,
    );

    expect(onMount.mock.calls.length).toBe(avatarCount);

    rerender(
      <AvatarGroup
        testId="test"
        data={rearrange(data)}
        maxCount={4}
        avatar={Avatar}
        overrides={overrides}
      />,
    );

    // should have 2 unmount triggered
    expect(onUnmount.mock.calls.length).toBe(2);
  });
});
