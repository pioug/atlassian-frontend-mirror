/**
 * This entire file attempts to build out the type safety needed in our new
 * plugin dependency injection approach, alongside our current implementation of
 * `Presets` - if the generics get too unwieldy, we may redesign how presets
 * are put together - but for now `Builder` & `Preset` aim to beinterchangeable.
 */
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Fragment, Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { FireAnalyticsCallback } from '../analytics';

import type { EditorCommand, EditorCommandWithMetadata } from './editor-command';
import type { EditorPlugin } from './editor-plugin';

export interface Transformer<T> {
	encode(node: Node): T;
	parse(content: T): Node;
}

export type CorePlugin = NextEditorPlugin<
	'core',
	{
		pluginConfiguration: {
			getEditorView: () => EditorView | undefined;
			// Optional analytics callback to fire events - core plugin isn't able to consume AnalyticsPlugin as a dependency like other plugins
			fireAnalyticsEvent?: FireAnalyticsCallback;
		};
		actions: {
			/**
			 * Dispatches an EditorCommand to ProseMirror
			 *
			 * @param command A function (EditorCommand | undefined) that takes an object containing a `Transaction` and returns a `Transaction` if it
			 * is successful or `null` if it shouldn't be dispatched.
			 * @returns (boolean) if the command was successful in dispatching
			 */
			execute: (command: EditorCommand | undefined) => boolean;
			/**
			 * Focuses the editor.
			 *
			 * Calls the focus method of the `EditorView` and scrolls the
			 * current selection into view.
			 *
			 * @param options
			 * @param options.scrollIntoView (boolean) if the view should also scroll when focusing. True by default
			 * @returns (boolean) if the focus was successful
			 */
			focus: (options?: { scrollIntoView: boolean }) => boolean;
			/**
			 * Blurs the editor.
			 *
			 * Calls blur on the editor DOM element.
			 *
			 * @returns (boolean) if the blur was successful
			 */
			blur: () => boolean;

			/**
			 * Replaces the current content of the editor with the provided raw value.
			 *
			 * @param replaceValue - The new content to replace the current content. It can be of any type.
			 * @param options - Options
			 * @param options.scrollIntoView (boolean) if the view should also scroll on replace. True by default
			 * @returns A boolean indicating whether the replacement was successful.
			 */
			replaceDocument: (
				replaceValue: Node | Fragment | Array<Node> | Object | string,
				options?: { scrollIntoView?: boolean },
			) => boolean;

			/**
			 * Request the editor document.
			 * The document will return when available. If called multiple times it will throttle and return the
			 * latest document when ready.
			 *
			 * A transformer can be created using `createTransformer`.
			 *
			 * @param onReceive Callback to handle the document. Document type based on the transformer.
			 * @param options Pass a transformer for the document to be transformed into a different format.
			 */
			requestDocument<GenericTransformer extends Transformer<any> = Transformer<JSONDocNode>>(
				onReceive: (document: TransformerResult<GenericTransformer> | undefined) => void,
				options?: {
					transformer?: GenericTransformer;
				},
			): void;

			/**
			 * Create a transformer
			 *
			 * @param schema Schema of the document
			 * @returns Transformer which can be used to request a document
			 */
			createTransformer<Format>(
				cb: (schema: Schema) => Transformer<Format>,
			): Transformer<Format> | undefined;
		};
	}
>;

export type TransformerResult<GenericTransformer = Transformer<JSONDocNode>> =
	GenericTransformer extends Transformer<infer Content> ? Content : JSONDocNode;

export type InferTransformerResultCallback<T extends Transformer<any> | undefined> = (
	doc: T extends Transformer<infer U> ? TransformerResult<U> : TransformerResult<JSONDocNode>,
) => void;
export type DefaultTransformerResultCallback = (
	doc: TransformerResult<JSONDocNode> | undefined,
) => void;

/*********************
 *										*
 * BASE TYPES					*
 *										*
 **********************/

type MaybeAction = ((...agrs: any) => any) | ((...agrs: any) => void);
type NextEditorPluginActions = Record<string, MaybeAction>;
type NextEditorEditorCommands = Record<string, EditorCommandWithMetadata | EditorCommand>;

// Used internally to indicate the plugin is internal
// This is used to ensure typescript can tell the difference between `NextEditorPlugin` and `OptionalPlugin<NextEditorPlugin>`
// and therefore make accessing the external plugin for an `OptionalPlugin` optional.
// (See `ExternalPluginAPI` for how it determines the typing)
type OptionalPrivateProperty = { __optionalPluginType: true };

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Conditionally picks the property name 'getSharedState' if the Metadata contains a sharedState definition.
 *
 * This type checks if the generic Metadata type for a plugin has a shared state. If it does, it enables
 * the inclusion of the 'getSharedState' method name in the plugin's API type. Otherwise, it results in `never`,
 * indicating the absence of shared state functionality in the plugin.
 *
 * @returns 'getSharedState' if shared state is defined in Metadata, otherwise `never`.
 */
type WithSharedState<Metadata extends NextEditorPluginMetadata> = {
	[Property in keyof Pick<Metadata, 'sharedState'> as PickSharedStatePropertyName<Metadata>]: (
		editorState: EditorState | undefined,
	) => ExtractSharedStateFromMetadata<Metadata>;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Conditionally picks the property name 'actions' if the Metadata contains action definitions.
 *
 * This type evaluates whether the given Metadata for a plugin defines any actions. If actions are present,
 * the 'actions' property name is included in the plugin's API type, enabling action handling. If there are no
 * actions, it results in `never`.
 *
 * @returns 'actions' if actions are defined in Metadata, otherwise `never`.
 */
type WithActions<Metadata extends NextEditorPluginMetadata> = {
	[Property in keyof Pick<
		Metadata,
		'actions'
	> as PickActionsPropertyName<Metadata>]: ExtractActionsFromMetadata<Metadata>;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Conditionally picks the property name 'commands' if the Metadata contains command definitions.
 *
 * This type assesses whether the provided Metadata for a plugin includes commands. If commands exist,
 * it allows for the inclusion of the 'commands' property name in the plugin's API type, facilitating command
 * execution. If no commands are defined, the result is `never`.
 *
 * @returns 'commands' if commands are defined in Metadata, otherwise `never`.
 */
type WithCommands<Metadata extends NextEditorPluginMetadata> = {
	[Property in keyof Pick<
		Metadata,
		'commands'
	> as PickCommandsPropertyName<Metadata>]: ExtractCommandsFromMetadata<Metadata>;
};

/****************************************************
 *																									 *
 *				METADATA PROPERTIES EXTRACTION TYPES			 *
 *																									 *
 ****************************************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Conditionally picks the property name 'getSharedState' if the Metadata contains a sharedState definition.
 *
 * This type checks if the generic Metadata type for a plugin has a shared state. If it does, it enables
 * the inclusion of the 'getSharedState' method name in the plugin's API type. Otherwise, it results in `never`,
 * indicating the absence of shared state functionality in the plugin.
 *
 * @template Metadata The metadata type to check for shared state.
 * @returns 'getSharedState' if shared state is defined in Metadata, otherwise `never`.
 */
type PickSharedStatePropertyName<Metadata extends NextEditorPluginMetadata> =
	IsAny<Metadata> extends true
		? never
		: ExtractSharedStateFromMetadata<Metadata> extends never
			? never
			: 'getSharedState';

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Conditionally picks the property name 'actions' if the Metadata contains action definitions.
 *
 * This type evaluates whether the given Metadata for a plugin defines any actions. If actions are present,
 * the 'actions' property name is included in the plugin's API type, enabling action handling. If there are no
 * actions, it results in `never`.
 *
 * @returns 'actions' if actions are defined in Metadata, otherwise `never`.
 */
type PickActionsPropertyName<Metadata extends NextEditorPluginMetadata> =
	IsAny<Metadata> extends true
		? never
		: ExtractActionsFromMetadata<Metadata> extends never
			? never
			: 'actions';
/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Conditionally picks the property name 'commands' if the Metadata contains command definitions.
 *
 * This type assesses whether the provided Metadata for a plugin includes commands. If commands exist,
 * it allows for the inclusion of the 'commands' property name in the plugin's API type, facilitating command
 * execution. If no commands are defined, the result is `never`.
 *
 * @returns 'commands' if commands are defined in Metadata, otherwise `never`.
 */
type PickCommandsPropertyName<Metadata extends NextEditorPluginMetadata> =
	IsAny<Metadata> extends true
		? never
		: ExtractCommandsFromMetadata<Metadata> extends never
			? never
			: 'commands';

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the dependencies from the plugin Metadata, if any are defined.
 *
 * This type checks the Metadata for a 'dependencies' key and ensures it is a list of DependencyPlugin types.
 * If dependencies are present, they are returned, excluding any potential `undefined` values. If no dependencies
 * are defined, an empty array is returned.
 *
 * @returns An array of DependencyPlugin types if defined, otherwise an empty array.
 */
type ExtractPluginDependenciesFromMetadata<Metadata> = 'dependencies' extends keyof Metadata
	? Metadata['dependencies'] extends DependencyPlugin[]
		? Exclude<Metadata['dependencies'], undefined>
		: []
	: [];

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the shared state definition from the plugin Metadata, if present.
 *
 * This type looks for a 'sharedState' key within the Metadata. If found, it returns the associated type of the
 * shared state. If the 'sharedState' key is not present, the result is `never`.
 *
 * @returns The shared state type if defined, otherwise `never`.
 */
type ExtractSharedStateFromMetadata<Metadata> = 'sharedState' extends keyof Metadata
	? Metadata['sharedState']
	: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the actions definition from the plugin Metadata, if available.
 *
 * This type queries the Metadata for an 'actions' key. If such a key exists, it returns the type of the
 * defined actions. If there are no actions defined in the Metadata, the result is `never`.
 *
 * @returns The actions type if defined, otherwise `never`.
 */
type ExtractActionsFromMetadata<Metadata> = 'actions' extends keyof Metadata
	? Metadata['actions']
	: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the commands definition from the plugin Metadata, if it exists.
 *
 * By checking for a 'commands' key within the Metadata, this type determines if any commands are defined.
 * If commands are present, their type is returned. If not, the result is `never`.
 *
 * @returns The commands type if defined, otherwise `never`.
 */
type ExtractCommandsFromMetadata<Metadata> = 'commands' extends keyof Metadata
	? Metadata['commands']
	: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the plugin name from a NextEditorPlugin type.
 *
 * This type attempts to derive the plugin name from a given NextEditorPlugin type by checking if the plugin
 * is a function returning `DefaultEditorPlugin` with a specific name. If the name can be inferred, it is returned;
 * otherwise, the result is `never`.
 *
 * @returns The inferred plugin name if possible, otherwise `never`.
 */
type ExtractPluginName<Plugin> =
	Plugin extends NextEditorPlugin<any, any>
		? Plugin extends (...args: any) => DefaultEditorPlugin<infer PluginName, any>
			? PluginName
			: never
		: never;

/********************************
 *															 *
 *				TYPE INFER						 *
 *															 *
 *********************************/
/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Utility type to check if a given type T is 'any'.
 *
 * This type exploits TypeScript's behavior to determine if a type is 'any'. It leverages the fact that
 * 'any' is the only type assignable to both '1 & T' and '0'. If T is 'any', the type resolves to true;
 * otherwise, it resolves to false.
 *
 * @returns `true` if T is 'any', otherwise `false`.
 */
type IsAny<T> = 0 extends 1 & T ? true : false;

/******************************
 *														 *
 *	EDITOR API MAPPED TUPLES	 *
 *														 *
 ******************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts and lists all required plugins from a tuple list of plugins, excluding any that are marked as optional.
 *
 * This recursive type iterates through a tuple of plugins, filtering out any plugins that are either undefined or
 * explicitly marked as optional (using `OptionalPlugin`). The result is a new tuple containing only the required
 * plugins. This is useful for determining the set of plugins that must be present for a certain feature or
 * configuration to work.
 *
 * @returns A tuple of required plugins, with optional plugins removed.
 *
 * @example
 * ```typescript
 * type MyRequiredPlugins = ExtractRequiredPlugins<[OptionalPlugin<MyPlugin>, MyPlugin2]>;
 *
 * // Type: [MyPlugin2].
 * ```
 */
type ExtractRequiredPlugins<TuplePluginList extends [...any[]]> = TuplePluginList extends [
	infer First,
	...infer Rest,
]
	? undefined extends First
		? ExtractRequiredPlugins<Rest>
		: First extends OptionalPlugin<NextEditorPlugin<any, any>>
			? ExtractRequiredPlugins<Rest>
			: First extends NextEditorPlugin<any, any>
				? [First, ...ExtractRequiredPlugins<[...Rest]>]
				: ExtractRequiredPlugins<Rest>
	: [];

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts and lists all optional plugins from a tuple list of plugins, including any that are explicitly marked as
 * optional or are undefined.
 *
 * This type recursively scans through a tuple of plugins, collecting plugins that are either marked as `undefined`
 * or wrapped with `OptionalPlugin`. The result is a new tuple consisting solely of these optional plugins, effectively
 * separating them from the required ones. This type is instrumental in configurations where optional dependencies
 * need to be distinguished from required ones for conditional loading or initialization.
 *
 * @returns A tuple of optional plugins, excluding required ones.
 *
 * @example
 * ```typescript
 * type MyOptionalPlugins = ExtractOptionalPlugins<[OptionalPlugin<MyPlugin>, MyPlugin2]>;
 *
 * // Type: [MyPlugin].
 * ```
 */
type ExtractOptionalPlugins<TuplePluginList extends [...any[]]> = TuplePluginList extends [
	infer First,
	...infer Rest,
]
	? undefined extends First
		? [First, ...ExtractOptionalPlugins<[...Rest]>]
		: First extends OptionalPlugin<infer Plugin>
			? [Plugin, ...ExtractOptionalPlugins<[...Rest]>]
			: ExtractOptionalPlugins<[...Rest]>
	: [];

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the shared state type from a plugin or its metadata.
 *
 * This type conditionally checks whether the input is a NextEditorPlugin instance or directly NextEditorPluginMetadata.
 * If the input is a plugin instance, it attempts to infer the Metadata type from the plugin's constructor function signature,
 * specifically looking for a shared state definition. If the input is directly plugin metadata, it extracts the shared state
 * definition directly from the metadata.
 *
 * @returns The type of the shared state if defined, otherwise `never`.
 */
export type ExtractPluginSharedState<PluginOrMetadata> =
	PluginOrMetadata extends NextEditorPlugin<any, any>
		? PluginOrMetadata extends (props: {
				config: any;
				api: any;
			}) => DefaultEditorPlugin<any, infer Metadata>
			? ExtractSharedStateFromMetadata<Metadata>
			: never
		: PluginOrMetadata extends NextEditorPluginMetadata
			? ExtractSharedStateFromMetadata<PluginOrMetadata>
			: never;
/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Extracts the actions definition from a plugin or its metadata.
 *
 * Similar to `ExtractPluginSharedState`, this type discerns whether it is dealing with a NextEditorPlugin instance
 * or its metadata. It then attempts to extract or infer the actions defined within. For a plugin instance, it looks
 * into the plugin's constructor function signature to infer the Metadata and subsequently extracts any actions defined.
 * If dealing with plugin metadata directly, it extracts the actions from there.
 *
 * @returns The actions definition if available, otherwise `never`.
 */
export type ExtractPluginActions<PluginOrMetadata> =
	PluginOrMetadata extends NextEditorPlugin<any, any>
		? PluginOrMetadata extends (props: {
				config: any;
				api: any;
			}) => DefaultEditorPlugin<any, infer Metadata>
			? ExtractActionsFromMetadata<Metadata>
			: never
		: PluginOrMetadata extends NextEditorPluginMetadata
			? ExtractActionsFromMetadata<PluginOrMetadata>
			: never;

/*****************************
 *														*
 *				MAPPED TYPES				*
 *														*
 ******************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Constructs a unified API object from a list of plugins, combining the optional injection APIs of each.
 *
 * This type recursively processes a list of plugins, extracting the name and metadata from each to construct
 * an `EditorOptionalInjectionAPI` for it. These APIs are then combined into a single object, allowing for
 * a comprehensive API interface that includes all provided plugins.
 *
 * @returns An object representing the combined API of all plugins in the list.
 *
 * @example
 * ```typescript
 * type MyEditorAPI = PublicPluginAPIFromPlugins<[PluginA, PluginB]>;
 * ```
 */
type PublicPluginAPIFromPlugins<PluginList extends NextEditorPlugin<any, any>[]> =
	PluginList extends [infer Head, ...infer Tail]
		? Head extends NextEditorPlugin<infer Name, infer Metadata>
			? EditorOptionalInjectionAPI<Name, Metadata> &
					PublicPluginAPIFromPlugins<Tail extends NextEditorPlugin<any, any>[] ? Tail : []>
			: {}
		: {};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Generates an object type mapping each plugin's name to its dependencies API, ensuring all dependencies are required.
 *
 * This type iterates over a list of plugins, extracting each plugin's name and associating it with its respective
 * dependencies API (`PluginDependenciesAPI`). The resulting object type requires all listed plugins to have their
 * dependencies satisfied, making this useful for constructing contexts where all plugin dependencies are mandatory.
 *
 * @returns An object type with a required dependencies API for each plugin.
 */
type RequiredPluginDependenciesAPI<PluginList extends NextEditorPlugin<any, any>[]> = {
	[Plugin in PluginList[number] as `${ExtractPluginName<Plugin>}`]: PluginDependenciesAPI<Plugin>;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Creates an object type mapping each plugin's name to its dependencies API, marking all dependencies as optional.
 *
 * Similar to `RequiredPluginDependenciesAPI`, but marks each plugin's dependencies API as optional. This is particularly
 * useful in scenarios where plugins may have optional functionality that should not enforce the presence of certain
 * dependencies.
 *
 * @returns An object type with an optional dependencies API for each plugin.
 */
type OptionalPluginDependenciesAPI<PluginList extends NextEditorPlugin<any, any>[]> = {
	[Plugin in PluginList[number] as `${ExtractPluginName<Plugin>}`]+?:
		| PluginDependenciesAPI<Plugin>
		| undefined;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Constructs a dependencies API object for a plugin itself, identified by its name, using its metadata.
 *
 * This type maps the plugin's name to its own `BasePluginDependenciesAPI` based on its metadata. It's useful for
 * creating a self-reference within the plugin's API, allowing the plugin to access its own shared state, actions,
 * and commands.
 *
 * @returns An object with the plugin's own dependencies API.
 */
type SelfPluginDependenciesAPI<Name extends string, Metadata extends NextEditorPluginMetadata> = {
	[Plugin in Name]: BasePluginDependenciesAPI<Metadata>;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Similar to `SelfPluginDependenciesAPI`, but marks the plugin's own dependencies API as optional.
 */
type SelfOptionalPluginDependenciesAPI<
	Name extends string,
	Metadata extends NextEditorPluginMetadata,
> = {
	[Plugin in Name]?: BasePluginDependenciesAPI<Metadata> | undefined;
};

/*************************
 *												*
 *	 PUBLIC TYPES					*
 *												*
 *************************/

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * ⚠️⚠️⚠️ Any breaking change here will have a massive impact across all Editor Plugin packages ⚠️⚠️⚠️
 *
 * The runtime implementation for NextEditorPlugin.
 *
 * All types prefixed `With` are being used in the EditorInjectionAPI.
 * Some infer operations required this intersection approach.
 *
 * @example
 * For instance, when a `sharedState` is declared in NextEditorPluginMetadata
 * then the plugin needs to implement a `getSharedState` function.
 *
 * @see WithSharedState
 * @see WithActions
 * @see WithCommands
 */
export type DefaultEditorPlugin<
	Name extends string,
	Metadata extends NextEditorPluginMetadata,
> = EditorPlugin &
	WithSharedState<Metadata> &
	WithActions<Metadata> &
	WithCommands<Metadata> & {
		name: Name;
	};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * ⚠️⚠️⚠️ Any breaking change here will have a massive impact across all Editor Plugin packages ⚠️⚠️⚠️
 *
 * If you are not from Editor Platform FE, you shouldn't be using or changing this.
 */
export interface NextEditorPluginMetadata {
	/**
	 * The real implementation will be infered by BasePluginDependenciesAPI and other
	 * internal types.
	 */
	readonly sharedState?: any;
	/**
	 * The real implementation will be infered by Preset internal types and  @see NextEditorPluginFunctionOptionalConfigDefinition
	 */
	readonly pluginConfiguration?: any;
	/**
	 * This is used only on compile time. There is no runtime implementation for the dependencies
	 * @see DependencyPlugin
	 */
	readonly dependencies?: DependencyPlugin[];
	/**
	 * @see NextEditorPluginActions
	 */
	readonly actions?: NextEditorPluginActions;
	/**
	 *
	 * @see NextEditorEditorCommands
	 */
	readonly commands?: NextEditorEditorCommands;
}

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * ⚠️⚠️⚠️ Any breaking change here will have a massive impact across all Editor Plugin packages ⚠️⚠️⚠️
 */
export type NextEditorPluginFunctionOptionalConfigDefinition<
	Name extends string,
	Metadata extends NextEditorPluginMetadata,
	Configuration = undefined,
> = (props: {
	config: Configuration;
	api?: {
		[Plugin in Name]: BasePluginDependenciesAPI<Metadata>;
	} & RequiredPluginDependenciesAPI<
		ExtractRequiredPlugins<[CorePlugin, ...ExtractPluginDependenciesFromMetadata<Metadata>]>
	> &
		OptionalPluginDependenciesAPI<
			ExtractOptionalPlugins<ExtractPluginDependenciesFromMetadata<Metadata>>
		>;
}) => DefaultEditorPlugin<Name, Metadata>;

/**
 * 📢 Public Type API: Helps Editor Plugin developers to defined optional dependencies for their plugins.
 *
 * You shouldn't be using this in any other place outside the `NextEditorPlugin`.
 *
 * @example
 * ```typescript
 * const toolbarPlugin: NextEditorPlugin<'toolbar', {
 *	dependencies: [
 *		OptionalPlugin<TablePlugin>,
 *		ListsPlugin,
 *	]
 * }>
 * ```
 *
 * Later on, this will be used by
 *
 * @see ExtractInjectionAPI - Optional dependencies will need can be undefined on runtime. So, a null-check is required
 */
export type OptionalPlugin<EditorPlugin extends NextEditorPlugin<any, any>> = EditorPlugin &
	OptionalPrivateProperty;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * @see NextEditorPluginMetadata
 */
export type DependencyPlugin =
	| OptionalPlugin<NextEditorPlugin<any, any>>
	| NextEditorPlugin<any, any>;

/**
 * 📢 Public Type API
 *
 * The base type for the entire Editor Plugin Ecosystem.
 *
 * The first parameter is the only one required,
 * it used to force the plugin to have a runtime string:
 *
 * ```typescript
 * const plugin: NextEditorPlugin<'hello'> = () => ({
 *	// This string should match the name declared in the `NextEditorPlugin`
 *	name: 'hello',
 * })
 *
 * // Later, this name is how other plugins will be able access your plugin API:
 * // api?.hello?.actions
 * ```
 *
 * @see NextEditorPluginMetadata for the second parameter
 */
export type NextEditorPlugin<
	Name extends string,
	Metadata extends NextEditorPluginMetadata = {},
> = Metadata extends NextEditorPluginMetadata
	? 'pluginConfiguration' extends keyof Metadata
		? NextEditorPluginFunctionOptionalConfigDefinition<
				Name,
				Metadata,
				Metadata['pluginConfiguration']
			>
		: NextEditorPluginFunctionOptionalConfigDefinition<Name, Metadata>
	: never;

type Unsubscribe = () => void;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 */
export type BasePluginDependenciesAPI<Metadata extends NextEditorPluginMetadata> = {
	sharedState: {
		currentState: () => ExtractPluginSharedState<Metadata> | undefined;
		onChange: (
			sub: (props: {
				nextSharedState: ExtractPluginSharedState<Metadata>;
				prevSharedState: ExtractPluginSharedState<Metadata>;
			}) => void,
		) => Unsubscribe;
	};
	actions: ExtractPluginActions<Metadata>;
	commands: ExtractCommandsFromMetadata<Metadata>;
};

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Type that defines a Editor API based on a NextEditorPlugin.
 *
 *
 * If you are not from Editor Platform FE, you shouldn't be using or changing this.
 */
export type PluginDependenciesAPI<Plugin extends NextEditorPlugin<any, any>> =
	Plugin extends NextEditorPlugin<any, infer Metadata>
		? BasePluginDependenciesAPI<Metadata>
		: never;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 *
 * Type to enable thats create a API based ona single plugin:
 *
 * - The plugin itself will become a required property
 * - Its optional dependencies will become a non-required property
 * - Its required dependencies will become a required property
 * - Core will be a required property
 */
export type EditorInjectionAPI<Name extends string, Metadata extends NextEditorPluginMetadata> = {
	core: PluginDependenciesAPI<CorePlugin>;
} & SelfPluginDependenciesAPI<Name, Metadata> &
	RequiredPluginDependenciesAPI<
		ExtractRequiredPlugins<ExtractPluginDependenciesFromMetadata<Metadata>>
	> &
	OptionalPluginDependenciesAPI<
		ExtractOptionalPlugins<ExtractPluginDependenciesFromMetadata<Metadata>>
	>;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 *	Helper type to enable thats create a fully optional API based ona single plugin:
 *
 * - The plugin itself will become a non-required property
 * - Its optional dependencies will become a non-required property
 * - Its required dependencies will become a non-required property
 * - Core will be a required property
 */
export type EditorOptionalInjectionAPI<
	Name extends string,
	Metadata extends NextEditorPluginMetadata,
> = {
	core: PluginDependenciesAPI<CorePlugin>;
} & SelfOptionalPluginDependenciesAPI<Name, Metadata> &
	OptionalPluginDependenciesAPI<
		ExtractRequiredPlugins<ExtractPluginDependenciesFromMetadata<Metadata>>
	> &
	OptionalPluginDependenciesAPI<
		ExtractOptionalPlugins<ExtractPluginDependenciesFromMetadata<Metadata>>
	>;

/**
 * 📢 Public Type API: Helps Editor Plugin developers to build the EditorInjectAPI type for their internal plugin development.
 *
 * You should use this API if you are:
 * - Working inside a EditorPlugin package, e.g.: `@atlaskit/editor-table-plugin`.
 * - Trying to use it to receive an API from the NextEditorPlugin argument.
 *
 * You should not use this API if you are:
 *
 * - Using it outside an EditorPlugin package
 * - Trying to use it to receive an API directly from EditorPresetBuilder
 *
 * This type will used the base plugin dependencies to build the type.
 * ```typescript
 *
 *	type PluginDog = NextEditorPlugin<'dog'>;
 *	type PluginBark = NextEditorPlugin<'bark', { dependencies: [PluginDog], actions: { doBark: () => void }}>;
 *
 *	type MyPlugin = NextEditorPlugin<'myPlugin',	{ dependencies: [PluginBark] }>;
 *	type MyAPI = ExtractInjectionAPI<MyPlugin>;
 *
 *	const somePluginInternalFunction = (api?: MyAPI) => {
 *	 api?.bark.actions.doBark();
 *	}
 * ```
 *
 * If the dependency is marked as OptionalPlugin then the API will return it as optional property too:
 *
 *```typescript
 *
 *	type PluginDog = NextEditorPlugin<'dog'>;
 *	type PluginBark = NextEditorPlugin<'bark', { dependencies: [PluginDog], actions: { doBark: () => void }}>;
 *
 *	type MyPlugin = NextEditorPlugin<'myPlugin',	{ dependencies: [OptionalPlugin<PluginBark>] }>;
 *	type MyAPI = ExtractInjectionAPI<MyPlugin>;
 *
 *	const somePluginInternalFunction = (api?: MyAPI) => {
 *	 // Now, you will need to do a null check
 *	 api?.bark?.actions.doBark();
 *	}
 * ```
 *
 * A `NextEditorPlugin` will receive an `api` argument that match with this helper type:
 * ```typescript
 *
 * type PluginDog = NextEditorPlugin<'dog'>;
 *
 * const dogPlugin: PluginDog = ({ api }) => {
 *	 type ReceivedAPI = typeof api;
 *	 type BuiltAPI = ExtractInjectionAPI<PluginDog>;
 *
 *	 type AssertTrue = BuiltAPI extends ReceivedAPI ? true : false;
 *	 return {
 *		 name: 'dog';
 *	 }
 * };
 * ```
 *
 * However, this is not compatible with the EditorPresetBuilder API
 * due to possibility some plugins maybe be not be available on runtime.
 *
 * ```typescript
 *
 * type PluginDog = NextEditorPlugin<'dog'>;
 *
 * const dogPlugin: PluginDog = ({ api }) => ({ name: 'dog' });
 * const preset = new EditorPresetBuilder()
 *	 .maybeAdd(dogPlugin, false);
 *
 * type BuiltAPI = ExtractInjectionAPI<typeof dogPlugin>;
 * type PresetAPI = ExtractPresetAPI<typeof preset>;
 *
 *
 * type AssertFalse = BuiltAPI extends PresetAPI ? true : false;
 * // If you need to match the API from a Preset, you should use `PublicPluginAPI`
 *
 * ```
 *
 * P.S.: This type will implicitly inject the CorePlugin as required attribute.
 */
export type ExtractInjectionAPI<Plugin extends NextEditorPlugin<any, any>> =
	Plugin extends NextEditorPlugin<infer Name, infer Metadata>
		? EditorInjectionAPI<Name, Metadata>
		: never;

/**
 * 📢 Public Type API: Helps Product developers to build the EditorInjectAPI type for external use in the product codebase.
 *
 * You may use more than one plugin:
 * ```typescript
 *	 PublicPluginAPI<[PluginDog, PluginCat]>
 * ```
 *
 * You should use this API if you are:
 * - Working inside a non EditorPlugin, e.g.: `@atlaskit/chat-ai-mate`.
 * - Trying to use it to receive an API directly from EditorPresetBuilder
 *
 * - Working
 *
 * The API type will consider all plugins as optional. That means,
 * you will need to do the null safe check when using the type implementation,
 *
 * ```typescript
 *
 *	type MyCustomEditorPlugin = NextEditorPlugin<'custom', { actions: { something: () => boolean } }>;
 *	const myPlugin: MyCustomEditorPlugin = () => ({ name: 'custom', actions: { something: () => true }});
 *
 *	type Props = {
 *		api?: PublicPluginAPI<[MyCustomEditorPlugin]>
 *	}
 *
 *	// There is no way to guarantee the API will have the plugin requested.
 *	// So, this will force developers to do the safe check.
 *	function useMyHook({ api }: Props) {
 *		api?.custom?.actions.something();
 *		return null;
 *	}
 * ```
 *
 * P.S.: This type will implicitly inject the CorePlugin as required attribute.
 */
export type PublicPluginAPI<
	MaybePlugin extends NextEditorPlugin<any, any>[] | NextEditorPlugin<any, any>,
> =
	MaybePlugin extends NextEditorPlugin<infer Name, infer Metadata>
		? EditorOptionalInjectionAPI<Name, Metadata>
		: PublicPluginAPIFromPlugins<
				MaybePlugin extends NextEditorPlugin<any, any>[] ? MaybePlugin : never
			>;
