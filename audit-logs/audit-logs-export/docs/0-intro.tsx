import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`

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
export default _default_1;
