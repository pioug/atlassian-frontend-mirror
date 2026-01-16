import React from 'react';

import { AtlassianInternalWarning, code, Example, md } from '@atlaskit/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`
${(<AtlassianInternalWarning />)}

This transformer allows encoding ProseMirror Node to Slack markdown.

  ## Usage

  Use the encoder with editor-slack-transformer as follows:

  ${code`import { SlackTransformer } from '@atlaskit/editor-slack-transformer';

  const serializer = new SlackTransformer();
  // To encode editor content as Slack markdown
  serializer.encode(editorContent);`}

  ${(
		<Example
			packageName="@atlaskit/editor-slack-transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/0-slack-markdown').default}
			title="ADF to Slack markdown"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/0-slack-markdown')}
		/>
	)}
`;
export default _default_1;
