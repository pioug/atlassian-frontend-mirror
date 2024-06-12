// for documentation ONLY

import { type GroupBase, type OptionsOrGroups } from 'react-select';

export interface ReactSelectAsyncProps<
	Option = unknown,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	/**
	 * The default set of options to show before the user starts searching. When
	 * set to `true`, the results for loadOptions('') will be autoloaded.
	 */
	defaultOptions?: OptionsOrGroups<Option, Group> | boolean;
	/**
	 * If cacheOptions is truthy, then the loaded data will be cached. The cache
	 * will remain until `cacheOptions` changes value.
	 */
	cacheOptions?: any;
	/**
	 * Function that returns a promise, which is the set of options to be used
	 * once the promise resolves.
	 */
	loadOptions?: (
		inputValue: string,
		callback: (options: OptionsOrGroups<Option, Group>) => void,
	) => Promise<OptionsOrGroups<Option, Group>> | void;
	/**
	 * Will cause the select to be displayed in the loading state, even if the
	 * Async select is not currently waiting for loadOptions to resolve
	 */
	isLoading?: boolean;
}

export default function ertHackForPopper(_: ReactSelectAsyncProps) {}
