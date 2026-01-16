import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

const _default_1: any = md`

  A React Hook to fetch and render file previews. It's overloaded with fancy features like SSR, lazy loading, memory cache and local preview.

  ${(
		<SectionMessage title={'DO NOT USE'} appearance="error">
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
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
export default _default_1;
