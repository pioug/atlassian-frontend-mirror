import React from 'react';
import { shallow } from 'enzyme';
import { ProcessedFileState } from '@atlaskit/media-client';
import { fakeMediaClient, sleep } from '@atlaskit/media-test-helpers';

jest.mock('unzipit', () => ({
  unzip: () => {
    return {
      archive: 'file',
      entries: { 'file_a.jpeg': { name: 'file_a.jpeg' } },
    };
  },
  HTTPRangeReader: () => 'reader',
}));

import {
  ArchiveViewer,
  getArchiveEntriesFromFileState,
} from '../../../../../newgen/viewers/archiveSidebar/archive';
import { ArchiveLayout } from '../../../../../newgen/viewers/archiveSidebar/styled';
import { InteractiveImg } from '../../../../../newgen/viewers/image/interactive-img';
import {
  AudioPlayer,
  CustomVideoPlayerWrapper,
} from '../../../../../newgen/styled';
import { PDFRenderer } from '../../../../../newgen/viewers/doc/pdfRenderer';
import ArchiveSidebarRenderer from '../../../../../newgen/viewers/archiveSidebar/archive-sidebar-renderer';
import ErrorMessage from '../../../../../newgen/error';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from '../../../../../newgen/viewers/archiveSidebar/consts';

describe('Archive', () => {
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

  function mountBaseComponent() {
    return shallow(
      <ArchiveViewer
        mediaClient={mediaClient}
        item={fileState}
        collectionName={collectionName}
      />,
    );
  }

  it('should have ArchiveLayout element', () => {
    const el = mountBaseComponent();
    expect(el.find(ArchiveLayout)).toHaveLength(1);
  });
  it('should render ArchiveSidebarRenderer', () => {
    const el = mountBaseComponent();
    expect(el.find(ArchiveSidebarRenderer)).toHaveLength(1);
  });
  it('should render ArchiveSidebarRenderer with isArchiveEntryLoading false if isArchiveEntryLoading in state is false', () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: true,
      name: 'root',
      src: 'src',
      blob: jest.fn(),
    } as any);
    expect((el.state() as any).content.data.isArchiveEntryLoading).toBeFalsy();
    expect(
      el.find(ArchiveSidebarRenderer).prop('isArchiveEntryLoading'),
    ).toBeFalsy();
  });
  it('should render ArchiveSidebarRenderer with isArchiveEntryLoading true if isArchiveEntryLoading in state is undefined', () => {
    const el = mountBaseComponent();
    expect(
      (el.state() as any).content.data.isArchiveEntryLoading,
    ).toBeUndefined();
    expect(
      el.find(ArchiveSidebarRenderer).prop('isArchiveEntryLoading'),
    ).toBeTruthy();
  });
  it('ArchiveSidebarRenderer should trigger onHeaderClicked', () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onHeaderClicked')();
    expect(
      (el.state() as any).content.data.selectedArchiveEntry,
    ).toBeUndefined();
  });
  it('ArchiveSidebarRenderer should change selected entry and render InteractiveImg', async () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.jpeg',
      src: 'src',
      blob: jest.fn(),
    } as any);
    await sleep(0);
    expect(el.find(InteractiveImg)).toHaveLength(1);
  });
  it('ArchiveSidebarRenderer should change selected entry and render AudioPlayer', async () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.mp3',
      src: 'src',
      blob: jest.fn(),
    } as any);
    await sleep(0);
    expect(el.find(AudioPlayer)).toHaveLength(1);
  });
  it('ArchiveSidebarRenderer should change selected entry and render CustomVideoPlayerWrapper', async () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.mov',
      src: 'src',
      blob: jest.fn(),
    } as any);
    await sleep(0);
    expect(el.find(CustomVideoPlayerWrapper)).toHaveLength(1);
  });
  it('ArchiveSidebarRenderer should change selected entry and render PDFRenderer', async () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.doc',
      src: 'src',
      blob: jest.fn(),
    } as any);
    await sleep(0);
    expect(el.find(PDFRenderer)).toHaveLength(1);
  });
  it('should render error if rejectAfter throws an error', async () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.doc',
      src: 'src',
      blob: jest.fn().mockImplementation(() => {
        throw new Error('error');
      }),
    } as any);
    await sleep(0);
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.getElement().props.error.errorName).toEqual(
      'previewFailed',
    );
  });
  it('should render encryptedEntryPreviewFailed error if encrypted file', async () => {
    const el = mountBaseComponent();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.zip',
      src: 'src',
      blob: jest.fn().mockImplementation(() => {
        throw new Error(ENCRYPTED_ENTRY_ERROR_MESSAGE);
      }),
    } as any);
    await sleep(0);
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.getElement().props.error.errorName).toEqual(
      'encryptedEntryPreviewFailed',
    );
  });
  describe('getArchiveEntriesFromFileState', () => {
    it('should get archive entries from fileState', async () => {
      let result = await getArchiveEntriesFromFileState(fileState, mediaClient);
      expect(result).toEqual({
        archive: 'file',
        entries: {
          'file_a.jpeg': { name: 'file_a.jpeg' },
        },
      });
    });
  });
});
