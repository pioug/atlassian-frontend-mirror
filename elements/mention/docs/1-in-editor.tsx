import React from 'react';
import {
  md,
  Example,
  code,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

const MentionProps = require('!!extract-react-types-loader!../src/api/extract-react-types/smart-config-props');
import MentionWithEditorExample from '../examples/14-mention-with-editor-extending-abstract-mention-resource';
const MentionWithEditorExampleSource = require('!!raw-loader!../examples/14-mention-with-editor-extending-abstract-mention-resource');
import SmartMentionWithEditorExample from '../examples/16-smart-mention-resource';
const SmartMentionWithEditorExampleSource = require('!!raw-loader!../examples/16-smart-mention-resource');

export default md`
  ${(<AtlassianInternalWarning />)}

  ## Using Mentions in AK Editor

  ${(
    <>
      <p>
        To use Mention in{' '}
        <a href="https://atlaskit.atlassian.com/packages/editor/editor-core">
          @atlaskit/editor-core
        </a>
        {', '}
        check the 'Editor with mentions' section in editor-core, then follow
        these steps for a more involved tutorial:
      </p>
    </>
  )}

  ### Option 1: Instantiate a MentionResource

  You can choose to instantiate the existing MentionResource that have defaults in place.

  Ensure you plug in the mentionNameResolver to resolve names that have been pre-selected in the Editor
  (else they will show up as @Unknown). You will need a backing service to search and resolve names.

  ${code`
  import { MentionResource, MentionProvider } from '@atlaskit/mention';

  const EditorWithMentions = () => {
    const mentionProvider = new MentionResource({
      url:
        'https://atlassian-product-url.net/get-users', // URL to search users
      productId: 'atlassian-product',
      mentionNameResolver: {
        lookupName: async (id: string) => {
          const resolved = await resolveUser(id); // custom function to resolve IDs to names
          return resolved;
        },
        cacheName: (id: string, name: string) =>
          this.mentionNames.set(id, { id, name, status: MentionNameStatus.OK }), // cache your resolved IDs
      },
    });

    return(
      <Editor
        mentionProvider={Promise.resolve(mentionResourceProvider)} // Plug in your Mentions provider
      />
    )
  }`}

  ### Option 2: Extend and Instantiate an AbstractMentionResource

  Extend the AbstractMentionResource to provide a more customized mentions experience.

  ${(
    <Example
      packageName="@atlaskit/mention"
      Component={MentionWithEditorExample}
      title="Mention With Editor"
      source={MentionWithEditorExampleSource}
    />
  )}


  ### Option 3: Extend and Instantiate a SmartMentionResource


  ${(
    <SectionMessage
      appearance="warning"
      title="The option below is only valid for internal product use"
    >
      The option below will only work in Atlassian internal products.
      Recommended for internal use.
    </SectionMessage>
  )}

    Use the SmartMentionResource, which has defaults set for both the provider and the name resolver.
    The provider will attempt to rerank your suggestions based on the users relevant to you.

    ${(
      <Example
        packageName="@atlaskit/mention"
        Component={SmartMentionWithEditorExample}
        title="Mention With Editor"
        source={SmartMentionWithEditorExampleSource}
      />
    )}

    ${(<Props props={MentionProps} title="SmartMentionsConfig Props" />)}

`;
