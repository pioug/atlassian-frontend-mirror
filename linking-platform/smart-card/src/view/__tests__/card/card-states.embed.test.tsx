import './card-states.card.test.mock';

import React from 'react';
import { JsonLd } from 'json-ld-types';
import { render, cleanup, waitFor } from '@testing-library/react';
import { CardClient, CardProviderStoreOpts } from '@atlaskit/link-provider';
import { mockSimpleIntersectionObserver } from '@atlaskit/link-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { Card } from '../../Card';
import { Provider } from '../../..';
import * as analytics from '../../../utils/analytics';
import { fakeFactory, mocks } from '../../../utils/mocks';
import { IntlProvider } from 'react-intl-next';

mockSimpleIntersectionObserver();

describe('smart-card: card states, embed', () => {
  const mockOnError = jest.fn();
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
      it('embed: should render loading state initially', async () => {
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const loadingView = await waitFor(() =>
          getByTestId('embed-card-resolving-view'),
        );
        expect(loadingView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });
    });

    describe('> state: resolved', () => {
      it('embed: should render with metadata when resolved', async () => {
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByTestId('embed-card-resolved-view-frame'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewName.getAttribute('src')).toEqual(
          'https://www.ilovecheese.com',
        );
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledTimes(1);
        expect(analytics.uiRenderSuccessEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            display: 'embed',
            status: 'resolved',
          }),
        );
      });

      it('embed: should render with metadata when resolved, as block card - no preview present', async () => {
        const successWithoutPreview = {
          ...mocks.success,
          data: {
            ...mocks.success.data,
            preview: undefined,
          },
        } as JsonLd.Response;

        mockFetch.mockImplementationOnce(async () => successWithoutPreview);
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByText('Here is your serving of cheese: 🧀'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('embed: should render with metadata when resolved, as inline card - preview present, platform set', async () => {
        const successWithPreviewOnWeb = {
          ...mocks.success,
          data: {
            ...mocks.success.data,
            preview: {
              '@type': 'Link',
              href: 'https://some/preview',
              'atlassian:supportedPlatforms': ['web'],
            },
          },
        } as JsonLd.Response;

        mockFetch.mockImplementationOnce(async () => successWithPreviewOnWeb);
        const { getByText, getByTestId } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} platform="mobile" />
            </Provider>
          </IntlProvider>,
        );
        const resolvedViewName = await waitFor(() =>
          getByText('I love cheese'),
        );
        const resolvedViewDescription = await waitFor(() =>
          getByTestId('inline-card-resolved-view'),
        );
        expect(resolvedViewName).toBeTruthy();
        expect(resolvedViewDescription).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should re-render when URL changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="embed" url="https://google.com" />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(2);
      });

      it('should not re-render when appearance changes', async () => {
        let resolvedView = null;
        const { getByText, rerender } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(resolvedView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);

        rerender(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card appearance="block" url={mockUrl} />
            </Provider>
          </IntlProvider>,
        );
        resolvedView = await waitFor(() => getByText('I love cheese'));
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
      });

      it('should pass iframe forward reference down to embed iframe', async () => {
        const iframeRef = React.createRef<HTMLIFrameElement>();
        const { getByTestId } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                appearance="embed"
                url={mockUrl}
                embedIframeRef={iframeRef}
              />
            </Provider>
          </IntlProvider>,
        );
        const iframeEl = await waitFor(() =>
          getByTestId('embed-card-resolved-view-frame'),
        );
        expect(iframeEl).toBe(iframeRef.current);
      });
    });

    describe('> state: forbidden', () => {
      describe('with auth services available', () => {
        it('embed: renders the forbidden view if no access, with auth prompt', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText, container } = render(
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const forbiddenLink = await waitFor(() =>
            getByText(/Restricted content/),
          );
          expect(forbiddenLink).toBeTruthy();
          const forbiddenLinkButton = container.querySelector('button');
          expect(forbiddenLinkButton).toBeTruthy();
          expect(forbiddenLinkButton!.textContent).toContain(
            'Try another account',
          );
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockOnError).toHaveBeenCalledWith({
            url: mockUrl,
            status: 'forbidden',
          });
        });
      });

      describe('with no auth services available', () => {
        it('embed: renders the forbidden view if no access, no auth prompt', async () => {
          mocks.forbidden.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.forbidden);
          const { getByText } = render(
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const forbiddenLink = await waitFor(() =>
            getByText(/Restricted content/),
          );
          expect(forbiddenLink).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockOnError).toHaveBeenCalledWith({
            url: mockUrl,
            status: 'forbidden',
          });
        });
      });

      describe('with text content', () => {
        type ContextProp = { accessType: string; visibility: string };
        type ContentProps = {
          button?: string;
          description: string;
          title: string;
        };
        const mockResponse = ({
          accessType = 'FORBIDDEN',
          visibility = 'not_found',
        } = {}) =>
          ({
            meta: {
              auth: [],
              visibility,
              access: 'forbidden',
              key: 'jira-object-provider',
              requestAccess: { accessType },
            },
            data: {
              ...mocks.forbidden.data,
              generator: {
                '@type': 'Application',
                '@id': 'https://www.atlassian.com/#Jira',
                name: 'Jira',
              },
            },
          } as JsonLd.Response);

        const setup = async (response = mocks.forbidden) => {
          mockFetch.mockImplementationOnce(async () => response);
          const renderResult = render(
            <Provider client={mockClient}>
              <Card
                appearance="embed"
                url="https://site.atlassian.net/browse/key-1"
              />
            </Provider>,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));

          return renderResult;
        };

        describe.each([
          [
            "site - request access: I don't have access to the site, but I can request access",
            { accessType: 'REQUEST_ACCESS', visibility: 'not_found' },
            {
              title: "You don't have access to this content",
              description: 'Contact your admin to request access.',
              button: 'Request access',
            },
            {
              title: 'Restricted content',
              description: 'Request access to Jira view this preview.',
              button: 'Request access',
            },
          ],
          [
            "site - pending request: I don't have access to the site, but I've already requested access and I'm waiting",
            { accessType: 'PENDING_REQUEST_EXISTS', visibility: 'not_found' },
            {
              title: 'Access to Jira is pending',
              description:
                'Your request to access site.atlassian.net is awaiting admin approval.',
              button: 'Pending approval',
            },
            {
              title: 'Restricted content',
              description: 'Your access request is pending.',
            },
          ],
          [
            "site - denied request: I don't have access to the site, and my previous request was denied",
            { accessType: 'DENIED_REQUEST_EXISTS', visibility: 'not_found' },
            {
              title: "You don't have access to this content",
              description:
                "Your admin didn't approve your request to view Jira pages from site.atlassian.net.",
            },
            {
              title: 'Restricted content',
              description:
                'Your access request was denied. Contact the site admin if you still need access.',
            },
          ],
          [
            "site - direct access: I don't have access to the site, but I can join directly",
            { accessType: 'DIRECT_ACCESS', visibility: 'not_found' },
            {
              title: 'Join your team in Jira',
              description:
                'All accounts with your same email domain are approved to access site.atlassian.net in Jira.',
              button: 'Go to Jira',
            },
            {
              title: 'Restricted content',
              description:
                "You've been approved, so you can join Jira right away.",
              button: 'Join Jira',
            },
          ],
          [
            'object - request Access: I have access to the site, but not the object',
            { accessType: 'ACCESS_EXISTS', visibility: 'restricted' },
            {
              title: "You don't have access to this content",
              description:
                'Contact your admin and request access to view this content from site.atlassian.net.',
              button: 'Request access',
            },
            {
              title: 'Restricted content',
              description:
                "You'll need to request access or try a different account to view this preview.",
              button: 'Try another account',
            },
          ],
          [
            'not found, access exists: I have access to the site, but not the object or object is not-found',
            { accessType: 'ACCESS_EXISTS', visibility: 'not_found' },
            {
              title: "We can't show you this Jira page",
              description:
                "The page doesn't exist or it may have changed after this link was added.",
            },
            {
              title: "Uh oh. We can't find this link!",
              description:
                "We couldn't find the link. Check the url and try editing or paste again.",
            },
          ],
          [
            'forbidden: When you don’t have access to the site, and you can’t request access',
            { accessType: 'FORBIDDEN', visibility: 'not_found' },
            {
              title: "You don't have access to this content",
              description: 'Contact your admin to request access.',
            },
            {
              title: 'Restricted content',
              description:
                'You don’t have access to this preview. Contact the site admin if you need access.',
            },
          ],
        ])(
          '%s',
          (
            name: string,
            context: ContextProp,
            expected: ContentProps,
            expectedFFOff: ContentProps,
          ) => {
            ffTest(
              'platform.linking-platform.smart-card.cross-join',
              async () => {
                const { container, findByText } = await setup(
                  mockResponse(context),
                );

                expect(await findByText(expected.title)).toBeVisible();
                expect(container).toHaveTextContent(expected.description);
                if (expected.button) {
                  expect(await findByText(expected.button)).toBeVisible();
                }
              },
              async () => {
                const { findByText } = await setup(mockResponse(context));

                expect(await findByText(expectedFFOff.title)).toBeVisible();
                expect(
                  await findByText(expectedFFOff.description),
                ).toBeVisible();
                if (expectedFFOff.button) {
                  expect(await findByText(expectedFFOff.button)).toBeVisible();
                }
              },
            );
          },
        );
      });
    });

    describe('> state: unauthorized', () => {
      describe('with auth services available', () => {
        it('embed: renders with connect flow', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText, getByTestId } = render(
            <Provider client={mockClient}>
              <Card
                testId="block-unauthorized-connect"
                appearance="embed"
                url={mockUrl}
                onError={mockOnError}
              />
            </Provider>,
          );
          const unauthorizedLink = await waitFor(() =>
            getByText(/Connect your.*?account/),
          );

          expect(unauthorizedLink).toBeTruthy();
          const unauthorizedLinkButton = getByTestId('button-connect-account');
          expect(unauthorizedLinkButton).toBeTruthy();
          expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockOnError).toHaveBeenCalledWith({
            url: mockUrl,
            status: 'unauthorized',
          });
        });
      });

      describe('with auth services not available', () => {
        it('embed: renders without connect flow', async () => {
          mocks.unauthorized.meta.auth = [];
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { findByTestId } = render(
            <Provider client={mockClient}>
              <Card appearance="embed" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const unauthorizedLink = await findByTestId(
            'embed-card-unauthorized-view-unresolved-title',
          );
          expect(unauthorizedLink).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockOnError).toHaveBeenCalledWith({
            url: mockUrl,
            status: 'unauthorized',
          });
        });
      });

      describe('with authFlow explicitly disabled', () => {
        it('embed: renders in error state', async () => {
          mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
          const { getByText } = render(
            <Provider client={mockClient} authFlow="disabled">
              <Card appearance="embed" url={mockUrl} onError={mockOnError} />
            </Provider>,
          );
          const errorView = await waitFor(() =>
            getByText(/We couldn't load this link/),
          );
          expect(errorView).toBeTruthy();
          expect(mockFetch).toBeCalled();
          expect(mockFetch).toBeCalledTimes(1);
          expect(mockOnError).toHaveBeenCalledWith({
            url: mockUrl,
            status: 'fallback',
          });
        });
      });
    });

    describe('> state: error', () => {
      it('embed: renders error card when link not found', async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.reject(new Error('Something went wrong')),
        );
        const { findByTestId } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const errorView = await findByTestId('embed-card-errored-view');
        expect(errorView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'errored',
        });
      });

      it('embed: renders not found card when link not found', async () => {
        mockFetch.mockImplementationOnce(async () => mocks.notFound);
        const { getByText } = render(
          <Provider client={mockClient}>
            <Card appearance="embed" url={mockUrl} onError={mockOnError} />
          </Provider>,
        );
        const errorView = await waitFor(() =>
          getByText(/Uh oh. We can't find this link!/),
        );
        expect(errorView).toBeTruthy();
        expect(mockFetch).toBeCalled();
        expect(mockFetch).toBeCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith({
          url: mockUrl,
          status: 'not_found',
        });
      });
    });

    describe('> state: invalid', () => {
      it('embed: does not throw error when state is invalid', async () => {
        const storeOptions = {
          initialState: { [mockUrl]: {} },
        } as CardProviderStoreOpts;
        const { findByTestId } = render(
          <Provider client={mockClient} storeOptions={storeOptions}>
            <Card appearance="embed" url={mockUrl} />
          </Provider>,
        );

        const link = await findByTestId('embed-card-resolved-view');
        expect(link).toBeTruthy();
      });
    });
  });

  describe('render method: withData', () => {
    describe('> state: resolved', () => {
      it('embed: renders successfully with data', async () => {
        const { getByText } = render(
          <IntlProvider locale="en">
            <Provider client={mockClient}>
              <Card
                appearance="embed"
                url={mockUrl}
                data={mocks.success.data}
              />
            </Provider>
          </IntlProvider>,
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
});
