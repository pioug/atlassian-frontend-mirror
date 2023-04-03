import { Plugin, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { sortByOrder } from './create-editor/sort-by-order';
import {
  LightEditorPlugin,
  LightPMPlugin,
  LightPMPluginFactoryParams,
  OnEditorViewStateUpdated,
} from './create-editor/get-plugins';
import { Schema } from 'prosemirror-model';
import { createSchema } from './create-editor/create-schema';
import { MarkConfig, NodeConfig } from './types/pm-config';
import basePlugin from './plugins/base';
import { analyticsPluginKey } from './plugins/analytics/plugin-key';

export { createTypeAheadTools } from './plugins/type-ahead/api';
export type { LightEditorPlugin } from './create-editor/get-plugins';
export type { DispatchAnalyticsEvent } from './plugins/analytics/types';
export type { FeatureFlags } from './types/feature-flags';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { AllEditorPresetPluginTypes } from '@atlaskit/editor-common/types';

export interface LightEditorConfig {
  nodes: NodeConfig[];
  marks: MarkConfig[];
  plugins: Array<LightPMPlugin>;
  onEditorViewStateUpdatedCallbacks: Array<OnEditorViewStateUpdated>;
}

export function getFireAnalytics(editorView: EditorView) {
  return analyticsPluginKey?.getState(editorView.state)?.fireAnalytics;
}

function lightProcessPluginsList(
  editorPlugins: LightEditorPlugin[],
): LightEditorConfig {
  /**
   * First pass to collect pluginsOptions
   */
  const pluginsOptions = editorPlugins.reduce((acc, plugin) => {
    if (plugin.pluginsOptions) {
      Object.keys(plugin.pluginsOptions).forEach((pluginName) => {
        if (!acc[pluginName]) {
          acc[pluginName] = [];
        }
        acc[pluginName].push(plugin.pluginsOptions![pluginName]);
      });
    }

    return acc;
  }, {} as Record<string, any>);

  /**
   * Process plugins
   */
  return editorPlugins.reduce<LightEditorConfig>(
    (acc, editorPlugin) => {
      if (editorPlugin.pmPlugins) {
        acc.plugins.push(
          ...editorPlugin.pmPlugins(
            editorPlugin.name ? pluginsOptions[editorPlugin.name] : undefined,
          ),
        );
      }
      if (editorPlugin.marks) {
        acc.marks.push(...editorPlugin.marks());
      }
      if (editorPlugin.nodes) {
        acc.nodes.push(...editorPlugin.nodes());
      }
      if (editorPlugin.onEditorViewStateUpdated) {
        acc.onEditorViewStateUpdatedCallbacks.push(
          editorPlugin.onEditorViewStateUpdated,
        );
      }
      return acc;
    },
    {
      nodes: [],
      marks: [],
      plugins: [],
      onEditorViewStateUpdatedCallbacks: [],
    } as LightEditorConfig,
  );
}

type PluginData = {
  plugins: Plugin[];
  schema: Schema;
  onEditorViewStateUpdatedCallbacks: Array<OnEditorViewStateUpdated>;
};
export const createPMSchemaAndPlugins =
  (
    inputPreset: EditorPresetBuilder<
      string[],
      AllEditorPresetPluginTypes[]
    > = new EditorPresetBuilder(),
  ) =>
  (
    pluginFactoryParams: Omit<LightPMPluginFactoryParams, 'schema'>,
  ): PluginData => {
    let editorPlugins: LightEditorPlugin[] = [];

    const preset = inputPreset.has(basePlugin)
      ? inputPreset
      : inputPreset.add(basePlugin);
    editorPlugins = preset.build();

    const editorConfig: LightEditorConfig =
      lightProcessPluginsList(editorPlugins);

    const schema = createSchema(editorConfig);

    const plugins = editorConfig.plugins
      .sort(sortByOrder('plugins'))
      .map(({ plugin }) => plugin({ ...pluginFactoryParams, schema }))
      .filter((plugin) => !!plugin) as Plugin[];

    return {
      plugins,
      schema,
      onEditorViewStateUpdatedCallbacks:
        editorConfig.onEditorViewStateUpdatedCallbacks,
    };
  };

export { PortalProviderAPI } from './ui/PortalProvider';
export { EventDispatcher } from './event-dispatcher';
export type { Dispatch } from './event-dispatcher';
export {
  GapCursorSelection,
  Side as GapCursorSide,
} from './plugins/selection/gap-cursor/selection';

export function setTextSelection(
  view: EditorView,
  anchor: number,
  head?: number,
) {
  const { state } = view;
  const tr = state.tr.setSelection(
    TextSelection.create(state.doc, anchor, head),
  );
  view.dispatch(tr);
}

/**
 * Given a selector, checks if an element matching the selector exists in the
 * document.
 * @param selector
 * @returns true if element matching selector exists in document, false otherwise
 */
export const isElementBySelectorInDocument = (selector: string): boolean => {
  return Boolean(document.querySelector(selector));
};
