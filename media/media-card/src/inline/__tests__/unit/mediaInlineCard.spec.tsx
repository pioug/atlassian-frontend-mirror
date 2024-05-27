import React from 'react';
import { MediaInlineCardInternal as MediaInlineCard } from '../../mediaInlineCard';
import { mount } from 'enzyme';
import {
  type FileIdentifier,
  type FileState,
  createMediaSubject,
  type ErrorFileState,
  fromObservable,
} from '@atlaskit/media-client';
import {
  fakeMediaClient,
  fakeIntl,
  asMock,
} from '@atlaskit/media-test-helpers';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
import { render, waitFor } from '@testing-library/react';
import * as analyticsModule from '../../../utils/analytics/analytics';

describe('<MediaInlineCard />', () => {
  const identifier: FileIdentifier = {
    id: '1234',
    mediaItemType: 'file',
  };
  const mediaClient = fakeMediaClient();
  const mockFileState: FileState = {
    status: 'processing',
    id: '1234',
    name: 'file_name',
    size: 1024,
    mediaType: 'image',
    mimeType: 'image/png',
  };
  let observable = createMediaSubject();
  const fireOperationalEvent = jest.spyOn(
    analyticsModule,
    'fireMediaCardEvent',
  );

  beforeEach(() => {
    jest.clearAllMocks();
    observable = createMediaSubject();
    asMock(mediaClient.file.getFileState).mockReturnValue(
      fromObservable(observable),
    );
    observable.next(mockFileState);
  });

  it('should render loading view while loading media file', () => {
    const mediaInlineCard = mount(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={fakeMediaClient()}
      />,
    );
    expect(mediaInlineCard.find(MediaInlineCardLoadingView)).toHaveLength(1);
  });

  it('should render loaded view when media loads successfully', async () => {
    const { getByTestId, getByText } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const loadedView = await waitFor(() =>
      getByTestId('media-inline-card-loaded-view'),
    );
    const title = await waitFor(() => getByText('file_name'));

    expect(loadedView).toBeTruthy();
    expect(title).toBeTruthy();
  });

  it('should render MediaViewer when shouldOpenMediaViewer=true and clicked', async () => {
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
        shouldOpenMediaViewer
      />,
    );
    const loadedView = await waitFor(() =>
      getByTestId('media-inline-card-loaded-view'),
    );

    loadedView.click();

    const mediaViewer = await waitFor(() => getByTestId('media-viewer-popup'));

    expect(mediaViewer).toBeTruthy();
  });

  it('should call onClick callback when provided', async () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
        onClick={onClick}
      />,
    );
    const loadedView = await waitFor(() =>
      getByTestId('media-inline-card-loaded-view'),
    );

    loadedView.click();

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(
      expect.objectContaining({ mediaItemDetails: identifier }),
    );
  });

  it('should render right media file type icon', async () => {
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const fileTypeIcon = await waitFor(() =>
      getByTestId('media-inline-card-file-type-icon'),
    );
    expect(fileTypeIcon.getAttribute('data-type')).toEqual('image');
    expect(fileTypeIcon).toBeTruthy();
  });

  it('should render right icon when mimeType is more specific than media type', async () => {
    const mockFileState: FileState = {
      status: 'processing',
      id: '1234',
      name: 'file_name',
      size: 1024,
      mediaType: 'doc',
      mimeType: 'text/csv',
    };

    asMock(mediaClient.file.getFileState).mockReturnValue(
      createMediaSubject(mockFileState),
    );

    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const fileTypeIcon = await waitFor(() =>
      getByTestId('media-inline-card-file-type-icon'),
    );
    expect(fileTypeIcon.getAttribute('data-type')).toEqual('spreadsheet');
  });

  it('should render error view', async () => {
    asMock(mediaClient.file.getFileState).mockReturnValueOnce(
      createMediaSubject({ status: 'error' } as ErrorFileState),
    );
    const { getByTestId } = render(
      <MediaInlineCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    const erroredView = await waitFor(() =>
      getByTestId('media-inline-card-errored-view'),
    );

    expect(erroredView).toBeTruthy();
  });

  describe('Analytics', () => {
    it('should send succeeded event once if file is processed and rendered', () => {
      mount(
        <MediaInlineCard
          intl={fakeIntl}
          identifier={identifier}
          mediaClient={mediaClient}
        />,
      );
      expect(fireOperationalEvent).toBeCalledTimes(0);

      observable.next({ ...mockFileState, status: 'processed', artifacts: {} });
      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        {
          eventType: 'operational',
          action: 'succeeded',
          actionSubject: 'mediaInlineRender',
          attributes: {
            status: 'success',
            fileAttributes: {
              fileId: mockFileState.id,
              fileSize: mockFileState.size,
              fileMediatype: mockFileState.mediaType,
              fileMimetype: mockFileState.mimeType,
              fileStatus: 'processed',
            },
          },
        },
        expect.any(Function),
      );
    });

    it('should send failed event once if file processing is failed', async () => {
      const { getByTestId, getByText } = render(
        <MediaInlineCard
          intl={fakeIntl}
          identifier={identifier}
          mediaClient={mediaClient}
        />,
      );

      // Should display loaded card
      const loadedView = await waitFor(() =>
        getByTestId('media-inline-card-loaded-view'),
      );
      const title = await waitFor(() => getByText('file_name'));
      expect(loadedView).toBeTruthy();
      expect(title).toBeTruthy();

      expect(fireOperationalEvent).toBeCalledTimes(0);

      observable.next({
        ...mockFileState,
        status: 'failed-processing',
        artifacts: {},
      });
      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        {
          eventType: 'operational',
          action: 'failed',
          actionSubject: 'mediaInlineRender',
          attributes: {
            status: 'fail',
            fileAttributes: {
              fileId: mockFileState.id,
              fileStatus: 'failed-processing',
            },
            failReason: 'failed-processing',
          },
        },
        expect.any(Function),
      );
    });

    it('should send failed event once if file subscription errored', () => {
      mount(
        <MediaInlineCard
          intl={fakeIntl}
          identifier={identifier}
          mediaClient={mediaClient}
        />,
      );
      expect(fireOperationalEvent).toBeCalledTimes(0);
      observable.error(new Error('test'));
      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        {
          eventType: 'operational',
          action: 'failed',
          actionSubject: 'mediaInlineRender',
          attributes: {
            status: 'fail',
            fileAttributes: {
              fileId: mockFileState.id,
              fileStatus: 'processing',
            },
            error: 'nativeError',
            errorDetail: 'test',
            failReason: 'metadata-fetch',
          },
        },
        expect.any(Function),
      );
    });

    it('should send failed event once if file state is error', () => {
      mount(
        <MediaInlineCard
          intl={fakeIntl}
          identifier={identifier}
          mediaClient={mediaClient}
        />,
      );
      expect(fireOperationalEvent).toBeCalledTimes(0);

      observable.next({
        ...mockFileState,
        status: 'error',
        message: 'serverForbidden',
      });
      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        {
          eventType: 'operational',
          action: 'failed',
          actionSubject: 'mediaInlineRender',
          attributes: {
            status: 'fail',
            fileAttributes: {
              fileId: mockFileState.id,
              fileStatus: 'error',
            },
            error: 'nativeError',
            errorDetail: 'serverForbidden',
            failReason: 'error-file-state',
          },
        },
        expect.any(Function),
      );
    });

    it('should send failed event once if file state has no filename)', () => {
      mount(
        <MediaInlineCard
          intl={fakeIntl}
          identifier={identifier}
          mediaClient={mediaClient}
        />,
      );
      expect(fireOperationalEvent).toBeCalledTimes(0);

      observable.next({
        status: 'processing',
        id: '1234',
      } as any);
      expect(fireOperationalEvent).toBeCalledTimes(1);
      expect(fireOperationalEvent).toBeCalledWith(
        {
          eventType: 'operational',
          action: 'failed',
          actionSubject: 'mediaInlineRender',
          attributes: {
            status: 'fail',
            fileAttributes: {
              fileId: mockFileState.id,
              fileStatus: 'processing',
            },
            error: 'emptyFileName',
            errorDetail: 'emptyFileName',
            failReason: 'metadata-fetch',
          },
        },
        expect.any(Function),
      );
    });
  });
});
