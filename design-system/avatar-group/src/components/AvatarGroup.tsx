import React, { Component } from 'react';

import { ThemeProvider } from 'styled-components';

import Avatar, { AvatarPropTypes } from '@atlaskit/avatar';
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Tooltip from '@atlaskit/tooltip';

import { Grid, Stack } from '../styled/AvatarGroup';
import itemTheme from '../theme/itemTheme';

import AvatarGroupItem from './AvatarGroupItem';
import MoreIndicator, { MoreIndicatorProps } from './MoreIndicator';
import { AvatarGroupOverrides, AvatarGroupProps, DeepRequired } from './types';

const GROUP_COMPONENT = {
  grid: Grid,
  stack: Stack,
};

const MAX_COUNT = {
  grid: 11,
  stack: 5,
};

export default class AvatarGroup extends Component<AvatarGroupProps> {
  static defaultProps = {
    appearance: 'stack',
    avatar: Avatar,
    showMoreButtonProps: {},
    size: 'medium',
  };

  getOverrides(): DeepRequired<AvatarGroupOverrides> {
    return {
      AvatarGroupItem: {
        render: (Component, props, index) => (
          <Component {...props} key={index} />
        ),
        ...(this.props.overrides && this.props.overrides.AvatarGroupItem),
      },
      Avatar: {
        render: (Component, props, index) => (
          <Component {...props} key={index} />
        ),
        ...(this.props.overrides && this.props.overrides.Avatar),
      },
    };
  }

  renderMoreDropdown(max: number, total: number) {
    const {
      appearance,
      data,
      borderColor,
      onMoreClick,
      showMoreButtonProps,
      onAvatarClick,
      size,
      boundariesElement,
      testId,
    } = this.props;

    // bail if there's not enough items
    if (total <= max) return null;

    // prepare the button -- we'll use it twice
    const renderMoreButton = (props: MoreIndicatorProps = {}) => (
      <MoreIndicator
        {...showMoreButtonProps}
        borderColor={borderColor}
        count={total - max}
        isInteractive
        isStack={appearance === 'stack'}
        size={size}
        testId={testId && `${testId}--overflow-menu--trigger`}
        {...(props as any)}
      />
    );

    // bail if the consumer wants to handle onClick
    if (typeof onMoreClick === 'function') {
      return renderMoreButton({ onClick: onMoreClick });
    }

    // crop and prepare the dropdown items
    const items = data
      .slice(max)
      .map((avatar: AvatarPropTypes, index: number) =>
        this.getOverrides().AvatarGroupItem.render(
          AvatarGroupItem,
          {
            avatar,
            onAvatarClick,
            testId: testId && `${testId}--avatar-group-item-${index}`,
            index: index + max,
          },
          // This index holds the true index,
          // adding up the index of non-overflowed avatars and overflowed avatars.
          index + max,
        ),
      );

    return (
      <DropdownMenu
        trigger={renderMoreButton()}
        position="bottom right"
        boundariesElement={boundariesElement}
        testId={testId && `${testId}--overflow-menu`}
        shouldFlip
      >
        <ThemeProvider theme={itemTheme}>
          <DropdownItemGroup>{items}</DropdownItemGroup>
        </ThemeProvider>
      </DropdownMenu>
    );
  }

  render() {
    const {
      avatar: Item,
      appearance,
      borderColor,
      data,
      maxCount,
      onAvatarClick,
      size,
      testId,
    } = this.props;
    // NOTE: conditionally defaulting the `maxCount` prop based on `appearance`
    const max =
      // Check if it's zero since that's what it checked before, just in case.
      maxCount === undefined || maxCount === 0
        ? MAX_COUNT[appearance]
        : maxCount;
    const total = data.length;
    const Group = GROUP_COMPONENT[appearance];

    // Render (max - 1) avatars to leave space for moreIndicator
    const maxAvatar = total > max ? max - 1 : max;

    const items = data.slice(0, maxAvatar).map((avatarData, idx) => {
      const avatar = this.getOverrides().Avatar.render(
        Item,
        {
          ...avatarData,
          size,
          borderColor,
          testId: testId && `${testId}--avatar-${idx}`,
          onClick: (event, analyticsEvent) => {
            const callback = avatarData.onClick || onAvatarClick;

            if (callback) {
              callback(event, analyticsEvent, idx);
            }
          },
          stackIndex: max - idx,
        },
        idx,
      );

      return avatarData.name && avatarData.enableTooltip !== false ? (
        <Tooltip key={idx} content={avatarData.name}>
          {avatar}
        </Tooltip>
      ) : (
        avatar
      );
    });

    return (
      <Group size={size} data-testid={testId && `${testId}--avatar-group`}>
        {items}
        {this.renderMoreDropdown(+maxAvatar, total)}
      </Group>
    );
  }
}
