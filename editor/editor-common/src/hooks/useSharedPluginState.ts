import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import debounce from 'lodash/debounce';

import type {
	BasePluginDependenciesAPI,
	EditorInjectionAPI,
	ExtractInjectionAPI,
	ExtractPluginSharedState,
	NextEditorPlugin,
	NextEditorPluginMetadata,
	PluginDependenciesAPI,
} from '../types/next-editor-plugin';

export type NamedPluginStatesFromInjectionAPI<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends ExtractInjectionAPI<NextEditorPlugin<any, any>>,
	PluginNames extends string | number | symbol,
> = Readonly<{
	[K in PluginNames as `${K extends string ? K : never}State`]: API[K] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Ignored via go/ees005
		| BasePluginDependenciesAPI<any>
		| undefined
		? Exclude<API[K], undefined> extends BasePluginDependenciesAPI<infer Metadata>
			? Metadata extends NextEditorPluginMetadata
				? ExtractPluginSharedState<Metadata> | undefined
				: never
			: never
		: never;
}>;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractPluginNames<API extends EditorInjectionAPI<any, any>> = keyof API;

type NamedPluginKeys = Readonly<{
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[stateName: string]: PluginDependenciesAPI<NextEditorPlugin<any, any>> | undefined;
}>;

type NamedPluginStates<P extends NamedPluginKeys> = Readonly<{
	[K in keyof P]: P[K] extends PluginDependenciesAPI<infer Plugin> | undefined
		? ExtractPluginSharedState<Plugin>
		: never;
}>;

/**
 *
 * Directly map object values
 *
 * @param object The object to transform
 * @param mapFunction The function to map an old value to new one
 * @returns Object with the same key but transformed values
 *
 */
function mapValues<T extends object, Result>(
	object: T,
	mapFunction: (value: T[keyof T]) => Result,
): { [Key in keyof T]: Result } {
	return Object.entries(object).reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: mapFunction(value),
		}),
		{} as { [Key in keyof T]: Result },
	);
}

// When we use the `useSharedPluginState` example: `useSharedPluginState(api, ['width'])`
// it will re-render every time the component re-renders as the array "['width']" is seen as an update.
// This hook is used to prevent re-renders due to this.
function useStaticPlugins<T>(plugins: T[]): T[] {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => plugins, []);
}

type Options = {
	disabled?: boolean;
};

/**
 *
 * NOTE: Generally you want to use `usePluginStateWithSelector` over this which behaves similarly
 * but selects a slice of the state which is more performant.
 *
 * ⚠️⚠️⚠️ This is a debounced hook ⚠️⚠️⚠️
 * If the plugins you are listening to generate multiple shared states while the user is typing,
 * your React Component will get only the last one.
 *
 * Usually, for UI updates, you may need only the last state. But, if you have a specific scenario requiring you to access all states,
 * do not use this hook. Instead, you can subscribe directly to the plugin sharedState API:
 *
 * ```typescript
 *
 * function ExampleSpecialCase({ api }: Props) {
 *   const [dogState, setDogState] = React.useState(null);
 *   useEffect(() => {
 *     const unsub = api.dog.sharedState.onChange(({ nextSharedState, prevSharedState }) => {
 *        setDogState(nextSharedState);
 *     });
 *
 *     return unsub;
 *   }, [api]);
 *
 *   useEffect(() => {
 *    someCriticalAndWeirdUseCase(dogState);
 *
 *   }, [dogState]);
 *
 *   return null;
 * }
 *
 * ```
 *
 * Used to return the current plugin state of
 * input dependencies
 *
 * Example in plugin:
 *
 * ```typescript
 * function ExampleContent({ api }: Props) {
 *   const { dogState, exampleState } = useSharedPluginState(
 *     api,
 *     ['dog', 'example']
 *   )
 *   return <p>{ dogState.title } { exampleState.description }</p>
 * }
 *
 * const examplePlugin: NextEditorPlugin<'example', { dependencies: [typeof pluginDog] }> = ({ api }) => {
 *   return {
 *     name: 'example',
 *     contentComponent: () =>
 *       <ExampleContent
 *         api={api}
 *         />
 *   }
 * }
 * ```
 *
 * @param injectionApi Plugin injection API from `NextEditorPlugin`
 * @param plugins Plugin names to get the shared plugin state for
 * @param options The useSharedPluginState options
 * @returns A corresponding object, the keys are names of the plugin with `State` appended,
 * the values are the shared state exposed by that plugin.
 */
export function useSharedPluginState<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends EditorInjectionAPI<any, any>,
	PluginNames extends ExtractPluginNames<API>,
>(
	injectionApi: API | null | undefined,
	plugins: PluginNames[],
	options?: Options,
): NamedPluginStatesFromInjectionAPI<API, PluginNames> {
	const pluginNames = useStaticPlugins(plugins);

	// Create a memoized object containing the named plugins
	const namedExternalPlugins = useMemo(
		() =>
			pluginNames.reduce(
				(acc, pluginName) => ({
					...acc,
					[`${String(pluginName)}State`]: injectionApi?.[pluginName],
				}),
				{} as NamedPluginStatesFromInjectionAPI<API, PluginNames>,
			),
		[injectionApi, pluginNames],
	);

	return useSharedPluginStateInternal(namedExternalPlugins, options);
}

function useSharedPluginStateInternal<P extends NamedPluginKeys>(
	externalPlugins: P,
	options: Options = {},
): NamedPluginStates<P> {
	const [pluginStates, setPluginState] = useState<NamedPluginStates<P>>(
		mapValues(externalPlugins, (value) =>
			options.disabled ? undefined : value?.sharedState.currentState(),
		),
	);
	const refStates = useRef<Record<string, unknown>>({});
	const mounted = useRef(false);

	useLayoutEffect(() => {
		if (options.disabled) {
			return;
		}

		const debouncedPluginStateUpdate = debounce(() => {
			setPluginState((currentPluginStates) => ({
				...currentPluginStates,
				...refStates.current,
			}));
		});

		// If we re-render this hook due to a change in the external
		// plugins we need to push a state update to ensure we have
		// the most current state.
		if (mounted.current) {
			refStates.current = mapValues(externalPlugins, (value) => value?.sharedState.currentState());
			debouncedPluginStateUpdate();
		}

		const unsubs = Object.entries(externalPlugins).map(([pluginKey, externalPlugin]) => {
			return externalPlugin?.sharedState.onChange(({ nextSharedState, prevSharedState }) => {
				if (prevSharedState === nextSharedState) {
					return;
				}
				refStates.current[pluginKey] = nextSharedState;
				debouncedPluginStateUpdate();
			});
		});
		mounted.current = true;

		return () => {
			refStates.current = {};
			unsubs.forEach((cb) => cb?.());
		};
		// Do not re-render due to state changes, we only need to check this when
		// setting up the initial subscription.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [externalPlugins, options.disabled]);

	return pluginStates;
}
