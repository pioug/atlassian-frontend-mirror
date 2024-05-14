import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, screen } from '@testing-library/react';
import { CardState } from '@atlaskit/linking-common';
import FlexibleCard from '../index';
import { TitleBlock } from '../components/blocks';
import { SmartLinkStatus } from '../../../constants';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { FlexibleUiContext } from '../../../state/flexible-ui-context';
import context from '../../../__fixtures__/flexible-ui-data-context';

jest.mock('@atlaskit/link-provider', () => {
  return {
    ...jest.requireActual<Object>('@atlaskit/link-provider'),
    useFeatureFlag: jest.fn(),
  };
});

describe('FlexibleCard', () => {
  const title = 'some-name';
  const url = 'http://some-url.com';

  it('renders flexible card', async () => {
    const cardState: CardState = {
      status: 'resolved',
      details: {
        meta: {
          access: 'granted',
          visibility: 'public',
        },
        data: {
          '@type': 'Object',
          '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
          },
          url,
          name: title,
        },
      },
    };

    const { getByTestId } = render(
      <SmartCardProvider>
        <FlexibleCard cardState={cardState} url={url}>
          <TitleBlock />
        </FlexibleCard>
      </SmartCardProvider>,
    );

    const container = await getByTestId('smart-links-container');
    const titleBlock = await getByTestId('smart-block-title-resolved-view');

    expect(container).toBeTruthy();
    expect(titleBlock).toBeTruthy();
    expect(titleBlock.textContent).toEqual(title);
  });

  describe('hover preview', () => {
    it('should not render a hover preview when parameter is not provided', async () => {
      const cardState: CardState = {
        status: 'resolved',
        details: {
          meta: {
            access: 'granted',
            visibility: 'public',
          },
          data: {
            '@type': 'Object',
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            url,
            name: title,
          },
        },
      };

      render(
        <SmartCardProvider>
          <FlexibleUiContext.Provider value={context}>
            <FlexibleCard cardState={cardState} url={url}>
              <TitleBlock />
            </FlexibleCard>
          </FlexibleUiContext.Provider>
        </SmartCardProvider>,
      );

      expect(
        screen.queryByTestId('hover-card-trigger-wrapper'),
      ).not.toBeInTheDocument();
    });

    it('should render a hover preview when its prop is enabled and link is included', async () => {
      const cardState: CardState = {
        status: 'resolved',
        details: {
          meta: {
            access: 'granted',
            visibility: 'public',
          },
          data: {
            '@type': 'Object',
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            url,
            name: title,
          },
        },
      };

      render(
        <SmartCardProvider>
          <FlexibleUiContext.Provider value={context}>
            <FlexibleCard
              showHoverPreview={true}
              cardState={cardState}
              url={url}
            >
              <TitleBlock />
            </FlexibleCard>
          </FlexibleUiContext.Provider>
        </SmartCardProvider>,
      );

      expect(
        await screen.findByTestId('hover-card-trigger-wrapper'),
      ).toBeInTheDocument();
    });

    it('should not render a hover preview when its prop is diabled and link is included', async () => {
      const cardState: CardState = {
        status: 'resolved',
        details: {
          meta: {
            access: 'granted',
            visibility: 'public',
          },
          data: {
            '@type': 'Object',
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            url,
            name: title,
          },
        },
      };

      render(
        <SmartCardProvider>
          <FlexibleUiContext.Provider value={context}>
            <FlexibleCard
              showHoverPreview={false}
              cardState={cardState}
              url={url}
            >
              <TitleBlock />
            </FlexibleCard>
          </FlexibleUiContext.Provider>
        </SmartCardProvider>,
      );

      expect(
        screen.queryByTestId('hover-card-trigger-wrapper'),
      ).not.toBeInTheDocument();
    });

    it('should not render a hover preview when url is not provided in context', async () => {
      const cardState: CardState = {
        status: 'resolved',
        details: {
          meta: {
            access: 'granted',
            visibility: 'public',
          },
          data: {
            '@type': 'Object',
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            name: title,
          },
        },
      };

      render(
        <SmartCardProvider>
          <FlexibleUiContext.Provider value={context}>
            <FlexibleCard
              showHoverPreview={true}
              cardState={cardState}
              url={url}
            >
              <TitleBlock />
            </FlexibleCard>
          </FlexibleUiContext.Provider>
        </SmartCardProvider>,
      );

      expect(
        screen.queryByTestId('hover-card-trigger-wrapper'),
      ).not.toBeInTheDocument();
    });
  });

  describe('status', () => {
    it('triggers onResolve callback on resolved', async () => {
      const onResolve = jest.fn();
      const cardState = {
        status: 'resolved',
        details: { meta: {}, data: { name: title, url } },
      } as CardState;

      render(
        <SmartCardProvider>
          <FlexibleCard cardState={cardState} url={url} onResolve={onResolve}>
            <TitleBlock />
          </FlexibleCard>
        </SmartCardProvider>,
      );

      expect(onResolve).toHaveBeenCalledWith({ title, url });
    });

    it('triggers onResolve callback on resolved', async () => {
      const onResolve = jest.fn();
      const cardState = {
        status: SmartLinkStatus.Resolved,
        details: { meta: {}, data: { name: title, url } },
      } as CardState;

      render(
        <SmartCardProvider>
          <FlexibleCard cardState={cardState} onResolve={onResolve} url={url}>
            <TitleBlock />
          </FlexibleCard>
        </SmartCardProvider>,
      );

      expect(onResolve).toHaveBeenCalledWith({ title, url });
    });

    it.each([
      [SmartLinkStatus.Errored],
      [SmartLinkStatus.Fallback],
      [SmartLinkStatus.Forbidden],
      [SmartLinkStatus.NotFound],
      [SmartLinkStatus.Unauthorized],
    ])(
      'triggers onError callback with %s status',
      async (status: SmartLinkStatus) => {
        const onError = jest.fn();
        const cardState = {
          status,
          details: { meta: {}, data: { url } },
        } as CardState;

        render(
          <IntlProvider locale="en">
            <SmartCardProvider>
              <FlexibleCard cardState={cardState} onError={onError} url={url}>
                <TitleBlock />
              </FlexibleCard>
            </SmartCardProvider>
          </IntlProvider>,
        );

        expect(onError).toHaveBeenCalledWith({ status, url });
      },
    );
  });
});
