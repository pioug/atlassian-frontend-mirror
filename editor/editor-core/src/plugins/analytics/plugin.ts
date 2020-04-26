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
import {
  UITracking,
  TransactionTracking,
  NodeViewTracking,
} from '../../types/performance-tracking';

interface AnalyticsPluginOptions {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  performanceTracking?: {
    transactionTracking?: TransactionTracking;
    uiTracking?: UITracking;
    nodeViewTracking?: NodeViewTracking;
  };
}

function createPlugin(options: AnalyticsPluginOptions) {
  if (!options || !options.createAnalyticsEvent) {
    return;
  }

  const hasRequiredPerformanceAPIs = isPerformanceAPIAvailable();

  return new Plugin({
    key: analyticsPluginKey,
    state: {
      init: () => options,
      apply: (tr, pluginState) => {
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
                fireAnalyticsEvent(pluginState.createAnalyticsEvent)({
                  payload: extendPayload(payload, duration),
                  channel,
                });
              });
            }
          }
        }
        return pluginState;
      },
    },
  });
}

const analyticsPlugin = (options: AnalyticsPluginOptions): EditorPlugin => ({
  name: 'analytics',

  pmPlugins() {
    return [
      {
        name: 'analyticsPlugin',
        plugin: () => createPlugin(options),
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
