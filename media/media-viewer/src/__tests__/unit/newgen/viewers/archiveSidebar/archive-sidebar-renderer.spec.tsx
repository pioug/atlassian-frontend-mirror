jest.mock('unzipit', () => ({
  unzip: jest.fn().mockImplementation(() => {
    return {
      archive: 'file',
      entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
    };
  }),
  HTTPRangeReader: () => 'reader',
}));

import React from 'react';
import { shallow } from 'enzyme';
import { ProcessedFileState } from '@atlaskit/media-client';
import { fakeMediaClient, sleep } from '@atlaskit/media-test-helpers';
import ArchiveSidebarRenderer, {
  ArchiveSidebarRendererProps,
} from '../../../../../viewers/archiveSidebar/archive-sidebar-renderer';
import { ArchiveSideBar } from '../../../../../viewers/archiveSidebar/styled';
import { SpinnerWrapper } from '../../../../../styled';
import { ArchiveSidebar } from '../../../../../viewers/archiveSidebar/archive-sidebar';
import { unzip, ZipEntry } from 'unzipit';

describe('ArchiveSidebarRenderer', () => {
  const fileState: ProcessedFileState = {
    id: 'some-id',
    status: 'processed',
    name: 'file',
    size: 11222,
    mediaType: 'archive',
    mimeType: 'zip',
    artifacts: {},
    representations: {
      image: {},
    },
  };
  const mediaClient = fakeMediaClient();
  const collectionName = 'some-collection';

  function mountBaseComponent(props: Partial<ArchiveSidebarRendererProps>) {
    const baseProps = {
      selectedFileState: fileState,
      mediaClient: mediaClient,
      onSelectedArchiveEntryChange: () => {},
      onHeaderClicked: () => {},
      isArchiveEntryLoading: false,
      collectionName: collectionName,
      onError: () => {},
      onSuccess: () => {},
    };
    const passedProps = { ...baseProps, ...props };
    return shallow(<ArchiveSidebarRenderer {...passedProps} />);
  }

  it('should have ArchiveSideBar element', () => {
    const el = mountBaseComponent({});
    expect(el.find(ArchiveSideBar)).toHaveLength(1);
  });
  it('should not have SpinnerWrapper element when status is loaded', async () => {
    const el = mountBaseComponent({});
    await sleep(0);
    expect(el.find(SpinnerWrapper)).toHaveLength(0);
  });
  it('should have SpinnerWrapper element when status is loading', () => {
    const el = mountBaseComponent({});
    expect(el.find(SpinnerWrapper)).toHaveLength(1);
  });

  it('should call onHeaderClicked when ArchiveSidebar header is clicked', async () => {
    const onHeaderClickedMock = jest.fn();
    const el = mountBaseComponent({
      onHeaderClicked: onHeaderClickedMock,
    });
    await sleep(0);
    const archiveSidebar = el.find(ArchiveSidebar);
    archiveSidebar.prop('onHeaderClicked')();
    expect(onHeaderClickedMock).toHaveBeenCalled();
  });

  it('archive sidebar should have isArchiveEntryLoading as true if its passed as true', async () => {
    const el = mountBaseComponent({
      isArchiveEntryLoading: true,
    });
    await sleep(0);
    const archiveSidebar = el.find(ArchiveSidebar);
    expect(archiveSidebar.prop('isArchiveEntryLoading')).toBeTruthy();
  });
  it('archive sidebar should have isArchiveEntryLoading as false if its passed as false', async () => {
    const el = mountBaseComponent({
      isArchiveEntryLoading: false,
    });
    await sleep(0);
    const archiveSidebar = el.find(ArchiveSidebar);
    expect(archiveSidebar.prop('isArchiveEntryLoading')).toBeFalsy();
  });
  it('archive sidebar should trigger onSelectedArchiveEntryChange when onEntrySelected is triggered', async () => {
    const entry = {
      name: 'folder1',
      isDirectory: true,
    } as ZipEntry;
    const onSelectedArchiveEntryChangeMock = jest.fn();
    const el = mountBaseComponent({
      isArchiveEntryLoading: false,
      onSelectedArchiveEntryChange: onSelectedArchiveEntryChangeMock,
    });
    await sleep(0);
    el.find(ArchiveSidebar).prop('onEntrySelected')(entry);
    expect(onSelectedArchiveEntryChangeMock).toHaveBeenCalled();
  });
  it('archive sidebar should have entries passed as props', async () => {
    const el = mountBaseComponent({});
    await sleep(0);
    expect(el.find(ArchiveSidebar).prop('entries')).toEqual({
      'file_a.jpeg': { name: 'file_a.jpeg' },
    });
  });
  it('should call onError if unzip has error', async () => {
    const onErrorMock = jest.fn();
    const unzipModule = unzip as jest.Mock;
    unzipModule.mockImplementation(() => {
      throw new Error('some-error');
    });
    mountBaseComponent({ onError: onErrorMock });
    await sleep(0);
    expect(onErrorMock).toBeCalledWith(new Error('archiveviewer-read-binary'));
  });
});
