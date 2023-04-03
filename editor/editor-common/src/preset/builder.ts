import type {
  AllEditorPresetPluginTypes,
  ExtractPluginNameFromAllBuilderPlugins,
  NextEditorPlugin,
  SafePresetCheck,
} from '../types';
import type { EditorPlugin } from '../types/editor-plugin';

import type { EditorPluginInjectionAPI } from './plugin-injection-api';

interface ProcessProps {
  pluginInjectionAPI?: EditorPluginInjectionAPI;
  excludePlugins?: Set<string>;
}

interface BuildProps extends ProcessProps {
  excludePlugins?: Set<string>;
  pluginInjectionAPI?: EditorPluginInjectionAPI;
}

export class EditorPresetBuilder<
  PluginNames extends string[] = [],
  StackPlugins extends AllEditorPresetPluginTypes[] = [],
> {
  private readonly data: [...StackPlugins];

  constructor(...more: [...StackPlugins]) {
    this.data = [...more] || [];
  }

  add<NewPlugin extends AllEditorPresetPluginTypes>(
    nextOrTuple: SafePresetCheck<NewPlugin, StackPlugins>,
  ): EditorPresetBuilder<
    [...PluginNames, ExtractPluginNameFromAllBuilderPlugins<NewPlugin>],
    [...[NewPlugin], ...StackPlugins]
  > {
    return new EditorPresetBuilder<
      [...PluginNames, ExtractPluginNameFromAllBuilderPlugins<NewPlugin>],
      [...[NewPlugin], ...StackPlugins]
    >(
      /**
       * re-cast this to NewPlugin as we've done all the type
       * safety, dependency checking, narrowing, during
       * `SafePresetCheck & VerifyPluginDependencies`
       */
      nextOrTuple as NewPlugin,
      ...this.data,
    );
  }

  //hasPlugin<Plugin extends NextEditorPlugin<any, any>>(
  //  pluginToAdd: Plugin,
  //): this is TryCastEditorPresetBuilderByCheckingPlugins<this, Plugin> {
  //  const hasPluginQueryExists = this.data.find((pluginEntry) => {
  //    const pluginFunction: NextEditorPlugin<any, any> = !Array.isArray(
  //      pluginEntry,
  //    )
  //      ? pluginEntry
  //      : pluginEntry[0];

  //    return pluginFunction === pluginToAdd;
  //  });

  //  return Boolean(hasPluginQueryExists);
  //}

  maybeAdd<
    MaybePlugin extends NextEditorPlugin<any, any>,
    MaybePluginNames extends string[],
    MaybeStackPlugins extends AllEditorPresetPluginTypes[],
    MaybeEditorPresetBuilder extends EditorPresetBuilder<
      MaybePluginNames,
      MaybeStackPlugins
    >,
  >(
    pluginToAdd: MaybePlugin,
    add: (
      pluginToAdd: MaybePlugin,
      maybeEditorPresetBuilder: MaybeEditorPresetBuilder,
    ) => MaybeEditorPresetBuilder,
  ): MaybeEditorPresetBuilder {
    return add(
      pluginToAdd,
      //  @ts-ignore
      this as any,
    );
  }

  has(plugin: AllEditorPresetPluginTypes): boolean {
    return this.data.some((pluginPreset) => {
      if (Array.isArray(pluginPreset)) {
        return pluginPreset[0] === plugin;
      }

      return pluginPreset === plugin;
    });
  }

  build({
    pluginInjectionAPI,
    excludePlugins: maybeExcludePlugins,
  }: BuildProps = {}): EditorPlugin[] {
    const excludePlugins = new Set(
      maybeExcludePlugins ? maybeExcludePlugins : [],
    );
    const editorPlugins = this.processEditorPlugins({
      pluginInjectionAPI,
      excludePlugins,
    });
    return this.removeExcludedPlugins(editorPlugins, excludePlugins);
  }

  private verifyDuplicatedPlugins() {
    const cache = new Set();
    this.data.forEach((pluginEntry) => {
      const [pluginFn, _] = Array.isArray(pluginEntry)
        ? pluginEntry
        : [pluginEntry, undefined];
      if (cache.has(pluginFn)) {
        throw new Error(`${pluginFn} is already included!`);
      }
      cache.add(pluginFn);
    });

    return true;
  }

  private processEditorPlugins({
    pluginInjectionAPI,
    excludePlugins,
  }: ProcessProps) {
    this.verifyDuplicatedPlugins();

    const seen = new Set();

    const plugins = this.data
      .reverse()
      .map((entry) => {
        const [fn, config] = this.safeEntry(entry);

        if (seen.has(fn)) {
          return null;
        }

        seen.add(fn);

        if (typeof fn !== 'function') {
          return null;
        }

        const plugin = pluginInjectionAPI
          ? fn(config, pluginInjectionAPI.api())
          : fn(config);

        if (plugin && excludePlugins?.has(plugin.name)) {
          return null;
        }

        if (!pluginInjectionAPI) {
          return plugin;
        }

        pluginInjectionAPI.onEditorPluginInitialized(plugin);
        return plugin;
      })
      .filter(Boolean);

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

  private safeEntry = (plugin: AllEditorPresetPluginTypes) =>
    Array.isArray(plugin) ? plugin : [plugin, undefined];

  // TODO: ED-17023 - Bring back type safety to the EditorPresetBuilder.add preset
  //import type {
  //  ExtractPluginDependencies,
  //} from '../types/next-editor-plugin';
  //type TryCastEditorPresetBuilderByCheckingDependencies<MaybeEditorPresetBuilder, Plugin> =
  //  MaybeEditorPresetBuilder extends EditorPresetBuilder<any, infer StackPlugins>
  //    ? Plugin extends NextEditorPlugin<any, any>
  //      ? ExtractPluginDependencies<Plugin>[number] extends StackPlugins[number]
  //        ? MaybeEditorPresetBuilder
  //        : never
  //      : never
  //    : never;
  // Because how our plugins are added in the preset, we can't use the type safe system
  // in the EditorPresetBuilder.
  // TODO: ED-17023 - Bring back type safety to the EditorPresetBuilder.add preset
  //maybeAdd<
  //  MaybePlugin extends NextEditorPlugin<any, any>,
  //  MaybePluginNames extends string[],
  //  MaybeStackPlugins extends AllEditorPresetPluginTypes[],
  //  MaybeEditorPresetBuilder extends EditorPresetBuilder<
  //    MaybePluginNames,
  //    MaybeStackPlugins
  //  >,
  //>(
  //  pluginToAdd: MaybePlugin,
  //   add: (
  //     pluginToAdd: MaybePlugin,
  //     maybeEditorPresetBuilder: TryCastEditorPresetBuilderByCheckingDependencies<this, MaybePlugin>,
  //   ) => MaybeEditorPresetBuilder,
  //): MaybeEditorPresetBuilder | this {
  //  return add(
  //    pluginToAdd,
  //    //  @ts-ignore
  //    this as any,
  //  );
  //}
}
