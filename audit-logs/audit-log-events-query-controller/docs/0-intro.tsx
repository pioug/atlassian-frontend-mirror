import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

const IntroDoc = (): JSX.Element => md`

  Controller that handles both the basic filter and alql editor

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/audit-log-events-query-controller"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

  ${(
		<Props
			heading="AuditLogEventsQueryController Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;

export default IntroDoc;
