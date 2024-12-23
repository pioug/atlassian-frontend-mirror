import React from 'react';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

This package provides a transformer for ProseMirror Node <-> Wikimarkup conversion.
  ## Usage

  Use the component in your React app as follows to encode ProseMirror node to Wikimarkup:

  ${code`import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';

  const transformer = new WikiMarkupTransformer(schema);
  const wikimarkupString = transformer.encode(pmNode); // A Wikimarkup string representing the Prosemirror node output`}

  Use the component in your React app as follows to parse Wikimarkup to ProseMirror node:

  ${code`import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';

  const transformer = new WikiMarkupTransformer(schema);
  const pmNode = transformer.parse(wikiMarkup); // A prosemirror node is output`}


  ${(
		<Example
			packageName="@atlaskit/editor-wikimarkup-transformer"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			Component={require('../examples/0-adf-to-wikimarkup').default}
			title="ADF to Wikimarkup"
			// Ignored via go/ees005
			// eslint-disable-next-line import/no-commonjs
			source={require('!!raw-loader!../examples/0-adf-to-wikimarkup')}
		/>
	)}
`;
