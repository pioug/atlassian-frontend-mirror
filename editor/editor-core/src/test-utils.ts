import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { Plugin } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorPluginInjectionAPI } from '@atlaskit/editor-common/preset';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type {
  AllEditorPresetPluginTypes,
  ReactHookFactory,
  UIComponentFactory,
} from '@atlaskit/editor-common/types';

import { createSchema } from './create-editor/create-schema';
import type {
  LightEditorPlugin,
  LightPMPlugin,
  LightPMPluginFactoryParams,
  OnEditorViewStateUpdated,
} from './create-editor/get-plugins';
import { sortByOrder } from './create-editor/sort-by-order';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import type { MarkConfig, NodeConfig } from './types/pm-config';

export type { LightEditorPlugin } from './create-editor/get-plugins';
export type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
export type { FeatureFlags } from './types/feature-flags';

export interface LightEditorConfig {
  nodes: NodeConfig[];
  marks: MarkConfig[];
  plugins: Array<LightPMPlugin>;
  contentComponents: UIComponentFactory[];
  pluginHooks: ReactHookFactory[];
  onEditorViewStateUpdatedCallbacks: Array<OnEditorViewStateUpdated>;
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
      if (editorPlugin.contentComponent) {
        acc.contentComponents.push(editorPlugin.contentComponent);
      }
      if (editorPlugin.usePluginHook) {
        acc.pluginHooks.push(editorPlugin.usePluginHook);
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
      contentComponents: [],
      pluginHooks: [],
      onEditorViewStateUpdatedCallbacks: [],
    } as LightEditorConfig,
  );
}

type PluginData = {
  plugins: Plugin[];
  schema: Schema;
  onEditorViewStateUpdatedCallbacks: Array<OnEditorViewStateUpdated>;
  editorConfig: LightEditorConfig;
};
export const createPMSchemaAndPlugins =
  (
    inputPreset: EditorPresetBuilder<
      string[],
      AllEditorPresetPluginTypes[]
    > = new EditorPresetBuilder(),
  ) =>
  (
    pluginFactoryParams: Omit<LightPMPluginFactoryParams, 'schema'> & {
      pluginInjectionAPI: EditorPluginInjectionAPI;
    },
  ): PluginData => {
    let editorPlugins: LightEditorPlugin[] = [];

    const preset = inputPreset.has(basePlugin)
      ? inputPreset
      : inputPreset.add(basePlugin);
    editorPlugins = preset.build({
      pluginInjectionAPI: pluginFactoryParams.pluginInjectionAPI,
    });

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
      editorConfig,
    };
  };

export { EventDispatcher } from './event-dispatcher';
export type { Dispatch } from './event-dispatcher';
export {
  GapCursorSelection,
  Side as GapCursorSide,
} from '@atlaskit/editor-common/selection';

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
