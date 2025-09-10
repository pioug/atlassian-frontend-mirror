import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  A set of UI components to standardise the display of content in panels across Atlassian products.

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/panel-system"
			Component={require('../examples/00-basic-panel').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/00-basic-panel')}
		/>
	)}

  ${(<Props heading="PanelSystem Props" props={require('!!extract-react-types-loader!../src')} />)}
`;
