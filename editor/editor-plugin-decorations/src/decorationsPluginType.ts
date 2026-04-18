import type { NextEditorPlugin, EditorCommand } from '@atlaskit/editor-common/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { DecorationState, HoverDecorationHandler, removeDecoration } from './pm-plugins/main';

export type HoverDecorationProps = {
	add: boolean;
	className?: string;
	selection?: Selection;
};

export type HoverDecorationCommand = ({
	add,
	className,
	selection,
}: HoverDecorationProps) => EditorCommand;

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
