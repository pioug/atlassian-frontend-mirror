jest.mock('dateformat', () => ({
  __esModule: true,
  default: () => 'some date',
}));
import { HeadType } from '@atlaskit/dynamic-table/types';

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import * as MediaClientModule from '@atlaskit/media-client';
import { FileState, MediaClient } from '@atlaskit/media-client';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { createFileStateSubject } from '@atlaskit/media-client';
import {
  fakeMediaClient,
  imageFileId,
  audioFileId,
  nextTick,
  asMockFunction,
  expectFunctionToHaveBeenCalledWith,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import ImageIcon from '@atlaskit/icon/glyph/media-services/image';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { MediaViewer } from '@atlaskit/media-viewer';
import { MediaTable } from '../component/mediaTable';
import { MediaType } from '@atlaskit/media-client';
import { NameCell, NameCellWrapper } from '../component/styled';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import { MediaTableItem } from '../types';

describe('MediaTable', () => {
  const onSetPageMock = jest.fn();
  const onSortMock = jest.fn();
  const onPreviewOpenMock = jest.fn();
  const onPreviewCloseMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  const defaultFileState = createFileStateSubject({
    id: imageFileId.id,
    status: 'processed',
    name: 'file_name',
    size: 10,
    artifacts: {},
    mediaType: 'image',
    mimeType: '',
    createdAt: 1476238235395,
  });

  const getDefaultMediaClient = (
    fileStateSubject: ReplaySubject<FileState> = defaultFileState,
  ): MediaClient => {
    const mediaClient = fakeMediaClient();
    jest
      .spyOn(MediaClientModule, 'getMediaClient')
      .mockReturnValue(mediaClient);

    asMockFunction(mediaClient.file.getFileState).mockReturnValue(
      fileStateSubject,
    );

    return mediaClient;
  };

  const createMockFileData = (name: string, mediaType: MediaType) => {
    return (
      <NameCellWrapper>
        {<MediaTypeIcon type={mediaType} />}{' '}
        <NameCell>
          <span>{name}</span>
        </NameCell>
      </NameCellWrapper>
    );
  };

  const defaultHeaders: HeadType = {
    cells: [
      {
        key: 'file',
        width: 50,
        content: 'File name',
        isSortable: true,
      },
      {
        key: 'size',
        width: 20,
        content: 'Size',
        isSortable: true,
      },
      {
        key: 'date',
        width: 50,
        content: 'Upload time',
        isSortable: false,
      },
      {
        key: 'download',
        content: '',
        width: 10,
      },
    ],
  };

  const defaultItems: MediaTableItem[] = [
    {
      identifier: audioFileId,
      data: {
        file: createMockFileData('file_name', 'audio'),
        size: toHumanReadableMediaSize(10),
        date: 'some date',
      },
    },
    {
      identifier: imageFileId,
      data: {
        file: createMockFileData('file_name', 'image'),
        size: toHumanReadableMediaSize(10),
        date: 'some date',
      },
    },
  ];

  const setup = async (
    columns: HeadType = defaultHeaders,
    items: MediaTableItem[] = defaultItems,
    waitForItems: boolean = true,
    mediaClient: MediaClient = getDefaultMediaClient(),
    isLoading: boolean = false,
    itemsPerPage: number = 3,
    totalItems?: number,
  ) => {
    const mediaClientConfig = mediaClient.config;
    const createAnalyticsEventSpy = jest.fn();
    createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });
    const mediaTable = mount(
      <MediaTable
        mediaClient={mediaClient}
        items={items}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems || items.length}
        isLoading={isLoading}
        columns={columns}
        onSetPage={onSetPageMock}
        onSort={onSortMock}
        createAnalyticsEvent={createAnalyticsEventSpy}
        onPreviewOpen={onPreviewOpenMock}
        onPreviewClose={onPreviewCloseMock}
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
      createAnalyticsEventSpy,
    };
  };

  it('should open MediaViewer and call onPreviewOpen when a row is clicked', async () => {
    const { mediaTable } = await setup();
    const rows = mediaTable.find(DynamicTableStateless).prop('rows');

    if (rows && rows[0].onClick) {
      rows[0].onClick({} as any);
    }

    mediaTable.update();

    expect(mediaTable.find(MediaViewer)).toHaveLength(1);
    expect(onPreviewOpenMock).toHaveBeenCalledTimes(1);
  });

  it('should close the MediaViwer and call onPreviewClose when the preview is closed', async () => {
    const { mediaTable } = await setup();
    const rows = mediaTable.find(DynamicTableStateless).prop('rows');

    // Open the MediaViewer
    if (rows && rows[0].onClick) {
      rows[0].onClick({} as any);
    }
    mediaTable.update();

    // Close the MediaViewer
    const onCloseProp = mediaTable.find(MediaViewer).props().onClose;
    onCloseProp && onCloseProp();
    mediaTable.update();

    expect(mediaTable.find(MediaViewer)).toHaveLength(0);
    expect(onPreviewOpenMock).toHaveBeenCalledTimes(1);
    expect(onPreviewCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should pass right options to MediaViewer', async () => {
    const { mediaTable, mediaClientConfig } = await setup();
    const rows = mediaTable.find(DynamicTableStateless).prop('rows');

    if (rows && rows[1].onClick) {
      rows[1].onClick({} as any);
    }

    mediaTable.update();

    expect(mediaTable.find(MediaViewer).props()).toEqual(
      expect.objectContaining({
        dataSource: {
          list: [
            {
              id: audioFileId.id,
              mediaItemType: 'file',
              collectionName: audioFileId.collectionName,
            },
            {
              id: imageFileId.id,
              mediaItemType: 'file',
              collectionName: imageFileId.collectionName,
            },
          ],
        },
        mediaClientConfig,
        selectedItem: {
          id: imageFileId.id,
          mediaItemType: 'file',
          collectionName: imageFileId.collectionName,
        },
        collectionName: defaultCollectionName,
      }),
    );
  });

  it('should download file if download file is defined and fileState has been processed', async () => {
    const { mediaClient, mediaTable } = await setup(
      defaultHeaders,
      defaultItems,
      true,
    );

    mediaTable
      .find(DownloadIcon)
      .first()
      .simulate('click');
    expect(mediaClient.file.downloadBinary).toBeCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(mediaClient.file.downloadBinary, [
      audioFileId.id,
      'file_name',
      audioFileId.collectionName,
    ]);
  });

  it('should download file if download file is defined and fileState is still processing', async () => {
    const processingFileSubject = createFileStateSubject({
      id: imageFileId.id,
      status: 'processing',
      name: 'file_name',
      size: 10,
      mediaType: 'image',
      mimeType: '',
      createdAt: 1476238235395,
    });

    const { mediaClient, mediaTable } = await setup(
      defaultHeaders,
      defaultItems,
      true,
      getDefaultMediaClient(processingFileSubject),
    );

    mediaTable
      .find(DownloadIcon)
      .first()
      .simulate('click');

    expect(mediaClient.file.downloadBinary).toBeCalledTimes(1);
  });

  it('should render right file size', async () => {
    expect.assertions(1);
    const { mediaTable } = await setup();
    const rows = mediaTable.find(DynamicTableStateless).prop('rows');

    if (rows) {
      expect(rows[0].cells[1].content).toEqual('10 B');
    }
  });

  it('should render right date', async () => {
    expect.assertions(1);
    const { mediaTable } = await setup();
    const rows = mediaTable.find(DynamicTableStateless).prop('rows');
    if (rows) {
      expect(rows[0].cells[2].content).toEqual('some date');
    }
  });

  it('should render file type icon', async () => {
    const { mediaTable } = await setup();

    expect(mediaTable.find(ImageIcon)).toHaveLength(1);
  });

  it('should render empty table with no rows if table has no items', async () => {
    const { mediaTable } = await setup(defaultHeaders, []);

    const rowLength = mediaTable.find(DynamicTableStateless).prop('rows')
      .length;
    expect(rowLength).toEqual(0);
  });

  it('should allow rendering of custom column lengths', async () => {
    const customColumnLength = [
      ...defaultHeaders.cells,
      {
        content: 'new column header',
        width: 20,
      },
    ];
    const customHeader = { ...defaultHeaders, cells: customColumnLength };

    const { mediaTable } = await setup(customHeader);
    const columnLength = mediaTable.find(DynamicTableStateless).prop('head')
      .cells.length;

    expect(columnLength).toEqual(5);
  });

  it('should have matching row data length and column length', async () => {
    const { mediaTable } = await setup();
    const columnLength = mediaTable.find(DynamicTableStateless).prop('head')
      .cells.length;
    const rowDataLength = mediaTable.find(DynamicTableStateless).prop('rows')[0]
      .cells.length;

    expect(columnLength).toEqual(4);
    expect(rowDataLength).toEqual(columnLength);
  });

  it('should render empty column, if value not provided for that column', async () => {
    const customItems = [
      {
        identifier: audioFileId,
        data: {
          file: createMockFileData('file_name', 'audio'),
          size: toHumanReadableMediaSize(10),
        },
      },
    ];

    const { mediaTable } = await setup(defaultHeaders, customItems, true);

    const columnValue = mediaTable.find(DynamicTableStateless).prop('rows')[0]
      .cells[2].content;
    expect(columnValue).toEqual('');
  });

  it('should still render cell data for each row even if internal media API fails', async () => {
    const { mediaTable } = await setup(defaultHeaders, defaultItems, false);

    const rowDataLength = mediaTable.find(DynamicTableStateless).prop('rows')[0]
      .cells.length;

    expect(rowDataLength).toEqual(4);
  });

  it('should have same number of table rows as rows passed in', async () => {
    const { mediaTable } = await setup();

    const tableLength = mediaTable.find(DynamicTableStateless).prop('rows')
      .length;

    expect(tableLength).toEqual(2);
  });

  it('should not show pagination when totalItems is less than itemsPerPage', async () => {
    const { mediaTable } = await setup(
      defaultHeaders,
      defaultItems,
      true,
      getDefaultMediaClient(),
      false,
      6,
      5,
    );

    const tableLength = mediaTable.find(DynamicTableStateless).prop('rows')
      .length;

    expect(tableLength).toEqual(2);
  });

  describe('loading spinner', () => {
    test('should be displayed when isLoading is set to true', async () => {
      const { mediaTable } = await setup(
        defaultHeaders,
        defaultItems,
        true,
        getDefaultMediaClient(),
        true,
      );

      const isShowingLoadingSpinner = mediaTable
        .find(DynamicTableStateless)
        .prop('isLoading');

      expect(isShowingLoadingSpinner).toEqual(true);
    });

    test('should not be displayed when isLoading is set to false', async () => {
      const { mediaTable } = await setup(
        defaultHeaders,
        defaultItems,
        true,
        getDefaultMediaClient(),
        false,
      );

      const isShowingLoadingSpinner = mediaTable
        .find(DynamicTableStateless)
        .prop('isLoading');

      expect(isShowingLoadingSpinner).toEqual(false);
    });
  });

  describe('onSort', () => {
    test('is called with correct data when a sortable header item is clicked', async () => {
      const { mediaTable } = await setup();

      mediaTable.find(DynamicTableStateless).prop('onSort')({
        key: 'file',
        sortOrder: 'DESC',
        item: {
          content: 'File name',
          isSortable: true,
          key: 'file',
        },
      });

      expect(onSortMock).toHaveBeenCalledTimes(1);
      expect(onSortMock).toHaveBeenCalledWith('file', 'DESC');
    });

    test('is not called with correct data when a non-sortable header item is clicked', async () => {
      const { mediaTable } = await setup();

      mediaTable.find(DynamicTableStateless).prop('onSort')({
        key: 'date',
        sortOrder: 'DESC',
        item: {
          content: 'Upload time',
          isSortable: false,
          key: 'file',
        },
      });

      expect(onSortMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('onSetPage', () => {
    test('is called when navigating to another page', async () => {
      const { mediaTable } = await setup();

      mediaTable.find(DynamicTableStateless).prop('onSetPage')(2);

      expect(onSetPageMock).toHaveBeenCalledTimes(1);
      expect(onSetPageMock).toHaveBeenCalledWith(2);
    });
  });

  describe('i18n', () => {
    it('does not render the IntlProvider internally if intl is present in context', () => {
      const wrapper = mount(
        <IntlProvider locale="en">
          <MediaTable
            mediaClient={getDefaultMediaClient()}
            items={defaultItems}
            itemsPerPage={3}
            totalItems={defaultItems.length}
            isLoading={false}
            columns={defaultHeaders}
            createAnalyticsEvent={jest.fn()}
          />
        </IntlProvider>,
      );

      const mediaTable = wrapper.find(MediaTable);
      expect(mediaTable.find(IntlProvider).exists()).toEqual(false);
    });

    it('renders the IntlProvider internally if intl is not present in context', async () => {
      const { mediaTable } = await setup();
      expect(mediaTable.find(IntlProvider).exists()).toEqual(true);
    });
  });

  describe('analyticsEvent', () => {
    it('should trigger UI analyticsEvent when mediaTable row is clicked', async () => {
      const { mediaTable, createAnalyticsEventSpy } = await setup();

      const rows = mediaTable.find(DynamicTableStateless).prop('rows');

      if (rows && rows[0].onClick) {
        rows[0].onClick({} as any);
      }

      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'mediaFile',
        actionSubjectId: 'mediaFileRow',
        eventType: 'ui',
      });
    });
  });
});
