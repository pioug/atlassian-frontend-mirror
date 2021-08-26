jest.mock('unzipit', () => ({
  unzip: () => {
    return {
      archive: 'file',
      entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
    };
  },
  HTTPRangeReader: () => 'reader',
}));
jest.unmock('../../../../../utils');

import React from 'react';
import { mount } from 'enzyme';
import { fakeMediaClient, sleep } from '@atlaskit/media-test-helpers';
import {
  ArchiveSidebar,
  ArchiveSidebarProps,
  ArchiveSidebarState,
} from '../../../../../viewers/archiveSidebar/archive-sidebar';
import { ArchiveSidebarFolderEntry } from '../../../../../viewers/archiveSidebar/archive-sidebar-folder-entry';
import { ArchiveSidebarHeader } from '../../../../../viewers/archiveSidebar/archive-sidebar-header';
import { ZipEntry } from 'unzipit';

describe('ArchiveSidebar', () => {
  const mediaClient = fakeMediaClient();

  function mountBaseComponent(props: Partial<ArchiveSidebarProps>) {
    const baseProps = {
      entries: {},
      onEntrySelected: () => {},
      onHeaderClicked: () => {},
      mediaClient: mediaClient,
      isArchiveEntryLoading: false,
      onError: () => {},
    };
    const passedProps = { ...baseProps, ...props };
    return mount(<ArchiveSidebar {...passedProps} />);
  }

  it('should render expected elements', () => {
    const el = mountBaseComponent({});
    expect(el.find(ArchiveSidebarFolderEntry)).toHaveLength(1);
    expect(el.find(ArchiveSidebarHeader)).toHaveLength(1);
  });
  it('should set root using passed in entry', async () => {
    const entry = {
      name: 'folder1',
      isDirectory: true,
    } as ZipEntry;

    const onEntrySelectedMock = jest.fn();
    const el = mountBaseComponent({ onEntrySelected: onEntrySelectedMock });
    const archiveSidebarFolderEntry = el.find(ArchiveSidebarFolderEntry);
    archiveSidebarFolderEntry.prop('onEntrySelected')(entry);
    await sleep(0);
    el.update();
    // Need to find element again, as the results of .find() are immutable
    expect(el.find(ArchiveSidebarFolderEntry).prop('root')).toEqual('folder1');
  });
  it('should call extractArchiveFolderName if entry is archive', async () => {
    const entry = {
      name: 'archive.zip',
      isDirectory: false,
      blob: jest.fn(),
    } as any;

    const onEntrySelectedMock = jest.fn();
    const el = mountBaseComponent({ onEntrySelected: onEntrySelectedMock });
    const archiveSidebarFolderEntry = el.find(ArchiveSidebarFolderEntry);
    archiveSidebarFolderEntry.prop('onEntrySelected')(entry);
    await sleep(0);
    const archiveSidebarState = el.state() as ArchiveSidebarState;
    expect(archiveSidebarState.currentArchiveSidebarFolder.root).toEqual(
      'archive/',
    );
    expect(archiveSidebarState.currentArchiveSidebarFolder.name).toEqual(
      'archive/',
    );
  });
  it('should update state when entry is selected', async () => {
    const entry = {
      name: 'archive.zip',
      isDirectory: false,
      blob: jest.fn(),
    } as any;

    const onEntrySelectedMock = jest.fn();
    const el = mountBaseComponent({ onEntrySelected: onEntrySelectedMock });
    const archiveSidebarFolderEntry = el.find(ArchiveSidebarFolderEntry);
    archiveSidebarFolderEntry.prop('onEntrySelected')(entry);
    await sleep(0);
    const archiveSidebarState = el.state() as ArchiveSidebarState;
    expect(archiveSidebarState.currentArchiveSidebarFolder.root).toEqual(
      'archive/',
    );
    expect(archiveSidebarState.currentArchiveSidebarFolder.name).toEqual(
      'archive/',
    );
  });
  it('should not call onEntrySelected if entry is directory', async () => {
    const entry = {
      name: 'folder_1',
      isDirectory: true,
      blob: jest.fn(),
    } as any;

    const onEntrySelectedMock = jest.fn();
    const el = mountBaseComponent({ onEntrySelected: onEntrySelectedMock });
    const archiveSidebarFolderEntry = el.find(ArchiveSidebarFolderEntry);
    archiveSidebarFolderEntry.prop('onEntrySelected')(entry);
    await sleep(0);
    expect(onEntrySelectedMock).toBeCalledTimes(0);
  });
  it('ArchiveSidebarHeaders onClick should trigger its onHeaderClicked callback', async () => {
    const onHeaderClickedMock = jest.fn();
    const el = mountBaseComponent({
      onHeaderClicked: onHeaderClickedMock,
    });
    const archiveSidebarHeader = el.find(ArchiveSidebarHeader);
    archiveSidebarHeader.prop('onHeaderClick')();
    expect(onHeaderClickedMock).toHaveBeenCalled();
  });
  it('ArchiveSidebarHeaders onHeaderClicked callback should update state', async () => {
    const entry = {
      name: 'root/archive.zip',
      isDirectory: false,
      blob: jest.fn(),
    } as any;
    const onEntrySelectedMock = jest.fn();
    const onHeaderClickedMock = jest.fn();
    const el = mountBaseComponent({
      onHeaderClicked: onHeaderClickedMock,
      onEntrySelected: onEntrySelectedMock,
      entries: { entry },
    });
    const archiveSidebarFolderEntry = el.find(ArchiveSidebarFolderEntry);
    archiveSidebarFolderEntry.prop('onEntrySelected')(entry);
    const archiveSidebarHeader = el.find(ArchiveSidebarHeader);
    await sleep(0);
    archiveSidebarHeader.prop('onHeaderClick')();
    expect(onHeaderClickedMock).toHaveBeenCalled();
    const archiveSidebarState = el.state() as ArchiveSidebarState;
    expect(archiveSidebarState.currentArchiveSidebarFolder.root).toEqual(
      'root/',
    );
    expect(archiveSidebarState.currentArchiveSidebarFolder.name).toEqual(
      'root/',
    );
  });
  it('should call onError if rejectAfter throws an error', async () => {
    const entry = {
      name: 'archive.zip',
      isDirectory: false,
      blob: jest.fn().mockImplementation(() => {
        throw new Error('error');
      }),
    } as any;

    const onErrorMock = jest.fn();
    const onEntrySelectedMock = jest.fn();
    const el = mountBaseComponent({
      onEntrySelected: onEntrySelectedMock,
      onError: onErrorMock,
    });
    const archiveSidebarFolderEntry = el.find(ArchiveSidebarFolderEntry);
    archiveSidebarFolderEntry.prop('onEntrySelected')(entry);
    await sleep(0);
    expect(onErrorMock).toBeCalledWith(new Error('error'), entry);
  });
});
