import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  ## What is a Datasource Config Modal

  Datasource Config Modals provide the capability to create a bespoke UI for configuring a "Datasource".

  ## Writing a new Modal
  The smallest Datasource Modal looks like this(this code example can be found under examples/basic-config-modal.tsx), see the explanation in the comments

  ${(
		<Example
			packageName="@atlaskit/link-datasource"
			Component={require('./examples/basic-config-modal').default}
			title="Contributing a new config modal"
			source={require('!!raw-loader!./examples/basic-config-modal')}
		/>
	)}
  `;
