import {
  EditorState,
  Transaction,
  Plugin,
  PluginSpec,
} from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import { EditorProps } from '../../types/editor-props';
import { TransactionTracker } from './track-transactions';

export class InstrumentedPlugin<
  PluginState,
  NodeSchema extends Schema<any, any>
> extends Plugin<PluginState, NodeSchema> {
  constructor(
    spec: PluginSpec,
    options: EditorProps['performanceTracking'] = {},
    transactionTracker?: TransactionTracker,
  ) {
    const {
      transactionTracking = { enabled: false },
      uiTracking = { enabled: false },
    } = options;

    if (transactionTracking.enabled && spec.state && transactionTracker) {
      const originalApply = spec.state.apply.bind(spec.state);

      spec.state.apply = (
        tr: Transaction<NodeSchema>,
        value: PluginState,
        oldState: EditorState<NodeSchema>,
        newState: EditorState<NodeSchema>,
      ) => {
        const shouldTrackTransactions = transactionTracker.shouldTrackTransaction(
          transactionTracking,
        );

        if (!shouldTrackTransactions) {
          return originalApply(tr, value, oldState, newState);
        }

        const {
          startMeasure,
          stopMeasure,
        } = transactionTracker.getMeasureHelpers(transactionTracking);
        const self = this as any;
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
    plugin: Plugin<T, V>,
    options: EditorProps['performanceTracking'],
    transactionTracker?: TransactionTracker,
  ): InstrumentedPlugin<T, V> {
    return new InstrumentedPlugin(plugin.spec, options, transactionTracker);
  }
}
