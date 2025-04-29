import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';

import { TablePlugin } from '../../tablePluginType';
import { TableSharedStateInternal } from '../../types';

type Options = {
	disabled?: boolean;
};

/**
 * **This hook is only for internal use and should not be used outside of the table plugin.**
 *
 * Hook to select a value from the internal table plugin state.
 * This is a wrapper around `useSharedPluginStateSelector` to provide access to the entire
 * `TableSharedStateInternal` type. Since tables plugin has a lot of internal state that is not
 * exposed via the `TableSharedState` type, we need to use this hook to access it in a type safe way.
 *
 * @param api The editor API
 * @param key Key of TableSharedStateInternal to select
 * @returns
 */
export const useInternalTablePluginStateSelector = <K extends keyof TableSharedStateInternal>(
	api: ExtractInjectionAPI<TablePlugin> | undefined,
	key: K,
	options?: Options,
): TableSharedStateInternal[K] | undefined => {
	// Need to disable the eslint rule here because the key is for the TableSharedStateInternal type
	// and we are using it as a string to access the value in the useSharedPluginStateSelector
	// which is typed only for the public TableSharedState type.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const value = useSharedPluginStateSelector(api, `table.${key}` as any, options) as
		| TableSharedStateInternal[K]
		| undefined;
	return value;
};
