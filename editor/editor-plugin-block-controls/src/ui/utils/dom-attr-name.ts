import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const NODE_ANCHOR_ATTR_NAME = 'data-node-anchor';
export const NODE_NODE_TYPE_ATTR_NAME = 'data-prosemirror-node-name';

export const getAnchorAttrName = () => {
	if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
		return NODE_ANCHOR_ATTR_NAME;
	}

	return 'data-drag-handler-anchor-name';
};

export const getTypeNameAttrName = () => {
	if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
		return NODE_NODE_TYPE_ATTR_NAME;
	}

	return 'data-drag-handler-node-type';
};

const isHeadingElement = (element: Element) => {
	const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
	return headingTags.includes(element.tagName);
};

// This function replicates the behavior of getNodeTypeWithLevel by returning the same value.
export const getTypeNameFromDom = (element?: Element | null): string => {
	if (!element) {
		return '';
	}

	const nodeType = element?.getAttribute(NODE_NODE_TYPE_ATTR_NAME);

	if (!nodeType) {
		return '';
	}

	if (isHeadingElement(element)) {
		switch (element.tagName) {
			case 'H1':
				return 'heading-1';
			case 'H2':
				return 'heading-2';
			case 'H3':
				return 'heading-3';
			case 'H4':
				return 'heading-4';
			case 'H5':
				return 'heading-5';
			case 'H6':
				return 'heading-6';
		}
	}
	return nodeType;
};
