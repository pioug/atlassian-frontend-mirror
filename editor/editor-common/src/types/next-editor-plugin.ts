/**
 * This entire file attempts to build out the type safety needed in our new
 * plugin dependency injection approach, alongside our current implementation of
 * `Presets` - if the generics get too unwieldy, we may redesign how presets
 * are put together - but for now `Builder` & `Preset` aim to beinterchangeable.
 */
import type { EditorState } from 'prosemirror-state';

import type { EditorPlugin } from './editor-plugin';

type IsAny<T> = 0 extends 1 & T ? true : false;

type PickSharedStatePropertyName<Metadata extends NextEditorPluginMetadata> =
  IsAny<Metadata> extends true
    ? never
    : ExtractSharedStateFromMetadata<Metadata> extends never
    ? never
    : 'getSharedState';

type WithSharedState<Metadata extends NextEditorPluginMetadata> = {
  [Property in keyof Pick<
    Metadata,
    'sharedState'
  > as PickSharedStatePropertyName<Metadata>]: (
    editorState: EditorState | undefined,
  ) => ExtractSharedStateFromMetadata<Metadata>;
};

type PickActionsPropertyName<Metadata extends NextEditorPluginMetadata> =
  IsAny<Metadata> extends true
    ? never
    : ExtractActionsFromMetadata<Metadata> extends never
    ? never
    : 'actions';

type WithActions<Metadata extends NextEditorPluginMetadata> = {
  [Property in keyof Pick<
    Metadata,
    'actions'
  > as PickActionsPropertyName<Metadata>]: ExtractActionsFromMetadata<Metadata>;
};

export type DefaultEditorPlugin<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
> = EditorPlugin &
  WithSharedState<Metadata> &
  WithActions<Metadata> & {
    name: Name;
  };

type MaybeAction = ((...agrs: any) => any) | ((...agrs: any) => void);
type NextEditorPluginActions = Record<string, MaybeAction>;

export interface NextEditorPluginMetadata {
  readonly sharedState?: any;
  readonly pluginConfiguration?: any;
  readonly dependencies?: DependencyPlugin[];
  readonly actions?: NextEditorPluginActions;
}

export type PluginInjectionAPI<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
> = {
  dependencies: CreatePluginDependenciesAPI<
    [
      NextEditorPlugin<Name, Metadata>,
      ...ExtractPluginDependenciesFromMetadata<Metadata>,
    ]
  >;
};

type NextEditorPluginFunctionDefinition<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
  Configuration,
> = (
  config: Configuration,
  api?: PluginInjectionAPI<Name, Metadata>,
) => DefaultEditorPlugin<Name, Metadata>;

type NextEditorPluginFunctionOptionalConfigDefinition<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
  Configuration = undefined,
> = (
  config?: Configuration,
  api?: PluginInjectionAPI<Name, Metadata>,
) => DefaultEditorPlugin<Name, Metadata>;

// Used internally to indicate the plugin is internal
// This is used to ensure typescript can tell the difference between `NextEditorPlugin` and `OptionalPlugin<NextEditorPlugin>`
// and therefore make accessing the external plugin for an `OptionalPlugin` optional.
// (See `ExternalPluginAPI` for how it determines the typing)
type OptionalPrivateProperty = { __optionalPluginType: true };

export type OptionalPlugin<EditorPlugin extends NextEditorPlugin<any, any>> =
  EditorPlugin & OptionalPrivateProperty;

type DependencyPlugin =
  | OptionalPlugin<NextEditorPlugin<any, any>>
  | NextEditorPlugin<any, any>;

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

type FilterOptionalPlugins<T extends DependencyPlugin[]> = T extends [
  infer Head,
  ...infer Tail,
]
  ? Tail extends DependencyPlugin[]
    ? Head extends OptionalPlugin<NextEditorPlugin<any, any>>
      ? FilterOptionalPlugins<Tail>
      : [Head, ...FilterOptionalPlugins<Tail>]
    : T
  : T;

type ExtractPluginDependenciesFromMetadataWithoutOptionals<
  Metadata extends NextEditorPluginMetadata,
> = Metadata['dependencies'] extends DependencyPlugin[]
  ? FilterOptionalPlugins<Metadata['dependencies']>
  : [];

type ExtractPluginDependenciesFromMetadata<Metadata> =
  'dependencies' extends keyof Metadata
    ? Metadata['dependencies'] extends DependencyPlugin[]
      ? Exclude<Metadata['dependencies'], undefined>
      : []
    : [];

type ExtractSharedStateFromMetadata<Metadata> =
  'sharedState' extends keyof Metadata ? Metadata['sharedState'] : never;

type ExtractActionsFromMetadata<Metadata> = 'actions' extends keyof Metadata
  ? Metadata['actions']
  : never;

type ExtractPluginConfigurationFromMetadata<Metadata> =
  'pluginConfiguration' extends keyof Metadata
    ? Metadata['pluginConfiguration']
    : never;

export type ExtractPluginDependencies<Plugin> = Plugin extends NextEditorPlugin<
  any,
  any
>
  ? Plugin extends (
      config: any,
      api: any,
    ) => DefaultEditorPlugin<any, infer Metadata>
    ? ExtractPluginDependenciesFromMetadataWithoutOptionals<Metadata>
    : never
  : never;

type ExtractPluginConfiguration<Plugin> = Plugin extends NextEditorPlugin<
  any,
  any
>
  ? Plugin extends (
      config: any,
      api: any,
    ) => DefaultEditorPlugin<any, infer Metadata>
    ? ExtractPluginConfigurationFromMetadata<Metadata>
    : never
  : never;

export type ExtractPluginSharedState<Plugin> = Plugin extends NextEditorPlugin<
  any,
  any
>
  ? Plugin extends (
      config: any,
      api: any,
    ) => DefaultEditorPlugin<any, infer Metadata>
    ? ExtractSharedStateFromMetadata<Metadata>
    : never
  : never;

export type ExtractPluginActions<Plugin> = Plugin extends NextEditorPlugin<
  any,
  any
>
  ? Plugin extends (
      config: any,
      api: any,
    ) => DefaultEditorPlugin<any, infer Metadata>
    ? ExtractActionsFromMetadata<Metadata>
    : never
  : never;

type ExtractPluginName<Plugin> = Plugin extends NextEditorPlugin<any, any>
  ? Plugin extends (...args: any) => DefaultEditorPlugin<infer PluginName, any>
    ? PluginName
    : never
  : never;

type Unsubscribe = () => void;
export type PluginDependenciesAPI<Plugin extends NextEditorPlugin<any, any>> = {
  sharedState: {
    currentState: () => ExtractPluginSharedState<Plugin> | undefined;
    onChange: (
      sub: (props: {
        nextSharedState: ExtractPluginSharedState<Plugin>;
        prevSharedState: ExtractPluginSharedState<Plugin>;
      }) => void,
    ) => Unsubscribe;
  };
  actions: ExtractPluginActions<Plugin>;
};

export type CreatePluginDependenciesAPI<
  PluginList extends NextEditorPlugin<any, any>[],
> = {
  [Plugin in PluginList[number] as `${ExtractPluginName<Plugin>}`]: Plugin extends OptionalPlugin<
    NextEditorPlugin<any, any>
  >
    ? PluginDependenciesAPI<Plugin> | undefined
    : Plugin extends NextEditorPlugin<any, any>
    ? PluginDependenciesAPI<Plugin>
    : never;
};

export type PluginAsArray<Plugin> =
  undefined extends ExtractPluginConfiguration<Plugin>
    ? [Plugin, ExtractPluginConfiguration<Plugin>?]
    : [Plugin, ExtractPluginConfiguration<Plugin>];

export type AllEditorPresetPluginTypes =
  | PluginAsArray<any>
  | NextEditorPlugin<any, any>;

type ExtractNextEditorPlugin<Plugin> = Plugin extends PluginAsArray<any>
  ? Plugin[0]
  : never;

export type VerifyPluginDependencies<
  Plugin,
  PluginsStack extends AllEditorPresetPluginTypes[],
> = ExtractPluginDependencies<Plugin> extends []
  ? // Plugin has no dependencies
    Plugin extends PluginAsArray<any> | NextEditorPlugin<any, any>
    ? Plugin
    : never
  : // Plugin has dependencies
  /**
   * case 1: We're looking for its dependent plugins indexed on `AllEditorPresetPluginTypes`
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
  StackPlugins extends AllEditorPresetPluginTypes[],
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

export type ExtractPluginNameFromAllBuilderPlugins<
  Plugin extends AllEditorPresetPluginTypes,
> = Plugin extends Array<any>
  ? Plugin extends [infer MaybePlugin, ...any]
    ? MaybePlugin extends NextEditorPlugin<any, any>
      ? ExtractPluginName<MaybePlugin>
      : never
    : never
  : Plugin extends NextEditorPlugin<any, any>
  ? ExtractPluginName<Plugin>
  : never;

export type ExtractInjectionAPI<Plugin> = Plugin extends NextEditorPlugin<
  infer Name,
  infer Metadata
>
  ? PluginInjectionAPI<Name, Metadata>
  : never;
