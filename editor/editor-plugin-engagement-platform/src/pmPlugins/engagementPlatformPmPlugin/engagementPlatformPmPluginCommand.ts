import type { EditorCommand } from '@atlaskit/editor-common/types';

import { engagementPlatformPmPluginKey } from './engagementPlatformPmPluginKey';
import type { EngagementPlatformPmPluginCommand, EngagementPlatformPmPluginTrMeta } from './types';

export const engagementPlatformPmPluginCommand =
	(command: EngagementPlatformPmPluginCommand): EditorCommand =>
	({ tr }) => {
		const currentMeta: EngagementPlatformPmPluginTrMeta = tr.getMeta(
			engagementPlatformPmPluginKey,
		) ?? { commands: [] };

		const newMeta: EngagementPlatformPmPluginTrMeta = {
			...currentMeta,
			commands: [...currentMeta.commands, command],
		};

		return tr.setMeta(engagementPlatformPmPluginKey, newMeta);
	};
