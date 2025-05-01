import { useState, useCallback, useMemo } from 'react';

import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import type { EditorInjectionAPI } from '../../types/next-editor-plugin';
import { usePluginStateEffect } from '../usePluginStateEffect';
import type { NamedPluginStatesFromInjectionAPI } from '../useSharedPluginState';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractPluginNames<API extends EditorInjectionAPI<any, any>> = keyof API extends string
	? keyof API
	: never;

/**
 * This is designed to iterate through an object to get the path of its result
 * based on separation via "."
 *
 * Example:
 * ```typescript
 * type Test = { deepObject: { value: number } };
 * // Type should be `"deepObject" | "deepObject.value"`
 * type Result = NestedKeys<Test>;
 * ```
 */
type NestedKeys<T> = {
	[K in keyof T]: T[K] extends object
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			T[K] extends any[] // Array should return `K` - but also gets recognised as an "object" - so handle it separately
			? K extends string
				? K
				: never
			: T[K] extends object
				? K extends string
					? K | `${K}.${NestedKeys<T[K]>}`
					: never
				: never
		: K extends string
			? K
			: never;
}[keyof T];

/**
 * This is designed to iterate through a path of an object to get the type of its result
 * based on separation via "."
 *
 * Example:
 * ```typescript
 * type Test = { deepObject: { value: number } }
 * // Type should be `number`
 * type Result = Path<Test, 'deepObject.value'>
 * ```
 */
type Path<T, K extends string> = K extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? Path<T[Key], Rest>
		: never
	: K extends keyof T
		? T[K]
		: never;

type Options = {
	disabled?: boolean;
};

/**
 *
 * ⚠️⚠️⚠️ This is a debounced hook ⚠️⚠️⚠️
 * If the plugins you are listening to generate multiple shared states while the user is typing,
 * your React Component will get only the last one.
 *
 * Used to return the current plugin state of input dependencies.
 * It will recursively retrieve a slice of the state using a "." to separate
 * parts of the state.
 *
 * Example:
 *
 * ```typescript
 * 	const pluginA: NextEditorPlugin<
		'pluginA',
		{
			sharedState: { deepObj: { value: number | undefined } };
		}
	>
 * ```
 * You can use `const value = useSharedPluginStateSelector(api, 'pluginA.deepObj.value')` to retrieve the value
 *
 * Example in plugin:
 *
 * ```typescript
 * function ExampleContent({ api }: Props) {
 *   const title = useSharedPluginStateSelector(api, 'dog.title')
 *   return <p>{ title } { exampleState.description }</p>
 * }
 *
 * const examplePlugin: NextEditorPlugin<'example', { dependencies: [typeof pluginDog] }> = ({ api }) => {
 *   return {
 *     name: 'example',
 *     contentComponent: () => <ExampleContent api={api} />
 *   }
 * }
 * ```
 *
 * NOTE: If you pass an invalid path, `undefined` will be returned
 *
 * @param api
 * @param plugin
 * @param options
 * @returns
 */
export function useSharedPluginStateSelector<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends EditorInjectionAPI<any, any>,
	PluginName extends ExtractPluginNames<API>,
	SharedState extends ReturnType<
		Exclude<API[PluginName], null | undefined>['sharedState']['currentState']
	>,
	Key extends NestedKeys<Exclude<SharedState, null | undefined>>,
	Result extends Path<Exclude<SharedState, null | undefined>, Key>,
>(
	api: API | undefined | null,
	plugin: `${PluginName}.${Key}`,
	options: Options = {},
): Result | undefined {
	const transformer = useCallback(
		(pluginState: NamedPluginStatesFromInjectionAPI<API, PluginName>) => {
			const [pluginName, ...properties] = plugin.split('.');
			if (!pluginState || properties?.length === 0) {
				return undefined;
			}
			return get(
				pluginState?.[`${pluginName as PluginName}State` as keyof typeof pluginState],
				properties,
			);
		},
		[plugin],
	);
	const pluginNameArray = useMemo(() => {
		const [pluginName] = plugin.split('.');
		return [pluginName as PluginName];
	}, [plugin]);

	const initialState = useMemo(() => {
		if (options.disabled) {
			return;
		}

		const [pluginName] = plugin.split('.');
		return transformer({
			[`${pluginName}State`]: api?.[pluginName]?.sharedState.currentState(),
		} as NamedPluginStatesFromInjectionAPI<API, PluginName>);
	}, [plugin, api, options.disabled, transformer]);

	return useSharedPluginStateSelectorInternal(
		api,
		pluginNameArray,
		transformer,
		initialState,
		options,
	);
}

function useSharedPluginStateSelectorInternal<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends EditorInjectionAPI<any, any>,
	PluginNames extends ExtractPluginNames<API>,
	Result,
>(
	api: API | undefined | null,
	plugins: PluginNames[],
	transformer: (inputStates: NamedPluginStatesFromInjectionAPI<API, PluginNames>) => Result,
	initialState: Result | undefined,
	options: Options = {},
): Result | undefined {
	const [selectedPluginState, setSelectedPluginState] = useState<Result | undefined>(
		() => initialState,
	);

	usePluginStateEffect(
		api,
		plugins,
		(pluginStates) => {
			// `pluginStates`: This is the same type through inference - but typescript doesn't recognise them as they are computed slightly differently
			const transformedValue = transformer(
				pluginStates as unknown as NamedPluginStatesFromInjectionAPI<API, PluginNames>,
			);
			if (!isEqual(transformedValue, selectedPluginState)) {
				setSelectedPluginState(() => transformedValue);
			}
		},
		options,
	);
	return selectedPluginState;
}
