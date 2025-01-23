import { useRef } from 'react';
import React, { useMemo, useState, useEffect } from 'react';
import {
	MediaClientContext,
	MediaClientProvider,
	useFileHashes,
} from '@atlaskit/media-client-react';
import { Card, defaultImageCardDimensions, CardLoading } from '@atlaskit/media-card';
import { FilmstripView, type SizeEvent, type ScrollEvent } from './filmstripView';
import { generateIdentifierKey } from './utils/generateIdentifierKey';
import { type FilmstripProps } from './types';
import { isFileIdentifier } from '@atlaskit/media-client';

export function usePrevious<T>(value: T | undefined): T | undefined {
	const ref = useRef<T | undefined>();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}

const DeduplicatedFilmStripInternal = ({
	items,
	mediaClientConfig,
	shouldOpenMediaViewer,
	featureFlags,
	viewerOptions,
	testId = 'media-filmstrip',
	isLazy,
}: FilmstripProps) => {
	const [animate, setAnimate] = useState(false);
	const [offset, setOffset] = useState(0);

	const handleSize = ({ offset }: SizeEvent) => {
		setOffset(offset);
	};

	const handleScroll = ({ animate, offset }: ScrollEvent) => {
		setAnimate(animate);
		setOffset(offset);
	};

	const ids = useMemo(
		() => items.map(({ identifier }) => identifier).filter(isFileIdentifier),
		[items],
	);
	const fileHashes = useFileHashes(ids);

	const cards = useMemo(() => {
		// filters only the first item when encountering duplicated hashes
		const uniqueItems = items.filter(
			({ identifier }, i) =>
				identifier.mediaItemType !== 'file' ||
				!fileHashes[identifier.id] ||
				!items.some(
					(currentItem, currI) =>
						currentItem.identifier.mediaItemType === 'file' &&
						currI < i &&
						fileHashes[identifier.id] === fileHashes[currentItem.identifier.id],
				),
		);
		return uniqueItems.map((item) => {
			const key = generateIdentifierKey(item.identifier);

			if (!mediaClientConfig) {
				return (
					<CardLoading
						key={key}
						dimensions={defaultImageCardDimensions}
						interactionName="media-filmstrip-card-loading"
					/>
				);
			}

			const mediaViewerItems = shouldOpenMediaViewer
				? uniqueItems.map((item) => item.identifier)
				: undefined;

			return (
				<Card
					key={key}
					mediaClientConfig={mediaClientConfig}
					dimensions={defaultImageCardDimensions}
					useInlinePlayer={false}
					shouldOpenMediaViewer={shouldOpenMediaViewer}
					mediaViewerItems={mediaViewerItems}
					featureFlags={featureFlags}
					viewerOptions={viewerOptions}
					includeHashForDuplicateFiles
					isLazy={isLazy}
					{...item}
				/>
			);
		});
	}, [
		items,
		fileHashes,
		mediaClientConfig,
		shouldOpenMediaViewer,
		featureFlags,
		viewerOptions,
		isLazy,
	]);

	return (
		<FilmstripView
			animate={animate}
			offset={offset}
			onSize={handleSize}
			onScroll={handleScroll}
			testId={testId}
		>
			{cards}
		</FilmstripView>
	);
};

const EmptyFilmstripView = ({ items, testId }: FilmstripProps) => {
	return (
		<FilmstripView animate={false} offset={0} onSize={() => {}} onScroll={() => {}} testId={testId}>
			{items.map((item, i) => (
				<CardLoading
					key={generateIdentifierKey(item.identifier)}
					dimensions={defaultImageCardDimensions}
					interactionName="media-filmstrip-card-loading"
				/>
			))}
		</FilmstripView>
	);
};

export const DeduplicatedFilmStrip = (props: FilmstripProps) => (
	<MediaClientContext.Consumer>
		{(value) =>
			value ? (
				<DeduplicatedFilmStripInternal {...props} />
			) : !props.mediaClientConfig ? (
				<EmptyFilmstripView {...props} />
			) : (
				<MediaClientProvider clientConfig={props.mediaClientConfig}>
					<DeduplicatedFilmStripInternal {...props} />
				</MediaClientProvider>
			)
		}
	</MediaClientContext.Consumer>
);
