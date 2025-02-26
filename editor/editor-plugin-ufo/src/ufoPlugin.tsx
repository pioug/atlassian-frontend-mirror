import { fg } from '@atlaskit/platform-feature-flags';

import { abortUFOMeasurementOnFirstUserInteraction } from './pm-plugins/abortUFOMeasurementOnFirstUserInteraction';
import type { UfoPlugin } from './ufoPluginType';

const isSSR = Boolean(process.env.REACT_SSR);

export const ufoPlugin: UfoPlugin = () => ({
	name: 'ufo',

	pmPlugins() {
		// We don't need to use this code for Serve Side Rendering
		if (isSSR || !fg('platform_editor_abort_ttvc_on_user_interaction')) {
			return [];
		}

		return [
			{
				name: 'abortUFOMeasurementOnFirstUserInteraction',
				plugin: abortUFOMeasurementOnFirstUserInteraction,
			},
		];
	},
});
