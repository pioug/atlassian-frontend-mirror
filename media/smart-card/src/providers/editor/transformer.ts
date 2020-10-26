import { CardAppearance } from '../../view/Card';

const isJiraRoadMap = (url: string) =>
  url.match(
    /^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/.*?\/roadmap\/?$/,
  );

export class Transformer {
  private buildInlineAdf(url: string) {
    return {
      type: 'inlineCard',
      attrs: {
        url,
      },
    };
  }

  private buildBlockAdf(url: string) {
    return {
      type: 'blockCard',
      attrs: {
        url,
      },
    };
  }

  private buildEmbedAdf(url: string) {
    return {
      type: 'embedCard',
      attrs: {
        url,
        layout: 'wide',
      },
    };
  }

  toAdf(url: string, appearance: CardAppearance) {
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
