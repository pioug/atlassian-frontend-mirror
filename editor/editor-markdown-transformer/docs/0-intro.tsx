import React from 'react';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

const _default_1: React.ReactElement = md`
${(<AtlassianInternalWarning />)}

A Markdown to ProseMirror Node parser.

## Usage

Use the component in your React app as follows:

  ${code`import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
  const transformer = new MarkdownTransformer(schema);
  transfomer.parse(markdown);`}

  ${(
		<Example
			packageName="@atlaskit/editor-markdown-transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/0-markdown-transformer').default}
			title="Markdown Transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/0-markdown-transformer')}
		/>
	)}
`;
export default _default_1;
