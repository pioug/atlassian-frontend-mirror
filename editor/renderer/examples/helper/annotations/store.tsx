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

const initialData: MyData = {
  '12e213d7-badd-4c2a-881e-f5d6b9af3752': AnnotationMarkStates.RESOLVED,
  '13272b41-b9a9-427a-bd58-c00766999638': AnnotationMarkStates.RESOLVED,
  '7053c566-db75-4605-b6b2-eca6a0cedff1': AnnotationMarkStates.RESOLVED,
  '7053c566-db75-4605-b6b2-eca6a0cedff2': AnnotationMarkStates.RESOLVED,
  '965e2ef6-722b-479d-995a-e63fb5511dd3': AnnotationMarkStates.RESOLVED,
  '53500c44-4f1e-41eb-b215-9ccfaaa79397': AnnotationMarkStates.RESOLVED,
};

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

const AnnotationsStoreProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(reducer, initialData);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { annotationsStore, AnnotationsStoreProvider };
