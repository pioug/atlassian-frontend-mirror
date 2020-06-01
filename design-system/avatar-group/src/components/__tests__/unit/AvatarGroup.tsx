import React, { Fragment } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AppearanceType, SizeType } from '@atlaskit/avatar';

import AvatarGroup from '../../AvatarGroup';

const generateData = (avatarCount: number) => {
  const data = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < avatarCount; i++) {
    data.push({
      name: `Name ${i}`,
      src: `#${i}`,
      size: 'medium' as SizeType,
      appearance: 'circle' as AppearanceType,
      href: '#',
    });
  }
  return data;
};

describe('<AvatarGroup />', () => {
  it('should override add clickable button beside the last overflowed avatar item', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData(2)}
        maxCount={1}
        overrides={{
          AvatarGroupItem: {
            render: (Component, props, index) =>
              index === 1 ? (
                <Fragment key={index}>
                  <Component {...props} />
                  <button onClick={callback} data-testid="custom-button">
                    hello world
                  </button>
                </Fragment>
              ) : (
                <Component {...props} key={index} />
              ),
          },
        }}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));
    fireEvent.click(getByTestId('custom-button'));

    expect(callback).toHaveBeenCalled();
  });

  it('should display a single avatar', () => {
    const { queryByTestId } = render(
      <AvatarGroup testId="test" appearance="stack" data={generateData(1)} />,
    );

    expect(queryByTestId('test--avatar-0')).not.toBeNull();
  });

  it('should not render overflow menu trigger when none avatars have been overflowed', () => {
    const { queryByTestId } = render(
      <AvatarGroup testId="test" appearance="stack" data={generateData(1)} />,
    );

    expect(queryByTestId('test--overflow-menu--trigger')).toEqual(null);
  });

  it('should render the second avatar', () => {
    const { queryByTestId } = render(
      <AvatarGroup testId="test" appearance="stack" data={generateData(2)} />,
    );

    expect(queryByTestId('test--avatar-1')).not.toBeNull();
  });

  it('should render the third avatar', () => {
    const { queryByTestId } = render(
      <AvatarGroup testId="test" appearance="stack" data={generateData(3)} />,
    );

    expect(queryByTestId('test--avatar-2')).not.toBeNull();
  });

  it('should render the overflow menu trigger showing there are three avatars that have been overflowed', () => {
    const { queryByText } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData(5)}
        // While max count is 3 - 3 items will be moved into the overflow menu
        // because the third item will now be the trigger itself!
        maxCount={3}
      />,
    );

    expect(queryByText('+3')).not.toBeNull();
  });

  it('should set href to overflowed avatar dropdown item', () => {
    const { getByTestId, getAllByRole } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData(2)}
        maxCount={1}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));

    expect(getAllByRole('menuitem')[0].getAttribute('href')).toEqual('#');
  });

  it('should ensure href is not set on the avatar inside the overflowed dropdown item', () => {
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData(2)}
        maxCount={1}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));

    expect(
      getByTestId('test--avatar-group-item-0--avatar').getAttribute('href'),
    ).toEqual(null);
  });

  it('should start overflow index from max count when passing index to override render function', () => {
    const { getAllByTestId, getByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData(4)}
        maxCount={3}
        overrides={{
          AvatarGroupItem: {
            render: (_, __, index) => (
              <div key={index} data-testid="avatar-overflow" data-index={index}>
                hello world
              </div>
            ),
          },
        }}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));

    expect(
      getAllByTestId('avatar-overflow')[0].getAttribute('data-index'),
    ).toEqual('2');
  });

  it('should use the same index for visible avatar when passing index to override render function', () => {
    const { getAllByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData(4)}
        maxCount={3}
        overrides={{
          Avatar: {
            render: (_, __, index) => (
              <div key={index} data-testid="avatar" data-index={index}>
                hello world
              </div>
            ),
          },
        }}
      />,
    );

    expect(getAllByTestId('avatar')[0].getAttribute('data-index')).toEqual('0');
  });
});
