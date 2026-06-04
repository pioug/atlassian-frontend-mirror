import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { ACTIONS } from '../../pm-plugins/actions';
import type { CodeBlockState } from '../../pm-plugins/main-state';

export const mapPendingFormats = (
	pendingFormats: CodeBlockState['pendingFormats'],
	tr: ReadonlyTransaction,
	newState: EditorState,
): CodeBlockState['pendingFormats'] => {
	const entries = Object.entries(pendingFormats);

	if (entries.length === 0) {
		return pendingFormats;
	}

	let nextPendingFormats = pendingFormats;
	entries.forEach(([localId, pendingFormat]) => {
		const { deleted, pos } = tr.mapping.mapResult(pendingFormat.pos, 1);
		const codeBlockNode = newState.doc.nodeAt(pos);
		const shouldRemovePendingFormat =
			deleted ||
			codeBlockNode?.type !== newState.schema.nodes.codeBlock ||
			codeBlockNode?.attrs.localId !== localId;
		const shouldUpdatePendingFormat = pos !== pendingFormat.pos;

		if (shouldRemovePendingFormat || shouldUpdatePendingFormat) {
			if (nextPendingFormats === pendingFormats) {
				nextPendingFormats = { ...pendingFormats };
			}
		}

		if (shouldRemovePendingFormat) {
			delete nextPendingFormats[localId];
			return;
		}

		if (shouldUpdatePendingFormat) {
			nextPendingFormats[localId] = {
				...pendingFormat,
				pos,
			};
		}
	});

	return nextPendingFormats;
};

function removeRecordEntry<Value>(
	record: Record<string, Value>,
	key: string,
): Record<string, Value> {
	const nextRecord = { ...record };
	delete nextRecord[key];
	return nextRecord;
}

export const applyFormatCodeMeta = (
	pluginState: CodeBlockState,
	meta: ReturnType<ReadonlyTransaction['getMeta']>,
): CodeBlockState => {
	switch (meta?.type) {
		case ACTIONS.START_FORMAT_CODE:
			return {
				...pluginState,
				pendingFormats: {
					...pluginState.pendingFormats,
					[meta.data.localId]: {
						languageSource: meta.data.languageSource,
						pos: meta.data.pos,
						requestId: meta.data.requestId,
					},
				},
			};

		case ACTIONS.RESOLVE_FORMAT_CODE: {
			const pendingFormats = removeRecordEntry(
				pluginState.pendingFormats,
				meta.data.localId,
			);
			const formatCodeErrors = removeRecordEntry(
				pluginState.formatCodeErrors,
				meta.data.localId,
			);

			return {
				...pluginState,
				formatCodeErrors:
					meta.data.outcome === 'failed'
						? {
								...formatCodeErrors,
								[meta.data.localId]: {
									errorType: meta.data.errorType,
									localId: meta.data.localId,
									languageSource: meta.data.languageSource,
								},
							}
						: formatCodeErrors,
				pendingFormats,
			};
		}

		case ACTIONS.CLEAR_FORMAT_CODE_ERROR:
			return {
				...pluginState,
				formatCodeErrors: removeRecordEntry(
					pluginState.formatCodeErrors,
					meta.data.localId,
				),
			};

		default:
			return pluginState;
	}
};
