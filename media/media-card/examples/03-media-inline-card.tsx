/**@jsx jsx */
import { jsx } from '@emotion/react';
import {
  docFileId,
  videoProcessingFailedId,
  codeFileId,
  largePdfFileId,
  smallImage,
  createUploadMediaClientConfig,
  defaultCollectionName,
  unknownFileId,
} from '@atlaskit/media-test-helpers';
import { v4 as uuidv4 } from 'uuid';
import {
  MediaClient,
  UploadableFile,
  UploadableFileUpfrontIds,
} from '@atlaskit/media-client';
import MediaInlineCard from '../src/inline/loader';
import { MainWrapper } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';
import {
  mediaInlineTableStyles,
  mediaInlineWrapperStyles,
} from '../example-helpers/styles';

const mediaClientConfig = createUploadMediaClientConfig();

const mediaClient = new MediaClient(mediaClientConfig);
const file: UploadableFile = {
  content: smallImage,
  collection: defaultCollectionName,
  name: 'test.png',
};

const uploadingFileId = uuidv4();
const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
  id: uploadingFileId,
  deferredUploadId: Promise.resolve(''),
  occurrenceKey: uuidv4(),
};

mediaClient.file
  .upload(file, undefined, uploadableFileUpfrontIds, undefined)
  .subscribe({
    next: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
export default () => {
  return (
    <MainWrapper disableFeatureFlagWrapper={true}>
      <IntlProvider locale={'en'}>
        <div css={mediaInlineWrapperStyles}>
          <table css={mediaInlineTableStyles}>
            <tbody>
              <tr>
                <th>Type</th>
                <th>Link</th>
              </tr>
              <tr>
                <td>Doc</td>
                <td>
                  <MediaInlineCard
                    identifier={docFileId}
                    mediaClientConfig={mediaClientConfig}
                    shouldOpenMediaViewer
                  />
                </td>
              </tr>
              <tr>
                <td>Pdf</td>
                <td>
                  <MediaInlineCard
                    identifier={largePdfFileId}
                    mediaClientConfig={mediaClientConfig}
                    shouldOpenMediaViewer
                  />
                </td>
              </tr>
              <tr>
                <td>Code</td>
                <td>
                  <MediaInlineCard
                    identifier={codeFileId}
                    mediaClientConfig={mediaClientConfig}
                    shouldOpenMediaViewer
                  />
                </td>
              </tr>
              <tr>
                <td>Unknown File</td>
                <td>
                  <MediaInlineCard
                    identifier={unknownFileId}
                    mediaClientConfig={mediaClientConfig}
                    shouldOpenMediaViewer
                  />
                </td>
              </tr>
              <tr>
                <td>Error processing</td>
                <td>
                  <MediaInlineCard
                    identifier={videoProcessingFailedId}
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
