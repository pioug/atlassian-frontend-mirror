/**@jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState, ChangeEvent } from 'react';
import {
  imageFileId,
  docFileId,
  videoProcessingFailedId,
  codeFileId,
  videoFileId,
  largePdfFileId,
  smallImage,
  createUploadMediaClientConfig,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { v4 as uuidv4 } from 'uuid';
import {
  MediaClient,
  UploadableFile,
  UploadableFileUpfrontIds,
} from '@atlaskit/media-client';
import Toggle from '@atlaskit/toggle';
import MediaInlineCard from '../src/root/inline/loader';
import { MainWrapper } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ThemeModes } from '@atlaskit/theme';
import {
  mediaInlineTableStyles,
  mediaInlineWrapperStyles,
} from '../example-helpers/styles';

const mediaClientConfig = createUploadMediaClientConfig();

const LIGHT_THEME = 'light',
  DARK_THEME = 'dark';

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

mediaClient.file.upload(file, undefined, uploadableFileUpfrontIds).subscribe({
  next: (response) => {
    console.log(response);
  },
  error: (error) => {
    console.log(error);
  },
});
export default () => {
  // Setup Toggle Dark theme
  const [themeMode, setThemeMode] = useState<ThemeModes>(LIGHT_THEME);
  const onThemeToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.currentTarget.checked ? DARK_THEME : LIGHT_THEME);
  };
  const toggleDarkMode = (
    <React.Fragment>
      <label htmlFor="toggle-darkmode">Dark Mode</label>
      <Toggle id="toggle-darkmode" onChange={onThemeToggle} label="Dark Mode" />
    </React.Fragment>
  );
  return (
    <MainWrapper disableFeatureFlagWrapper={true}>
      <AtlaskitThemeProvider mode={themeMode}>
        {toggleDarkMode}
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
                      identifier={imageFileId}
                      mediaClientConfig={mediaClientConfig}
                      shouldOpenMediaViewer
                    />
                  </td>
                </tr>
                <tr>
                  <td>Doc</td>
                  <td>
                    <MediaInlineCard
                      identifier={docFileId}
                      mediaClientConfig={mediaClientConfig}
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
                  <td>Video</td>
                  <td>
                    <MediaInlineCard
                      identifier={videoFileId}
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
                  <td>Error processing</td>
                  <td>
                    <MediaInlineCard
                      identifier={videoProcessingFailedId}
                      mediaClientConfig={mediaClientConfig}
                      shouldOpenMediaViewer
                    />
                  </td>
                </tr>
                <tr>
                  <td>Loading View</td>
                  <td>
                    <MediaInlineCard
                      identifier={{
                        id: 'loading-file',
                        mediaItemType: 'file',
                        collectionName: 'no-collection',
                      }}
                      mediaClientConfig={mediaClientConfig}
                      shouldOpenMediaViewer
                    />
                  </td>
                </tr>
                <tr>
                  <td>Uploading View</td>
                  <td>
                    <MediaInlineCard
                      identifier={{
                        id: uploadingFileId,
                        collectionName: defaultCollectionName,
                        mediaItemType: 'file',
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
      </AtlaskitThemeProvider>
    </MainWrapper>
  );
};
