import React from 'react';
import { CardState } from '@atlaskit/linking-common';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import FlexibleUnauthorisedView from '../FlexibleUnauthorisedView';
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
    const { findByTestId } = renderComponent();

    const title = await findByTestId(titleTestId);
    expect(title.textContent).toBe(url);

    const description = await findByTestId(descriptionTestId);
    expect(description.textContent).toBe(
      'Connect 3P to Atlassian to view more details of your work and collaborate from one place. Learn more about Smart Links.',
    );

    const button = await findByTestId(buttonTestId);
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
      'Connect to Atlassian to view more details of your work and collaborate from one place. Learn more about Smart Links.',
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
