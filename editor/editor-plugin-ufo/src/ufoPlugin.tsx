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

		if (expValEquals('platform_editor_abort_ufo_on_user_interaction', 'isEnabled', true)) {
			return [
				{
					name: 'traceUFOInteractionOnFirstInteraction',
					plugin: traceUFOInteractionOnFirstInteraction,
				},
			];
		}

		return [];
	},
});
