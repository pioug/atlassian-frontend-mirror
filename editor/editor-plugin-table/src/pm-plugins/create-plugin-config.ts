import type { PermittedLayoutsDescriptor, PluginConfig } from '../types';

export const pluginConfig = (config: PluginConfig = {}) => {
	return config.advanced
		? {
				allowBackgroundColor: true,
				allowColumnResizing: true,
				allowHeaderColumn: true,
				allowHeaderRow: true,
				allowMergeCells: true,
				allowNumberColumn: true,
				permittedLayouts: 'all' as PermittedLayoutsDescriptor,
				allowControls: true,
				...config,
			}
		: config;
};
