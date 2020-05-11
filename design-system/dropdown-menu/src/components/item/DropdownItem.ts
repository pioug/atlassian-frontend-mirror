import { KeyboardEvent, MouseEvent } from 'react';

import Item, { withItemClick, withItemFocus } from '@atlaskit/item';

export interface DropdownItemProps {
  /**
   * Primary content for the item.
   */
  children: React.ReactNode;

  /**
   * Description of the item.
   * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
   */
  description?: React.ReactNode;

  /**
   * Will focus to the item when it is initially mounted.
   */
  autoFocus?: boolean;

  /**
   * Displays the item in a compact look.
   */
  isCompact?: boolean;

  /**
   * Makes the element appear disabled as well as removing interactivity.
   */
  isDisabled?: boolean;

  /**
   * Hides the item.
   */
  isHidden?: boolean;

  /**
   * Enables the primary content passed in through `children` to wrap over multiple lines.
   */
  shouldAllowMultiline?: boolean;

  /**
   * Event that is triggered when the element is clicked.
   */
  onClick?: (e: MouseEvent | KeyboardEvent) => void;

  /**
   * Makes the element appear selected.
   */
  isSelected?: boolean;

  /**
   * Link to another page.
   */
  href?: string;

  /**
   * Where to display the linked URL,
   * see [anchor information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) on mdn for more information.
   */
  target?: string;

  /**
   * Adds a title attribute to the root item element.
   */
  title?: string;

  /**
   * Element to render before the item text.
   * Generally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
   */
  elemBefore?: React.ReactNode;

  /**
   * Element to render after the item text.
   * Generally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
   */
  elemAfter?: React.ReactNode;
}

// We need to type this with the above type - currently this component is has "any" for its props.
export default withItemClick(withItemFocus(Item));
