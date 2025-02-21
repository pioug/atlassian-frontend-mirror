import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar';

import type { AlignmentPluginState } from './pm-plugins/types';

export type AlignmentPluginDependencies = [
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<SelectionToolbarPlugin>,
];

export type AlignmentPlugin = NextEditorPlugin<
	'alignment',
	{
		sharedState: AlignmentPluginState | undefined;
		dependencies: AlignmentPluginDependencies;
	}
>;
