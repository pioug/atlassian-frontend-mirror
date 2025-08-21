import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { DynamicBitArray } from './dynamic-bit-array';

export class NodeAnchorProvider {
	private cache = new WeakMap<object, string>();
	private count = BigInt(0);
	private existingPos = new DynamicBitArray();

	// We use pos to generate unique ids for each node at a specific position
	// This is to ensure the same ADF will always generate the same DOM initially
	public getOrGenerateId(node: PMNode, pos: number): string | null {
		if (this.cache.has(node)) {
			return this.cache.get(node) as string;
		}

		let idSuffix = '';
		if (this.existingPos.get(pos)) {
			idSuffix = `-${(this.count++).toString(36)}`;
		} else {
			this.existingPos.set(pos, true);
		}

		const anchorName = `--anchor-${node.type.name}-${pos}${idSuffix}`;
		this.cache.set(node, anchorName);

		return anchorName;
	}

	public getIdForNode(node: PMNode): string | undefined {
		return this.cache.get(node) || undefined;
	}
}

const nodeIdProviderMap = new WeakMap<EditorView, NodeAnchorProvider>();

// Get the NodeIdProvider for a specific EditorView instance.
// This allows access to the node ids anywhere.
export const getNodeIdProvider = (editorView: EditorView): NodeAnchorProvider => {
	if (!nodeIdProviderMap.has(editorView)) {
		const provider = new NodeAnchorProvider();
		nodeIdProviderMap.set(editorView, provider);
		return provider;
	}

	// This is based on the fact that editorView is a singleton.
	return nodeIdProviderMap.get(editorView) as NodeAnchorProvider;
};
