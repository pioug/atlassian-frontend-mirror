import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  EditorState,
  ReadonlyTransaction,
  SafePluginSpec,
} from 'prosemirror-state';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import { EditorView } from 'prosemirror-view';
import { EditorProps } from '../../types/editor-props';
import { TransactionTracker } from './track-transactions';
import { freezeUnsafeTransactionProperties } from './safer-transactions';
import { FeatureFlags } from '../../types/feature-flags';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';

type InstrumentedPluginOptions = EditorProps['performanceTracking'] & {
  saferDispatchedTransactions?: FeatureFlags['saferDispatchedTransactions'];
  saferDispatchedTransactionsAnalyticsOnly?: FeatureFlags['saferDispatchedTransactionsAnalyticsOnly'];
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

export class InstrumentedPlugin<PluginState> extends SafePlugin<PluginState> {
  constructor(
    spec: SafePluginSpec,
    options: InstrumentedPluginOptions = {},
    transactionTracker?: TransactionTracker,
  ) {
    const {
      transactionTracking = { enabled: false },
      uiTracking = { enabled: false },
      saferDispatchedTransactions = false,
      saferDispatchedTransactionsAnalyticsOnly = false,
      dispatchAnalyticsEvent,
    } = options;

    const shouldOverrideApply =
      (transactionTracking.enabled && transactionTracker) ||
      saferDispatchedTransactions ||
      saferDispatchedTransactionsAnalyticsOnly;

    if (shouldOverrideApply && spec.state) {
      const originalApply = spec.state.apply.bind(spec.state);

      spec.state.apply = (
        aTr: ReadonlyTransaction,
        value: PluginState,
        oldState: EditorState,
        newState: EditorState,
      ) => {
        const self = this as any;
        const tr =
          saferDispatchedTransactions ||
          saferDispatchedTransactionsAnalyticsOnly
            ? new Proxy(
                aTr,
                freezeUnsafeTransactionProperties<ReadonlyTransaction>({
                  dispatchAnalyticsEvent,
                  pluginKey: self.key,
                  analyticsOnly: saferDispatchedTransactionsAnalyticsOnly,
                }),
              )
            : aTr;
        const shouldTrackTransactions =
          transactionTracker?.shouldTrackTransaction(transactionTracking);

        if (!shouldTrackTransactions || !transactionTracker) {
          return originalApply(tr, value, oldState, newState);
        }

        const { startMeasure, stopMeasure } =
          transactionTracker.getMeasureHelpers(transactionTracking);
        const measure = `🦉${self.key}::apply`;
        startMeasure(measure);
        const result = originalApply(tr, value, oldState, newState);
        stopMeasure(measure);
        return result;
      };
    }

    const { samplingRate: uiTrackingSamplingRate = 100 } = uiTracking;

    if (uiTracking.enabled && spec.view) {
      const originalView = spec.view.bind(spec);

      spec.view = (editorView: EditorView) => {
        const self = this as any;
        const measure = `🦉${self.key}::view::update`;

        const view = originalView(editorView);
        let uiTrackingSamplingCounter = 0;

        if (view.update) {
          const originalUpdate = view.update;

          view.update = (view, state) => {
            const shouldTrack =
              uiTrackingSamplingRate && uiTrackingSamplingCounter === 0;

            if (shouldTrack) {
              startMeasure(measure);
            }

            originalUpdate(view, state);

            if (shouldTrack) {
              stopMeasure(measure, () => {});
            }

            uiTrackingSamplingCounter++;

            if (
              uiTrackingSamplingRate &&
              uiTrackingSamplingCounter >= uiTrackingSamplingRate
            ) {
              uiTrackingSamplingCounter = 0;
            }
          };
        }

        return view;
      };
    }

    super(spec);
  }

  public static fromPlugin<T>(
    plugin: SafePlugin<T>,
    options: InstrumentedPluginOptions,
    transactionTracker?: TransactionTracker,
  ): InstrumentedPlugin<T> {
    return new InstrumentedPlugin(
      plugin.spec as SafePluginSpec,
      options,
      transactionTracker,
    );
  }
}
