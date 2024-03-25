/** @jsx jsx */
import { token } from '@atlaskit/tokens';
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
  ExampleHoverInlineComponent,
} from './helper/annotations';
import type { DocNode, AnnotationId } from '@atlaskit/adf-schema';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

const exampleDocumentWithComments = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example of comments in renderer',
        },
      ],
    },
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
          text: 'It has UNRESOLVED annonations ',
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
        {
          type: 'inlineCard',
          attrs: {
            url: 'https://pug.jira-dev.com/wiki/spaces/CE/blog/2017/08/18/3105751050/A+better+REST+API+for+Confluence+Cloud+via+Swagger',
          },
          marks: [
            {
              type: 'annotation',
              attrs: {
                id: '12e213d7-badd-4c2a-881e-f5d6b9af3752',
                annotationType: 'inlineComment',
              },
            },
          ],
        },
        {
          type: 'text',
          text: ' across ranges',
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
          text: 'The below Media contains an annotation mark on the media node',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
        width: 760,
        widthType: 'pixel',
      },
      content: [
        {
          type: 'media',
          marks: [
            {
              type: 'annotation',
              attrs: {
                annotationType: 'inlineComment',
                id: '7053c566-db75-4605-b6b2-eca6a0cedff1',
              },
            },
            {
              type: 'border',
              attrs: {
                size: 2,
                color: '#172b4d',
              },
            },
          ],
          attrs: {
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
            type: 'external',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The below Media contains an annotation mark on the mediaSingle node',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
        width: 760,
        widthType: 'pixel',
      },
      marks: [
        {
          type: 'annotation',
          attrs: {
            annotationType: 'inlineComment',
            id: '7053c566-db75-4605-b6b2-eca6a0cedff2',
          },
        },
      ],
      content: [
        {
          type: 'media',
          attrs: {
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
            type: 'external',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The below node contain external media with just an annotation on the media node ',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
        width: 760,
        widthType: 'pixel',
      },
      content: [
        {
          type: 'media',
          marks: [
            {
              type: 'annotation',
              attrs: {
                annotationType: 'inlineComment',
                id: '7053c566-db75-4605-b6b2-eca6a0cedff1',
              },
            },
          ],
          attrs: {
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
            type: 'external',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The below Media contains an annotation mark on the file media node (which will always be loading) and on the caption',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
        width: 334,
        widthType: 'pixel',
      },
      content: [
        {
          type: 'media',
          attrs: {
            width: 334,
            alt: 'Screenshot 2024-02-23 at 1.14.43 PM.png',
            id: '1de76526-ecf0-489d-9641-17532579f086',
            collection: 'contentId-26738692',
            type: 'file',
            height: 188,
          },
          marks: [
            {
              type: 'annotation',
              attrs: {
                annotationType: 'inlineComment',
                id: '965e2ef6-722b-479d-995a-e63fb5511dd3',
              },
            },
          ],
        },
        {
          type: 'caption',
          content: [
            {
              text: 'This is a ',
              type: 'text',
              marks: [
                {
                  type: 'annotation',
                  attrs: {
                    annotationType: 'inlineComment',
                    id: '53500c44-4f1e-41eb-b215-9ccfaaa79397',
                  },
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

const containerStyles = css({
  display: 'flex',
  height: '100%',
});

const optionsStyles = css({
  flex: '20%',
  padding: token('space.200', '16px'),
});

const flagsStyles = css({
  padding: `${token('space.250', '20px')} 0`,
});

const mainStyles = css({
  flex: '80%',
});

export const useAnnotationsProvider = (setDocument: (doc: any) => void) => {
  const { state } = React.useContext(annotationsStore);
  const createNewAnnotationAndReplaceDocument = React.useCallback(
    (doc: JSONDocNode) => {
      setDocument(doc);
    },
    [setDocument],
  );

  const getAnnotationState = React.useCallback(async () => state, [state]);

  const annotationInlineCommentProvider = React.useMemo(
    () => ({
      getState: (annotationIds: AnnotationId[]) =>
        getAnnotationState().then(() => {
          const statedAnnotations = annotationIds.map((id) => {
            const annotationState = state[id];

            return {
              id,
              annotationType: AnnotationTypes.INLINE_COMMENT,
              state:
                annotationState === 'active'
                  ? AnnotationMarkStates.ACTIVE
                  : AnnotationMarkStates.RESOLVED,
            };
          });

          return statedAnnotations;
        }),
      updateSubscriber: updateAnnotationSubscriber,
      allowDraftMode: true,
      allowCommentsOnMedia: true,
      selectionComponent: ExampleSelectionInlineComponent(
        createNewAnnotationAndReplaceDocument,
      ),
      hoverComponent: ExampleHoverInlineComponent(
        createNewAnnotationAndReplaceDocument,
      ),
      viewComponent: ExampleViewInlineCommentComponent,
    }),
    [createNewAnnotationAndReplaceDocument, getAnnotationState, state],
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
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const [_, setInnerRefAssigned] = React.useState<boolean>(false);
  const [doc, setDoc] = React.useState(exampleDocumentWithComments);
  const annotationInlineCommentProvider = useAnnotationsProvider(setDoc);
  const annotationProvider = React.useMemo(() => {
    return {
      inlineComment: annotationInlineCommentProvider,
    };
  }, [annotationInlineCommentProvider]);

  return (
    <section css={containerStyles}>
      <section css={optionsStyles}>
        <h2>Annotations</h2>
        <section css={flagsStyles}>
          <h3>Options</h3>
        </section>
        <Annotations />
      </section>
      <main css={mainStyles}>
        <RendererActionsContext>
          <AnnotationsWrapper
            rendererRef={localRef}
            adfDocument={doc as DocNode}
            annotationProvider={annotationProvider}
          >
            <SmartCardProvider client={new CardClient('stg')}>
              <Renderer
                appearance="full-page"
                document={doc as DocNode}
                // @ts-ignore - Type '(ref: any) => void' is not assignable to type 'RefObject<HTMLDivElement>'.ts(2322)
                innerRef={(ref) => {
                  localRef.current = ref;
                  setInnerRefAssigned(true);
                }}
                allowAnnotations
              />
            </SmartCardProvider>
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
