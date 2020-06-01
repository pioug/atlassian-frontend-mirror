import { ElementType } from 'react';

import { AvatarClickType, AvatarPropTypes, SizeType } from '@atlaskit/avatar';

import { AvatarGroupItemProps } from './AvatarGroupItem';

export type DeepRequired<T> = {
  [P in keyof T]-?: Required<T[P]>;
};

export interface AvatarOverrideProps {
  /**
   * Avatar data passed to each avatar item.
   * This is the individual objects you pass in the data array in AvatarGroup.
   */
  data: AvatarPropTypes;

  /**
   * This index of the avatar item.
   */
  index: number;
}

export interface AvatarGroupOverrides {
  AvatarGroupItem?: {
    render?: (
      Component: ElementType<AvatarGroupItemProps>,
      props: AvatarGroupItemProps,
      index: number,
    ) => React.ReactNode;
  };
  Avatar?: {
    render?: (
      Component: ElementType<AvatarPropTypes>,
      props: AvatarPropTypes,
      index: number,
    ) => React.ReactNode;
  };
}

export interface AvatarGroupProps {
  /**
   * Indicates the layout of the avatar-group.
   * Avatars will either be overlapped in a stack, or
   * laid out in an even grid formation
   * Defaults to "stack".
   */
  appearance: 'grid' | 'stack';

  /**
   * Component used to render each avatar
   */
  avatar: ElementType<AvatarPropTypes>;

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
  size: SizeType;

  /**
   * Typically the background color that the avatar is presented on.
   * Accepts any color argument that the CSS border-color property accepts.
   */
  borderColor?: string;

  /**
   * Array of avatar data passed to each `avatar` component.
   * These props will be spread on to the component passed into avatar.
   */
  data: Array<AvatarPropTypes & { enableTooltip?: boolean }>;

  /**
   * Handle the click event on the avatar item
   */
  onAvatarClick?: AvatarClickType;

  /**
   * Take control of the click event on the more indicator.
   * This will cancel the default dropdown behavior. */
  onMoreClick?: (event: React.MouseEvent) => void;

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
}
