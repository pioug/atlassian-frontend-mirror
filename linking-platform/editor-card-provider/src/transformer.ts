import {
  CardAppearance,
  BlockCardAdf,
  CardAdf,
  EmbedCardAdf,
  InlineCardAdf,
  DatasourceAdf,
  Datasource,
} from '@atlaskit/linking-common';

export class Transformer {
  private buildInlineAdf(url: string): InlineCardAdf {
    return {
      type: 'inlineCard',
      attrs: {
        url,
      },
    };
  }

  private buildBlockAdf(url: string): BlockCardAdf {
    return {
      type: 'blockCard',
      attrs: {
        url,
      },
    };
  }

  private buildEmbedAdf(url: string): EmbedCardAdf {
    return {
      type: 'embedCard',
      attrs: {
        url,
        layout: 'wide',
      },
    };
  }

  private buildDatasourceAdf(
    datasource: Datasource,
    url?: string,
  ): DatasourceAdf {
    return {
      type: 'blockCard',
      attrs: {
        url,
        datasource,
      },
    };
  }

  toSmartlinkAdf(url: string, appearance: CardAppearance): CardAdf {
    switch (appearance) {
      case 'inline':
        return this.buildInlineAdf(url);
      case 'block':
        return this.buildBlockAdf(url);
      case 'embed':
        return this.buildEmbedAdf(url);
    }
  }

  toDatasourceAdf(datasource: Datasource, url?: string): DatasourceAdf {
    return this.buildDatasourceAdf(datasource, url);
  }
}
