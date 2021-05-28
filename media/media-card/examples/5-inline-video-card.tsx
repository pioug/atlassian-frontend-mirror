import React from 'react';
import { Card } from '../src';
import {
  defaultCollectionName,
  createStorybookMediaClientConfig,
  videoFileId,
  imageFileId,
  videoLargeFileId,
  videoHorizontalFileId,
  isMediaMockOptedIn,
  MediaMock,
  vrVideoDetails,
  generateFilesFromTestData,
  MockFile,
} from '@atlaskit/media-test-helpers';
import {
  InlineCardVideoWrapper,
  InlineCardVideoWrapperItem,
} from '../example-helpers/styled';
import { canUseDOM } from 'exenv';
import { FileIdentifier } from '@atlaskit/media-client';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();
const onClick = () => console.log('onClick');

let files: MockFile[] = [];

if (canUseDOM && isMediaMockOptedIn()) {
  files = generateFilesFromTestData([vrVideoDetails]);
  const mediaMock = new MediaMock({
    [defaultCollectionName]: files,
  });
  mediaMock.enable();
}

const vrFileIdentifier: FileIdentifier = {
  id: vrVideoDetails.id,
  mediaItemType: 'file',
  collectionName: defaultCollectionName,
};

export default () => (
  <MainWrapper>
    <InlineCardVideoWrapper>
      <InlineCardVideoWrapperItem>
        <h1>video large [disableOverlay=true] width=500 height=300</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={
            isMediaMockOptedIn() ? vrFileIdentifier : videoLargeFileId
          }
          dimensions={{ width: 500, height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </InlineCardVideoWrapperItem>

      <InlineCardVideoWrapperItem>
        <h1>
          video large [disableOverlay=true] width=500 height=300 (but with
          constraining box of 250px x auto)
        </h1>
        <div style={{ width: '250px', height: 'auto' }}>
          <Card
            mediaClientConfig={mediaClientConfig}
            identifier={videoLargeFileId}
            dimensions={{ width: 500, height: 300 }}
            disableOverlay={true}
            onClick={onClick}
            useInlinePlayer={true}
          />
        </div>
      </InlineCardVideoWrapperItem>
      <InlineCardVideoWrapperItem>
        <h1>Image file [disableOverlay=true]</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={imageFileId}
          disableOverlay={true}
          onClick={onClick}
        />
      </InlineCardVideoWrapperItem>
      <InlineCardVideoWrapperItem>
        <h1>Image file [disableOverlay=true] [useInlinePlayer=true]</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={imageFileId}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </InlineCardVideoWrapperItem>
      <InlineCardVideoWrapperItem>
        <h1>video [disableOverlay=true] no dimensions</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoFileId}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </InlineCardVideoWrapperItem>
      <InlineCardVideoWrapperItem>
        <h1>video [disableOverlay=true] width=100% height=300</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoFileId}
          dimensions={{ width: '100%', height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </InlineCardVideoWrapperItem>
      <InlineCardVideoWrapperItem>
        <h1>video horizontal [disableOverlay=true] width=500 height=300</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoHorizontalFileId}
          dimensions={{ width: 500, height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </InlineCardVideoWrapperItem>
      <InlineCardVideoWrapperItem>
        <h1>video horizontal width=200 height=500</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoHorizontalFileId}
          dimensions={{ width: 200, height: 500 }}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </InlineCardVideoWrapperItem>
      <InlineCardVideoWrapperItem>
        <h1>video horizontal no dimensions</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoHorizontalFileId}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </InlineCardVideoWrapperItem>
    </InlineCardVideoWrapper>
  </MainWrapper>
);
