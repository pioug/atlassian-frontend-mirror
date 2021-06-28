import {
  EditorCardProvider,
  CardAppearance,
  ResolveResponse,
  Client,
} from '@atlaskit/smart-card';

import { createPromise } from '../cross-platform-promise';
import { IS_DEV, IS_DUMMY } from '../utils';

export class EditorMobileCardProvider extends EditorCardProvider {
  async resolve(url: string, appearance: CardAppearance): Promise<any> {
    /*
     * Called when a link is pasted inisde
     * return {
     *  type: 'inlineCard', // we always want inline cards for Confluence cards
     *   attrs: {
     *     url: string,
     *   },
      };
     */
    const getLinkResolve = await createPromise('getLinkResolve', {
      url,
      appearance,
    }).submit();

    if (typeof getLinkResolve === 'object') {
      return getLinkResolve;
    } else {
      return super.resolve(url, appearance);
    }
  }
}

export class MobileSmartCardClient extends Client {
  async fetchData(url: string) {
    /*
     *
     * This is called when an inlineCard | blockCard is loaded in the document
     * or from the renderer
     * Response from the native side should have the shape of ResolveResponse
     * https://atlaskit.atlassian.com/packages/media/smart-card/docs/client
     *
     */
    return createPromise('getResolvedLink', { url })
      .submit()
      .then(
        (response) => response,
        (error) => error,
      );
  }
}

let CardClient = MobileSmartCardClient;
let CardProvider = EditorMobileCardProvider;

// Use mock providers when in development and using DummyBridge
if (IS_DEV && IS_DUMMY) {
  const confluenceUrlMatch = /https?\:\/\/[a-zA-Z0-9\-]+\.atlassian\.net\/wiki\//i;

  class ConfluenceCardProvider extends EditorCardProvider {
    /**
     * This method must resolve to a valid ADF that will be used to
     * replace a blue link after user pastes URL.
     *
     * @param url The pasted URL
     * @param appearance Appearance requested by the Editor
     */
    async resolve(url: string, appearance: CardAppearance): Promise<any> {
      // This example uses a regex .match() but we could use a backend call below
      if (url.match(confluenceUrlMatch)) {
        return {
          type: 'inlineCard', // we always want inline cards for Confluence cards
          attrs: {
            url,
          },
        };
      }

      // If the URL doesn't look like a confluence URL, try native provider.
      return super.resolve(url, appearance);
    }
  }

  /**
   * A Client is responsible for resolving URLs to JSON-LD with metadata
   */
  class ConfluenceCardClient extends Client {
    fetchData(url: string): Promise<ResolveResponse> {
      if (!url.match(confluenceUrlMatch)) {
        // This doesn't look like Confluence URL, so let's use native resolver
        return super.fetchData(url);
      }

      // In this example, we will use mock response, but in real implementation
      // we would probably use window.fetch() to resolve the url and then map
      // it to JSON-LD format. To read more about the format, please visit:
      //   https://product-fabric.atlassian.net/wiki/spaces/CS/pages/609257121/Document
      //
      return new Promise((resolve) => {
        // We simulate a 2s load time
        window.setTimeout(() => {
          resolve({
            meta: {
              visibility: 'restricted',
              access: 'granted',
              auth: [],
              definitionId: 'confluence-native-resolve',
            },
            data: {
              '@context': {
                '@vocab': 'https://www.w3.org/ns/activitystreams#',
                atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
                schema: 'http://schema.org/',
              },
              '@type': ['schema:DigitalDocument', 'Document'],
              name: decodeURIComponent(
                url.match(/.+\/(.*?)(?:\?|$)/)![1],
              ).replace(/\+/g, ' '),
              url,
            },
          });
        }, 2000);
      });
    }
  }

  CardClient = ConfluenceCardClient;
  CardProvider = ConfluenceCardProvider;
}

export const createCardProvider = async () => new CardProvider();
export const createCardClient = () => new CardClient();
