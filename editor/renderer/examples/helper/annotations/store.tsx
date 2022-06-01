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
  null: AnnotationMarkStates.ACTIVE,
  '12e213d7-badd-4c2a-881e-f5d6b9af3752': AnnotationMarkStates.ACTIVE,
  '9714aedf-5300-43f4-ac10-a2e4326189d2': AnnotationMarkStates.ACTIVE,
  '13272b41-b9a9-427a-bd58-c00766999638': AnnotationMarkStates.RESOLVED,
  '68ac8f3f-2fb6-4720-8439-c9da1f17b0b2': AnnotationMarkStates.ACTIVE,
  '80f91695-4e24-433d-93e1-6458b8bb2415': AnnotationMarkStates.ACTIVE,
  'f963dc2a-797c-445d-9703-9381c82ccf55': AnnotationMarkStates.ACTIVE,
  'be3e7d44-053d-454b-93d2-2575c6fca2c1': AnnotationMarkStates.RESOLVED,
  'abb3279e-109a-4a05-b8b7-111363d81041': AnnotationMarkStates.ACTIVE,
  '98666c34-f666-49be-b17d-d01d112b5c1b': AnnotationMarkStates.ACTIVE,
  'd1257edc-604a-4f8a-b3fa-8e24cbd0894b': AnnotationMarkStates.ACTIVE,
  '75a321e5-ee26-41c2-8ef1-c81849df3f40': AnnotationMarkStates.ACTIVE,
  'eef53b24-17c6-46e8-bab4-6f0b0478e80a': AnnotationMarkStates.ACTIVE,
  '93e89148-ad5c-4bdd-965f-60b91b0e7774': AnnotationMarkStates.ACTIVE,
  '422510e2-3bff-4b67-a87f-e24e3ef38fe0': AnnotationMarkStates.ACTIVE,
  '9704428e-1b22-4bdd-8948-967658fda9b8': AnnotationMarkStates.ACTIVE,
  'a4ca35cb-8964-4f5a-b7ad-101c82c789f4': AnnotationMarkStates.ACTIVE,
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

const AnnotationsStoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialData);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { annotationsStore, AnnotationsStoreProvider };
