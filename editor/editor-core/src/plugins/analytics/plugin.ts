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
import { getFeatureFlags } from '../feature-flags-context';
import {
  AnalyticsStep,
  AnalyticsWithChannel,
} from '@atlaskit/adf-schema/steps';
import { generateUndoRedoInputSoucePayload } from '../undo-redo/undo-redo-input-source';
import { PerformanceTracking } from '../../types/performance-tracking';

interface AnalyticsPluginOptions {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  performanceTracking?: PerformanceTracking;
}

function createPlugin(options: AnalyticsPluginOptions) {
  if (!options || !options.createAnalyticsEvent) {
    return;
  }

  const hasRequiredPerformanceAPIs = isPerformanceAPIAvailable();

  return new Plugin({
    key: analyticsPluginKey,
    state: {
      init: () => {
        return {
          ...options,
          fireAnalytics: fireAnalyticsEvent(options.createAnalyticsEvent),
        };
      },
      apply: (tr, pluginState, _, state) => {
        if (getFeatureFlags(state)?.catchAllTracking) {
          const analyticsEventWithChannel = getAnalyticsEventsFromTransaction(
            tr,
          );
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
                measureRender(measureName, (duration) => {
                  fireAnalyticsEvent(pluginState.createAnalyticsEvent)({
                    payload: extendPayload(payload, duration),
                    channel,
                  });
                });
              }
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

  onEditorViewStateUpdated({
    originalTransaction,
    transactions,
    newEditorState,
  }) {
    const pluginState = analyticsPluginKey.getState(newEditorState);

    if (!pluginState || !pluginState.createAnalyticsEvent) {
      return;
    }

    const steps = transactions.reduce<AnalyticsWithChannel<any>[]>(
      (acc, tr) => {
        const payloads: AnalyticsWithChannel<any>[] = tr.steps
          .filter(
            (step): step is AnalyticsStep<any> => step instanceof AnalyticsStep,
          )
          .map((x) => x.analyticsEvents)
          .reduce((acc, val) => acc.concat(val), []);

        acc.push(...payloads);

        return acc;
      },
      [],
    );

    if (steps.length === 0) {
      return;
    }

    const { createAnalyticsEvent } = pluginState;
    const undoAnaltyicsEventTransformer = generateUndoRedoInputSoucePayload(
      originalTransaction,
    );
    steps.forEach(({ payload, channel }) => {
      const nextPayload = undoAnaltyicsEventTransformer(payload);

      fireAnalyticsEvent(createAnalyticsEvent)({
        payload: nextPayload,
        channel,
      });
    });
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
