import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type ConnectivityPlugin = NextEditorPlugin<
	'connectivity',
	{
		sharedState: { mode: 'offline' | 'online' };
	}
>;

export type PluginState = {
	mode: Mode;
};

export type Mode = 'offline' | 'online';
