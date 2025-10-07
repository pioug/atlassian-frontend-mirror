import type { UfoPlugin } from './ufoPluginType';

export const ufoPlugin: UfoPlugin = () => ({
	name: 'ufo',

	pmPlugins() {
		const isSSR = Boolean(process?.env?.REACT_SSR);

		if (isSSR) {
			// This plugin is not needed in SSR environments - and uses apis which are not available in SSR internally
			return [];
		}

		// This Plugin is not currently used as it leads to too high a level of abortions (due to the current TTAI timing being long, and users starting click before TTAI completes).
		// This can be reconsidered if we meaningfully reduce our TTAI (ie. <7 seconds)
		return [];

		// return [
		// 	{
		// 		name: 'traceUFOInteractionOnFirstInteraction',
		// 		plugin: traceUFOInteractionOnFirstInteraction,
		// 	},
		// ];
	},
});
