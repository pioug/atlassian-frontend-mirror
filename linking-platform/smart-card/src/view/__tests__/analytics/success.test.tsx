jest.mock('../../../utils', () => ({
  ...jest.requireActual<Object>('../../../utils'),
  isSpecialEvent: jest.fn(() => false),
}));

import './success.test.mock';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { CardClient } from '@atlaskit/link-provider';
import React from 'react';
import { Card } from '../../Card';
import { Provider, TitleBlock } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import * as analytics from '../../../utils/analytics';
import * as ufoWrapper from '../../../state/analytics/ufoExperiences';
import 'jest-extended';
import { JestFunction, asMock } from '@atlaskit/media-test-helpers';
import uuid from 'uuid';
import { IntlProvider } from 'react-intl-next';
import { isSpecialEvent } from '../../../utils';
import * as cardWithUrlContent from '../../CardWithUrl/component';
import { TestErrorBoundary } from '../_boundary';
import { act } from '@testing-library/react';

mockSimpleIntersectionObserver();

jest.mock('@atlaskit/link-provider', () => ({
  useFeatureFlag: () => true,
}));

describe('smart-card: success analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockPostData: jest.Mock;
  let mockWindowOpen: jest.Mock;

  const mockUuid = uuid as JestFunction<typeof uuid>;
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
    mockUuid.mockReset();
    cleanup();
  });

  describe('resolved', () => {
    describe('embeds', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should fire the dwelled analytics event when the user dwells on the iframe', async () => {
        const mockUrl = 'https://this.is.the.sixth.url';
        const { findByTestId } = render(
          <IntlProvider locale="en">
            <Provider
              client={mockClient}
              featureFlags={{ trackIframeDwellEvents: true }}
            >
              <Card appearance="embed" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedView = await findByTestId('embed-card-resolved-view');
        expect(resolvedView).toBeTruthy();
        expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);
        expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
        expect(analytics.uiRenderSuccessEvent).toBeCalledWith({
          display: 'embed',
          status: 'resolved',
          definitionId: 'd1',
          extensionKey: 'object-provider',
        });

        const resolvedViewFrame = await findByTestId(
          'embed-card-resolved-view-frame',
        );
        fireEvent.load(resolvedViewFrame);
        fireEvent.mouseEnter(resolvedViewFrame);
        expect(analytics.uiIframeDwelledEvent).toHaveBeenCalledTimes(0);
        act(() => {
          jest.advanceTimersByTime(6000);
        });
        expect(analytics.uiIframeDwelledEvent).toHaveBeenCalledTimes(1);
        expect(analytics.uiIframeDwelledEvent).toBeCalledWith({
          definitionId: 'd1',
          destinationProduct: undefined,
          destinationSubproduct: undefined,
          display: 'embed',
          dwellPercentVisible: 100,
          dwellTime: 5,
          extensionKey: 'object-provider',
          id: 'some-uuid-1',
          location: undefined,
          status: 'resolved',
        });
      });
    });

    it('should fire the resolved analytics event when the url was resolved', async () => {
      const mockUrl = 'https://this.is.the.sixth.url';
      const { findByTestId, getByRole } = render(
        <IntlProvider locale="en">
          <Provider client={mockClient}>
            <Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );
      const resolvedView = await findByTestId('resolvedCard1-resolved-view');
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
            id: expect.any(String),
            extensionKey: 'object-provider',
            definitionId: 'd1',
          },
        },
        expect.any(Function),
      );
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiRenderSuccessEvent).toBeCalledWith({
        display: 'inline',
        status: 'resolved',
        definitionId: 'd1',
        extensionKey: 'object-provider',
      });

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

    it('should not send repeated render success events when nonessential props are changed', async () => {
      const mockUrl = 'https://this.is.the.sixth.url';
      const { getByTestId, rerender } = render(
        <Provider client={mockClient}>
          <Card
            testId="resolvedCard1"
            appearance="inline"
            url={mockUrl}
            showActions={false}
          />
        </Provider>,
      );

      await waitFor(() => getByTestId('resolvedCard1-resolved-view'), {
        timeout: 10000,
      });

      rerender(
        <Provider client={mockClient}>
          <Card
            testId="resolvedCard1"
            appearance="inline"
            url={mockUrl}
            showActions={true}
          />
        </Provider>,
      );

      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
    });

    it('should add the cached tag to UFO render experience when the same link url is rendered again', async () => {
      const mockUrl = 'https://this.is.the.seventh.url';
      const { rerender, getByTestId } = render(
        <Provider client={mockClient}>
          <Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      await waitFor(() => getByTestId('resolvedCard1-resolved-view'), {
        timeout: 10000,
      });

      expect(mockAddMetadataToExperience).not.toHaveBeenCalled();

      rerender(
        <Provider client={mockClient}>
          <Card testId="resolvedCard1" appearance="inline" url={mockUrl} />
          <Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
        </Provider>,
      );

      await waitFor(() => getByTestId('resolvedCard1-resolved-view'), {
        timeout: 10000,
      });
      await waitFor(() => getByTestId('resolvedCard2-resolved-view'), {
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

    it('should fire clicked analytics event when flexible ui link with resolved URL is clicked', async () => {
      const mockUrl = 'https://this.is.the.seventh.url';
      const { findByTestId, getByTestId } = render(
        <IntlProvider locale="en">
          <Provider client={mockClient}>
            <Card testId="resolvedCard2" appearance="inline" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>
        </IntlProvider>,
      );
      const resolvedView = await findByTestId(
        'smart-block-title-resolved-view',
      );
      expect(resolvedView).toBeTruthy();

      const resolvedCard = getByTestId('smart-element-link');
      expect(resolvedCard).toBeTruthy();
      expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

      asMock(isSpecialEvent).mockReturnValue(false);

      fireEvent.click(resolvedCard);

      // ensure default onclick for renderer is not triggered
      expect(mockWindowOpen).toHaveBeenCalledTimes(0);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
        id: 'some-uuid-1',
        display: 'flexible',
        status: 'resolved',
        definitionId: 'd1',
        extensionKey: 'object-provider',
        isModifierKeyPressed: false,
      });

      // With special key pressed
      asMock(analytics.uiCardClickedEvent).mockReset();
      mockWindowOpen.mockReset();

      asMock(isSpecialEvent).mockReturnValue(true);

      fireEvent.click(resolvedCard);

      // ensure default onclick for renderer is not triggered
      expect(mockWindowOpen).toHaveBeenCalledTimes(0);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
        id: 'some-uuid-1',
        display: 'flexible',
        status: 'resolved',
        definitionId: 'd1',
        extensionKey: 'object-provider',
        isModifierKeyPressed: true,
      });
    });

    it('should fire clicked analytics event when a resolved URL is clicked on a inline link', async () => {
      const mockUrl = 'https://this.is.the.seventh.url';
      const { findByTestId, getByRole } = render(
        <IntlProvider locale="en">
          <Provider client={mockClient}>
            <Card testId="resolvedCard2" appearance="inline" url={mockUrl} />
          </Provider>
        </IntlProvider>,
      );
      const resolvedView = await findByTestId('resolvedCard2-resolved-view');
      expect(resolvedView).toBeTruthy();

      const resolvedCard = getByRole('button');
      expect(resolvedCard).toBeTruthy();
      expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

      asMock(isSpecialEvent).mockReturnValue(false);

      fireEvent.click(resolvedCard);
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
        id: 'some-uuid-1',
        display: 'inline',
        status: 'resolved',
        definitionId: 'd1',
        extensionKey: 'object-provider',
        isModifierKeyPressed: false,
      });
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);

      // With special key pressed
      asMock(analytics.uiCardClickedEvent).mockReset();
      mockWindowOpen.mockReset();
      asMock(isSpecialEvent).mockReturnValue(true);

      fireEvent.click(resolvedCard);

      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiCardClickedEvent).toHaveBeenCalledWith({
        id: 'some-uuid-1',
        display: 'inline',
        status: 'resolved',
        definitionId: 'd1',
        extensionKey: 'object-provider',
        isModifierKeyPressed: true,
      });
    });

    it('should fire render failure when an unexpected error happens', async () => {
      const mockUrl = 'https://this.is.the.eight.url';
      const spy = jest
        .spyOn(cardWithUrlContent, 'CardWithUrlContent')
        .mockImplementation(() => {
          throw new Error();
        });

      const onError = jest.fn();
      render(
        <TestErrorBoundary onError={onError}>
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl} />
          </Provider>
        </TestErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);

      await waitFor(
        () => expect(analytics.fireSmartLinkEvent).toBeCalledTimes(1),
        {
          timeout: 5000,
        },
      );

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

      spy.mockRestore();
    });

    it('should not send repeated render failed events when nonessential props are changed', async () => {
      const mockUrl = 'https://this.is.the.eight.url';
      const spy = jest
        .spyOn(cardWithUrlContent, 'CardWithUrlContent')
        .mockImplementation(() => {
          throw new Error();
        });

      const onError = jest.fn();
      const { rerender } = render(
        <TestErrorBoundary onError={onError}>
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl} showActions={false} />
          </Provider>
        </TestErrorBoundary>,
      );

      rerender(
        <TestErrorBoundary onError={onError}>
          <Provider client={mockClient}>
            <Card
              testId="resolvedCard1"
              appearance="inline"
              url={mockUrl}
              showActions={true}
            />
          </Provider>
        </TestErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);

      await waitFor(
        () => expect(analytics.uiRenderFailedEvent).toBeCalledTimes(1),
        {
          timeout: 5000,
        },
      );

      spy.mockRestore();
    });
  });

  it('block: should fire invokeSucceeded event when an action is clicked & processed', async () => {
    const mockUrl = 'https://this.is.the.eigth.url';
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <Provider client={mockClient}>
          <Card
            testId="resolvedCardWithActionsProcessed"
            appearance="block"
            url={mockUrl}
          />
        </Provider>
      </IntlProvider>,
    );
    const downloadActionButton = await findByTestId('button-comment');
    const resolvedView = await findByTestId('resolvedCardWithActionsProcessed');
    expect(resolvedView).toBeTruthy();
    expect(downloadActionButton).toBeTruthy();
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

    // Clearing the render experience mocks to ensure we check correct invocation
    // order of only action invocation experience.
    mockStartUfoExperience.mockClear();
    mockSucceedUfoExperience.mockClear();

    fireEvent.click(downloadActionButton);
    await waitFor(() => {
      expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeSucceededEvent).toHaveBeenCalledTimes(1);
    });

    expect(mockStartUfoExperience).toBeCalledWith(
      'smart-link-action-invocation',
      'some-uuid-1',
      {
        actionType: 'CommentAction',
        display: 'block',
        extensionKey: 'object-provider',
        invokeType: 'server',
      },
    );

    expect(mockSucceedUfoExperience).toBeCalledWith(
      'smart-link-action-invocation',
      'some-uuid-1',
    );

    expect(mockStartUfoExperience).toHaveBeenCalledBefore(
      mockSucceedUfoExperience as jest.Mock,
    );
  });

  it('block: should fire invokeFailed event when an action is clicked & fails', async () => {
    let mockFailPostData = jest
      .fn()
      .mockImplementationOnce(async () =>
        Promise.reject(new Error('something happened')),
      );

    let mockFailClient: CardClient = new (fakeFactory(
      mockFetch,
      mockFailPostData,
    ))();
    const mockUrl = 'https://this.is.the.eigth.url';
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <Provider client={mockFailClient}>
          <Card
            testId="resolvedCardWithActionsFailure"
            appearance="block"
            url={mockUrl}
          />
        </Provider>
      </IntlProvider>,
    );
    const commentActionButton = await findByTestId('button-comment');
    const resolvedView = await findByTestId('resolvedCardWithActionsFailure');
    expect(resolvedView).toBeTruthy();
    expect(commentActionButton).toBeTruthy();
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

    // Clearing the render experience mocks to ensure we check correct invocation
    // order of only action invocation experience.
    mockStartUfoExperience.mockClear();
    mockSucceedUfoExperience.mockClear();

    fireEvent.click(commentActionButton);
    expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(analytics.invokeFailedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeFailedEvent).toHaveBeenCalledWith({
        id: expect.any(String),
        actionType: 'CommentAction',
        display: 'block',
        reason: 'something happened',
        extensionKey: 'object-provider',
      });
      expect(mockStartUfoExperience).toBeCalledWith(
        'smart-link-action-invocation',
        'some-uuid-1',
        {
          actionType: 'CommentAction',
          display: 'block',
          extensionKey: 'object-provider',
          invokeType: 'server',
        },
      );
      expect(mockFailUfoExperience).toBeCalledWith(
        'smart-link-action-invocation',
        'some-uuid-1',
      );

      expect(mockStartUfoExperience).toHaveBeenCalledBefore(
        mockFailUfoExperience as jest.Mock,
      );
    });
  });

  it('preview: should fire analytics on invocation, and render preview', async () => {
    const mockUrl = 'https://this.is.the.eigth.url';
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <Provider client={mockClient}>
          <Card
            testId="resolvedCardWithActions"
            appearance="block"
            url={mockUrl}
          />
        </Provider>
      </IntlProvider>,
    );
    const previewActionButton = await findByTestId('button-preview-content');
    const resolvedView = findByTestId('resolvedCardWithActions');
    expect(resolvedView).toBeTruthy();
    expect(previewActionButton).toBeTruthy();
    expect(analytics.resolvedEvent).toHaveBeenCalledTimes(1);

    // Clearing the render experience mocks to ensure we check correct invocation
    // order of only action invocation experience.
    mockStartUfoExperience.mockClear();
    mockSucceedUfoExperience.mockClear();

    fireEvent.click(previewActionButton);
    // Analytics tied to block card should be fired.
    await waitFor(() => {
      expect(analytics.uiActionClickedEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeSucceededEvent).toHaveBeenCalledTimes(1);
      expect(analytics.invokeSucceededEvent).toHaveBeenCalledWith({
        id: expect.any(String),
        actionType: 'PreviewAction',
        display: 'block',
        extensionKey: 'object-provider',
      });
    });

    expect(mockStartUfoExperience).toBeCalledWith(
      'smart-link-action-invocation',
      'some-uuid-1',
      {
        actionType: 'PreviewAction',
        display: 'block',
        extensionKey: 'object-provider',
        invokeType: 'client',
      },
    );

    expect(mockSucceedUfoExperience).toBeCalledWith(
      'smart-link-action-invocation',
      'some-uuid-1',
    );

    expect(mockStartUfoExperience).toHaveBeenCalledBefore(
      mockSucceedUfoExperience as jest.Mock,
    );

    // Next, check the preview modal has rendered.
    const previewModal = findByTestId('preview-modal');
    expect(previewModal).toBeTruthy();
  });
});
