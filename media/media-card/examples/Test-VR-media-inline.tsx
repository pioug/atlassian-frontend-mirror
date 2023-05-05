/**@jsx jsx */
import { jsx } from '@emotion/react';
import {
  createUploadMediaClientConfig,
  defaultCollectionName,
  MediaMock,
  generateFilesFromTestData,
  MockFileInputParams,
} from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl-next';
import MediaInlineCard from '../src/inline/loader';
import { MainWrapper } from '../example-helpers';
import {
  mediaInlineTableStyles,
  mediaInlineWrapperStyles,
} from '../example-helpers/styles';

const mockImageFile: MockFileInputParams = {
  id: '0c3c64b9-65ad-4592-89d0-f838beebd81e',
  name: 'me_skate.png',
  mediaType: 'image',
  mimeType: 'image/png',
};
const mockDocFile: MockFileInputParams = {
  id: 'af637c7a-75c3-4254-b074-d16e6ae2e04b',
  name: 'taxes.pdf',
  mediaType: 'doc',
  mimeType: 'application/pdf',
};
const mockSpreadsheetFile: MockFileInputParams = {
  id: '45334c16-9d5a-413d-bb4c-969a464db952',
  name: 'annual_report.csv',
  mediaType: 'doc',
  mimeType: 'text/csv',
};
const mockVideoFile: MockFileInputParams = {
  id: 'db2f29e0-75af-45a7-baaf-94093bc09293',
  name: 'me_kickflip.mp4',
  mediaType: 'video',
  mimeType: 'video/mp4',
};
const mockErrorFile: MockFileInputParams = {
  id: '26adc5af-3af4-42a8-9c24-62b6ce0f9369',
  name: 'some-file.jpeg',
  mediaType: 'image',
  mimeType: 'image/jpeg',
  processingStatus: 'failed',
};
const files = generateFilesFromTestData([
  mockImageFile,
  mockDocFile,
  mockSpreadsheetFile,
  mockVideoFile,
  mockErrorFile,
]);
const mediaMock = new MediaMock({
  [defaultCollectionName]: files,
});
mediaMock.enable();

const mediaClientConfig = createUploadMediaClientConfig();

export default () => {
  return (
    <MainWrapper disableFeatureFlagWrapper={true} developmentOnly>
      <IntlProvider locale={'en'}>
        <div css={mediaInlineWrapperStyles}>
          <table css={mediaInlineTableStyles}>
            <tbody>
              <tr>
                <th>Type</th>
                <th>Link</th>
              </tr>
              <tr>
                <td>Image</td>
                <td>
                  <MediaInlineCard
                    identifier={{
                      mediaItemType: 'file',
                      id: mockImageFile.id!,
                      collectionName: defaultCollectionName,
                    }}
                    mediaClientConfig={mediaClientConfig}
                    shouldOpenMediaViewer
                  />
                </td>
              </tr>
              <tr>
                <td>Doc</td>
                <td>
                  <MediaInlineCard
                    identifier={{
                      mediaItemType: 'file',
                      id: mockDocFile.id!,
                      collectionName: defaultCollectionName,
                    }}
                    mediaClientConfig={mediaClientConfig}
                  />
                </td>
              </tr>
              <tr>
                <td>Spreadsheet</td>
                <td>
                  <MediaInlineCard
                    identifier={{
                      mediaItemType: 'file',
                      id: mockSpreadsheetFile.id!,
                      collectionName: defaultCollectionName,
                    }}
                    mediaClientConfig={mediaClientConfig}
                  />
                </td>
              </tr>
              <tr>
                <td>Video</td>
                <td>
                  <MediaInlineCard
                    identifier={{
                      mediaItemType: 'file',
                      id: mockVideoFile.id!,
                      collectionName: defaultCollectionName,
                    }}
                    mediaClientConfig={mediaClientConfig}
                  />
                </td>
              </tr>
              <tr>
                <td>Error processing</td>
                <td>
                  <MediaInlineCard
                    identifier={{
                      mediaItemType: 'file',
                      id: mockErrorFile.id!,
                      collectionName: defaultCollectionName,
                    }}
                    mediaClientConfig={mediaClientConfig}
                    shouldOpenMediaViewer
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </IntlProvider>
    </MainWrapper>
  );
};
