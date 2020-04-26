import React from 'react';
import { findDomRefAtPos } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { annotation } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { CommandDispatch } from '../../types/command';
import WithPluginState from '../../ui/WithPluginState';
import { stateKey as reactPluginKey } from '../../plugins/base/pm-plugins/react-nodeview';
import { FloatingToolbarConfig } from '../floating-toolbar/types';
import { keymapPlugin } from './pm-plugins/keymap';

import {
  AnnotationProvider,
  AnnotationInfo,
  AnnotationState,
  InlineCommentState,
  AnnotationCreateComponentProps,
  AnnotationViewComponentProps,
  AnnotationTypeProvider,
  AnnotationTestIds,
  AnnotationTypes,
  InlineCommentPluginState,
} from './types';
import { reorderAnnotations } from './utils';
import {
  removeInlineCommentNearSelection,
  resolveInlineComment,
  setInlineCommentDraftState,
} from './commands';
import {
  inlineCommentPlugin,
  getPluginState,
} from './pm-plugins/inline-comment';
import { buildToolbar } from './toolbar';
import { inlineCommentPluginKey } from './pm-plugins/plugin-factory';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../analytics';
import { RESOLVE_METHOD } from '../analytics/types/inline-comment-events';

function annotationEnabled(
  provider?: AnnotationProvider,
): provider is Required<AnnotationProvider> {
  if (!provider) {
    return false;
  }

  const { createComponent, viewComponent, providers } = provider;
  return !!providers && !!createComponent && !!viewComponent;
}

const findAnnotationsInSelection = (state: EditorState): AnnotationInfo[] => {
  // Only detect annotations on caret selection
  if (!state.selection.empty) {
    return [];
  }

  const { anchor } = state.selection;
  const { annotation: annotationMarkType } = state.schema.marks;

  const node = state.doc.nodeAt(anchor);
  if (!node || !node.marks.length) {
    return [];
  }

  const annotations = node.marks
    .filter(mark => mark.type === annotationMarkType)
    .map(mark => ({
      id: mark.attrs.id,
      type: mark.attrs.annotationType,
    }));

  reorderAnnotations(annotations, state.selection.$anchor);
  return annotations;
};

export const createAnnotation = (
  state: EditorState,
  dispatch: CommandDispatch,
  annotationType: AnnotationTypes = AnnotationTypes.INLINE_COMMENT,
) => (id: string) => {
  const inlineCommentState = getPluginState(state);
  if (!inlineCommentState) {
    return;
  }

  const { bookmark } = inlineCommentState;
  if (!bookmark || !dispatch) {
    return;
  }

  const { from, to } = getSelectionPositions(state, inlineCommentState);
  const annotationMark = state.schema.marks.annotation.create({
    id,
    type: annotationType,
  });
  setInlineCommentDraftState(false)(state, dispatch);

  const tr = addAnalytics(state, state.tr.addMark(from, to, annotationMark), {
    action: ACTION.ADDED,
    actionSubject: ACTION_SUBJECT.ANNOTATION,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
  });
  dispatch(tr);
};

const renderComponent = (
  provider: AnnotationProvider,
  editorView: EditorView,
) => () => {
  const { state, dispatch } = editorView;
  const {
    createComponent: CreateComponent,
    viewComponent: ViewComponent,
  } = provider;
  const inlineCommentState = getPluginState(state);
  const dom = findDomRefAtPos(
    getSelectionPositions(state, inlineCommentState).from,
    editorView.domAtPos.bind(editorView),
  ) as HTMLElement;

  // Create Component
  if (inlineCommentState.bookmark) {
    if (!CreateComponent) {
      return null;
    }
    return (
      <div data-testid={AnnotationTestIds.floatingComponent}>
        <CreateComponent
          dom={dom}
          onCreate={createAnnotation(state, dispatch)}
          onClose={() => {
            setInlineCommentDraftState(false)(state, dispatch);
          }}
        />
      </div>
    );
  }

  // View Component
  const annotations = findAnnotationsInSelection(state).filter(
    mark => inlineCommentState.annotations[mark.id] === false,
  );
  if (!ViewComponent || annotations.length === 0) {
    return null;
  }

  return (
    <div data-testid={AnnotationTestIds.floatingComponent}>
      <ViewComponent
        annotations={annotations}
        dom={dom}
        onDelete={(id: string) =>
          removeInlineCommentNearSelection(id)(state, dispatch)
        }
        onResolve={(id: string) =>
          resolveInlineComment(id, RESOLVE_METHOD.COMPONENT)(state, dispatch)
        }
      />
    </div>
  );
};

/*
 * get selection from position to apply new comment for
 */
function getSelectionPositions(
  editorState: EditorState,
  inlineCommentState: InlineCommentPluginState,
): {
  from: number;
  to: number;
} {
  let { from, to } = editorState.selection;
  const { bookmark } = inlineCommentState;

  // get positions via saved bookmark if it is available
  // this is to make comments box positioned relative to temporary highlight rather then current selection
  if (bookmark) {
    const resolvedBookmark = bookmark.resolve(editorState.doc);
    from = resolvedBookmark.from;
    to = resolvedBookmark.to;
  }
  return { from, to };
}

const annotationPlugin = (
  annotationProvider?: AnnotationProvider,
): EditorPlugin => {
  return {
    name: 'annotation',

    marks() {
      return [
        {
          name: 'annotation',
          mark: annotation,
        },
      ];
    },

    pmPlugins: () => [
      {
        name: 'annotation',
        plugin: ({ dispatch, portalProviderAPI, eventDispatcher }) => {
          return annotationProvider &&
            annotationProvider.providers &&
            annotationProvider.providers.inlineComment
            ? inlineCommentPlugin({
                dispatch,
                portalProviderAPI,
                eventDispatcher,
                inlineCommentProvider:
                  annotationProvider.providers.inlineComment,
                pollingInterval:
                  annotationProvider.providers.inlineComment.pollingInterval,
              })
            : undefined;
        },
      },
      {
        name: 'annotationKeymap',
        plugin: () => {
          return annotationEnabled(annotationProvider) &&
            annotationProvider.providers.inlineComment
            ? keymapPlugin()
            : undefined;
        },
      },
    ],

    pluginsOptions: {
      floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
        if (!annotationEnabled(annotationProvider)) {
          return;
        }

        const pluginState = getPluginState(state);
        if (pluginState && !pluginState.bookmark) {
          return buildToolbar(state, intl);
        }
      },
    },

    contentComponent({ editorView }) {
      if (!annotationEnabled(annotationProvider)) {
        return null;
      }

      return (
        <WithPluginState
          plugins={{
            selectionState: reactPluginKey,
            inlineCommentState: inlineCommentPluginKey,
          }}
          render={renderComponent(annotationProvider, editorView)}
        />
      );
    },
  };
};

export default annotationPlugin;
export {
  AnnotationProvider,
  AnnotationCreateComponentProps,
  AnnotationViewComponentProps,
  AnnotationTypeProvider,
  AnnotationInfo,
  AnnotationState,
  AnnotationTypes,
  InlineCommentState,
};
