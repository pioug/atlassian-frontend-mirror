import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls/blockControlsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline/guidelinePluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width/width-plugin-type';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import type { ActiveGuidelineKey } from './pm-plugins/resizing-plugin';

export interface BreakoutPluginState {
	activeGuidelineKey: ActiveGuidelineKey | undefined;
	breakoutNode: ContentNodeWithPos | undefined;
}

export interface BreakoutPluginOptions {
	allowBreakoutButton?: boolean;
	appearance?: EditorAppearance;
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
		dependencies: BreakoutPluginDependencies;
		pluginConfiguration: BreakoutPluginOptions | undefined;
		sharedState: Partial<BreakoutPluginState>;
	}
>;
