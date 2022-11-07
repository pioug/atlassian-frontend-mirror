/** @jsx jsx */
import { KeyboardEvent, MouseEvent, useContext, useLayoutEffect } from 'react';

import { css, jsx } from '@emotion/react';

import MenuGroup from '@atlaskit/menu/menu-group';
import Spinner from '@atlaskit/spinner';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { FocusableElement, MenuWrapperProps } from '../../types';
import { FocusManagerContext } from '../components/focus-manager';
import isCheckboxItem from '../utils/is-checkbox-item';
import isRadioItem from '../utils/is-radio-item';

const gridSize = gridSizeFn();
const spinnerContainerStyles = css({
  display: 'flex',
  minWidth: `${gridSize * 20}px`,
  padding: `${gridSize * 2.5}px`,
  justifyContent: 'center',
});
const LoadingIndicator = ({
  statusLabel = 'Loading',
}: {
  statusLabel: MenuWrapperProps['statusLabel'];
}) => (
  <div css={spinnerContainerStyles}>
    <Spinner size="small" />
    <VisuallyHidden role="status">{statusLabel}</VisuallyHidden>
  </div>
);
/**
 *
 * MenuWrapper wraps all the menu items.
 * It handles the logic to close the menu when a MenuItem is clicked, but leaves it open
 * if a CheckboxItem or RadioItem is clicked.
 * It also sets focus to the first menu item when opened.
 */
const MenuWrapper = ({
  onClose,
  onUpdate,
  isLoading,
  statusLabel,
  setInitialFocusRef,
  children,
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
      onClose(e);
    }
  };

  // Using useEffect here causes a flicker.
  // useLayoutEffect ensures that the update and render happen in the same
  // rAF tick.
  useLayoutEffect(() => {
    onUpdate();
  }, [isLoading, onUpdate]);

  setInitialFocusRef && setInitialFocusRef(menuItemRefs[0]);

  return (
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    <MenuGroup role="menu" onClick={closeOnMenuItemClick} {...props}>
      {isLoading ? <LoadingIndicator statusLabel={statusLabel} /> : children}
    </MenuGroup>
  );
};

export default MenuWrapper;
