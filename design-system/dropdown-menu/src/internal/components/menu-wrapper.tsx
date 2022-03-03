import React, { KeyboardEvent, MouseEvent, useContext } from 'react';

import MenuGroup from '@atlaskit/menu/menu-group';

import { FocusableElement, MenuWrapperProps } from '../../types';
import { FocusManagerContext } from '../components/focus-manager';
import isCheckboxItem from '../utils/is-checkbox-item';
import isRadioItem from '../utils/is-radio-item';

/**
 *
 * MenuWrapper wraps all the menu items.
 * It handles the logic to close the menu when a MenuItem is clicked, but leaves it open
 * if a CheckboxItem or RadioItem is clicked.
 * It also sets focus to the first menu item when opened.
 */
const MenuWrapper = ({
  onClose,
  setInitialFocusRef,
  ...props
}: MenuWrapperProps) => {
  const { menuItemRefs } = useContext(FocusManagerContext);
  const closeOnMenuItemClick = (e: MouseEvent | KeyboardEvent) => {
    const isTargetMenuItemOrDecendant = menuItemRefs.some(
      (menuItem: FocusableElement) => {
        const isCheckboxOrRadio =
          isCheckboxItem(menuItem) || isRadioItem(menuItem);

        return menuItem.contains(e.target as Node) && !isCheckboxOrRadio;
      },
    );

    // Close menu if the click is triggered from a MenuItem or
    // its decendant. Don't close the menu if the click is triggered
    // from a MenuItemRadio or MenuItemCheckbox so that the user can
    // select multiple items.
    if (isTargetMenuItemOrDecendant && onClose) {
      onClose();
    }
  };

  setInitialFocusRef && setInitialFocusRef(menuItemRefs[0]);

  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  return <MenuGroup role="menu" onClick={closeOnMenuItemClick} {...props} />;
};

export default MenuWrapper;
