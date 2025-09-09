import { useLayoutEffect, useMemo, useRef } from 'react';

import debounce from 'lodash/debounce';

import type {
	BasePluginDependenciesAPI,
	EditorInjectionAPI,
	ExtractInjectionAPI,
	ExtractPluginSharedState,
	NextEditorPlugin,
	PluginDependenciesAPI,
} from '../types/next-editor-plugin';

type NamedPluginStatesFromInjectionAPI<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends ExtractInjectionAPI<NextEditorPlugin<any, any>>,
	PluginNames extends string | number | symbol,
> = Readonly<{
	[K in PluginNames as `${K extends string ? K : never}State`]: API[K] extends  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Ignored via go/ees005
		| BasePluginDependenciesAPI<any>
		| undefined
		? ReturnType<API[K]['sharedState']['currentState']>
		: never;
}>;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractPluginNames<API extends EditorInjectionAPI<any, any>> = keyof API;

type NamedPluginKeys = Readonly<{
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[stateName: string]: PluginDependenciesAPI<NextEditorPlugin<any, any>> | undefined;
}>;

type NamedPluginStates<P extends NamedPluginKeys> = {
	[K in keyof P]: P[K] extends PluginDependenciesAPI<infer Plugin> | undefined
		? ExtractPluginSharedState<Plugin>
		: never;
};

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

type Cleanup = () => void;

type Options = {
	disabled?: boolean;
};

/**
 *
 * ⚠️⚠️⚠️ This is a debounced hook ⚠️⚠️⚠️
 * If the plugins you are listening to generate multiple shared states while the user is typing,
 * your React Component will get only the last one.
 *
 * Used to run effects on changes in editor state - similar to `useSharedPluginState` except this
 * is for reacting to state changes so does not cause re-renders. The effect callback passed will be called
 * on initialisation and when the state changes (with the latest callback we are provided).
 *
 * Example in plugin:
 *
 * ```typescript
 * function ExampleContent({ api }: Props) {
 *   const pluginStateCallback = useCallback(( { dogState, exampleState } ) => {
 *       // Use as necessary ie. fire analytics or network requests
 *       console.log(dogState, exampleState)
 *   }, [])
 *   usePluginStateEffect(
 *     api,
 *     ['dog', 'example'],
 *     pluginStateCallback
 *   )
 *   return <p>Content</p>
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
 * @param effect A callback, the parameter is a corresponding object, the keys are names of the plugin with `State` appended,
 * the values are the shared state exposed by that plugin. This effect fires when the state changes and runs the most recent callback passed.
 * If the callback changes the effect is not re-run - it is still recommended however to wrap your effect in `useCallback`,
 * You can return a function from your effect to call any cleanup activities which will be called on unmount and when `editorApi` changes.
 */
export function usePluginStateEffect<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends EditorInjectionAPI<any, any>,
	PluginNames extends ExtractPluginNames<API>,
>(
	injectionApi: API | null | undefined,
	plugins: PluginNames[],
	effect: (states: NamedPluginStatesFromInjectionAPI<API, PluginNames>) => Cleanup | void,
	options: Options = {},
): void {
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

	usePluginStateEffectInternal(namedExternalPlugins, effect, options);
}

function usePluginStateEffectInternal<P extends NamedPluginKeys>(
	externalPlugins: P,
	effect: (states: NamedPluginStates<P>) => Cleanup | void,
	options: Options = {},
): void {
	const refStates = useRef<NamedPluginStates<P> | undefined>();
	const cleanup = useRef<Cleanup | void>();
	const latestEffect = useRef<typeof effect | undefined>(effect);

	// We should store the latest effect in a reference so it is more intuitive to the user
	// and we are not causing a memory leak by having references to old state.
	useLayoutEffect(() => {
		if (options.disabled) {
			return;
		}

		latestEffect.current = debounce(effect);
		return () => {
			latestEffect.current = undefined;
		};
	}, [effect, options.disabled]);

	useLayoutEffect(() => {
		if (options.disabled) {
			return;
		}

		// Update the reference for this plugin and activate the effect
		refStates.current = mapValues(externalPlugins, (value) => value?.sharedState.currentState());
		cleanup.current = latestEffect.current?.(refStates.current);

		const unsubs = Object.entries(externalPlugins).map(([pluginKey, externalPlugin]) =>
			externalPlugin?.sharedState.onChange(({ nextSharedState, prevSharedState }) => {
				if (prevSharedState !== nextSharedState && refStates.current) {
					// Update the reference for this plugin and activate the effect
					refStates.current[pluginKey as keyof typeof externalPlugins] = nextSharedState;
					cleanup.current = latestEffect.current?.(refStates.current);
				}
			}),
		);

		return () => {
			refStates.current = undefined;
			unsubs.forEach((cb) => cb?.());
			cleanup.current?.();
		};
		// Do not re-run if the `effect` changes - this is not expected with `useEffect` or similar hooks
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [externalPlugins, options.disabled]);
}
