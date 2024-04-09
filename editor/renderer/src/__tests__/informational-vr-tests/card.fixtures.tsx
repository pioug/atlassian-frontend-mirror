import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import type { CardClient } from '@atlaskit/link-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';

import { Renderer } from '../../ui';
import {
  NotFoundClient,
  ForbiddenClient,
  ErroredClient,
  UnauthorizedClient,
  ResolvingClient,
  embedContent,
  ResolvedClient,
  ForbiddenWithSiteDeniedRequestClient,
  ForbiddenWithSiteDirectAccessClient,
  ForbiddenWithObjectRequestAccessClient,
  ForbiddenWithSitePendingRequestClient,
  ForbiddenWithSiteRequestAccessClient,
  ForbiddenWithSiteApprovedRequestClient,
  ForbiddenWithSiteForbiddenClient,
} from './card.customClient';

import { DiProvider, injectable } from 'react-magnetic-di';
// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { IFrame } from '../../../../../linking-platform/smart-card/src/view/EmbedCard/components/IFrame';

mockDatasourceFetchRequests({
  initialVisibleColumnKeys: ['key', 'assignee', 'summary', 'description'],
  delayedResponse: false,
});

const MockIFrame: typeof IFrame = injectable(
  IFrame,
  ({ childRef, ...props }) => (
    <iframe ref={childRef} {...props} srcDoc={embedContent} />
  ),
);

const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const providerFactory = ProviderFactory.create({
  contextIdentifierProvider,
});

const buildEmbedCardWithAttributesAdf = (
  attributes: Record<string, unknown>,
) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'embedCard',
      attrs: {
        ...attributes,
      },
    },
  ],
});

const buildEmbedCardAdf = (
  url: string,
  layout: 'center' | 'wide' = 'center',
) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'embedCard',
      attrs: {
        url: url,
        layout,
      },
    },
  ],
});

const buildBlockCardAdf = (url: string) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'blockCard',
      attrs: {
        url: url,
      },
    },
  ],
});

const buildBlockCardWithAttributesAdf = (
  attributes: Record<string, unknown>,
) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'blockCard',
      attrs: {
        ...attributes,
      },
    },
  ],
});

const buildInlineCardAdf = (url: string) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'inlineCard',
          attrs: {
            url,
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
  ],
});

const buildRendererExampleAttributes = (width: string) => {
  const attrs = {
    url: 'https://a4t-moro.jira-dev.com/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC',
    datasource: {
      id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
      parameters: {
        cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
        jql: 'project=EDM',
      },
      views: [
        {
          type: 'table',
          properties: {
            columns: [
              {
                key: 'key',
              },
              {
                key: 'description',
              },
            ],
          },
        },
      ],
    },
    layout: width,
  };

  return attrs;
};

const SmartCardTestWrapper = ({
  adf,
  client,
}: {
  adf: unknown;
  client: CardClient;
}) => {
  return (
    <SmartCardProvider client={client}>
      <DiProvider use={[MockIFrame]}>
        <MockMediaClientProvider>
          <Renderer
            adfStage={'stage0'}
            // @ts-expect-error
            document={adf}
            appearance={'full-page'}
            dataProviders={providerFactory}
            media={{
              allowLinking: true,
            }}
            allowColumnSorting={true}
          />
        </MockMediaClientProvider>
      </DiProvider>
    </SmartCardProvider>
  );
};

export const RendererInlineCard = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('https://inlineCardTestUrl')}
      client={new ResolvedClient()}
    />
  );
};

export const RendererInlineCardXSS = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('javascript:alert(document.domain)')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererInlineCardResolving = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('https://inlineCardTestUrl/resolving')}
      client={new ResolvingClient(1000000)}
    />
  );
};

export const RendererInlineCardUnauthorized = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('https://inlineCardTestUrl/unauthorized')}
      client={new UnauthorizedClient()}
    />
  );
};

export const RendererInlineCardForbidden = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('https://inlineCardTestUrl/forbidden')}
      client={new ForbiddenClient()}
    />
  );
};

export const RendererInlineCardNotFound = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('https://inlineCardTestUrl/notFound')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererInlineCardErrored = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('https://inlineCardTestUrl/errored')}
      client={new ErroredClient()}
    />
  );
};

export const RendererBlockCard = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf('https://blockCardTestUrl')}
      client={new ResolvedClient()}
    />
  );
};

export const RendererBlockCardXSS = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('javascript:alert(document.domain)')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererBlockCardResolving = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf('https://blockCardTestUrl/resolving')}
      client={new ResolvingClient(1000000)}
    />
  );
};

export const RendererBlockCardUnauthorized = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf('https://blockCardTestUrl/unauthorized')}
      client={new UnauthorizedClient()}
    />
  );
};

export const RendererBlockCardForbidden = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf('https://inlineCardTestUrl/forbidden')}
      client={new ForbiddenClient()}
    />
  );
};

export const RendererBlockCardNotFound = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf('https://blockCardTestUrl/notFound')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererBlockCardErrored = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf('https://blockCardTestUrl/errored')}
      client={new ErroredClient()}
    />
  );
};

export const RendererEmbedCard = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl')}
      client={new ResolvedClient()}
    />
  );
};

export const RendererEmbedCardXSS = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('javascript:alert(document.domain)')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererEmbedCardWide = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl', 'wide')}
      // Honestly doesn't really matter - we just need to check the layout
      client={new NotFoundClient()}
    />
  );
};

export const RendererEmbedCardResolving = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl/resolving')}
      client={new ResolvingClient(1000000)}
    />
  );
};
export const RendererEmbedCardUnauthorized = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl/unauthorized')}
      client={new UnauthorizedClient()}
    />
  );
};
export const RendererEmbedCardForbidden = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl/forbidden')}
      client={new ForbiddenClient()}
    />
  );
};
export const RendererEmbedCardNotFound = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl/notFound')}
      client={new NotFoundClient()}
    />
  );
};
export const RendererEmbedCardErrored = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl/errored')}
      client={new ErroredClient()}
    />
  );
};

export const RendererEmbedCardComplex = () => {
  const attrs = {
    layout: 'center',
    originalHeight: 322,
    originalWidth: null,
    url: 'https://embedCardTestUrl',
    width: 100,
  };

  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardWithAttributesAdf(attrs)}
      // Honestly doesn't really matter - we just need to check the layout
      client={new NotFoundClient()}
    />
  );
};

export const RendererEmbedCardCenterLayoutAndNoWidth = () => {
  const attrs = {
    layout: 'center',
    originalWidth: null,
    originalHeight: 331,
    url: 'https://embedCardTestUrl',
  };

  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardWithAttributesAdf(attrs)}
      client={new ResolvedClient()}
    />
  );
};

export const RendererEmbedCardCenterLayout100PercentWidth = () => {
  const attrs = {
    layout: 'center',
    originalWidth: null,
    width: 100,
    originalHeight: 331,
    url: 'https://embedCardTestUrl',
  };

  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardWithAttributesAdf(attrs)}
      client={new ResolvedClient()}
    />
  );
};

export const RendererEmbedCardCenterLayout88PercentWidth = () => {
  const attrs = {
    layout: 'center',
    originalWidth: null,
    width: 88,
    originalHeight: 262,
    url: 'https://embedCardTestUrl',
  };

  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardWithAttributesAdf(attrs)}
      client={new ResolvedClient()}
    />
  );
};
// ------
export const RendererEmbedCardCenterLayoutNoHeightAndNoMessageAndNoWidth =
  () => {
    const attrs = {
      layout: 'center',
      originalWidth: null,
      originalHeight: undefined,
      url: 'https://embedCardTestUrl/noMessages',
    };

    return (
      <SmartCardTestWrapper
        adf={buildEmbedCardWithAttributesAdf(attrs)}
        client={new ResolvedClient()}
      />
    );
  };

export const RendererEmbedCardCenterLayoutNoHeightAndNoMessage100PercentWidth =
  () => {
    const attrs = {
      layout: 'center',
      originalWidth: null,
      width: 100,
      originalHeight: undefined,
      url: 'https://embedCardTestUrl/noMessages',
    };

    return (
      <SmartCardTestWrapper
        adf={buildEmbedCardWithAttributesAdf(attrs)}
        client={new ResolvedClient()}
      />
    );
  };

export const RendererEmbedCardCenterLayoutNoHeightAndNoMessage88PercentWidth =
  () => {
    const attrs = {
      layout: 'center',
      originalWidth: null,
      width: 88,
      originalHeight: undefined,
      url: 'https://embedCardTestUrl/noMessages',
    };

    return (
      <SmartCardTestWrapper
        adf={buildEmbedCardWithAttributesAdf(attrs)}
        client={new ResolvedClient()}
      />
    );
  };

export const RendererBlockCardFullWidthLayout = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardWithAttributesAdf(
        buildRendererExampleAttributes('full-width'),
      )}
      client={new ResolvedClient()}
    />
  );
};

export const RendererBlockCardDefaultWidthLayout = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardWithAttributesAdf(
        buildRendererExampleAttributes('center'),
      )}
      client={new ResolvedClient()}
    />
  );
};

export const RendererBlockCardWideWidthLayout = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardWithAttributesAdf(
        buildRendererExampleAttributes('wide'),
      )}
      client={new ResolvedClient()}
    />
  );
};

// Inline card forbidden links with request access
export const RendererInlineCardRequestAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf(
        'https://inlineCardTestUrl/forbidden/REQUEST_ACCESS',
      )}
      client={new ForbiddenWithSiteRequestAccessClient()}
    />
  );
};

export const RendererInlineCardForbiddenPendingRequestAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf(
        'https://inlineCardTestUrl/forbidden/PENDING_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSitePendingRequestClient()}
    />
  );
};

export const RendererInlineCardRequestAccessForbidden = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf('https://inlineCardTestUrl/forbidden/FORBIDDEN')}
      client={new ForbiddenWithSiteForbiddenClient()}
    />
  );
};

export const RendererInlineCardRequestAccessDirectAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf(
        'https://inlineCardTestUrl/forbidden/DIRECT_ACCESS',
      )}
      client={new ForbiddenWithSiteDirectAccessClient()}
    />
  );
};

export const RendererInlineCardRequestAccessDeniedRequestExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf(
        'https://inlineCardTestUrl/forbidden/DENIED_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSiteDeniedRequestClient()}
    />
  );
};

export const RendererInlineCardForbiddenRequestApprovedRequestExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf(
        'https://inlineCardTestUrl/forbidden/APPROVED_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSiteApprovedRequestClient()}
    />
  );
};

export const RendererInlineCardRequestAccessAccessExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildInlineCardAdf(
        'https://inlineCardTestUrl/forbidden/ACCESS_EXISTS',
      )}
      client={new ForbiddenWithObjectRequestAccessClient()}
    />
  );
};

// block card forbidden links with request access
export const RendererBlockCardRequestAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf(
        'https://blockCardTestUrl/forbidden/REQUEST_ACCESS',
      )}
      client={new ForbiddenWithSiteRequestAccessClient()}
    />
  );
};

export const RendererBlockCardForbiddenPendingRequestAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf(
        'https://blockCardTestUrl/forbidden/PENDING_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSitePendingRequestClient()}
    />
  );
};

export const RendererBlockCardRequestAccessForbidden = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf('https://blockCardTestUrl/forbidden/FORBIDDEN')}
      client={new ForbiddenWithSiteForbiddenClient()}
    />
  );
};

export const RendererBlockCardRequestAccessDirectAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf(
        'https://blockCardTestUrl/forbidden/DIRECT_ACCESS',
      )}
      client={new ForbiddenWithSiteDirectAccessClient()}
    />
  );
};

export const RendererBlockCardRequestAccessDeniedRequestExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf(
        'https://blockCardTestUrl/forbidden/DENIED_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSiteDeniedRequestClient()}
    />
  );
};

export const RendererBlockCardForbiddenRequestApprovedRequestExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf(
        'https://blockCardTestUrl/forbidden/APPROVED_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSiteApprovedRequestClient()}
    />
  );
};

export const RendererBlockCardRequestAccessAccessExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildBlockCardAdf(
        'https://blockCardTestUrl/forbidden/ACCESS_EXISTS',
      )}
      client={new ForbiddenWithObjectRequestAccessClient()}
    />
  );
};

// Embed card forbidden links with request access
export const RendererEmbedCardRequestAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf(
        'https://embedCardTestUrl/forbidden/REQUEST_ACCESS',
      )}
      client={new ForbiddenWithSiteRequestAccessClient()}
    />
  );
};

export const RendererEmbedCardForbiddenPendingRequestAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf(
        'https://embedCardTestUrl/forbidden/PENDING_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSitePendingRequestClient()}
    />
  );
};

export const RendererEmbedCardRequestAccessForbidden = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf('https://embedCardTestUrl/forbidden/FORBIDDEN')}
      client={new ForbiddenWithSiteForbiddenClient()}
    />
  );
};

export const RendererEmbedCardRequestAccessDirectAccess = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf(
        'https://embedCardTestUrl/forbidden/DIRECT_ACCESS',
      )}
      client={new ForbiddenWithSiteDirectAccessClient()}
    />
  );
};

export const RendererEmbedCardRequestAccessDeniedRequestExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf(
        'https://embedCardTestUrl/forbidden/DENIED_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSiteDeniedRequestClient()}
    />
  );
};

export const RendererEmbedCardForbiddenRequestApprovedRequestExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf(
        'https://embedCardTestUrl/forbidden/APPROVED_REQUEST_EXISTS',
      )}
      client={new ForbiddenWithSiteApprovedRequestClient()}
    />
  );
};

export const RendererEmbedCardRequestAccessAccessExists = () => {
  return (
    <SmartCardTestWrapper
      adf={buildEmbedCardAdf(
        'https://embedCardTestUrl/forbidden/ACCESS_EXISTS',
      )}
      client={new ForbiddenWithObjectRequestAccessClient()}
    />
  );
};
