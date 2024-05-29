/**@jsx jsx */
import { jsx } from '@emotion/react';
import { Card } from '../src';
import {
  createStorybookMediaClientConfig,
  videoFileId,
  imageFileId,
  videoLargeFileId,
  videoHorizontalFileId,
} from '@atlaskit/media-test-helpers';
import { inlineCardVideoWrapperItemStyles } from '../example-helpers/styles';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();
const onClick = () => console.log('onClick');

export default () => (
  <MainWrapper>
    <div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>video large [disableOverlay=true] width=500 height=300</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoLargeFileId}
          dimensions={{ width: 500, height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>

      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>
          video large [disableOverlay=true] width=500 height=300 (but with
          constraining box of 250px x auto)
        </h1>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
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
      </div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>Image file [disableOverlay=true]</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={imageFileId}
          disableOverlay={true}
          onClick={onClick}
        />
      </div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>Image file [disableOverlay=true] [useInlinePlayer=true]</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={imageFileId}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>video [disableOverlay=true] no dimensions</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoFileId}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>video [disableOverlay=true] width=100% height=300</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoFileId}
          dimensions={{ width: '100%', height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>video horizontal [disableOverlay=true] width=500 height=300</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoHorizontalFileId}
          dimensions={{ width: 500, height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>video horizontal width=200 height=500</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoHorizontalFileId}
          dimensions={{ width: 200, height: 500 }}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>video horizontal no dimensions</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={videoHorizontalFileId}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
    </div>
  </MainWrapper>
);
