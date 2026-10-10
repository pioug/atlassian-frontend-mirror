import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { Command } from '@atlaskit/editor-common/types/command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition/compositionPluginType';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { CodeBlockState } from './pm-plugins/main-state';
import type { CodeBlockPluginOptions } from './types';

type CodeBlockDependencies = [
	DecorationsPlugin,
	CompositionPlugin,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<BlockMenuPlugin>,
	OptionalPlugin<SelectionPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
];

export type CodeBlockPlugin = NextEditorPlugin<
	'codeBlock',
	{
		actions: {
			insertCodeBlock: (inputMethod: INPUT_METHOD) => Command;
		};
		dependencies: CodeBlockDependencies;
		pluginConfiguration: CodeBlockPluginOptions | undefined;
		sharedState:
			| {
					copyButtonHoverNode: PMNode;
					formatCodeErrors: CodeBlockState['formatCodeErrors'];
					pendingFormats: CodeBlockState['pendingFormats'];
			  }
			| undefined;
	}
>;
