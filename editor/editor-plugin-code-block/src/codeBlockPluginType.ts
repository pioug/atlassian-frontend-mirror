import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { CodeBlockPluginOptions } from './types';

type CodeBlockDependencies = [
	DecorationsPlugin,
	CompositionPlugin,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
];

export type CodeBlockPlugin = NextEditorPlugin<
	'codeBlock',
	{
		pluginConfiguration: CodeBlockPluginOptions | undefined;
		dependencies: CodeBlockDependencies;
		sharedState:
			| {
					copyButtonHoverNode: PMNode;
			  }
			| undefined;
		actions: {
			insertCodeBlock: (inputMethod: INPUT_METHOD) => Command;
		};
	}
>;
