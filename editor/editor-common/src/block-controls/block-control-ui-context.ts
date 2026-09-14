import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';
import { createContextToken, type ContextToken } from '@atlaskit/editor-ui-control-model/types';

export type BlockControlUIContextAncestor = {
	depth: number;
	pos: number;
	type: { name: string };
};

export type BlockControlUIContextNode = {
	ancestors: readonly BlockControlUIContextAncestor[];
	depth: number;
	node: ProseMirrorNode;
	parentType?: string;
	pos: number;
	type: { name: string };
};

export type BlockControlUIContextActiveNode = BlockControlUIContextNode & {
	rootPos?: number;
	rootType?: { name: string };
};

/** Context supplied to controls rendered on a block-controls surface. */
export type BlockControlUIContext = {
	activeNode?: BlockControlUIContextActiveNode;
	rootNode: BlockControlUIContextNode;
	targetNode: BlockControlUIContextNode;
};

export const BLOCK_CONTROL_UI_CONTEXT: ContextToken<BlockControlUIContext> =
	createContextToken<BlockControlUIContext>('block-control-ui');
