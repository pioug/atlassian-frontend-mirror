import CardLoader from '../src/card/cardLoader';
import React, { useState, useEffect, useMemo } from 'react';
import { type MediaClientConfig } from '@atlaskit/media-client';
import {
	generateItemWithBinaries,
	type ItemWithBinaries,
	type GeneratedItemWithBinaries,
} from '@atlaskit/media-test-data';

import { MainWrapper } from '../example-helpers';
import { createMockedMediaClientProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';

type UseGenerateItemsWithBinariesState = [
	GeneratedItemWithBinaries[],
	GeneratedItemWithBinaries[],
	GeneratedItemWithBinaries[],
];

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const dummyMediaClientConfig = {} as MediaClientConfig;

const processedItemsPromise = [
	generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
	generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
	generateItemWithBinaries.workingAudioWithoutRemotePreview.mp3Sonata(),
	generateItemWithBinaries.workingVideo.videoFire(),
	generateItemWithBinaries.workingVideo.videoTeacup(),
];

const processingItemsPromise = [
	generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
	generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
	generateItemWithBinaries.workingAudioWithoutRemotePreview.mp3Sonata(),
	generateItemWithBinaries.workingVideo.videoFire(),
	generateItemWithBinaries.workingVideo.videoTeacup(),
];

const uploadingItemsPromise = [
	generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
	generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
	generateItemWithBinaries.workingAudioWithoutRemotePreview.mp3Sonata(),
	generateItemWithBinaries.workingVideo.videoFire(),
	generateItemWithBinaries.workingVideo.videoTeacup(),
];

const useGenerateItemsWithBinaries = () => {
	const [items, setItems] = useState<UseGenerateItemsWithBinariesState>([[], [], []]);

	useEffect(() => {
		Promise.all([
			Promise.all(processedItemsPromise),
			Promise.all(processingItemsPromise),
			Promise.all(uploadingItemsPromise),
		]).then(setItems);
	}, []);

	return items;
};

const usePrepeMediaState = () => {
	const [processedItems, processingItems, uploadingItems] = useGenerateItemsWithBinaries();

	const initialItemsWithBinaries = useMemo(
		() => [...processedItems, ...processingItems].map(([item]) => item),
		[processedItems, processingItems],
	);

	const allItems = [...processedItems, ...processingItems, ...uploadingItems];

	const { MockedMediaClientProvider, processItem, uploadItem } = useMemo(
		() => createMockedMediaClientProviderWithBinaries({ initialItemsWithBinaries }),
		[initialItemsWithBinaries],
	);

	useEffect(() => {
		const simulateProcess = async (item: ItemWithBinaries) => {
			processItem(item, 0);
			await sleep(500);
			processItem(item, 1);
		};

		const simulateUpload = async (item: ItemWithBinaries) => {
			for (let i = 0; i <= 10; i++) {
				uploadItem(item, i / 10);
				await sleep(500);
			}
			simulateProcess(item);
		};

		processingItems.forEach(([itemWithBinaries]) => simulateProcess(itemWithBinaries));
		uploadingItems.forEach(([itemWithBinaries]) => simulateUpload(itemWithBinaries));
	}, [processItem, processingItems, uploadItem, uploadingItems]);

	return { allItems, MockedMediaClientProvider };
};

export default (): React.JSX.Element => {
	const { allItems, MockedMediaClientProvider } = usePrepeMediaState();

	return (
		<MainWrapper developmentOnly>
			<MockedMediaClientProvider>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					{allItems.map(([, identifier], i) => (
						<CardLoader
							key={i}
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							shouldOpenMediaViewer
							mediaViewerItems={allItems.map(([, identifier]) => identifier)}
							useInlinePlayer
							disableOverlay
						/>
					))}
				</div>
			</MockedMediaClientProvider>
		</MainWrapper>
	);
};
