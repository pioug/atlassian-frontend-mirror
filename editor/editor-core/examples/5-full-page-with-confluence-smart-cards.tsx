import React from 'react';

import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import SectionMessage from '@atlaskit/section-message';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import Toggle from '@atlaskit/toggle';

import { default as FullPageExample } from './5-full-page';

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
            smartLinks={{
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
