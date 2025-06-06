import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  Experiment to frame auto-upgrade as a grace period rather than a trial to reduce customer confusion and increase retention

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/auto-upgrade-not-a-trial"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props
			heading="AutoUpgradeNotATrial Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
