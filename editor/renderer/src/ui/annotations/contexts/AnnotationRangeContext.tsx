import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

interface AnnotationRangeStateContext {
  range: Range | null;
  type: 'selection' | 'hover' | null;
}
interface AnnotationRangeDispatchContext {
  clearRange: () => void;
  clearSelectionRange: () => void;
  clearHoverRange: () => void;
  setRange: (range: Range) => void;
  setHoverTarget?: (target: HTMLElement) => void;
}

type State = {
  range: Range | null;
  type: 'selection' | 'hover' | null;
};

type Action =
  | { type: 'clear' }
  | { type: 'clearSelection' }
  | { type: 'clearHover' }
  | { type: 'setSelection'; range: Range }
  | { type: 'setHover'; range: Range };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'clear':
      if (!!state.range || !!state.type) {
        return { range: null, type: null };
      }
      return state;
    case 'clearSelection':
      if (state.type === 'selection') {
        return { range: null, type: null };
      }
      return state;
    case 'clearHover':
      if (state.type === 'hover') {
        return { range: null, type: null };
      }
      return state;
    case 'setSelection':
      if (state.range !== action.range || state.type !== 'selection') {
        return { range: action.range, type: 'selection' };
      }
      return state;
    case 'setHover':
      if (state.range !== action.range || state.type !== 'hover') {
        return { range: action.range, type: 'hover' };
      }
      return state;
  }
  return state;
}

export const AnnotationRangeStateContext =
  createContext<AnnotationRangeStateContext>({
    range: null,
    type: null,
  });

export const AnnotationRangeDispatchContext =
  createContext<AnnotationRangeDispatchContext>({
    clearRange: () => {},
    clearSelectionRange: () => {},
    clearHoverRange: () => {},
    setRange: () => {},
  });

export const AnnotationRangeProvider = ({
  children,
  allowCommentsOnMedia,
}: {
  children?: ReactNode;
  allowCommentsOnMedia?: boolean;
}) => {
  const [{ range, type }, dispatch] = useReducer(reducer, {
    range: null,
    type: null,
  });

  const clearRange = useCallback(() => dispatch({ type: 'clear' }), []);
  const clearSelectionRange = useCallback(
    () => dispatch({ type: 'clearSelection' }),
    [],
  );
  const clearHoverRange = useCallback(
    () => dispatch({ type: 'clearHover' }),
    [],
  );

  const setRange = useCallback(
    (range: Range) => dispatch({ type: 'setSelection', range }),
    [],
  );

  const setHoverTarget = useCallback((target: HTMLElement) => {
    const range = document.createRange();
    range.setStartBefore(target);
    range.setEndAfter(target);
    dispatch({ type: 'setHover', range });
  }, []);

  const stateData = useMemo(
    () => ({
      range,
      type,
    }),
    [range, type],
  );

  const dispatchData = useMemo(
    () => ({
      clearRange,
      clearSelectionRange,
      clearHoverRange,
      setRange,
      setHoverTarget: !!allowCommentsOnMedia ? setHoverTarget : undefined,
    }),
    [
      allowCommentsOnMedia,
      clearRange,
      clearSelectionRange,
      clearHoverRange,
      setRange,
      setHoverTarget,
    ],
  );

  return (
    <AnnotationRangeStateContext.Provider value={stateData}>
      <AnnotationRangeDispatchContext.Provider value={dispatchData}>
        {children}
      </AnnotationRangeDispatchContext.Provider>
    </AnnotationRangeStateContext.Provider>
  );
};

export const useAnnotationRangeState = () => {
  return useContext(AnnotationRangeStateContext);
};

export const useAnnotationRangeDispatch = () => {
  return useContext(AnnotationRangeDispatchContext);
};
