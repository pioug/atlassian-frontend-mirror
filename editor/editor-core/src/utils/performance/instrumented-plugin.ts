import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  EditorState,
  ReadonlyTransaction,
  SafePluginSpec,
} from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import { EditorView } from 'prosemirror-view';
import { EditorProps } from '../../types/editor-props';
import { TransactionTracker } from './track-transactions';
import { freezeUnsafeTransactionProperties } from './safer-transactions';
import { FeatureFlags } from '../../types/feature-flags';
import { DispatchAnalyticsEvent } from '../../plugins/analytics/types';

type InstrumentedPluginOptions = EditorProps['performanceTracking'] & {
  saferDispatchedTransactions?: FeatureFlags['saferDispatchedTransactions'];
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};

export class InstrumentedPlugin<
  PluginState,
  NodeSchema extends Schema<any, any>
> extends SafePlugin<PluginState, NodeSchema> {
  constructor(
    spec: SafePluginSpec,
    options: InstrumentedPluginOptions = {},
    transactionTracker?: TransactionTracker,
  ) {
    const {
      transactionTracking = { enabled: false },
      uiTracking = { enabled: false },
      saferDispatchedTransactions = false,
      dispatchAnalyticsEvent,
    } = options;

    const shouldOverrideApply =
      (transactionTracking.enabled && transactionTracker) ||
      saferDispatchedTransactions;

    if (shouldOverrideApply && spec.state) {
      const originalApply = spec.state.apply.bind(spec.state);

      spec.state.apply = (
        aTr: ReadonlyTransaction<NodeSchema>,
        value: PluginState,
        oldState: EditorState<NodeSchema>,
        newState: EditorState<NodeSchema>,
      ) => {
        const self = this as any;
        const tr = saferDispatchedTransactions
          ? new Proxy(
              aTr,
              freezeUnsafeTransactionProperties<ReadonlyTransaction>({
                dispatchAnalyticsEvent,
                pluginKey: self.key,
              }),
            )
          : aTr;
        const shouldTrackTransactions = transactionTracker?.shouldTrackTransaction(
          transactionTracking,
        );

        if (!shouldTrackTransactions || !transactionTracker) {
          return originalApply(tr, value, oldState, newState);
        }

        const {
          startMeasure,
          stopMeasure,
        } = transactionTracker.getMeasureHelpers(transactionTracking);
        const measure = `🦉${self.key}::apply`;
        startMeasure(measure);
        const result = originalApply(tr, value, oldState, newState);
        stopMeasure(measure);
        return result;
      };
    }

    if (uiTracking.enabled && spec.view) {
      const originalView = spec.view.bind(spec);

      spec.view = (editorView: EditorView) => {
        const self = this as any;
        const measure = `🦉${self.key}::view::update`;

        const view = originalView(editorView);

        if (view.update) {
          const originalUpdate = view.update;
          view.update = (view, state) => {
            startMeasure(measure);
            originalUpdate(view, state);
            stopMeasure(measure, () => {});
          };
        }

        return view;
      };
    }

    super(spec);
  }

  public static fromPlugin<T, V extends Schema<any, any>>(
    plugin: SafePlugin<T, V>,
    options: InstrumentedPluginOptions,
    transactionTracker?: TransactionTracker,
  ): InstrumentedPlugin<T, V> {
    return new InstrumentedPlugin(
      plugin.spec as SafePluginSpec,
      options,
      transactionTracker,
    );
  }
}
