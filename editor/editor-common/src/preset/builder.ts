import { EventDispatcher, type Listener } from '../event-dispatcher';
import type {
	CorePlugin,
	DefaultEditorPlugin,
	DependencyPlugin,
	NextEditorPlugin,
	NextEditorPluginMetadata,
	OptionalPlugin,
	PluginDependenciesAPI,
} from '../types';
import type { EditorPlugin } from '../types/editor-plugin';

import type { EditorPluginInjectionAPI } from './plugin-injection-api';

/*********************
 *                    *
 * BASE TYPES         *
 *                    *
 **********************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 */
type MaybePlugin<T extends PresetPlugin> = T | undefined;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 */
type DependencyErrorMessage<Message extends string> = { errorMessage: Message };

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 */
type PluginWithConfiguration<Plugin> =
	undefined extends ExtractPluginConfiguration<Plugin>
		? [Plugin, ExtractPluginConfiguration<Plugin>?]
		: [Plugin, ExtractPluginConfiguration<Plugin>];

/****************************************************
 *                                                   *
 *        METADATA PROPERTIES EXTRACTION TYPES       *
 *                                                   *
 ****************************************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the configuration type from a given plugin.
 *
 *
 * @returns The extracted plugin configuration type if applicable, or `never`.
 *
 * @example
 * ```typescript
 * type DogPlugin = NextEditorPlugin<'dog'>;
 *
 * // it returns never, since Dog has no configuration
 * type MyPluginConfiguration = ExtractPluginConfiguration<MyPlugin>;
 *
 *
 * type CatPlugin = NextEditorPlugin<'cat', { configuration: { color: 'red' | 'blue' } }>;
 *
 * // it returns this type { color: 'red' | 'blue' }
 * type MyPluginConfiguration = ExtractPluginConfiguration<MyPlugin>;
 * ```
 */
type ExtractPluginConfiguration<Plugin> =
	Plugin extends NextEditorPlugin<any, any>
		? Plugin extends (props: { config: any; api: any }) => DefaultEditorPlugin<any, infer Metadata>
			? ExtractPluginConfigurationFromMetadata<Metadata>
			: never
		: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts and filters the plugin dependencies from the plugin metadata, excluding
 * optional dependencies.
 *
 * This type first checks if the `dependencies` property in the given `Metadata` type
 * is an array of `DependencyPlugin`. If true, it applies `FilterOptionalPlugins` to
 * filter out the optional dependencies. If the `dependencies` property does not exist
 * or is not an array of `DependencyPlugin`, the type resolves to an empty array.
 *
 * @returns An array of filtered plugin dependencies or an empty array.
 *
 * @example
 * ```typescript
 * type DogPlugin = NextEditorPlugin<'dog'>;
 * type LoudPlugin = NextEditorPlugin<'loud'>;
 * type BarkMetadata = {dependencies: [
 *  OptionalPlugin<LoudPlugin>,
 *  DogPlugin,
 * ]}
 * type BarkPlugin = NextEditorPlugin<'bark', BarkMetadata>;
 *
 * // It returns [DogPlugin]
 * type RequiredDependencies = ExtractPluginDependenciesFromMetadataWithoutOptionals<BarkMetadata>;
 *
 * ```
 *
 * You probably wants to use this other type util @see ExtractPluginDependencies
 * since you wouldn't need to infer the Metadata twice
 */
type ExtractPluginDependenciesFromMetadataWithoutOptionals<
	Metadata extends NextEditorPluginMetadata,
> = Metadata['dependencies'] extends DependencyPlugin[]
	? FilterOptionalPlugins<Metadata['dependencies']>
	: [];

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the plugin configuration from the given plugin metadata if the
 * `pluginConfiguration` property exists.
 *
 * This type conditionally checks if the `Metadata` type includes a `pluginConfiguration`
 * key. If such a key exists, the type of `pluginConfiguration` is returned. If not,
 * the type resolves to `never`.
 */
type ExtractPluginConfigurationFromMetadata<Metadata> = 'pluginConfiguration' extends keyof Metadata
	? Metadata['pluginConfiguration']
	: never;

/********************************
 *                               *
 *        TYPE INFER             *
 *                               *
 *********************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the NextEditorPlugin type from a PresetPuglin,
 * this is useful because the EditorPresetBuilder can accept the plugin in multiple ways:
 *
 * @example
 * ```
 * preset
 *  // valid
 *  .add([plugin, { myConfiguration }] // Type: [NextEditorPlugin, Configuration]
 *
 *  // valid
 *  .add([plugin])  // Type: [NextEditorPlugin, Configuration?]
 *
 *  // valid
 *  .add(plugin) // Type: NextEditorPlugin
 *
 * ```
 *
 * This type conditionally checks if `Plugin` is an array. If it is an array, it then checks if the first element
 * (`MPlugin`) extends `NextEditorPlugin`. But if `Plugin` directly extends `NextEditorPlugin`, it returns the `Plugin`
 * type itself. Otherwise, it resolves to `never`.
 *
 * You probably wants to use this if you need to extract the NextEditorPlugin from a @see PresetPlugin .
 * Since the PresetPlugin is an union between a tuple and a plugin.
 */
type ExtractPluginAllBuilderPlugins<Plugin extends PresetPlugin> =
	Plugin extends Array<any>
		? Plugin extends [infer MPlugin, ...any]
			? MPlugin extends NextEditorPlugin<infer Name, any>
				? MPlugin
				: never
			: never
		: Plugin extends NextEditorPlugin<infer Name, any>
			? Plugin
			: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts non-optional plugin dependencies, excluding any optional dependencies, from a given plugin's metadata.
 *
 * We can declare the depencies like this:
 *
 * @example
 * ```typescript
 * NextEditorPlugin<'bark', {
 *  dependencies: [DogPlugin, Optional<LoudPlugin>]
 * }>
 *
 * ```
 *
 *
 * This tyope is similar to @see ExtractPluginDependenciesFromMetadataWithoutOptionals
 * but you can use it to extract the non-optional-dependencies from any NextEditorPlugin without infer the metadata
 *
 * @example
 * ```typescript
 * type BarkPlugin = NextEditorPlugin<'bark', {
 *  dependencies: [DogPlugin, Optional<LoudPlugin>]
 * }>
 *
 * type PluginDependencies = ExtractPluginDependencies<BarkPlugin>; // Type: [DogPlugin]
 * ```
 */
type ExtractPluginDependencies<Plugin> =
	Plugin extends NextEditorPlugin<any, infer Metadata>
		? ExtractPluginDependenciesFromMetadataWithoutOptionals<Metadata>
		: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the NextEditorPlugin type from a PluginWithConfiguration.
 *
 *
 * You probably wants to use this if you need to extract the NextEditorPlugin from a @see PresetPlugin .
 * Since the PresetPlugin is an union between a tuple and a plugin.
 */
type ExtractNextEditorPluginFromPluginWithConfiguration<Plugin> =
	Plugin extends PluginWithConfiguration<any> ? Plugin[0] : never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the plugin name from a PresetPlugins.
 *
 * @example
 * ```typescript
 * ExtractPluginNameFromAllBuilderPlugins<NextEditorPlugin<'bark'>> // 'bark'
 *
 * ExtractPluginNameFromAllBuilderPlugins<[NextEditorPlugin<'dog'>, { configuration: {} }> // 'dog'
 *
 * ```
 * Similar to @see ExtractPluginAllBuilderPlugins, this type conditionally checks if `Plugin` is an array. If it is,
 * it attempts to extract the name of the first plugin (`MPlugin`) in the array that extends `NextEditorPlugin` with
 * a name and any metadata. If `Plugin` itself directly extends `NextEditorPlugin`, it extracts the plugin's name.
 * If none of these conditions are met, it resolves to `never`.
 *
 */
type ExtractPluginNameFromAllBuilderPlugins<Plugin extends PresetPlugin> =
	Plugin extends Array<any>
		? Plugin extends [infer MPlugin, ...any]
			? MPlugin extends NextEditorPlugin<infer Name, any>
				? Name
				: never
			: never
		: Plugin extends NextEditorPlugin<infer Name, any>
			? Name
			: never;

/******************************
 *                             *
 *        MAPPED TUPLES        *
 *                             *
 ******************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Filters out optional plugins from a tuple of dependency plugins.
 *
 *
 * This type is using the Tail Head trick to map a tuple to another one.
 * It does this by conditionally iterating over each element in the tuple: if the head of the tuple (the first element)
 * is an optional plugin, it is excluded from the resulting tuple; otherwise, it is included. This process is repeated
 * for the tail (the remaining elements) of the tuple until all elements have been evaluated.
 *
 */
type FilterOptionalPlugins<T extends DependencyPlugin[]> = T extends [infer Head, ...infer Tail]
	? Tail extends DependencyPlugin[]
		? Head extends OptionalPlugin<NextEditorPlugin<any, any>>
			? FilterOptionalPlugins<Tail>
			: [Head, ...FilterOptionalPlugins<Tail>]
		: T
	: T;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * One of the main type system for the EditorPresetBuilder.
 *
 * Verifies if a given plugin's dependencies are satisfied within a provided stack of plugins.
 *
 * Usually, the stack of plugins are coming from a generic parameter in the EditorPresetBuilder<PluginNames, PluginStack>.
 *
 * This type checks if the dependencies of the given `Plugin` are included in the provided `PluginsStack`.
 *
 * - If the plugin has no dependencies, it simply returns the plugin itself, (provided it is either a `PluginWithConfiguration` or  `NextEditorPlugin`, in case someone tries to add a non-NextEditorPlugin to the Preset)
 *
 * - If the plugin has dependencies, it verifies each dependency against the `PluginsStack` to ensure
 * they are present. This includes checking direct dependencies as well as dependencies hidden inside tuples (by unwrapping
 * them). If all dependencies are satisfied, it returns the plugin; otherwise, it resolves to `never`.
 *
 *
 * @example
 * ```typescript
 * type DogPlugin = NextEditorPlugin<'dog'>;
 * type LoudPlugin = NextEditorPlugin<'loud'>;
 * type BarkPlugin = NextEditorPlugin<'bark', { dependencies: [DogPlugin, LoudPlugin] }>;
 *
 *
 * // When there we are missing dependencies
 * VerifyPluginDependencies<BarkPlugin, [DogPlugin]> // Type: never
 *
 *
 * // When there all dependencies are already added on the stack
 * VerifyPluginDependencies<BarkPlugin, [DogPlugin, LoudPlugin]> // Type: BarkPlugin
 *
 * ```
 */
type VerifyPluginDependencies<Plugin, PluginsStack extends AllEditorPresetPluginTypes[]> =
	ExtractPluginDependencies<Plugin> extends []
		? // Plugin has no dependencies
			Plugin extends PluginWithConfiguration<any> | NextEditorPlugin<any, any>
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
					 * unwrapping `Plugins` via `ExtractNextEditorPluginFromPluginWithConfiguration`
					 */
					| (ExtractPluginDependencies<Plugin>[number] &
							ExtractNextEditorPluginFromPluginWithConfiguration<PluginsStack[number]>)
			? Plugin
			: never;

/********************************
 *                               *
 *   BETTER ERROR MESSAGE TYPES  *
 *                               *
 *********************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * TypeScript doesn't allow custom error messages (yet). So, use this type to force a specific error message to the user.
 *
 * This is useful because in a situation where a Preset has too many plugins, its become really hard to understand what the error message is.
 *
 * Extracts the names of required dependencies for a given plugin, or provides an error message if dependencies are
 * missing, invalid, or if the plugin itself is not a recognized NextEditorPlugin.
 *
 * This type evaluates whether a given `Plugin` has defined dependencies. If dependencies are absent, it returns
 * a message indicating no dependencies were found. If dependencies are present but do not conform to expected types,
 * or if an unspecified issue occurs, appropriate error messages are generated. Valid dependencies result in the
 * extraction of their names; otherwise, an error message specific to the situation is returned.
 *
 * It is used by the @see GetDependencyErrorMessage to group all error messages when a new plugin is being added into a preset.
 */
type ExtractRequiredDependencies<Plugin, PluginsStack extends AllEditorPresetPluginTypes[]> =
	Plugin extends NextEditorPlugin<infer PluginName, infer Metadata>
		? Metadata['dependencies'] extends undefined
			? DependencyErrorMessage<'No found dependencies'>
			: Metadata['dependencies'] extends DependencyPlugin[]
				? FilterOptionalPlugins<
						FilterExistingPlugins<Metadata['dependencies'], PluginsStack>
					>[number] extends NextEditorPlugin<infer Name, any>
					? Name
					: DependencyErrorMessage<`Invalid dependency for ${PluginName}`>
				: DependencyErrorMessage<`Invalid dependencies for ${PluginName}`>
		: DependencyErrorMessage<'Plugin is not NextEditorPlugin'>;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Retrieves an error message if any dependency-related issues are detected for a given plugin within a specified
 * plugin stack. This includes missing dependencies or other errors as identified by `ExtractRequiredDependencies`.
 *
 * It attempts to extract required dependencies for the `Plugin` from the `StackPlugins`. If the result is a string,
 * it indicates a missing dependency and constructs an error message accordingly. Otherwise, it directly returns the
 * result from `ExtractRequiredDependencies`, which could be an error message detailing the issue encountered.
 *
 * It is used by the @see SafePresetCheck to make improve the error message
 */
type GetDependencyErrorMessage<Plugin, StackPlugins extends AllEditorPresetPluginTypes[]> =
	ExtractRequiredDependencies<Plugin, StackPlugins> extends string
		? DependencyErrorMessage<`Missing dependency: ${ExtractRequiredDependencies<
				Plugin,
				StackPlugins
			>}Plugin`>
		: ExtractRequiredDependencies<Plugin, StackPlugins>;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Filters through an array of dependency plugins, removing any that do not exist in the provided plugins stack.
 *
 * This type recursively checks each plugin dependency against the provided `PluginsStack`. If a dependency is found
 * within the stack, it is included in the result; otherwise, it is excluded. This process helps in identifying
 * missing plugins from a set of required dependencies.
 *
 */
type FilterExistingPlugins<
	T extends DependencyPlugin[],
	PluginsStack extends AllEditorPresetPluginTypes[],
> = T extends [infer CurrentPluginDependency, ...infer RemainingPluginDependencies]
	? RemainingPluginDependencies extends DependencyPlugin[]
		? CurrentPluginDependency extends PluginsStack[number]
			? FilterExistingPlugins<RemainingPluginDependencies, PluginsStack>
			: [
					CurrentPluginDependency,
					...FilterExistingPlugins<RemainingPluginDependencies, PluginsStack>,
				]
		: T
	: T;

/*****************************
 *                            *
 *   VALIDATION HELPER TYPES  *
 *                            *
 ******************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Checks for duplicate plugin entries within a stack of plugins. If a duplicate is found, it returns an error message;
 * otherwise, it proceeds without error.
 *
 * This type primarily serves to ensure that each plugin in the plugin stack is unique, preventing issues related to
 * duplicate plugin registration. It also includes a check to accommodate scenarios where strict typing is bypassed.
 *
 * If the plugin is used with other configuration this type will not complain.
 */
type CheckDuplicatePlugin<Plugin, StackPlugins extends AllEditorPresetPluginTypes[]> =
	Plugin extends NextEditorPlugin<infer PluginName, any>
		? Plugin extends StackPlugins[number]
			? // It's possible that the StackPlugins are type "any" - if we don't check this
				// the "any" type will throw an error (which is not ideal for someone just trying
				// to ignore preset type errors). We check if "unknown" extends StackPlugins because
				// if the StackPlugins is typed strongly this won't be true.
				unknown extends StackPlugins[number]
				? unknown
				: DependencyErrorMessage<`Duplicate plugin: ${PluginName}`>
			: unknown
		: unknown;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Verifies if a given plugin meets basic requirements to be considered a valid editor plugin.
 *
 * This type checks if the plugin is a function that matches the expected signature for an next editor plugin. If it does,
 * it further checks the plugin's configuration requirements to ensure compatibility and adherence to expected
 * configurations.
 *
 */
type CheckBasicPlugin<Plugin> = Plugin extends (args: any, api: any) => EditorPlugin
	? CheckTupleRequirements<
			Plugin,
			ExtractPluginConfiguration<Plugin>,
			PluginWithConfiguration<Plugin>
		>
	: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Evaluates whether a plugin's configuration meets the requirements to be used either as a standalone plugin or
 * as part of a plugin-with-configuration tuple.
 *
 * This type assesses the plugin configuration's status—whether it's optional, mandatory, or not present—and determines
 * the valid ways in which the plugin can be registered or used. This is crucial for maintaining backward compatibility
 * and ensuring plugins are correctly configured upon registration into the Preset
 *
 */
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

/*****************************
 *                            *
 *   EDITOR API HELPER TYPES  *
 *                            *
 ******************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the numeric indices as literal types from a tuple.
 *
 * This utility type takes a tuple and produces a union of its numeric indices as literal types. It's useful for
 * iterating over tuples with TypeScript's mapped types, allowing for operations on each tuple element based on its index.
 *
 * It is being used to separate plugins registred with `preset.maybeAdd` and `preset.add`.
 */
type TupleIndices<T extends readonly any[]> =
	Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Constructs a plugin api type with optional properties based on the optional plugins from a given tuple of plugins.
 *
 * This type iterates over a tuple of plugins and checks for plugins marked as optional (indicated by the presence
 * of `undefined`). For each optional plugin, it attempts to extract the plugin's name and corresponding
 * `PluginDependenciesAPI` type. The resulting object type has properties with these plugin names as keys and their
 * respective APIs as optional values.
 *
 * @example
 * ```typescript
 * type DogPlugin = NextEditorPlugin<'dog'>;
 * type CatPlugin = NextEditorPlugin<'cat'>;
 *
 *
 * BuildOptionalAPIEntry<[DogPlugin, MaybePlugin<CatPlugin>]> // Type: { cat?: {  } }
 *
 * ```
 */
type BuildOptionalAPIEntry<T extends AllEditorPresetPluginTypes[]> = {
	[K in TupleIndices<T> as undefined extends T[K]
		? T[K] extends MaybePlugin<infer P>
			? ExtractPluginNameFromAllBuilderPlugins<P>
			: never
		: never]?: undefined extends T[K]
		? T[K] extends MaybePlugin<infer P>
			? PluginDependenciesAPI<ExtractPluginAllBuilderPlugins<P>> | undefined
			: never
		: never;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 * Generates a plugin api type with properties based on the required plugins from a given tuple of plugins.
 *
 * This type traverses a tuple of plugins, focusing on those not marked as optional. For each required plugin,
 * it extracts the plugin's name to use as a key and determines the corresponding `PluginDependenciesAPI` type
 * for the value. The resulting object type includes these key-value pairs, ensuring that each required plugin
 * has a defined API entry in the object.
 *
 * @example
 * ```typescript
 * type DogPlugin = NextEditorPlugin<'dog'>;
 * type CatPlugin = NextEditorPlugin<'cat'>;
 *
 *
 * BuildOptionalAPIEntry<[DogPlugin, MaybePlugin<CatPlugin>]> // Type: { dog?: {  } }
 *
 * ```
 */
type BuildRequiredAPIEntry<T extends AllEditorPresetPluginTypes[]> = {
	[K in TupleIndices<T> as undefined extends T[K]
		? never
		: T[K] extends PresetPlugin
			? ExtractPluginNameFromAllBuilderPlugins<T[K]>
			: never]: undefined extends T[K]
		? never
		: T[K] extends PresetPlugin
			? PluginDependenciesAPI<ExtractPluginAllBuilderPlugins<T[K]>>
			: never;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Forces the expansion (simplification/normalization) of conditional and mapped types.
 * This can be particularly useful for making the types more readable and manageable in
 * environments like IntelliSense or when generating type documentation.
 *
 * More info {@link https://github.com/microsoft/TypeScript/issues/47980 TypeScript/issues/47980}
 */
type Expand<T> = T extends Function
	? T
	: T extends unknown
		? { [K in keyof T]: Expand<T[K]> }
		: never;

/*************************
 *                        *
 *   PUBLIC TYPES         *
 *                        *
 *************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Represents a utility type that wraps a string type in a tuple, often used to denote
 * plugin names that might be optionally included or excluded in certain contexts within
 * the editor preset builder.
 */
export type MaybePluginName<T extends string> = [T];

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * A union type that represents a plugin which could either be a standalone `NextEditorPlugin`
 * or a `PluginWithConfiguration` that bundles a plugin with its specific configuration.
 *
 * This type is fundamental in managing plugins within presets, allowing for flexible plugin
 * registration that accommodates plugins with or without explicit configurations.
 */
export type PresetPlugin =
	| PluginWithConfiguration<NextEditorPlugin<any, any>>
	| NextEditorPlugin<any, any>;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * A union type that aggregates all possible plugin name representations within the editor preset builder,
 * including simple strings for direct plugin names and wrapped strings in tuples when a plugin is registred with `maybeAdd`.
 *
 */
export type AllPluginNames = string | MaybePluginName<string>;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Represents all possible types of plugins that can be included within an editor preset.
 * This includes both `PresetPlugin` types and `MaybePlugin` types, accommodating a wide range
 * of plugin registration scenarios likw:
 *
 * @example
 * ```typescript
 * preset
 *  .add([plugin, { myConfiguration }]
 *  .add([plugin])
 *  .add(plugin)
 *  .maybeAdd(plugin, () => true);
 *  .maybeAdd([plugin], () => true);
 *  .maybeAdd([plugin, { myConfiguration }], () => true);
 *
 * ```
 */
export type AllEditorPresetPluginTypes = PresetPlugin | MaybePlugin<NextEditorPlugin<any, any>>;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Performs a series of checks to ensure that a given plugin can be safely added to a preset.
 * This includes verifying the plugin's dependencies, checking for duplicate registrations, and ensuring
 * the plugin meets basic criteria for being considered a valid plugin.
 *
 * @returns The plugin type if all checks pass, or error messages detailing why the plugin cannot be added.
 */
export type SafePresetCheck<
	Plugin,
	StackPlugins extends AllEditorPresetPluginTypes[],
> = Plugin extends Plugin & VerifyPluginDependencies<Plugin, StackPlugins>
	? Plugin extends NextEditorPlugin<any, any>
		? CheckDuplicatePlugin<Plugin, StackPlugins> & CheckBasicPlugin<Plugin>
		: never
	: GetDependencyErrorMessage<Plugin, StackPlugins>;

/**
 * 📢 Public Type API
 *
 * Extracts the complete API surface for a given editor preset, including both core and plugin-specific APIs.
 * This type dynamically assembles the API object based on the included plugins, differentiating between
 * optional and required plugins to accurately reflect the available API calls.
 *
 * @template Preset The editor preset builder instance from which to extract the API.
 * @returns An object type representing the complete API surface for the given preset.
 *
 * @example
 * ```typescript
 * const dogPlugin: NextEditorPlugin<'dog'>;
 * const catPlugin: NextEditorPlugin<'cat'>;
 *
 * const myPreset = new EditorPresetBuilder()
 *  .add(dogPlugin)
 *  .maybeAdd(catPlugin, () => true)
 *
 * const api: ExtractPresetAPI<typeof myPreset>;
 *
 *
 * // Core is always available
 * api.core.actions
 *
 * // Dog was registred with `add`, so it will always be available
 * api.dog.actions
 *
 * // Cat was registred with `maybeAdd`, so it may not be available on runtime
 * api.cat?.actions
 * ```
 */
export type ExtractPresetAPI<Preset extends EditorPresetBuilder<any, any>> =
	Preset extends EditorPresetBuilder<any, infer Plugins>
		? Expand<
				{
					core: PluginDependenciesAPI<CorePlugin>;
				} & BuildOptionalAPIEntry<Plugins> &
					BuildRequiredAPIEntry<Plugins>
			>
		: never;

/*************************
 *                        *
 *   PROP TYPES           *
 *                        *
 *************************/

type OldAndDeprecatedAddFunction<T> = (
	pluginToAdd: T,
	builder: EditorPresetBuilder<any, any>,
) => EditorPresetBuilder<any, any>;

type BuildProps = {
	excludePlugins?: Set<string>;
	pluginInjectionAPI?: EditorPluginInjectionAPI;
};

/**
 * This class is the main way to build an Editor.
 *
 * A Preset is an immutable object, any modification like `.add` or `.maybeAdd`
 * will always result in a new preset instance.
 *
 *  ⚠️⚠️⚠️ ATTENTION  ⚠️⚠️⚠️
 * For ComposableEditor, a new Preset means a full redraw,
 * it is one of the most expensive operation.
 * Please make sure you aren't recreating this all the time.
 *
 * EditorAPI:
 * In case you need access to the EditorAPI type definition based in the preset you have.
 * Please use the util type exported in this package: @see ExtractPresetAPI<Preset>
 *
 * ```typescript
 * const myPreset = new EditorPresetBuilder()
 * 	.add(pluginDog)
 *  .add(pluginCat);
 *
 *
 * function someFunc(myApi: ExtractPresetAPI<typeof myPreset>) {
 *
 * }
 * ```
 *
 * If your code is inside an EditorPlugin you should be using the @see ExtractInjectionAPI.
 */
export class EditorPresetBuilder<
	PluginNames extends AllPluginNames[] = [],
	StackPlugins extends AllEditorPresetPluginTypes[] = [],
> {
	private readonly data: [...StackPlugins];
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated Use `apiResolver` instead
	 */
	public apiPromise: Promise<unknown>;
	private resolver: ((v: unknown) => void) | undefined;
	/**
	 * Returns the editor API when resolved.
	 * This occurs when the preset is initially built.
	 */
	public apiResolver: APIDispatcher;
	private apiEmitter: Emitter = () => {};

	constructor(...more: [...StackPlugins]) {
		this.data = [...more] || [];
		this.apiPromise = new Promise<unknown>((r) => (this.resolver = r));
		this.apiResolver = new APIDispatcher((emitter) => (this.apiEmitter = emitter));
	}

	public add<NewPlugin extends PresetPlugin>(
		nextOrTuple: SafePresetCheck<NewPlugin, StackPlugins>,
	): EditorPresetBuilder<
		[ExtractPluginNameFromAllBuilderPlugins<NewPlugin>, ...PluginNames],
		[NewPlugin, ...StackPlugins]
	> {
		return new EditorPresetBuilder<
			[ExtractPluginNameFromAllBuilderPlugins<NewPlugin>, ...PluginNames],
			[NewPlugin, ...StackPlugins]
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

	public maybeAdd<ToAddPlugin extends PresetPlugin>(
		pluginToAdd: SafePresetCheck<ToAddPlugin, StackPlugins>,
		shouldAdd: boolean | (() => boolean) | OldAndDeprecatedAddFunction<ToAddPlugin>,
	): EditorPresetBuilder<
		[MaybePluginName<ExtractPluginNameFromAllBuilderPlugins<ToAddPlugin>>, ...PluginNames],
		[MaybePlugin<ToAddPlugin>, ...StackPlugins]
	> {
		const pluginOrBuilder =
			typeof shouldAdd === 'function'
				? // @ts-expect-error Argument of type 'SafePresetCheck<ToAddPlugin, StackPlugins>' is not assignable to parameter of type 'ToAddPlugin'.
					shouldAdd(pluginToAdd, this)
				: shouldAdd;

		if (pluginOrBuilder instanceof EditorPresetBuilder) {
			return pluginOrBuilder;
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
			[MaybePluginName<ExtractPluginNameFromAllBuilderPlugins<ToAddPlugin>>, ...PluginNames],
			[MaybePlugin<ToAddPlugin>, ...StackPlugins]
		>(...nextPluginStack);

		return nextEditorPresetBuilder;
	}

	public has(plugin: AllEditorPresetPluginTypes): boolean {
		return this.data.some((pluginPreset) => {
			if (Array.isArray(pluginPreset)) {
				return pluginPreset[0] === plugin;
			}

			return pluginPreset === plugin;
		});
	}

	public build({
		pluginInjectionAPI,
		excludePlugins: maybeExcludePlugins,
	}: BuildProps = {}): EditorPlugin[] {
		const excludePlugins = new Set(maybeExcludePlugins ? maybeExcludePlugins : []);
		const editorPlugins = this.processEditorPlugins({
			pluginInjectionAPI,
			excludePlugins,
		});
		if (pluginInjectionAPI) {
			// The pluginInjectionAPI API doesn't have information enough to build a proper type for the API.
			// It is returning a generic type but on top of the Proxy system
			// So, we can safely recast it here
			this.apiEmitter(
				pluginInjectionAPI.api() as unknown as Expand<
					BuildOptionalAPIEntry<StackPlugins> & BuildRequiredAPIEntry<StackPlugins>
				>,
			);
			// Deprecated approach
			this.resolver?.(
				pluginInjectionAPI.api() as unknown as Expand<
					BuildOptionalAPIEntry<StackPlugins> & BuildRequiredAPIEntry<StackPlugins>
				>,
			);
		}
		return this.removeExcludedPlugins(editorPlugins, excludePlugins);
	}

	private verifyDuplicatedPlugins() {
		const cache = new Set();
		this.data.filter(Boolean).forEach((pluginEntry) => {
			const [pluginFn, _] = Array.isArray(pluginEntry) ? pluginEntry : [pluginEntry, undefined];
			if (cache.has(pluginFn)) {
				throw new Error(`${pluginFn} is already included!`);
			}
			cache.add(pluginFn);
		});

		return true;
	}

	private processEditorPlugins({ pluginInjectionAPI, excludePlugins }: BuildProps) {
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

		return plugins as EditorPlugin[];
	}

	private removeExcludedPlugins(plugins: EditorPlugin[], excludes?: Set<string>) {
		if (excludes) {
			return plugins.filter((plugin) => !plugin || !excludes.has(plugin.name));
		}
		return plugins;
	}

	private safeEntry = (plugin: AllEditorPresetPluginTypes) =>
		Array.isArray(plugin) ? plugin : [plugin, undefined];
}

type Emitter = (value: unknown) => void;

/**
 * WARNING: Internal object
 *
 * Dedicated wrapper around EventDispatcher for public API around the editor API.
 * This only has the public method `on` which is used to listen to updates to the editor API.
 *
 * This shouldn't really be used externally - the `editorAPI` should be accessed via `usePreset`.
 */
class APIDispatcher {
	private eventDispatcher = new EventDispatcher<unknown>();
	private key = 'api-resolved-event';
	// Need to store the last event created in case we subscribe after the fact
	private initialEvent: unknown | undefined = undefined;

	constructor(private emitter: (emitter: Emitter) => void) {
		this.emitter((v) => {
			this.initialEvent = v;
			this.eventDispatcher.emit(this.key, v);
		});
	}

	/**
	 * Used to observe Editor API events
	 *
	 * @param cb Callback to listen to the editor API.
	 * This will also emit the last event if the stream has already started.
	 * @returns Cleanup function to cleanup the listener
	 */
	on(cb: Listener<unknown>) {
		if (this.initialEvent !== undefined) {
			// Keeps timing consistent with old approach - certain products
			// ie. ai-mate relied on this.
			Promise.resolve().then(() => cb(this.initialEvent));
		}
		this.eventDispatcher.on(this.key, cb);

		return () => {
			this.eventDispatcher.off(this.key, cb);
		};
	}

	destroy() {
		this.eventDispatcher.destroy();
	}
}
