import React from 'react';
import {
  code,
  md,
  Props,
  Example,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

const newConversationSource = `import { Conversation, ConversationResource } from '@atlaskit/conversation';

const provider = new ConversationResource({
  url: 'https://conversation-service/',
  user: {...}
});

<Conversation objectId="ari:cloud:platform::conversation/demo" provider={provider} />
`;

const existingConversationSource = `import { Conversation, ConversationResource } from '@atlaskit/conversation';

const provider = new ConversationResource({
  url: 'https://conversation-service/',
  user: {...}
});

const [conversation] = await provider.getConversations();
<Conversation id={conversation.conversationId} objectId="ari:cloud:platform::conversation/demo" provider={provider} />;
`;

const customEditorSource = `import { Conversation, ConversationResource } from '@atlaskit/conversation';

const provider = new ConversationResource({
  url: 'https://conversation-service/',
  user: {...}
});

const [conversation] = await provider.getConversations();
<Conversation
  id={conversation.conversationId}
  objectId="ari:cloud:platform::conversation/demo"
  provider={provider}
  renderEditor={(Editor, props) => <Editor {...props} saveOnEnter={true} />}
/>;
`;

const props = {
  kind: 'program',
  classes: [
    {
      kind: 'generic',
      name: {
        kind: 'id',
        name: 'Conversation',
        type: null,
      },
      value: {
        kind: 'object',
        members: [
          {
            key: {
              kind: 'id',
              name: 'objectId',
            },
            kind: 'property',
            optional: false,
            value: {
              kind: 'generic',
              value: {
                kind: 'string',
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'The container for the conversation. For example, a pull-request, Confluence page, Jira ticket, or blog post.',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'provider',
            },
            kind: 'property',
            optional: false,
            value: {
              kind: 'generic',
              value: {
                kind: 'class',
                name: { kind: 'id', name: 'ResourceProvider' },
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value: `The provider is an abstraction of the data-layer so that the components don't need to handle that. It comes with an internal store that drives the UI. In most cases you'll want to import the default provider, but you also have the option to override it with your own custom implementation.`,
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'id',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'generic',
              value: {
                kind: 'string',
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'The ID of the conversation. If not provided, a new converation will be created with the first comment.',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'isExpanded',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'generic',
              value: {
                kind: 'boolean',
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'When set to true the conversation will render with the editor expanded.',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'dataProviders',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'generic',
              value: {
                kind: 'class',
                name: { kind: 'id', name: 'ProviderFactory' },
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'Optionally pass in a ProviderFactory to enable features like emojis and mentions.',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'meta',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'object',
              members: [
                {
                  key: {
                    kind: 'id',
                    name: '[key: string]',
                  },
                  kind: 'property',
                  optional: true,
                  value: {
                    kind: 'any',
                  },
                },
              ],
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'Optional meta data that will be stored with the conversation. This is useful if you want to associate the conversation with a particular line-number, paragraph, etc.',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'onCancel',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'generic',
              value: {
                kind: 'function',
                parameters: [],
                returnType: {
                  kind: 'void',
                },
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'Will be called when the cancel-button in the editor is pressed.',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'renderEditor',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'generic',
              value: {
                kind: 'function',
                returnType: {
                  kind: 'generic',
                  value: {
                    kind: 'id',
                    name: 'JSX.Element',
                  },
                },
                parameters: [
                  {
                    kind: 'param',
                    type: null,
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'Editor',
                      },
                    },
                  },
                  {
                    kind: 'param',
                    type: null,
                    value: {
                      kind: 'generic',
                      value: {
                        kind: 'id',
                        name: 'EditorProps',
                      },
                    },
                  },
                ],
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'Optionally override the rendering of the editor. This is usefull if you need to customize the editor in any way.',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'placeholder',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'generic',
              value: {
                kind: 'string',
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'Optionally set the placeholder text for the editor. Defaults to "What do you want to say?"',
              },
            ],
          },
          {
            key: {
              kind: 'id',
              name: 'allowFeedbackAndHelpButtons',
            },
            kind: 'property',
            optional: true,
            value: {
              kind: 'generic',
              value: {
                kind: 'boolean',
              },
            },
            leadingComments: [
              {
                type: 'commentBlock',
                value:
                  'Optionally allow the feedback and help buttons in the editor. The feedback button requires jQuery to be loaded on the page.',
              },
            ],
          },
        ],
      },
    },
  ],
};

export default md`
  ${(<AtlassianInternalWarning />)}

  The Conversation component is a drop-in component for adding conversations in any context. Consumers are responsible for providing their own storage.

  ## What is a Conversation?

  A conversation is a _group of comments_. The \`Conversation Service\` lets you associate any number of comments with a container (eg. pull-request, Confluence page, etc.), but in order for them to be meaningful they need to be grouped by conversations.

  A conversation can also contain any kind of meta-data, which can be used to render the conversation in the right place on a page (eg. inline comments).

  ## Usage

  The conversation component is a mini-app which comes with an internal store. It's completely driven by a provider (\`ConversationResource\`).

  Using the component is fairly straight forward. Just import \`Conversation\` and \`ConversationResource\` from \`@atlaskit/conversation\`. The component can then be used like below.
  
  ${code`import { Conversation, ConversationResource } from '@atlaskit/conversation';`}
  
  ${(
    <Example
      Component={require('../examples/0-New-Conversation').default}
      title="New Conversation Example"
      source={newConversationSource}
    />
  )}

  Omitting the \`id\`-prop means that a new conversation will be created. Of course, in most cases you'll want to render existing conversations on a page as well. The provider let's you fetch all conversations for a container by calling \`.getConversations()\`.

  ${(
    <Example
      Component={require('../examples/1-Existing-Conversation').default}
      title="Existing Conversation Example"
      source={existingConversationSource}
    />
  )}

  The rendering of the editor can be customized by using the \`renderEditor\` prop. Here's an example using "saveOnEnter":

  ${(
    <Example
      Component={require('../examples/2-Customized-Editor').default}
      title="Customized Editor"
      source={customEditorSource}
    />
  )}

  ${(<Props props={props} />)}

`;
