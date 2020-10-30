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

describe('smart-card: success analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockPostData: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockPostData = jest.fn(async () => mocks.actionSuccess);
    mockClient = new (fakeFactory(mockFetch, mockPostData))();
    mockWindowOpen = jest.fn();
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
