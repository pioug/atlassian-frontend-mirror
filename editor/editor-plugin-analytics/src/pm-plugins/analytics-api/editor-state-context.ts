import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	SELECTION_POSITION,
	SELECTION_TYPE,
	type BaseEventPayload,
} from '@atlaskit/editor-common/analytics';
import { findInsertLocation } from '@atlaskit/editor-common/utils/analytics';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export function getSelectionType(selection: Selection): {
	position?: SELECTION_POSITION;
	type: SELECTION_TYPE;
} {
	let type: SELECTION_TYPE;
	let position: SELECTION_POSITION | undefined;

	if (selection?.constructor?.name === 'GapCursorSelection') {
		type = SELECTION_TYPE.GAP_CURSOR;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		position = (selection as any).side;
	} else if (selection instanceof CellSelection) {
		type = SELECTION_TYPE.CELL;
	} else if (selection instanceof NodeSelection) {
		type = SELECTION_TYPE.NODE;
	} else if (selection.from !== selection.to) {
		type = SELECTION_TYPE.RANGED;
	} else {
		type = SELECTION_TYPE.CURSOR;
		const { from, $from } = selection;
		if (from === $from.start()) {
			position = SELECTION_POSITION.START;
		} else if (from === $from.end()) {
			position = SELECTION_POSITION.END;
		} else {
			position = SELECTION_POSITION.MIDDLE;
		}
	}

	return {
		type,
		position,
	};
}

function findInsertedLocation(oldSelection: Selection, newSelection: Selection): string {
	const { schema } = newSelection.$from.doc.type;
	const {
		nodes: { paragraph, table },
	} = schema;

	if (oldSelection instanceof CellSelection) {
		return table.name;
	}

	const insertLocationInfo = findParentNode((node) => node.type !== paragraph)(oldSelection);

	let parentNodePos = newSelection.$from.doc.resolve(insertLocationInfo?.start || 0);

	// Keep going one level above the attempted insert position till we find a node that contains the current cursor position in it's range
	while (parentNodePos.end() < newSelection.$from.pos) {
		parentNodePos = newSelection.$from.doc.resolve(
			parentNodePos.start(Math.max(parentNodePos.depth - 1, 0)),
		);
	}
	return parentNodePos.node().type.name;
}

export function getStateContext<Payload extends BaseEventPayload = AnalyticsEventPayload>(
	selection: Selection,
	payload: Payload,
	tr?: Transaction,
): Payload {
	if (!payload.attributes) {
		return payload;
	}
	const { type, position } = getSelectionType(selection);
	payload.attributes.selectionType = type;
	if (position) {
		payload.attributes.selectionPosition = position;
	}
	const insertLocation = findInsertLocation(selection);
	if (
		tr &&
		payload.action === ACTION.INSERTED &&
		payload.actionSubject !== ACTION_SUBJECT.ANNOTATION &&
		payload.actionSubject !== ACTION_SUBJECT.EDITOR_PLUGIN_AI
	) {
		payload.attributes.insertedLocation = findInsertedLocation(selection, tr.selection);
	}
	if (
		payload.action === ACTION.INSERTED &&
		payload.actionSubject === ACTION_SUBJECT.DOCUMENT &&
		payload.attributes
	) {
		payload.attributes.insertLocation = insertLocation;
		if (editorExperiment('platform_synced_block', true) && fg('platform_synced_block_dogfooding')) {
			const { bodiedSyncBlock } = selection.$from.doc.type.schema.nodes;
			payload.attributes.isInsideSyncedBlock = Boolean(findParentNodeOfType(bodiedSyncBlock)(selection));
		}
	} else {
		payload.attributes.nodeLocation = insertLocation;
	}

	return payload;
}
