import React from 'react';
import { shallow } from 'enzyme';
import { ProcessedFileState } from '@atlaskit/media-client';
import {
  fakeMediaClient,
  sleep,
  mountWithIntlContext,
} from '@atlaskit/media-test-helpers';

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
  Content,
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
import { Spinner } from '../../../../../newgen/loading';
import {
  ENCRYPTED_ENTRY_ERROR_MESSAGE,
  NO_NAME_OR_SRC_ERROR_MESSAGE,
} from '../../../../../newgen/viewers/archiveSidebar/consts';
import { zipEntryLoadSucceededEvent } from '../../../../../newgen/analytics/archive-viewer';

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
      onZipFileLoadError: () => {},
      onSuccess: () => {},
    };
    const props = { ...baseProps, ...passedProps };
    return shallow(<ArchiveViewerBase {...props} />);
  }

  function mountComponentWithContext() {
    const createAnalyticsEventSpy = jest.fn();
    createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });
    const el = mountWithIntlContext<Content, ArchiveViewerProps, any>(
      <ArchiveViewerBase
        mediaClient={mediaClient}
        item={fileState}
        collectionName={collectionName}
        onZipFileLoadError={() => {}}
        onSuccess={() => {}}
        createAnalyticsEvent={createAnalyticsEventSpy}
      />,
    );
    return { el, createAnalyticsEventSpy };
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
    expect(errorMessage.getElement().props.error.errorName).toEqual(
      'encryptedEntryPreviewFailed',
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
  it('should render error with message NO_NAME_OR_SRC_ERROR_MESSAGE if no name', async () => {
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
    expect(errorMessage.getElement().props.error.innerError.message).toEqual(
      NO_NAME_OR_SRC_ERROR_MESSAGE,
    );
  });
  it('should call onZipFileLoadError if error isZipFileLevelError is true', async () => {
    const onZipFileLoadErrorMock = jest.fn();
    const el = mountComponent({ onZipFileLoadError: onZipFileLoadErrorMock });
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onError')(new Error());
    expect(onZipFileLoadErrorMock).toBeCalledTimes(1);
  });
  it('onError should set the state as errored', async () => {
    const onZipFileLoadErrorMock = jest.fn();
    const error = new Error();
    const el = mountComponent({ onZipFileLoadError: onZipFileLoadErrorMock });
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    archiveSidebarRenderer.prop('onError')(error);
    const state = el.state() as any;
    expect(state.content.data.error).toEqual(error);
    expect(state.content.data.isErrored).toBeTruthy();
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
  it('should fire analytics', async () => {
    const { el, createAnalyticsEventSpy } = mountComponentWithContext();
    const archiveSidebarRenderer = el.find(ArchiveSidebarRenderer);
    const entry = {
      isDirectory: false,
      name: 'file_a.jpeg',
      src: 'src',
      blob: jest.fn(),
    } as any;
    archiveSidebarRenderer.prop('onSelectedArchiveEntryChange')(entry);
    await sleep(0);
    expect(createAnalyticsEventSpy).toBeCalledWith(
      zipEntryLoadSucceededEvent(entry, fileState),
    );
  });
});
