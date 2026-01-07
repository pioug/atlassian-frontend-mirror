import type { PluginToolbarComponentConfig } from '@atlaskit/editor-common/toolbar';

import type { InsertBlockPluginOptions, ToolbarInsertBlockButtonsConfig } from '../../types';

/**
 * Resolves toolbar configuration from plugin options, handling backward compatibility
 * and providing sensible defaults.
 */
export const resolveToolbarConfig = (
	options: InsertBlockPluginOptions,
): ToolbarInsertBlockButtonsConfig => {
	// Handle backward compatibility: toolbarShowPlusInsertOnly
	if (options.toolbarShowPlusInsertOnly) {
		return {
			codeBlock: { enabled: false },
			emoji: { enabled: false },
			insert: { enabled: true },
			layout: { enabled: false },
			media: { enabled: false },
			mention: { enabled: false },
			table: { enabled: false },
			taskList: { enabled: false },
		};
	}

	if (!options.toolbarButtons) {
		// disable code block by default if there's no toolbarButtons options provided, e.g on full page editor
		return {
			codeBlock: { enabled: false },
			emoji: { enabled: true },
			insert: { enabled: true },
			layout: { enabled: true },
			media: { enabled: true },
			mention: { enabled: true },
			table: { enabled: true },
			taskList: { enabled: true },
		};
	}

	const defaults: PluginToolbarComponentConfig = { enabled: false, showAt: 'lg' };

	const resolveGroupConfig = (
		groupConfig?: PluginToolbarComponentConfig,
	): PluginToolbarComponentConfig => {
		return {
			enabled: groupConfig?.enabled ?? defaults.enabled,
			showAt: groupConfig?.showAt ?? defaults.showAt,
		};
	};

	return {
		codeBlock: resolveGroupConfig(options.toolbarButtons?.codeBlock),
		emoji: resolveGroupConfig(options.toolbarButtons?.emoji),
		insert: resolveGroupConfig(options.toolbarButtons?.insert),
		layout: resolveGroupConfig(options.toolbarButtons?.layout),
		media: resolveGroupConfig(options.toolbarButtons?.media),
		mention: resolveGroupConfig(options.toolbarButtons?.mention),
		table: resolveGroupConfig(options.toolbarButtons?.table),
		taskList: resolveGroupConfig(options.toolbarButtons?.taskList),
	};
};
