import type { NextEditorPlugin, EditorCommand } from '@atlaskit/editor-common/types';
import { type NodeType } from '@atlaskit/editor-prosemirror/model';

import type { DecorationState, HoverDecorationHandler, removeDecoration } from './pm-plugins/main';

export type HoverDecorationProps = {
	add: boolean;
	className?: string;
	nodeType: NodeType | Array<NodeType>;
};

export type HoverDecorationCommand = ({
	nodeType,
	add,
	className,
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
