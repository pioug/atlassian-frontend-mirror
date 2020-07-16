import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import { AnnotationViewWrapper } from './AnnotationViewWrapper';
import { AnnotationProviders, AnnotationTestIds } from '../types';
import {
  getAnnotationViewKey,
  getAnnotationText,
  getSelectionPositions,
  getPluginState,
} from '../utils';
import {
  removeInlineCommentNearSelection,
  updateInlineCommentResolvedState,
  setInlineCommentDraftState,
  createAnnotation,
} from '../commands';

import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  DispatchAnalyticsEvent,
} from '../../analytics';
import {
  RESOLVE_METHOD,
  AnnotationAEP,
} from '../../analytics/types/inline-comment-events';

const findPosForDOM = (sel: Selection) => {
  const { $from, from } = sel;

  // Retrieve current TextNode
  const index = $from.index();
  const node = index < $from.parent.childCount && $from.parent.child(index);

  // Right edge of a mark.
  if (
    !node &&
    $from.nodeBefore &&
    $from.nodeBefore.isText &&
    $from.nodeBefore.marks.find(mark => mark.type.name === 'annotation')
  ) {
    return from - 1;
  }

  return from;
};

interface InlineCommentViewProps {
  providers: AnnotationProviders;
  editorView: EditorView;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

export function InlineCommentView({
  providers,
  editorView,
  dispatchAnalyticsEvent,
}: InlineCommentViewProps) {
  // As inlineComment is the only annotation present, this function is not generic
  const { inlineComment: inlineCommentProvider } = providers;
  const { state, dispatch } = editorView;

  const {
    createComponent: CreateComponent,
    viewComponent: ViewComponent,
  } = inlineCommentProvider;
  const inlineCommentState = getPluginState(state);

  const selection = getSelectionPositions(state, inlineCommentState);
  const dom = findDomRefAtPos(
    findPosForDOM(selection),
    editorView.domAtPos.bind(editorView),
  ) as HTMLElement;

  // Create Component
  if (inlineCommentState.bookmark) {
    if (!CreateComponent) {
      return null;
    }

    //getting all text between bookmarked positions
    const textselection = state.doc.textBetween(selection.from, selection.to);
    return (
      <div data-testid={AnnotationTestIds.floatingComponent}>
        <CreateComponent
          dom={dom}
          textSelection={textselection}
          onCreate={id => {
            createAnnotation(id)(state, dispatch);
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
    annotations.map(annotation => annotation.id),
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
          onDelete={id => removeInlineCommentNearSelection(id)(state, dispatch)}
          onResolve={id =>
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
}
