import { useEffect, useMemo, useState } from 'react';

import type {
  ExtractPluginSharedState,
  NextEditorPlugin,
  NextEditorPluginMetadata,
  PluginDependenciesAPI,
  PluginInjectionAPI,
} from '../types/next-editor-plugin';

type NamedPluginStatesFromInjectionAPI<
  API extends PluginInjectionAPI<any, any> | undefined,
  PluginList extends string[],
> = Readonly<{
  [K in PluginList[number] as `${K}State`]: API extends PluginInjectionAPI<
    any,
    any
  >
    ? API['dependencies'][K] extends
        | PluginDependenciesAPI<infer Plugin>
        | undefined
      ? ExtractPluginSharedState<Plugin> | undefined
      : never
    : never;
}>;

type NamedPluginDependencies<
  API extends PluginInjectionAPI<any, any> | undefined,
  PluginList extends string[],
> = Readonly<{
  [K in PluginList[number] as `${K}State`]: API extends PluginInjectionAPI<
    any,
    any
  >
    ? API['dependencies'][K] extends PluginDependenciesAPI<any> | undefined
      ? API['dependencies'][K] | undefined
      : never
    : never;
}>;

type ExtractPluginNames<
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
> = keyof PluginInjectionAPI<Name, Metadata>['dependencies'];

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
 * const examplePlugin: NextEditorPlugin<'example', { dependencies: [typeof pluginDog] }> = (_, api) => {
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
  Name extends string,
  Metadata extends NextEditorPluginMetadata,
  PluginNames extends ExtractPluginNames<Name, Metadata>[],
>(
  injectionApi: PluginInjectionAPI<Name, Metadata> | undefined,
  plugins: PluginNames,
): NamedPluginStatesFromInjectionAPI<typeof injectionApi, PluginNames> {
  // Create a memoized object containing the named plugins
  const namedExternalPlugins = useMemo(
    () =>
      plugins.reduce(
        (acc, pluginName) => ({
          ...acc,
          [`${pluginName}State`]: injectionApi?.dependencies[pluginName],
        }),
        {} as NamedPluginDependencies<typeof injectionApi, PluginNames>,
      ),
    [injectionApi?.dependencies, plugins],
  );

  return useSharedPluginStateInternal(namedExternalPlugins);
}

function useSharedPluginStateInternal<P extends NamedPluginKeys>(
  externalPlugins: P,
): NamedPluginStates<P> {
  const [state, setState] = useState<NamedPluginStates<P>>(
    mapValues(externalPlugins, (value) => value?.sharedState.currentState()),
  );

  useEffect(() => {
    const unsubscribeListeners = Object.entries(externalPlugins).map(
      ([pluginKey, externalPlugin]) =>
        externalPlugin?.sharedState.onChange(
          ({ nextSharedState, prevSharedState }) => {
            if (prevSharedState === nextSharedState) {
              return;
            }

            setState((state) => ({ ...state, [pluginKey]: nextSharedState }));
          },
        ),
    );

    return () => {
      unsubscribeListeners.forEach((cb) => cb?.());
    };
  }, [externalPlugins]);

  return state;
}
