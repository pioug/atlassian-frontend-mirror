import {
  EditorState,
  Transaction,
  Plugin,
  PluginSpec,
} from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';

export class InstrumentedPlugin<
  PluginState,
  NodeSchema extends Schema<any, any>
> extends Plugin<PluginState, NodeSchema> {
  constructor(spec: PluginSpec) {
    if (spec.state) {
      const originalApply = spec.state.apply.bind(spec.state);

      spec.state.apply = (
        tr: Transaction<NodeSchema>,
        value: PluginState,
        oldState: EditorState<NodeSchema>,
        newState: EditorState<NodeSchema>,
      ) => {
        const self = this as any;
        const measure = `🦉${self.key}::apply`;
        startMeasure(measure);
        const result = originalApply(tr, value, oldState, newState);
        stopMeasure(measure, () => {});
        return result;
      };
    }

    if (spec.view) {
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
  ): InstrumentedPlugin<T, V> {
    return new InstrumentedPlugin(plugin.spec);
  }
}
