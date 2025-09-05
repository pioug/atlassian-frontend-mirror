import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  TODO

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/tile"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(<Props heading="Tile Props" props={require('!!extract-react-types-loader!../src')} />)}
`;
