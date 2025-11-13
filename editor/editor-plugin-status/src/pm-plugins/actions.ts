import { uuid } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type {
	Command,
	CommandDispatch,
	EditorCommand,
	TOOLBAR_MENU_TYPE,
} from '@atlaskit/editor-common/types';
import { getAnnotationMarksForPos } from '@atlaskit/editor-common/utils';
import { Fragment, type Mark } from '@atlaskit/editor-prosemirror/model';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import { canInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ClosingPayload, StatusType } from '../types';

import { pluginKey } from './plugin-key';

export const DEFAULT_STATUS: StatusType = {
	text: '',
	color: 'neutral',
};

export const verifyAndInsertStatus = (
	statusNode: Node,
	tr: Transaction,
	annotationMarks?: Mark[] | undefined,
): Transaction => {
	const fragment = Fragment.fromArray([statusNode, tr.doc.type.schema.text(' ', annotationMarks)]);
	const insertable = canInsert(tr.selection.$from, fragment);
	if (!insertable) {
		const parentSelection = NodeSelection.create(
			tr.doc,
			tr.selection.from - tr.selection.$anchor.parentOffset - 1,
		);
		tr.insert(parentSelection.to, fragment).setSelection(
			NodeSelection.create(tr.doc, parentSelection.to + 1),
		);
	} else {
		tr.insert(tr.selection.from, fragment).setSelection(
			NodeSelection.create(tr.doc, tr.selection.from - fragment.size),
		);
	}
	return tr
		.setMeta(pluginKey, {
			showStatusPickerAt: tr.selection.from,
			isNew: true,
		})
		.scrollIntoView();
};

export const createStatus = (tr: Transaction): Transaction => {
	const annotationMarksForPos: Mark[] | undefined = getAnnotationMarksForPos(tr.selection.$head);

	const statusNode = tr.doc.type.schema.nodes.status.createChecked(
		{
			...DEFAULT_STATUS,
			localId: uuid.generate(),
		},
		null,
		annotationMarksForPos,
	);
	return verifyAndInsertStatus(statusNode, tr, annotationMarksForPos);
};

export const insertStatus =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		inputMethod:
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR = INPUT_METHOD.TOOLBAR,
	): EditorCommand =>
	({ tr }) => {
		const statusTr = createStatus(tr);
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.STATUS,
			attributes: {
				inputMethod,
			},
			eventType: EVENT_TYPE.TRACK,
		})(statusTr);
		return statusTr;
	};

export const updateStatus =
	(status?: StatusType): Command =>
	(state, dispatch) => {
		const { schema } = state;

		const selectedStatus = status
			? Object.assign(status, {
					text: status.text.trim(),
					localId: status.localId || uuid.generate(),
				})
			: status;

		const statusProps = {
			...DEFAULT_STATUS,
			...selectedStatus,
		};

		let tr = state.tr;
		const { showStatusPickerAt } = pluginKey.getState(state) || {};

		if (!showStatusPickerAt) {
			// Same behaviour as quick insert (used in createStatus)
			const statusNode = schema.nodes.status.createChecked(statusProps);
			tr = verifyAndInsertStatus(statusNode, state.tr);
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		if (state.doc.nodeAt(showStatusPickerAt)) {
			tr.setNodeMarkup(showStatusPickerAt, schema.nodes.status, statusProps)
				.setSelection(NodeSelection.create(tr.doc, showStatusPickerAt))
				.setMeta(pluginKey, { showStatusPickerAt })
				.scrollIntoView();

			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};

export type UpdateStatus = (inputMethod: TOOLBAR_MENU_TYPE, status?: StatusType) => Command;

export const updateStatusWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: TOOLBAR_MENU_TYPE, status?: StatusType): Command =>
		withAnalytics(editorAnalyticsAPI, {
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.STATUS,
			attributes: { inputMethod },
			eventType: EVENT_TYPE.TRACK,
		})(updateStatus(status));

export const setStatusPickerAt =
	(showStatusPickerAt: number | null) =>
	(state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
		dispatch(
			state.tr.setMeta(pluginKey, {
				showStatusPickerAt,
				isNew: false,
			}),
		);
		return true;
	};

export const removeStatus =
	(showStatusPickerAt: number): EditorCommand =>
	({ tr }) => {
		tr.replace(showStatusPickerAt, showStatusPickerAt + 1);
		return tr;
	};

export const setFocusOnStatusInput =
	() => (state: EditorState, dispatch: CommandDispatch | undefined) => {
		if (!dispatch) {
			return false;
		}
		const tr = state.tr.setMeta(pluginKey, { focusStatusInput: true });
		dispatch(tr);
		return true;
	};

const handleClosingByArrows = (
	closingMethod: string,
	state: EditorState,
	showStatusPickerAt: number,
	tr: Transaction,
) => {
	if (closingMethod === 'arrowLeft') {
		// put cursor right before status Lozenge
		tr = tr.setSelection(Selection.near(state.tr.doc.resolve(showStatusPickerAt), -1));
	} else if (closingMethod === 'arrowRight') {
		// put cursor right after status Lozenge
		tr = tr.setSelection(Selection.near(state.tr.doc.resolve(showStatusPickerAt + 1)));
	}
};
export const commitStatusPicker = (closingPayload?: ClosingPayload) => (editorView: EditorView) => {
	const { state, dispatch } = editorView;
	const { showStatusPickerAt } = pluginKey.getState(state) || {};
	const { closingMethod } = closingPayload || {};
	if (!showStatusPickerAt) {
		return;
	}

	const statusNode = state.tr.doc.nodeAt(showStatusPickerAt);

	if (!statusNode) {
		return;
	}

	let tr = state.tr;
	tr = tr.setMeta(pluginKey, {
		showStatusPickerAt: null,
		focusStatusInput: false,
		isNew: false,
	});

	if (closingMethod) {
		handleClosingByArrows(closingMethod, state, showStatusPickerAt, tr);
	} else if (statusNode.attrs.text) {
		// still has content - keep content
		// move selection after status if selection did not change
		if (tr.selection.from === showStatusPickerAt) {
			tr = tr.setSelection(Selection.near(state.tr.doc.resolve(showStatusPickerAt + 2)));
		}
	} else {
		// no content - remove node
		tr = tr.delete(showStatusPickerAt, showStatusPickerAt + 1);
	}

	dispatch(tr);
	editorView.focus();
};
