import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { applyChange } from './pm-plugins/transforms';

export type ContextPanelPlugin = NextEditorPlugin<
	'contextPanel',
	{
		actions: { applyChange: typeof applyChange };
		sharedState: { contents: React.ReactNode[] | undefined } | undefined;
	}
>;
