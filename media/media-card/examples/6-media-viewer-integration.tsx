import React from 'react';
import { Component } from 'react';
import { Card } from '../src';
import {
  createStorybookMediaClientConfig,
  imageFileId,
  gifFileId,
  videoFileId,
  largeImageFileId,
} from '@atlaskit/media-test-helpers';
import { MediaViewerDataSource } from '@atlaskit/media-viewer';
import {
  MediaViewerExampleWrapper,
  MediaViewerExampleColumn,
} from '../example-helpers/styled';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();
const mediaViewerDataSource: MediaViewerDataSource = {
  list: [imageFileId, gifFileId, largeImageFileId, videoFileId],
};

interface ExampleState {
  shouldOpenMediaViewer: boolean;
}

class Example extends Component<{}, {}> {
  state: ExampleState = {
    shouldOpenMediaViewer: true,
  };

  render() {
    const { shouldOpenMediaViewer } = this.state;

    return (
      <MainWrapper>
        <MediaViewerExampleWrapper>
          <MediaViewerExampleColumn>
            <h3>shouldOpenMediaViewer + mediaViewerDataSource</h3>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={imageFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
              mediaViewerDataSource={mediaViewerDataSource}
            />
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={gifFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
              mediaViewerDataSource={mediaViewerDataSource}
            />
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={videoFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
              mediaViewerDataSource={mediaViewerDataSource}
            />
          </MediaViewerExampleColumn>
          <MediaViewerExampleColumn>
            <h3>shouldOpenMediaViewer + list without card identifier</h3>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={imageFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
              mediaViewerDataSource={{ list: [gifFileId] }}
            />
          </MediaViewerExampleColumn>
          <MediaViewerExampleColumn>
            <h3>useInlinePlayer=true</h3>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={videoFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
              mediaViewerDataSource={mediaViewerDataSource}
              useInlinePlayer={true}
            />
          </MediaViewerExampleColumn>
          <MediaViewerExampleColumn>
            <h3>mediaViewerDataSource=undefined</h3>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={largeImageFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
            />
          </MediaViewerExampleColumn>
        </MediaViewerExampleWrapper>
      </MainWrapper>
    );
  }
}

export default () => <Example />;
