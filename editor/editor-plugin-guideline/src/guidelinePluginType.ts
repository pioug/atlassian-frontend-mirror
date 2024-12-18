import type { DisplayGuideline, GuidelinePluginState } from '@atlaskit/editor-common/guideline';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

export type GuidelinePlugin = NextEditorPlugin<
	'guideline',
	{
		dependencies: [WidthPlugin];
		sharedState: GuidelinePluginState | null;
		actions: {
			displayGuideline: DisplayGuideline;
		};
	}
>;
