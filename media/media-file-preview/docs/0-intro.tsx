import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

  A React Hook to fetch and render file previews. It's overloaded with fancy features like SSR, lazy loading, memory cache and local preview.

  ${(
		<SectionMessage title={'DO NOT USE'} appearance="error">
			<p>
				This package is on an initial development stage and needs further testing before it can be
				used by Media consumers
			</p>
		</SectionMessage>
	)}

  ${(
		<Example
			packageName="@atlaskit/media-file-preview"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props
			heading="MediaFilePreview Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
