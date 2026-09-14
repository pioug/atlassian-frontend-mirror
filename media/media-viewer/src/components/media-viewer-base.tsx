import React, { useEffect, useMemo } from 'react';

import { type Identifier } from '@atlaskit/media-client';
import { isFileIdentifier } from '@atlaskit/media-client';

import { MediaViewer as MediaViewerNextGen } from '../media-viewer';
import { isSameIdentifier } from '../utils/isSameIdentifier';
import { type MediaMessage, type MediaViewerProps } from './types';

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
	fallbackMediaNameFetcher,
}: MediaViewerProps): React.JSX.Element => {
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
			fallbackMediaNameFetcher={fallbackMediaNameFetcher}
		/>
	);
};
