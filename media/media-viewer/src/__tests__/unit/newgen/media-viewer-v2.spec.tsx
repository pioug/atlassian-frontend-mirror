import React from 'react';
import { Identifier, getFileStreamsCache } from '@atlaskit/media-client';
import { fileMap, createMockedMediaApi } from '../../utils/_createMediaClient';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { MediaViewerV2 } from '../../../v2/media-viewer-v2';
import { MediaViewerExtensions } from '../../../components/types';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Setup for initialStore

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

initialStore.files[fileMap.workingGif.id] = {
  status: 'processed',
  name: fileMap.workingGif.details.name,
  size: fileMap.workingGif.details.size,
  mediaType: fileMap.workingGif.details.mediaType,
  mimeType: fileMap.workingGif.details.mimeType,
  id: fileMap.workingGif.id,
  artifacts: {
    'image.jpg': fileMap.workingGif.details.artifacts['image.jpg'],
  },
};

// Identifiers for the store

const workingVideoIdentifier: Identifier = {
  id: fileMap.workingVideo.id,
  collectionName: fileMap.workingVideo.collection,
  mediaItemType: fileMap.workingVideo.type,
};
const workingGifIdentifier: Identifier = {
  id: fileMap.workingGif.id,
  collectionName: fileMap.workingGif.collection,
  mediaItemType: fileMap.workingGif.type,
};

describe('<MediaViewer />', () => {
  const user = userEvent.setup();
  const onEvent = jest.fn();

  afterEach(() => {
    getFileStreamsCache().removeAll();
    jest.restoreAllMocks();
  });

  // We are keeping the test for this data-testid since JIRA is still using it in their codebase to perform checks. Before removing this test, we need to ensure this 'media-viewer-popup' test id is not being used anywhere else in other codebases
  // Related ticket https://product-fabric.atlassian.net/browse/MPT-15
  it('should attach data-testid to the blanket', () => {
    const { container } = render(
      <MockedMediaClientProvider
        mockedMediaApi={createMockedMediaApi()}
        initialStore={initialStore}
      >
        <MediaViewerV2
          selectedItem={workingVideoIdentifier}
          items={[workingVideoIdentifier]}
        />
      </MockedMediaClientProvider>,
    );

    // the query below should return a Blanket component, there is no other sure way to query the Blanket element at the moment rather than
    const blanketComponent = container.querySelector(
      '.media-viewer-popup[data-testid="media-viewer-popup"]',
    );
    expect(blanketComponent).toBeInTheDocument();
  });

  describe('Closing Media Viewer', () => {
    it("should trigger onClose function Media Viewer on 'Escape' key press", async () => {
      const { unmount } = render(
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <MediaViewerV2
            selectedItem={workingVideoIdentifier}
            items={[]}
            onClose={() => unmountFunction()}
          />
        </MockedMediaClientProvider>,
      );
      const unmountFunction = unmount;

      // The presence of closeButton means that the mediaViewer opened
      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('should not trigger onClose function Media Viewer when clicking on other button on Header', async () => {
      const { unmount } = render(
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <MediaViewerV2
            selectedItem={workingVideoIdentifier}
            items={[]}
            onClose={() => unmountFunction()}
          />
        </MockedMediaClientProvider>,
      );
      const unmountFunction = unmount;

      const downloadButton = screen.getByRole('button', {
        name: /download/i,
      });

      // The presence of closeButton means that the mediaViewer opened
      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
      await user.click(downloadButton);
      expect(closeButton).toBeInTheDocument();
    });

    it('should trigger onClose function the Media Viewer when clicking on the Close button', async () => {
      const { unmount } = render(
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <MediaViewerV2
            selectedItem={workingVideoIdentifier}
            items={[workingVideoIdentifier]}
            onClose={() => unmountFunction()}
          />
        </MockedMediaClientProvider>,
      );
      const unmountFunction = unmount;

      // The presence of closeButton means that the mediaViewer opened
      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
      await user.click(closeButton);
      expect(closeButton).not.toBeInTheDocument();
    });
  });

  describe('Analytics', () => {
    it('should trigger the screen event when the component loads', () => {
      render(
        <AnalyticsListener channel="media" onEvent={onEvent}>
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <MediaViewerV2
              selectedItem={workingVideoIdentifier}
              items={[workingVideoIdentifier]}
            />
          </MockedMediaClientProvider>
        </AnalyticsListener>,
      );
      expect(onEvent.mock.calls[0][0].payload).toEqual({
        action: 'viewed',
        actionSubject: 'mediaViewerModal',
        eventType: 'screen',
        name: 'mediaViewerModal',
      });
    });

    it('should send analytics when closed with button', async () => {
      render(
        <AnalyticsListener channel="media" onEvent={onEvent}>
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <MediaViewerV2
              selectedItem={workingVideoIdentifier}
              items={[workingVideoIdentifier]}
            />
          </MockedMediaClientProvider>
        </AnalyticsListener>,
      );

      const closeButton = screen.getByLabelText('Close');
      await user.click(closeButton);
      expect(onEvent).toHaveBeenCalled();
      const closeEvent: any =
        onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
      expect(closeEvent.payload.attributes.input).toEqual('button');
    });

    // TODO: this test is flaky on pipeline, that's why its skipped for now and needs to be unskipped in the future

    /* it('should send analytics when closed with esc key', async () => {
      render(
        <AnalyticsListener channel="media" onEvent={onEvent}>
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <MediaViewerV2
              selectedItem={workingVideoIdentifier}
              items={[workingVideoIdentifier]}
            />
          </MockedMediaClientProvider>
        </AnalyticsListener>,
      );

      await user.keyboard('[Escape]');
      expect(onEvent).toHaveBeenCalled();
      const closeEvent: any =
        onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
      expect(closeEvent.payload.attributes.input).toEqual('escKey');
    }); */
  });

  describe('Sidebar integration', () => {
    let sidebarExtension: MediaViewerExtensions;
    let mockSidebarRenderer: jest.Mock<any, any>;

    beforeEach(() => {
      mockSidebarRenderer = jest
        .fn()
        .mockImplementation(() => <div>Sidebar Content</div>);

      sidebarExtension = {
        sidebar: {
          icon: <EditorPanelIcon label="sidebar" />,
          renderer: mockSidebarRenderer,
        },
      };
    });

    describe('renderer', () => {
      it('should render sidebar with default selected identifier if not set in state', async () => {
        render(
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <MediaViewerV2
              selectedItem={workingGifIdentifier}
              items={[workingVideoIdentifier]}
              extensions={sidebarExtension}
            />
          </MockedMediaClientProvider>,
        );

        const sidebarButton = screen.getByLabelText('sidebar');
        await user.click(sidebarButton);
        expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
        expect(mockSidebarRenderer).toHaveBeenLastCalledWith(
          workingGifIdentifier,
          {
            close: expect.any(Function),
          },
        );
      });

      it('should render sidebar with selected identifier in state', async () => {
        render(
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <MediaViewerV2
              selectedItem={workingVideoIdentifier}
              items={[workingVideoIdentifier, workingGifIdentifier]}
              extensions={sidebarExtension}
            />
          </MockedMediaClientProvider>,
        );

        const sidebarButton = screen.getByLabelText('sidebar');
        await user.click(sidebarButton);
        expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
        expect(mockSidebarRenderer).toHaveBeenLastCalledWith(
          workingVideoIdentifier,
          {
            close: expect.any(Function),
          },
        );
        await user.keyboard('[ArrowRight]');
        expect(mockSidebarRenderer).toHaveBeenLastCalledWith(
          workingGifIdentifier,
          {
            close: expect.any(Function),
          },
        );

        await user.keyboard('[ArrowLeft]');
        expect(mockSidebarRenderer).toHaveBeenLastCalledWith(
          workingVideoIdentifier,
          {
            close: expect.any(Function),
          },
        );
      });

      it("should not show sidebar if extensions is not defined or sidebar's renderer is not defined", async () => {
        render(
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <MediaViewerV2
              selectedItem={workingVideoIdentifier}
              items={[workingVideoIdentifier]}
            />
          </MockedMediaClientProvider>,
        );

        const sidebarButton = screen.queryByLabelText('sidebar');
        expect(sidebarButton).not.toBeInTheDocument();

        render(
          <MockedMediaClientProvider
            mockedMediaApi={createMockedMediaApi()}
            initialStore={initialStore}
          >
            <MediaViewerV2
              selectedItem={workingVideoIdentifier}
              items={[workingVideoIdentifier, workingGifIdentifier]}
              extensions={{}}
            />
          </MockedMediaClientProvider>,
        );
        expect(sidebarButton).not.toBeInTheDocument();
      });
    });

    it('should toggle visibility of sidebar correctly', async () => {
      render(
        <MockedMediaClientProvider
          mockedMediaApi={createMockedMediaApi()}
          initialStore={initialStore}
        >
          <MediaViewerV2
            selectedItem={workingVideoIdentifier}
            items={[workingVideoIdentifier]}
            extensions={sidebarExtension}
          />
        </MockedMediaClientProvider>,
      );
      const sidebarButton = screen.getByLabelText('sidebar');
      await user.click(sidebarButton);
      expect(screen.queryByText('Sidebar Content')).toBeInTheDocument();
      await user.click(sidebarButton);
      expect(screen.queryByText('Sidebar Content')).not.toBeInTheDocument();
    });
  });
});
