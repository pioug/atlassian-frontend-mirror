import React from 'react';
import ReactDOM from 'react-dom';

import type { MediaADFAttrs } from '@atlaskit/adf-schema/media';
import type { Identifier } from '@atlaskit/media-client/identifier';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import MediaViewer from '@atlaskit/media-viewer/media-viewer-loader';
import type { MediaViewerExtensions } from '@atlaskit/media-viewer/types';

import { isExternalMedia } from '../../ui/toolbar/utils';

interface RenderMediaViewerProps {
	extensions?: MediaViewerExtensions;
	fallbackMediaNameFetcher?: (id: string) => Promise<string>;
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
	extensions,
	fallbackMediaNameFetcher,
}: RenderMediaViewerProps): React.ReactPortal => {
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
			extensions={extensions}
			fallbackMediaNameFetcher={fallbackMediaNameFetcher}
		/>,
		document.body,
	);
};
