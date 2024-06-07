/**@jsx jsx */
import { jsx } from '@emotion/react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ${(
		<Example
			packageName="@atlaskit/media-image"
			Component={require('../examples/0-basic-image-example').default}
			title="MediaImage Basic"
			source={require('!!raw-loader!../examples/0-basic-image-example')}
		/>
	)}
`;
