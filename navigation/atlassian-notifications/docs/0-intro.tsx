import React from 'react';
import { md, Example, TSProps, code, DevPreviewWarning, type DocsTabs } from '@atlaskit/docs';

const Code: React.JSX.Element = (
	<TSProps props={require('!!@af/ts-morph-loader?export=Notifications!../src/Notifications.tsx')} />
);

const Usage: any = md`
  ${(<DevPreviewWarning />)}

  ## Usage

  ${code`import { Notifications } from '@atlaskit/atlassian-notifications';`}

  ${(
		<Example
			Component={require('../examples/00-basic-usage').default}
			packageName="@atlaskit/atlassian-notifications"
			source={require('!!raw-loader!../examples/00-basic-usage')}
			title="Basic usage"
		/>
	)}
`;

// This is used by the website generator to define which components are tabs, and the tab order.
// If this export is not present, tabs are generated in case-sensitive alphabetical-order (not source-code order).
export const _DocsTabs: DocsTabs = [
	{
		content: Code,
		name: 'Code',
	},
	{
		content: Usage,
		name: 'Usage',
	},
];
