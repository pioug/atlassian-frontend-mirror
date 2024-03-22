import { AnnotationTypes } from '@atlaskit/adf-schema';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
  AnalyticsEventPayload,
  EditorAnalyticsAPI,
  RESOLVE_METHOD,
} from '@atlaskit/editor-common/analytics';
import { applyMarkOnRange } from '@atlaskit/editor-common/mark';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { AnnotationPlugin, InlineCommentInputMethod } from '../types';
import {
  getDraftCommandAnalyticsPayload,
  getPluginState,
  resolveDraftBookmark,
} from '../utils';

const addAnnotationMark =
  (id: string, supportedBlockNodes?: string[]) =>
  (transaction: Transaction, state: EditorState) => {
    const inlineCommentState = getPluginState(state);
    const { bookmark } = inlineCommentState || {};
    const annotationMark = state.schema.marks.annotation.create({
      id,
      type: AnnotationTypes.INLINE_COMMENT,
    });
    const { from, to, head, isBlockNode } = resolveDraftBookmark(
      state,
      bookmark,
      supportedBlockNodes,
    );

    let tr = transaction;
    if (isBlockNode) {
      tr = tr.addNodeMark(from, annotationMark);
      // Set selection on the node so that we can display view component
      tr.setSelection(NodeSelection.create(tr.doc, from));
    } else {
      // Apply the mark only to text node in the range.
      let tr = applyMarkOnRange(from, to, false, annotationMark, transaction);
      // set selection back to the end of annotation once annotation mark is applied
      tr.setSelection(TextSelection.create(tr.doc, head));
    }
    return tr;
  };

const addInlineComment =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    editorAPI: ExtractInjectionAPI<AnnotationPlugin> | undefined,
  ) =>
  (id: string, supportedBlockNodes?: string[]) =>
  (transaction: Transaction, state: EditorState) => {
    let tr = addAnnotationMark(id, supportedBlockNodes)(transaction, state);

    editorAPI?.editorViewMode?.actions.applyViewModeStepAt(tr);

    // add insert analytics step to transaction
    tr = addInsertAnalytics(editorAnalyticsAPI)(tr, state);
    // add close analytics step to transaction
    tr = addOpenCloseAnalytics(editorAnalyticsAPI)(false, INPUT_METHOD.TOOLBAR)(
      tr,
      state,
    );

    return tr;
  };

const addOpenCloseAnalytics =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (
    drafting: boolean,
    method: InlineCommentInputMethod = INPUT_METHOD.TOOLBAR,
  ) =>
  (transaction: Transaction, state: EditorState) => {
    const draftingPayload = getDraftCommandAnalyticsPayload(
      drafting,
      method,
    )(state) as AnalyticsEventPayload;
    editorAnalyticsAPI?.attachAnalyticsEvent(draftingPayload)(transaction);
    return transaction;
  };

const addInsertAnalytics =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (transaction: Transaction, state: EditorState) => {
    editorAnalyticsAPI?.attachAnalyticsEvent({
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
    })(transaction);
    return transaction;
  };

const addResolveAnalytics =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (method?: RESOLVE_METHOD) =>
  (transaction: Transaction, state: EditorState) => {
    const resolvedPayload = {
      action: ACTION.RESOLVED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        method,
      },
    } as AnalyticsEventPayload;
    editorAnalyticsAPI?.attachAnalyticsEvent(resolvedPayload)(transaction);
    return transaction;
  };

export default {
  addAnnotationMark,
  addInlineComment,
  addOpenCloseAnalytics,
  addInsertAnalytics,
  addResolveAnalytics,
};
