import { TABLE_OVERFLOW_CHANGE_TRIGGER } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { isTableSelected } from '@atlaskit/editor-tables/utils';

import type { PluginInjectionAPI } from '../../types';
import { META_KEYS } from '../table-analytics';
import { updateColumnWidths } from '../transforms/column-width';

import { createCommand, getPluginState } from './plugin-factory';
import { isClickNear } from './utils/dom';
import { evenAllColumnsWidths } from './utils/resize-state';
import type { ResizeState } from './utils/types';

export const evenColumns =
	({
		resizeState,
		table,
		start,
		event,
		api,
	}: {
		api: PluginInjectionAPI | undefined | null;
		event: MouseEvent;
		resizeState: ResizeState;
		start: number;
		table: PMNode;
	}): Command =>
	(state, dispatch) => {
		if (!isTableSelected(state.selection)) {
			return false;
		}

		// double click detection logic
		// Note: ProseMirror's handleDoubleClick doesn't quite work with DOM mousedown event handler
		const { lastClick } = getPluginState(state);
		const now = Date.now();
		if (lastClick && now - lastClick.time < 500 && isClickNear(event, lastClick)) {
			const newState = evenAllColumnsWidths(resizeState);
			setLastClick(null, (tr) => updateColumnWidths(newState, table, start, api)(tr))(
				state,
				dispatch,
			);

			return true;
		}

		setLastClick({ x: event.clientX, y: event.clientY, time: now })(state, dispatch);

		return false;
	};

export const distributeColumnsWidths =
	(
		newResizeState: ResizeState,
		table: ContentNodeWithPos,
		api: PluginInjectionAPI | undefined | null,
	): Command =>
	(state, dispatch) => {
		if (dispatch) {
			const tr = updateColumnWidths(newResizeState, table.node, table.start, api)(state.tr);
			tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
				name: TABLE_OVERFLOW_CHANGE_TRIGGER.DISTRIBUTED_COLUMNS,
			});
			stopResizing(tr)(state, dispatch);
		}

		return true;
	};

export const setResizeHandlePos = (resizeHandlePos: number | null) =>
	createCommand({
		type: 'SET_RESIZE_HANDLE_POSITION',
		data: {
			resizeHandlePos,
		},
	});

export const stopResizing = (tr?: Transaction) =>
	createCommand(
		{
			type: 'STOP_RESIZING',
		},
		(originalTr) =>
			(tr || originalTr).setMeta('scrollIntoView', false).setMeta('is-resizer-resizing', false),
	);

export const setDragging = (
	dragging: { startWidth: number; startX: number } | null,
	tr?: Transaction,
) =>
	createCommand(
		{
			type: 'SET_DRAGGING',
			data: {
				dragging,
			},
		},
		(originalTr) => (tr || originalTr).setMeta('is-resizer-resizing', true),
	);

const setLastClick = (
	lastClick: { time: number; x: number; y: number } | null,
	transform?: (tr: Transaction) => Transaction,
) =>
	createCommand(
		{
			type: 'SET_LAST_CLICK',
			data: {
				lastClick,
			},
		},
		transform,
	);
