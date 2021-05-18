import React from 'react';
import styled from 'styled-components';
import {
  imageFileId,
  docFileId,
  videoProcessingFailedId,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import InlineMediaCard from '../src/root/inline/loader';
import { IntlProvider } from 'react-intl';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 100px;
`;
const Table = styled.table`
  width: 800px;
  tr,
  td {
    border: 1px solid #ddd;
  }
`;

const mediaClientConfig = createStorybookMediaClientConfig();

export default () => {
  return (
    <IntlProvider locale={'en'}>
      <Wrapper>
        <Table>
          <tbody>
            <tr>
              <th>Type</th>
              <th>Link</th>
            </tr>
            <tr>
              <td>Image</td>
              <td>
                <InlineMediaCard
                  identifier={imageFileId}
                  mediaClientConfig={mediaClientConfig}
                  shouldOpenMediaViewer
                />
              </td>
            </tr>
            <tr>
              <td>Doc</td>
              <td>
                <InlineMediaCard
                  identifier={docFileId}
                  mediaClientConfig={mediaClientConfig}
                />
              </td>
            </tr>
            <tr>
              <td>Error processing</td>
              <td>
                <InlineMediaCard
                  identifier={videoProcessingFailedId}
                  mediaClientConfig={mediaClientConfig}
                  shouldOpenMediaViewer
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Wrapper>
    </IntlProvider>
  );
};
