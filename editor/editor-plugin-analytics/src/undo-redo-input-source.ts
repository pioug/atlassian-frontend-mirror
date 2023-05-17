import { Transaction } from 'prosemirror-state';

import { AnalyticsPayload } from '@atlaskit/adf-schema/steps';

const getUndoRedoInputSource = (tr: Transaction): string | null => {
  // TODO: Please, do not copy or use this kind of code below
  return tr.getMeta('undoRedoPlugin$') ?? null;
};

export const generateUndoRedoInputSoucePayload = (tr: Transaction) => {
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
