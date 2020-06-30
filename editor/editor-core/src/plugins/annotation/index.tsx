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

import { inlineCommentPlugin } from './pm-plugins/inline-comment';
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
import {
  getAnnotationViewKey,
  getAnnotationText,
  getSelectionPositions,
  getPluginState,
  inlineCommentPluginKey,
} from './utils';
import {
  removeInlineCommentNearSelection,
  updateInlineCommentResolvedState,
  setInlineCommentDraftState,
  addInlineComment,
} from './commands';
import { buildToolbar } from './toolbar';
import {
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
  // don't try to add if there are is no temp highlight bookmarked
  const { bookmark } = getPluginState(state) || {};
  if (!bookmark || !dispatch) {
    return;
  }

  if (annotationType === AnnotationTypes.INLINE_COMMENT) {
    addInlineComment(id)(state, dispatch);
  }
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
          onCreate={id => {
            createAnnotation(state, dispatch)(id);
            !editorView.hasFocus() && editorView.focus();
          }}
          onClose={() => {
            setInlineCommentDraftState(false)(state, dispatch);
            !editorView.hasFocus() && editorView.focus();
          }}
        />
      </div>
    );
  }

  // View Component
  const annotations = inlineCommentState.selectedAnnotations.filter(
    mark => inlineCommentState.annotations[mark.id] === false,
  );
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
        overlap: annotations.length ? annotations.length - 1 : 0,
      },
    };
    dispatchAnalyticsEvent(payload);
  };

  // can not use dom.innerText here
  // because annotation can be split into multiple dom elements
  const annotationText = getAnnotationText(
    state.doc,
    annotations.map(x => x.id),
  );

  return (
    <AnnotationViewWrapper
      annotationText={annotationText}
      data-testid={AnnotationTestIds.floatingComponent}
      key={getAnnotationViewKey(annotations)}
      onViewed={onAnnotationViewed}
    >
      {(dismissCallback: () => void) => (
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
          onClose={dismissCallback}
        />
      )}
    </AnnotationViewWrapper>
  );
};

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
        if (
          pluginState &&
          !pluginState.bookmark &&
          !pluginState.mouseData.isSelecting
        ) {
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
