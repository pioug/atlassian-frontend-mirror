import React, { useEffect, useMemo } from 'react';
import { type Identifier } from '@atlaskit/media-client';
import { MediaViewerV2 as MediaViewerNextGenV2 } from '../v2/media-viewer-v2';
import { MediaViewer as MediaViewerNextGen } from '../media-viewer';
import { type MediaMessage, type MediaViewerProps } from './types';
import { isSameIdentifier } from '../utils';
import { isFileIdentifier } from '@atlaskit/media-client';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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

export const MediaViewer = ({
	featureFlags,
	onClose,
	mediaClient,
	selectedItem,
	collectionName,
	items,
	extensions,
	contextId,
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

	return getBooleanFF('platform.media-experience.media-viewer-v2_hgsii') ? (
		<MediaViewerNextGenV2
			selectedItem={normalisedSelectedItem}
			onClose={onClose}
			items={normalisedItems}
			featureFlags={featureFlags}
			extensions={extensions}
			contextId={contextId}
		/>
	) : (
		<MediaViewerNextGen
			mediaClient={mediaClient}
			selectedItem={normalisedSelectedItem}
			onClose={onClose}
			items={normalisedItems}
			featureFlags={featureFlags}
			extensions={extensions}
			contextId={contextId}
		/>
	);
};
