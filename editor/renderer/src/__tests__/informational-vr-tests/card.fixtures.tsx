import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { MockMediaClientProvider } from '@atlaskit/editor-test-helpers/media-client-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';

import { Renderer } from '../../ui';

const smartCardClient = new CardClient('stg');

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

const buildEmbedCardAdf = (url: string) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'embedCard',
      attrs: {
        url: url,
        layout: 'center',
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

const Comp = ({ adf }: { adf: unknown }) => {
  return (
    <SmartCardProvider client={smartCardClient}>
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
  return <Comp adf={buildInlineCardAdf('https://inlineCardTestUrl')} />;
};

export const RendererInlineCardResolving = () => {
  return (
    <Comp adf={buildInlineCardAdf('https://inlineCardTestUrl/resolving')} />
  );
};

export const RendererInlineCardUnauthorized = () => {
  return (
    <Comp adf={buildInlineCardAdf('https://inlineCardTestUrl/unauthorized')} />
  );
};

export const RendererInlineCardForbidden = () => {
  return (
    <Comp adf={buildInlineCardAdf('https://inlineCardTestUrl/forbidden')} />
  );
};

export const RendererInlineCardNotFound = () => {
  return (
    <Comp adf={buildInlineCardAdf('https://inlineCardTestUrl/notFound')} />
  );
};

export const RendererInlineCardErrored = () => {
  return <Comp adf={buildInlineCardAdf('https://inlineCardTestUrl/errored')} />;
};

export const RendererBlockCard = () => {
  return <Comp adf={buildBlockCardAdf('https://blockCardTestUrl')} />;
};

export const RendererBlockCardResolving = () => {
  return <Comp adf={buildBlockCardAdf('https://blockCardTestUrl/resolving')} />;
};

export const RendererBlockCardUnauthorized = () => {
  return (
    <Comp adf={buildBlockCardAdf('https://blockCardTestUrl/unauthorized')} />
  );
};

export const RendererBlockCardForbidden = () => {
  return <Comp adf={buildBlockCardAdf('https://blockCardTestUrl/forbidden')} />;
};

export const RendererBlockCardNotFound = () => {
  return <Comp adf={buildBlockCardAdf('https://blockCardTestUrl/notFound')} />;
};

export const RendererBlockCardErrored = () => {
  return <Comp adf={buildBlockCardAdf('https://blockCardTestUrl/errored')} />;
};

export const RendererEmbedCard = () => {
  return <Comp adf={buildEmbedCardAdf('https://embedCardTestUrl')} />;
};
export const RendererEmbedCardResolving = () => {
  return <Comp adf={buildEmbedCardAdf('https://embedCardTestUrl/resolving')} />;
};
export const RendererEmbedCardUnauthorized = () => {
  return (
    <Comp adf={buildEmbedCardAdf('https://embedCardTestUrl/unauthorized')} />
  );
};
export const RendererEmbedCardForbidden = () => {
  return <Comp adf={buildEmbedCardAdf('https://embedCardTestUrl/forbidden')} />;
};
export const RendererEmbedCardNotFound = () => {
  return <Comp adf={buildEmbedCardAdf('https://embedCardTestUrl/notFound')} />;
};
export const RendererEmbedCardErrored = () => {
  return <Comp adf={buildEmbedCardAdf('https://embedCardTestUrl/errored')} />;
};

export const RendererEmbedCardComplex = () => {
  const attrs = {
    layout: 'center',
    originalHeight: 322,
    originalWidth: null,
    url: 'https://embedCardTestUrl',
    width: 100,
  };

  return <Comp adf={buildEmbedCardWithAttributesAdf(attrs)} />;
};

export const RendererEmbedCardCenterLayoutAndNoWidth = () => {
  const attrs = {
    layout: 'center',
    originalWidth: null,
    originalHeight: 331,
    url: 'https://embedCardTestUrl',
  };

  return <Comp adf={buildEmbedCardWithAttributesAdf(attrs)} />;
};

export const RendererEmbedCardCenterLayout100PercentWidth = () => {
  const attrs = {
    layout: 'center',
    originalWidth: null,
    width: 100,
    originalHeight: 331,
    url: 'https://embedCardTestUrl',
  };

  return <Comp adf={buildEmbedCardWithAttributesAdf(attrs)} />;
};

export const RendererEmbedCardCenterLayout88PercentWidth = () => {
  const attrs = {
    layout: 'center',
    originalWidth: null,
    width: 88,
    originalHeight: 262,
    url: 'https://embedCardTestUrl',
  };

  return <Comp adf={buildEmbedCardWithAttributesAdf(attrs)} />;
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

    return <Comp adf={buildEmbedCardWithAttributesAdf(attrs)} />;
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

    return <Comp adf={buildEmbedCardWithAttributesAdf(attrs)} />;
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

    return <Comp adf={buildEmbedCardWithAttributesAdf(attrs)} />;
  };
