import type React from 'react';
import { useCallback, useEffect, useReducer, useRef } from 'react';

/**
 * a custom hook that handles keyboard navigation for Arrow keys based on a
 * given listSize, and a step (for up and down arrows).
 *
 * @param {number} listSize
 * @param {number} upDownStep
 *
 * Example usage:
 *    const list = ['Confluence','Jira','Atlaskit'];
 *    const {
 *      selectedItemIndex,
 *      focusedItemIndex,
 *      focusOnSearch,
 *      focusOnViewMore,
 *      setFocusedItemIndex,
 *      onKeyDown
 *    } = useSelectAndFocusOnArrowNavigation(list.length - 1, 1);
 *
 *    return (
 *      <div onKeyDown={onKeyDown}>
 *        <SearchBar onClick={() => setFocusedItemIndex(undefined)} focus={focusOnSearch} />
 *        {list.map((item, index) => (
 *           <ListItem
 *            title={item}
 *            style={{ ..., color: selected ? 'selectedStateColor' : defaultColor }}
 *            onClick={() => {
 *              setFocusedItemIndex(index);
 *            }
 *          />
 *        )}
 *      </div>
 *    );
 *
 *    const SearchBar = ({ focus }) => {
 *      const ref = useRefToFocusOrScroll(focus);
 *      return <input ref={ref} />
 *    }
 *
 */

type ReducerState = {
  focusOnSearch: boolean;
  focusOnViewMore: boolean;
  selectedItemIndex?: number;
  focusedItemIndex?: number;
  listSize: number;
  canFocusViewMore?: boolean;
};

export enum ACTIONS {
  FOCUS_SEARCH = 'focusOnSearch',
  UPDATE_STATE = 'updateState',
  MOVE = 'move',
}

export type ReducerAction = {
  type: ACTIONS;
  payload: Partial<ReducerState> & {
    positions?: number;
    step?: number;
  };
};

const reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case ACTIONS.UPDATE_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case ACTIONS.FOCUS_SEARCH:
      return {
        ...state,
        focusedItemIndex: undefined,
        focusOnSearch: true,
        focusOnViewMore: false,
      };

    case ACTIONS.MOVE:
      return moveReducer(state, action);
  }
  return state;
};

const moveReducer = (
  state: ReducerState,
  action: ReducerAction,
): ReducerState => {
  const { listSize, canFocusViewMore } = state;
  if (state.focusOnSearch) {
    // up arrow
    if (action.payload.positions && action.payload.positions <= -1) {
      return {
        ...state,
        focusOnSearch: false,
        focusOnViewMore: !!canFocusViewMore,
        focusedItemIndex: canFocusViewMore ? undefined : listSize,
        selectedItemIndex: canFocusViewMore ? undefined : listSize,
      };
    } else {
      return {
        ...state,
        focusOnSearch: false,
        focusOnViewMore: false,
        focusedItemIndex: 0,
        selectedItemIndex: 0,
      };
    }
  }

  if (state.focusOnViewMore) {
    // down arrow
    if (action.payload.positions === 1) {
      return {
        ...state,
        focusOnSearch: true,
        focusOnViewMore: false,
        focusedItemIndex: undefined,
        // if search is focused then select first item.
        selectedItemIndex: 0,
      };
    } else {
      return {
        ...state,
        focusOnSearch: false,
        focusOnViewMore: false,
        focusedItemIndex: listSize,
        selectedItemIndex: listSize,
      };
    }
  }

  const newIndex = state.selectedItemIndex
    ? state.selectedItemIndex + action.payload.positions!
    : action.payload.positions!;

  const safeIndex = ensureSafeIndex(newIndex, state.listSize);
  // down arrow key is pressed or right arrow key is pressed.
  if (
    state.focusedItemIndex !== undefined &&
    action.payload.positions &&
    action.payload.positions >= 1
  ) {
    // when multi column element browser is open and we are in last
    //  row then newIndex will be greater than listSize when
    //  down arrow key is pressed.
    // Or when last item is focused and down or right arrow key is pressed.
    const isLastItemFocused = newIndex > listSize;
    const focusOnSearch = isLastItemFocused && !canFocusViewMore;
    const focusOnViewMore = isLastItemFocused && !!canFocusViewMore;
    // if search is focused, then select first item.
    // otherwise if view more is focused then select item should be undefined.
    const selectedItemIndex = focusOnSearch
      ? 0
      : focusOnViewMore
      ? undefined
      : safeIndex;
    return {
      ...state,
      focusOnSearch,
      focusOnViewMore,
      selectedItemIndex,
      focusedItemIndex: isLastItemFocused ? undefined : safeIndex,
    };
  }

  // up arrow key is pressed or left arrow key is pressed.
  if (
    state.focusedItemIndex !== undefined &&
    action.payload.positions &&
    action.payload.positions <= -1
  ) {
    // if arrow up key is pressed when focus is in first row,
    //  or, arrow left key is pressed when first item is focused,
    //  then newIndex will become less than zero.
    // In this case, focus search, and, kept previously selected item.
    const isFirstRowFocused = newIndex < 0;
    // if focus goes to search then kept last selected item in first row.
    const selectedItemIndex = isFirstRowFocused
      ? state.selectedItemIndex
      : safeIndex;
    return {
      ...state,
      // focus search if first item is focused on up or left arrow key
      focusOnSearch: isFirstRowFocused,
      focusOnViewMore: false,
      focusedItemIndex: isFirstRowFocused ? undefined : safeIndex,
      selectedItemIndex,
    };
  }
  return {
    ...state,
    focusOnSearch: false,
    focusOnViewMore: false,
    selectedItemIndex: safeIndex,
    focusedItemIndex: safeIndex,
  };
};

const initialState = {
  focusOnSearch: true,
  focusOnViewMore: false,
  selectedItemIndex: 0,
  focusedItemIndex: undefined,
  listSize: 0,
};

const getInitialState =
  (listSize: number, canFocusViewMore: boolean) =>
  (initialState: ReducerState) => ({
    ...initialState,
    listSize,
    canFocusViewMore,
  });

export type useSelectAndFocusReturnType = {
  selectedItemIndex?: number;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  focusOnSearch: boolean;
  focusOnViewMore: boolean;
  focusedItemIndex?: number;
  setFocusedItemIndex: (index?: number) => void;
  setFocusOnSearch: () => void;
};

function useSelectAndFocusOnArrowNavigation(
  listSize: number,
  step: number,
  canFocusViewMore: boolean,
): useSelectAndFocusReturnType {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    getInitialState(listSize, canFocusViewMore),
  );

  useEffect(() => {
    dispatch({
      type: ACTIONS.UPDATE_STATE,
      payload: { canFocusViewMore },
    });
  }, [canFocusViewMore]);

  const {
    selectedItemIndex,
    focusedItemIndex,
    focusOnSearch,
    focusOnViewMore,
  } = state;

  const reset = useCallback((listSize: number) => {
    let payload = {
      ...initialState,
      listSize,
    };
    dispatch({
      type: ACTIONS.UPDATE_STATE,
      payload,
    });
  }, []);

  const removeFocusFromSearchAndSetOnItem = useCallback(
    (index?: number) => {
      const payload: Partial<ReducerState> = {
        focusedItemIndex: index,
        selectedItemIndex: index,
        focusOnSearch: false,
        focusOnViewMore: false,
      };

      dispatch({
        type: ACTIONS.UPDATE_STATE,
        payload,
      });
    },
    [dispatch],
  );

  const setFocusOnSearch = useCallback(() => {
    dispatch({
      type: ACTIONS.FOCUS_SEARCH,
      payload: {},
    });
  }, [dispatch]);

  const isMoving = useRef(false);

  const move = useCallback((e, positions, actualStep?) => {
    e.preventDefault();
    e.stopPropagation();

    // avoid firing 2 moves at the same time when holding an arrow down as this can freeze the screen
    if (!isMoving.current) {
      isMoving.current = true;
      requestAnimationFrame(() => {
        isMoving.current = false;
        dispatch({
          type: ACTIONS.MOVE,
          payload: {
            positions,
            step: actualStep,
          },
        });
      });
    }
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const avoidKeysWhileSearching = [
        '/', // While already focused on search bar, let users type in.
        'ArrowRight',
        'ArrowLeft',
      ];
      if (focusOnSearch && avoidKeysWhileSearching.includes(e.key)) {
        return;
      }
      switch (e.key) {
        case '/':
          e.preventDefault();
          e.stopPropagation();
          return setFocusOnSearch();

        case 'ArrowRight':
          return move(e, +1);

        case 'ArrowLeft':
          return move(e, -1);

        case 'ArrowDown':
          return move(e, +step);

        case 'ArrowUp':
          return move(e, -step, step);
      }
    },
    [focusOnSearch, setFocusOnSearch, move, step],
  );

  useEffect(() => {
    // To reset selection when user filters
    reset(listSize);
  }, [listSize, reset]);

  return {
    selectedItemIndex,
    onKeyDown,
    focusOnSearch,
    focusOnViewMore,
    setFocusOnSearch,
    focusedItemIndex,
    setFocusedItemIndex: removeFocusFromSearchAndSetOnItem,
  };
}

export const ensureSafeIndex = (index: number, listSize: number): number => {
  if (index < 0) {
    return 0;
  }

  if (index > listSize) {
    return listSize;
  }

  return index;
};

export default useSelectAndFocusOnArrowNavigation;
