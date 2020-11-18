import { CardAppearance } from '../../view/Card';
import { BlockCardAdf, CardAdf, EmbedCardAdf, InlineCardAdf } from './types';

const isJiraRoadMap = (url: string) =>
  url.match(
    /^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/.*?\/roadmap\/?$/,
  );

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
    if (isJiraRoadMap(url)) {
      return this.buildEmbedAdf(url);
    } else {
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
}
