import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
	changeImageAlignment,
	changeImageAlignmentNext,
	toggleBlockMark,
	toggleBlockMarkNext,
} from '@atlaskit/editor-common/commands';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type {
	Command,
	CommandDispatch,
	EditorCommand,
	ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';

import type { AlignmentPlugin, InputMethod } from '../alignmentPluginType';
import type { AlignmentState } from '../pm-plugins/types';

/**
 * Iterates over the commands one after the other,
 * passes the tr through and dispatches the cumulated transaction
 */
function cascadeCommands(cmds: Command[]): Command {
	return (state: EditorState, dispatch?: CommandDispatch) => {
		const { tr: baseTr } = state;
		let shouldDispatch = false;

		const onDispatchAction = (tr: Transaction) => {
			const selectionJSON = tr.selection.toJSON();
			baseTr.setSelection(Selection.fromJSON(baseTr.doc, selectionJSON));
			tr.steps.forEach((st) => {
				baseTr.step(st);
			});
			shouldDispatch = true;
		};

		cmds.forEach((cmd) => cmd(state, onDispatchAction));

		if (dispatch && shouldDispatch) {
			dispatch(baseTr);
			return true;
		}

		return false;
	};
}

export const isAlignable =
	(align?: AlignmentState): Command =>
	(state, dispatch) => {
		const {
			nodes: { paragraph, heading },
			marks: { alignment },
		} = state.schema;
		return toggleBlockMark(
			alignment,
			() => (!align ? undefined : align === 'start' ? false : { align }),
			[paragraph, heading],
		)(state, dispatch);
	};

const changeBlockAlignmentWithAnalytics =
	(
		editorAnalyticsApi?: EditorAnalyticsAPI,
		align?: AlignmentState,
		inputMethod?: InputMethod,
	): Command =>
	(state, dispatch) => {
		const {
			nodes: { paragraph, heading },
			marks: { alignment },
		} = state.schema;

		return withAnalytics(editorAnalyticsApi, {
			eventType: EVENT_TYPE.TRACK,
			actionSubject: ACTION_SUBJECT.ALIGNMENT,
			action: ACTION.UPDATED,
			actionSubjectId: ACTION_SUBJECT_ID.TEXT,
			attributes: {
				alignmentType: align,
				inputMethod,
			},
		})(
			toggleBlockMark(
				alignment,
				() => (!align ? undefined : align === 'start' ? false : { align }),
				[paragraph, heading],
			),
		)(state, dispatch);
	};

const changeBlockAlignmentWithAnalyticsTr =
	(
		api: ExtractInjectionAPI<AlignmentPlugin> | undefined,
		align?: AlignmentState,
		inputMethod?: InputMethod,
	): EditorCommand =>
	({ tr }) => {
		const {
			nodes: { paragraph, heading },
			marks: { alignment },
		} = tr.doc.type.schema;

		const alignmentApplied = toggleBlockMarkNext(
			alignment,
			() => (!align ? undefined : align === 'start' ? false : { align }),
			[paragraph, heading],
		)(tr);

		if (alignmentApplied) {
			api?.analytics?.actions.attachAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				actionSubject: ACTION_SUBJECT.ALIGNMENT,
				action: ACTION.UPDATED,
				actionSubjectId: ACTION_SUBJECT_ID.TEXT,
				attributes: {
					alignmentType: align,
					inputMethod,
				},
			})(tr);
		}

		return tr;
	};

const changeImageAlignmentWithAnalytics =
	(
		editorAnalyticsApi?: EditorAnalyticsAPI,
		align?: AlignmentState,
		inputMethod?: InputMethod,
	): Command =>
	(state, dispatch) => {
		return withAnalytics(editorAnalyticsApi, {
			eventType: EVENT_TYPE.TRACK,
			actionSubject: ACTION_SUBJECT.ALIGNMENT,
			action: ACTION.UPDATED,
			actionSubjectId: ACTION_SUBJECT_ID.MEDIA_SINGLE,
			attributes: {
				alignmentType: align,
				inputMethod,
			},
		})(changeImageAlignment(align))(state, dispatch);
	};

const changeImageAlignmentWithAnalyticsTr =
	(
		api?: ExtractInjectionAPI<AlignmentPlugin>,
		align?: AlignmentState,
		inputMethod?: InputMethod,
	): EditorCommand =>
	({ tr }) => {
		const alignmentApplied = changeImageAlignmentNext(align)(tr);

		if (alignmentApplied) {
			api?.analytics?.actions.attachAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				actionSubject: ACTION_SUBJECT.ALIGNMENT,
				action: ACTION.UPDATED,
				actionSubjectId: ACTION_SUBJECT_ID.MEDIA_SINGLE,
				attributes: {
					alignmentType: align,
					inputMethod,
				},
			})(tr);
		}

		return tr;
	};

// Remove this when cleaning up platform_editor_toolbar_aifc
// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 *
 * @deprecated use changeAlignmentTr instead
 */
export const changeAlignment =
	(
		align?: AlignmentState,
		api?: ExtractInjectionAPI<AlignmentPlugin>,
		inputMethod?: InputMethod,
	): Command =>
	(state, dispatch) => {
		return cascadeCommands([
			changeImageAlignmentWithAnalytics(api?.analytics?.actions, align, inputMethod),
			changeBlockAlignmentWithAnalytics(api?.analytics?.actions, align, inputMethod),
		])(state, dispatch);
	};

export const changeAlignmentTr =
	(
		api: ExtractInjectionAPI<AlignmentPlugin> | undefined,
		align?: AlignmentState,
		inputMethod?: InputMethod,
	): EditorCommand =>
	({ tr }) => {
		changeBlockAlignmentWithAnalyticsTr(api, align, inputMethod)({ tr });
		changeImageAlignmentWithAnalyticsTr(api, align, inputMethod)({ tr });
		return tr;
	};
