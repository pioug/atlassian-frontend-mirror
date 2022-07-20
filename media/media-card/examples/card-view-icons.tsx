/**@jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { CardStatus } from '../src';
import { CardView } from '../src/root/cardView';
import { FileDetails, MediaType } from '@atlaskit/media-client';
import { IntlProvider } from 'react-intl-next';
import { MainWrapper } from '../example-helpers';
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

const mimeTypes: { mime: string; name: string }[] = [
  { mime: 'application/pdf', name: '.pdf' },
  {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    name: '.excel',
  },
  { mime: 'image/gif', name: '.gif' },
  { mime: 'application/vnd.ms-powerpoint', name: '.powerpoint' },
  { mime: 'application/msword', name: '.wordDoc' },
  { mime: 'binary/octet-stream', name: '.sketch' },
  { mime: 'application/octet-stream', name: '.fig' },
  { mime: 'binary/octet-stream', name: '.exe' },
  { mime: 'application/vnd.google-apps.document', name: '.google-docs' },
  {
    mime: 'application/vnd.google-apps.presentation',
    name: '.google-slides',
  },
  {
    mime: 'application/vnd.google-apps.spreadsheet',
    name: '.goole-sheets',
  },
  { mime: 'application/vnd.google-apps.form', name: '.google-form' },
  { mime: 'text/csv', name: '.csv' },
  { mime: 'application/x-iwork-keynote-sffkey', name: '.presentation' },
  { mime: 'text/plain', name: '.source-code.c' },
];

const IconsTable = () => {
  return (
    <div css={styledContainerStyles}>
      <h3>MimeTypes</h3>
      {/* TODO: remove this IntlProvider https://product-fabric.atlassian.net/browse/BMPT-139 */}
      <IntlProvider locale={'en'}>
        <React.Fragment>
          {mimeTypes.map((item, i) =>
            renderCardImageView('complete', 'audio', item.mime, item.name, i),
          )}
        </React.Fragment>
      </IntlProvider>
    </div>
  );
};

function renderCardImageView(
  status: CardStatus,
  mediaType: MediaType = 'image',
  mimeType: any,
  name: string,
  key: number,
) {
  const metadata: FileDetails = {
    id: 'some-file-id',
    name,
    mediaType,
    mimeType,
    size: 4200,
    createdAt: 1589481162745,
  };

  return (
    <MainWrapper key={key}>
      <CardViewWrapper
        wrapperDimensions={wrapperDimensionsSmall}
        displayInline={true}
      >
        <CardView
          featureFlags={{
            newCardExperience: true,
          }}
          status={status}
          mediaItemType="file"
          metadata={metadata}
          resizeMode="crop"
          progress={0.5}
          dimensions={dimensions}
        />
      </CardViewWrapper>
    </MainWrapper>
  );
}
export default () => <IconsTable />;
