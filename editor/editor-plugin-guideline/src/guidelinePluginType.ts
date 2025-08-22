import type { DisplayGuideline, GuidelinePluginState } from '@atlaskit/editor-common/guideline';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

type GuidelinePluginDependencies = [WidthPlugin];

type GuidelinePluginSharedState = GuidelinePluginState | null;

type GuidelinePluginActions = {
	displayGuideline: DisplayGuideline;
};

export type GuidelinePlugin = NextEditorPlugin<
	'guideline',
	{
		actions: GuidelinePluginActions;
		dependencies: GuidelinePluginDependencies;
		sharedState: GuidelinePluginSharedState;
	}
>;
