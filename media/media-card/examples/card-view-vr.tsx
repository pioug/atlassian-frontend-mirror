// eslint-disable-line no-console
import React from 'react';
import styled from 'styled-components';
import { CardStatus } from '../src';
import { CardView } from '../src/root/cardView';
import { FileDetails, MediaType } from '@atlaskit/media-client';
import { tallImage } from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl';
import { RequestError } from '@atlaskit/media-client';

type WrapperDimensions = {
  width: string;
  height: string;
};
const wrapperDimensionsSmall = { width: '156px', height: '108px' }; // Minimum supported dimensions
const dimensions = { width: '100%', height: '100%' };

const CardWrapper = styled.div`
  ${({ width, height }: WrapperDimensions) => `
    display: inline-block;
    width: ${width};
    height: ${height};
    margin: 15px 20px;
  `}
`;

const StyledContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  h3 {
    text-align: center;
  }
`;

const mimeTypes: { media: MediaType; mime: string; name: string }[] = [
  { media: 'doc', mime: 'application/pdf', name: '.pdf' },
  { media: 'image', mime: 'image/png', name: '.img' },
  { media: 'video', mime: 'video/mp4', name: '.video' },
  { media: 'audio', mime: 'audio/mp3', name: '.audio' },
  { media: 'archive', mime: 'application/zip', name: '.zip' },
  { media: 'unknown', mime: 'unknown', name: '.unknown' },
];

const IconsTable = () => {
  return (
    <StyledContainer>
      {/* Reference page:
        https://hello.atlassian.net/wiki/spaces/~231281387/pages/910276304/Visual+Regression+Tests+MediaCard
        for what we test for, in terms of Visual regressions in MediaCard */}
      {/* TODO: remove this IntlProvider https://product-fabric.atlassian.net/browse/BMPT-139 */}
      <IntlProvider locale={'en'}>
        <>
          {mimeTypes.map((item, i) =>
            renderCardImageView(
              'complete',
              item.media,
              item.mime,
              item.name,
              i,
            ),
          )}
        </>
      </IntlProvider>
    </StyledContainer>
  );
};

function renderCardImageView(
  status: CardStatus,
  mediaType: MediaType,
  mimeType: any,
  name: string,
  key: number,
) {
  const urlParams = new URLSearchParams(window.location.search);
  const cardStatus = urlParams.get('status') as CardStatus;
  const metadata: FileDetails | undefined =
    urlParams.get('disableMetadata') === 'true'
      ? undefined
      : {
          id: 'some-file-id',
          name,
          mediaType: mediaType,
          mimeType,
          size: 4200,
          createdAt: 1589481162745,
        };
  const dataUri = urlParams.get('dataUri') === 'true' ? tallImage : undefined;
  const selected = urlParams.get('selected') === 'true';
  const isRateLimited = urlParams.get('isRateLimited') === 'true';
  const disableOverlay = urlParams.get('disabledOverlay') === 'true';
  const error = isRateLimited
    ? new RequestError('serverError', { statusCode: 429 })
    : undefined;

  return (
    <CardWrapper key={key} {...wrapperDimensionsSmall}>
      <CardView
        featureFlags={{
          newCardExperience: true,
        }}
        error={error}
        disableOverlay={disableOverlay}
        status={cardStatus || status}
        mediaItemType="file"
        metadata={metadata}
        resizeMode="crop"
        progress={0.5}
        dimensions={dimensions}
        dataURI={dataUri}
        selected={selected}
      />
    </CardWrapper>
  );
}
export default () => <IconsTable />;
