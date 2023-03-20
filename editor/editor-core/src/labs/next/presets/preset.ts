import type {
  AllBuilderPlugins,
  NextEditorPlugin,
  SafePresetCheck,
} from '@atlaskit/editor-common/types';
import { Builder } from '@atlaskit/editor-common/utils';
export class Preset<
  T extends { name: string },
  StackPlugins extends AllBuilderPlugins[] = [],
> implements Builder<T, StackPlugins>
{
  public data: [...StackPlugins];

  constructor(...more: [...StackPlugins]) {
    this.data = [...more] || [];
  }

  add<NewPlugin extends AllBuilderPlugins>(
    nextOrTuple: SafePresetCheck<NewPlugin, StackPlugins>,
  ): Preset<T, [...[NewPlugin], ...StackPlugins]> {
    const newPreset = new Preset<T, [...[NewPlugin], ...StackPlugins]>(
      nextOrTuple as NewPlugin,
      ...this.data,
    );
    // TODO: remove this `this.data.push`,
    // once refactoring `create-plugins-list` to address this complexity:
    /**
     * preset.add(x)
     * preset.add(y)
     * preset.add(z)
     */
    // to:
    /**
     * immutablePreset = preset.add(x).add(foo).add(bar)
     * presetWithY = presetWithY.add(y)
     * presetWithZ = preset.add(z)
     */
    this.data.push(nextOrTuple as NewPlugin);
    return newPreset;
  }

  has(plugin: AllBuilderPlugins): boolean {
    return this.data.some((pluginPreset) => {
      if (Array.isArray(pluginPreset)) {
        return pluginPreset[0] === plugin;
      }

      return pluginPreset === plugin;
    });
  }

  getEditorPlugins(excludes?: Set<string>): NextEditorPlugin<any, any>[] {
    const editorPlugins = this.processEditorPlugins();
    return this.removeExcludedPlugins(editorPlugins, excludes);
  }

  private processEditorPlugins() {
    const cache = new Map();
    this.data.forEach((pluginEntry) => {
      if (Array.isArray(pluginEntry)) {
        const [fn, options] = pluginEntry;
        cache.set(fn, options);
      } else {
        /**
         * Prevent usage of same plugin twice without override.
         * [
         *  plugin1,
         *  [plugin1, { option1: value }],
         *  plugin1, // This will throw
         * ]
         */
        if (cache.has(pluginEntry) && cache.get(pluginEntry) === undefined) {
          throw new Error(`${pluginEntry} is already included!`);
        }
        cache.set(pluginEntry, undefined);
      }
    });

    let plugins: Array<NextEditorPlugin<any, any>> = [];
    cache.forEach((options, fn) => {
      plugins.push(fn(options));
    });

    return plugins;
  }

  private removeExcludedPlugins(
    plugins: NextEditorPlugin<any, any>[],
    excludes?: Set<string>,
  ) {
    if (excludes) {
      return plugins.filter((plugin) => !plugin || !excludes.has(plugin.name));
    }
    return plugins;
  }
}

export type PluginsPreset = Array<PluginConfig<any, any>>;

/**
 * Type for Editor Preset's plugin configuration.
 *
 * Possible configurations:
 * – () => () => EditorPlugin
 * – () => (options: any) => EditorPlugin
 * – () => (options?: any) => EditorPlugin
 * (In the future, a preset may contain externalPlugins)
 * – (props.externalPlugins) => (options?: any) => EditorPlugin
 *
 * Usage:
 * – preset.add(plugin)
 * – preset.add([plugin])
 * – preset.add([plugin, options])
 *
 *
 * Type:
 * – Plugin with required arguments, matches `() => EditorPlugin` too,
 *   because no arguments has type `unknown`.
 *
 * IF (Args: any) => Editor Plugin:
 *    IF Args === unknown
 *       preset.add(plugin) || preset.add([plugin])
 *    ELSE
 *       IF Args are Optional
 *          preset.add(plugin) | preset.add([plugin]) | preset.add([plugin, options])
 *       ELSE [Args are required]
 *          preset.add([plugin, options])
 * ELSE
 *   never
 */
export type PluginConfig<PluginFactory, T> = PluginFactory extends (
  args: infer Args,
) => T
  ? Exclude<unknown, Args> extends never
    ? PluginFactory | [PluginFactory]
    : Exclude<Args, Exclude<Args, undefined>> extends never
    ? [PluginFactory, Args]
    : PluginFactory | [PluginFactory] | [PluginFactory, Args]
  : never;
