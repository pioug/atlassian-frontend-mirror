import React from 'react';

import ReactDOM from 'react-dom';

import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { Identifier, MediaClientConfig } from '@atlaskit/media-client';
import { MediaViewer } from '@atlaskit/media-viewer';

import { isExternalMedia } from '../../ui/toolbar/utils';

interface RenderMediaViewerProps {
	items?: Identifier[];
	mediaClientConfig: MediaClientConfig;
	onClose: () => void;
	selectedNodeAttrs: MediaADFAttrs;
}

const getIdentifier = (attrs: MediaADFAttrs): Identifier => {
	if (isExternalMedia(attrs)) {
		return {
			mediaItemType: 'external-image',
			dataURI: attrs.url,
		};
	} else {
		const { id, collection = '' } = attrs;
		return {
			id,
			mediaItemType: 'file',
			collectionName: collection,
		};
	}
};

export const RenderMediaViewer = ({
	mediaClientConfig,
	onClose,
	selectedNodeAttrs,
	items = [],
}: RenderMediaViewerProps) => {
	const identifier = getIdentifier(selectedNodeAttrs);
	const collectionName = isExternalMedia(selectedNodeAttrs) ? '' : selectedNodeAttrs.collection;

	return ReactDOM.createPortal(
		<MediaViewer
			collectionName={collectionName}
			items={items}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			mediaClientConfig={mediaClientConfig!}
			selectedItem={identifier}
			onClose={onClose}
		/>,
		document.body,
	);
};
