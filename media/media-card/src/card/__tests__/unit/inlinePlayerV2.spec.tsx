import React from 'react';
import {
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  FileIdentifier,
  FileState,
} from '@atlaskit/media-client';
import {
  expectFunctionToHaveBeenCalledWith,
  videoURI,
} from '@atlaskit/media-test-helpers';
import {
  InlinePlayerV2,
  getPreferredVideoArtifact,
} from '../../v2/inlinePlayerV2';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  spinnerTestId,
  inlinePlayerTestId,
} from '../../../__tests__/utils/_testIDs';
import { IntlProvider } from 'react-intl-next';

import {
  createMockedMediaApi,
  fileMap,
} from '../../../card/v2/__tests__/utils/_createMediaClient';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';

const initialStore: any = { files: {} };
initialStore.files[fileMap.workingVideo.id] = {
  status: 'processed',
  name: fileMap.workingVideo.details.name,
  size: fileMap.workingVideo.details.size,
  mediaType: fileMap.workingVideo.details.mediaType,
  mimeType: fileMap.workingVideo.details.mimeType,
  id: fileMap.workingVideo.id,
  artifacts: {
    'video_1280.mp4': fileMap.workingVideo.details.artifacts['video_1280.mp4'],
  },
};

const defaultIdentifier: FileIdentifier = {
  id: fileMap.workingVideo.id,
  collectionName: fileMap.workingVideo.collection,
  mediaItemType: fileMap.workingVideo.type,
};

describe('<InlinePlayerV2 />', () => {
  // Media Client Mock
  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render loading component when the video src is not ready', () => {
    render(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <InlinePlayerV2
            autoplay={true}
            identifier={defaultIdentifier}
            dimensions={{
              width: 10,
              height: '5%',
            }}
          />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );

    expect(screen.queryByTestId(spinnerTestId)).toBeInTheDocument();
  });

  it('should pass poster to CustomMediaPlayer when cardPreview is available', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <InlinePlayerV2
            autoplay={true}
            identifier={defaultIdentifier}
            cardPreview={{ dataURI: 'some-data-uri', source: 'remote' }}
          />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );
    fireEvent.load(await screen.findByTestId(inlinePlayerTestId));

    // Confirm the existence of Custom Media Player
    const playButton = await screen.findByLabelText('Play');
    expect(playButton).toBeInTheDocument();

    await user.hover(playButton);
    expect(playButton).toBeVisible();

    const videoElement = container.querySelector('video');
    const videoSrc = videoElement?.getAttribute('poster');
    expect(videoSrc).toEqual('some-data-uri');
  });

  it('should keep existing local preview', async () => {
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
    let createObjectURLCallTimes = 0;
    createObjectURLSpy.mockImplementation(() => {
      createObjectURLCallTimes++;
      return `object-url-src-${createObjectURLCallTimes}`;
    });

    const firstFile: any = { files: {} };
    firstFile.files[fileMap.workingVideo.id] = {
      status: 'uploading',
      mediaType: fileMap.workingVideo.details.mediaType,
      progress: 0,
      preview: {
        value: new Blob([], { type: 'video/mp4' }),
      },
    };
    const { container, rerender } = render(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={firstFile}
        >
          <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );

    // Confirm the existence of Custom Media Player
    expect(await screen.findByLabelText('Play')).toBeInTheDocument();

    // Check if the src is correct
    const videoElement = container.querySelector('video');
    const videoSrc = videoElement?.getAttribute('src');
    expect(videoSrc).toEqual('object-url-src-1');

    const secondFile = { ...firstFile, progress: 0.5, preview: {} };

    rerender(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={secondFile}
        >
          <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );

    // Check if the src is correct
    const videoElement2 = container.querySelector('video');
    const videoSrc2 = videoElement2?.getAttribute('src');
    expect(videoSrc2).toEqual('object-url-src-1');
  });

  describe('InlinePlayerWrapper', () => {
    it('should set width/height according to dimensions in the wrapper element', async () => {
      const dimensions = {
        width: '80%',
        height: '20px',
      };

      render(
        <IntlProvider locale="en">
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <InlinePlayerV2
              autoplay={true}
              identifier={defaultIdentifier}
              dimensions={dimensions}
            />
          </MockedMediaClientProvider>
        </IntlProvider>,
      );

      const inlinePlayerV2 = await screen.findByTestId(inlinePlayerTestId);
      const styles = getComputedStyle(inlinePlayerV2);

      expect(styles.width).toBe(dimensions.width);
      expect(styles.height).toBe(dimensions.height);
    });

    it('default to 100%/auto width/height if no dimensions given', async () => {
      render(
        <IntlProvider locale="en">
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <InlinePlayerV2
              autoplay={true}
              identifier={defaultIdentifier}
              dimensions={{}}
            />
          </MockedMediaClientProvider>
        </IntlProvider>,
      );
      const inlinePlayerV2 = await screen.findByTestId(inlinePlayerTestId);
      const styles = getComputedStyle(inlinePlayerV2);
      expect(styles.width).toBe('100%');
      expect(styles.height).toBe('auto');
    });
  });

  describe('fileState subscription', () => {
    it('should use binary from local preview when available and render custom media player', async () => {
      const store: any = { files: {} };
      store.files[fileMap.workingVideo.id] = {
        status: 'processed',
        name: fileMap.workingVideo.details.name,
        size: fileMap.workingVideo.details.size,
        mediaType: fileMap.workingVideo.details.mediaType,
        mimeType: fileMap.workingVideo.details.mimeType,
        id: fileMap.workingVideo.id,
        preview: {
          value: new Blob([], { type: 'video/mp4' }),
        },
      };
      const { container } = render(
        <IntlProvider locale="en">
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={store}
          >
            <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
          </MockedMediaClientProvider>
        </IntlProvider>,
      );

      // Confirm the existence of Custom Media Player
      const playButton = await screen.findByLabelText('Play');
      expect(playButton).toBeInTheDocument();

      // Check if the src is correct
      const videoElement = container.querySelector('video');
      const videoSrc = videoElement?.getAttribute('src');
      expect(videoSrc).toEqual('mock result of URL.createObjectURL()');
    });

    it('should fetch file binary if artifacts are not present and render custom media player', async () => {
      const store: any = { files: {} };
      store.files[fileMap.workingVideo.id] = {
        status: 'processed',
        name: fileMap.workingVideo.details.name,
        size: fileMap.workingVideo.details.size,
        mediaType: fileMap.workingVideo.details.mediaType,
        mimeType: fileMap.workingVideo.details.mimeType,
        id: fileMap.workingVideo.id,
      };

      const { container } = render(
        <IntlProvider locale="en">
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={store}
          >
            <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
          </MockedMediaClientProvider>
        </IntlProvider>,
      );

      // Confirm the existence of Custom Media Player
      const playButton = await screen.findByLabelText('Play');
      expect(playButton).toBeInTheDocument();

      // Check if the src is correct
      const videoElement = container.querySelector('video');
      const videoSrc = videoElement?.getAttribute('src');
      expect(videoSrc).toEqual('a file binary url');
    });

    it('should use the file artifact if available and render custom media player', async () => {
      const { container } = render(
        <IntlProvider locale="en">
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
          </MockedMediaClientProvider>
        </IntlProvider>,
      );

      fireEvent.load(await screen.findByTestId(inlinePlayerTestId));

      // Confirm the existence of Custom Media Player
      const playButton = await screen.findByLabelText('Play');
      expect(playButton).toBeInTheDocument();

      // Check if the src is correct
      const videoElement = container.querySelector('video');
      const videoSrc = videoElement?.getAttribute('src');
      expect(videoSrc).toEqual(videoURI);
    });
  });

  it('should download video binary when download button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );

    // Get the download button and click it
    const downloadLabel = await screen.findByLabelText('download');
    await user.click(downloadLabel);

    // Expect that the emit function was called last with the correct arguments
    expect(globalMediaEventEmitter.emit).toHaveBeenLastCalledWith(
      'media-viewed',
      {
        fileId: fileMap.workingVideo.id,
        isUserCollection: false,
        viewingLevel: 'download',
      },
    );
  });

  it('should use binary artifact if file is processing and no other artifact is present', async () => {
    const store: any = { files: {} };
    store.files[fileMap.workingVideo.id] = {
      status: 'processing',
    };

    const { container } = render(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={store}
        >
          <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );

    // Confirm the existence of Custom Media Player
    const playButton = await screen.findByLabelText('Play');
    expect(playButton).toBeInTheDocument();

    // Check if the src is correct
    const videoElement = container.querySelector('video');
    const videoSrc = videoElement?.getAttribute('src');
    expect(videoSrc).toEqual('a file binary url');
  });

  describe('getPreferredVideoArtifact()', () => {
    it('should return hd artifact if present', () => {
      const state = {
        status: 'processed',
        artifacts: {
          'video_1280.mp4': {},
          'video_640.mp4': {},
        },
      };

      expect(getPreferredVideoArtifact(state as FileState)).toEqual(
        'video_1280.mp4',
      );
    });

    it('should fallback to sd artifact if hd is not present', () => {
      const state = {
        status: 'processed',
        artifacts: {
          'audio.mp3': {},
          'video_640.mp4': {},
        },
      };

      expect(getPreferredVideoArtifact(state as FileState)).toEqual(
        'video_640.mp4',
      );
    });

    it('should work with processing status', () => {
      const state = {
        status: 'processing',
        artifacts: {
          'video_1280.mp4': {},
        },
      };

      expect(getPreferredVideoArtifact(state as FileState)).toEqual(
        'video_1280.mp4',
      );
    });
  });

  it('should trigger media-viewed when video is first played', async () => {
    render(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );

    expect(await globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(await globalMediaEventEmitter.emit, [
      'media-viewed',
      {
        fileId: fileMap.workingVideo.id,
        viewingLevel: 'full',
      } as MediaViewedEventPayload,
    ]);
  });

  it('should use mouse movement to show and hide video control area', async () => {
    const user = userEvent.setup();
    render(
      <IntlProvider locale="en">
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
        </MockedMediaClientProvider>
      </IntlProvider>,
    );
    fireEvent.load(await screen.findByTestId(inlinePlayerTestId));

    // Confirm the existence of Custom Media Player
    const playButton = await screen.findByLabelText('Play');
    expect(playButton).toBeInTheDocument();

    /*
      After the component has completed its initial rendering process, it requires waiting period for at least 2000 milliseconds before the video control bars become hidden.

      Reference: mouseMovementDelay variable in packages/media/media-ui/src/inactivityDetector/inactivityDetector.tsx
    */

    await waitFor(
      () => {
        expect(playButton).not.toBeVisible();
      },
      { timeout: 2000 },
    );

    /*
      Afterwards, the inline player area needs to detect any mouse movement in order to re-activate the video control bars.
    */

    await user.hover(playButton);

    expect(playButton).toBeVisible();
  });

  describe('ProgressBar for video player', () => {
    it('should render ProgressBar for а video that is being played when status is uploading', async () => {
      const store: any = { files: {} };
      store.files[fileMap.workingVideo.id] = {
        status: 'uploading',
        mediaType: fileMap.workingVideo.details.mediaType,
        preview: {
          value: new Blob([], { type: 'video/mp4' }),
        },
      };
      render(
        <IntlProvider locale="en">
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={store}
          >
            <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
          </MockedMediaClientProvider>
        </IntlProvider>,
      );
      expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    });

    it.each([
      'loading',
      'processing',
      'loading-preview',
      'complete',
      'error',
      'failed-processing',
    ] as const)(
      'should not render ProgressBar for а video that is being played when status is %s',
      async (status: any) => {
        const store: any = { files: {} };
        store.files[fileMap.workingVideo.id] = {
          status,
          mediaType: fileMap.workingVideo.details.mediaType,
        };
        render(
          <IntlProvider locale="en">
            <MockedMediaClientProvider
              mockedMediaApi={createMockedMediaApi()}
              initialStore={store}
            >
              <InlinePlayerV2 autoplay={true} identifier={defaultIdentifier} />
            </MockedMediaClientProvider>
          </IntlProvider>,
        );
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      },
    );
  });
});
