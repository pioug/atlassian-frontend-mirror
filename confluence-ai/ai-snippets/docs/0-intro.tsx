import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  Confluence react component for fetching and rendering ai generated snippets for various content types

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/ai-snippets"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(<Props heading="AiSnippets Props" props={require('!!extract-react-types-loader!../src')} />)}
`;
