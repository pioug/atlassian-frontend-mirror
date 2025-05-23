import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import { type BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import { type EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export interface BreakoutPluginState {
	breakoutNode: ContentNodeWithPos | undefined;
}

export interface BreakoutPluginOptions {
	allowBreakoutButton?: boolean;
}

export type BreakoutPluginDependencies = [
	WidthPlugin,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<BlockControlsPlugin>,
	OptionalPlugin<UserIntentPlugin>,
];

export type BreakoutPlugin = NextEditorPlugin<
	'breakout',
	{
		pluginConfiguration: BreakoutPluginOptions | undefined;
		dependencies: BreakoutPluginDependencies;
		sharedState: Partial<BreakoutPluginState>;
	}
>;
