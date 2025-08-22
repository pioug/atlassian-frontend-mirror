import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { CardPluginActions } from '@atlaskit/editor-common/card';
import type { NextEditorPlugin, OptionalPlugin, Command } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { InlineCommentPluginState } from '@atlaskit/editor-plugin-annotation';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

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
];

export type CardPlugin = NextEditorPlugin<
	'card',
	{
		actions: CardPluginActions;
		dependencies: CardPluginDependencies;
		pluginConfiguration: CardPluginOptions | undefined;
		sharedState: CardPluginState | null;
	}
>;
