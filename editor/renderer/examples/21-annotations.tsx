/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
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
} from '@atlaskit/editor-common/types';
import {
  ExampleSelectionInlineComponent,
  ExampleViewInlineCommentComponent,
  annotationsStore,
  AnnotationsStoreProvider,
} from './helper/annotations';
import type { DocNode } from '@atlaskit/adf-schema';

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

const containerStyle = css`
  display: flex;
  height: 100%;
`;

const optionsStyle = css`
  flex: 20%;
  padding: 16px;
`;

const flagsStyle = css`
  padding: 20px 0;
`;

const mainStyle = css`
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
    <Fragment>
      {Object.entries(state).map(([key, val]) => (
        <AnnotationCheckbox
          id={key}
          key={key}
          state={val}
          onChange={onChange}
        />
      ))}
    </Fragment>
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

  return (
    <section css={containerStyle}>
      <section css={optionsStyle}>
        <h2>Annotations</h2>
        <section css={flagsStyle}>
          <h3>Options</h3>
        </section>
        <Annotations />
      </section>
      <main css={mainStyle}>
        <Renderer
          appearance="full-page"
          document={doc as DocNode}
          annotationProvider={annotationProvider}
          allowAnnotations
        />
      </main>
    </section>
  );
};

export default function ExampleAnnotationExperiment() {
  return (
    <AnnotationsStoreProvider>
      <App />
    </AnnotationsStoreProvider>
  );
}
