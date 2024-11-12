import React, { useEffect, useMemo } from 'react';
import { type Identifier } from '@atlaskit/media-client';
import { MediaViewer as MediaViewerNextGen } from '../media-viewer';
import { type MediaMessage, type MediaViewerProps } from './types';
import { isSameIdentifier } from '../utils';
import { isFileIdentifier } from '@atlaskit/media-client';
import { withMediaClient } from '@atlaskit/media-client-react';
import type { MediaViewerWithMediaClientConfigProps } from './types';

const ensureCollectionName = (identifier: Identifier, collectionName: string) =>
	isFileIdentifier(identifier)
		? {
				...identifier,
				collectionName: identifier.collectionName || collectionName,
			}
		: identifier;

const normaliseItems = (
	items: Array<Identifier>,
	selectedItem: Identifier,
	collectionName: string,
) => {
	const selectedItemWithCollectionName = ensureCollectionName(selectedItem, collectionName);

	let selectedIndex = -1;

	const itemsWithCollectionName = items.map((item, index) => {
		if (isSameIdentifier(item, selectedItemWithCollectionName)) {
			selectedIndex = index;
		}
		return ensureCollectionName(item, collectionName);
	});

	const itemsWithSelectedItem =
		selectedIndex === -1 ? [selectedItem, ...itemsWithCollectionName] : itemsWithCollectionName;

	return {
		items: itemsWithSelectedItem,
		selectedItem: selectedItemWithCollectionName,
	};
};

// TODO: This component will be removed in https://product-fabric.atlassian.net/browse/CXP-2722

export const MediaViewerBase = ({
	featureFlags,
	onClose,
	selectedItem,
	collectionName,
	items,
	extensions,
	contextId,
	viewerOptions,
}: MediaViewerProps) => {
	const { items: normalisedItems, selectedItem: normalisedSelectedItem } = useMemo(
		() => normaliseItems(items, selectedItem, collectionName),
		[items, selectedItem, collectionName],
	);

	/**
	 * Sends a notification for when MediaViewer opens or closes. We do so by
	 * posting a message to a window of any target origin (i.e. '*') so please
	 * ensure that we are NOT including any sensitive data in the message.
	 * Read more details here: https://product-fabric.atlassian.net/browse/MEX-2566
	 */
	useEffect(() => {
		const openingMsg: MediaMessage = {
			source: 'media',
			event: 'mediaViewerOpened',
		};
		parent.postMessage(openingMsg, '*');

		return () => {
			const closingMsg: MediaMessage = {
				source: 'media',
				event: 'mediaViewerClosed',
			};
			parent.postMessage(closingMsg, '*');
		};
	}, []);

	return (
		<MediaViewerNextGen
			selectedItem={normalisedSelectedItem}
			onClose={onClose}
			items={normalisedItems}
			featureFlags={featureFlags}
			extensions={extensions}
			contextId={contextId}
			viewerOptions={viewerOptions}
		/>
	);
};

// Can't export in a single line. Typescript struggles to recognize the component signature in the error boundary test file ./media-viewer-error-boundary.test.tsx
// export const MediaViewerWithMediaClient = withMediaClient(MediaViewerBase)
export const MediaViewerWithMediaClient = (props: MediaViewerWithMediaClientConfigProps) => {
	const ViewerComponent = React.useMemo(() => {
		return withMediaClient(MediaViewerBase);
	}, []);

	return <ViewerComponent {...props} />;
};
