import React from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { AnnotationViewWrapper } from './AnnotationViewWrapper';
import type { AnnotationProviders } from '../types';
import { AnnotationTestIds } from '../types';
import {
  getAnnotationViewKey,
  getSelectionPositions,
  getPluginState,
  getAllAnnotations,
} from '../utils';
import {
  removeInlineCommentNearSelection,
  updateInlineCommentResolvedState,
  setInlineCommentDraftState,
  createAnnotation,
  closeComponent,
} from '../commands';

import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import type {
  AnalyticsEventPayload,
  DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { CONTENT_COMPONENT } from '@atlaskit/editor-common/analytics';
import type { AnnotationAEP } from '@atlaskit/editor-common/analytics';
import { RESOLVE_METHOD } from '@atlaskit/editor-common/analytics';

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
    $from.nodeBefore.marks.find((mark) => mark.type.name === 'annotation')
  ) {
    return from - 1;
  }

  return from;
};

interface InlineCommentViewProps {
  providers: AnnotationProviders;
  editorView: EditorView;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

export function InlineCommentView({
  providers,
  editorView,
  editorAnalyticsAPI,
  dispatchAnalyticsEvent,
}: InlineCommentViewProps) {
  // As inlineComment is the only annotation present, this function is not generic
  const { inlineComment: inlineCommentProvider } = providers;
  const { state, dispatch } = editorView;

  const { createComponent: CreateComponent, viewComponent: ViewComponent } =
    inlineCommentProvider;
  const inlineCommentState = getPluginState(state);
  const { bookmark, selectedAnnotations, annotations } =
    inlineCommentState || {};
  const annotationsList = getAllAnnotations(editorView.state.doc);

  const selection = getSelectionPositions(state, inlineCommentState);
  const position = findPosForDOM(selection);
  let dom: HTMLElement | undefined;
  try {
    dom = findDomRefAtPos(
      position,
      editorView.domAtPos.bind(editorView),
    ) as HTMLElement;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.warn(error);
    if (dispatchAnalyticsEvent) {
      const payload: AnalyticsEventPayload = {
        action: ACTION.ERRORED,
        actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          component: CONTENT_COMPONENT.INLINE_COMMENT,
          selection: selection.toJSON(),
          position,
          docSize: editorView.state.doc.nodeSize,
          error: error.toString(),
        },
        nonPrivacySafeAttributes: {
          errorStack: error.stack || undefined,
        },
      };
      dispatchAnalyticsEvent(payload);
    }
  }

  if (!dom) {
    return null;
  }

  // Create Component
  if (bookmark) {
    if (!CreateComponent) {
      return null;
    }

    //getting all text between bookmarked positions
    const textSelection = state.doc.textBetween(selection.from, selection.to);
    return (
      <div
        data-testid={AnnotationTestIds.floatingComponent}
        data-editor-popup="true"
      >
        <CreateComponent
          dom={dom}
          textSelection={textSelection}
          onCreate={(id) => {
            createAnnotation(editorAnalyticsAPI)(id)(
              editorView.state,
              editorView.dispatch,
            );
            !editorView.hasFocus() && editorView.focus();
          }}
          onClose={() => {
            setInlineCommentDraftState(editorAnalyticsAPI)(false)(
              editorView.state,
              editorView.dispatch,
            );
            !editorView.hasFocus() && editorView.focus();
          }}
        />
      </div>
    );
  }

  // View Component
  const activeAnnotations =
    selectedAnnotations?.filter(
      (mark) => annotations && annotations[mark.id] === false,
    ) || [];
  if (!ViewComponent || activeAnnotations.length === 0) {
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
        overlap: activeAnnotations.length ? activeAnnotations.length - 1 : 0,
      },
    };
    dispatchAnalyticsEvent(payload);
  };

  if (!selectedAnnotations) {
    return null;
  }

  return (
    <AnnotationViewWrapper
      data-editor-popup="true"
      data-testid={AnnotationTestIds.floatingComponent}
      key={getAnnotationViewKey(activeAnnotations)}
      onViewed={onAnnotationViewed}
    >
      <ViewComponent
        annotationsList={annotationsList}
        annotations={activeAnnotations}
        dom={dom}
        onDelete={(id) => removeInlineCommentNearSelection(id)(state, dispatch)}
        onResolve={(id) =>
          updateInlineCommentResolvedState(editorAnalyticsAPI)(
            { [id]: true },
            RESOLVE_METHOD.COMPONENT,
          )(editorView.state, editorView.dispatch)
        }
        onClose={() => {
          closeComponent()(editorView.state, editorView.dispatch);
        }}
      />
    </AnnotationViewWrapper>
  );
}
