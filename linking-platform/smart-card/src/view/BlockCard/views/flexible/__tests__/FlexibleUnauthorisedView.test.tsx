import React from 'react';
import { screen } from '@testing-library/react';
import { type CardState } from '@atlaskit/linking-common';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import FlexibleUnauthorisedView from '../FlexibleUnauthorisedView';
import {
  CONTENT_URL_3P_ACCOUNT_AUTH,
  CONTENT_URL_SECURITY_AND_PERMISSIONS,
} from '../../../../../constants';
import { mockAnalytics, mocks } from '../../../../../utils/mocks';

describe('FlexibleUnauthorisedView', () => {
  const url = 'https://some.url';
  const titleTestId = 'smart-element-link';
  const descriptionTestId = 'smart-block-unauthorized-view-content';
  const buttonTestId = 'smart-action-connect-account';

  const renderComponent = (
    props?: Partial<React.ComponentProps<typeof FlexibleUnauthorisedView>>,
  ) =>
    renderWithIntl(
      <SmartCardProvider>
        <FlexibleUnauthorisedView
          analytics={mockAnalytics}
          cardState={
            {
              status: 'unauthorized',
              details: {
                ...mocks.unauthorized,
                data: {
                  ...mocks.unauthorized.data,
                  generator: {
                    '@type': 'Application',
                    icon: {
                      '@type': 'Image',
                      url: 'https://some.icon.url',
                    },
                    name: '3P',
                  },
                },
              },
            } as CardState
          }
          onAuthorize={() => {}}
          url={url}
          {...props}
        />
      </SmartCardProvider>,
    );

  it('renders unauthorised view', async () => {
    renderComponent();

    const title = await screen.findByTestId(titleTestId);
    expect(title.textContent).toBe(url);

    const description = await screen.findByTestId(descriptionTestId);
    expect(description.textContent).toBe(
      'Connect your 3P account to collaborate on work across Atlassian products. Learn more about Smart Links.',
    );

    const learnMoreUrl = (
      await screen.findByRole('link', { name: /learn more/i })
    ).getAttribute('href');
    expect(learnMoreUrl).toBe(CONTENT_URL_SECURITY_AND_PERMISSIONS);

    const button = await screen.findByTestId(buttonTestId);
    expect(button.textContent).toBe('Connect to 3P');
  });

  it('renders unauthorised view with alternative message when `hasScopeOverrides` flag is present in meta', async () => {
    renderComponent({
      cardState: {
        status: 'unauthorized',
        details: {
          meta: {
            ...mocks.unauthorized.meta,
            hasScopeOverrides: true,
          },
          data: {
            ...mocks.unauthorized.data,
            generator: {
              '@type': 'Application',
              icon: {
                '@type': 'Image',
                url: 'https://some.icon.url',
              },
              name: '3P',
            },
          },
        },
      } as CardState,
    });

    const title = await screen.findByTestId(titleTestId);
    expect(title.textContent).toBe(url);

    const description = await screen.findByTestId(descriptionTestId);
    expect(description.textContent).toBe(
      'Connect your 3P account to collaborate on work across Atlassian products. Learn more about connecting your account to Atlassian products.',
    );

    const learnMoreUrl = (
      await screen.findByRole('link', { name: /learn more/i })
    ).getAttribute('href');
    expect(learnMoreUrl).toBe(CONTENT_URL_3P_ACCOUNT_AUTH);

    const button = await screen.findByTestId(buttonTestId);
    expect(button.textContent).toBe('Connect to 3P');
  });

  it('renders unauthorised view without provider name', async () => {
    const { findByTestId } = renderComponent({
      cardState: {
        status: 'unauthorized',
        details: mocks.unauthorized,
      },
    });

    const title = await findByTestId(titleTestId);
    expect(title.textContent).toBe(url);

    const description = await findByTestId(descriptionTestId);
    expect(description.textContent).toBe(
      'Connect your account to collaborate on work across Atlassian products. Learn more about Smart Links.',
    );

    const button = await findByTestId(buttonTestId);
    expect(button.textContent).toBe('Connect');
  });

  it('renders unauthorised view with no auth flow', async () => {
    const { findByTestId, queryByTestId } = renderComponent({
      onAuthorize: undefined,
    });

    const title = await findByTestId(titleTestId);
    expect(title.textContent).toBe(url);

    const description = await findByTestId(descriptionTestId);
    expect(description.textContent).toBe(
      "You're trying to preview a link to a private 3P page. We recommend you review the URL or contact the page owner.",
    );

    const button = queryByTestId(buttonTestId);
    expect(button).not.toBeInTheDocument();
  });

  it('renders unauthorised view with no auth flow without provider name', async () => {
    const { findByTestId, queryByTestId } = renderComponent({
      cardState: {
        status: 'unauthorized',
        details: mocks.unauthorized,
      },
      onAuthorize: undefined,
    });

    const title = await findByTestId(titleTestId);
    expect(title.textContent).toBe(url);

    const description = await findByTestId(descriptionTestId);
    expect(description.textContent).toBe(
      "You're trying to preview a link to a private page. We recommend you review the URL or contact the page owner.",
    );

    const button = queryByTestId(buttonTestId);
    expect(button).not.toBeInTheDocument();
  });
});
