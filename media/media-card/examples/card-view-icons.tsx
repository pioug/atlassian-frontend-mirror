// eslint-disable-line no-console
import React from 'react';
import styled from 'styled-components';
import { CardStatus } from '../src';
import { CardView } from '../src/root/cardView';
import { FileDetails, MediaType } from '@atlaskit/media-client';

type WrapperDimensions = {
  width: string;
  height: string;
};
const wrapperDimensionsSmall = { width: '156px', height: '108px' }; // Minimum supported dimensions
const dimensions = { width: '100%', height: '100%' };

const CardWrapper = styled.div`
  ${({ width, height }: WrapperDimensions) => `
    width: ${width};
    height: ${height};
    margin: 15px 20px;
  `}
`;

const StyledTable = styled.table`
  margin: 30px auto 0 auto;
  max-width: 1100px;
  thead * {
    text-align: center;
  }
  td {
    display: inline-table;
  }
  th {
    padding: 0;
  }
`;

const StyledContainer = styled.div`
  min-width: 1100px;
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
  { mime: 'text/plain', name: '.source-code' },
];

const IconsTable = () => {
  return (
    <StyledContainer>
      <StyledTable>
        <thead>
          <tr>
            <th key="first-column">MimeTypes</th>
          </tr>
        </thead>
        {mimeTypes.map(item => (
          <td key={`${status}-entry-${item.mime}`}>
            {renderCardImageView('complete', 'audio', item.mime, item.name)}
          </td>
        ))}
      </StyledTable>
    </StyledContainer>
  );
};

function renderCardImageView(
  status: CardStatus,
  mediaType: MediaType = 'image',
  mimeType: any,
  name: string,
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
    <CardWrapper {...wrapperDimensionsSmall}>
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
    </CardWrapper>
  );
}
export default () => <IconsTable />;
