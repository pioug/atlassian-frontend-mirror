import type {
  AllEditorPresetPluginTypes,
  ExtractPluginNameFromAllBuilderPlugins,
  MaybePlugin,
  MaybePluginName,
  NextEditorPlugin,
  PresetPlugin,
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

type OldAndDeprecatedAddFunction<T> = (
  pluginToAdd: T,
  builder: EditorPresetBuilder<any, any>,
) => EditorPresetBuilder<any, any>;

type AllPluginNames = string | MaybePluginName<string>;

export class EditorPresetBuilder<
  PluginNames extends AllPluginNames[] = [],
  StackPlugins extends AllEditorPresetPluginTypes[] = [],
> {
  private readonly data: [...StackPlugins];

  constructor(...more: [...StackPlugins]) {
    this.data = [...more] || [];
  }

  add<NewPlugin extends PresetPlugin>(
    nextOrTuple: SafePresetCheck<NewPlugin, StackPlugins>,
  ): EditorPresetBuilder<
    [ExtractPluginNameFromAllBuilderPlugins<NewPlugin>, ...PluginNames],
    [...[NewPlugin], ...StackPlugins]
  > {
    return new EditorPresetBuilder<
      [ExtractPluginNameFromAllBuilderPlugins<NewPlugin>, ...PluginNames],
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

  maybeAdd<ToAddPlugin extends PresetPlugin>(
    pluginToAdd: SafePresetCheck<ToAddPlugin, StackPlugins>,
    shouldAdd:
      | boolean
      | (() => boolean)
      | OldAndDeprecatedAddFunction<ToAddPlugin>,
  ): EditorPresetBuilder<
    [
      MaybePluginName<ExtractPluginNameFromAllBuilderPlugins<ToAddPlugin>>,
      ...PluginNames,
    ],
    [MaybePlugin<ToAddPlugin>, ...StackPlugins]
  > {
    const pluginOrBuilder =
      typeof shouldAdd === 'function'
        ? // @ts-expect-error Argument of type 'SafePresetCheck<ToAddPlugin, StackPlugins>' is not assignable to parameter of type 'ToAddPlugin'.
          shouldAdd(pluginToAdd, this)
        : shouldAdd;

    if (pluginOrBuilder instanceof EditorPresetBuilder) {
      return pluginOrBuilder as EditorPresetBuilder<
        [
          MaybePluginName<ExtractPluginNameFromAllBuilderPlugins<ToAddPlugin>>,
          ...PluginNames,
        ],
        [MaybePlugin<ToAddPlugin>, ...StackPlugins]
      >;
    }

    const nextPluginStack: [MaybePlugin<ToAddPlugin>, ...StackPlugins] = [
      /**
       * re-cast this to NewPlugin as we've done all the type
       * safety, dependency checking, narrowing, during
       * `SafePresetCheck & VerifyPluginDependencies`
       */
      pluginOrBuilder ? (pluginToAdd as ToAddPlugin) : undefined,
      ...this.data,
    ];

    const nextEditorPresetBuilder = new EditorPresetBuilder<
      [
        MaybePluginName<ExtractPluginNameFromAllBuilderPlugins<ToAddPlugin>>,
        ...PluginNames,
      ],
      [MaybePlugin<ToAddPlugin>, ...StackPlugins]
    >(...nextPluginStack);

    return nextEditorPresetBuilder;
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
    this.data.filter(Boolean).forEach((pluginEntry) => {
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

    const pluginsDataCopy = this.data.slice();
    const plugins = pluginsDataCopy
      .reverse()
      .filter(Boolean)
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
          ? fn({ config, api: pluginInjectionAPI.api() })
          : fn({ config });

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
}
