import { CardAppearance } from '../../view/Card';
import { getResolverUrl, getBaseUrl } from '../../utils/environments';
import { EnvironmentsKeys } from '../../client/types';
import { CardProvider, ORSCheckResponse } from './types';

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
