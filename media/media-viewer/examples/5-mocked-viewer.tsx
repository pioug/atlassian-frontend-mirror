import React from 'react';
import { canUseDOM } from 'exenv';
import Button from '@atlaskit/button/custom-theme-button';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import { MediaClient, Identifier } from '@atlaskit/media-client';
import {
  MediaMock,
  defaultCollectionName,
  smallImage,
  tallImage,
  defaultBaseUrl,
  generateFilesFromTestData,
  MockFile,
} from '@atlaskit/media-test-helpers';

import { wideImage } from '../example-helpers/assets/wide-image';
import { MediaViewer } from '../src/components/media-viewer';
import { MediaViewerExtensionsActions } from '../src';
import { MVSidebar, MVSidebarHeader } from '../example-helpers/styled';

let files: MockFile[] = [];

if (canUseDOM) {
  (window as any).areControlsRendered = () => {
    return !!document.querySelector('div.mvng-hide-controls');
  };

  (window as any).areControlsVisible = () => {
    const controls = document.querySelector('div.mvng-hide-controls');
    if (!controls) {
      return false;
    } else {
      return window.getComputedStyle(controls).opacity === '1';
    }
  };

  files = generateFilesFromTestData([
    {
      name: 'media-test-file-1.png',
      dataUri: smallImage,
    },
    {
      name: 'media-test-file-2.jpg',
      dataUri: wideImage,
    },
    {
      name: 'media-test-file-3.png',
      dataUri: tallImage,
    },
  ]);
  const mediaMock = new MediaMock({
    [defaultCollectionName]: files,
  });
  mediaMock.enable();
}
const mediaClient = new MediaClient({
  authProvider: () =>
    Promise.resolve({
      clientId: '',
      token: '',
      baseUrl: defaultBaseUrl,
    }),
});

export interface State {
  isMediaViewerActive: boolean;
}
export default class Example extends React.Component<{}, State> {
  state = {
    isMediaViewerActive: true,
  };

  deactivate = () => {
    this.setState({ isMediaViewerActive: false });
  };

  sidebarRenderer = (
    selectedIdentifier: Identifier,
    actions: MediaViewerExtensionsActions,
  ) => {
    let id = '';
    if (selectedIdentifier.mediaItemType === 'file') {
      id = selectedIdentifier.id;
    }

    return (
      <Sidebar
        identifier={selectedIdentifier}
        actions={actions}
        fileData={files.find((file: MockFile) => file.id === id)}
      />
    );
  };

  render() {
    const { isMediaViewerActive } = this.state;

    return (
      <div>
        {isMediaViewerActive && files.length && (
          <MediaViewer
            dataSource={{
              list: files
                .map(
                  ({ id }): Identifier => ({
                    id,
                    collectionName: defaultCollectionName,
                    mediaItemType: 'file',
                  }),
                )
                .concat([
                  {
                    mediaItemType: 'external-image',
                    dataURI:
                      'https://wac-cdn.atlassian.com/dam/jcr:616e6748-ad8c-48d9-ae93-e49019ed5259/Atlassian-horizontal-blue-rgb.svg',
                  },
                ]),
            }}
            selectedItem={{
              id: files[1].id,
              collectionName: defaultCollectionName,
              mediaItemType: 'file',
            }}
            collectionName={defaultCollectionName}
            mediaClient={mediaClient}
            onClose={this.deactivate}
            extensions={{
              sidebar: {
                renderer: this.sidebarRenderer,
                icon: <DetailViewIcon label="sidebar" />,
              },
            }}
          />
        )}
      </div>
    );
  }
}

interface SidebarProps {
  identifier: Identifier;
  actions: MediaViewerExtensionsActions;
  fileData?: MockFile;
}

const Sidebar = (props: SidebarProps) => {
  const { actions, fileData } = props;

  const renderFileStateItem = <FileState, K extends keyof FileState>(
    fileState: FileState,
    item: K,
  ) => {
    return (
      <tr>
        <td>{item}: </td>
        <td>{(fileState && fileState[item]) || <i>Unknown</i>}</td>
      </tr>
    );
  };

  const renderFileState = () => {
    if (!fileData) {
      return null;
    }
    return (
      <table>
        <tbody>
          {renderFileStateItem(fileData, 'id')}
          {renderFileStateItem(fileData, 'mediaType')}
          {renderFileStateItem(fileData, 'mimeType')}
          {renderFileStateItem(fileData, 'name')}
          {renderFileStateItem(fileData, 'size')}
        </tbody>
      </table>
    );
  };

  return (
    <MVSidebar>
      <MVSidebarHeader>
        <h2>Attachment details</h2>
        <Button
          onClick={actions.close}
          aria-label="Close panel"
          iconBefore={<ArrowRightIcon primaryColor="white" label="return" />}
        />
      </MVSidebarHeader>
      {renderFileState()}
    </MVSidebar>
  );
};
