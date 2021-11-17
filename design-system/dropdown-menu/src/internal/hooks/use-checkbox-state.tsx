import { useCallback, useContext, useState } from 'react';

import { CheckboxGroupContext } from '../context/checkbox-group-context';
import { SelectionStoreContext } from '../context/selection-store';

type CheckboxStateArgs = {
  id: string;
  isSelected: boolean | undefined;
  defaultSelected: boolean | undefined;
};

type SetStateCallback = (value: boolean | undefined) => boolean;
type CheckboxStateValue = [boolean, (newValue: SetStateCallback) => void];

/**
 * Custom hook to handle checkbox state for dropdown menu.
 * It works in tandem with the selection store context when the
 * component is uncontrolled.
 */
const useCheckboxState = ({
  isSelected,
  id,
  defaultSelected,
}: CheckboxStateArgs): CheckboxStateValue => {
  const { setItemState, getItemState } = useContext(SelectionStoreContext);
  const groupId: string = useContext(CheckboxGroupContext);
  const persistedIsSelected = getItemState(groupId, id);
  const [localIsSelected, setLocalIsSelected] = useState(
    // Initial state is set depending on value being defined or not.
    // This state is only utilised if the checkbox is uncontrolled.
    () =>
      persistedIsSelected !== undefined
        ? persistedIsSelected
        : defaultSelected || false,
  );

  const setLocalState = useCallback(
    (newValue: SetStateCallback): void => {
      const nextValue = newValue(persistedIsSelected);

      setLocalIsSelected(nextValue);
      setItemState(groupId, id, nextValue);
    },
    [setItemState, persistedIsSelected, groupId, id],
  );

  // Checkbox is controlled - do nothing!
  if (typeof isSelected === 'boolean') {
    return [isSelected, () => false];
  }

  // Checkbox is going through its first render pass!
  if (persistedIsSelected === undefined) {
    // Set the item so we have this state to access next time the checkbox renders (either by mounting or re-rendering!)
    setItemState(groupId, id, defaultSelected || false);
  }

  // Return the value and setter!
  // Remember this flow is only returned if the checkbox is uncontrolled.
  return [localIsSelected, setLocalState];
};

export default useCheckboxState;
