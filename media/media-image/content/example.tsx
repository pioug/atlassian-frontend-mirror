/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
