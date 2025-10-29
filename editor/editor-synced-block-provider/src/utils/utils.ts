import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { SyncBlockData } from '../common/types';

import type { PAGE_TYPE } from './ari';

export const convertSyncBlockPMNodeToSyncBlockData = (node: PMNode): SyncBlockData => {
	return {
		blockInstanceId: node.attrs.localId,
		content: node.content.toJSON(),
		resourceId: node.attrs.resourceId,
	};
};

export const isBlogPageType = (pageType: PAGE_TYPE): boolean => {
	return pageType === 'blogpost';
};
