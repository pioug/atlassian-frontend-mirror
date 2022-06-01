import React from 'react';
import styled from 'styled-components';
import { InlinePlayer } from '../src/root/inlinePlayer';
import {
  createStorybookMediaClient,
  videoSquareFileId,
} from '@atlaskit/media-test-helpers';
import { createMediaSubscribable } from '@atlaskit/media-client';

import { IntlProvider } from 'react-intl-next';
import { MainWrapper } from '../example-helpers';

type WrapperDimensions = {
  width: string;
  height: string;
};
const wrapperDimensions = { width: '500px', height: '500px' };
const dimensions = { width: '100%', height: '100%' };

const InlinePlayerWrapper = styled.div`
  ${({ width, height }: WrapperDimensions) => `
    width: ${width};
    height: ${height};
    margin: 20px 20px;
  `}
`;

export default () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cardStatus = urlParams.get('status') as any;

  const mediaClient = createStorybookMediaClient();

  mediaClient.file.getFileState = () => {
    return createMediaSubscribable({
      status: cardStatus,
      preview: {
        value: new Blob([], { type: 'video/mp4' }),
      },
      id: '',
      mediaType: 'image',
      mimeType: '',
      name: '',
      progress: 0.5,
      size: 0,
    });
  };

  return (
    <MainWrapper disableFeatureFlagWrapper={true}>
      <IntlProvider locale={'en'}>
        <InlinePlayerWrapper {...wrapperDimensions}>
          <InlinePlayer
            identifier={videoSquareFileId}
            mediaClient={mediaClient}
            dimensions={dimensions}
            // needed for reliable snapshots
            selected={true}
            autoplay={false}
          />
        </InlinePlayerWrapper>
      </IntlProvider>
    </MainWrapper>
  );
};
