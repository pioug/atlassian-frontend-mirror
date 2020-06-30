import React from 'react';
import styled from 'styled-components';
import { exampleDocumentWithComments } from './helper/example-doc-with-comments';
import { AnnotationContext } from '../src';
import { default as Renderer } from '../src/ui/Renderer';
import {
  AnnotationMarkStates,
  AnnotationTypes,
  AnnotationId,
} from '@atlaskit/adf-schema';
import {
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
} from '@atlaskit/editor-common';

type MyState = { [key: string]: AnnotationMarkStates };
type MyAction =
  | { type: 'resolved'; id: string }
  | { type: 'unresolved'; id: string };

const initialState: MyState = {
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

function reducer(state: MyState, action: MyAction): MyState {
  switch (action.type) {
    case 'resolved':
      return { ...state, [action.id]: AnnotationMarkStates.RESOLVED };
    case 'unresolved':
      return { ...state, [action.id]: AnnotationMarkStates.ACTIVE };
    default:
      return state;
  }
}

const updateAnnotationSubscriber = new AnnotationUpdateEmitter();
const annotationInlineCommentProvider = {
  getState: async (annotationIds: AnnotationId[]) => {
    const annotationIdToState: MyState = initialState;

    return annotationIds.map(id => {
      return {
        id,
        annotationType: AnnotationTypes.INLINE_COMMENT,
        state: annotationIdToState[id],
      };
    });
  },
  updateSubscriber: updateAnnotationSubscriber,
};

const annotationProvider = {
  inlineComment: annotationInlineCommentProvider,
};

const AnnotationCheckbox = (props: {
  id: string;
  state: AnnotationMarkStates;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { id, state, onChange } = props;
  const onClick = React.useCallback(() => {
    updateAnnotationSubscriber.emit(
      AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS,
    );
    updateAnnotationSubscriber.emit(
      AnnotationUpdateEvent.SET_ANNOTATION_FOCUS,
      {
        annotationId: id,
      },
    );
  }, [id]);

  return (
    <div>
      <input
        onChange={onChange}
        type="checkbox"
        id={id}
        checked={state === AnnotationMarkStates.RESOLVED}
      />

      <span onClick={onClick}>{id}</span>
    </div>
  );
};

const Annotations = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const onChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { checked, id } = evt.target;

      if (checked) {
        updateAnnotationSubscriber.emit(
          AnnotationUpdateEvent.SET_ANNOTATION_STATE,
          {
            [id]: AnnotationMarkStates.RESOLVED,
          },
        );
        dispatch({ type: 'resolved', id });
      } else {
        updateAnnotationSubscriber.emit(
          AnnotationUpdateEvent.SET_ANNOTATION_STATE,
          {
            [id]: AnnotationMarkStates.ACTIVE,
          },
        );
        dispatch({ type: 'unresolved', id });
      }
    },
    [dispatch],
  );

  return (
    <>
      {Object.entries(state).map(([key, val]) => (
        <AnnotationCheckbox
          id={key}
          key={key}
          state={val}
          onChange={onChange}
        />
      ))}
    </>
  );
};

const Container = styled.section`
  display: flex;
  height: 100%;
`;

const Options = styled.section`
  flex: 20%;
  padding: 16px;
`;

const Flags = styled.section`
  padding: 20px 0;
`;

const Main = styled.main`
  flex: 80%;
`;

export default function ExampleAnnotationExperiment() {
  const [enableAutoHighlight, setEnableAutoHighlight] = React.useState(false);
  return (
    <Container>
      <Options>
        <h2>Annotations</h2>
        <Flags>
          <h3>Options</h3>

          <label htmlFor="enableAutoHighlight">
            <input
              type="checkbox"
              id="enableAutoHighlight"
              name="enableAutoHighlight"
              checked={enableAutoHighlight}
              onChange={() => {
                setEnableAutoHighlight(!enableAutoHighlight);
              }}
            />
            Enable Auto Highlight
          </label>
        </Flags>
        <Annotations />
      </Options>
      <Main>
        <AnnotationContext.Provider
          value={{
            onAnnotationClick: () => {},
            enableAutoHighlight,
            updateSubscriber: updateAnnotationSubscriber,
          }}
        >
          <Renderer
            appearance="full-page"
            document={exampleDocumentWithComments}
            annotationProvider={annotationProvider}
            allowAnnotations
          />
        </AnnotationContext.Provider>
      </Main>
    </Container>
  );
}
