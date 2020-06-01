jest.mock('dateformat', () => ({
  __esModule: true,
  default: () => 'some date',
}));
import React from 'react';
import { mount } from 'enzyme';
import * as MediaClientModule from '@atlaskit/media-client';
import { MediaClient } from '@atlaskit/media-client';
import { createFileStateSubject } from '@atlaskit/media-client';
import {
  fakeMediaClient,
  imageFileId,
  audioFileId,
  nextTick,
  asMockFunction,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import ImageIcon from '@atlaskit/icon/glyph/media-services/image';
import DynamicTable from '@atlaskit/dynamic-table';
import { MediaViewer } from '@atlaskit/media-viewer';
import { MediaTable, MediaTableItem } from '../component/mediaTable';

describe('MediaTable', () => {
  const getDefaultMediaClient = (): MediaClient => {
    const mediaClient = fakeMediaClient();
    const fileStateSubject = createFileStateSubject({
      id: imageFileId.id,
      status: 'uploading',
      name: 'file_name',
      size: 10,
      progress: 1,
      mediaType: 'image',
      mimeType: '',
      createdAt: 1476238235395,
    });
    jest
      .spyOn(MediaClientModule, 'getMediaClient')
      .mockReturnValue(mediaClient);

    asMockFunction(mediaClient.file.getFileState).mockReturnValue(
      fileStateSubject,
    );

    return mediaClient;
  };
  const setup = async (
    waitForItems: boolean = true,
    mediaClient: MediaClient = getDefaultMediaClient(),
  ) => {
    const mediaClientConfig = mediaClient.config;
    const items: MediaTableItem[] = [
      {
        identifier: imageFileId,
      },
      {
        identifier: audioFileId,
      },
    ];

    const mediaTable = mount(
      <MediaTable
        mediaClient={mediaClient}
        mediaClientConfig={mediaClientConfig}
        items={items}
      />,
    );

    if (waitForItems) {
      await nextTick(); // wait for getFileState subscription + set state
      mediaTable.update();
    }

    return {
      mediaClient,
      mediaTable,
      mediaClientConfig,
    };
  };

  it('should render loading state while the component is fetching items', async () => {
    const { mediaTable } = await setup(false);
    expect(mediaTable.find('ForwardRef(Spinner)')).toHaveLength(1);
    await nextTick(); // wait for getFileState subscription + set state
    mediaTable.update();
    expect(mediaTable.find('ForwardRef(Spinner)')).toHaveLength(0);
  });

  it('should fetch metadata for all the items', async () => {
    const { mediaClient } = await setup();

    expect(mediaClient.file.getFileState).toBeCalledTimes(2);
    expectFunctionToHaveBeenCalledWith(mediaClient.file.getFileState, [
      imageFileId.id,
      {
        collectionName: imageFileId.collectionName,
      },
    ]);
    expectFunctionToHaveBeenCalledWith(mediaClient.file.getFileState, [
      audioFileId.id,
      {
        collectionName: audioFileId.collectionName,
      },
    ]);
  });

  it('should open MediaViewer when a row is clicked', async () => {
    const { mediaTable } = await setup();
    const rows = mediaTable.find(DynamicTable).prop('rows');

    if (rows && rows[0].onClick) {
      rows[0].onClick({} as any);
    }

    mediaTable.update();

    expect(mediaTable.find(MediaViewer)).toHaveLength(1);
  });

  it('should pass right options to MediaViewer', async () => {
    const { mediaTable, mediaClientConfig } = await setup();
    const rows = mediaTable.find(DynamicTable).prop('rows');

    if (rows && rows[0].onClick) {
      rows[0].onClick({} as any);
    }

    mediaTable.update();

    expect(mediaTable.find(MediaViewer).props()).toEqual(
      expect.objectContaining({
        collectionName: imageFileId.collectionName,
        dataSource: {
          list: [
            {
              collectionName: imageFileId.collectionName,
              id: imageFileId.id,
              mediaItemType: 'file',
            },
            {
              collectionName: audioFileId.collectionName,
              id: audioFileId.id,
              mediaItemType: 'file',
            },
          ],
        },
        mediaClientConfig,
        selectedItem: {
          collectionName: imageFileId.collectionName,
          id: imageFileId.id,
          mediaItemType: 'file',
        },
      }),
    );
  });

  it('should download file', async () => {
    const { mediaClient, mediaTable } = await setup();

    mediaTable
      .find(DownloadIcon)
      .first()
      .simulate('click');
    expect(mediaClient.file.downloadBinary).toBeCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(mediaClient.file.downloadBinary, [
      imageFileId.id,
      'file_name',
      imageFileId.collectionName,
    ]);
  });

  it('should render right file size', async () => {
    expect.assertions(1);
    const { mediaTable } = await setup();
    const rows = mediaTable.find(DynamicTable).prop('rows');

    if (rows) {
      expect(rows[0].cells[1].content).toEqual('10 B');
    }
  });

  it('should render right date', async () => {
    expect.assertions(1);
    const { mediaTable } = await setup();
    const rows = mediaTable.find(DynamicTable).prop('rows');

    if (rows) {
      expect(rows[0].cells[2].content).toEqual('some date');
    }
  });

  it('should render file type icon', async () => {
    const { mediaTable } = await setup();

    expect(mediaTable.find(ImageIcon)).toHaveLength(2);
  });

  it('should unsubscribe from all the files', async () => {
    const mediaClient = fakeMediaClient();
    jest
      .spyOn(MediaClientModule, 'getMediaClient')
      .mockReturnValue(mediaClient);
    const unsubscribe = jest.fn();
    asMockFunction(mediaClient.file.getFileState).mockReturnValue({
      subscribe: () => ({ unsubscribe }),
    } as any);
    const { mediaTable } = await setup(undefined, mediaClient);

    mediaTable.unmount();

    expect(unsubscribe).toBeCalledTimes(2);
  });
});
