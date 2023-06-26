import React, { KeyboardEvent, MouseEvent, useCallback } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { SELECTION_STYLE_CONTEXT_DO_NOT_USE } from '@atlaskit/menu';
import ButtonItem from '@atlaskit/menu/button-item';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import CheckboxIcon from '../internal/components/checkbox-icon';
import useCheckboxState from '../internal/hooks/use-checkbox-state';
import useRegisterItemWithFocusManager from '../internal/hooks/use-register-item-with-focus-manager';
import { DropdownItemCheckboxProps } from '../types';

/**
 * __Dropdown item checkbox__
 *
 * A dropdown item checkbox creates groups that have multiple selections.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/dropdown-item-checkbox/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/dropdown-item-checkbox/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/dropdown-item-checkbox/usage)
 */
const DropdownItemCheckbox = (props: DropdownItemCheckboxProps) => {
  const {
    id,
    isSelected,
    defaultSelected,
    onClick: providedOnClick = noop,
    shouldTitleWrap = true,
    shouldDescriptionWrap = true,
    ...rest
  } = props;

  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    typeof isSelected !== 'undefined' &&
    typeof defaultSelected !== 'undefined'
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "[DropdownItemCheckbox] You've used both `defaultSelected` and `isSelected` props. This is dangerous and can lead to unexpected results. Use one or the other depending if you want to control the components state yourself.",
    );
  }

  const [selected, setSelected] = useCheckboxState({
    id,
    isSelected,
    defaultSelected,
  });

  const onClickHandler = useCallback(
    (event: MouseEvent | KeyboardEvent) => {
      setSelected((selected) => !selected);
      providedOnClick(event);
    },
    [providedOnClick, setSelected],
  );

  const itemRef = useRegisterItemWithFocusManager();

  return (
    <SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider value="none">
      <ButtonItem
        id={id}
        onClick={onClickHandler}
        role="menuitemcheckbox"
        aria-checked={selected}
        shouldTitleWrap={shouldTitleWrap}
        shouldDescriptionWrap={shouldDescriptionWrap}
        iconBefore={<CheckboxIcon checked={selected} />}
        isSelected={
          selected &&
          getBooleanFF(
            'platform.design-system-team.menu-selected-state-change_0see9',
          )
        }
        ref={itemRef}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      />
    </SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
  );
};

export default DropdownItemCheckbox;
