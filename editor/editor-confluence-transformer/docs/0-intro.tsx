import React from 'react';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`
${(<AtlassianInternalWarning />)}

This transformer allows encoding ProseMirror Node in CXHTML or converting Confluence HTML to ProseMirror Node.

## Usage

  Use the encoder with editor-confluence-transformer as follows:

  ${code`import { ConfluenceTransformer } from '@atlaskit/editor-confluence-transformer';
  import { confluenceSchema as schema } from '@atlaskit/adf-schema/schema-confluence';

  const serializer = new ConfluenceTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);`}

  ${(
		<Example
			packageName="@atlaskit/editor-confluence-transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/0-cxhtml-transformer').default}
			title="Cxhtml Transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/0-cxhtml-transformer')}
		/>
	)}
`;
export default _default_1;
