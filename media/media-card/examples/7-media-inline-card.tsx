import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import {
  imageFileId,
  docFileId,
  videoProcessingFailedId,
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
import { IntlProvider } from 'react-intl';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ThemeModes } from '@atlaskit/theme';

const mediaClientConfig = createUploadMediaClientConfig();

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
    <>
      <label htmlFor="toggle-darkmode">Dark Mode</label>
      <Toggle id="toggle-darkmode" onChange={onThemeToggle} label="Dark Mode" />
    </>
  );
  return (
    <AtlaskitThemeProvider mode={themeMode}>
      {toggleDarkMode}
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
          </Table>
        </Wrapper>
      </IntlProvider>
    </AtlaskitThemeProvider>
  );
};
