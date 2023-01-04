/**@jsx jsx */
import { jsx } from '@emotion/react';
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
  mediaViewerExampleWrapperStyles,
  mediaViewerExampleColumnStyles,
} from '../example-helpers/styles';
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
        <div css={mediaViewerExampleWrapperStyles}>
          <div css={mediaViewerExampleColumnStyles}>
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
          </div>
          <div css={mediaViewerExampleColumnStyles}>
            <h3>shouldOpenMediaViewer + list without card identifier</h3>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={imageFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
              mediaViewerDataSource={{ list: [gifFileId] }}
            />
          </div>
          <div css={mediaViewerExampleColumnStyles}>
            <h3>useInlinePlayer=true</h3>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={videoFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
              mediaViewerDataSource={mediaViewerDataSource}
              useInlinePlayer={true}
            />
          </div>
          <div css={mediaViewerExampleColumnStyles}>
            <h3>mediaViewerDataSource=undefined</h3>
            <Card
              mediaClientConfig={mediaClientConfig}
              identifier={largeImageFileId}
              shouldOpenMediaViewer={shouldOpenMediaViewer}
            />
          </div>
        </div>
      </MainWrapper>
    );
  }
}

export default () => <Example />;
