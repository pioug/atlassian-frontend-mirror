import { useCallback, useReducer } from 'react';

type State = {
  /**
   * The localised ids that have been checked.
   */
  checked: number[];
  /**
   * Whether all list items are checked.
   */
  allChecked: boolean;
  /**
   * Whether any single row item is checked.
   */
  anyChecked: boolean;
  /**
   * Equal to the data length of the table, i.e. the maximum number of checked items.
   */
  maxChecked: number;
  /**
   * Indicates where a selection begins, i.e. the last selection where the Shift key was **not pressed**
   */
  selectionStart: number;
  /**
   * Indicates the most recent selection range where the Shift key was pressed.
   * This provides the ability to uncheck ids that are not part of a new selection range, but were in the previous selection range,
   * mimicking behaviour such as that in macOS
   * e.g. [2, 3, 4] indicates ids from 2 to 4 were selected the last time the Shift key was pressed.
   */
  previousSelection: number[];
};

const defaultState: State = {
  checked: [],
  allChecked: false,
  anyChecked: false,
  maxChecked: 0,
  selectionStart: -1,
  previousSelection: [],
};

type Action =
  /**
   * value here is the id of the selection
   */
  | { type: 'toggle_selection'; value: { id: number; shiftHeld: boolean } }
  | { type: 'set_root'; value: boolean }
  | { type: 'failure'; error: string }
  | { type: 'set_max'; value: number };

const arrayFromRange = (from: number, to: number) => {
  let startIdx = from;
  let stopIdx = to;
  let increment = 1;

  if (from > to) {
    startIdx = to;
    stopIdx = from;
    increment = 0;
  }

  // Create an array with values between `from` and `to` - either ascending or descending
  return Array.from(
    { length: stopIdx - startIdx },
    (_, i) => startIdx + i + increment,
  );
};

function reducer(
  { checked, anyChecked, maxChecked, selectionStart, previousSelection }: State,
  action: Action,
) {
  switch (action.type) {
    case 'toggle_selection': {
      const {
        value: { id, shiftHeld },
      } = action;

      let updated = checked.slice();
      let newSelectionStart = selectionStart;
      let newPreviousSelection = previousSelection.slice();

      if (shiftHeld) {
        if (checked.length > 0) {
          const newIds = arrayFromRange(selectionStart, id); // create an array of the new ids

          // Uncheck ids from the previous selection.
          // This is done to maintain consistency with Shift-select behaviour elsewhere (e.g. macOS)
          // TODO: Code could be improved to only remove ids that are not included in the new range, avoiding needing to re-add them below
          updated = updated.filter(id => !previousSelection.includes(id));
          newIds.forEach(
            id => updated.indexOf(id) === -1 && updated.push(id), // If the new id is not already checked, check it
          );

          newPreviousSelection = newIds; // Maintain an array of the previous selection to allow for consistent Shift-select behaviour
        }
      } else {
        const checkedIndex = checked.indexOf(id); // is index already checked

        if (checkedIndex !== -1) {
          updated.splice(checkedIndex, 1); // if index is already checked, uncheck
        } else {
          updated.push(id); // if index is not checked, check
        }
        newSelectionStart = id; // Reset selection start id to this non-shift-selected id
        newPreviousSelection = []; // Reset previous selection as it is no longer relevant once a new non-shift-selected id is added
      }

      const anyChecked = updated.length > 0;

      return {
        checked: updated,
        allChecked: updated.length === maxChecked,
        anyChecked: anyChecked || Boolean(updated[id]),
        maxChecked,
        selectionStart: newSelectionStart,
        previousSelection: newPreviousSelection,
      };
    }
    case 'set_root':
      return {
        checked: action.value ? Array.from(Array(maxChecked).keys()) : [],
        allChecked: action.value,
        anyChecked: Boolean(action.value),
        maxChecked,
        selectionStart,
        previousSelection,
      };
    case 'set_max': {
      const { value: max } = action;

      return {
        maxChecked: max,
        allChecked: checked.length === max,
        anyChecked,
        checked,
        selectionStart,
        previousSelection,
      };
    }
    default:
      throw new Error();
  }
}

const initialiseState = (): State => {
  return {
    ...defaultState,
    checked: [] as number[],
  };
};

function useSelectable() {
  const [state, dispatch] = useReducer(reducer, initialiseState());

  const toggleSelection = useCallback((id: number, shiftHeld: boolean) => {
    dispatch({
      type: 'toggle_selection',
      value: { id, shiftHeld },
    });
  }, []);

  const setAll = useCallback(() => {
    dispatch({ type: 'set_root', value: true });
  }, []);

  const removeAll = useCallback(() => {
    dispatch({ type: 'set_root', value: false });
  }, []);

  const setMax = useCallback((max: number) => {
    dispatch({ type: 'set_max', value: max });
  }, []);

  return [state, { setAll, removeAll, toggleSelection, setMax }] as const;
}

export default useSelectable;
