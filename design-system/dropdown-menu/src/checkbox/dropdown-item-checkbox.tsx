import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import noop from '@atlaskit/ds-lib/noop';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import ButtonItem from '@atlaskit/menu/button-item';

import useCheckboxState from '../internal/hooks/use-checkbox-state';
import useRegisterItemWithFocusManager from '../internal/hooks/use-register-item-with-focus-manager';
import getIconColors from '../internal/utils/get-icon-colors';
import isVoiceOverSupported from '../internal/utils/is-voice-over-supported';
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

  const [iconColors, setIconColors] = useState(getIconColors(defaultSelected));

  const onClickHandler = useCallback(
    (event: MouseEvent | KeyboardEvent) => {
      setSelected((selected) => !selected);
      providedOnClick(event);
    },
    [providedOnClick, setSelected],
  );

  useEffect(() => {
    setIconColors(getIconColors(selected));
  }, [selected]);

  const itemRef = useRegisterItemWithFocusManager();

  return (
    <ButtonItem
      id={id}
      onClick={onClickHandler}
      role={isVoiceOverSupported() ? 'checkbox' : 'menuitemcheckbox'}
      aria-checked={selected}
      shouldTitleWrap={shouldTitleWrap}
      shouldDescriptionWrap={shouldDescriptionWrap}
      iconBefore={
        <CheckboxIcon
          label=""
          size="medium"
          primaryColor={iconColors.primary}
          secondaryColor={iconColors.secondary}
        />
      }
      ref={itemRef}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...rest}
    />
  );
};

export default DropdownItemCheckbox;
