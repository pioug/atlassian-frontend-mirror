import './card-states.card.test.mock';

import { APIError } from '@atlaskit/linking-common';
import '@atlaskit/link-test-helpers/jest';
import {
  CardClient,
  CardProviderStoreOpts,
  SmartCardProvider as Provider,
} from '@atlaskit/link-provider';
import React, { useState } from 'react';
import { render, cleanup, waitFor, fireEvent } from '@testing-library/react';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { Card, CardAppearance } from '../../Card';
import * as analytics from '../../../utils/analytics';
import { fakeFactory, mockByUrl, mocks } from '../../../utils/mocks';
import { TitleBlock } from '../../FlexibleCard/components/blocks';
import { flushPromises } from '@atlaskit/media-test-helpers';
import { JsonLd } from 'json-ld-types';

mockSimpleIntersectionObserver();

describe('smart-card: card states, flexible', () => {
  const mockOnError = jest.fn();
  let mockClient: CardClient;
  let mockFetch: jest.Mock<Promise<JsonLd.Response>>;
  let mockUrl: string;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(() => Promise.resolve(mocks.success));
    mockClient = new (fakeFactory(mockFetch))();
    mockWindowOpen = jest.fn();
    mockUrl = 'https://some.url';
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('with render method: withUrl', () => {
    describe('> state: rejected with an error', () => {
      it('should render error view', async () => {
        mockFetch.mockRejectedValue(
          new APIError(
            'fatal',
            'localhost',
            'something wrong',
            'ResolveUnsupportedError',
          ),
        );

        const { getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl} onError={mockOnError}>
              <TitleBlock />
            </Card>
          </Provider>,
        );

        const erroredView = await waitFor(() =>
          getByTestId('smart-block-title-errored-view'),
        );
        expect(erroredView).toBeTruthy();
        await flushPromises();

        const erroredViewAgain = await waitFor(() =>
          getByTestId('smart-block-title-errored-view'),
        );
        expect(erroredViewAgain).toBeTruthy();
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'errored',
        });
      });
    });

    describe('> state: resolved', () => {
      it('should open window when flexible ui link with resolved URL is clicked', async () => {
        const mockUrl = 'https://this.is.the.seventh.url';
        const { getByTestId } = render(
          <Provider client={mockClient}>
            <Card testId="resolvedCard2" appearance="inline" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedView = await waitFor(
          () => getByTestId('smart-block-title-resolved-view'),
          {
            timeout: 5000,
          },
        );
        expect(resolvedView).toBeTruthy();

        const resolvedCard = getByTestId('smart-element-link');
        expect(resolvedCard).toBeTruthy();
        fireEvent.click(resolvedCard);

        // ensure default onclick for renderer is not triggered
        expect(mockWindowOpen).toHaveBeenCalledTimes(0);
      });

      it('should render with metadata when resolved', async () => {
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should re-render when URL changes', async () => {
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="block" url="https://google.com">
              <TitleBlock />
            </Card>
          </Provider>,
        );
        await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should call onResolve prop after flexible card is resolved', async () => {
        const mockFn = jest.fn();
        const mockUrl = 'https://this.is.the.seventh.url';
        const { getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="inline" url={mockUrl} onResolve={mockFn}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedView = await waitFor(
          () => getByTestId('smart-block-title-resolved-view'),
          {
            timeout: 5000,
          },
        );
        expect(resolvedView).toBeTruthy();

        expect(mockFn).toHaveBeenCalledTimes(1);
      });
    });

    describe('> state: invalid', () => {
      it('flexible: does not throw error when state is invalid', async () => {
        const storeOptions = {
          initialState: { [mockUrl]: {} },
        } as CardProviderStoreOpts;
        const { findByTestId } = render(
          <Provider client={mockClient} storeOptions={storeOptions}>
            <Card appearance="block" url={mockUrl}>
              <TitleBlock />
            </Card>
          </Provider>,
        );

        const link = await findByTestId('smart-block-title-resolved-view');
        expect(link).toBeTruthy();
      });
    });
  });

  describe('render method: withData', () => {
    describe('> state: resolved', () => {
      it('flexible: renders successfully with data', async () => {
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} data={mocks.success.data}>
              <TitleBlock />
            </Card>
          </Provider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
      });
    });
  });

  describe.each([
    'inline' as CardAppearance,
    'block' as CardAppearance,
    'embed' as CardAppearance,
  ])('with %s card appearance', (appearance: CardAppearance) => {
    const testId = 'smart-links-container'; // default Flexible UI container testId
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('renders Flexible UI', async () => {
      const { getByTestId } = render(
        <Provider client={mockClient}>
          <Card appearance={appearance} url={mockUrl}>
            <TitleBlock />
          </Card>
        </Provider>,
      );
      const block = await waitFor(() => getByTestId(testId));
      expect(block).toBeTruthy();
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          display: 'flexible',
          status: 'resolved',
        }),
      );
    });

    it('does not render Flexible UI when card has no children', async () => {
      const { queryByTestId, getByText } = render(
        <Provider client={mockClient}>
          <Card appearance={appearance} url={mockUrl} />
        </Provider>,
      );
      const resolvedView = await waitFor(() => getByText('I love cheese'));
      expect(resolvedView).toBeInTheDocument();
      expect(queryByTestId(testId)).toBeNull();
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          display: appearance,
          status: 'resolved',
        }),
      );
    });

    it('does not render Flexible UI when card has no valid children', async () => {
      const { queryByTestId, getByText } = render(
        <Provider client={mockClient}>
          <Card appearance={appearance} url={mockUrl}>
            <div>Test</div>
          </Card>
        </Provider>,
      );
      const resolvedView = await waitFor(() => getByText('I love cheese'));
      expect(resolvedView).toBeInTheDocument();
      expect(queryByTestId(testId)).toBeNull();
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
      expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          display: appearance,
          status: 'resolved',
        }),
      );
    });
  });

  describe('with authFlow disabled', () => {
    it('renders Flexible UI with available data', async () => {
      const mockUrl = 'https://this.is.the.seventh.url';
      mockFetch.mockResolvedValueOnce({
        meta: {
          auth: [],
          definitionId: 'confluence-object-provider',
          visibility: 'restricted',
          access: 'forbidden',
          resourceType: 'page',
          key: 'confluence-object-provider',
          requestAccess: {
            accessType: 'ACCESS_EXISTS',
            cloudId: 'DUMMY-CLOUD-ID',
          },
        },
        data: {
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          generator: {
            '@type': 'Application',
            '@id': 'https://www.atlassian.com/#Confluence',
            name: 'Confluence',
          },
          url: mockUrl,
          '@type': ['Document', 'schema:TextDigitalDocument'],
        },
      });

      const { findByTestId, queryByTestId } = render(
        <Provider client={mockClient} authFlow="disabled">
          <Card appearance="inline" url={mockUrl} onError={mockOnError}>
            <TitleBlock testId="auth-flow-disabled" />
          </Card>
        </Provider>,
      );
      const view = await findByTestId('auth-flow-disabled-errored-view');
      const icon = await findByTestId('smart-element-icon-icon--wrapper');
      const link = await findByTestId('smart-element-link');
      const message = queryByTestId('auth-flow-disabled-errored-view-message');

      expect(view).toBeTruthy();
      expect(icon.getAttribute('aria-label')).toBe('Confluence');
      expect(link.textContent).toBe(mockUrl);
      expect(message).not.toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith({
        url: mockUrl,
        status: 'fallback',
      });
    });

    it('change of url should trigger a re-render', async () => {
      const secondUrl = 'https://some.url2';
      const customMockFetch = jest.fn((url) => {
        return mockByUrl(url);
      });

      const customClient = new (fakeFactory(customMockFetch))();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider client={customClient}>{children}</Provider>
      );

      const Component = () => {
        const [url, setUrl] = useState(secondUrl);

        const onClickHandler = () => {
          setUrl(mockUrl);
        };

        return (
          <>
            <Card appearance={'block'} url={mockUrl}>
              <TitleBlock />
            </Card>
            <Card appearance={'block'} url={url}>
              <TitleBlock />
            </Card>
            <button data-testid={'change-url-button'} onClick={onClickHandler}>
              {' '}
              Change URL
            </button>
          </>
        );
      };

      const {
        getByTestId,
        getAllByTestId,
        getByText,
        getAllByText,
        queryByText,
      } = render(<Component />, { wrapper });

      await waitFor(() => getAllByTestId('smart-block-title-resolved-view'), {
        timeout: 5000,
      });

      const secondUrlBeforeUpdate = await waitFor(() =>
        getByText('https://some.url2'),
      );
      expect(secondUrlBeforeUpdate).toBeTruthy();

      const button = await waitFor(() => getByTestId('change-url-button'), {
        timeout: 5000,
      });

      fireEvent.click(button);

      expect(queryByText('https://some.url2')).toBeNull();
      const secondUrlAfterUpdate = await waitFor(() =>
        getAllByText('https://some.url'),
      );
      expect(secondUrlAfterUpdate.length).toEqual(2);
    });
  });
});
