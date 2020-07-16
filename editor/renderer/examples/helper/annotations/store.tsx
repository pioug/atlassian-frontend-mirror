import React, { createContext, useReducer } from 'react';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';

type MyAction =
  | { type: 'resolved'; id: string }
  | { type: 'unresolved'; id: string }
  | { type: 'add'; id: string };
// type MyOnChange = (id: AnnotationId, type: AnnotationMarkStates) => void;
type MyData = { [key: string]: AnnotationMarkStates };
type MyReducer = React.Reducer<MyData, MyAction>;
type MyState = {
  state: MyData;
  dispatch: React.Dispatch<React.ReducerAction<MyReducer>>;
};

const initialData: MyData = {};
const annotationsStore = createContext<MyState>({
  state: {},
  dispatch: () => {},
});
const { Provider } = annotationsStore;

const reducer: MyReducer = (state: MyData, action: MyAction): MyData => {
  switch (action.type) {
    case 'resolved':
      return { ...state, [action.id]: AnnotationMarkStates.RESOLVED };
    case 'unresolved':
    case 'add':
      return { ...state, [action.id]: AnnotationMarkStates.ACTIVE };
    default:
      return { ...state };
  }
};

const AnnotationsStoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialData);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { annotationsStore, AnnotationsStoreProvider };
