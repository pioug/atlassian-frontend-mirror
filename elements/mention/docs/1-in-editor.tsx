import Link from '@atlaskit/link';
import React from 'react';
import { Text } from '@atlaskit/primitives/compiled';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

import MentionWithEditorExample from '../examples/14-mention-with-editor-extending-abstract-mention-resource';
const MentionWithEditorExampleSource = require('!!raw-loader!../examples/14-mention-with-editor-extending-abstract-mention-resource');

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  ## Using Mentions in AK Editor

  ${(
		<>
			<Text as="p">
				To use Mention in <Link href="/packages/editor/editor-core">@atlaskit/editor-core</Link>
				{', '}
				check the 'Editor with mentions' section in editor-core, then follow these steps for a more
				involved tutorial:
			</Text>
		</>
	)}

  ### Option 1: Instantiate a \`MentionResource\`

  You can choose to instantiate the existing MentionResource that have defaults in place.

  Ensure you plug in the \`mentionNameResolver\` to resolve names that have been pre-selected in the Editor
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

  ### Option 2: Extend and instantiate an \`AbstractMentionResource\`

  Extend the \`AbstractMentionResource\` to provide a more customized mentions experience.

  ${(
		<Example
			packageName="@atlaskit/mention"
			Component={MentionWithEditorExample}
			title="Mention With Editor"
			source={MentionWithEditorExampleSource}
		/>
	)}

  ### Option 3: Extend and instantiate a \`SmartMentionResource\`

  The Smart Mention Resource is now available to use at @atlassian/smart-mention-resource

  This is only available for internal use.

`;
export default _default_1;
