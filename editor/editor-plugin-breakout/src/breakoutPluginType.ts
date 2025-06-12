import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { type BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import { type EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { ActiveGuidelineKey } from './pm-plugins/resizing-plugin';

export interface BreakoutPluginState {
	breakoutNode: ContentNodeWithPos | undefined;
	activeGuidelineKey: ActiveGuidelineKey | undefined;
}

export interface BreakoutPluginOptions {
	allowBreakoutButton?: boolean;
}

export type BreakoutPluginDependencies = [
	WidthPlugin,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<BlockControlsPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<UserIntentPlugin>,
	OptionalPlugin<GuidelinePlugin>,
	OptionalPlugin<AnalyticsPlugin>,
];

export type BreakoutPlugin = NextEditorPlugin<
	'breakout',
	{
		pluginConfiguration: BreakoutPluginOptions | undefined;
		dependencies: BreakoutPluginDependencies;
		sharedState: Partial<BreakoutPluginState>;
	}
>;
