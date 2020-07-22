/** @jsx jsx */
import { ElementType, MouseEventHandler, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import Avatar, { SizeType } from '@atlaskit/avatar';
import { PopupMenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import Tooltip from '@atlaskit/tooltip';

import AvatarGroupItem from './AvatarGroupItem';
import Grid from './Grid';
import MoreIndicator from './MoreIndicator';
import Stack from './Stack';
import {
  AvatarGroupOverrides,
  AvatarProps,
  DeepRequired,
  onAvatarClickHandler,
} from './types';
import { composeUniqueKey } from './utils';

const MAX_COUNT = {
  grid: 11,
  stack: 5,
};

export interface AvatarGroupProps {
  /**
   * Indicates the layout of the avatar-group.
   * Avatars will either be overlapped in a stack, or
   * laid out in an even grid formation
   * Defaults to "stack".
   */
  appearance?: 'grid' | 'stack';

  /**
   * Component used to render each avatar
   */
  avatar?: ElementType<AvatarProps>;

  /**
   * The maximum number of avatars allowed in the list.
   * Defaults to 5 when displayed as a stack,
   * and 11 when displayed as a grid.
   */
  maxCount?: number;

  /**
   * Defines the size of the avatar.
   * Defaults to "medium".
   */
  size?: SizeType;

  /**
   * Typically the background color that the avatar is presented on.
   * Accepts any color argument that the CSS border-color property accepts.
   */
  borderColor?: string;

  /**
   * Array of avatar data passed to each `avatar` component.
   * These props will be spread on to the component passed into avatar.
   */
  data: Array<AvatarProps>;

  /**
   * Handle the click event on the avatar item
   */
  onAvatarClick?: onAvatarClickHandler;

  /**
   * Take control of the click event on the more indicator.
   * This will cancel the default dropdown behavior. */
  onMoreClick?: MouseEventHandler;

  /**
   * Provide additional props to the MoreButton.
   * Example use cases: altering tab order by providing tabIndex;
   * adding onClick behaviour without losing the default dropdown
   */
  showMoreButtonProps?: Partial<React.HTMLAttributes<HTMLElement>>;

  /**
   * Element the overflow popup should be attached to.
   * Defaults to "viewport".
   */
  boundariesElement?: 'viewport' | 'window' | 'scrollParent';

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.

   * Will set these elements when defined:

   * - Container element - `{testId}--avatar-group`
   * - Avatar items - `{testId}--avatar-{index}`
   * - Overflow menu button - `{testId}--overflow-menu--trigger`
   * - Overflow menu content - `{testId}--overflow-menu--content`
   */
  testId?: string;

  /**
   * Custom overrides for the composed components.
   */
  overrides?: AvatarGroupOverrides;
  /**
   * Disables tooltips
   */
  isTooltipDisabled?: boolean;
}

function getOverrides(
  overrides?: AvatarGroupOverrides,
): DeepRequired<AvatarGroupOverrides> {
  return {
    AvatarGroupItem: {
      render: (Component, props, index) => (
        <Component {...props} key={composeUniqueKey(props.avatar, index)} />
      ),
      ...(overrides && overrides.AvatarGroupItem),
    },
    Avatar: {
      render: (Component, props, index) => (
        <Component {...props} key={composeUniqueKey(props, index)} />
      ),
      ...(overrides && overrides.Avatar),
    },
  };
}

const AvatarGroup = ({
  appearance = 'stack',
  avatar = Avatar,
  borderColor,
  boundariesElement,
  data,
  isTooltipDisabled,
  maxCount,
  onAvatarClick,
  onMoreClick,
  overrides,
  showMoreButtonProps = {},
  size = 'medium',
  testId,
}: AvatarGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = useCallback(() => setIsOpen(false), []);

  function renderMoreDropdown(max: number, total: number) {
    if (total <= max) {
      return null;
    }

    const renderMoreButton = (
      props: {
        'aria-controls'?: string;
        'aria-expanded'?: boolean;
        'aria-haspopup'?: boolean;
      } & {
        onClick: MouseEventHandler;
      },
    ) => (
      <MoreIndicator
        buttonProps={showMoreButtonProps}
        borderColor={borderColor}
        count={total - max}
        size={size}
        testId={testId && `${testId}--overflow-menu--trigger`}
        {...(props as any)}
      />
    );

    // bail if the consumer wants to handle onClick
    if (typeof onMoreClick === 'function') {
      return renderMoreButton({
        onClick: onMoreClick,
      });
    }

    return (
      <Popup
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-end"
        boundariesElement={boundariesElement}
        shouldFlip
        content={() => (
          <PopupMenuGroup
            onClick={e => e.stopPropagation()}
            minWidth={250}
            maxHeight={300}
          >
            <Section>
              {data.slice(max).map((avatar, index) =>
                getOverrides(overrides).AvatarGroupItem.render(
                  AvatarGroupItem,
                  {
                    avatar,
                    onAvatarClick,
                    testId:
                      testId && `${testId}--avatar-group-item-${index + max}`,
                    index: index + max,
                  },
                  // This index holds the true index,
                  // adding up the index of non-overflowed avatars and overflowed avatars.
                  index + max,
                ),
              )}
            </Section>
          </PopupMenuGroup>
        )}
        trigger={triggerProps =>
          renderMoreButton({
            ...triggerProps,
            onClick: () => setIsOpen(!isOpen),
          })
        }
        testId={testId && `${testId}--overflow-menu`}
      />
    );
  }

  const max =
    maxCount === undefined || maxCount === 0 ? MAX_COUNT[appearance] : maxCount;
  const total = data.length;
  const maxAvatar = total > max ? max - 1 : max;
  const Group = appearance === 'stack' ? Stack : Grid;

  return (
    <Group testId={testId && `${testId}--avatar-group`}>
      {data.slice(0, maxAvatar).map((avatarData, idx) => {
        const finalAvatar = getOverrides(overrides).Avatar.render(
          avatar,
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

        return !isTooltipDisabled ? (
          <Tooltip key={avatarData.name} content={avatarData.name}>
            {finalAvatar}
          </Tooltip>
        ) : (
          finalAvatar
        );
      })}
      {renderMoreDropdown(+maxAvatar, total)}
    </Group>
  );
};

export default AvatarGroup;
