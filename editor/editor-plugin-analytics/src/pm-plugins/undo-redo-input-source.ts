import { type AnalyticsPayload } from '@atlaskit/adf-schema/steps';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';

const getUndoRedoInputSource = (tr: Readonly<Transaction>): string | null => {
	// TODO: Please, do not copy or use this kind of code below
	return tr.getMeta('undoRedoPlugin$') ?? null;
};

export const generateUndoRedoInputSoucePayload = (tr: Readonly<Transaction>) => {
	const undoRedoPluginInputSource = getUndoRedoInputSource(tr);

	return <T extends AnalyticsPayload>(payload: T): T => {
		const shouldAddHistoryTriggerMethodAttribute =
			undoRedoPluginInputSource && ['undid', 'redid'].includes(payload.action);

		return !shouldAddHistoryTriggerMethodAttribute
			? payload
			: {
					...payload,
					attributes: {
						...payload.attributes,
						historyTriggerMethod: undoRedoPluginInputSource,
					},
				};
	};
};
