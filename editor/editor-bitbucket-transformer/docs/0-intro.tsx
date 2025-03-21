import React from 'react';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

This transformer allows encoding ProseMirror Node to markdown or converting Bitbucket HTML to  ProseMirror Node.

  ## Usage

  Use the encoder with editor-bitbucket-transformer as follows:

  ${code`import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
  import { bitbucketSchema as schema } from '@atlaskit/adf-schema/schema-bitbucket';

  const serializer = new BitbucketTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);`}

  ${(
		<Example
			packageName="@atlaskit/editor-bitbucket-transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/2-bitbucket-markdown').default}
			title="Bitbucket Markdown"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/2-bitbucket-markdown')}
		/>
	)}

  ${(
		<Example
			packageName="@atlaskit/editor-bitbucket-transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/1-bitbucket-html').default}
			title="Bitbucket HTML"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/1-bitbucket-html')}
		/>
	)}
`;
