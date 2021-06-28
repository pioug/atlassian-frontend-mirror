import React from 'react';
import styled from 'styled-components';
import { exampleDocumentWithComments } from './helper/example-doc-with-comments';
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
import {
  ExampleSelectionInlineComponent,
  ExampleViewInlineCommentComponent,
  annotationsStore,
  AnnotationsStoreProvider,
} from './helper/annotations';

const updateAnnotationSubscriber = new AnnotationUpdateEmitter();
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

const useAnnotationsProvider = (setDocument: (doc: any) => void) => {
  const { dispatch } = React.useContext(annotationsStore);
  const createNewAnnotationAndReplaceDocument = React.useCallback(
    (doc) => {
      setDocument(doc);
    },
    [setDocument],
  );

  const annotationInlineCommentProvider = React.useMemo(
    () => ({
      getState: async (annotationIds: AnnotationId[]) => {
        return annotationIds.map((id) => {
          dispatch({ type: 'add', id });

          return {
            id,
            annotationType: AnnotationTypes.INLINE_COMMENT,
            state: AnnotationMarkStates.ACTIVE,
          };
        });
      },
      updateSubscriber: updateAnnotationSubscriber,
      allowDraftMode: true,
      selectionComponent: ExampleSelectionInlineComponent(
        createNewAnnotationAndReplaceDocument,
      ),
      viewComponent: ExampleViewInlineCommentComponent,
    }),
    [createNewAnnotationAndReplaceDocument, dispatch],
  );

  return annotationInlineCommentProvider;
};

const Annotations = () => {
  const { dispatch, state } = React.useContext(annotationsStore);
  const onChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { checked, id } = evt.target;
      const type = checked
        ? AnnotationMarkStates.RESOLVED
        : AnnotationMarkStates.ACTIVE;

      const [state, dispatchType]: [
        AnnotationMarkStates,
        'unresolved' | 'resolved',
      ] =
        type === AnnotationMarkStates.RESOLVED
          ? [AnnotationMarkStates.RESOLVED, 'resolved']
          : [AnnotationMarkStates.ACTIVE, 'unresolved'];

      updateAnnotationSubscriber.emit(
        AnnotationUpdateEvent.SET_ANNOTATION_STATE,
        {
          [id]: {
            id,
            annotationType: AnnotationTypes.INLINE_COMMENT,
            state,
          },
        },
      );
      dispatch({ type: dispatchType, id });
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

const App = () => {
  const [doc, setDoc] = React.useState(exampleDocumentWithComments);
  const annotationInlineCommentProvider = useAnnotationsProvider(setDoc);
  const annotationProvider = React.useMemo(() => {
    return {
      inlineComment: annotationInlineCommentProvider,
    };
  }, [annotationInlineCommentProvider]);
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
        <Renderer
          appearance="full-page"
          document={doc}
          annotationProvider={annotationProvider}
          allowAnnotations
        />
      </Main>
    </Container>
  );
};

export default function ExampleAnnotationExperiment() {
  return (
    <AnnotationsStoreProvider>
      <App />
    </AnnotationsStoreProvider>
  );
}
