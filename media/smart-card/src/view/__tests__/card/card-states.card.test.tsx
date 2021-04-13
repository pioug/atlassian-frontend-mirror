jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../../utils/analytics/analytics');

const mockAPIError = jest.fn();
jest.doMock('../../../client/errors', () => ({
  APIError: mockAPIError,
}));

import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';
import CardClient from '../../../client';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';

describe('smart-card: card states, block', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockUrl: string;

  beforeEach(() => {
    mockFetch = jest.fn(() => Promise.resolve(mocks.success));
    mockClient = new (fakeFactory(mockFetch))();
    mockUrl = 'https://some.url';
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('render method: withUrl', () => {
    describe('> state: loading', () => {
      it('block: should render loading state initially', async () => {
        const { getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );
        const loadingView = await waitForElement(() =>
          getByTestId('block-card-resolving-view'),
        );
        expect(loadingView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: resolved', () => {
      it('block: should render with metadata when resolved', async () => {
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitForElement(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should re-render when URL changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="block" url="https://google.com" />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );
        resolvedView = await waitForElement(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: forbidden', () => {
      describe('with auth services available', () => {
        it('block: renders the forbidden view if no access, with auth prompt', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, getByTestId, container } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>,
          );
          const frame = await waitForElement(() =>
            getByTestId('block-card-forbidden-view'),
          );
          expect(frame).toBeTruthy();
          const forbiddenLink = await waitForElement(() => getByText(mockUrl));
          expect(forbiddenLink).toBeTruthy();
          const forbiddenLinkButton = container.querySelector('button');
          expect(forbiddenLinkButton).toBeTruthy();
          expect(forbiddenLinkButton!.textContent).toContain(
            'Try another account',
          );
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });

      describe('with no auth services available', () => {
        it('block: renders the forbidden view if no access, no auth prompt', async () => {
          mocks.forbidden.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, getByTestId, container } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>,
          );
          const frame = await waitForElement(() =>
            getByTestId('block-card-forbidden-view'),
          );
          expect(frame).toBeTruthy();
          const forbiddenLink = await waitForElement(() => getByText(mockUrl));
          const forbiddenLinkButton = container.querySelector('button');
          expect(forbiddenLink).toBeTruthy();
          expect(forbiddenLinkButton).toBeFalsy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });
    });

    describe('> state: unauthorized', () => {
      describe('with auth services available', () => {
        it('block: renders with connect flow', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText, getByTestId } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>,
          );
          const frame = await waitForElement(() =>
            getByTestId('block-card-unauthorized-view'),
          );
          expect(frame).toBeTruthy();
          const unauthorizedLink = await waitForElement(() =>
            getByText(mockUrl),
          );
          expect(unauthorizedLink).toBeTruthy();
          const unauthorizedLinkButton = getByTestId('button-connect-account');
          expect(unauthorizedLinkButton).toBeTruthy();
          expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });

      describe('with auth services not available', () => {
        it('block: renders without connect flow', async () => {
          mocks.unauthorized.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText, getByTestId, container } = render(
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>,
          );
          const frame = await waitForElement(() =>
            getByTestId('block-card-unauthorized-view'),
          );
          expect(frame).toBeTruthy();
          const unauthorizedLink = await waitForElement(() =>
            getByText(mockUrl),
          );
          const unauthorizedLinkButton = container.querySelector('button');
          expect(unauthorizedLink).toBeTruthy();
          expect(unauthorizedLinkButton).toBeFalsy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });

      describe('with authFlow explicitly disabled', () => {
        it('block: renders as blue link', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText } = render(
            <Provider client={mockClient} authFlow="disabled">
              <Card appearance="block" url={mockUrl} />
            </Provider>,
          );
          const dumbLink = await waitForElement(() => getByText(mockUrl));
          expect(dumbLink).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
        });
      });
    });

    describe('> state: error', () => {
      it('block: renders not found card when link not found', async () => {
        mockFetch.mockImplementationOnce(async () => mocks.notFound);
        const { getByText, getByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} />
          </Provider>,
        );
        const frame = await waitForElement(() =>
          getByTestId('block-card-not-found-view'),
        );
        expect(frame).toBeTruthy();
        const link = await waitForElement(() => getByText(mockUrl));
        expect(link).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });
  });

  describe('render method: withData', () => {
    describe('> state: resolved', () => {
      it('block: renders successfully with data', async () => {
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="block" url={mockUrl} data={mocks.success.data} />
          </Provider>,
        );
        const resolvedViewName = await waitForElement(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitForElement(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
      });
    });
  });
});
