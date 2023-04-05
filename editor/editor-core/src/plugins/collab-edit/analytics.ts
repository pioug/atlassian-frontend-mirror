import {
  addAnalytics,
  ACTION,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ErrorEventPayload,
} from '../analytics';
import { EditorState, Transaction } from 'prosemirror-state';
import { getDocStructure } from '../../utils/document-logger';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
import { FeatureFlags } from '@atlaskit/editor-common/types';

export const addSynchronyErrorAnalytics = (
  state: EditorState,
  tr: Transaction,
  featureFlags: FeatureFlags,
) => {
  return (error: Error) => {
    const browserExtensions = sniffUserBrowserExtensions({
      extensions: ['grammarly'],
    });

    const payload: ErrorEventPayload = {
      action: ACTION.SYNCHRONY_ERROR,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: { error, browserExtensions },
    };

    if (featureFlags.synchronyErrorDocStructure) {
      payload.attributes!.docStructure = getDocStructure(state.doc, {
        compact: true,
      });
    }

    return addAnalytics(state, tr, payload);
  };
};

export type EntityEventType = 'error' | 'disconnected';

export const addSynchronyEntityAnalytics = (
  state: EditorState,
  tr: Transaction,
) => {
  return (type: EntityEventType) =>
    addAnalytics(state, tr, {
      action:
        type === 'error'
          ? ACTION.SYNCHRONY_ENTITY_ERROR
          : ACTION.SYNCHRONY_DISCONNECTED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
        onLine: navigator.onLine,
        visibilityState: document.visibilityState,
      },
    });
};
