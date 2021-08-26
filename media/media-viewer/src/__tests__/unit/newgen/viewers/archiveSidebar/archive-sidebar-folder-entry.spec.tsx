jest.mock('@atlaskit/media-common');

import React from 'react';
import { mount } from 'enzyme';
import {
  ArchiveSidebarFolderEntry,
  ArchiveSidebarFolderProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-folder-entry';
import { fakeMediaClient, sleep } from '@atlaskit/media-test-helpers';
import { Item } from '@atlaskit/navigation-next';
import {
  ArchiveSidebarFolderWrapper,
  ArchiveSidebarFileEntryWrapper,
  ArchiveDownloadButtonWrapper,
} from '../../../../../viewers/archiveSidebar/styled';
import { ZipEntry } from 'unzipit';
import Folder24Icon from '@atlaskit/icon-file-type/glyph/folder/24';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';
import * as MediaCommon from '@atlaskit/media-common';

afterEach(() => {
  jest.resetAllMocks();
});

describe('ArchiveSidebarFolderEntry', () => {
  const baseProps = {
    root: '',
    entries: {},
    mediaClient: fakeMediaClient(),
    onEntrySelected: () => {},
    isArchiveEntryLoading: false,
    onError: () => {},
  };

  function mountBaseComponent(props: Partial<ArchiveSidebarFolderProps>) {
    const passedProps = { ...baseProps, ...props };
    return mount(<ArchiveSidebarFolderEntry {...passedProps} />);
  }

  it('should render ArchiveSidebarFolderWrapper but not Item element if no entries', () => {
    const el = mountBaseComponent({});
    expect(el.find(ArchiveSidebarFolderWrapper)).toHaveLength(1);
    expect(el.find(Item)).toHaveLength(0);
  });
  it('should render Item and not DownloadIcon element if entry is directory', () => {
    const props = {
      entries: {
        folder1: {
          name: 'folder1',
          isDirectory: true,
        } as ZipEntry,
      },
      root: '',
    };
    const el = mountBaseComponent(props);
    expect(el.find(Item)).toHaveLength(1);
    expect(el.find(DownloadIcon)).toHaveLength(0);
  });
  it('should render DownloadIcon element if entry is not directory', () => {
    const props = {
      entries: {
        folder1: {
          name: 'file1',
          isDirectory: false,
        } as ZipEntry,
      },
      root: '',
    };
    const el = mountBaseComponent(props);
    expect(el.find(DownloadIcon)).toHaveLength(1);
  });
  it('should render Folder24Icon and not MediaTypeIcon if entry is directory', () => {
    const props = {
      entries: {
        folder1: {
          name: 'folder1',
          isDirectory: true,
        } as ZipEntry,
      },
      root: '',
    };
    const el = mountBaseComponent(props);
    expect(el.find(Folder24Icon)).toHaveLength(1);
    expect(el.find(MediaTypeIcon)).toHaveLength(0);
  });
  it('should render MediaTypeIcon and not Folder24Icon if entry is not directory', () => {
    const props = {
      entries: {
        folder1: {
          name: 'file1',
          isDirectory: false,
        } as ZipEntry,
      },
      root: '',
    };
    const el = mountBaseComponent(props);
    expect(el.find(Folder24Icon)).toHaveLength(0);
    expect(el.find(MediaTypeIcon)).toHaveLength(1);
  });
  it('should ignore MAC private file', () => {
    const props = {
      entries: {
        __MACOSX: {
          name: '__MACOSX/abc',
          isDirectory: false,
        } as ZipEntry,
      },
      root: '',
    };
    const el = mountBaseComponent(props);
    expect(el.find(Item)).toHaveLength(0);
  });
  it('should render Item as many times as entries are given', () => {
    const props = {
      entries: {
        folder1: {
          name: 'folder1',
          isDirectory: true,
        } as ZipEntry,
        folder2: {
          name: 'folder2',
          isDirectory: true,
        } as ZipEntry,
        file1: {
          name: 'file1',
          isDirectory: false,
        } as ZipEntry,
        file2: {
          name: 'file2',
          isDirectory: false,
        } as ZipEntry,
        file3: {
          name: 'file3',
          isDirectory: false,
        } as ZipEntry,
      },
      root: '',
    };
    const el = mountBaseComponent(props);
    expect(el.find(Item)).toHaveLength(5);
    expect(el.find(MediaTypeIcon)).toHaveLength(3);
    expect(el.find(Folder24Icon)).toHaveLength(2);
    expect(el.find(DownloadIcon)).toHaveLength(3);
    expect(el.find(ArchiveSidebarFolderWrapper)).toHaveLength(1);
  });
  it('ArchiveSidebarFileEntryWrapper should have name as entry key', () => {
    const props = {
      entries: {
        folder1: {
          name: 'folder1',
          isDirectory: true,
        } as ZipEntry,
      },
      root: '',
    };
    const el = mountBaseComponent(props);
    expect(el.find(ArchiveSidebarFileEntryWrapper).getElement().key).toEqual(
      'folder1',
    );
  });
  it('Item should be called with file name as text prop', () => {
    const props = {
      entries: {
        entry1: {
          name: 'root/entry1.jpg',
          isDirectory: false,
        } as ZipEntry,
      },
      root: 'root/',
    };
    const el = mountBaseComponent(props);
    expect(el.find(Item)).toHaveLength(1);
    expect(el.find(Item).prop('text')).toEqual('entry1.jpg');
  });
  it('Clicking downloadButtonWrapper should call downloadUrl', async () => {
    const entry: Partial<ZipEntry> = {
      name: 'root/entry1.jpg',
      isDirectory: false,
      blob: jest.fn().mockReturnValue(''),
    };
    const props: Partial<ArchiveSidebarFolderProps> = {
      entries: {
        entry,
      } as any,
      root: 'root/',
    };
    const el = mountBaseComponent(props);
    const downloadButtonWrapper = el.find(ArchiveDownloadButtonWrapper);
    expect(downloadButtonWrapper).toHaveLength(1);
    downloadButtonWrapper.simulate('click');
    await sleep(0);
    expect(MediaCommon.downloadUrl).toHaveBeenCalled();
  });
  it('should call onError if rejectAfter throws an error', async () => {
    const entry: Partial<ZipEntry> = {
      name: 'root/entry1.jpg',
      isDirectory: false,
      blob: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    };
    const onErrorMock = jest.fn();
    const props: Partial<ArchiveSidebarFolderProps> = {
      entries: {
        entry,
      } as any,
      root: 'root/',
      onError: onErrorMock,
    };
    const el = mountBaseComponent(props);
    el.find(ArchiveDownloadButtonWrapper).simulate('click');
    await sleep(0);
    expect(onErrorMock).toHaveBeenCalledWith(new Error(), entry);
    expect(MediaCommon.downloadUrl).toHaveBeenCalledTimes(0);
  });
});
