import React from 'react';
import { findDomRefAtPos } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { annotation, AnnotationTypes } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { CommandDispatch } from '../../types/command';
import WithPluginState from '../../ui/WithPluginState';
import { stateKey as reactPluginKey } from '../../plugins/base/pm-plugins/react-nodeview';
import { FloatingToolbarConfig } from '../floating-toolbar/types';
import { keymapPlugin } from './pm-plugins/keymap';

import {
  inlineCommentPlugin,
  getPluginState,
} from './pm-plugins/inline-comment';
import { InlineCommentPluginState } from './pm-plugins/types';
import {
  AnnotationProviders,
  InlineCommentAnnotationProvider,
  AnnotationInfo,
  AnnotationState,
  InlineCommentState,
  InlineCommentCreateComponentProps,
  InlineCommentViewComponentProps,
  AnnotationTypeProvider,
  AnnotationTestIds,
} from './types';
import { UpdateEvent, AnnotationUpdateEmitter } from './update-provider';
import { findAnnotationsInSelection, getAnnotationViewKey } from './utils';
import {
  removeInlineCommentNearSelection,
  updateInlineCommentResolvedState,
  setInlineCommentDraftState,
} from './commands';
import { buildToolbar } from './toolbar';
import { inlineCommentPluginKey } from './pm-plugins/plugin-factory';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  DispatchAnalyticsEvent,
} from '../analytics';
import {
  RESOLVE_METHOD,
  AnnotationAEP,
} from '../analytics/types/inline-comment-events';
import { AnnotationViewWrapper } from './ui';

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

  /**
   * Optimistic creation: This will create the comment right away in the state,
   * assuming no failure on consumer side. We will follow up on failure scenarios under
   * https://product-fabric.atlassian.net/browse/ED-9338
   **/
  updateInlineCommentResolvedState({ [id]: false })(state, dispatch);

  setInlineCommentDraftState(false)(state, dispatch);

  const tr = addAnalytics(state, state.tr.addMark(from, to, annotationMark), {
    action: ACTION.ADDED,
    actionSubject: ACTION_SUBJECT.ANNOTATION,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
  });
  dispatch(tr);
};

const renderInlineCommentComponents = (
  providers: AnnotationProviders,
  editorView: EditorView,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => () => {
  // As inlineComment is the only annotation present, this function is not generic
  const { inlineComment: inlineCommentProvider } = providers;
  const { state, dispatch } = editorView;

  const {
    createComponent: CreateComponent,
    viewComponent: ViewComponent,
  } = inlineCommentProvider;
  const inlineCommentState = getPluginState(state);

  const selPositions = getSelectionPositions(state, inlineCommentState);
  const dom = findDomRefAtPos(
    selPositions.from,
    editorView.domAtPos.bind(editorView),
  ) as HTMLElement;

  // Create Component
  if (inlineCommentState.bookmark) {
    if (!CreateComponent) {
      return null;
    }

    //getting all text between bookmarked positions
    const textselection = state.doc.textBetween(
      selPositions.from,
      selPositions.to,
    );
    return (
      <div data-testid={AnnotationTestIds.floatingComponent}>
        <CreateComponent
          dom={dom}
          textSelection={textselection}
          onCreate={createAnnotation(state, dispatch)}
          onClose={() => {
            setInlineCommentDraftState(false)(state, dispatch);
          }}
        />
      </div>
    );
  }

  // View Component
  const annotations = findAnnotationsInSelection(
    state.selection,
    state.doc,
  ).filter(mark => inlineCommentState.annotations[mark.id] === false);
  if (!ViewComponent || annotations.length === 0) {
    return null;
  }

  const onAnnotationViewed = () => {
    if (!dispatchAnalyticsEvent) {
      return;
    }

    // fire analytics
    const payload: AnnotationAEP = {
      action: ACTION.VIEWED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        overlap: annotations.length,
      },
    };
    dispatchAnalyticsEvent(payload);
  };

  return (
    <AnnotationViewWrapper
      data-testid={AnnotationTestIds.floatingComponent}
      key={getAnnotationViewKey(annotations)}
      onViewed={onAnnotationViewed}
    >
      <ViewComponent
        annotations={annotations}
        dom={dom}
        onDelete={(id: string) =>
          removeInlineCommentNearSelection(id)(state, dispatch)
        }
        onResolve={(id: string) =>
          updateInlineCommentResolvedState(
            { [id]: true },
            RESOLVE_METHOD.COMPONENT,
          )(state, dispatch)
        }
      />
    </AnnotationViewWrapper>
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
  annotationProviders?: AnnotationProviders,
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
          if (annotationProviders) {
            return inlineCommentPlugin({
              dispatch,
              portalProviderAPI,
              eventDispatcher,
              provider: annotationProviders.inlineComment,
            });
          }

          return;
        },
      },
      {
        name: 'annotationKeymap',
        plugin: () => {
          if (annotationProviders) {
            return keymapPlugin();
          }
          return;
        },
      },
    ],

    pluginsOptions: {
      floatingToolbar(state, intl): FloatingToolbarConfig | undefined {
        if (!annotationProviders) {
          return;
        }

        const pluginState = getPluginState(state);
        if (pluginState && !pluginState.bookmark) {
          return buildToolbar(state, intl);
        }
      },
    },

    contentComponent({ editorView, dispatchAnalyticsEvent }) {
      if (!annotationProviders) {
        return null;
      }

      return (
        <WithPluginState
          plugins={{
            selectionState: reactPluginKey,
            inlineCommentState: inlineCommentPluginKey,
          }}
          render={renderInlineCommentComponents(
            annotationProviders,
            editorView,
            dispatchAnalyticsEvent,
          )}
        />
      );
    },
  };
};

export default annotationPlugin;
export {
  AnnotationProviders,
  InlineCommentAnnotationProvider,
  InlineCommentCreateComponentProps,
  InlineCommentViewComponentProps,
  AnnotationTypeProvider,
  AnnotationInfo,
  AnnotationState,
  InlineCommentState,
  UpdateEvent,
  AnnotationUpdateEmitter,
};
