export const CACHE_MAP_KEY =
	'__conditionalHooksFactory_conditionCacheMap_dont_modify_this_manually_unless_you_want_react_to_blow_up';
declare global {
	// A global WeakMap to cache the initial condition result per hook instance when the gate is enabled
	var __conditionalHooksFactory_conditionCacheMap_dont_modify_this_manually_unless_you_want_react_to_blow_up: WeakMap<
		(...args: never[]) => unknown,
		boolean
	>;
}
globalThis[CACHE_MAP_KEY] =
	globalThis[CACHE_MAP_KEY] || new WeakMap<(...args: never[]) => unknown, boolean>();
