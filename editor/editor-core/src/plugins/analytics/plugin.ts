import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  isPerformanceAPIAvailable,
  measureRender,
} from '@atlaskit/editor-common/utils';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsEventPayload } from './types';
import { ACTION, EVENT_TYPE } from './types';
import { analyticsPluginKey } from './plugin-key';
import {
  fireAnalyticsEvent,
  getAnalyticsEventsFromTransaction,
} from '@atlaskit/editor-common/analytics';

import type {
  FeatureFlags,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { PerformanceTracking } from '../../types/performance-tracking';
import type { analyticsPlugin as newAnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

interface AnalyticsPluginOptions {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  performanceTracking?: PerformanceTracking;
}

function createPlugin(
  options: AnalyticsPluginOptions,
  featureFlags: FeatureFlags,
  pluginInjectionApi: ExtractInjectionAPI<typeof analyticsPlugin> | undefined,
) {
  if (!options) {
    return;
  }

  const hasRequiredPerformanceAPIs = isPerformanceAPIAvailable();
  const getCreateAnalyticsEvent = () =>
    pluginInjectionApi?.analytics?.sharedState.currentState()
      ?.createAnalyticsEvent;

  return new SafePlugin({
    key: analyticsPluginKey,
    state: {
      init: () => {
        return {
          ...options,
          createAnalyticsEvent: getCreateAnalyticsEvent(),
          fireAnalytics: fireAnalyticsEvent(options.createAnalyticsEvent),
          editorAnalyticsApi: pluginInjectionApi?.analytics?.actions,
        };
      },
      apply: (tr, pluginState, _, state) => {
        if (pluginState.createAnalyticsEvent !== getCreateAnalyticsEvent()) {
          // When the plugin state is reconfigured, the init function isn't called again
          return {
            ...pluginState,
            createAnalyticsEvent:
              options.createAnalyticsEvent ?? getCreateAnalyticsEvent(),
          };
        }

        if (featureFlags.catchAllTracking) {
          const analyticsEventWithChannel =
            getAnalyticsEventsFromTransaction(tr);
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
                measureRender(
                  // NOTE this name could be resulting in misleading data -- where if multiple payloads are
                  // received before a render completes -- the measurement value will be inaccurate (this is
                  // due to measureRender requiring unique measureNames)
                  measureName,
                  ({ duration, distortedDuration }) => {
                    fireAnalyticsEvent(
                      pluginState.createAnalyticsEvent || undefined,
                    )({
                      payload: extendPayload({
                        payload,
                        duration,
                        distortedDuration,
                      }),
                      channel,
                    });
                  },
                );
              }
            }
          }
        }
        return pluginState;
      },
    },
  });
}

/**
 * @private
 * @deprecated
 * Do not use this analytics plugin.
 * This will be deprecated soon.
 */
const analyticsPlugin: NextEditorPlugin<
  'deprecatedAnalytics',
  {
    pluginConfiguration: AnalyticsPluginOptions;
    dependencies: [typeof featureFlagsPlugin, typeof newAnalyticsPlugin];
  }
> = ({ config: options, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

  return {
    name: 'deprecatedAnalytics',

    pmPlugins() {
      return [
        {
          name: 'analyticsPlugin',
          plugin: () => createPlugin(options ?? {}, featureFlags, api),
        },
      ];
    },
  };
};

export function extendPayload({
  payload,
  duration,
  distortedDuration,
}: {
  payload: AnalyticsEventPayload;
  duration: number;
  distortedDuration: boolean;
}) {
  return {
    ...payload,
    attributes: {
      ...payload.attributes,
      duration,
      distortedDuration,
    },
    eventType: EVENT_TYPE.OPERATIONAL,
  } as AnalyticsEventPayload;
}

export default analyticsPlugin;
