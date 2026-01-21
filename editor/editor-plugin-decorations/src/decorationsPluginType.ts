import type { NextEditorPlugin, EditorCommand } from '@atlaskit/editor-common/types';

import type { DecorationState, HoverDecorationHandler, removeDecoration } from './pm-plugins/main';

export type HoverDecorationProps = {
	add: boolean;
	className?: string;
};

export type HoverDecorationCommand = ({ add, className }: HoverDecorationProps) => EditorCommand;

export type DecorationsPlugin = NextEditorPlugin<
	'decorations',
	{
		actions: {
			hoverDecoration: HoverDecorationHandler;
			removeDecoration: typeof removeDecoration;
		};
		commands: {
			hoverDecoration?: HoverDecorationCommand;
			removeDecoration?: () => EditorCommand;
		};
		sharedState: DecorationState;
	}
>;
