jest.mock(
  '../../../../../analytics/events/operational/zipEntryLoadSucceeded',
  () => ({
    createZipEntryLoadSucceededEvent: jest.fn(),
  }),
);
jest.mock(
  '../../../../../analytics/events/operational/zipEntryLoadFailed',
  () => ({
    createZipEntryLoadFailedEvent: jest.fn(),
  }),
);

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
  ArchiveViewerBase,
  getArchiveEntriesFromFileState,
  Props as ArchiveViewerProps,
} from '../../../../../viewers/archiveSidebar/archive';
import { ArchiveLayout } from '../../../../../viewers/archiveSidebar/styled';
import { InteractiveImg } from '../../../../../viewers/image/interactive-img';
import { AudioPlayer, CustomVideoPlayerWrapper } from '../../../../../styled';
import { PDFRenderer } from '../../../../../viewers/doc/pdfRenderer';
import ArchiveSidebarRenderer from '../../../../../viewers/archiveSidebar/archive-sidebar-renderer';
import ErrorMessage from '../../../../../errorMessage';
import { ArchiveViewerError } from '../../../../../errors';
import { Spinner } from '../../../../../loading';
import { ENCRYPTED_ENTRY_ERROR_MESSAGE } from '../../../../../viewers/archiveSidebar/consts';
import { createZipEntryLoadSucceededEvent } from '../../../../../analytics/events/operational/zipEntryLoadSucceeded';
import { createZipEntryLoadFailedEvent } from '../../../../../analytics/events/operational/zipEntryLoadFailed';

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

  function mountComponent(passedProps: Partial<ArchiveViewerProps>) {
    const baseProps = {
      mediaClient: mediaClient,
      item: fileState,
      collectionName: collectionName,
      onError: () => {},
      onSuccess: () => {},
    };
    const props = { ...baseProps, ...passedProps };
    return shallow(<ArchiveViewerBase {...props} />);
  }

  it('should have ArchiveLayout element', () => {
    const el = mountComponent({});
    expect(el.find(ArchiveLayout)).toHaveLength(1);
  });
  it('should render ArchiveSidebarRenderer', () => {
    const el = mountComponent({});
    expect(el.find(ArchiveSidebarRenderer)).toHaveLength(1);
  });
  it('should render ArchiveSidebarRenderer with isArchiveEntryLoading false if isArchiveEntryLoading in state is false', async () => {
    const el = mountComponent({});
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'root',
      src: 'src',
      blob: jest.fn(),
    } as any);
    await sleep(0);
    expect((el.state() as any).content.data.isArchiveEntryLoading).toBeFalsy();
    expect(
      el.find(ArchiveSidebarRenderer).prop('isArchiveEntryLoading'),
    ).toBeFalsy();
  });
  it('should render ArchiveSidebarRenderer with isArchiveEntryLoading true if isArchiveEntryLoading in state is undefined', () => {
    const el = mountComponent({});
    expect(
      (el.state() as any).content.data.isArchiveEntryLoading,
    ).toBeUndefined();
    expect(
      el.find(ArchiveSidebarRenderer).prop('isArchiveEntryLoading'),
    ).toBeTruthy();
  });
  it('ArchiveSidebarRenderer should trigger onHeaderClicked', () => {
    const el = mountComponent({});
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onHeaderClicked')();
    expect(
      (el.state() as any).content.data.selectedArchiveEntry,
    ).toBeUndefined();
  });
  it('ArchiveSidebarRenderer should trigger onSuccess', () => {
    const onSuccessMock = jest.fn();
    const el = mountComponent({ onSuccess: onSuccessMock });
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSuccess')();
    expect(onSuccessMock).toBeCalledTimes(1);
  });
  it('ArchiveSidebarRenderer should change selected entry and render InteractiveImg', async () => {
    const el = mountComponent({});
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
    const el = mountComponent({});
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
    const el = mountComponent({});
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
    const el = mountComponent({});
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
    const el = mountComponent({});
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.doc',
      src: 'src',
      blob: jest.fn().mockImplementation(() => {
        throw new Error('some-error');
      }),
    } as any);
    await sleep(0);
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.prop('error').message).toEqual(
      'archiveviewer-create-url',
    );
  });
  it('should fail with correct error if encrypted file', async () => {
    const el = mountComponent({});
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
    expect(errorMessage.prop('error').message).toEqual(
      'archiveviewer-encrypted-entry',
    );
  });
  it('should render Spinner when entry is changed', async () => {
    const el = mountComponent({});
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: 'file_a.jpeg',
      src: 'src',
      blob: jest.fn(),
    } as any);
    expect(el.find(Spinner)).toHaveLength(1);
  });
  it('should fail with correct error if no name', async () => {
    const el = mountComponent({});
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
      isDirectory: false,
      name: '',
      src: 'src',
      blob: jest.fn(),
    } as any);
    await sleep(0);
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.prop('error').message).toEqual(
      'archiveviewer-missing-name-src',
    );
  });
  it('should call onError if error sidebar renderer has error', async () => {
    const onErrorMock = jest.fn();
    const el = mountComponent({ onError: onErrorMock });
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onError')(
      new ArchiveViewerError('archiveviewer-read-binary'),
    );
    expect(onErrorMock).toBeCalledTimes(1);
  });
  it('onError should set the state as errored', async () => {
    const onErrorMock = jest.fn();
    const error = new ArchiveViewerError('archiveviewer-create-url');
    const el = mountComponent({ onError: onErrorMock });
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onError')(error);
    const state = el.state() as any;
    expect(state.content.data.error).toEqual(error);
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

  describe('Analytics', () => {
    beforeAll(() => jest.resetAllMocks());

    it('should fire zip entry fail event if displays error', async () => {
      const el = mountComponent({});
      const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
      archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')({
        isDirectory: false,
        name: 'file_a.doc',
        src: 'src',
        blob: jest.fn().mockImplementation(() => {
          throw new Error('some-error');
        }),
      } as any);
      await sleep(0);
      const errorMessage = el.find(ErrorMessage);
      expect(errorMessage).toHaveLength(1);
      expect(createZipEntryLoadFailedEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire success analytics when image viewer loaded', async () => {
      const zipEntry = {
        isDirectory: false,
        name: 'file_a.jpeg',
        src: 'src',
        blob: jest.fn(),
      } as any;
      const el = mountComponent({});
      el.find(ArchiveSidebarRenderer).prop('onSelectedArchiveEntryChange')(
        zipEntry,
      );
      await sleep(0);
      el.find(InteractiveImg).prop('onLoad')();
      expect(createZipEntryLoadSucceededEvent).toHaveBeenCalledWith(
        {
          artifacts: {},
          id: 'some-id',
          mediaType: 'archive',
          mimeType: 'zip',
          name: 'file',
          representations: { image: {} },
          size: 11222,
          status: 'processed',
        },
        zipEntry,
      );
    });
  });
});
