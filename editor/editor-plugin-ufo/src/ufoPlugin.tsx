import { traceUFOInteractionOnFirstInteraction } from './pm-plugins/traceUFOInteractionOnFirstInteraction';
import type { UfoPlugin } from './ufoPluginType';

export const ufoPlugin: UfoPlugin = () => ({
	name: 'ufo',

	pmPlugins() {
		const isSSR = Boolean(process.env.REACT_SSR);

		if (isSSR) {
			// This plugin is not needed in SSR environments - and uses apis which are not available in SSR internally
			return [];
		}

		return [
			{
				name: 'traceUFOInteractionOnFirstInteraction',
				plugin: traceUFOInteractionOnFirstInteraction,
			},
		];
	},
});
