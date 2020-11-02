import React from 'react';

import SectionMessage from '@atlaskit/section-message';
import {
  Provider as SmartCardProvider,
  Client,
  ResolveResponse,
  CardAppearance,
  EditorCardProvider,
} from '@atlaskit/smart-card';

import Toggle from '@atlaskit/toggle';

import { default as FullPageExample } from './5-full-page';

const confluenceUrlMatch = /https?\:\/\/[a-zA-Z0-9\-]+\.atlassian\.net\/wiki\//i;

/**
 * This class is responsible for telling the editor which URLs can be converted to a card.
 * It will not be called if macro provider already converted the URL to an extension node.
 */
export class ConfluenceCardProvider extends EditorCardProvider {
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
export class ConfluenceCardClient extends Client {
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
    return new Promise(resolve => {
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

export type Props = {
  doc?: string | Object;
};

const RESOLVE_BEFORE_MACROS = ['jira'];

class FullPageWithFF extends React.Component<
  Props,
  {
    resolveBeforeMacros: string[];
    reloadEditor: boolean;
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      resolveBeforeMacros: RESOLVE_BEFORE_MACROS,
      reloadEditor: false,
    };
  }

  toggleFF = () => {
    const resolveBeforeMacros = this.state.resolveBeforeMacros.length
      ? []
      : RESOLVE_BEFORE_MACROS;
    this.setState({ resolveBeforeMacros, reloadEditor: true }, () => {
      this.setState({ reloadEditor: false });
    });
  };

  render() {
    return (
      <div>
        <div>
          <Toggle
            isChecked={!!this.state.resolveBeforeMacros.length}
            onChange={this.toggleFF}
          />
          Priortise smart links over {RESOLVE_BEFORE_MACROS.join(',')} macros
        </div>
        {!this.state.reloadEditor && (
          <FullPageExample
            defaultValue={this.props.doc}
            UNSAFE_cards={{
              // This is how we pass in the provider for smart cards
              provider: Promise.resolve(cardProvider),
              resolveBeforeMacros: this.state.resolveBeforeMacros,
              allowBlockCards: true,
              allowEmbeds: true,
              allowResizing: true,
            }}
          />
        )}
      </div>
    );
  }
}

const cardClient = new ConfluenceCardClient('staging');
const cardProvider = new ConfluenceCardProvider('staging');

// put into separate constant because prettier can't handle // in JSX
const jdogURL = 'https://jdog.jira-dev.com/browse/BENTO-3922';

export function Example(doc?: string | Object) {
  return (
    // We must wrap the <Editor> with a provider, passing cardClient via prop
    <SmartCardProvider client={cardClient}>
      <div>
        <SectionMessage title="Smart Cards in Confluence Editor">
          <p>
            Make sure you're logged into{' '}
            <a href="https://api-private.stg.atlassian.com/me" target="_blank">
              Atlassian Cloud on Staging
            </a>
            . Try pasting URLs to Hello, Google Drive, Asana, Dropbox, Trello
            etc. Links pasted in empty paragraphs will create a bigger, block
            card. Links pasted inside other elements (like lists, tables,
            panels) will be converted to a smaller, inline version of card. A
            gallery of available types of cards{' '}
            <a href="/packages/media/smart-card/example/gallery">
              can be found here
            </a>
          </p>
          <p>
            The mock macro provider will replace any JDOG issue link (e.g.
            <a href={jdogURL}>{jdogURL}</a>) with a "jira" macro.
          </p>
        </SectionMessage>
        <FullPageWithFF doc={doc} />
      </div>
    </SmartCardProvider>
  );
}

const demoTable = {
  type: 'table',
  attrs: { isNumberColumnEnabled: false, layout: 'wide' },
  content: [
    {
      type: 'tableRow',
      content: [
        {
          type: 'tableHeader',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column 1' }],
            },
          ],
        },
        {
          type: 'tableHeader',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column 2' }],
            },
          ],
        },
        {
          type: 'tableHeader',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column 3' }],
            },
          ],
        },
        {
          type: 'tableHeader',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column 4' }],
            },
          ],
        },
      ],
    },
    {
      type: 'tableRow',
      content: [
        {
          type: 'tableCell',
          attrs: {},
          content: [
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'inlineCard',
                          attrs: {
                            url:
                              'https://app.box.com/s/2emx282bjxpzvwa5bcz428u6imbgmasg',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'inlineCard',
                          attrs: {
                            url:
                              'https://app.box.com/s/2emx282bjxpzvwa5bcz428u6imbgmasg',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableCell',
          attrs: {},
          content: [
            {
              type: 'nestedExpand',
              attrs: {
                title: '',
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'inlineCard',
                      attrs: {
                        url: 'https://1drv.ms/u/s!Ar6KSn85S9AFh2zeAu3KOdvNDhv2',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableCell',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'inlineCard',
                  attrs: {
                    url: 'https://1drv.ms/u/s!Ar6KSn85S9AFh2zeAu3KOdvNDhv2',
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'tableCell',
          attrs: {},
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'inlineCard',
                  attrs: {
                    url: 'https://1drv.ms/u/s!Ar6KSn85S9AFh2zeAu3KOdvNDhv2',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const exampleDocument = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Here's an example of a block Smart Card (dropbox, action):",
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        url: 'https://www.dropbox.com/s/q3njsd094anqero/birdman.jpg?dl=0',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example of a Embed Smart Card (dropbox, action):',
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'embedCard',
      attrs: {
        url: 'https://www.dropbox.com/s/q3njsd094anqero/birdman.jpg?dl=0',
        layout: 'center',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Here's an example of a block Smart Card (native):",
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        url:
          'https://pug.jira-dev.com/wiki/spaces/~kihlberg/pages/4210950327/Klaus+on+Leave+28th+of+June+to+28th+of+July',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Here's an example of a block Smart Card (native, Jira):",
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        url: 'https://jdog.jira-dev.com/browse/BENTO-4222',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Here's an example of a block Smart Card:",
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'blockCard',
      attrs: {
        url:
          'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Here's an inline card surrounded by text:",
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'taskList',
      attrs: {
        localId: 'c7c7c52a-7790-466d-92d4-ab862ff267b6',
      },
      content: [
        {
          type: 'taskItem',
          attrs: {
            localId: 'cf26b83c-085c-4dd0-b9c7-873bb32c75f1',
            state: 'TODO',
          },
          content: [
            {
              type: 'inlineCard',
              attrs: {
                url:
                  'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Check out this document ',
          marks: [{ type: 'em' }],
        },
        {
          type: 'inlineCard',
          attrs: {
            url:
              'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
          },
        },
        {
          type: 'text',
          text: ' and let me know what you think...',
          marks: [{ type: 'em' }],
        },
      ],
    },
    demoTable,
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Here are some example URLs to get you started. You can copy and paste them back into the Editor - they will get converted into cards',
          marks: [
            {
              type: 'strong',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'https://product-fabric.atlassian.net/wiki/spaces/FIL/blog/2018/10/04/782762723/Media+premium+storage',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'https://hello.atlassian.net/wiki/spaces/~achamas/blog/2018/08/22/273578928/How+robots+can+write+docs+better+than+you+-+FEF+Talk',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'https://docs.google.com/document/d/1nXGwmxJuvQ8CdVQsGnRLOJOo7kJPqesmiBgvcaXD4Aw/edit',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://app.box.com/s/2emx282bjxpzvwa5bcz428u6imbgmasg',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://invis.io/P8OKINLRQEH',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://1drv.ms/u/s!Agkn_W9yVS7uaT4sLTx8bl2WYrs',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'https://trello.com/c/gfrst89H/4-much-muffins',
        },
      ],
    },
  ],
};

export default () => Example(exampleDocument);
