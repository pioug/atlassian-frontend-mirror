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
	AnnotationAEP,
	AnnotationErrorAEP,
	EditorAnalyticsAPI,
	RESOLVE_METHOD,
} from '@atlaskit/editor-common/analytics';
import { applyMarkOnRange } from '@atlaskit/editor-common/mark';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getRangeInlineNodeNames } from '@atlaskit/editor-common/utils';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { AddMarkStep, type Step } from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';

import type { AnnotationPlugin } from '../annotationPluginType';
import {
	getDraftCommandAnalyticsPayload,
	getPluginState,
	resolveDraftBookmark,
} from '../pm-plugins/utils';
import type { InlineCommentInputMethod } from '../types';

const isAnnotationStep = (step: Step): step is AddMarkStep =>
	step instanceof AddMarkStep && step.mark.type.name === 'annotation';

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
			const tr = applyMarkOnRange(from, to, false, annotationMark, transaction);

			// The mark may not be applied to the current "head" of the bookmark so determine what was applied
			// above and use that instead
			const annotationMarkStep = tr.steps.reverse().find(isAnnotationStep);
			const headBasedOnMark = from === head ? annotationMarkStep?.from : annotationMarkStep?.to;
			tr.setSelection(TextSelection.create(tr.doc, headBasedOnMark ?? head));
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

		editorAPI?.editorViewModeEffects?.actions.applyViewModeStepAt(tr);

		// add insert analytics step to transaction
		tr = addInsertAnalytics(editorAnalyticsAPI)(tr, state);
		// add close analytics step to transaction
		tr = addOpenCloseAnalytics(editorAnalyticsAPI)(false, INPUT_METHOD.TOOLBAR)(tr, state);

		const pluginState = getPluginState(state);
		const isAutoScrollBugFixEnabled =
			pluginState?.featureFlagsPluginState?.commentsOnMediaAutoscrollInEditor;
		if (isAutoScrollBugFixEnabled) {
			// Explicitly disable scrollIntoView as scrolling is handled by CommentSidebar
			tr.setMeta('scrollIntoView', false);
		}

		return tr;
	};

const addOpenCloseAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(drafting: boolean, method: InlineCommentInputMethod = INPUT_METHOD.TOOLBAR) =>
	(transaction: Transaction, state: EditorState) => {
		const draftingPayload = getDraftCommandAnalyticsPayload(
			drafting,
			method,
		)(state) as AnalyticsEventPayload;
		editorAnalyticsAPI?.attachAnalyticsEvent(draftingPayload)(transaction);
		return transaction;
	};

const handleDraftState =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(drafting: boolean, method: InlineCommentInputMethod = INPUT_METHOD.TOOLBAR) =>
	(transaction: Transaction, state: EditorState) => {
		const tr = addOpenCloseAnalytics(editorAnalyticsAPI)(drafting, method)(transaction, state);

		const pluginState = getPluginState(state);
		const isAutoScrollBugFixEnabled =
			pluginState?.featureFlagsPluginState?.commentsOnMediaAutoscrollInEditor;

		if (isAutoScrollBugFixEnabled) {
			// Explicitly disable scrollIntoView as scrolling is handled by CommentSidebar
			tr.setMeta('scrollIntoView', false);
		}
		return tr;
	};

const addInsertAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(transaction: Transaction, state: EditorState) => {
		const analyticsEvent: AnnotationAEP = {
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.ANNOTATION,
			eventType: EVENT_TYPE.TRACK,
			actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
			attributes: {},
		};

		if (fg('editor_inline_comments_on_inline_nodes')) {
			const { bookmark } = getPluginState(state) || {};

			// When this FF is removed we can move the analytics event creation inside of the
			// attachAnalyticsEvent and get type inference for the attributes.
			// @ts-ignore
			analyticsEvent.attributes.inlineNodeNames = getRangeInlineNodeNames({
				doc: state.doc,
				pos: resolveDraftBookmark(state, bookmark),
			});
		}

		editorAnalyticsAPI?.attachAnalyticsEvent(analyticsEvent)(transaction);
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

const addPreemptiveGateErrorAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(errorReason?: string) =>
	(transaction: Transaction, state: EditorState) => {
		const analyticsEvent: AnnotationErrorAEP = {
			action: ACTION.ERROR,
			actionSubject: ACTION_SUBJECT.ANNOTATION,
			actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: {
				errorReason,
			},
		};
		editorAnalyticsAPI?.attachAnalyticsEvent(analyticsEvent)(transaction);
		return transaction;
	};

const addDeleteAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(transaction: Transaction, state: EditorState) => {
		const analyticsEvent: AnnotationAEP = {
			action: ACTION.DELETED,
			actionSubject: ACTION_SUBJECT.ANNOTATION,
			actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
			eventType: EVENT_TYPE.TRACK,
			attributes: {},
		};
		editorAnalyticsAPI?.attachAnalyticsEvent(analyticsEvent)(transaction);
		return transaction;
	};

export default {
	addAnnotationMark,
	addInlineComment,
	handleDraftState,
	addOpenCloseAnalytics,
	addInsertAnalytics,
	addResolveAnalytics,
	addPreemptiveGateErrorAnalytics,
	addDeleteAnalytics,
};
