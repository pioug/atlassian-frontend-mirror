import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { getDocStructure } from '../../utils/document-logger';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type {
  EditorAnalyticsAPI,
  ErrorEventPayload,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  EVENT_TYPE,
  ACTION_SUBJECT,
} from '@atlaskit/editor-common/analytics';

export const addSynchronyErrorAnalytics = (
  state: EditorState,
  tr: Transaction,
  featureFlags: FeatureFlags,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
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

    editorAnalyticsApi?.attachAnalyticsEvent(payload)(tr);
    return tr;
  };
};

export type EntityEventType = 'error' | 'disconnected';

export const addSynchronyEntityAnalytics = (
  state: EditorState,
  tr: Transaction,
) => {
  return (
    type: EntityEventType,
    editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  ) => {
    editorAnalyticsApi?.attachAnalyticsEvent({
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
    })(tr);
    return tr;
  };
};
