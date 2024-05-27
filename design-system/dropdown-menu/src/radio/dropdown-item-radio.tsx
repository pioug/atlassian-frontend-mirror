import React, { type KeyboardEvent, type MouseEvent, useCallback } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { SELECTION_STYLE_CONTEXT_DO_NOT_USE } from '@atlaskit/menu';
import ButtonItem from '@atlaskit/menu/button-item';

import RadioIcon from '../internal/components/radio-icon';
import useRadioState from '../internal/hooks/use-radio-state';
import useRegisterItemWithFocusManager from '../internal/hooks/use-register-item-with-focus-manager';
import isVoiceOverSupported from '../internal/utils/is-voice-over-supported';
import { type DropdownItemRadioProps } from '../types';

/**
 * __Dropdown item radio__
 *
 * A dropdown item radio displays groups that have a single selection.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/usage)
 */
const DropdownItemRadio = ({
  children,
  defaultSelected,
  testId,
  id,
  title,
  description,
  isDisabled,
  isSelected,
  onClick: providedOnClick = noop,
  shouldDescriptionWrap = true,
  shouldTitleWrap = true,
  // DSP-13312 TODO: remove spread props in future major release
  ...rest
}: DropdownItemRadioProps) => {
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
    <SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider value="none">
      <ButtonItem
        aria-checked={selected}
        description={description}
        iconBefore={<RadioIcon checked={selected} />}
        id={id}
        isDisabled={isDisabled}
        isSelected={selected}
        onClick={onClickHandler}
        ref={itemRef}
        role={isVoiceOverSupported() ? 'radio' : 'menuitemradio'}
        shouldDescriptionWrap={shouldDescriptionWrap}
        shouldTitleWrap={shouldTitleWrap}
        testId={testId}
        // Thanks to spread props, this attribute are passed to ButtonItem, even though
        // it's not in the component's prop types.
        // @ts-expect-error
        title={title}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      >
        {children}
      </ButtonItem>
    </SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
  );
};

export default DropdownItemRadio;
