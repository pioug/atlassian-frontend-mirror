import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@atlaskit/analytics-next', () => {
  const createAnalyticsEvent = jest.fn(() => ({ fire: jest.fn() }));
  return {
    ...jest.requireActual('@atlaskit/analytics-next'),
    useAnalyticsEvents: () => ({ createAnalyticsEvent }),
  };
});

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getMockMediaClient } from '@atlaskit/editor-test-helpers/media-client-mock';
import type {
  ErrorFileState,
  FileIdentifier,
  FileState,
  ProcessingFailedState,
} from '@atlaskit/media-client';
import { createMediaSubject, fromObservable } from '@atlaskit/media-client';
import {
  asMock,
  fakeIntl,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { MediaInlineImageCardInternal as MediaInlineImageCard } from '../../media-inline-image-card';

describe('<MediaInlineImageCard />', () => {
  const identifier: FileIdentifier = {
    id: 'test-id',
    mediaItemType: 'file',
  };

  const mediaClient = fakeMediaClient();
  let mockFileState: FileState = {} as unknown as FileState;

  let observable = createMediaSubject();
  beforeEach(() => {
    jest.clearAllMocks();
    observable = createMediaSubject();
    asMock(mediaClient.file.getFileState).mockReturnValue(
      fromObservable(observable),
    );
    observable.next(mockFileState);
    mockFileState = {
      status: 'processing',
      id: '1234',
      name: '',
      size: 1024,
      mediaType: 'image',
      mimeType: 'image/png',
    };
  });

  it('should render loading view when status is unavailable', async () => {
    asMock(mediaClient.file.getFileState).mockReturnValueOnce(
      createMediaSubject(),
    );
    const { getByTestId } = render(
      <MediaInlineImageCard
        identifier={identifier}
        mediaClient={mediaClient}
        intl={fakeIntl}
      />,
    );
    expect(getByTestId('media-inline-image-card-loading-view')).toBeDefined();
  });

  it('should render error view when status is error', async () => {
    asMock(mediaClient.file.getFileState).mockReturnValueOnce(
      createMediaSubject({ status: 'error' } as ErrorFileState),
    );
    const { getByTestId } = render(
      <MediaInlineImageCard
        identifier={identifier}
        mediaClient={mediaClient}
        intl={fakeIntl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId('media-inline-image-card-error-view')).toBeDefined();
    });
  });

  it('should render error view when status is failed-processing', async () => {
    asMock(mediaClient.file.getFileState).mockReturnValueOnce(
      createMediaSubject({
        status: 'failed-processing',
      } as ProcessingFailedState),
    );
    const { getByTestId } = render(
      <MediaInlineImageCard
        identifier={identifier}
        mediaClient={mediaClient}
        intl={fakeIntl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId('media-inline-image-card-error-view')).toBeDefined();
    });

    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'failed',
      eventType: 'operational',
      actionSubject: 'mediaInlineRender',
      attributes: {
        status: 'fail',
        failReason: 'failed-processing',
        fileAttributes: {
          fileId: '',
          fileStatus: 'failed-processing',
        },
      },
    });
  });

  it('should render error view when file name does not exist', async () => {
    mockFileState = {
      status: 'processing',
      id: '1234',
      name: undefined,
      size: 1024,
      mediaType: 'image',
      mimeType: 'image/png',
    } as unknown as FileState;

    const { getByTestId } = render(
      <MediaInlineImageCard
        identifier={identifier}
        mediaClient={mediaClient}
        intl={fakeIntl}
      />,
    );
    await waitFor(() => {
      expect(getByTestId('media-inline-image-card-error-view')).toBeDefined();
    });

    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'failed',
      eventType: 'operational',
      actionSubject: 'mediaInlineRender',
      metadataTraceContext: undefined,
      attributes: {
        error: 'emptyFileName',
        errorDetail: 'emptyFileName',
        failReason: 'metadata-fetch',
        status: 'fail',
        fileAttributes: {
          fileId: '1234',
          fileStatus: 'processing',
        },
      },
    });
  });

  it('should render error view for subscription error', async () => {
    observable.error(new Error('test error'));
    const { getByTestId } = render(
      <MediaInlineImageCard
        identifier={identifier}
        mediaClient={mediaClient}
        intl={fakeIntl}
      />,
    );

    await waitFor(() => {
      expect(getByTestId('media-inline-image-card-error-view')).toBeDefined();
    });
  });

  it('should render error for empty file name', () => {
    observable.next({
      status: 'processing',
      id: 'test-id',
      name: '',
      size: 1024,
      mediaType: 'image',
      mimeType: 'image/png',
    });
    const { getByTestId } = render(
      <MediaInlineImageCard
        intl={fakeIntl}
        identifier={identifier}
        mediaClient={mediaClient}
      />,
    );
    expect(getByTestId('media-inline-image-card-error-view')).toBeDefined();
  });

  it('should render tooltip for error view', async () => {
    asMock(mediaClient.file.getFileState).mockReturnValueOnce(
      createMediaSubject({ status: 'error' } as ErrorFileState),
    );
    const { getByTestId, getByRole } = render(
      <MediaInlineImageCard
        identifier={identifier}
        mediaClient={mediaClient}
        intl={fakeIntl}
      />,
    );

    const errorView = await waitFor(() =>
      getByTestId('media-inline-image-card-error-view'),
    );
    expect(errorView).toBeDefined();
    const icon = getByTestId('media-inline-image-card-icon');
    await userEvent.hover(icon);

    const tooltip = await waitFor(() => getByRole('tooltip'));
    expect(tooltip).toBeDefined();
    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'failed',
      eventType: 'operational',
      actionSubject: 'mediaInlineRender',
      attributes: {
        error: 'nativeError',
        errorDetail: '',
        status: 'fail',
        failReason: 'error-file-state',
        metadataTraceContext: undefined,
        fileAttributes: {
          fileId: '',
          fileStatus: 'error',
        },
      },
    });
  });

  it('should render card when successful', async () => {
    const identifier: FileIdentifier = {
      id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
      mediaItemType: 'file',
      collectionName: 'MediaServicesSample',
    };

    const mediaClient = getMockMediaClient();

    const { getByTestId } = render(
      <MediaInlineImageCard
        identifier={identifier}
        mediaClient={mediaClient}
        intl={fakeIntl}
      />,
    );

    const cardView = await waitFor(() => getByTestId('media-image'));
    expect(cardView).toBeDefined();
    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(useAnalyticsEvents().createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'succeeded',
      eventType: 'operational',
      actionSubject: 'mediaInlineRender',
      attributes: {
        status: 'success',
        fileAttributes: {
          fileId: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
          fileMediatype: 'image',
          fileMimetype: 'image/png',
          fileSize: 1134,
          fileStatus: 'processed',
        },
      },
    });
  });

  describe('media inline image card should open media previewer when shouldOpenMediaViewer is true', () => {
    ffTest(
      'platform.editor.media.inline-image.renderer-preview-support_3w1ju',
      async () => {
        const identifier: FileIdentifier = {
          id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
          mediaItemType: 'file',
          collectionName: 'MediaServicesSample',
        };

        const mediaClient = getMockMediaClient();

        const { getByTestId } = render(
          <MediaInlineImageCard
            identifier={identifier}
            mediaClient={mediaClient}
            intl={fakeIntl}
            shouldOpenMediaViewer
          />,
        );

        await userEvent.click(getByTestId('inline-image-wrapper'));

        expect(getByTestId('media-viewer-popup')).toBeDefined();
      },
      async () => {
        const identifier: FileIdentifier = {
          id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
          mediaItemType: 'file',
          collectionName: 'MediaServicesSample',
        };

        const mediaClient = getMockMediaClient();

        const { getByTestId, queryByTestId } = render(
          <MediaInlineImageCard
            identifier={identifier}
            mediaClient={mediaClient}
            intl={fakeIntl}
            shouldOpenMediaViewer
          />,
        );

        await userEvent.click(getByTestId('inline-image-wrapper'));

        expect(queryByTestId('media-viewer-popup')).toBeNull();
      },
    );
  });

  describe('media inline image card should not open media previewer when shouldOpenMediaViewer is undefined', () => {
    ffTest(
      'platform.editor.media.inline-image.renderer-preview-support_3w1ju',
      async () => {
        const identifier: FileIdentifier = {
          id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
          mediaItemType: 'file',
          collectionName: 'MediaServicesSample',
        };

        const mediaClient = getMockMediaClient();

        const { getByTestId, queryByTestId } = render(
          <MediaInlineImageCard
            identifier={identifier}
            mediaClient={mediaClient}
            intl={fakeIntl}
          />,
        );

        await userEvent.click(getByTestId('inline-image-wrapper'));

        expect(queryByTestId('media-viewer-popup')).toBeNull();
      },
    );
  });

  describe('media inline image card should not open media previewer when shouldOpenMediaViewer is true but mediaClient is undefined', () => {
    ffTest(
      'platform.editor.media.inline-image.renderer-preview-support_3w1ju',
      async () => {
        const identifier: FileIdentifier = {
          id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
          mediaItemType: 'file',
          collectionName: 'MediaServicesSample',
        };

        const { getByTestId, queryByTestId } = render(
          <MediaInlineImageCard
            identifier={identifier}
            intl={fakeIntl}
            shouldOpenMediaViewer
          />,
        );

        await userEvent.click(getByTestId('inline-image-wrapper'));

        expect(queryByTestId('media-viewer-popup')).toBeNull();
      },
    );
  });

  it('MediaInlineImageCard with SSR support', async () => {
    const ssrMediaClient = getMockMediaClient();

    const { getByTestId } = render(
      <MediaInlineImageCard
        identifier={{
          id: 'a4d851f3-a9b7-40c7-8bd9-3df41b6481cd',
          mediaItemType: 'file',
          collectionName: 'MediaServicesSample',
        }}
        mediaClient={ssrMediaClient}
        intl={fakeIntl}
        ssr={{
          mode: 'server',
          config: ssrMediaClient.config,
        }}
      />,
    );

    const cardView = await waitFor(() => getByTestId('media-image'));
    expect(cardView).toBeDefined();
  });

  it.each([
    [200, 200, 1],
    [250, 200, 1.25],
    [200, undefined, ''],
    [undefined, 200, ''],
    [undefined, undefined, ''],
  ])(
    'should render correct aspect ratio according to the width and height provided',
    async (width, height, ratio) => {
      const { findByTestId } = render(
        <MediaInlineImageCard
          identifier={identifier}
          mediaClient={mediaClient}
          intl={fakeIntl}
          width={width}
          height={height}
        />,
      );

      const wrapper = await findByTestId('inline-image-wrapper');

      const style = window.getComputedStyle(wrapper);

      expect(
        style.getPropertyValue('--editor-media-inline-image-aspect-ratio'),
      ).toBe(`${ratio}`);
    },
  );

  it.each([
    [0, undefined, '', ''],
    [0, '#000000', '', ''],
    [4, undefined, '', ''],
    [4, '#000000', 4, '#000000'],
    [1, undefined, '', ''],
    [1, '#000000', 1, '#000000'],
    [2, '#FF0000', 2, '#FF0000'],
  ])(
    'should render with correct border properties when border mark applied',
    async (
      borderSize,
      borderColor,
      borderSizeRenderedProp,
      borderColorRenderedProp,
    ) => {
      const { findByTestId } = render(
        <MediaInlineImageCard
          identifier={identifier}
          mediaClient={mediaClient}
          intl={fakeIntl}
          border={{ borderSize, borderColor }}
        />,
      );

      const wrapper = await findByTestId('inline-image-wrapper');

      const style = window.getComputedStyle(wrapper);

      expect(
        style.getPropertyValue('--editor-media-inline-image-border-size'),
      ).toBe(`${borderSizeRenderedProp}`);
      expect(
        style.getPropertyValue('--editor-media-inline-image-border-color'),
      ).toBe(`${borderColorRenderedProp}`);
    },
  );
});
