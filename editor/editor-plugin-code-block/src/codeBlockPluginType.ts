import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Command, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CompositionPlugin } from '@atlaskit/editor-plugin-composition';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

import type { CodeBlockOptions } from './types';

type CodeBlockDependencies = [
	DecorationsPlugin,
	CompositionPlugin,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
];

export type CodeBlockPlugin = NextEditorPlugin<
	'codeBlock',
	{
		pluginConfiguration: CodeBlockOptions | undefined;
		dependencies: CodeBlockDependencies;
		actions: {
			insertCodeBlock: (inputMethod: INPUT_METHOD) => Command;
		};
	}
>;
