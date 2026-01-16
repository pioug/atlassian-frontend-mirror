import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`

  Modern and fast document viewer

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/media-document-viewer"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props
			heading="MediaDocumentViewer Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
export default _default_1;
