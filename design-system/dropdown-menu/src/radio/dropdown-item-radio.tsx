import React, { KeyboardEvent, MouseEvent, useCallback } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import ButtonItem from '@atlaskit/menu/button-item';

import RadioIcon from '../internal/components/radio-icon';
import useRadioState from '../internal/hooks/use-radio-state';
import useRegisterItemWithFocusManager from '../internal/hooks/use-register-item-with-focus-manager';
import isVoiceOverSupported from '../internal/utils/is-voice-over-supported';
import { DropdownItemRadioProps } from '../types';

/**
 * __Dropdown item radio__
 *
 * A dropdown item radio displays groups that have a single selection.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/usage)
 */
const DropdownItemRadio = (props: DropdownItemRadioProps) => {
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
      "[DropdownItemRadio] You've used both `defaultSelected` and `isSelected` props. This is dangerous and can lead to unexpected results. Use one or the other depending if you want to control the components state yourself.",
    );
  }

  const [selected, setSelected] = useRadioState({
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
    <ButtonItem
      id={id}
      onClick={onClickHandler}
      role={isVoiceOverSupported() ? 'radio' : 'menuitemradio'}
      aria-checked={selected}
      shouldTitleWrap={shouldTitleWrap}
      shouldDescriptionWrap={shouldDescriptionWrap}
      iconBefore={<RadioIcon checked={selected} />}
      ref={itemRef}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...rest}
    />
  );
};

export default DropdownItemRadio;
