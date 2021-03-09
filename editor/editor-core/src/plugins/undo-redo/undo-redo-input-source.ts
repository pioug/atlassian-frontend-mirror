import { Transaction } from 'prosemirror-state';
import { pluginKey as undoRedoPluginKey } from './pm-plugins/plugin-key';
import { InputSource } from './enums';
import { AnalyticsPayload } from '@atlaskit/adf-schema/steps';

const getUndoRedoInputSource = (tr: Transaction): InputSource | null => {
  return tr.getMeta(undoRedoPluginKey) || null;
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
