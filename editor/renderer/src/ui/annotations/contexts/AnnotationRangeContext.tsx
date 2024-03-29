import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

interface AnnotationRangeStateContext {
  /*
   * This range represents the selection that the user has made before they intend to save an annotation
   */
  range: Range | null;
  /*
   * This range represents the "pre-committed" placeholder range that the user will eventually save as an annotation
   * If the user does not set allowDraftMode, this will be ignored as it only is set when we call applyAnnotationDraftAt()
   */
  draftRange: Range | null;
  type: 'selection' | 'hover' | null;
}
interface AnnotationRangeDispatchContext {
  clearRange: () => void;
  clearSelectionRange: () => void;
  clearDraftRange: () => void;
  clearHoverRange: () => void;
  setRange: (range: Range) => void;
  setDraftRange: (draftRange: Range | null) => void;
  setHoverTarget?: (target: HTMLElement) => void;
}

type State = {
  range: Range | null;
  draftRange: Range | null;
  type: 'selection' | 'hover' | null;
};

type Action =
  | { type: 'clear' }
  | { type: 'clearSelection' }
  | { type: 'clearDraftSelection' }
  | { type: 'clearHover' }
  | { type: 'setSelection'; range: Range }
  | { type: 'setDraftSelection'; draftRange: Range | null }
  | { type: 'setHover'; range: Range };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'clear':
      if (!!state.range || !!state.type) {
        return { range: null, draftRange: null, type: null };
      }
      return state;
    case 'clearSelection':
      if (state.type === 'selection') {
        return { ...state, range: null, type: null };
      }
      return state;
    case 'clearDraftSelection':
      if (state.type === 'selection') {
        return { ...state, draftRange: null };
      }
      return state;
    case 'clearHover':
      if (state.type === 'hover') {
        return { range: null, draftRange: null, type: null };
      }
      return state;
    case 'setSelection':
      if (state.range !== action.range || state.type !== 'selection') {
        return { ...state, range: action.range, type: 'selection' };
      }
      return state;
    case 'setDraftSelection':
      if (
        state.draftRange !== action.draftRange ||
        state.type !== 'selection'
      ) {
        return { range: null, draftRange: action.draftRange, type: null };
      }
      return state;
    case 'setHover':
      if (state.range !== action.range || state.type !== 'hover') {
        return { ...state, range: action.range, type: 'hover' };
      }
      return state;
  }
  return state;
}

export const AnnotationRangeStateContext =
  createContext<AnnotationRangeStateContext>({
    range: null,
    draftRange: null,
    type: null,
  });

export const AnnotationRangeDispatchContext =
  createContext<AnnotationRangeDispatchContext>({
    clearRange: () => {},
    clearSelectionRange: () => {},
    clearDraftRange: () => {},
    clearHoverRange: () => {},
    setRange: () => {},
    setDraftRange: () => {},
  });

export const AnnotationRangeProvider = ({
  children,
  allowCommentsOnMedia,
}: {
  children?: ReactNode;
  allowCommentsOnMedia?: boolean;
}) => {
  const [{ range, draftRange, type }, dispatch] = useReducer(reducer, {
    range: null,
    draftRange: null,
    type: null,
  });

  const clearRange = useCallback(() => dispatch({ type: 'clear' }), []);
  const clearSelectionRange = useCallback(
    () => dispatch({ type: 'clearSelection' }),
    [],
  );
  const clearDraftRange = useCallback(
    () => dispatch({ type: 'clearDraftSelection' }),
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

  const setDraftRange = useCallback((range: Range | null) => {
    dispatch({ type: 'setDraftSelection', draftRange: range });
  }, []);

  const setHoverTarget = useCallback((target: HTMLElement) => {
    const range = document.createRange();
    range.setStartBefore(target);
    range.setEndAfter(target);
    dispatch({ type: 'setHover', range });
  }, []);

  const stateData = useMemo(
    () => ({
      range,
      draftRange,
      type,
    }),
    [range, draftRange, type],
  );

  const dispatchData = useMemo(
    () => ({
      clearRange,
      clearSelectionRange,
      clearDraftRange,
      clearHoverRange,
      setRange,
      setDraftRange,
      setHoverTarget: !!allowCommentsOnMedia ? setHoverTarget : undefined,
    }),
    [
      allowCommentsOnMedia,
      clearRange,
      clearSelectionRange,
      clearDraftRange,
      clearHoverRange,
      setRange,
      setDraftRange,
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
