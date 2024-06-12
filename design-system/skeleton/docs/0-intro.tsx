import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  A skeleton acts as a placeholder for content, usually while the content loads.

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/skeleton"
			Component={require('../examples/constellation/skeleton-basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/all')}
		/>
	)}

  ${(<Props heading="Skeleton Props" props={require('!!extract-react-types-loader!../src')} />)}
`;
