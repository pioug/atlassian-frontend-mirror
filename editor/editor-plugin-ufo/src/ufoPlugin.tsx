import { fg } from '@atlaskit/platform-feature-flags';

import { disableTTVCOnFirstUserInteraction } from './pm-plugins/disableTTVCOnFirstUserInteraction';
import type { UfoPlugin } from './ufoPluginType';

export const ufoPlugin: UfoPlugin = () => ({
	name: 'ufo',

	pmPlugins() {
		if (!fg('platform_editor_abort_ttvc_on_user_interaction')) {
			return [];
		}

		return [
			{
				name: 'disableTTVCOnFirstUserInteraction',
				plugin: disableTTVCOnFirstUserInteraction,
			},
		];
	},
});
