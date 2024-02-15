/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
//import { exampleDocumentWithComments } from './helper/example-doc-with-comments';
import { RendererWithAnalytics as Renderer, AnnotationsWrapper } from '../src/';
import { RendererActionsContext } from '../src/actions';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema';
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
import type { DocNode, AnnotationId } from '@atlaskit/adf-schema';

const exampleDocumentWithComments = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'It has RESOLVE annonations',
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '13272b41-b9a9-427a-bd58-c00766999638',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'It has UNRESOLVED annonations',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'annotation',
              attrs: {
                id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'It doesn’t has annotations',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':grinning:',
            id: '1f600',
            text: '😀',
          },
        },
        {
          type: 'text',
          text: ' emojis ',
        },
        {
          type: 'emoji',
          attrs: {
            shortName: ':smiley:',
            id: '1f603',
            text: '😃',
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'World ',
        },
        {
          type: 'text',
          text: 'inline code',
          marks: [
            {
              type: 'code',
            },
          ],
        },
      ],
    },
    {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: false,
        layout: 'default',
        localId: 'c70d5afe-5df0-43ff-83e8-aa8cf49f0de4',
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Inside a table',
                      marks: [
                        {
                          type: 'strong',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableHeader',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {},
              content: [
                {
                  type: 'paragraph',
                  content: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Text on Doc',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {},
      content: [
        {
          type: 'text',
          text: 'text inside a code block',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'End.',
        },
      ],
    },
  ],
};
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
        checked={state === AnnotationMarkStates.ACTIVE}
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
  const { dispatch, state } = React.useContext(annotationsStore);
  const createNewAnnotationAndReplaceDocument = React.useCallback(
    (doc) => {
      setDocument(doc);
    },
    [setDocument],
  );

  const getAnnotationState = React.useCallback(async () => state, [state]);

  const annotationInlineCommentProvider = React.useMemo(
    () => ({
      getState: (annotationIds: AnnotationId[]) =>
        getAnnotationState().then(() =>
          annotationIds.map((id) => {
            const annotationState = state[id];
            if (annotationState === 'active') {
              dispatch({ type: 'add', id });
            }

            return {
              id,
              annotationType: AnnotationTypes.INLINE_COMMENT,
              state:
                annotationState === 'active'
                  ? AnnotationMarkStates.ACTIVE
                  : AnnotationMarkStates.RESOLVED,
            };
          }),
        ),
      updateSubscriber: updateAnnotationSubscriber,
      allowDraftMode: true,
      selectionComponent: ExampleSelectionInlineComponent(
        createNewAnnotationAndReplaceDocument,
      ),
      viewComponent: ExampleViewInlineCommentComponent,
    }),
    [
      createNewAnnotationAndReplaceDocument,
      getAnnotationState,
      state,
      dispatch,
    ],
  );

  return annotationInlineCommentProvider;
};

const Annotations = () => {
  const { dispatch, state } = React.useContext(annotationsStore);
  const onChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { checked, id } = evt.target;
      const type = checked
        ? AnnotationMarkStates.ACTIVE
        : AnnotationMarkStates.RESOLVED;

      const [state, dispatchType]: [
        AnnotationMarkStates,
        'unresolved' | 'resolved',
      ] =
        type === AnnotationMarkStates.ACTIVE
          ? [AnnotationMarkStates.ACTIVE, 'unresolved']
          : [AnnotationMarkStates.RESOLVED, 'resolved'];

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

  React.useEffect(() => {
    Object.entries(state).forEach(([key, val]) => {
      updateAnnotationSubscriber.emit(
        AnnotationUpdateEvent.SET_ANNOTATION_STATE,
        {
          [key]: {
            id: key,
            annotationType: AnnotationTypes.INLINE_COMMENT,
            state: val,
          },
        },
      );
    });
  }, [state]);

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
  const localRef = React.useRef<HTMLDivElement>(null);
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
        <RendererActionsContext>
          <AnnotationsWrapper
            rendererRef={localRef}
            adfDocument={doc as DocNode}
            annotationProvider={annotationProvider}
          >
            <Renderer
              appearance="full-page"
              document={doc as DocNode}
              allowAnnotations
            />
          </AnnotationsWrapper>
        </RendererActionsContext>
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
