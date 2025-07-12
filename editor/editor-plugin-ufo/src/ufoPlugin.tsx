import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { traceUFOInteractionOnFirstInteraction } from './pm-plugins/traceUFOInteractionOnFirstInteraction';
import type { UfoPlugin } from './ufoPluginType';

export const ufoPlugin: UfoPlugin = () => ({
	name: 'ufo',

	pmPlugins() {
		const isSSR = Boolean(process?.env?.REACT_SSR);

		if (isSSR) {
			// This plugin is not needed in SSR environments - and uses apis which are not available in SSR internally
			return [];
		}

		if (expValEquals('cc_editor_interactions_trigger_traceufointeraction', 'cohort', 'control')) {
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
