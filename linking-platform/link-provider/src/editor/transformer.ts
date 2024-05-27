import {
  type CardAppearance,
  type BlockCardAdf,
  type CardAdf,
  type EmbedCardAdf,
  type InlineCardAdf,
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

  toAdf(url: string, appearance: CardAppearance): CardAdf {
    switch (appearance) {
      case 'inline':
        return this.buildInlineAdf(url);
      case 'block':
        return this.buildBlockAdf(url);
      case 'embed':
        return this.buildEmbedAdf(url);
    }
  }
}
