/** @jsx jsx */
import { ElementType, MouseEventHandler, useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import Avatar, { SizeType } from '@atlaskit/avatar';
import { PopupMenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';
import { layers } from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

import AvatarGroupItem from './avatar-group-item';
import Grid from './grid';
import MoreIndicator from './more-indicator';
import Stack from './stack';
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
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  data: Array<AvatarProps>;

  /**
   * Handle the click event on the avatar item.
   * Note that if an onClick prop is provided as part of avatar data, it will take precedence over onAvatarClick.
   */
  onAvatarClick?: onAvatarClickHandler;

  /**
   * Take control of the click event on the more indicator.
   * This will cancel the default dropdown behavior.
   */
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
   */
  //

  /**
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
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  overrides?: AvatarGroupOverrides;
  /**
   * Disables tooltips
   */
  isTooltipDisabled?: boolean;

  /**
   * Text to be used as aria-label of avatar's list.
   *
   * Screen reader announcement with default label, which is `avatar group`, is `list, avatar group, X items`.
   *
   * The label should describe the `AvatarGroup`'s entities, for instance:
   *
   * - `label="team members"`, screen reader announcement would be `list team members, X items`
   * - `label="reviewers"` screen reader announcement would be `list reviewers, X items`
   *
   * When there are several AvatarGroups on the page you should use a unique label to let users distinguish different lists.
   */
  label?: string;
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

/**
 * __Avatar group__
 *
 * An avatar group displays a number of avatars grouped together in a stack or grid.
 *
 * - [Examples](https://atlassian.design/components/avatar-group/examples)
 * - [Code](https://atlassian.design/components/avatar-group/code)
 * - [Usage](https://atlassian.design/components/avatar-group/usage)
 */
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
  label = 'avatar group',
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
        isActive={isOpen}
        {...(props as any)}
      />
    );

    // bail if the consumer wants to handle onClick
    if (typeof onMoreClick === 'function') {
      return renderMoreButton({
        onClick: onMoreClick,
      });
    }

    // split boundariesElement into `boundary` and `rootBoundary` props for Popup
    const boundary =
      boundariesElement === 'scrollParent' ? 'clippingParents' : undefined;
    const rootBoundary = (() => {
      if (boundariesElement === 'scrollParent') {
        return undefined;
      }
      return boundariesElement === 'window' ? 'document' : 'viewport';
    })();

    return (
      <Popup
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-end"
        boundary={boundary}
        rootBoundary={rootBoundary}
        shouldFlip
        zIndex={layers.modal()}
        content={() => (
          <PopupMenuGroup
            onClick={(e) => e.stopPropagation()}
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
        trigger={(triggerProps) =>
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
    <Group testId={testId && `${testId}--avatar-group`} aria-label={label}>
      {data.slice(0, maxAvatar).map((avatarData, idx) => {
        const callback = avatarData.onClick || onAvatarClick;
        const finalAvatar = getOverrides(overrides).Avatar.render(
          avatar,
          {
            ...avatarData,
            size,
            borderColor,
            testId: testId && `${testId}--avatar-${idx}`,
            onClick: callback
              ? (event, analyticsEvent) => {
                  callback(event, analyticsEvent, idx);
                }
              : undefined,
            stackIndex: max - idx,
          },
          idx,
        );

        return !isTooltipDisabled && !avatarData.isDisabled ? (
          <Tooltip
            key={composeUniqueKey(avatarData, idx)}
            content={avatarData.name}
            testId={testId && `${testId}--tooltip-${idx}`}
          >
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
