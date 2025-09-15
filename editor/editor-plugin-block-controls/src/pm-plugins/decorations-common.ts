import ReactDOM from 'react-dom';
import uuid from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const TYPE_DROP_TARGET_DEC = 'drop-target-decoration';
export const TYPE_HANDLE_DEC = 'drag-handle';
export const TYPE_NODE_DEC = 'node-decoration';

export const NESTED_DEPTH = 100;
export const getNodeAnchor = (node: PMNode) => {
	const handleId = ObjHash.getForNode(node);
	return `--node-anchor-${node.type.name}-${handleId}`;
};

export const getNodeTypeWithLevel = (node: PMNode) => {
	const subType = node.attrs.level ? `-${node.attrs.level}` : '';
	return node.type.name + subType;
};

class ObjHash {
	static caching = new WeakMap();

	static getForNode(node: PMNode) {
		if (this.caching.has(node)) {
			return this.caching.get(node);
		}
		const uniqueId = uuid();
		this.caching.set(node, uniqueId);
		return uniqueId;
	}
}

export const unmountDecorations = (
	nodeViewPortalProviderAPI: PortalProviderAPI,
	selector: string,
	key: string,
) => {
	// Removing decorations manually instead of using native destroy function in prosemirror API
	// as it was more responsive and causes less re-rendering
	const decorationsToRemove = document.querySelectorAll(`[${selector}="true"]`);
	decorationsToRemove.forEach((el) => {
		ReactDOM.unmountComponentAtNode(el);
	});
};
