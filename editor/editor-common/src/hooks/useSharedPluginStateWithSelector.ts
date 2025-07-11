import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';

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

/**
 *
 * Directly map object values
 *
 * @private
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

// When we use the `useSharedPluginStateWithSelector` example: `useSharedPluginStateWithSelector(api, ['width'], selector)`
// it will re-render every time the component re-renders as the array "['width']" is seen as an update.
// This hook is used to prevent re-renders due to this.
function useStaticPlugins<T>(plugins: T[]): T[] {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => plugins, []);
}

/**
 *
 * ⚠️⚠️⚠️ This is a debounced hook ⚠️⚠️⚠️
 * If the plugins you are listening to generate multiple shared states while the user is typing,
 * your React Component will get only the last one.
 *
 * Used to return the current plugin state of input dependencies.
 *
 * @example
 * Example in plugin:
 *
 * ```typescript
 * function selector(states: NamedPluginStatesFromInjectionAPI<API, ['dog']>) {
 *  return {
 *   title: states.dogState?.title,
 *  }
 * }
 *
 * function ExampleContent({ api }: Props) {
 *   const { title } = useSharedPluginStateWithSelector(
 *     api,
 *     ['dog'],
 *     selector
 *   )
 *   return <p>{ title }</p>
 * }
 *
 * ```
 *
 * @param injectionApi Plugin injection API from `NextEditorPlugin`
 * @param plugins Plugin names to get the shared plugin state for
 * @param selector A function that takes the shared states of the plugins and returns a subset of a plugin state.
 * @returns A corresponding object, the keys are names of the plugin with `State` appended,
 * the values are the shared state exposed by that plugin.
 */
export function useSharedPluginStateWithSelector<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	API extends EditorInjectionAPI<any, any>,
	PluginNames extends ExtractPluginNames<API>,
	PluginStates extends NamedPluginStatesFromInjectionAPI<API, PluginNames>,
	SelectorResult,
>(
	injectionApi: API | null | undefined,
	plugins: PluginNames[],
	selector: (states: PluginStates) => SelectorResult,
): SelectorResult {
	const pluginNames = useStaticPlugins(plugins);
	const selectorRef = useRef<(states: PluginStates) => SelectorResult>(selector);

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

	return useSharedPluginStateInternal(namedExternalPlugins, selectorRef);
}

function useSharedPluginStateInternal<P extends NamedPluginKeys, SelectorResult, PluginStates>(
	externalPlugins: P,
	selector: MutableRefObject<(states: PluginStates) => SelectorResult>,
): SelectorResult {
	const refStates = useRef<PluginStates>(
		mapValues(externalPlugins, (value) => value?.sharedState.currentState()) as PluginStates,
	);

	const [pluginStates, setPluginState] = useState<SelectorResult>(() =>
		selector.current(refStates.current as PluginStates),
	);
	const mounted = useRef(false);

	useLayoutEffect(() => {
		const debouncedPluginStateUpdate = debounce(() => {
			setPluginState((currentPluginStates) => {
				const nextStates = selector.current({ ...refStates.current });

				if (shallowEqual(nextStates, currentPluginStates)) {
					return currentPluginStates;
				}

				return nextStates;
			});
		});

		// If we re-render this hook due to a change in the external
		// plugins we need to push a state update to ensure we have
		// the most current state.
		if (mounted.current) {
			refStates.current = mapValues(externalPlugins, (value) =>
				value?.sharedState.currentState(),
			) as PluginStates;
			debouncedPluginStateUpdate();
		}

		const unsubs = Object.entries(externalPlugins).map(([pluginKey, externalPlugin]) => {
			return externalPlugin?.sharedState.onChange(({ nextSharedState, prevSharedState }) => {
				if (prevSharedState === nextSharedState) {
					return;
				}
				(refStates.current as Record<string, unknown>)[pluginKey] = nextSharedState;
				debouncedPluginStateUpdate();
			});
		});
		mounted.current = true;

		return () => {
			refStates.current = {} as unknown as PluginStates;
			unsubs.forEach((cb) => cb?.());
		};
	}, [externalPlugins, selector]);

	return pluginStates;
}

function shallowEqual(objA: unknown, objB: unknown): boolean {
	if (objA === objB) {
		return true;
	}

	if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		if ((objA as Record<string, unknown>)[key] !== (objB as Record<string, unknown>)[key]) {
			return false;
		}
	}

	return true;
}
