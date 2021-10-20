import React, { Fragment } from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AppearanceType, SizeType } from '@atlaskit/avatar';

import AvatarGroup from '../../avatar-group';

const generateData = ({
  avatarCount,
  href,
  onClick,
  disabledIndexes,
}: {
  avatarCount: number;
  href?: string;
  onClick?: () => void;
  disabledIndexes?: number[];
}) => {
  const data = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < avatarCount; i++) {
    data.push({
      name: `Name ${i}`,
      src: `#${i}`,
      size: 'medium' as SizeType,
      appearance: 'circle' as AppearanceType,
      isDisabled: disabledIndexes ? disabledIndexes.includes(i) : undefined,
      href,
      onClick,
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
        data={generateData({ avatarCount: 2 })}
        maxCount={1}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        overrides={{
          AvatarGroupItem: {
            render: (Component, props, index) =>
              index === 1 ? (
                <Fragment key={index}>
                  <Component {...props} />
                  <button
                    type="button"
                    onClick={callback}
                    data-testid="custom-button"
                  >
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
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData({ avatarCount: 1 })}
      />,
    );

    expect(queryByTestId('test--avatar-0')).not.toBeNull();
  });

  it('should not render overflow menu trigger when none avatars have been overflowed', () => {
    const { queryByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData({ avatarCount: 1 })}
      />,
    );

    expect(queryByTestId('test--overflow-menu--trigger')).toEqual(null);
  });

  it('should render the second avatar', () => {
    const { queryByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData({ avatarCount: 2 })}
      />,
    );

    expect(queryByTestId('test--avatar-1')).not.toBeNull();
  });

  it('should render the third avatar', () => {
    const { queryByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData({ avatarCount: 3 })}
      />,
    );

    expect(queryByTestId('test--avatar-2')).not.toBeNull();
  });

  it('should render the overflow menu trigger showing there are three avatars that have been overflowed', () => {
    const { queryByText } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData({ avatarCount: 5 })}
        // While max count is 3 - 3 items will be moved into the overflow menu
        // because the third item will now be the trigger itself!
        maxCount={3}
      />,
    );

    expect(queryByText('+3')).not.toBeNull();
  });

  it('should set href to overflowed avatar dropdown item', () => {
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={[
          {
            name: 'Name 0',
            src: '#0',
            size: 'medium',
            appearance: 'circle',
            href: '#',
          },
          {
            name: 'Name 1',
            src: '#1',
            size: 'medium',
            appearance: 'circle',
            href: '#',
          },
        ]}
        maxCount={1}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));

    expect(
      getByTestId('test--avatar-group-item-1').getAttribute('href'),
    ).toEqual('#');
  });

  it('should set labels to avatar items', async () => {
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 5 })}
        // While max count is 4 - 2 items will be moved into the overflow menu
        // because the fourth item will now be the trigger itself!
        maxCount={4}
      />,
    );

    const avatarGroup = getByTestId('test--avatar-group');

    const avatarLabelList = avatarGroup.querySelectorAll('span[aria-label]');
    // there are should be 3 avatar and 1 dropdown trigger button
    expect(avatarLabelList).toHaveLength(3);

    avatarLabelList.forEach((element, i) => {
      expect(element.getAttribute('aria-label')).toBe(`Name ${i}`);
    });
  });

  it('should NOT set labels to dropdown avatar items', async () => {
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 5 })}
        // While max count is 3 - 3 items will be moved into the overflow menu
        // because the third item will now be the trigger itself!
        maxCount={3}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));

    const overflowMenu = getByTestId('test--overflow-menu');
    const avatarLabelList = overflowMenu.querySelectorAll('span[aria-label]');

    expect(avatarLabelList).toHaveLength(0);
  });

  it('should ensure href is not set on the avatar inside the overflowed dropdown item', () => {
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        appearance="stack"
        data={generateData({ avatarCount: 2 })}
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
        data={generateData({ avatarCount: 4 })}
        maxCount={3}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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
        data={generateData({ avatarCount: 4 })}
        maxCount={3}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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

  it('should pass the index of the avatar when onAvatarClicked is fired from the more menu', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4 })}
        maxCount={3}
        onAvatarClick={onClick}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));
    fireEvent.click(getByTestId('test--avatar-group-item-3--avatar--inner'));

    expect(onClick).toHaveBeenCalledWith(expect.anything(), undefined, 3);
  });

  it('onClick handlers provided via showMoreButtonProps should still open the dropdown', () => {
    const onClick = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4 })}
        maxCount={3}
        showMoreButtonProps={{
          onClick,
        }}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));

    expect(
      queryByTestId('test--avatar-group-item-3--avatar--inner'),
    ).toBeTruthy();
    expect(onClick).toHaveBeenCalled();
  });

  it('onMoreClick should not open the dropdown', () => {
    const onClick = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4 })}
        maxCount={3}
        onMoreClick={onClick}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));

    expect(
      queryByTestId('test--avatar-group-item-3--avatar--inner'),
    ).not.toBeTruthy();
    expect(onClick).toHaveBeenCalled();
  });

  it('should pass the index of the avatar when onAvatarClicked is fired', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={[
          {
            name: 'Name 0',
            src: '#0',
            size: 'medium' as SizeType,
            appearance: 'circle' as AppearanceType,
          },
        ]}
        onAvatarClick={onClick}
      />,
    );

    fireEvent.click(getByTestId('test--avatar-0--inner'));

    expect(onClick).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      0,
    );
  });

  it('should pass the index of the avatar when is fired', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={[
          {
            name: 'Name 0',
            src: '#0',
            size: 'medium',
            appearance: 'circle',
            onClick,
          },
        ]}
      />,
    );

    fireEvent.click(getByTestId('test--avatar-0--inner'));

    expect(onClick).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      0,
    );
  });

  it('should call onClick provided with avatar data on anchor elements in avatar group popup', () => {
    const onClick = jest.fn();
    const onAvatarClick = jest.fn();

    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4, href: '#', onClick })}
        maxCount={3}
        onAvatarClick={onAvatarClick}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));
    fireEvent.click(getByTestId('test--avatar-group-item-3--avatar--inner'));

    // onClick should take precedence over onAvatarClick
    expect(onClick).toHaveBeenCalled();
    expect(onAvatarClick).not.toHaveBeenCalled();
  });

  it('should call onClick provided with avatar data on button elements in avatar group popup', () => {
    const onClick = jest.fn();
    const onAvatarClick = jest.fn();

    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4, onClick })}
        maxCount={3}
        onAvatarClick={onAvatarClick}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));
    fireEvent.click(getByTestId('test--avatar-group-item-3--avatar--inner'));

    // onClick should take precedence over onAvatarClick
    expect(onClick).toHaveBeenCalled();
    expect(onAvatarClick).not.toHaveBeenCalled();
  });

  it('should call onAvatarClick on href elements in avatar group popup if onClick is not provided', () => {
    const onAvatarClick = jest.fn();

    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4, href: '#' })}
        maxCount={3}
        onAvatarClick={onAvatarClick}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));
    fireEvent.click(getByTestId('test--avatar-group-item-3--avatar--inner'));

    expect(onAvatarClick).toHaveBeenCalled();
  });

  it('should call onAvatarClick on button elements in avatar group popup if onClick is not provided', () => {
    const onAvatarClick = jest.fn();

    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4 })}
        maxCount={3}
        onAvatarClick={onAvatarClick}
      />,
    );

    fireEvent.click(getByTestId('test--overflow-menu--trigger'));
    fireEvent.click(getByTestId('test--avatar-group-item-3--avatar--inner'));

    expect(onAvatarClick).toHaveBeenCalled();
  });

  it('container should be marked as unordered list', () => {
    const onAvatarClick = jest.fn();

    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 4 })}
        maxCount={3}
        onAvatarClick={onAvatarClick}
      />,
    );

    const container = getByTestId('test--avatar-group');

    expect(container!.tagName).toBe('UL');
  });

  it('avatar items should be marked as list items', () => {
    const onAvatarClick = jest.fn();

    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 3 })}
        maxCount={3}
        onAvatarClick={onAvatarClick}
      />,
    );

    const container = getByTestId('test--avatar-group');
    expect(container).toBeDefined();

    const listItems = container!.querySelectorAll('li');
    expect(listItems).toBeDefined();
    expect(listItems).toHaveLength(3);
  });

  it('should set received label as aria-label of avatar group list', () => {
    const onAvatarClick = jest.fn();

    const { getByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 3 })}
        maxCount={3}
        label="Contributors"
        onAvatarClick={onAvatarClick}
      />,
    );

    const container = getByTestId('test--avatar-group');
    expect(container.getAttribute('aria-label')).toBe('Contributors');
  });

  it('should not be wrapped into the Tooltip when disabled', () => {
    const { queryByTestId } = render(
      <AvatarGroup
        testId="test"
        data={generateData({ avatarCount: 3, disabledIndexes: [1] })}
        maxCount={3}
      />,
    );

    const [firstAvatar, secondAvatar, thirdAvatar] = [
      queryByTestId('test--tooltip-0--container'),
      queryByTestId('test--tooltip-1--container'),
      queryByTestId('test--tooltip-2--container'),
    ];

    expect(firstAvatar).not.toBeNull();
    expect(secondAvatar).toBeNull();
    expect(thirdAvatar).not.toBeNull();
  });
});
