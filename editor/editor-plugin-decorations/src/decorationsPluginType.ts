import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { DecorationState, HoverDecorationHandler, removeDecoration } from './pm-plugins/main';

export type DecorationsPlugin = NextEditorPlugin<
	'decorations',
	{
		sharedState: DecorationState;
		actions: {
			hoverDecoration: HoverDecorationHandler;
			removeDecoration: typeof removeDecoration;
		};
	}
>;
