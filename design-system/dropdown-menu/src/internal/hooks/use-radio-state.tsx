import { useCallback, useContext, useEffect, useState } from 'react';

import { RadioGroupContext } from '../../radio/dropdown-item-radio-group';
import { SelectionStoreContext } from '../context/selection-store';
import resetOptionsInGroup from '../utils/reset-options-in-group';

type RadioStateArgs = {
  id: string;
  isSelected: boolean | undefined;
  defaultSelected: boolean | undefined;
};

type SetStateCallback = (value: boolean | undefined) => boolean;
type RadioStateValue = [boolean, (newValue: SetStateCallback) => void];

function useRadioState({
  id,
  isSelected,
  defaultSelected,
}: RadioStateArgs): RadioStateValue {
  const { setGroupState, getGroupState } = useContext(SelectionStoreContext);
  const { id: group, radioGroupState, selectRadioItem } = useContext(
    RadioGroupContext,
  );

  const persistedIsSelected = radioGroupState[id];

  const [localIsSelected, setLocalIsSelected] = useState(() =>
    persistedIsSelected !== undefined
      ? persistedIsSelected
      : defaultSelected || false,
  );

  const setLocalState = useCallback(
    (newValue: SetStateCallback): void => {
      if (!persistedIsSelected) {
        const nextValue = newValue(persistedIsSelected);
        selectRadioItem(id, nextValue);
        setLocalIsSelected(nextValue);
      }
    },
    [persistedIsSelected, id, selectRadioItem],
  );

  /**
   * - radio state changes any time a radio child is changed
   * - when it changes we want all radio buttons to update their local state
   * - it takes the value from radio group state and applies it locally if it exists which it will only exist, if it is selected
   */
  useEffect(() => {
    setLocalIsSelected(() => {
      const existing = radioGroupState[id];
      return existing !== undefined ? existing : defaultSelected || false;
    });
  }, [radioGroupState, group, id, defaultSelected]);

  if (typeof isSelected === 'boolean') {
    return [isSelected, () => false];
  }

  if (persistedIsSelected === undefined) {
    const existing = getGroupState(group);
    setGroupState(group, {
      ...resetOptionsInGroup(existing || {}),
      [id]: defaultSelected || false,
    });
  }

  return [localIsSelected, setLocalState];
}
export default useRadioState;
