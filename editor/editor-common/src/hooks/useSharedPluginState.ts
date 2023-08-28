import { useLayoutEffect, useMemo, useState } from 'react';

import type {
  ExtractPluginSharedState,
  NextEditorPlugin,
  PluginDependenciesAPI,
  PublicPluginAPI,
} from '../types/next-editor-plugin';

type NamedPluginStatesFromInjectionAPI<
  API extends PublicPluginAPI<any> | undefined,
  PluginList extends string[],
> = Readonly<{
  [K in PluginList[number] as `${K}State`]: API extends PublicPluginAPI<any>
    ? API[K] extends PluginDependenciesAPI<infer Plugin> | undefined
      ? ExtractPluginSharedState<Plugin> | undefined
      : never
    : never;
}>;

type NamedPluginDependencies<
  API extends PublicPluginAPI<any> | undefined,
  PluginList extends string[],
> = Readonly<{
  [K in PluginList[number] as `${K}State`]: API extends PublicPluginAPI<any>
    ? API[K] extends PluginDependenciesAPI<any> | undefined
      ? API[K] | undefined
      : never
    : never;
}>;

type ExtractPluginNames<API extends PublicPluginAPI<any>> =
  API extends PublicPluginAPI<any> ? keyof API : never;

type NamedPluginKeys = Readonly<{
  [stateName: string]:
    | PluginDependenciesAPI<NextEditorPlugin<any, any>>
    | undefined;
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

/**
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
 * @returns A corresponding object, the keys are names of the plugin with `State` appended,
 * the values are the shared state exposed by that plugin.
 */
export function useSharedPluginState<
  Plugins extends NextEditorPlugin<any, any>[],
  PluginNames extends ExtractPluginNames<PublicPluginAPI<Plugins>>[],
>(
  injectionApi: PublicPluginAPI<Plugins> | undefined,
  plugins: PluginNames,
): NamedPluginStatesFromInjectionAPI<typeof injectionApi, PluginNames> {
  const pluginNames = useStaticPlugins(plugins);

  // Create a memoized object containing the named plugins
  const namedExternalPlugins = useMemo(
    () =>
      pluginNames.reduce(
        (acc, pluginName) => ({
          ...acc,
          [`${pluginName}State`]: injectionApi?.[pluginName],
        }),
        {} as NamedPluginDependencies<typeof injectionApi, PluginNames>,
      ),
    [injectionApi, pluginNames],
  );

  return useSharedPluginStateInternal(namedExternalPlugins);
}

function useSharedPluginStateInternal<P extends NamedPluginKeys>(
  externalPlugins: P,
): NamedPluginStates<P> {
  const [pluginStates, setPluginState] = useState<NamedPluginStates<P>>(
    mapValues(externalPlugins, (value) => value?.sharedState.currentState()),
  );

  useLayoutEffect(() => {
    const unsubs = Object.entries(externalPlugins).map(
      ([pluginKey, externalPlugin]) => {
        return externalPlugin?.sharedState.onChange(
          ({ nextSharedState, prevSharedState }) => {
            if (prevSharedState === nextSharedState) {
              return;
            }
            setPluginState((currentPluginStates) => ({
              ...currentPluginStates,
              [pluginKey]: nextSharedState,
            }));
          },
        );
      },
    );

    return () => {
      unsubs.forEach((cb) => cb?.());
    };
    // Do not re-render due to state changes, we only need to check this when
    // setting up the initial subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPlugins]);

  return pluginStates;
}
