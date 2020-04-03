import { Plugin } from 'prosemirror-state';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  isPerformanceAPIAvailable,
  measureRender,
} from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types/editor-plugin';
import { ACTION, AnalyticsEventPayload, EVENT_TYPE } from './types';
import { getAnalyticsEventsFromTransaction } from './utils';
import { analyticsPluginKey } from './plugin-key';
import { fireAnalyticsEvent } from './fire-analytics-event';

function createPlugin(createAnalyticsEvent?: CreateUIAnalyticsEvent) {
  if (!createAnalyticsEvent) {
    return;
  }

  const hasRequiredPerformanceAPIs = isPerformanceAPIAvailable();

  return new Plugin({
    key: analyticsPluginKey,
    state: {
      init: () => createAnalyticsEvent,
      apply: tr => {
        const analyticsEventWithChannel = getAnalyticsEventsFromTransaction(tr);
        if (analyticsEventWithChannel.length > 0) {
          for (const { payload, channel } of analyticsEventWithChannel) {
            // Measures how much time it takes to update the DOM after each ProseMirror document update
            // that has an analytics event.
            if (
              hasRequiredPerformanceAPIs &&
              tr.docChanged &&
              payload.action !== ACTION.INSERTED &&
              payload.action !== ACTION.DELETED
            ) {
              const measureName = `${payload.actionSubject}:${payload.action}:${payload.actionSubjectId}`;
              measureRender(measureName, duration => {
                fireAnalyticsEvent(createAnalyticsEvent)({
                  payload: extendPayload(payload, duration),
                  channel,
                });
              });
            }
          }
        }
        return createAnalyticsEvent;
      },
    },
  });
}

const analyticsPlugin = (
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): EditorPlugin => ({
  name: 'analytics',

  pmPlugins() {
    return [
      {
        name: 'analyticsPlugin',
        plugin: () => createPlugin(createAnalyticsEvent),
      },
    ];
  },
});

export function extendPayload(
  payload: AnalyticsEventPayload,
  duration: number,
) {
  return {
    ...payload,
    attributes: {
      ...payload.attributes,
      duration,
    },
    eventType: EVENT_TYPE.OPERATIONAL,
  } as AnalyticsEventPayload;
}

export default analyticsPlugin;
