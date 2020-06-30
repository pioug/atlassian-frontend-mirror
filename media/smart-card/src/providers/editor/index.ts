import { CardAppearance } from '../../view/Card';
import { getResolverUrl, getBaseUrl } from '../../client/utils/environments';
import { EnvironmentsKeys } from '../../client/types';
import { CardProvider, ORSCheckResponse } from './types';

const isJiraRoadMap = (url: string) =>
  url.match(
    /^https:\/\/.*?\/jira\/software\/projects\/([^\/]+?)\/boards\/.*?\/roadmap\/?$/,
  );

export class EditorCardProvider implements CardProvider {
  private baseUrl: string;
  private resolverUrl: string;

  constructor(envKey?: EnvironmentsKeys) {
    this.baseUrl = getBaseUrl(envKey);
    this.resolverUrl = getResolverUrl(envKey);
  }

  async resolve(url: string, appearance: CardAppearance): Promise<any> {
    try {
      const constructedUrl = `${this.resolverUrl}/check`;
      const result: ORSCheckResponse = await (
        await fetch(constructedUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Origin: this.baseUrl,
          },
          body: JSON.stringify({ resourceUrl: url }),
        })
      ).json();

      if (result && result.isSupported) {
        if (isJiraRoadMap(url)) {
          return {
            type: 'embedCard',
            attrs: {
              url,
              layout: 'wide',
            },
          };
        }
        return {
          type: appearance === 'inline' ? 'inlineCard' : 'blockCard',
          attrs: {
            url,
          },
        };
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn(
        `Error when trying to check Smart Card url "${url} - ${e.prototype.name} ${e.message}`,
        e,
      );
    }

    return Promise.reject(undefined);
  }
}

export const editorCardProvider = new EditorCardProvider();
export { CardProvider, ORSCheckResponse } from './types';
