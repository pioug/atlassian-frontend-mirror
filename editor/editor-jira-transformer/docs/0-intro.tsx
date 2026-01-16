import React from 'react';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`
${(<AtlassianInternalWarning />)}

This package provides a transformation from ProseMirror Node → wikimarkup and from HTML → ProseMirror Node.

  ## Usage

  Use the encoder with editor-jira-transformer as follows:

  ${code`import { JiraTransformer } from '@atlaskit/editor-jira-transformer';
  import { JiraSchema as schema } from '@atlaskit/editor-common';

  const serializer = new JiraTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);`}

  ${(
		<Example
			packageName="@atlaskit/editor-jira-transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/1-jira-html-input').default}
			title="Jira HTML Input"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/1-jira-html-input')}
		/>
	)}
`;
export default _default_1;
