import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`

  This package is going to be the tab selector component for us to be able to render the main content of the Audit Log page which will become part of the Audit Log Query Experience project.

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/audit-log-tabs"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props
			heading="AuditLogTabs Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
export default _default_1;
