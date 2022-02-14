import React, { createContext, useContext, useState } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import type { SectionProps } from '@atlaskit/menu';
import Section from '@atlaskit/menu/section';

import { SelectionStoreContext } from '../internal/context/selection-store';
import resetOptionsInGroup from '../internal/utils/reset-options-in-group';
interface DropdownItemRadioGroupProps extends SectionProps {
  id: string;
}

interface RadioGroupContextProps {
  id: string;
  radioGroupState: { [key: string]: boolean | undefined };
  selectRadioItem: (id: string, value: boolean) => void;
}

/**
 * __Radio group context__
 * Context provider that wraps each DropdownItemRadioGroup
 */
export const RadioGroupContext = createContext<RadioGroupContextProps>({
  id: '',
  radioGroupState: {},
  selectRadioItem: noop,
});

/**
 * __Dropdown item radio group__
 *  Store which manages the selection state for each DropdownItemRadio
 *  across mount and unmounts.
 *
 */
const DropdownItemRadioGroup = (props: DropdownItemRadioGroupProps) => {
  const { children, id } = props;
  const { setGroupState, getGroupState } = useContext(SelectionStoreContext);

  /**
   *  - initially `radioGroupState` is from selection store, so it's safe to update without re-rendering
   *  - we flush a render by updating this local radio group state
   */
  const [radioGroupState, setRadioGroupState] = useState(() =>
    getGroupState(id),
  );

  const selectRadioItem = (childId: string, value: boolean) => {
    const newValue = {
      ...resetOptionsInGroup(getGroupState(id)),
      [childId]: value,
    };

    setRadioGroupState(newValue);
    setGroupState(id, newValue);
  };

  return (
    <RadioGroupContext.Provider
      value={{ id, radioGroupState, selectRadioItem }}
    >
      {/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
      <Section {...props}>{children}</Section>
    </RadioGroupContext.Provider>
  );
};

export default DropdownItemRadioGroup;
