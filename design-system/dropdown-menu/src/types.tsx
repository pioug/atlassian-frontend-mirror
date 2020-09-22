import { KeyboardEvent, MouseEvent, ReactNode } from 'react';

import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { CustomThemeButtonProps } from '@atlaskit/button/types';

export type ItemId = string;
export type GroupId = string;

export type CachedItem = {
  id: ItemId;
  groupId: GroupId;
};

export type FocusItem = {
  itemId: ItemId;
  itemNode: HTMLElement;
};

export type Behaviors =
  | 'checkbox'
  | 'radio'
  | 'menuitemcheckbox'
  | 'menuitemradio';

export interface DeprecatedItem {
  content?: string;
  elemBefore?: ReactNode;
  href?: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  target?: '_blank' | '_self';
  type?: string;
}

export interface DeprecatedItemGroup {
  elemAfter?: ReactNode;
  heading?: string;
  items: Array<DeprecatedItem>;
}

export interface OnItemActivatedArgs {
  event?: Event;
  item: DeprecatedItem;
}

interface DropdownMenuBaseProps {
  /**
   * Controls the appearance of the menu.
   * Default menu has scroll after its height exceeds the pre-defined amount.
   * Tall menu has no scroll until the height exceeds the height of the viewport.
   */
  appearance: 'default' | 'tall';
  /** Value passed to the Layer component to determine when to reposition the droplist */
  boundariesElement: 'viewport' | 'window' | 'scrollParent';
  /** Content that will be rendered inside the layer element. Should typically be
   * `DropdownItemGroup` or `DropdownItem`, or checkbox / radio variants of those. */
  children?: ReactNode;
  /** If true, a Spinner is rendered instead of the items */
  isLoading: boolean;
  /** Controls the open state of the dropdown. */
  isOpen: boolean;
  /** Deprecated. An array of groups. Every group must contain an array of items */
  items: Array<DeprecatedItemGroup>;
  /** Deprecated. Called when an item is activated. Receives an object with the activated item. */
  onItemActivated: (args: OnItemActivatedArgs) => void;
  /** Position of the menu. See the documentation of @atlaskit/layer for more details. */
  position: string;
  /** Determines if the dropdown menu should be positioned fixed. Useful for breaking out of overflow scroll/hidden containers, however, extra layout
   management will be required to control scroll behaviour when this property is enabled as the menu will not update position with the target on scroll. */
  isMenuFixed: boolean;
  /** Deprecated. Option to display multiline items when content is too long.
   * Instead of ellipsing the overflown text it causes item to flow over multiple lines.
   */
  shouldAllowMultilineItems: boolean;
  /** Option to fit dropdown menu width to its parent width */
  shouldFitContainer: boolean;
  /** Allows the dropdown menu to be placed on the opposite side of its trigger if it does not
   * fit in the viewport. */
  shouldFlip: boolean;
  /** Content which will trigger the dropdown menu to open and close. Use with `triggerType`
   * to easily get a button trigger. */
  trigger?: ReactNode;
  /** Props to pass through to the trigger button. See @atlaskit/button for allowed props. */
  triggerButtonProps?: CustomThemeButtonProps;
  /** Controls the interface of trigger to be used for the dropdown menu. The default trigger allows
   * you to supply your own trigger component. Setting this prop to `button` will render a
   * Button component with an 'expand' icon, and the `trigger` prop contents inside the
   * button. */
  triggerType: 'default' | 'button';
  /** Callback to know when the menu is correctly positioned after it is opened */
  onPositioned?: Function;
  /**
   A `testId` prop is provided for specified elements, which is a unique
   string that appears as a data attribute `data-testid` in the rendered code,
   serving as a hook for automated tests.

   As dropdown-menu is composed of different components, we passed down the testId to the sub component you want to test:
   - `testId--trigger` to get the menu trigger.
   - `testId--content` to get the dropdown content trigger.
    */
  testId?: string;
}

export interface OnOpenChangeArgs {
  isOpen: boolean;
  event?: MouseEvent | KeyboardEvent;
}

export interface DropdownMenuStatelessProps
  extends DropdownMenuBaseProps,
    WithAnalyticsEventsProps {
  /** Called when the menu should be open/closed. Received an object with `isOpen` state. */
  onOpenChange: (args: OnOpenChangeArgs) => void;
}

export interface DropdownMenuStatefulProps extends DropdownMenuBaseProps {
  /** Controls the initial open state of the dropdown. */
  defaultOpen: boolean;
  /** Called when the menu is open or closed. Received an object with `isOpen` state. */
  onOpenChange: (args: OnOpenChangeArgs, ...restArgs: any) => void;
  // TODO: rest args is probably unnecessary - could remove it in handler
}
