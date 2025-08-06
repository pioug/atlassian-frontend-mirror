import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';

export type BlockMenuPlugin = NextEditorPlugin<
	'blockMenu',
	{
		dependencies: [OptionalPlugin<BlockControlsPlugin>, OptionalPlugin<UserIntentPlugin>];
	}
>;
