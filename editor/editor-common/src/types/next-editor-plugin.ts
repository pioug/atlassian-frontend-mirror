/**
 * This entire file attempts to build out the type safety needed in our new
 * plugin dependency injection approach, alongside our current implementation of
 * `Presets` - if the generics get too unwieldy, we may redesign how presets
 * are put together - but for now `Builder` & `Preset` aim to beinterchangeable.
 */
import type { EditorState } from 'prosemirror-state';

import type { EditorPlugin } from './editor-plugin';

interface DefaultEditorPlugin<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
> extends EditorPlugin {
  name: Name;
}

interface DefaultEditorPluginWithSharedPluginState<
  Name,
  Metadata extends NextEditorPluginMetadata,
> {
  name: Name;
  getSharedState: (
    editorState: EditorState,
  ) => ExtractSharedStateFromMetadata<Metadata>;
}

type CheckSharedState<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
> = Exclude<ExtractSharedStateFromMetadata<Metadata>, never> extends never
  ? DefaultEditorPlugin<Name, Metadata>
  : DefaultEditorPluginWithSharedPluginState<Name, Metadata>;

interface NextEditorPluginMetadata {
  readonly sharedState?: any;
  readonly pluginConfiguration?: any;
  readonly dependencies?: NextEditorPlugin<any, any>[];
}

type NextEditorPluginProps<Metadata extends NextEditorPluginMetadata> = {
  externalPlugins: ExternalPluginAPI<
    ExtractPluginDependenciesFromMetadata<Metadata>
  >;
};

type NextEditorPluginFunctionDefinition<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
  Configuration,
> = (
  config: Configuration,
  api?: NextEditorPluginProps<Metadata>,
) => CheckSharedState<Name, Metadata>;

type NextEditorPluginFunctionOptionalConfigDefinition<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
  Configuration = undefined,
> = (
  config?: Configuration,
  api?: NextEditorPluginProps<Metadata>,
) => CheckSharedState<Name, Metadata>;

export type NextEditorPlugin<
  Name extends string,
  Metadata extends NextEditorPluginMetadata = {},
> = Metadata extends NextEditorPluginMetadata
  ? 'pluginConfiguration' extends keyof Metadata
    ? undefined extends Metadata['pluginConfiguration']
      ? NextEditorPluginFunctionOptionalConfigDefinition<
          Name,
          Metadata,
          Metadata['pluginConfiguration']
        >
      : NextEditorPluginFunctionDefinition<
          Name,
          Metadata,
          Metadata['pluginConfiguration']
        >
    : NextEditorPluginFunctionOptionalConfigDefinition<Name, Metadata>
  : never;

type ExtractPluginDependenciesFromMetadata<Metadata> =
  'dependencies' extends keyof Metadata
    ? Metadata['dependencies'] extends NextEditorPlugin<any, any>[]
      ? Exclude<Metadata['dependencies'], undefined>
      : []
    : [];

type ExtractSharedStateFromMetadata<Metadata> =
  'sharedState' extends keyof Metadata ? Metadata['sharedState'] : never;

type ExtractPluginConfigurationFromMetadata<Metadata> =
  'pluginConfiguration' extends keyof Metadata
    ? Metadata['pluginConfiguration']
    : never;

type ExtractPluginDependencies<Plugin> = Plugin extends NextEditorPlugin<
  any,
  any
>
  ? Plugin extends (
      config: any,
      api: any,
    ) => CheckSharedState<any, infer Metadata>
    ? ExtractPluginDependenciesFromMetadata<Metadata>
    : never
  : never;

type ExtractPluginConfiguration<Plugin> = Plugin extends NextEditorPlugin<
  any,
  any
>
  ? Plugin extends (
      config: any,
      api: any,
    ) => CheckSharedState<any, infer Metadata>
    ? ExtractPluginConfigurationFromMetadata<Metadata>
    : never
  : never;

type ExtractPluginSharedState<Plugin> = Plugin extends NextEditorPlugin<
  any,
  any
>
  ? Plugin extends (
      config: any,
      api: any,
    ) => CheckSharedState<any, infer Metadata>
    ? ExtractSharedStateFromMetadata<Metadata>
    : never
  : never;

type ExtractPluginName<Plugin> = Plugin extends NextEditorPlugin<any, any>
  ? Plugin extends (...args: any) => CheckSharedState<infer PluginName, any>
    ? PluginName
    : never
  : never;

type ExternalPluginAPIProps<Plugin extends NextEditorPlugin<any, any>> = {
  sharedPluginState: {
    currentState: () => ExtractPluginSharedState<Plugin>;
    onChange: (sub: (props: ExtractPluginSharedState<Plugin>) => void) => void;
  };
};

type ExternalPluginAPI<PluginList extends NextEditorPlugin<any, any>[]> = {
  [Plugin in PluginList[number] as ExtractPluginName<Plugin>]: Plugin extends NextEditorPlugin<
    any,
    any
  >
    ? ExternalPluginAPIProps<Plugin>
    : never;
};

export type PluginAsArray<Plugin> =
  undefined extends ExtractPluginConfiguration<Plugin>
    ? [Plugin, ExtractPluginConfiguration<Plugin>?]
    : [Plugin, ExtractPluginConfiguration<Plugin>];

export type AllBuilderPlugins = PluginAsArray<any> | NextEditorPlugin<any, any>;

type ExtractNextEditorPlugin<Plugin> = Plugin extends PluginAsArray<any>
  ? Plugin[0]
  : never;

export type VerifyPluginDependencies<
  Plugin,
  PluginsStack extends AllBuilderPlugins[],
> = ExtractPluginDependencies<Plugin> extends []
  ? // Plugin has no dependencies
    Plugin extends PluginAsArray<any> | NextEditorPlugin<any, any>
    ? Plugin
    : never
  : // Plugin has dependencies
  /**
   * case 1: We're looking for its dependent plugins indexed on `AllBuilderPlugins`
   */
  ExtractPluginDependencies<Plugin>[number] extends
      | (ExtractPluginDependencies<Plugin>[number] & PluginsStack[number])
      /**
       * case 2:
       * Otherwise check whether the dependent-plugin, is hidden inside a tuple,
       * unwrapping `Plugins` via `ExtractNextEditorPlugin`
       */
      | (ExtractPluginDependencies<Plugin>[number] &
          ExtractNextEditorPlugin<PluginsStack[number]>)
  ? Plugin
  : never;

/**
 * Used to check if a plugin being added can be added to a Preset/builder
 */
export type SafePresetCheck<
  Plugin,
  StackPlugins extends AllBuilderPlugins[],
> = Plugin extends Plugin & VerifyPluginDependencies<Plugin, StackPlugins>
  ? Plugin extends NextEditorPlugin<any, any>
    ? CheckBasicPlugin<Plugin>
    : never
  : never;

type CheckTupleRequirements<Plugin, Config, ArrayType> = unknown extends Config
  ? Plugin | ArrayType
  : // If plugin config is optional, all configurations are valid
  undefined extends Config
  ? Plugin | ArrayType
  : // If plugin does not have config, keep old shape for backward compability
  [Config] extends [never]
  ? Plugin
  : // Otherwise, we have mandatory config to be supplied & we only allow a plugin to be added as a tuple
    ArrayType;

type CheckBasicPlugin<Plugin> = Plugin extends (
  args: any,
  api: any,
) => EditorPlugin
  ? CheckTupleRequirements<
      Plugin,
      ExtractPluginConfiguration<Plugin>,
      PluginAsArray<Plugin>
    >
  : never;
