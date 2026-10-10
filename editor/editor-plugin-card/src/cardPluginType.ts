import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import type { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type {
	CardPluginActions,
	CardReplacementInputMethod,
} from '@atlaskit/editor-common/card/types';
import type { CardAppearance } from '@atlaskit/editor-common/provider-factory/card-provider';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { InlineCommentPluginState } from '@atlaskit/editor-plugin-annotation/pm-plugins/types';
import type { BasePlugin } from '@atlaskit/editor-plugin-base/basePluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar/floatingToolbarPluginType';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid/gridPluginType';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width/width-plugin-type';

import type { CardPluginOptions, CardPluginState } from './types';

// Dummpy type of AnnotationPlugin
// This is used to avoid editor universal preset's inferred type maximum length error
// TODO: ED-26961 - Remove this when the issue is fixed
type DummyAnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		actions: {
			setInlineCommentDraftState: (isDraft: boolean, inputMethod: INPUT_METHOD) => Command;
		};
		sharedState: InlineCommentPluginState;
	}
>;

export type CardPluginDependencies = [
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	WidthPlugin,
	DecorationsPlugin,
	GridPlugin,
	FloatingToolbarPlugin,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<SelectionPlugin>,
	OptionalPlugin<DummyAnnotationPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
	OptionalPlugin<BasePlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
	OptionalPlugin<UserIntentPlugin>,
];

export type CardPlugin = NextEditorPlugin<
	'card',
	{
		actions: CardPluginActions;
		commands: {
			/** EditorCommand form of `queueCardsFromRange`. Prefer over the action. */
			queueCardsFromRange: (
				from: number,
				to: number,
				source: CardReplacementInputMethod,
				analyticsAction?: ACTION,
				normalizeLinkText?: boolean,
				sourceEvent?: UIAnalyticsEvent | null,
				appearance?: CardAppearance,
			) => EditorCommand;
		};
		dependencies: CardPluginDependencies;
		pluginConfiguration: CardPluginOptions | undefined;
		sharedState: CardPluginState | null;
	}
>;
