/**@jsx jsx */
import { jsx } from '@emotion/react';
import { Card } from '../src';
import {
  defaultCollectionName,
  createStorybookMediaClientConfig,
  MediaMock,
  vrVideoDetails,
  generateFilesFromTestData,
  MockFile,
} from '@atlaskit/media-test-helpers';
import { inlineCardVideoWrapperItemStyles } from '../example-helpers/styles';
import { canUseDOM } from 'exenv';
import { FileIdentifier } from '@atlaskit/media-client';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();
const onClick = () => console.log('onClick');

let files: MockFile[] = [];

if (canUseDOM) {
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
    <div>
      <div css={inlineCardVideoWrapperItemStyles}>
        <h1>video large [disableOverlay=true] width=500 height=300</h1>
        <Card
          mediaClientConfig={mediaClientConfig}
          identifier={vrFileIdentifier}
          dimensions={{ width: 500, height: 300 }}
          disableOverlay={true}
          onClick={onClick}
          useInlinePlayer={true}
        />
      </div>
    </div>
  </MainWrapper>
);
