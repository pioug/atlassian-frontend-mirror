import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import noop from '@atlaskit/ds-lib/noop';
import RadioIcon from '@atlaskit/icon/glyph/radio';
import ButtonItem from '@atlaskit/menu/button-item';

import useRadioState from '../internal/hooks/use-radio-state';
import useRegisterItemWithFocusManager from '../internal/hooks/use-register-item-with-focus-manager';
import getIconColors from '../internal/utils/get-icon-colors';
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
      role={isVoiceOverSupported() ? 'radio' : 'menuitemradio'}
      aria-checked={selected}
      shouldTitleWrap={shouldTitleWrap}
      shouldDescriptionWrap={shouldDescriptionWrap}
      iconBefore={
        <RadioIcon
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

export default DropdownItemRadio;
