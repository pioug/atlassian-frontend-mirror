import './success.test.mock';
import CardClient from '../../../client';
import React from 'react';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import {
  render,
  waitForElement,
  fireEvent,
  cleanup,
  wait,
} from '@testing-library/react';
import * as analytics from '../../../utils/analytics';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import 'jest-extended';
import { JestFunction } from '@atlaskit/media-test-helpers';
import uuid from 'uuid';

describe('smart-card: success analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockPostData: jest.Mock;
  let mockWindowOpen: jest.Mock;
  let mockUuid = require('uuid').default as JestFunction<typeof uuid>;

  const mockStartUfoExperience = jest.spyOn(ufoWrapper, 'startUfoExperience');
  const mockSucceedUfoExperience = jest.spyOn(
    ufoWrapper,
    'succeedUfoExperience',
  );
  const mockFailUfoExperience = jest.spyOn(ufoWrapper, 'failUfoExperience');
  const mockAddMetadataToExperience = jest.spyOn(
    ufoWrapper,
    'addMetadataToExperience',
  );

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockPostData = jest.fn(async () => mocks.actionSuccess);
    mockClient = new (fakeFactory(mockFetch, mockPostData))();
    mockWindowOpen = jest.fn();
    mockUuid
      .mockReturnValueOnce('some-uuid-1')
      .mockReturnValueOnce('some-uuid-2');
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });
  describe('resolved', () => {
    it('should fire the resolved analytics event when the url was resolved', async () => {
      const mockUrl = 'https://this.is.the.sixth.url';
      const { getByTestId, getByRole } = render(
        <Provider client={mockClient}>
          <Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const resolvedView = await waitForElement(
        () => getByTestId('resolvedCard1-resolved-view'),
        {
          timeout: 10000,
        },
      );
      const resolvedCard = getByRole('button');
      expect(resolvedView).toBeTruthy();
      expect(resolvedCard).toBeTruthy();
      expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.fireSmartLinkEvent).toBeCalledWith(
        {
          action: 'resolved',
          attributes: {
            componentName: 'smart-cards',
            display: 'inline',
          },
        },
        expect.any(Function),
      );
      expect(analytics.uiRenderSuccessEvent).toBeCalledWith(
        'inline',
        'd1',
        'object-provider',
      );

      expect(mockStartUfoExperience).toBeCalledWith(
        'smart-link-rendered',
        'some-uuid-1',
      );
      expect(mockSucceedUfoExperience).toBeCalledWith(
        'smart-link-rendered',
        'some-uuid-1',
        {
          display: 'inline',
          extensionKey: 'object-provider',
        },
      );
      expect(mockSucceedUfoExperience).toHaveBeenCalledAfter(
        mockStartUfoExperience as jest.Mock,
      );
    });

    it('should add the cached tag to UFO render experience when the same link url is rendered again', async () => {
      const mockUrl = 'https://this.is.the.seventh.url';
      const { rerender, getByTestId } = render(
        <Provider client={mockClient}>
          <Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      await waitForElement(() => getByTestId('resolvedCard1-resolved-view'), {
        timeout: 10000,
      });

      expect(mockAddMetadataToExperience).not.toHaveBeenCalled();

      rerender(
        <Provider client={mockClient}>
          <Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
          <Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
        </Provider>,
      );

      await waitForElement(() => getByTestId('resolvedCard1-resolved-view'), {
        timeout: 10000,
      });
      await waitForElement(() => getByTestId('resolvedCard2-resolved-view'), {
        timeout: 10000,
      });

      expect(mockStartUfoExperience.mock.calls).toIncludeAllMembers([
        ['smart-link-rendered', 'some-uuid-1'],
        ['smart-link-rendered', 'some-uuid-2'],
      ]);

      // Ensure whichever link loads first is marked as cached since url is the same
      expect(mockAddMetadataToExperience.mock.calls).toEqual([
        [
          'smart-link-rendered',
          expect.stringMatching(/^some-uuid-2||some-uuid-1$/),
          {
            cached: true,
          },
        ],
      ]);

      // Authenticated experiences haven't been started and will be ignored by UFO
      expect(mockSucceedUfoExperience.mock.calls).toIncludeAllMembers([
        [
          'smart-link-rendered',
          'some-uuid-1',
          { display: 'inline', extensionKey: 'object-provider' },
        ],
        ['smart-link-authenticated', 'some-uuid-1', { display: 'inline' }],
        [
          'smart-link-rendered',
          'some-uuid-2',
          { display: 'inline', extensionKey: 'object-provider' },
        ],
        ['smart-link-authenticated', 'some-uuid-2', { display: 'inline' }],
      ]);
    });

    it('should fire clicked analytics event when a resolved URL is clicked', async () => {
      const mockUrl = 'https://this.is.the.seventh.url';
      const { getByTestId, getByRole } = render(
        <Provider client={mockClient}>
          <Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const resolvedView = await waitForElement(
        () => getByTestId('resolvedCard2-resolved-view'),
        {
          timeout: 5000,
        },
      );
      const resolvedCard = getByRole('button');
      expect(resolvedView).toBeTruthy();
      expect(resolvedCard).toBeTruthy();
      expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

      fireEvent.click(resolvedCard);
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
    });

    it('should fire render failure when an unexpected error happens', async () => {
      const mockUrl = 'https://this.is.the.sixth.url';
      // Notice we are not wrapping Card within a Provider intentionally, to make it throw an error
      render(<Card testId="resolvedCard1" appearance="inline" url={mockUrl} />);

      expect(analytics.fireSmartLinkEvent).toBeCalledTimes(1);
      expect(analytics.uiRenderFailedEvent).toBeCalledTimes(1);

      expect(mockStartUfoExperience).toBeCalledWith(
        'smart-link-rendered',
        'some-uuid-1',
      );
      expect(mockFailUfoExperience).toBeCalledWith(
        'smart-link-rendered',
        'some-uuid-1',
      );
      expect(mockFailUfoExperience).toBeCalledWith(
        'smart-link-authenticated',
        'some-uuid-1',
      );
      expect(mockStartUfoExperience).toHaveBeenCalledBefore(
        mockFailUfoExperience as jest.Mock,
      );
    });
  });

  it('block: should fire invokeSucceeded event when an action is clicked & processed', async () => {
    const mockUrl = 'https://this.is.the.eigth.url';
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <Card
          testId="resolvedCardWithActions"
          appearance="block"
          url={mockUrl}
        />
      </Provider>,
    );
    const downloadActionButton = await waitForElement(
      () => getByTestId('button-comment'),
      {
        timeout: 5000,
      },
    );
    const resolvedView = getByTestId('resolvedCardWithActions');
    expect(resolvedView).toBeTruthy();
    expect(downloadActionButton).toBeTruthy();
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

    fireEvent.click(downloadActionButton);
    await wait(() => {
      expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeSucceededEvent).toHaveBeenCalledTimes(1);
    });
  });

  it('block: should fire invokeFailed event when an action is clicked & fails', async () => {
    mockPostData.mockImplementationOnce(async () =>
      Promise.reject(new Error('something happened')),
    );
    const mockUrl = 'https://this.is.the.eigth.url';
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <Card
          testId="resolvedCardWithActions"
          appearance="block"
          url={mockUrl}
        />
      </Provider>,
    );
    const downloadActionButton = await waitForElement(
      () => getByTestId('button-comment'),
      {
        timeout: 5000,
      },
    );
    const resolvedView = getByTestId('resolvedCardWithActions');
    expect(resolvedView).toBeTruthy();
    expect(downloadActionButton).toBeTruthy();
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

    fireEvent.click(downloadActionButton);
    await wait(() => {
      expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeFailedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeFailedEvent).toHaveBeenCalledWith(
        expect.any(String),
        'object-provider',
        'CommentAction',
        'block',
        'something happened',
      );
    });
  });

  it('preview: should fire analytics on invocation, and render preview', async () => {
    const mockUrl = 'https://this.is.the.eigth.url';
    const { getByTestId } = render(
      <Provider client={mockClient}>
        <Card
          testId="resolvedCardWithActions"
          appearance="block"
          url={mockUrl}
        />
      </Provider>,
    );
    const previewActionButton = await waitForElement(
      () => getByTestId('button-preview-content'),
      {
        timeout: 5000,
      },
    );
    const resolvedView = getByTestId('resolvedCardWithActions');
    expect(resolvedView).toBeTruthy();
    expect(previewActionButton).toBeTruthy();
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

    fireEvent.click(previewActionButton);
    // Analytics tied to block card should be fired.
    await wait(() => {
      expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeSucceededEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeSucceededEvent).toHaveBeenCalledWith(
        expect.any(String),
        'd1',
        'PreviewAction',
        'block',
      );
    });
    // Next, check the preview modal has rendered.
    const previewModal = getByTestId('preview-modal');
    expect(previewModal).toBeTruthy();
  });
});
