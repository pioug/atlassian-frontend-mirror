import type {
	DisplayGuideline,
	GuidelinePluginState,
} from '@atlaskit/editor-common/guideline/types';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width/width-plugin-type';

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
