import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import {
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
  AnalyticsEventPayload,
  RESOLVE_METHOD,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
  getSelectionPositions,
  getPluginState,
  getDraftCommandAnalyticsPayload,
} from '../utils';
import { applyMarkOnRange } from '@atlaskit/editor-common/mark';

const addAnnotationMark =
  (id: string) => (transaction: Transaction, state: EditorState) => {
    const inlineCommentState = getPluginState(state);
    const { from, to, head } = getSelectionPositions(state, inlineCommentState);
    const annotationMark = state.schema.marks.annotation.create({
      id,
      type: AnnotationTypes.INLINE_COMMENT,
    });
    // Apply the mark only to text node in the range.
    let tr = applyMarkOnRange(from, to, false, annotationMark, transaction);
    // set selection back to the end of annotation once annotation mark is applied
    tr.setSelection(TextSelection.create(tr.doc, head));
    return tr;
  };

const addInlineComment =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (id: string) =>
  (transaction: Transaction, state: EditorState) => {
    let tr = addAnnotationMark(id)(transaction, state);
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
    method: INPUT_METHOD.SHORTCUT | INPUT_METHOD.TOOLBAR = INPUT_METHOD.TOOLBAR,
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
