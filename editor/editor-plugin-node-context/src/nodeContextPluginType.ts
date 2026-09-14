import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

export type EditorViewportPoint = {
	x: number;
	y: number;
};

export type EditorViewportRect = {
	height: number;
	width: number;
	x: number;
	y: number;
};

export type EditorNodeContext = {
	adf: JSONNode;
	localId?: string;
	nodeType: string;
	pos: number;
};

export type NodeContextPlugin = NextEditorPlugin<
	'nodeContext',
	{
		actions: {
			/** Resolve viewport coordinates to the nearest meaningful editor node. */
			getNodeContextAtCoords: (point: EditorViewportPoint) => EditorNodeContext | undefined;
			/** Resolve meaningful editor nodes intersecting a viewport rectangle. */
			getNodeContextsInViewportRect: (rect: EditorViewportRect) => EditorNodeContext[];
		};
	}
>;
