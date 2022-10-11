/**@jsx jsx */
import { css, jsx } from '@emotion/react';
// eslint-disable-line no-console
import React from 'react';
import { CardStatus } from '../src';
import { CardView } from '../src/card/cardView';
import { FileDetails, MediaType } from '@atlaskit/media-client';
import { tallImage, wideTransparentImage } from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl-next';
import { MainWrapper, mediaCardErrorState } from '../example-helpers';
import { CardViewWrapper } from '../example-helpers/cardViewWrapper';

const wrapperDimensionsSmall = { width: '156px', height: '108px' }; // Minimum supported dimensions
const dimensions = { width: '100%', height: '100%' };

const styledContainerStyles = css`
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
    <MainWrapper disableFeatureFlagWrapper={true}>
      <div css={styledContainerStyles}>
        {/* Reference page:
        https://hello.atlassian.net/wiki/spaces/~231281387/pages/910276304/Visual+Regression+Tests+MediaCard
        for what we test for, in terms of Visual regressions in MediaCard */}
        {/* TODO: remove this IntlProvider https://product-fabric.atlassian.net/browse/BMPT-139 */}
        <IntlProvider locale={'en'}>
          <React.Fragment>
            {mimeTypes.map((item, i) =>
              renderCardImageView(
                'complete',
                item.media,
                item.mime,
                item.name,
                i,
              ),
            )}
          </React.Fragment>
        </IntlProvider>
      </div>
    </MainWrapper>
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
  const isDataURIBroken = urlParams.get('brokenDataUri') === 'true';
  const isTransparentImage = urlParams.get('isTransparent') === 'true';
  const resizeMode = isTransparentImage ? 'fit' : 'crop';
  const dataURI = isDataURIBroken
    ? 'error-uri'
    : isTransparentImage
    ? wideTransparentImage
    : urlParams.get('dataUri') === 'true'
    ? tallImage
    : undefined;
  const selected = urlParams.get('selected') === 'true';
  const isRateLimited = urlParams.get('isRateLimited') === 'true';
  const isPollingError =
    urlParams.get('isPollingMaxAttemptsExceeded') === 'true';
  const disableOverlay = urlParams.get('disableOverlay') === 'true';
  const isUploadError = urlParams.get('isUploadError') === 'true';
  const error = isRateLimited
    ? 'rateLimitedError'
    : isPollingError
    ? 'pollingMaxAttemptsError'
    : isUploadError
    ? 'uploadError'
    : undefined;
  const width = urlParams.get('width');
  if (width) {
    dimensions.width = width;
  }

  const cardPreview = dataURI
    ? ({ dataURI, source: 'remote' } as const)
    : undefined;

  return (
    <CardViewWrapper
      wrapperDimensions={wrapperDimensionsSmall}
      displayInline={true}
      key={key}
    >
      <CardView
        featureFlags={{
          newCardExperience: true,
        }}
        error={mediaCardErrorState(error)}
        disableOverlay={disableOverlay}
        status={cardStatus || status}
        mediaItemType="file"
        metadata={metadata}
        resizeMode={resizeMode}
        progress={0.5}
        dimensions={dimensions}
        cardPreview={cardPreview}
        selected={selected}
        disableAnimation={true}
      />
    </CardViewWrapper>
  );
}
export default () => <IconsTable />;
