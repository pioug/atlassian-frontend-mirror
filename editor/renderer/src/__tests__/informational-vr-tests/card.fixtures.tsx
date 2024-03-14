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
} from './card.customClient';

mockDatasourceFetchRequests({
  initialVisibleColumnKeys: ['key', 'assignee', 'summary', 'description'],
  delayedResponse: false,
});

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

const Comp = ({ adf, client }: { adf: unknown; client: CardClient }) => {
  return (
    <SmartCardProvider client={client}>
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
    </SmartCardProvider>
  );
};

export const RendererInlineCard = () => {
  return (
    <Comp
      adf={buildInlineCardAdf('https://inlineCardTestUrl')}
      // TODO Update with new client for gemini test
      client={new ResolvingClient(1000000)}
    />
  );
};

export const RendererInlineCardResolving = () => {
  return (
    <Comp
      adf={buildInlineCardAdf('https://inlineCardTestUrl/resolving')}
      client={new ResolvingClient(1000000)}
    />
  );
};

export const RendererInlineCardUnauthorized = () => {
  return (
    <Comp
      adf={buildInlineCardAdf('https://inlineCardTestUrl/unauthorized')}
      client={new UnauthorizedClient()}
    />
  );
};

export const RendererInlineCardForbidden = () => {
  return (
    <Comp
      adf={buildInlineCardAdf('https://inlineCardTestUrl/forbidden')}
      client={new ForbiddenClient()}
    />
  );
};

export const RendererInlineCardNotFound = () => {
  return (
    <Comp
      adf={buildInlineCardAdf('https://inlineCardTestUrl/notFound')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererInlineCardErrored = () => {
  return (
    <Comp
      adf={buildInlineCardAdf('https://inlineCardTestUrl/errored')}
      client={new ErroredClient()}
    />
  );
};

export const RendererBlockCard = () => {
  return (
    <Comp
      adf={buildBlockCardAdf('https://blockCardTestUrl')}
      // TODO Update with new client for gemini test
      client={new ResolvingClient(1000000)}
    />
  );
};

export const RendererBlockCardResolving = () => {
  return (
    <Comp
      adf={buildBlockCardAdf('https://blockCardTestUrl/resolving')}
      client={new ResolvingClient(1000000)}
    />
  );
};

export const RendererBlockCardUnauthorized = () => {
  return (
    <Comp
      adf={buildBlockCardAdf('https://blockCardTestUrl/unauthorized')}
      client={new UnauthorizedClient()}
    />
  );
};

export const RendererBlockCardForbidden = () => {
  return (
    <Comp
      adf={buildBlockCardAdf('https://blockCardTestUrl/forbidden')}
      client={new ForbiddenClient()}
    />
  );
};

export const RendererBlockCardNotFound = () => {
  return (
    <Comp
      adf={buildBlockCardAdf('https://blockCardTestUrl/notFound')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererBlockCardErrored = () => {
  return (
    <Comp
      adf={buildBlockCardAdf('https://blockCardTestUrl/errored')}
      client={new ErroredClient()}
    />
  );
};

export const RendererEmbedCard = () => {
  return (
    <Comp
      adf={buildEmbedCardAdf('https://embedCardTestUrl')}
      client={new NotFoundClient()}
    />
  );
};

export const RendererEmbedCardWide = () => {
  return (
    <Comp
      adf={buildEmbedCardAdf('https://embedCardTestUrl', 'wide')}
      // Honestly doesn't really matter - we just need to check the layout
      client={new NotFoundClient()}
    />
  );
};

export const RendererEmbedCardResolving = () => {
  return (
    <Comp
      adf={buildEmbedCardAdf('https://embedCardTestUrl/resolving')}
      client={new ResolvingClient(1000000)}
    />
  );
};
export const RendererEmbedCardUnauthorized = () => {
  return (
    <Comp
      adf={buildEmbedCardAdf('https://embedCardTestUrl/unauthorized')}
      client={new UnauthorizedClient()}
    />
  );
};
export const RendererEmbedCardForbidden = () => {
  return (
    <Comp
      adf={buildEmbedCardAdf('https://embedCardTestUrl/forbidden')}
      client={new ForbiddenClient()}
    />
  );
};
export const RendererEmbedCardNotFound = () => {
  return (
    <Comp
      adf={buildEmbedCardAdf('https://embedCardTestUrl/notFound')}
      client={new NotFoundClient()}
    />
  );
};
export const RendererEmbedCardErrored = () => {
  return (
    <Comp
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
    <Comp
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
    <Comp
      adf={buildEmbedCardWithAttributesAdf(attrs)}
      // TODO Update with new client for gemini test
      client={new ResolvingClient(1000000)}
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
    <Comp
      adf={buildEmbedCardWithAttributesAdf(attrs)}
      // TODO Update with new client for gemini test
      client={new ResolvingClient(1000000)}
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
    <Comp
      adf={buildEmbedCardWithAttributesAdf(attrs)}
      // TODO Update with new client for gemini test
      client={new ResolvingClient(1000000)}
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
      <Comp
        adf={buildEmbedCardWithAttributesAdf(attrs)}
        // TODO Update with new client for gemini test
        client={new ResolvingClient(1000000)}
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
      <Comp
        adf={buildEmbedCardWithAttributesAdf(attrs)}
        // TODO Update with new client for gemini test
        client={new ResolvingClient(1000000)}
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
      <Comp
        adf={buildEmbedCardWithAttributesAdf(attrs)}
        // TODO Update with new client for gemini test
        client={new ResolvingClient(1000000)}
      />
    );
  };
