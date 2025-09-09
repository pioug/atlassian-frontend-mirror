import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  Audit-logs export component

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/audit-logs-export"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props heading="AuditLogsExport Props" props={require('!!extract-react-types-loader!../src')} />
	)}
`;
