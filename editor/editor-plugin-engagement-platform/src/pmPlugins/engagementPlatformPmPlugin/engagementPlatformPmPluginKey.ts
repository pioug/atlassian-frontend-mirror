import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { EngagementPlatformPluginState } from '../../engagementPlatformPluginType';

export const engagementPlatformPmPluginKey = new PluginKey<EngagementPlatformPluginState>(
	'engagementPlatformPmPlugin',
);
