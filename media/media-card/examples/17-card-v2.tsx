import CardV2Loader from '../src/card/v2/cardV2Loader';
import React from 'react';
import { MediaClientConfig } from '@atlaskit/media-client';
import {
  generateItemWithBinaries,
  ItemWithBinaries,
  GeneratedItemWithBinaries,
} from '@atlaskit/media-test-data';

import { MainWrapper } from '../example-helpers';
import { createMockedMediaClientProviderWithBinaries } from '../src/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';

const dummyMediaClientConfig = {} as MediaClientConfig;

const processedItems: GeneratedItemWithBinaries[] = [
  generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
  generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
  generateItemWithBinaries.workingAudioWithoutRemotePreview.mp3Sonata(),
  generateItemWithBinaries.workingVideo.videoFire(),
  generateItemWithBinaries.workingVideo.videoTeacup(),
];

const processingItems: GeneratedItemWithBinaries[] = [
  generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
  generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
  generateItemWithBinaries.workingAudioWithoutRemotePreview.mp3Sonata(),
  generateItemWithBinaries.workingVideo.videoFire(),
  generateItemWithBinaries.workingVideo.videoTeacup(),
];

const uploadingItems: GeneratedItemWithBinaries[] = [
  generateItemWithBinaries.workingImgWithRemotePreview.jpgCat(),
  generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
  generateItemWithBinaries.workingAudioWithoutRemotePreview.mp3Sonata(),
  generateItemWithBinaries.workingVideo.videoFire(),
  generateItemWithBinaries.workingVideo.videoTeacup(),
];

const initialItemsWithBinaries = [...processedItems, ...processingItems].map(
  ([item]) => item,
);
const allItems = [...processedItems, ...processingItems, ...uploadingItems];

const { MockedMediaClientProvider, processItem, uploadItem } =
  createMockedMediaClientProviderWithBinaries({ initialItemsWithBinaries });

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

processingItems.forEach(([itemWithBinaries]) =>
  simulateProcess(itemWithBinaries),
);
uploadingItems.forEach(([itemWithBinaries]) =>
  simulateUpload(itemWithBinaries),
);

export default () => {
  return (
    <MainWrapper developmentOnly>
      <MockedMediaClientProvider>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {allItems.map(([, identifier], i) => (
            <CardV2Loader
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
