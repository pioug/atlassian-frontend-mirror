/**
 * This entire file attempts to build out the type safety needed in our new
 * plugin dependency injection approach, alongside our current implementation of
 * `Presets` - if the generics get too unwieldy, we may redesign how presets
 * are put together - but for now `Builder` & `Preset` aim to beinterchangeable.
 */
import type { EditorState } from 'prosemirror-state';

import type { EditorPlugin } from './editor-plugin';

interface DefaultEditorPlugin<Name extends string> extends EditorPlugin {
  name: Name;
}

interface DefaultEditorPluginWithSharedPluginState<Name, PublicState> {
  name: Name;
  getSharedState: (editorState: EditorState) => PublicState;
}

type CheckSharedState<Name extends string, PublicState = never> = Exclude<
  PublicState,
  never
> extends never
  ? DefaultEditorPlugin<Name>
  : DefaultEditorPluginWithSharedPluginState<Name, PublicState>;

export type NextEditorPlugin<
  Name extends string,
  PublicState = never,
  PluginConfiguration extends unknown | undefined = unknown,
> = any extends Function
  ? Exclude<unknown, PluginConfiguration> extends never
    ? (
        optionalConfig?: PluginConfiguration,
      ) => CheckSharedState<Name, PublicState>
    : Exclude<
        PluginConfiguration,
        Exclude<PluginConfiguration, undefined>
      > extends never
    ? (
        mandatoryConfig: PluginConfiguration,
      ) => CheckSharedState<Name, PublicState>
    : (
        optionalKnownConfig?: PluginConfiguration,
      ) => CheckSharedState<Name, PublicState>
  : never;

type getNextEditorPluginStateType<T> = T extends NextEditorPlugin<
  any,
  infer U,
  any
>
  ? U
  : never;
type getNextEditorPluginNameType<T> = T extends NextEditorPlugin<
  infer U,
  any,
  any
>
  ? U
  : never;

// type getNextEditorPluginConfiguration<T> = T extends NextEditorPlugin<
//   any,
//   any,
//   infer Config
// >
//   ? Config
//   : null;

type ExternalPluginAPIProps<T extends NextEditorPlugin<any, any, any>> = {
  sharedPluginState: {
    currentState: () => getNextEditorPluginStateType<T>;
    onChange: (sub: (props: getNextEditorPluginStateType<T>) => void) => void;
  };
};

type ExternalPluginAPI<PluginList extends AllBuilderPlugins[]> = {
  [Plugin in PluginList[number] extends NextEditorPluginWithDependencies<
    any,
    any,
    any,
    any
  >
    ? ReturnType<PluginList[number]>
    : PluginList[number] as getNextEditorPluginNameType<Plugin>]: Plugin extends NextEditorPlugin<
    any,
    any,
    any
  >
    ? ExternalPluginAPIProps<Plugin>
    : never;
};

export type NextEditorPluginWithDependencies<
  NextEditorPluginKey extends string,
  NextEditorPluginPublicState,
  D extends AllBuilderPlugins[],
  NextEditorPluginConfiguration extends unknown | undefined = unknown,
> = (props: {
  externalPlugins: ExternalPluginAPI<D>;
}) => NextEditorPlugin<
  NextEditorPluginKey,
  NextEditorPluginPublicState,
  NextEditorPluginConfiguration
>;

export type PluginAsArray<
  A extends string,
  B = never,
  C = unknown,
> = C extends C & undefined
  ? [NextEditorPlugin<A, B, C>, C?]
  : [NextEditorPlugin<A, B, C>, C];

export type PluginWithDependenciesAsArray<
  A extends string,
  B,
  C extends AllBuilderPlugins[],
  D extends unknown = unknown,
> = D extends D & undefined
  ? [NextEditorPluginWithDependencies<A, B, C, D>, D?]
  : [NextEditorPluginWithDependencies<A, B, C, D>, D];

type AllPluginsAsArray =
  | PluginAsArray<string, any, any>
  | PluginWithDependenciesAsArray<string, any, any, any>;

export type AllNextEditorPlugins =
  | NextEditorPlugin<string, any, any>
  | NextEditorPluginWithDependencies<string, any, any, any>;

export type AllBuilderPlugins = AllPluginsAsArray | AllNextEditorPlugins;

type ExtractNextEditorPlugin<T> = T extends
  | PluginAsArray<string, any, any>
  | PluginWithDependenciesAsArray<string, any, any, any>
  ? T[0]
  : never;

export type VerifyPluginDependencies<
  T,
  Plugins extends AllBuilderPlugins[],
> = T extends
  | NextEditorPluginWithDependencies<string, any, infer D, any>
  | PluginWithDependenciesAsArray<string, any, infer D, any>
  ? /**
     * Given one of
      - NextEditorPluginWithDependencies
      - PluginWithDependenciesAsArray
      ....
     */
    /**
     * case 1: We're looking for its dependent plugins indexed on `AllBuilderPlugins`
     */
    D[number] extends
      | (D[number] & Plugins[number])
      /**
       * case 2:
       * Otherwise check whether the dependent-plugin, is hidden inside a tuple,
       * unwrapping `Plugins` via `ExtractNextEditorPlugin`
       */
      | (D[number] & ExtractNextEditorPlugin<Plugins[number]>)
    ? T // UnextractNextEditorPlugin<T>
    : never
  : T extends PluginAsArray<any, any, any> | NextEditorPlugin<any, any, any>
  ? T
  : never;

/**
 * Used to check if a plugin being added can be added to a Preset/builder
 */
export type SafePresetCheck<
  Plugin,
  StackPlugins extends AllBuilderPlugins[],
> = Plugin extends Plugin & VerifyPluginDependencies<Plugin, StackPlugins>
  ? Plugin extends NextEditorPluginWithDependencies<
      string,
      any,
      any,
      infer Config
    >
    ? CheckPluginWithDependency<Plugin, Config, StackPlugins>
    : Plugin extends NextEditorPlugin<any, any, infer Config>
    ? CheckBasicPlugin<Plugin, Config>
    : never
  : // Otherwise fallback to old infer-args-from-plugin
  Plugin extends (config: infer Config) => EditorPlugin
  ? // If config unknown, leave it alone
    /** Checks whether config has any mandatory fields - if so, config cannot be optional */
    Exclude<unknown, Config> extends never
    ? Plugin | [Plugin]
    : // If plugin is optional, all configurations are valid
    Exclude<unknown, Config> extends never
    ? Plugin | [Plugin] | [Plugin, Config]
    : // Otherwise, we have mandatory config to be supplied & we only allow a plugin to be added as a tuple
      [Plugin, Config]
  : never;

type CheckTupleRequirements<Plugin, Config, ArrayType> = Plugin extends Plugin
  ? // If config unknown, leave it alone
    Exclude<unknown, Config> extends never
    ? Plugin | ArrayType
    : // If plugin config is optional, all configurations are valid
    Exclude<Config, Exclude<Config, undefined>> extends never
    ? Plugin | ArrayType
    : // Otherwise, we have mandatory config to be supplied & we only allow a plugin to be added as a tuple
      ArrayType
  : never;

type CheckPluginWithDependency<
  Plugin,
  Config,
  StackPlugins extends AllBuilderPlugins[],
> = Plugin extends (...args: any) => (...args: any) => EditorPlugin
  ? CheckTupleRequirements<
      Plugin,
      Config,
      PluginWithDependenciesAsArray<any, any, StackPlugins, Config | undefined>
    >
  : never;

type CheckBasicPlugin<Plugin, Config> = Plugin extends (
  ...args: any
) => EditorPlugin
  ? CheckTupleRequirements<
      Plugin,
      Config,
      PluginAsArray<any, any, Config | undefined>
    >
  : never;
